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
      design: 'flowers',
      font: 'silly',
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

    const resolutions = this.getFilteredResolutions();
    const selectedCount = this.cardData.squares.filter(
      (s) => s.resolutionId
    ).length;
    const maxCards = 40;
    const currentCards = this.getCurrentProfileCards().length;
    const canSave = this.isEditMode || currentCards < maxCards;

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">${this.title}</h1>
        <p class="page-description">Design your custom bingo card with up to 25 resolutions</p>
      </div>

      <div class="bingo-creator-layout">
        <!-- Left Panel: Configuration -->
        <div class="creator-panel">
          <div class="creator-section">
            <h3 class="section-title">Card Details</h3>
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

          <div class="creator-section">
            <h3 class="section-title">Resolution Selection</h3>
            <div class="selection-count">
              <strong>${selectedCount} / 25</strong> selected
              ${
                selectedCount < 25
                  ? '<span class="text-muted">(remaining will be Free squares)</span>'
                  : ''
              }
            </div>
            
            ${this.renderFilters()}
            
            <div class="resolutions-selector" id="resolutions-list">
              ${this.renderResolutionsList(resolutions)}
            </div>
          </div>

          <div class="creator-section">
            <h3 class="section-title">Visual Style</h3>
            <div class="form-group">
              <label class="form-label">Design Theme</label>
              <select class="form-select" id="theme-select">
                <option value="flowers" ${
                  this.cardData.design === 'flowers' ? 'selected' : ''
                }>Flowers</option>
                <option value="cute" ${
                  this.cardData.design === 'cute' ? 'selected' : ''
                }>Cute</option>
                <option value="science" ${
                  this.cardData.design === 'science' ? 'selected' : ''
                }>Science</option>
                <option value="mathy" ${
                  this.cardData.design === 'mathy' ? 'selected' : ''
                }>Mathy</option>
                <option value="animals" ${
                  this.cardData.design === 'animals' ? 'selected' : ''
                }>Animals</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Font Style</label>
              <select class="form-select" id="font-select">
                <option value="silly" ${
                  this.cardData.font === 'silly' ? 'selected' : ''
                }>Silly</option>
                <option value="fancy" ${
                  this.cardData.font === 'fancy' ? 'selected' : ''
                }>Fancy</option>
                <option value="writer" ${
                  this.cardData.font === 'writer' ? 'selected' : ''
                }>Writer</option>
                <option value="headlines" ${
                  this.cardData.font === 'headlines' ? 'selected' : ''
                }>Headlines</option>
              </select>
            </div>
          </div>

          <div class="creator-section">
            <h3 class="section-title">Actions</h3>
            <div class="flex flex-col gap-md">
              <button class="btn btn-secondary" id="shuffle-btn">
                ${getOpenMojiHTML('1F500', 'shuffle')} Shuffle Squares
              </button>
              <button class="btn btn-primary" id="save-btn" ${
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
              <a href="#/bingo-cards" class="btn btn-outline">Cancel</a>
            </div>
          </div>
        </div>

        <!-- Right Panel: Live Preview -->
        <div class="preview-panel">
          <div class="card">
            <h3 class="text-center mb-md">Live Preview</h3>
            <p class="text-muted text-center text-sm mb-md">Click any square to edit</p>
            <div class="bingo-preview-container" id="bingo-preview">
              ${this.renderBingoPreview()}
            </div>
          </div>
        </div>
      </div>
    `;

    return container;
  }

  renderFilters() {
    const categories = this.getCurrentProfileCategories();

    return `
      <div class="filters-section">
        <details class="filter-group">
          <summary class="filter-summary">Filter Resolutions</summary>
          <div class="filter-content">
            <div class="filter-category">
              <strong class="filter-label">Frequency:</strong>
              <label class="checkbox-label">
                <input type="checkbox" value="single" class="filter-frequency"> Single Occurrence
              </label>
              <label class="checkbox-label">
                <input type="checkbox" value="count" class="filter-frequency"> Number of Times
              </label>
              <label class="checkbox-label">
                <input type="checkbox" value="rate" class="filter-frequency"> Per Duration
              </label>
            </div>
            
            <div class="filter-category">
              <strong class="filter-label">Excitement:</strong>
              ${[1, 2, 3, 4, 5]
                .map(
                  (level) => `
                <label class="checkbox-label">
                  <input type="checkbox" value="${level}" class="filter-excitement"> 
                  ${this.getExcitementLabel(level)}
                </label>
              `
                )
                .join('')}
            </div>
            
            ${
              categories.length > 0
                ? `
              <div class="filter-category">
                <strong class="filter-label">Categories:</strong>
                ${categories
                  .map(
                    (cat) => `
                  <label class="checkbox-label">
                    <input type="checkbox" value="${cat.id}" class="filter-category"> 
                    <span class="category-badge" style="background-color: ${cat.color}"></span>
                    ${cat.name}
                  </label>
                `
                  )
                  .join('')}
              </div>
            `
                : ''
            }
            
            <button class="btn btn-sm btn-outline" id="clear-filters-btn">Clear Filters</button>
          </div>
        </details>
      </div>
    `;
  }

  renderResolutionsList(resolutions) {
    if (resolutions.length === 0) {
      return `
        <div class="empty-state-sm">
          <p class="text-muted">No resolutions match your filters.</p>
          <a href="#/resolutions" class="btn btn-sm btn-primary">Add Resolutions</a>
        </div>
      `;
    }

    return `
      <div class="resolutions-list-scroll">
        ${resolutions
          .map((res) => {
            const isSelected = this.cardData.squares.some(
              (s) => s.resolutionId === res.id
            );
            const category = this.getCategoryById(res.lifeCategoryId);

            return `
            <div class="resolution-item ${
              isSelected ? 'selected' : ''
            }" data-resolution-id="${res.id}">
              <div class="resolution-content">
                <div class="resolution-text">${truncateText(res.text, 80)}</div>
                <div class="resolution-meta">
                  ${
                    category
                      ? `<span class="badge" style="background-color: ${category.color}">${category.name}</span>`
                      : ''
                  }
                  <span class="badge-neutral">${this.getFrequencyText(
                    res.frequency
                  )}</span>
                </div>
              </div>
              <button class="btn btn-sm ${
                isSelected ? 'btn-danger' : 'btn-primary'
              }" 
                      data-action="${isSelected ? 'remove' : 'add'}">
                ${isSelected ? 'Remove' : 'Add'}
              </button>
            </div>
          `;
          })
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
                (r) => r.id === square.resolutionId
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
    const icons = {
      flowers: '🌸 FREE',
      cute: '⭐ FREE',
      science: '🔬 FREE',
      mathy: 'π FREE',
      animals: '🐾 FREE',
    };
    return icons[this.cardData.design] || '⭐ FREE';
  }

  getFilteredResolutions() {
    const currentProfileId = this.state.get('currentProfileId');
    let resolutions = (this.state.get('resolutions') || [])
      .filter((r) => r.profileId === currentProfileId)
      .sort((a, b) => a.order - b.order);

    // Apply filters
    if (this.filters.frequency.length > 0) {
      resolutions = resolutions.filter((r) =>
        this.filters.frequency.includes(r.frequency.type)
      );
    }

    if (this.filters.excitement.length > 0) {
      resolutions = resolutions.filter((r) =>
        this.filters.excitement.includes(r.excitementLevel)
      );
    }

    if (this.filters.categories.length > 0) {
      resolutions = resolutions.filter((r) =>
        this.filters.categories.includes(r.lifeCategoryId)
      );
    }

    return resolutions;
  }

  getCurrentProfileCards() {
    const currentProfileId = this.state.get('currentProfileId');
    return (this.state.get('bingoCards') || []).filter(
      (c) => c.profileId === currentProfileId
    );
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

    // Filter checkboxes
    document.querySelectorAll('.filter-frequency').forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        this.updateFilters();
      });
    });

    document.querySelectorAll('.filter-excitement').forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        this.updateFilters();
      });
    });

    document.querySelectorAll('.filter-category').forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        this.updateFilters();
      });
    });

    document
      .getElementById('clear-filters-btn')
      ?.addEventListener('click', () => {
        this.clearFilters();
      });

    // Resolution add/remove buttons
    document
      .getElementById('resolutions-list')
      ?.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-action]');
        if (button) {
          const resolutionId =
            button.closest('.resolution-item').dataset.resolutionId;
          const action = button.dataset.action;

          if (action === 'add') {
            this.addResolutionToCard(resolutionId);
          } else if (action === 'remove') {
            this.removeResolutionFromCard(resolutionId);
          }
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

    // Click on squares to edit
    document.getElementById('bingo-grid')?.addEventListener('click', (e) => {
      const square = e.target.closest('.bingo-square');
      if (square && !square.classList.contains('free-square')) {
        const position = parseInt(square.dataset.position);
        this.editSquare(position);
      }
    });
  }

  updateFilters() {
    this.filters.frequency = Array.from(
      document.querySelectorAll('.filter-frequency:checked')
    ).map((cb) => cb.value);

    this.filters.excitement = Array.from(
      document.querySelectorAll('.filter-excitement:checked')
    ).map((cb) => parseInt(cb.value));

    this.filters.categories = Array.from(
      document.querySelectorAll('.filter-category:checked')
    ).map((cb) => cb.value);

    this.refreshResolutionsList();
  }

  clearFilters() {
    document
      .querySelectorAll(
        '.filter-frequency, .filter-excitement, .filter-category'
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
      this.refreshResolutionsList();
    } else {
      showAlertDialog({
        title: 'Card Full',
        message: 'All 25 squares are filled. Remove a resolution first.',
      });
    }
  }

  removeResolutionFromCard(resolutionId) {
    const square = this.cardData.squares.find(
      (s) => s.resolutionId === resolutionId
    );
    if (square) {
      square.resolutionId = null;
      square.bingoPhrase = null;
      this.updatePreview();
      this.refreshResolutionsList();
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

    // Shuffle array
    for (let i = filledSquares.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filledSquares[i], filledSquares[j]] = [
        filledSquares[j],
        filledSquares[i],
      ];
    }

    // Reassign to squares
    let filledIndex = 0;
    this.cardData.squares.forEach((square) => {
      if (filledIndex < filledSquares.length) {
        square.resolutionId = filledSquares[filledIndex].resolutionId;
        square.bingoPhrase = filledSquares[filledIndex].bingoPhrase;
        filledIndex++;
      } else {
        square.resolutionId = null;
        square.bingoPhrase = null;
      }
    });

    this.updatePreview();
  }

  setupDragAndDrop() {
    let draggedElement = null;
    let draggedPosition = null;

    const grid = document.getElementById('bingo-grid');
    if (!grid) return;

    grid.addEventListener('dragstart', (e) => {
      const square = e.target.closest('.bingo-square');
      if (square && !square.classList.contains('free-square')) {
        draggedElement = square;
        draggedPosition = parseInt(square.dataset.position);
        square.classList.add('dragging');
      }
    });

    grid.addEventListener('dragend', (e) => {
      const square = e.target.closest('.bingo-square');
      if (square) {
        square.classList.remove('dragging');
      }
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
  }

  editSquare(position) {
    const square = this.cardData.squares[position];
    if (!square.resolutionId) return;

    const resolution = (this.state.get('resolutions') || []).find(
      (r) => r.id === square.resolutionId
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
          ${this.getFilteredResolutions()
            .map(
              (r) => `
            <option value="${r.id}" ${r.id === resolution.id ? 'selected' : ''}>
              ${truncateText(r.text, 60)}
            </option>
          `
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
