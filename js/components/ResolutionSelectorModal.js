// Resolution Selector Modal Component
import { Modal } from './Modal.js';
import { truncateText } from '../utils.js';

export class ResolutionSelectorModal {
  constructor({ state, selectedResolutions, onSelectionChange }) {
    this.state = state;
    this.selectedResolutions = new Set(selectedResolutions || []);
    this.onSelectionChange = onSelectionChange;

    // Filters
    this.filters = {
      frequency: [],
      excitement: [],
      categories: [],
      searchText: '',
    };

    this.modal = null;
  }

  open() {
    const modalContent = this.createModalContent();

    this.modal = new Modal({
      title: 'Select Resolutions',
      content: modalContent,
      size: 'large',
      actions: [
        {
          label: 'Clear All',
          className: 'btn-outline',
          onClick: () => {
            this.clearAllSelections();
          },
        },
        {
          label: 'Done',
          className: 'btn-primary',
          onClick: (modal) => {
            if (this.onSelectionChange) {
              this.onSelectionChange(Array.from(this.selectedResolutions));
            }
            modal.close();
          },
        },
      ],
    });

    this.modal.open();
    this.setupEventListeners();
  }

  createModalContent() {
    const container = document.createElement('div');
    container.className = 'resolution-selector-modal';

    const selectedCount = this.selectedResolutions.size;

    container.innerHTML = `
      <div class="modal-selector-header">
        <div class="selection-count-badge">
          <strong>${selectedCount} / 25</strong> selected
          ${selectedCount < 25 ? '<span class="text-muted">(remaining will be Free squares)</span>' : ''}
        </div>
        
        <div class="search-box">
          <input type="text" 
                 id="resolution-search" 
                 class="form-input" 
                 placeholder="Search resolutions..."
                 value="${this.filters.searchText}">
        </div>
      </div>

      <div class="modal-selector-body">
        <aside class="modal-filters">
          <h4 class="filter-section-title">Filters</h4>
          
          <div class="filter-category">
            <strong class="filter-label">Frequency</strong>
            <label class="checkbox-label">
              <input type="checkbox" value="single" class="filter-frequency"> 
              Single Occurrence
            </label>
            <label class="checkbox-label">
              <input type="checkbox" value="count" class="filter-frequency"> 
              Number of Times
            </label>
            <label class="checkbox-label">
              <input type="checkbox" value="rate" class="filter-frequency"> 
              Per Duration
            </label>
          </div>
          
          <div class="filter-category">
            <strong class="filter-label">Excitement</strong>
            ${[1, 2, 3, 4, 5]
              .map(
                (level) => `
              <label class="checkbox-label">
                <input type="checkbox" value="${level}" class="filter-excitement"> 
                ${this.getExcitementLabel(level)}
              </label>
            `,
              )
              .join('')}
          </div>
          
          ${this.renderCategoryFilters()}
          
          <button class="btn btn-sm btn-outline" id="clear-filters-btn">
            Clear Filters
          </button>
        </aside>

        <div class="modal-resolutions-list">
          <div id="resolutions-list-container">
            ${this.renderResolutionsList()}
          </div>
        </div>
      </div>
    `;

    return container;
  }

  renderCategoryFilters() {
    const categories = this.getCurrentProfileCategories();

    if (categories.length === 0) {
      return '';
    }

    return `
      <div class="filter-category">
        <strong class="filter-label">Categories</strong>
        ${categories
          .map(
            (cat) => `
          <label class="checkbox-label">
            <input type="checkbox" value="${cat.id}" class="filter-category"> 
            <span class="category-badge" style="background-color: ${cat.color}"></span>
            ${cat.name}
          </label>
        `,
          )
          .join('')}
      </div>
    `;
  }

  renderResolutionsList() {
    const resolutions = this.getFilteredResolutions();

    if (resolutions.length === 0) {
      return `
        <div class="empty-state-sm">
          <p class="text-muted">No resolutions match your filters.</p>
          ${
            this.filters.searchText || this.hasActiveFilters()
              ? '<p class="text-sm">Try adjusting your search or filters.</p>'
              : '<a href="#/resolutions" class="btn btn-sm btn-primary">Add Resolutions</a>'
          }
        </div>
      `;
    }

    return `
      <div class="resolutions-grid">
        ${resolutions
          .map((res) => {
            const isSelected = this.selectedResolutions.has(res.id);
            const category = this.getCategoryById(res.lifeCategoryId);
            const canSelect = !isSelected && this.selectedResolutions.size < 25;

            return `
            <div class="resolution-card ${isSelected ? 'selected' : ''} ${!canSelect && !isSelected ? 'disabled' : ''}" 
                 data-resolution-id="${res.id}">
              <div class="resolution-card-content">
                <div class="resolution-card-text">${res.text}</div>
                <div class="resolution-card-meta">
                  ${
                    category
                      ? `<span class="badge" style="background-color: ${category.color}">${category.name}</span>`
                      : ''
                  }
                  <span class="badge-neutral">${this.getFrequencyText(res.frequency)}</span>
                  <span class="excitement-indicator" title="${this.getExcitementLabel(res.excitementLevel)}">
                    ${this.getExcitementEmoji(res.excitementLevel)}
                  </span>
                </div>
              </div>
              <div class="resolution-card-actions">
                ${
                  isSelected
                    ? '<button class="btn btn-sm btn-danger" data-action="remove">Remove</button>'
                    : `<button class="btn btn-sm btn-primary" data-action="add" ${!canSelect ? 'disabled' : ''}>Add</button>`
                }
              </div>
            </div>
          `;
          })
          .join('')}
      </div>
    `;
  }

  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('resolution-search');
    searchInput?.addEventListener('input', (e) => {
      this.filters.searchText = e.target.value.toLowerCase();
      this.refreshResolutionsList();
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

    // Clear filters button
    document
      .getElementById('clear-filters-btn')
      ?.addEventListener('click', () => {
        this.clearFilters();
      });

    // Resolution add/remove buttons
    document
      .getElementById('resolutions-list-container')
      ?.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-action]');
        if (button && !button.disabled) {
          const card = button.closest('.resolution-card');
          const resolutionId = card.dataset.resolutionId;
          const action = button.dataset.action;

          if (action === 'add') {
            this.addResolution(resolutionId);
          } else if (action === 'remove') {
            this.removeResolution(resolutionId);
          }
        }
      });
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

    this.filters = {
      frequency: [],
      excitement: [],
      categories: [],
      searchText: this.filters.searchText, // Keep search text
    };

    this.refreshResolutionsList();
  }

  clearAllSelections() {
    this.selectedResolutions.clear();
    this.refreshResolutionsList();
    this.updateSelectionCount();
  }

  addResolution(resolutionId) {
    if (this.selectedResolutions.size < 25) {
      this.selectedResolutions.add(resolutionId);
      this.refreshResolutionsList();
      this.updateSelectionCount();
    }
  }

  removeResolution(resolutionId) {
    this.selectedResolutions.delete(resolutionId);
    this.refreshResolutionsList();
    this.updateSelectionCount();
  }

  updateSelectionCount() {
    const badge = document.querySelector('.selection-count-badge');
    if (badge) {
      const selectedCount = this.selectedResolutions.size;
      badge.innerHTML = `
        <strong>${selectedCount} / 25</strong> selected
        ${selectedCount < 25 ? '<span class="text-muted">(remaining will be Free squares)</span>' : ''}
      `;
    }
  }

  refreshResolutionsList() {
    const listContainer = document.getElementById('resolutions-list-container');
    if (listContainer) {
      listContainer.innerHTML = this.renderResolutionsList();
    }
  }

  getFilteredResolutions() {
    const currentProfileId = this.state.get('currentProfileId');
    let resolutions = (this.state.get('resolutions') || [])
      .filter((r) => r.profileId === currentProfileId)
      .sort((a, b) => a.order - b.order);

    // Apply search filter
    if (this.filters.searchText) {
      resolutions = resolutions.filter((r) =>
        r.text.toLowerCase().includes(this.filters.searchText),
      );
    }

    // Apply frequency filter
    if (this.filters.frequency.length > 0) {
      resolutions = resolutions.filter((r) =>
        this.filters.frequency.includes(r.frequency.type),
      );
    }

    // Apply excitement filter
    if (this.filters.excitement.length > 0) {
      resolutions = resolutions.filter((r) =>
        this.filters.excitement.includes(r.excitementLevel),
      );
    }

    // Apply category filter
    if (this.filters.categories.length > 0) {
      resolutions = resolutions.filter((r) =>
        this.filters.categories.includes(r.lifeCategoryId),
      );
    }

    return resolutions;
  }

  hasActiveFilters() {
    return (
      this.filters.frequency.length > 0 ||
      this.filters.excitement.length > 0 ||
      this.filters.categories.length > 0
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

  getExcitementEmoji(level) {
    const emojis = {
      1: '😰',
      2: '😕',
      3: '😐',
      4: '🙂',
      5: '😄',
    };
    return emojis[level] || '😐';
  }

  getFrequencyText(frequency) {
    if (frequency.type === 'single') return 'Once';
    if (frequency.type === 'count') return `${frequency.count}x total`;
    if (frequency.type === 'rate') {
      return `${frequency.count}x/${frequency.duration}`;
    }
    return '';
  }
}
