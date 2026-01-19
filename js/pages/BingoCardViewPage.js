// Bingo Card View Page - View and print a single card
import {
  getOpenMojiHTML,
  formatDate,
  truncateText,
  generateUUID,
  getCurrentTimestamp,
} from '../utils.js';
import { showConfirmDialog, showAlertDialog } from '../components/Modal.js';

export class BingoCardViewPage {
  constructor(state, params) {
    this.state = state;
    this.params = params;
    this.cardId = params.id;
    this.card = null;
    this.cardSize = 'full';
    this.colorMode = 'color';

    this.loadCard();
  }

  loadCard() {
    const cards = this.state.get('bingoCards') || [];
    this.card = cards.find((c) => c.id === this.cardId);

    if (!this.card) {
      // Card not found, redirect to list
      window.location.hash = '#/bingo-cards';
    }
  }

  async render() {
    if (!this.card) {
      const container = document.createElement('div');
      container.className = 'page bingo-card-view-page';
      container.innerHTML = '<p>Card not found...</p>';
      return container;
    }

    const container = document.createElement('div');
    container.className = 'page bingo-card-view-page';
    container.innerHTML = `
      <div class="page-header">
        <div class="flex justify-between align-center">
          <div>
            <h1 class="page-title">${this.card.saveName}</h1>
            <p class="page-description">Last updated ${formatDate(
              this.card.updatedAt
            )}</p>
          </div>
          <a href="#/bingo-cards" class="btn btn-outline">
            ${getOpenMojiHTML('2190', 'leftwards arrow')} Back to Cards
          </a>
        </div>
      </div>

      <div class="bingo-card-viewer">
        <div class="card bingo-card-display" id="card-display">
          ${this.renderBingoCard()}
        </div>

        <div class="print-options card">
          <h3 class="mb-md">Print Options</h3>
          <div class="print-options-grid">
            <div class="form-group">
              <label class="form-label">Card Size</label>
              <select class="form-select" id="size-select">
                <option value="full">Full Page (8.5"×11")</option>
                <option value="5x5">5" × 5"</option>
                <option value="6x6">6" × 6"</option>
                <option value="7x7">7" × 7"</option>
              </select>
              <p class="text-muted text-sm mt-xs">Smaller sizes can be printed and cut from 8.5"×11" paper</p>
            </div>
            <div class="form-group">
              <label class="form-label">Color Mode</label>
              <select class="form-select" id="color-select">
                <option value="color">Color</option>
                <option value="grayscale">Grayscale</option>
              </select>
            </div>
          </div>
          <div class="flex justify-center mt-lg">
            <button class="btn btn-primary btn-lg" id="print-btn">
              ${getOpenMojiHTML('1F5A8', 'printer')} Print Card
            </button>
          </div>
        </div>

        <div class="card-actions card">
          <h3 class="mb-md">Card Actions</h3>
          <div class="flex flex-col gap-md">
            <a href="#/bingo-card/${
              this.card.id
            }/edit" class="btn btn-secondary">
              ${getOpenMojiHTML('270F', 'pencil')} Edit Card
            </a>
            <button class="btn btn-outline" id="copy-btn">
              ${getOpenMojiHTML('1F4CB', 'clipboard')} Make a Copy
            </button>
            <button class="btn btn-danger" id="delete-btn">
              ${getOpenMojiHTML('1F5D1', 'wastebasket')} Delete Card
            </button>
          </div>
        </div>
      </div>
    `;

    return container;
  }

  renderBingoCard() {
    const resolutions = this.state.get('resolutions') || [];

    return `
      <div class="bingo-card theme-${this.card.design} font-${
      this.card.font
    } size-${this.cardSize} mode-${this.colorMode}" 
           id="bingo-card-printable">
        <h2 class="bingo-card-title">${this.card.title}</h2>
        <div class="bingo-grid">
          ${this.card.squares
            .map((square, index) => {
              const resolution = resolutions.find(
                (r) => r.id === square.resolutionId
              );
              const text =
                square.bingoPhrase ||
                (resolution ? truncateText(resolution.text, 40) : null);
              const isFree = !square.resolutionId;

              return `
              <div class="bingo-square ${isFree ? 'free-square' : ''}" 
                   data-position="${index}">
                ${isFree ? this.getFreeSquareIcon() : text}
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  getFreeSquareIcon() {
    const icons = {
      flowers: '🌸 FREE',
      cute: '⭐ FREE',
      science: '🔬 FREE',
      mathy: 'π FREE',
      animals: '🐾 FREE',
    };
    return icons[this.card.design] || '⭐ FREE';
  }

  mount() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Size and color mode selects
    const sizeSelect = document.getElementById('size-select');
    const colorSelect = document.getElementById('color-select');

    sizeSelect?.addEventListener('change', (e) => {
      this.cardSize = e.target.value;
      this.updateCardDisplay();
    });

    colorSelect?.addEventListener('change', (e) => {
      this.colorMode = e.target.value;
      this.updateCardDisplay();
    });

    // Print button
    document.getElementById('print-btn')?.addEventListener('click', () => {
      this.printCard();
    });

    // Copy button
    document.getElementById('copy-btn')?.addEventListener('click', () => {
      this.copyCard();
    });

    // Delete button
    document.getElementById('delete-btn')?.addEventListener('click', () => {
      this.deleteCard();
    });
  }

  updateCardDisplay() {
    const cardDisplay = document.getElementById('card-display');
    if (cardDisplay) {
      cardDisplay.innerHTML = this.renderBingoCard();
    }
  }

  printCard() {
    // Trigger browser print dialog
    window.print();
  }

  async copyCard() {
    const cards = this.state.get('bingoCards') || [];
    const currentProfileCards = cards.filter(
      (c) => c.profileId === this.state.get('currentProfileId')
    );

    if (currentProfileCards.length >= 40) {
      await showAlertDialog({
        title: 'Maximum Reached',
        message:
          "You've reached the maximum of 40 cards. Please delete some cards first.",
      });
      return;
    }

    // Create a copy with new ID and timestamps
    const copiedCard = {
      ...this.card,
      id: generateUUID(),
      saveName: `${this.card.saveName} (Copy)`,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      squares: this.card.squares.map((s) => ({ ...s })), // Deep copy squares
    };

    cards.push(copiedCard);
    this.state.set('bingoCards', cards);

    await showAlertDialog({
      title: 'Card Copied',
      message: `"${copiedCard.saveName}" has been created. You can now edit it.`,
    });

    // Redirect to edit the copy
    window.location.hash = `#/bingo-card/${copiedCard.id}/edit`;
  }

  async deleteCard() {
    const confirmed = await showConfirmDialog({
      title: 'Delete Card',
      message: `Are you sure you want to delete "${this.card.saveName}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      dangerous: true,
    });

    if (confirmed) {
      const cards = this.state.get('bingoCards') || [];
      const updatedCards = cards.filter((c) => c.id !== this.card.id);
      this.state.set('bingoCards', updatedCards);

      await showAlertDialog({
        title: 'Card Deleted',
        message: `"${this.card.saveName}" has been deleted.`,
      });

      window.location.hash = '#/bingo-cards';
    }
  }

  unmount() {
    // Cleanup
  }
}
