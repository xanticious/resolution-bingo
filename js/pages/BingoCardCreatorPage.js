// Bingo Card Creator Page
import {
  getOpenMojiHTML,
  generateUUID,
  getCurrentTimestamp,
  truncateText,
} from '../utils.js';
import {
  Modal,
  showConfirmDialog,
  showAlertDialog,
} from '../components/Modal.js';
import { ResolutionSelectorModal } from '../components/ResolutionSelectorModal.js';

export class BingoCardCreatorPage {
  constructor(state, params) {
    this.state = state;
    this.params = params;
    this.isEditMode = !!params.id;
    this.title = this.isEditMode ? 'Edit Bingo Card' : 'Create Bingo Card';

    // Initialize card data
    if (this.isEditMode) {
      this.loadExistingCard(params.id);
    } else {
      this.initializeNewCard();
    }

    // Filters
    this.filters = {
      frequency: [],
      excitement: [],
      categories: [],
    };
  }

  loadExistingCard(cardId) {
    const cards = this.state.get('bingoCards') || [];
    const card = cards.find((c) => c.id === cardId);

    if (card) {
      this.cardData = { ...card };
    } else {
      // Card not found, redirect
      window.location.hash = '#/bingo-cards';
    }
  }

  initializeNewCard() {
    this.cardData = {
      id: generateUUID(),
      profileId: this.state.get('currentProfileId'),
      saveName: '',
      title: '2026 Bingo',
      design: 'botanical',
      font: 'handwriting',
      squares: Array.from({ length: 25 }, (_, i) => ({
        position: i,
        resolutionId: null,
        bingoPhrase: null,
      })),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page bingo-creator-page';

    const selectedCount = this.cardData.squares.filter(
      (s) => s.resolutionId,
    ).length;
    const maxCards = 40;
    const currentCards = this.getCurrentProfileCards().length;
    const canSave = this.isEditMode || currentCards < maxCards;

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">${this.title}</h1>
        <p class="page-description">Design your custom bingo card with up to 25 resolutions</p>
      </div>

      <div class="bingo-creator-centered">
        <div class="creator-config-panel">
          <!-- Card Details -->
          <div class="config-section">
            <h3 class="section-title">Card Details</h3>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Save Name <span class="text-danger">*</span></label>
                <input type="text" id="save-name-input" class="form-input" 
                  placeholder="My 2026 Goals" maxlength="30" 
                  value="${this.cardData.saveName}">
                <span class="char-counter" id="save-name-counter">${
                  this.cardData.saveName.length
                } / 30</span>
              </div>
              <div class="form-group">
                <label class="form-label">Printed Title <span class="text-danger">*</span></label>
                <input type="text" id="title-input" class="form-input" 
                  placeholder="2026 Bingo" maxlength="30"
                  value="${this.cardData.title}">
                <span class="char-counter" id="title-counter">${
                  this.cardData.title.length
                } / 30</span>
              </div>
            </div>
          </div>

          <!-- Resolution Selection -->
          <div class="config-section">
            <h3 class="section-title">Resolutions</h3>
            <div class="resolution-selection-summary">
              <div class="selection-info">
                <strong>${selectedCount} / 25</strong> resolutions selected
                ${
                  selectedCount < 25
                    ? '<span class="text-muted">(remaining will be Free squares)</span>'
                    : ''
                }
              </div>
              <button class="btn btn-primary" id="select-resolutions-btn">
                ${getOpenMojiHTML('1F4CB', 'clipboard')} Select Resolutions
              </button>
            </div>
            ${selectedCount > 0 ? this.renderSelectedResolutionsSummary() : ''}
          </div>

          <!-- Visual Style -->
          <div class="config-section">
            <h3 class="section-title">Visual Style</h3>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Design Theme</label>
                <select class="form-select" id="theme-select">
                  <option value="botanical" ${
                    this.cardData.design === 'botanical' ? 'selected' : ''
                  }>🌿 Botanical Garden</option>
                  <option value="cosmic" ${
                    this.cardData.design === 'cosmic' ? 'selected' : ''
                  }>🌟 Cosmic Explorer</option>
                  <option value="ocean" ${
                    this.cardData.design === 'ocean' ? 'selected' : ''
                  }>🌊 Ocean Waves</option>
                  <option value="retro" ${
                    this.cardData.design === 'retro' ? 'selected' : ''
                  }>⚡ Retro Arcade</option>
                  <option value="minimal" ${
                    this.cardData.design === 'minimal' ? 'selected' : ''
                  }>⬜ Modern Minimal</option>
                  <option value="doodles" ${
                    this.cardData.design === 'doodles' ? 'selected' : ''
                  }>✨ Whimsical Doodles</option>
                  <option value="zen" ${
                    this.cardData.design === 'zen' ? 'selected' : ''
                  }>☯️ Zen Garden</option>
                  <option value="bold" ${
                    this.cardData.design === 'bold' ? 'selected' : ''
                  }>🔥 Bold & Bright</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Font Style</label>
                <select class="form-select" id="font-select">
                  <option value="handwriting" ${
                    this.cardData.font === 'handwriting' ? 'selected' : ''
                  }>✍️ Cheerful Handwriting</option>
                  <option value="headlines" ${
                    this.cardData.font === 'headlines' ? 'selected' : ''
                  }>📰 Bold Headlines</option>
                  <option value="elegant" ${
                    this.cardData.font === 'elegant' ? 'selected' : ''
                  }>💃 Elegant Script</option>
                  <option value="quirky" ${
                    this.cardData.font === 'quirky' ? 'selected' : ''
                  }>🎈 Quirky Fun</option>
                  <option value="modern" ${
                    this.cardData.font === 'modern' ? 'selected' : ''
                  }>🏢 Modern Sans</option>
                  <option value="typewriter" ${
                    this.cardData.font === 'typewriter' ? 'selected' : ''
                  }>⌨️ Vintage Typewriter</option>
                  <option value="comic" ${
                    this.cardData.font === 'comic' ? 'selected' : ''
                  }>😄 Comic Fun</option>
                  <option value="serif" ${
                    this.cardData.font === 'serif' ? 'selected' : ''
                  }>📖 Refined Serif</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Preview -->
        <div class="creator-preview-panel">
          <div class="preview-header">
            <h3>Live Preview</h3>
            <p class="text-muted text-sm">Click any square to edit or drag to reorder</p>
          </div>
          <div class="bingo-preview-container" id="bingo-preview">
            ${this.renderBingoPreview()}
          </div>
        </div>

        <!-- Actions -->
        <div class="creator-actions">
          <button class="btn btn-secondary" id="shuffle-btn">
            ${getOpenMojiHTML('1F500', 'shuffle')} Shuffle Squares
          </button>
          <div class="flex-spacer"></div>
          <a href="#/bingo-cards" class="btn btn-outline">Cancel</a>
          <button class="btn btn-primary btn-lg" id="save-btn" ${
            !canSave ? 'disabled' : ''
          }>
            ${getOpenMojiHTML('1F4BE', 'floppy disk')} ${
              this.isEditMode ? 'Update' : 'Save'
            } Card
          </button>
          ${
            !canSave
              ? `<p class="text-danger text-sm">You've reached the maximum of ${maxCards} cards</p>`
              : ''
          }
        </div>
      </div>
    `;

    return container;
  }

  renderSelectedResolutionsSummary() {
    const selectedResolutions = this.cardData.squares
      .filter((s) => s.resolutionId)
      .map((s) => {
        const res = (this.state.get('resolutions') || []).find(
          (r) => r.id === s.resolutionId,
        );
        return res;
      })
      .filter((r) => r); // Remove null entries

    if (selectedResolutions.length === 0) {
      return '';
    }

    return `
      <div class="selected-resolutions-tags">
        ${selectedResolutions
          .map(
            (res) => `
          <span class="resolution-tag">
            ${truncateText(res.text, 40)}
            <button class="tag-remove" data-resolution-id="${res.id}" title="Remove">×</button>
          </span>
        `,
          )
          .join('')}
      </div>
    `;
  }

  renderBingoPreview() {
    const resolutions = this.state.get('resolutions') || [];

    return `
      <div class="bingo-card theme-${this.cardData.design} font-${
        this.cardData.font
      }" id="bingo-card">
        <h2 class="bingo-card-title">${this.cardData.title || '2026 Bingo'}</h2>
        <div class="bingo-grid" id="bingo-grid">
          ${this.cardData.squares
            .map((square, index) => {
              const resolution = resolutions.find(
                (r) => r.id === square.resolutionId,
              );
              const text =
                square.bingoPhrase ||
                (resolution ? truncateText(resolution.text, 40) : null);
              const isFree = !square.resolutionId;

              return `
              <div class="bingo-square ${isFree ? 'free-square' : ''}" 
                   data-position="${index}"
                   draggable="${!isFree}">
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
    const emojiSize = '1em';
    const smallSize = '0.8em';
    const icons = {
      // Botanical: Herbs in diamond pattern around FREE
      botanical: `<div style="position: relative; display: inline-block;">
        <div style="position: absolute; top: -1.3em; left: 50%; transform: translateX(-50%);">
          <img src="https://openmoji.org/data/color/svg/1F33F.svg" alt="" style="width: ${emojiSize}; height: ${emojiSize};" />
        </div>
        <div style="display: flex; align-items: center; gap: 0em;">
          <img src="https://openmoji.org/data/color/svg/1F33F.svg" alt="" style="width: ${emojiSize}; height: ${emojiSize}; transform: scaleX(-1);" />
          <span style="padding: 0 0.2em;">FREE</span>
          <img src="https://openmoji.org/data/color/svg/1F33F.svg" alt="" style="width: ${emojiSize}; height: ${emojiSize};" />
        </div>
        <div style="position: absolute; bottom: -1.5em; left: 50%; transform: translateX(-50%);">
          <img src="https://openmoji.org/data/color/svg/1F33F.svg" alt="" style="width: ${emojiSize}; height: ${emojiSize}; transform: rotate(180deg);" />
        </div>
      </div>`,

      // Cosmic: Stars and sparkles in corners
      cosmic: `<div style="position: relative; display: inline-block;">
        <div style="position: absolute; top: -1em; left: 0em;">
          <img src="https://openmoji.org/data/color/svg/2B50.svg" alt="" style="width: ${smallSize}; height: ${smallSize};" />
        </div>
        <div style="position: absolute; top: -1.5em; right: -0em;">
          <img src="https://openmoji.org/data/color/svg/2728.svg" alt="" style="width: ${smallSize}; height: ${smallSize};" />
        </div>
        <span style="padding: 0.5em 1em;">FREE</span>
        <div style="position: absolute; bottom: -1.5em; left: 0em;">
          <img src="https://openmoji.org/data/color/svg/2728.svg" alt="" style="width: ${smallSize}; height: ${smallSize}; transform: rotate(180deg);" />
        </div>
        <div style="position: absolute; bottom: -1em; right: -0em;">
          <img src="https://openmoji.org/data/color/svg/2B50.svg" alt="" style="width: ${smallSize}; height: ${smallSize}; transform: rotate(180deg);" />
        </div>
      </div>`,

      // Ocean: Waves flowing left and right (mirrored)
      ocean: `<div style="display: flex; align-items: center; gap: .1em;">
        <img src="https://openmoji.org/data/color/svg/1F30A.svg" alt="" style="width: ${emojiSize}; height: ${emojiSize}; transform: scaleX(-1)" />
        <span>FREE</span>
        <img src="https://openmoji.org/data/color/svg/1F30A.svg" alt="" style="width: ${emojiSize}; height: ${emojiSize};" />
      </div>`,

      // Retro: Clean text only
      retro: 'FREE',

      // Minimal: Clean text only
      minimal: 'FREE',

      // Doodles: Stars and sparkles scattered playfully
      doodles: `<div style="position: relative; display: inline-block;">
        <div style="position: absolute; top: -1em; left: 0;">
          <img src="https://openmoji.org/data/color/svg/2B50.svg" alt="" style="width: ${smallSize}; height: ${smallSize};" />
        </div>
        <div style="position: absolute; top: -0.5em; right: -0.2em;">
          <img src="https://openmoji.org/data/color/svg/2728.svg" alt="" style="width: ${smallSize}; height: ${smallSize};" />
        </div>
        <span style="padding: 0.5em 0.8em;">FREE</span>
        <div style="position: absolute; bottom: -0.5em; left: -0.2em;">
          <img src="https://openmoji.org/data/color/svg/2728.svg" alt="" style="width: ${smallSize}; height: ${smallSize};" />
        </div>
        <div style="position: absolute; bottom: -1em; right: 0;">
          <img src="https://openmoji.org/data/color/svg/2B50.svg" alt="" style="width: ${smallSize}; height: ${smallSize};" />
        </div>
      </div>`,

      // Zen: Clean text with background yin-yang
      zen: ' ',

      // Bold: Clean text only
      bold: 'FREE',
    };
    return icons[this.cardData.design] || 'FREE';
  }

  getCurrentProfileCards() {
    const currentProfileId = this.state.get('currentProfileId');
    return (this.state.get('bingoCards') || []).filter(
      (c) => c.profileId === currentProfileId,
    );
  }

  getAllProfileResolutions() {
    const currentProfileId = this.state.get('currentProfileId');
    return (this.state.get('resolutions') || [])
      .filter((r) => r.profileId === currentProfileId)
      .sort((a, b) => a.order - b.order);
  }

  getCurrentProfileCategories() {
    const currentProfileId = this.state.get('currentProfileId');
    return (this.state.get('lifeCategories') || [])
      .filter((c) => c.profileId === currentProfileId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getCategoryById(id) {
    return (this.state.get('lifeCategories') || []).find((c) => c.id === id);
  }

  getExcitementLabel(level) {
    const labels = {
      1: '😰 Dreading',
      2: '😕 Not fond of',
      3: '😐 Neutral',
      4: '🙂 Feeling good',
      5: '😄 Really excited',
    };
    return labels[level] || 'Unknown';
  }

  getFrequencyText(frequency) {
    if (frequency.type === 'single') return 'Once';
    if (frequency.type === 'count') return `${frequency.count}x total`;
    if (frequency.type === 'rate') {
      return `${frequency.count}x/${frequency.duration}`;
    }
    return '';
  }

  mount() {
    this.setupEventListeners();
    this.setupDragAndDrop();
    this.setupSquareClickHandler();
  }

  setupEventListeners() {
    // Card details inputs
    const saveNameInput = document.getElementById('save-name-input');
    const titleInput = document.getElementById('title-input');
    const saveNameCounter = document.getElementById('save-name-counter');
    const titleCounter = document.getElementById('title-counter');

    saveNameInput?.addEventListener('input', (e) => {
      this.cardData.saveName = e.target.value;
      saveNameCounter.textContent = `${e.target.value.length} / 30`;
      if (e.target.value.length > 30) {
        e.target.classList.add('error');
      } else {
        e.target.classList.remove('error');
      }
    });

    titleInput?.addEventListener('input', (e) => {
      this.cardData.title = e.target.value;
      titleCounter.textContent = `${e.target.value.length} / 30`;
      if (e.target.value.length > 30) {
        e.target.classList.add('error');
      } else {
        e.target.classList.remove('error');
      }
      // Update preview
      const titleElement = document.querySelector('.bingo-card-title');
      if (titleElement) {
        titleElement.textContent = e.target.value || '2026 Bingo';
      }
    });

    // Theme and font selects
    const themeSelect = document.getElementById('theme-select');
    const fontSelect = document.getElementById('font-select');

    themeSelect?.addEventListener('change', (e) => {
      this.cardData.design = e.target.value;
      this.updatePreview();
    });

    fontSelect?.addEventListener('change', (e) => {
      this.cardData.font = e.target.value;
      this.updatePreview();
    });

    // Select Resolutions button
    document
      .getElementById('select-resolutions-btn')
      ?.addEventListener('click', () => {
        this.openResolutionSelector();
      });

    // Remove resolution tags
    document
      .querySelector('.selected-resolutions-tags')
      ?.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.tag-remove');
        if (removeBtn) {
          const resolutionId = removeBtn.dataset.resolutionId;
          this.removeResolutionFromCard(resolutionId);
        }
      });

    // Shuffle button
    document.getElementById('shuffle-btn')?.addEventListener('click', () => {
      this.shuffleSquares();
    });

    // Save button
    document.getElementById('save-btn')?.addEventListener('click', () => {
      this.saveCard();
    });
  }

  setupSquareClickHandler() {
    // Click on squares to edit
    document.getElementById('bingo-grid')?.addEventListener('click', (e) => {
      // Don't handle click if we just finished dragging
      if (this.isDragging && this.isDragging()) {
        return;
      }

      const square = e.target.closest('.bingo-square');
      if (square && !square.classList.contains('free-square')) {
        const position = parseInt(square.dataset.position);
        this.editSquare(position);
      }
    });
  }

  openResolutionSelector() {
    const selectedResolutionIds = this.cardData.squares
      .filter((s) => s.resolutionId)
      .map((s) => s.resolutionId);

    const modal = new ResolutionSelectorModal({
      state: this.state,
      selectedResolutions: selectedResolutionIds,
      onSelectionChange: (newSelection) => {
        this.updateResolutionSelection(newSelection);
      },
    });

    modal.open();
  }

  updateResolutionSelection(selectedResolutionIds) {
    // Clear all current selections
    this.cardData.squares.forEach((square) => {
      square.resolutionId = null;
      square.bingoPhrase = null;
    });

    // Add new selections
    selectedResolutionIds.forEach((resId, index) => {
      if (index < 25) {
        this.cardData.squares[index].resolutionId = resId;
        this.cardData.squares[index].bingoPhrase = null;
      }
    });

    this.updatePreview();
    this.refreshPage();
  }

  refreshPage() {
    // Re-render the resolution summary section
    const summaryContainer = document.querySelector(
      '.resolution-selection-summary',
    );
    if (summaryContainer) {
      const selectedCount = this.cardData.squares.filter(
        (s) => s.resolutionId,
      ).length;
      summaryContainer.innerHTML = `
        <div class="selection-info">
          <strong>${selectedCount} / 25</strong> resolutions selected
          ${selectedCount < 25 ? '<span class="text-muted">(remaining will be Free squares)</span>' : ''}
        </div>
        <button class="btn btn-primary" id="select-resolutions-btn">
          ${getOpenMojiHTML('1F4CB', 'clipboard')} Select Resolutions
        </button>
      `;

      // Re-attach event listener
      document
        .getElementById('select-resolutions-btn')
        ?.addEventListener('click', () => {
          this.openResolutionSelector();
        });
    }

    // Update or add the selected resolutions tags
    const configSection = summaryContainer?.closest('.config-section');
    if (configSection) {
      let tagsContainer = configSection.querySelector(
        '.selected-resolutions-tags',
      );
      const newTagsHTML = this.renderSelectedResolutionsSummary();

      if (tagsContainer) {
        if (newTagsHTML) {
          tagsContainer.outerHTML = newTagsHTML;
        } else {
          tagsContainer.remove();
        }
      } else if (newTagsHTML) {
        configSection.insertAdjacentHTML('beforeend', newTagsHTML);
      }

      // Re-attach remove tag listeners
      configSection
        .querySelector('.selected-resolutions-tags')
        ?.addEventListener('click', (e) => {
          const removeBtn = e.target.closest('.tag-remove');
          if (removeBtn) {
            const resolutionId = removeBtn.dataset.resolutionId;
            this.removeResolutionFromCard(resolutionId);
          }
        });
    }
  }

  updateFilters() {
    this.filters.frequency = Array.from(
      document.querySelectorAll('.filter-frequency:checked'),
    ).map((cb) => cb.value);

    this.filters.excitement = Array.from(
      document.querySelectorAll('.filter-excitement:checked'),
    ).map((cb) => parseInt(cb.value));

    this.filters.categories = Array.from(
      document.querySelectorAll('.filter-category:checked'),
    ).map((cb) => cb.value);

    this.refreshResolutionsList();
  }

  clearFilters() {
    document
      .querySelectorAll(
        '.filter-frequency, .filter-excitement, .filter-category',
      )
      .forEach((cb) => (cb.checked = false));
    this.filters = { frequency: [], excitement: [], categories: [] };
    this.refreshResolutionsList();
  }

  refreshResolutionsList() {
    const resolutions = this.getFilteredResolutions();
    const listContainer = document.getElementById('resolutions-list');
    if (listContainer) {
      listContainer.innerHTML = this.renderResolutionsList(resolutions);
    }
  }

  addResolutionToCard(resolutionId) {
    // Find first empty square
    const emptySquare = this.cardData.squares.find((s) => !s.resolutionId);
    if (emptySquare) {
      emptySquare.resolutionId = resolutionId;
      emptySquare.bingoPhrase = null; // Will use resolution text by default
      this.updatePreview();
      this.refreshPage();
    } else {
      showAlertDialog({
        title: 'Card Full',
        message: 'All 25 squares are filled. Remove a resolution first.',
      });
    }
  }

  removeResolutionFromCard(resolutionId) {
    const square = this.cardData.squares.find(
      (s) => s.resolutionId === resolutionId,
    );
    if (square) {
      square.resolutionId = null;
      square.bingoPhrase = null;
      this.updatePreview();
      this.refreshPage();
    }
  }

  shuffleSquares() {
    // Get all non-null resolutions
    const filledSquares = this.cardData.squares
      .filter((s) => s.resolutionId)
      .map((s) => ({
        resolutionId: s.resolutionId,
        bingoPhrase: s.bingoPhrase,
      }));

    const resolutionCount = filledSquares.length;
    const centerPosition = 12; // Center of 5x5 grid (0-indexed)

    // Shuffle the resolutions
    for (let i = filledSquares.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filledSquares[i], filledSquares[j]] = [
        filledSquares[j],
        filledSquares[i],
      ];
    }

    if (resolutionCount === 25) {
      // Case 1: All squares are resolutions, just shuffle them
      this.cardData.squares.forEach((square, index) => {
        square.resolutionId = filledSquares[index].resolutionId;
        square.bingoPhrase = filledSquares[index].bingoPhrase;
      });
    } else if (resolutionCount === 24) {
      // Case 2: 24 resolutions, put free square at center
      let resIndex = 0;
      this.cardData.squares.forEach((square, index) => {
        if (index === centerPosition) {
          // Center is free
          square.resolutionId = null;
          square.bingoPhrase = null;
        } else {
          // Fill with shuffled resolution
          square.resolutionId = filledSquares[resIndex].resolutionId;
          square.bingoPhrase = filledSquares[resIndex].bingoPhrase;
          resIndex++;
        }
      });
    } else {
      // Case 3: < 24 resolutions, put one free at center, shuffle the rest
      // Create array of all positions except center
      const availablePositions = Array.from({ length: 25 }, (_, i) => i).filter(
        (i) => i !== centerPosition,
      );

      // Shuffle available positions
      for (let i = availablePositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availablePositions[i], availablePositions[j]] = [
          availablePositions[j],
          availablePositions[i],
        ];
      }

      // Clear all squares first
      this.cardData.squares.forEach((square) => {
        square.resolutionId = null;
        square.bingoPhrase = null;
      });

      // Put resolutions in shuffled positions (first N positions of shuffled array)
      filledSquares.forEach((res, index) => {
        const position = availablePositions[index];
        this.cardData.squares[position].resolutionId = res.resolutionId;
        this.cardData.squares[position].bingoPhrase = res.bingoPhrase;
      });

      // Center and remaining positions are already free (null)
    }

    this.updatePreview();
  }

  setupDragAndDrop() {
    let draggedElement = null;
    let draggedPosition = null;
    let isDragging = false;

    const grid = document.getElementById('bingo-grid');
    if (!grid) return;

    grid.addEventListener('dragstart', (e) => {
      const square = e.target.closest('.bingo-square');
      if (square && !square.classList.contains('free-square')) {
        draggedElement = square;
        draggedPosition = parseInt(square.dataset.position);
        isDragging = true;
        square.classList.add('dragging');
      }
    });

    grid.addEventListener('dragend', (e) => {
      const square = e.target.closest('.bingo-square');
      if (square) {
        square.classList.remove('dragging');
      }
      // Small delay to allow drop event to complete before resetting
      setTimeout(() => {
        isDragging = false;
      }, 50);
    });

    grid.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    grid.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetSquare = e.target.closest('.bingo-square');

      if (targetSquare && draggedPosition !== null) {
        const targetPosition = parseInt(targetSquare.dataset.position);

        if (targetPosition !== draggedPosition) {
          // Swap squares
          const temp = { ...this.cardData.squares[draggedPosition] };
          this.cardData.squares[draggedPosition] = {
            ...this.cardData.squares[targetPosition],
          };
          this.cardData.squares[targetPosition] = temp;

          // Update positions
          this.cardData.squares[draggedPosition].position = draggedPosition;
          this.cardData.squares[targetPosition].position = targetPosition;

          this.updatePreview();
        }
      }

      draggedElement = null;
      draggedPosition = null;
    });

    // Store isDragging reference for click handler
    this.isDragging = () => isDragging;
  }

  editSquare(position) {
    const square = this.cardData.squares[position];
    if (!square.resolutionId) return;

    const resolution = (this.state.get('resolutions') || []).find(
      (r) => r.id === square.resolutionId,
    );

    if (!resolution) return;

    const modalContent = document.createElement('div');
    modalContent.innerHTML = `
      <div class="form-group">
        <label class="form-label">Resolution</label>
        <p class="text-sm">${resolution.text}</p>
      </div>
      <div class="form-group">
        <label class="form-label">Custom Bingo Phrase (optional)</label>
        <input type="text" id="bingo-phrase-input" class="form-input" 
               maxlength="30" placeholder="Short version for the card"
               value="${square.bingoPhrase || ''}">
        <span class="char-counter" id="phrase-counter">${
          (square.bingoPhrase || '').length
        } / 30</span>
        <p class="text-muted text-sm mt-sm">Leave empty to use the full resolution text</p>
      </div>
      <div class="form-group">
        <label class="form-label">Change Resolution</label>
        <select class="form-select" id="resolution-select">
          <option value="">-- Select Different Resolution --</option>
          ${this.getAllProfileResolutions()
            .map(
              (r) => `
            <option value="${r.id}" ${r.id === resolution.id ? 'selected' : ''}>
              ${truncateText(r.text, 60)}
            </option>
          `,
            )
            .join('')}
        </select>
      </div>
    `;

    const phraseInput = modalContent.querySelector('#bingo-phrase-input');
    const phraseCounter = modalContent.querySelector('#phrase-counter');

    phraseInput.addEventListener('input', (e) => {
      phraseCounter.textContent = `${e.target.value.length} / 30`;
    });

    const modal = new Modal({
      title: 'Edit Square',
      content: modalContent,
      size: 'medium',
      actions: [
        {
          label: 'Remove from Card',
          className: 'btn-danger',
          onClick: (modal) => {
            this.removeResolutionFromCard(square.resolutionId);
            modal.close();
          },
        },
        {
          label: 'Cancel',
          className: 'btn-outline',
          onClick: (modal) => modal.close(),
        },
        {
          label: 'Update',
          className: 'btn-primary',
          onClick: (modal) => {
            const newPhrase = phraseInput.value.trim();
            const newResolutionId =
              modalContent.querySelector('#resolution-select').value;

            if (newResolutionId && newResolutionId !== square.resolutionId) {
              square.resolutionId = newResolutionId;
              square.bingoPhrase = null;
            } else {
              square.bingoPhrase = newPhrase || null;
            }

            this.updatePreview();
            modal.close();
          },
        },
      ],
    });

    modal.open();
  }

  updatePreview() {
    const previewContainer = document.getElementById('bingo-preview');
    if (previewContainer) {
      previewContainer.innerHTML = this.renderBingoPreview();
      this.setupDragAndDrop();
      this.setupSquareClickHandler();
    }
  }

  async saveCard() {
    // Validate
    if (!this.cardData.saveName.trim()) {
      showAlertDialog({
        title: 'Validation Error',
        message: 'Please enter a save name for your card.',
      });
      return;
    }

    if (!this.cardData.title.trim()) {
      showAlertDialog({
        title: 'Validation Error',
        message: 'Please enter a title for your card.',
      });
      return;
    }

    if (this.cardData.saveName.length > 30 || this.cardData.title.length > 30) {
      showAlertDialog({
        title: 'Validation Error',
        message: 'Save name and title must be 30 characters or less.',
      });
      return;
    }

    // Update timestamp
    this.cardData.updatedAt = getCurrentTimestamp();

    // Save to state
    const cards = this.state.get('bingoCards') || [];

    if (this.isEditMode) {
      const index = cards.findIndex((c) => c.id === this.cardData.id);
      if (index >= 0) {
        cards[index] = this.cardData;
      }
    } else {
      cards.push(this.cardData);
    }

    this.state.set('bingoCards', cards);

    // Show success and redirect
    await showAlertDialog({
      title: 'Success!',
      message: `Your bingo card "${this.cardData.saveName}" has been ${
        this.isEditMode ? 'updated' : 'saved'
      }!`,
    });

    window.location.hash = `#/bingo-card/${this.cardData.id}`;
  }

  unmount() {
    // Cleanup
  }
}
