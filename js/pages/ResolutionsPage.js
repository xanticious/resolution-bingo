// Resolutions Page - Main page for managing resolutions
import {
  getOpenMojiHTML,
  EXCITEMENT_EMOJIS,
  EXCITEMENT_LABELS,
  createResolution,
  getCurrentTimestamp,
  formatFrequency,
  getFrequencyTypeLabel,
  getCharacterCountDisplay,
} from '../utils.js';
import {
  Modal,
  showConfirmDialog,
  showAlertDialog,
} from '../components/Modal.js';

export class ResolutionsPage {
  constructor(state, params) {
    this.state = state;
    this.params = params;
    this.title = 'Resolutions';

    // Get view mode from preferences
    const prefs = this.getCurrentPreferences();
    this.viewMode = prefs.resolutionView || 'cards';

    // Filter state
    this.filters = {
      frequencyTypes: [],
      excitementLevels: [],
      categoryIds: [],
    };

    // Sort state
    this.sortBy = null;
    this.sortDirection = 'asc';
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page resolutions-page';
    container.setAttribute('data-testid', 'resolutions-page');

    const resolutions = this.getResolutionsForCurrentProfile();

    if (resolutions.length === 0) {
      container.innerHTML = this.renderEmptyState();
    } else {
      container.innerHTML = this.renderResolutionsList(resolutions);
    }

    return container;
  }

  renderEmptyState() {
    return `
      <div class="empty-state" data-testid="empty-state">
        <div class="empty-state-icon">📝</div>
        <h2 class="empty-state-title">No Resolutions Yet</h2>
        <p class="empty-state-description">
          Start by adding your first resolution! You can also visit Settings to 
          customize your life categories and colors.
        </p>
        <div class="flex gap-md justify-center">
          <button class="btn btn-primary btn-lg" id="add-first-resolution-btn" data-testid="add-first-resolution-btn">
            ${getOpenMojiHTML('2795', 'plus')} Add Your First Resolution
          </button>
          <a href="#/settings" class="btn btn-outline btn-lg" data-testid="go-to-settings-btn">
            ${getOpenMojiHTML('2699', 'gear')} Go to Settings
          </a>
        </div>
      </div>
    `;
  }

  renderResolutionsList(resolutions) {
    const filteredResolutions = this.applyFilters(resolutions);
    const sortedResolutions = this.applySorting(filteredResolutions);
    const categories = this.getLifeCategoriesForCurrentProfile();
    const prefs = this.getCurrentPreferences();

    // Check if at max resolutions
    const atMaxResolutions = resolutions.length >= 2000;

    return `
      <div class="page-header">
        <h1 class="page-title">My Resolutions</h1>
        <p class="page-description">Manage your goals and create bingo cards (${
          resolutions.length
        } / 2000)</p>
      </div>

      <div class="action-bar">
        <div class="action-group">
          <div class="view-toggle" data-testid="view-toggle">
            <button class="view-toggle-btn ${
              this.viewMode === 'cards' ? 'active' : ''
            }" data-view="cards" data-testid="view-cards-btn">
              ${getOpenMojiHTML('1F5C2', 'card index')} Cards
            </button>
            <button class="view-toggle-btn ${
              this.viewMode === 'table' ? 'active' : ''
            }" data-view="table" data-testid="view-table-btn">
              ${getOpenMojiHTML('1F4CA', 'bar chart')} Table
            </button>
            <button class="view-toggle-btn ${
              this.viewMode === 'list' ? 'active' : ''
            }" data-view="list" data-testid="view-list-btn">
              ${getOpenMojiHTML('1F4CB', 'clipboard')} List
            </button>
          </div>
        </div>
        <div class="action-group">
          <button class="btn btn-secondary" id="add-resolution-btn" data-testid="add-resolution-btn" ${
            atMaxResolutions
              ? 'disabled title="Maximum of 2000 resolutions reached"'
              : ''
          }>
            ${getOpenMojiHTML('2795', 'plus')} Add Resolution
          </button>
          <a href="#/bingo-cards" class="btn btn-outline" data-testid="view-bingo-cards-btn">
            ${getOpenMojiHTML('1F4C2', 'card index dividers')} My Bingo Cards
          </a>
          <a href="#/bingo-card/new" class="btn btn-primary" data-testid="create-bingo-card-btn">
            ${getOpenMojiHTML('1F3AF', 'target')} Create Bingo Card
          </a>
        </div>
      </div>

      ${this.renderFilterBar(categories)}

      <div id="resolutions-container" data-testid="resolutions-container">
        ${
          sortedResolutions.length === 0
            ? this.renderNoResults()
            : this.renderResolutionsView(sortedResolutions, prefs)
        }
      </div>
    `;
  }

  renderFilterBar(categories) {
    return `
      <div class="filter-bar" data-testid="filter-bar">
        <div class="filter-section">
          <span class="filter-label">Frequency:</span>
          <div class="filter-options">
            <button class="filter-option ${
              this.filters.frequencyTypes.length === 0 ? 'active' : ''
            }" data-filter-type="frequency" data-filter-value="all" data-testid="filter-frequency-all">
              All
            </button>
            <button class="filter-option ${
              this.filters.frequencyTypes.includes('single') ? 'active' : ''
            }" data-filter-type="frequency" data-filter-value="single" data-testid="filter-frequency-single">
              Single Occurrence
            </button>
            <button class="filter-option ${
              this.filters.frequencyTypes.includes('count') ? 'active' : ''
            }" data-filter-type="frequency" data-filter-value="count" data-testid="filter-frequency-count">
              Number of Times
            </button>
            <button class="filter-option ${
              this.filters.frequencyTypes.includes('rate') ? 'active' : ''
            }" data-filter-type="frequency" data-filter-value="rate" data-testid="filter-frequency-rate">
              Number per Duration
            </button>
          </div>
        </div>

        <div class="filter-section">
          <span class="filter-label">Excitement:</span>
          <div class="filter-options">
            <button class="filter-option ${
              this.filters.excitementLevels.length === 0 ? 'active' : ''
            }" data-filter-type="excitement" data-filter-value="all" data-testid="filter-excitement-all">
              All
            </button>
            <button class="filter-option ${
              this.filters.excitementLevels.includes(5) ? 'active' : ''
            }" data-filter-type="excitement" data-filter-value="5" data-testid="filter-excitement-5">
              ${getOpenMojiHTML(EXCITEMENT_EMOJIS[5])} Excited
            </button>
            <button class="filter-option ${
              this.filters.excitementLevels.includes(4) ? 'active' : ''
            }" data-filter-type="excitement" data-filter-value="4" data-testid="filter-excitement-4">
              ${getOpenMojiHTML(EXCITEMENT_EMOJIS[4])} Good
            </button>
            <button class="filter-option ${
              this.filters.excitementLevels.includes(3) ? 'active' : ''
            }" data-filter-type="excitement" data-filter-value="3" data-testid="filter-excitement-3">
              ${getOpenMojiHTML(EXCITEMENT_EMOJIS[3])} Neutral
            </button>
            <button class="filter-option ${
              this.filters.excitementLevels.includes(2) ? 'active' : ''
            }" data-filter-type="excitement" data-filter-value="2" data-testid="filter-excitement-2">
              ${getOpenMojiHTML(EXCITEMENT_EMOJIS[2])} Not fond
            </button>
            <button class="filter-option ${
              this.filters.excitementLevels.includes(1) ? 'active' : ''
            }" data-filter-type="excitement" data-filter-value="1" data-testid="filter-excitement-1">
              ${getOpenMojiHTML(EXCITEMENT_EMOJIS[1])} Dreading
            </button>
          </div>
        </div>

        ${
          categories.length > 0
            ? `
        <div class="filter-section">
          <span class="filter-label">Category:</span>
          <div class="filter-options">
            <button class="filter-option ${
              this.filters.categoryIds.length === 0 ? 'active' : ''
            }" data-filter-type="category" data-filter-value="all" data-testid="filter-category-all">
              All
            </button>
            ${categories
              .map(
                (cat) => `
              <button class="filter-option ${
                this.filters.categoryIds.includes(cat.id) ? 'active' : ''
              }" data-filter-type="category" data-filter-value="${
                  cat.id
                }" data-testid="filter-category-${cat.id}">
                <span class="color-dot" style="background-color: ${
                  cat.color
                };"></span>
                ${cat.name}
              </button>
            `
              )
              .join('')}
          </div>
        </div>
        `
            : ''
        }
      </div>
    `;
  }

  renderNoResults() {
    return `
      <div class="no-results" data-testid="no-results">
        <p>No resolutions match your filters.</p>
        <button class="btn btn-outline btn-sm" id="clear-filters-btn" data-testid="clear-filters-btn">Clear Filters</button>
      </div>
    `;
  }

  renderResolutionsView(resolutions, prefs) {
    switch (this.viewMode) {
      case 'table':
        return this.renderTableView(resolutions, prefs);
      case 'list':
        return this.renderListView(resolutions, prefs);
      case 'cards':
      default:
        return this.renderCardsView(resolutions, prefs);
    }
  }

  renderCardsView(resolutions, prefs) {
    const categories = this.getLifeCategoriesForCurrentProfile();
    const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

    return `
      <div class="resolutions-grid" data-testid="resolutions-grid">
        ${resolutions
          .map((resolution) => {
            const category = categoryMap[resolution.lifeCategoryId];
            const borderColor = category ? category.color : '#95A5A6';

            return `
            <div class="resolution-card" data-resolution-id="${
              resolution.id
            }" style="border-left-color: ${borderColor};" data-testid="resolution-card-${
              resolution.id
            }">
              <div class="resolution-text">${resolution.text}</div>
              <div class="resolution-meta">
                ${
                  prefs.displayOptions.showLifeCategory && category
                    ? `
                  <span class="badge badge-category" style="background-color: ${category.color};">${category.name}</span>
                `
                    : ''
                }
                ${
                  prefs.displayOptions.showFrequency
                    ? `
                  <span class="badge badge-frequency">${formatFrequency(
                    resolution.frequency
                  )}</span>
                `
                    : ''
                }
                ${
                  prefs.displayOptions.showExcitementLevel
                    ? `
                  <span class="badge badge-excitement badge-excitement-${
                    resolution.excitementLevel
                  }">
                    ${getOpenMojiHTML(
                      EXCITEMENT_EMOJIS[resolution.excitementLevel]
                    )} ${EXCITEMENT_LABELS[resolution.excitementLevel]}
                  </span>
                `
                    : ''
                }
              </div>
              <div class="resolution-actions">
                <button class="btn btn-sm btn-outline edit-resolution-btn" data-testid="edit-resolution-${
                  resolution.id
                }">
                  ${getOpenMojiHTML('270F', 'pencil')} Edit
                </button>
                <button class="btn btn-sm btn-danger delete-resolution-btn" data-testid="delete-resolution-${
                  resolution.id
                }">
                  ${getOpenMojiHTML('1F5D1', 'wastebasket')} Delete
                </button>
              </div>
            </div>
          `;
          })
          .join('')}
      </div>
    `;
  }

  renderTableView(resolutions, prefs) {
    const categories = this.getLifeCategoriesForCurrentProfile();
    const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

    return `
      <div class="resolutions-table-container" data-testid="resolutions-table">
        <table class="resolutions-table">
          <thead>
            <tr>
              <th class="sortable" data-sort-by="text" data-testid="sort-text">
                Resolution ${this.getSortIcon('text')}
              </th>
              ${
                prefs.displayOptions.showLifeCategory
                  ? `
                <th class="sortable" data-sort-by="category" data-testid="sort-category">
                  Category ${this.getSortIcon('category')}
                </th>
              `
                  : ''
              }
              ${
                prefs.displayOptions.showFrequency
                  ? `
                <th class="sortable" data-sort-by="frequency" data-testid="sort-frequency">
                  Frequency ${this.getSortIcon('frequency')}
                </th>
              `
                  : ''
              }
              ${
                prefs.displayOptions.showExcitementLevel
                  ? `
                <th class="sortable" data-sort-by="excitement" data-testid="sort-excitement">
                  Excitement ${this.getSortIcon('excitement')}
                </th>
              `
                  : ''
              }
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${resolutions
              .map((resolution) => {
                const category = categoryMap[resolution.lifeCategoryId];

                return `
                <tr data-resolution-id="${
                  resolution.id
                }" data-testid="resolution-row-${resolution.id}">
                  <td class="resolution-text-cell">${resolution.text}</td>
                  ${
                    prefs.displayOptions.showLifeCategory
                      ? `
                    <td>
                      ${
                        category
                          ? `<span class="badge badge-category" style="background-color: ${category.color};">${category.name}</span>`
                          : '-'
                      }
                    </td>
                  `
                      : ''
                  }
                  ${
                    prefs.displayOptions.showFrequency
                      ? `
                    <td>${formatFrequency(resolution.frequency)}</td>
                  `
                      : ''
                  }
                  ${
                    prefs.displayOptions.showExcitementLevel
                      ? `
                    <td>
                      <span class="badge badge-excitement badge-excitement-${
                        resolution.excitementLevel
                      }">
                        ${getOpenMojiHTML(
                          EXCITEMENT_EMOJIS[resolution.excitementLevel]
                        )} ${EXCITEMENT_LABELS[resolution.excitementLevel]}
                      </span>
                    </td>
                  `
                      : ''
                  }
                  <td class="actions-cell">
                    <button class="btn btn-sm btn-outline edit-resolution-btn" data-testid="edit-resolution-${
                      resolution.id
                    }">Edit</button>
                    <button class="btn btn-sm btn-danger delete-resolution-btn" data-testid="delete-resolution-${
                      resolution.id
                    }">Delete</button>
                  </td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderListView(resolutions, prefs) {
    const categories = this.getLifeCategoriesForCurrentProfile();
    const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

    return `
      <div class="resolutions-list" data-testid="resolutions-list">
        ${resolutions
          .map((resolution) => {
            const category = categoryMap[resolution.lifeCategoryId];
            const parts = [];

            if (prefs.displayOptions.showLifeCategory && category) {
              parts.push(
                `<strong style="color: ${category.color};">${category.name}</strong>`
              );
            }

            parts.push(resolution.text);

            if (prefs.displayOptions.showFrequency) {
              parts.push(formatFrequency(resolution.frequency));
            }

            if (prefs.displayOptions.showExcitementLevel) {
              parts.push(
                getOpenMojiHTML(EXCITEMENT_EMOJIS[resolution.excitementLevel])
              );
            }

            return `
            <div class="resolution-list-item" data-resolution-id="${
              resolution.id
            }" data-testid="resolution-list-item-${resolution.id}">
              <div class="resolution-list-content">
                ${parts.join(' - ')}
              </div>
              <div class="resolution-list-actions">
                <button class="btn btn-sm btn-outline edit-resolution-btn" data-testid="edit-resolution-${
                  resolution.id
                }">Edit</button>
                <button class="btn btn-sm btn-danger delete-resolution-btn" data-testid="delete-resolution-${
                  resolution.id
                }">Delete</button>
              </div>
            </div>
          `;
          })
          .join('')}
      </div>
    `;
  }

  getSortIcon(column) {
    if (this.sortBy !== column) {
      return '<span class="sort-icon">⇅</span>';
    }
    return this.sortDirection === 'asc'
      ? '<span class="sort-icon">↑</span>'
      : '<span class="sort-icon">↓</span>';
  }

  mount() {
    // Empty state button
    document
      .getElementById('add-first-resolution-btn')
      ?.addEventListener('click', () => {
        this.showResolutionModal();
      });

    // View toggle
    document.querySelectorAll('.view-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        this.switchView(e.target.dataset.view);
      });
    });

    // Add resolution button
    document
      .getElementById('add-resolution-btn')
      ?.addEventListener('click', () => {
        this.showResolutionModal();
      });

    // Filter buttons
    document.querySelectorAll('.filter-option').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const filterType = e.currentTarget.dataset.filterType;
        const filterValue = e.currentTarget.dataset.filterValue;
        this.toggleFilter(filterType, filterValue);
      });
    });

    // Clear filters
    document
      .getElementById('clear-filters-btn')
      ?.addEventListener('click', () => {
        this.clearFilters();
      });

    // Sort columns (table view)
    document.querySelectorAll('.sortable').forEach((th) => {
      th.addEventListener('click', (e) => {
        const sortBy = e.currentTarget.dataset.sortBy;
        this.toggleSort(sortBy);
      });
    });

    // Edit/delete buttons
    document.querySelectorAll('.edit-resolution-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const resolutionId = e.target.closest('[data-resolution-id]').dataset
          .resolutionId;
        this.editResolution(resolutionId);
      });
    });

    document.querySelectorAll('.delete-resolution-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const resolutionId = e.target.closest('[data-resolution-id]').dataset
          .resolutionId;
        this.deleteResolution(resolutionId);
      });
    });
  }

  unmount() {
    // Cleanup handled by router
  }

  // Helper methods
  getResolutionsForCurrentProfile() {
    const currentProfileId = this.state.get('currentProfileId');
    const allResolutions = this.state.get('resolutions') || [];
    return allResolutions
      .filter((r) => r.profileId === currentProfileId)
      .sort((a, b) => a.order - b.order);
  }

  getLifeCategoriesForCurrentProfile() {
    const currentProfileId = this.state.get('currentProfileId');
    const categories = this.state.get('lifeCategories') || [];
    return categories.filter((c) => c.profileId === currentProfileId);
  }

  getCurrentPreferences() {
    const currentProfileId = this.state.get('currentProfileId');
    const preferences = this.state.get('preferences') || {};
    return (
      preferences[currentProfileId] || {
        displayOptions: {
          showExcitementLevel: true,
          showFrequency: true,
          showLifeCategory: true,
        },
        resolutionView: 'cards',
      }
    );
  }

  applyFilters(resolutions) {
    let filtered = [...resolutions];

    // Frequency filter
    if (this.filters.frequencyTypes.length > 0) {
      filtered = filtered.filter((r) =>
        this.filters.frequencyTypes.includes(r.frequency.type)
      );
    }

    // Excitement filter
    if (this.filters.excitementLevels.length > 0) {
      filtered = filtered.filter((r) =>
        this.filters.excitementLevels.includes(r.excitementLevel)
      );
    }

    // Category filter
    if (this.filters.categoryIds.length > 0) {
      filtered = filtered.filter((r) =>
        this.filters.categoryIds.includes(r.lifeCategoryId)
      );
    }

    return filtered;
  }

  applySorting(resolutions) {
    if (!this.sortBy) {
      return resolutions;
    }

    const sorted = [...resolutions];
    const categories = this.getLifeCategoriesForCurrentProfile();
    const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

    sorted.sort((a, b) => {
      let aVal, bVal;

      switch (this.sortBy) {
        case 'text':
          aVal = a.text.toLowerCase();
          bVal = b.text.toLowerCase();
          break;
        case 'category':
          aVal = categoryMap[a.lifeCategoryId]?.name || '';
          bVal = categoryMap[b.lifeCategoryId]?.name || '';
          break;
        case 'frequency':
          aVal = a.frequency.type + (a.frequency.count || 0);
          bVal = b.frequency.type + (b.frequency.count || 0);
          break;
        case 'excitement':
          aVal = a.excitementLevel;
          bVal = b.excitementLevel;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  switchView(viewMode) {
    this.viewMode = viewMode;

    // Update preferences
    const currentProfileId = this.state.get('currentProfileId');
    const preferences = this.state.get('preferences') || {};
    const currentPreferences = preferences[currentProfileId];
    if (currentPreferences) {
      currentPreferences.resolutionView = viewMode;
      preferences[currentProfileId] = currentPreferences;
      this.state.set('preferences', preferences);
    }

    // Re-render
    this.rerender();
  }

  toggleFilter(filterType, filterValue) {
    if (filterValue === 'all') {
      // Clear this filter type
      switch (filterType) {
        case 'frequency':
          this.filters.frequencyTypes = [];
          break;
        case 'excitement':
          this.filters.excitementLevels = [];
          break;
        case 'category':
          this.filters.categoryIds = [];
          break;
      }
    } else {
      // Toggle specific filter
      switch (filterType) {
        case 'frequency':
          const freqIndex = this.filters.frequencyTypes.indexOf(filterValue);
          if (freqIndex > -1) {
            this.filters.frequencyTypes.splice(freqIndex, 1);
          } else {
            this.filters.frequencyTypes.push(filterValue);
          }
          break;
        case 'excitement':
          const excLevel = parseInt(filterValue);
          const excIndex = this.filters.excitementLevels.indexOf(excLevel);
          if (excIndex > -1) {
            this.filters.excitementLevels.splice(excIndex, 1);
          } else {
            this.filters.excitementLevels.push(excLevel);
          }
          break;
        case 'category':
          const catIndex = this.filters.categoryIds.indexOf(filterValue);
          if (catIndex > -1) {
            this.filters.categoryIds.splice(catIndex, 1);
          } else {
            this.filters.categoryIds.push(filterValue);
          }
          break;
      }
    }

    this.rerender();
  }

  clearFilters() {
    this.filters = {
      frequencyTypes: [],
      excitementLevels: [],
      categoryIds: [],
    };
    this.rerender();
  }

  toggleSort(column) {
    if (this.sortBy === column) {
      // Toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column
      this.sortBy = column;
      this.sortDirection = 'asc';
    }

    this.rerender();
  }

  async rerender() {
    const container = document.querySelector('.resolutions-page');
    if (!container) return;

    const resolutions = this.getResolutionsForCurrentProfile();
    if (resolutions.length === 0) {
      container.innerHTML = this.renderEmptyState();
    } else {
      container.innerHTML = this.renderResolutionsList(resolutions);
    }

    // Re-mount event listeners
    this.mount();
  }

  showResolutionModal(resolutionId = null) {
    const resolutions = this.state.get('resolutions') || [];
    const resolution = resolutionId
      ? resolutions.find((r) => r.id === resolutionId)
      : null;

    const categories = this.getLifeCategoriesForCurrentProfile();
    const isEdit = !!resolution;

    // Create modal content
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="resolution-text">Resolution</label>
        <textarea 
          class="form-input" 
          id="resolution-text" 
          rows="3" 
          maxlength="1000" 
          placeholder="Enter your resolution..."
          data-testid="resolution-text-input"
        >${resolution ? resolution.text : ''}</textarea>
        <div class="char-counter" id="resolution-text-counter">${
          resolution ? resolution.text.length : 0
        } / 1000</div>
      </div>

      <div class="form-group">
        <label class="form-label">Frequency</label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" name="frequency-type" value="single" ${
              !resolution || resolution.frequency.type === 'single'
                ? 'checked'
                : ''
            } data-testid="frequency-type-single" />
            <span>Single Occurrence</span>
          </label>
          <label class="radio-label">
            <input type="radio" name="frequency-type" value="count" ${
              resolution && resolution.frequency.type === 'count'
                ? 'checked'
                : ''
            } data-testid="frequency-type-count" />
            <span>Number of Times</span>
          </label>
          <label class="radio-label">
            <input type="radio" name="frequency-type" value="rate" ${
              resolution && resolution.frequency.type === 'rate'
                ? 'checked'
                : ''
            } data-testid="frequency-type-rate" />
            <span>Number per Duration</span>
          </label>
        </div>
      </div>

      <div class="form-group frequency-count-group" style="display: ${
        resolution &&
        (resolution.frequency.type === 'count' ||
          resolution.frequency.type === 'rate')
          ? 'block'
          : 'none'
      };">
        <label class="form-label" for="frequency-count">Number of Times</label>
        <input type="number" class="form-input" id="frequency-count" min="1" max="999" value="${
          resolution && resolution.frequency.count
            ? resolution.frequency.count
            : 1
        }" data-testid="frequency-count-input" />
      </div>

      <div class="form-group frequency-duration-group" style="display: ${
        resolution && resolution.frequency.type === 'rate' ? 'block' : 'none'
      };">
        <label class="form-label" for="frequency-duration">Per</label>
        <select class="form-select" id="frequency-duration" data-testid="frequency-duration-select">
          <option value="week" ${
            resolution && resolution.frequency.duration === 'week'
              ? 'selected'
              : ''
          }>Week</option>
          <option value="month" ${
            resolution && resolution.frequency.duration === 'month'
              ? 'selected'
              : ''
          }>Month</option>
          <option value="year" ${
            resolution && resolution.frequency.duration === 'year'
              ? 'selected'
              : ''
          }>Year</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="excitement-level">Excitement Level</label>
        <div class="excitement-slider">
          <input type="range" id="excitement-level" min="1" max="5" value="${
            resolution ? resolution.excitementLevel : 3
          }" data-testid="excitement-level-slider" />
          <div class="excitement-labels">
            <span>😰 Dreading</span>
            <span>😐 Neutral</span>
            <span>😄 Excited</span>
          </div>
          <div class="excitement-value" id="excitement-value">${
            resolution
              ? EXCITEMENT_LABELS[resolution.excitementLevel]
              : EXCITEMENT_LABELS[3]
          }</div>
        </div>
      </div>

      ${
        categories.length > 0
          ? `
      <div class="form-group">
        <label class="form-label" for="life-category">Life Category</label>
        <select class="form-select" id="life-category" data-testid="life-category-select">
          <option value="">None</option>
          ${categories
            .map(
              (cat) => `
            <option value="${cat.id}" ${
                resolution && resolution.lifeCategoryId === cat.id
                  ? 'selected'
                  : ''
              }>${cat.name}</option>
          `
            )
            .join('')}
        </select>
      </div>
      `
          : `
      <p class="text-muted"><small>Visit <a href="#/settings">Settings</a> to add life categories.</small></p>
      `
      }
    `;

    const modal = new Modal({
      title: isEdit ? 'Edit Resolution' : 'Add Resolution',
      content: content,
      size: 'medium',
      actions: [
        {
          label: 'Cancel',
          className: 'btn-outline',
          onClick: (modal) => modal.close(),
        },
        {
          label: isEdit ? 'Save Changes' : 'Add Resolution',
          className: 'btn-primary',
          onClick: (modal) => {
            if (isEdit) {
              this.saveResolution(resolutionId, modal);
            } else {
              this.createResolution(modal);
            }
          },
        },
      ],
    });

    modal.open();

    // Add event listeners after modal is open
    setTimeout(() => {
      // Character counter
      const textInput = document.getElementById('resolution-text');
      const textCounter = document.getElementById('resolution-text-counter');
      textInput?.addEventListener('input', () => {
        const charInfo = getCharacterCountDisplay(textInput.value, 1000);
        textCounter.textContent = charInfo.display;
        textCounter.classList.toggle('error', charInfo.isOverLimit);
      });

      // Frequency type toggles
      document
        .querySelectorAll('input[name="frequency-type"]')
        .forEach((radio) => {
          radio.addEventListener('change', (e) => {
            const type = e.target.value;
            const countGroup = document.querySelector('.frequency-count-group');
            const durationGroup = document.querySelector(
              '.frequency-duration-group'
            );

            if (type === 'count') {
              countGroup.style.display = 'block';
              durationGroup.style.display = 'none';
            } else if (type === 'rate') {
              countGroup.style.display = 'block';
              durationGroup.style.display = 'block';
            } else {
              countGroup.style.display = 'none';
              durationGroup.style.display = 'none';
            }
          });
        });

      // Excitement slider
      const slider = document.getElementById('excitement-level');
      const valueDisplay = document.getElementById('excitement-value');
      slider?.addEventListener('input', () => {
        const level = parseInt(slider.value);
        valueDisplay.textContent = EXCITEMENT_LABELS[level];
      });
    }, 50);
  }

  createResolution(modal) {
    const textInput = document.getElementById('resolution-text');
    const text = textInput.value.trim();

    if (!text) {
      alert('Please enter a resolution');
      return;
    }

    if (text.length > 1000) {
      alert('Resolution text must be 1000 characters or less');
      return;
    }

    const frequencyType = document.querySelector(
      'input[name="frequency-type"]:checked'
    ).value;
    const frequencyCount =
      frequencyType !== 'single'
        ? parseInt(document.getElementById('frequency-count').value)
        : null;
    const frequencyDuration =
      frequencyType === 'rate'
        ? document.getElementById('frequency-duration').value
        : null;

    const excitementLevel = parseInt(
      document.getElementById('excitement-level').value
    );
    const lifeCategoryId =
      document.getElementById('life-category')?.value || null;

    const currentProfileId = this.state.get('currentProfileId');
    const resolutions = this.state.get('resolutions') || [];

    // Check max limit
    const profileResolutions = resolutions.filter(
      (r) => r.profileId === currentProfileId
    );
    if (profileResolutions.length >= 2000) {
      alert('Maximum of 2000 resolutions reached');
      return;
    }

    const newResolution = createResolution(currentProfileId, {
      text: text,
      frequency: {
        type: frequencyType,
        count: frequencyCount,
        duration: frequencyDuration,
      },
      excitementLevel: excitementLevel,
      lifeCategoryId: lifeCategoryId,
      order: profileResolutions.length,
    });

    resolutions.push(newResolution);
    this.state.set('resolutions', resolutions);

    modal.close();
    this.rerender();
  }

  saveResolution(resolutionId, modal) {
    const resolutions = this.state.get('resolutions') || [];
    const resolution = resolutions.find((r) => r.id === resolutionId);

    if (!resolution) return;

    const textInput = document.getElementById('resolution-text');
    const text = textInput.value.trim();

    if (!text) {
      alert('Please enter a resolution');
      return;
    }

    if (text.length > 1000) {
      alert('Resolution text must be 1000 characters or less');
      return;
    }

    const frequencyType = document.querySelector(
      'input[name="frequency-type"]:checked'
    ).value;
    const frequencyCount =
      frequencyType !== 'single'
        ? parseInt(document.getElementById('frequency-count').value)
        : null;
    const frequencyDuration =
      frequencyType === 'rate'
        ? document.getElementById('frequency-duration').value
        : null;

    const excitementLevel = parseInt(
      document.getElementById('excitement-level').value
    );
    const lifeCategoryId =
      document.getElementById('life-category')?.value || null;

    resolution.text = text;
    resolution.frequency = {
      type: frequencyType,
      count: frequencyCount,
      duration: frequencyDuration,
    };
    resolution.excitementLevel = excitementLevel;
    resolution.lifeCategoryId = lifeCategoryId;
    resolution.updatedAt = getCurrentTimestamp();

    this.state.set('resolutions', resolutions);

    modal.close();
    this.rerender();
  }

  editResolution(resolutionId) {
    this.showResolutionModal(resolutionId);
  }

  async deleteResolution(resolutionId) {
    const resolutions = this.state.get('resolutions') || [];
    const resolution = resolutions.find((r) => r.id === resolutionId);

    if (!resolution) return;

    // Check if used in bingo cards
    const bingoCards = this.state.get('bingoCards') || [];
    const cardsUsingResolution = bingoCards.filter((card) =>
      card.squares.some((sq) => sq.resolutionId === resolutionId)
    );

    let message = `Are you sure you want to delete this resolution?`;
    if (cardsUsingResolution.length > 0) {
      message = `This resolution is used in ${
        cardsUsingResolution.length
      } bingo card${
        cardsUsingResolution.length > 1 ? 's' : ''
      }. If you delete it, those squares will become Free squares. Continue?`;
    }

    const confirmed = await showConfirmDialog({
      title: 'Delete Resolution',
      message: message,
      confirmLabel: 'Delete',
      dangerous: true,
    });

    if (!confirmed) return;

    // Remove resolution
    const updatedResolutions = resolutions.filter((r) => r.id !== resolutionId);

    // Update bingo cards
    const updatedCards = bingoCards.map((card) => {
      const updatedSquares = card.squares.map((sq) => {
        if (sq.resolutionId === resolutionId) {
          return {
            position: sq.position,
            resolutionId: null,
            bingoPhrase: null,
          };
        }
        return sq;
      });

      if (updatedSquares !== card.squares) {
        return {
          ...card,
          squares: updatedSquares,
          updatedAt: getCurrentTimestamp(),
        };
      }
      return card;
    });

    this.state.update({
      resolutions: updatedResolutions,
      bingoCards: updatedCards,
    });

    this.rerender();
  }
}
