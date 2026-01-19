// Bingo Cards List Page
import {
  getOpenMojiHTML,
  formatDate,
  generateUUID,
  getCurrentTimestamp,
} from '../utils.js';
import { showConfirmDialog, showAlertDialog } from '../components/Modal.js';

export class BingoCardsListPage {
  constructor(state, params) {
    this.state = state;
    this.params = params;
    this.title = 'My Bingo Cards';
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page bingo-cards-list-page';

    const cards = this.getCardsForCurrentProfile();
    const maxCards = 40;
    const canCreateMore = cards.length < maxCards;

    if (cards.length === 0) {
      container.innerHTML = this.renderEmptyState();
    } else {
      container.innerHTML = this.renderCardsList(
        cards,
        canCreateMore,
        maxCards
      );
    }

    return container;
  }

  renderEmptyState() {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">🎯</div>
        <h2 class="empty-state-title">No Bingo Cards Yet</h2>
        <p class="empty-state-description">
          Create your first bingo card to start tracking your resolutions in a fun way!
        </p>
        <a href="#/bingo-card/new" class="btn btn-primary btn-lg">
          ${getOpenMojiHTML('2795', 'plus')} Create Your First Card
        </a>
      </div>
    `;
  }

  renderCardsList(cards, canCreateMore, maxCards) {
    // Sort cards by updated date (most recent first)
    const sortedCards = [...cards].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    return `
      <div class="page-header">
        <h1 class="page-title">My Bingo Cards</h1>
        <p class="page-description">
          ${cards.length} of ${maxCards} cards created
        </p>
      </div>

      <div class="action-bar">
        <div></div>
        ${
          canCreateMore
            ? `<a href="#/bingo-card/new" class="btn btn-primary">
               ${getOpenMojiHTML('2795', 'plus')} Create New Card
             </a>`
            : `<button class="btn btn-primary" disabled title="Maximum ${maxCards} cards reached">
               ${getOpenMojiHTML('2795', 'plus')} Create New Card
             </button>
             <p class="text-danger text-sm">You've reached the maximum of ${maxCards} cards</p>`
        }
      </div>

      <div class="bingo-cards-grid" id="cards-grid">
        ${sortedCards.map((card) => this.renderCardThumbnail(card)).join('')}
      </div>
    `;
  }

  renderCardThumbnail(card) {
    const themeIcons = {
      flowers: '1F338', // cherry blossom
      cute: '1F496', // sparkling heart
      science: '1F52C', // microscope
      mathy: '1F4D0', // triangular ruler
      animals: '1F43E', // paw prints
    };

    const icon = themeIcons[card.design] || '1F3AF'; // bullseye as fallback
    const resolutionCount = card.squares.filter((s) => s.resolutionId).length;

    return `
      <div class="bingo-card-thumbnail" data-card-id="${card.id}">
        <div class="thumbnail-preview theme-preview-${card.design}">
          ${getOpenMojiHTML(icon, card.design)}
        </div>
        <div class="thumbnail-info">
          <h3 class="thumbnail-title">${card.saveName}</h3>
          <p class="text-muted text-sm">
            ${resolutionCount} resolutions • ${card.design} theme
          </p>
          <p class="text-muted text-xs">
            Updated ${formatDate(card.updatedAt)}
          </p>
        </div>
        <div class="thumbnail-actions">
          <a href="#/bingo-card/${card.id}" class="btn btn-sm btn-primary">
            ${getOpenMojiHTML('1F441', 'eye')} View
          </a>
          <button class="btn btn-sm btn-outline" data-action="copy">
            ${getOpenMojiHTML('1F4CB', 'clipboard')} Copy
          </button>
          <button class="btn btn-sm btn-outline" data-action="edit">
            ${getOpenMojiHTML('270F', 'pencil')} Edit
          </button>
          <button class="btn btn-sm btn-danger" data-action="delete">
            ${getOpenMojiHTML('1F5D1', 'wastebasket')} Delete
          </button>
        </div>
      </div>
    `;
  }

  getCardsForCurrentProfile() {
    const currentProfileId = this.state.get('currentProfileId');
    const allCards = this.state.get('bingoCards') || [];
    return allCards.filter((c) => c.profileId === currentProfileId);
  }

  mount() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const cardsGrid = document.getElementById('cards-grid');
    if (!cardsGrid) return;

    cardsGrid.addEventListener('click', async (e) => {
      const button = e.target.closest('button[data-action]');
      if (!button) return;

      const thumbnail = button.closest('.bingo-card-thumbnail');
      const cardId = thumbnail.dataset.cardId;
      const action = button.dataset.action;

      switch (action) {
        case 'copy':
          await this.copyCard(cardId);
          break;
        case 'edit':
          this.editCard(cardId);
          break;
        case 'delete':
          await this.deleteCard(cardId);
          break;
      }
    });
  }

  async copyCard(cardId) {
    const cards = this.state.get('bingoCards') || [];
    const originalCard = cards.find((c) => c.id === cardId);

    if (!originalCard) {
      await showAlertDialog({
        title: 'Error',
        message: 'Card not found.',
      });
      return;
    }

    // Check if at max limit
    const currentProfileCards = this.getCardsForCurrentProfile();
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
      ...originalCard,
      id: generateUUID(),
      saveName: `${originalCard.saveName} (Copy)`,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      squares: originalCard.squares.map((s) => ({ ...s })), // Deep copy squares
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

  editCard(cardId) {
    window.location.hash = `#/bingo-card/${cardId}/edit`;
  }

  async deleteCard(cardId) {
    const cards = this.state.get('bingoCards') || [];
    const card = cards.find((c) => c.id === cardId);

    if (!card) return;

    const confirmed = await showConfirmDialog({
      title: 'Delete Card',
      message: `Are you sure you want to delete "${card.saveName}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      dangerous: true,
    });

    if (confirmed) {
      const updatedCards = cards.filter((c) => c.id !== cardId);
      this.state.set('bingoCards', updatedCards);

      // Re-render the page
      const container = document.querySelector('.bingo-cards-list-page');
      if (container) {
        const newContent = await this.render();
        container.innerHTML = newContent.innerHTML;
        this.mount();
      }
    }
  }

  unmount() {
    // Cleanup
  }
}
