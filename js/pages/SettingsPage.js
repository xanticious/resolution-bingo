// Settings Page
import {
  getOpenMojiHTML,
  createProfile,
  createLifeCategory,
  createDefaultPreferences,
  createDefaultCategories,
  getCurrentTimestamp,
  formatDate,
  mergeByUUID,
  PREDEFINED_CATEGORIES,
  CATEGORY_COLORS,
} from '../utils.js';
import {
  Modal,
  showConfirmDialog,
  showPromptDialog,
  showAlertDialog,
} from '../components/Modal.js';

export class SettingsPage {
  constructor(state, params) {
    this.state = state;
    this.params = params;
    this.title = 'Settings';
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page settings-page';
    container.setAttribute('data-testid', 'settings-page');

    const currentProfileId = this.state.get('currentProfileId');
    const profiles = this.state.get('profiles') || [];
    const currentProfile = profiles.find((p) => p.id === currentProfileId);
    const categories = this.getLifeCategoriesForCurrentProfile();
    const preferences = this.getCurrentPreferences();
    const lastBackup = this.state.get('lastBackup');

    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-description">Manage your profile and preferences</p>
      </div>

      ${this.renderProfileManagement(profiles, currentProfile)}
      ${this.renderLifeCategories(categories)}
      ${this.renderDisplayPreferences(preferences)}
      ${this.renderDataManagement(lastBackup)}
      ${this.renderAbout()}
    `;

    return container;
  }

  renderProfileManagement(profiles, currentProfile) {
    const profileOptions = profiles
      .map(
        (p) =>
          `<option value="${p.id}" ${
            p.id === currentProfile.id ? 'selected' : ''
          }>${p.name}</option>`
      )
      .join('');

    return `
      <div class="settings-section">
        <h2 class="settings-section-title">Profile Management</h2>
        <div class="form-group">
          <label class="form-label" for="profile-selector">Current Profile</label>
          <select class="form-select" id="profile-selector" data-testid="profile-selector">
            ${profileOptions}
          </select>
        </div>
        <div class="flex gap-md flex-wrap">
          <button class="btn btn-primary" id="create-profile-btn" data-testid="create-profile-btn">
            ${getOpenMojiHTML('2795', 'plus')} Create New Profile
          </button>
          <button class="btn btn-outline" id="rename-profile-btn" data-testid="rename-profile-btn">
            ${getOpenMojiHTML('270F', 'pencil')} Rename Profile
          </button>
          <button class="btn btn-danger" id="delete-profile-btn" data-testid="delete-profile-btn">
            ${getOpenMojiHTML('1F5D1', 'wastebasket')} Delete Profile
          </button>
        </div>
      </div>
    `;
  }

  renderLifeCategories(categories) {
    const categoryItems = categories
      .map(
        (cat) => `
      <div class="category-item" data-category-id="${cat.id}">
        <div class="category-info">
          <div class="category-color-swatch" style="background-color: ${
            cat.color
          };"></div>
          <span class="category-name">${cat.name}</span>
          ${cat.isCustom ? '<span class="badge">Custom</span>' : ''}
        </div>
        <div class="category-actions">
          <button class="btn btn-sm btn-outline edit-category-btn" data-testid="edit-category-${
            cat.id
          }">Edit</button>
          <button class="btn btn-sm btn-danger delete-category-btn" data-testid="delete-category-${
            cat.id
          }">Delete</button>
        </div>
      </div>
    `
      )
      .join('');

    return `
      <div class="settings-section">
        <h2 class="settings-section-title">Life Categories</h2>
        <p class="text-muted mb-md">Customize the categories you use to organize your resolutions</p>
        
        <div class="category-list" data-testid="category-list">
          ${
            categoryItems ||
            '<p class="text-muted">No categories yet. Add one to get started!</p>'
          }
        </div>

        <button class="btn btn-secondary mt-md" id="add-category-btn" data-testid="add-category-btn">
          ${getOpenMojiHTML('2795', 'plus')} Add Category
        </button>
      </div>
    `;
  }

  renderDisplayPreferences(preferences) {
    const displayOptions = preferences.displayOptions || {};

    return `
      <div class="settings-section">
        <h2 class="settings-section-title">Display Preferences</h2>
        <p class="text-muted mb-md">Choose what information to show on the Resolutions page</p>
        <div class="form-group">
          <label class="form-label checkbox-label">
            <input type="checkbox" id="show-excitement" data-testid="show-excitement" ${
              displayOptions.showExcitementLevel ? 'checked' : ''
            }>
            <span>Show Excitement Level</span>
          </label>
        </div>
        <div class="form-group">
          <label class="form-label checkbox-label">
            <input type="checkbox" id="show-frequency" data-testid="show-frequency" ${
              displayOptions.showFrequency ? 'checked' : ''
            }>
            <span>Show Frequency</span>
          </label>
        </div>
        <div class="form-group">
          <label class="form-label checkbox-label">
            <input type="checkbox" id="show-category" data-testid="show-category" ${
              displayOptions.showLifeCategory ? 'checked' : ''
            }>
            <span>Show Life Category</span>
          </label>
        </div>
      </div>
    `;
  }

  renderDataManagement(lastBackup) {
    const backupText = lastBackup
      ? `Last backup: ${formatDate(lastBackup)}`
      : 'Last backup: Never';

    return `
      <div class="settings-section">
        <h2 class="settings-section-title">Data Management</h2>
        <p class="text-muted mb-md">Backup and restore your data</p>
        <div class="flex gap-md flex-wrap">
          <button class="btn btn-primary" id="export-data-btn" data-testid="export-data-btn">
            ${getOpenMojiHTML('1F4E5', 'inbox tray')} Export Data
          </button>
          <button class="btn btn-outline" id="import-data-btn" data-testid="import-data-btn">
            ${getOpenMojiHTML('1F4E4', 'outbox tray')} Import Data
          </button>
          <button class="btn btn-danger" id="clear-data-btn" data-testid="clear-data-btn">
            ${getOpenMojiHTML('1F5D1', 'wastebasket')} Clear All Data
          </button>
        </div>
        <p class="text-muted mt-md">
          <small>${backupText}</small>
        </p>
        <input type="file" id="import-file-input" accept=".json" style="display: none;" />
      </div>
    `;
  }

  renderAbout() {
    return `
      <div class="settings-section">
        <h2 class="settings-section-title">About</h2>
        <p><strong>Version:</strong> 1.0.0</p>
        <p><strong>App:</strong> Resolution Bingo</p>
        <p class="text-muted">Transform your goals into fun, printable bingo cards!</p>
        <p class="text-muted mt-md">
          <small>All emojis designed by <a href="https://openmoji.org/" target="_blank" rel="noopener">OpenMoji</a> – the open-source emoji and icon project. License: <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a></small>
        </p>
      </div>
    `;
  }

  mount() {
    // Profile management
    document
      .getElementById('profile-selector')
      ?.addEventListener('change', (e) => this.switchProfile(e.target.value));
    document
      .getElementById('create-profile-btn')
      ?.addEventListener('click', () => this.createNewProfile());
    document
      .getElementById('rename-profile-btn')
      ?.addEventListener('click', () => this.renameProfile());
    document
      .getElementById('delete-profile-btn')
      ?.addEventListener('click', () => this.deleteProfile());

    // Life categories
    document
      .getElementById('add-category-btn')
      ?.addEventListener('click', () => this.addCategory());
    document.querySelectorAll('.edit-category-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const categoryId =
          e.target.closest('.category-item').dataset.categoryId;
        this.editCategory(categoryId);
      });
    });
    document.querySelectorAll('.delete-category-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const categoryId =
          e.target.closest('.category-item').dataset.categoryId;
        this.deleteCategory(categoryId);
      });
    });

    // Display preferences
    document
      .getElementById('show-excitement')
      ?.addEventListener('change', (e) =>
        this.updateDisplayPreference('showExcitementLevel', e.target.checked)
      );
    document
      .getElementById('show-frequency')
      ?.addEventListener('change', (e) =>
        this.updateDisplayPreference('showFrequency', e.target.checked)
      );
    document
      .getElementById('show-category')
      ?.addEventListener('change', (e) =>
        this.updateDisplayPreference('showLifeCategory', e.target.checked)
      );

    // Data management
    document
      .getElementById('export-data-btn')
      ?.addEventListener('click', () => this.exportData());
    document
      .getElementById('import-data-btn')
      ?.addEventListener('click', () => this.triggerImport());
    document
      .getElementById('import-file-input')
      ?.addEventListener('change', (e) => this.importData(e));
    document
      .getElementById('clear-data-btn')
      ?.addEventListener('click', () => this.clearAllData());
  }

  unmount() {
    // Cleanup handled by router
  }

  // Helper methods
  getLifeCategoriesForCurrentProfile() {
    const currentProfileId = this.state.get('currentProfileId');
    const categories = this.state.get('lifeCategories') || [];
    return categories.filter((c) => c.profileId === currentProfileId);
  }

  getCurrentPreferences() {
    const currentProfileId = this.state.get('currentProfileId');
    const preferences = this.state.get('preferences') || {};
    return (
      preferences[currentProfileId] ||
      createDefaultPreferences(currentProfileId)
    );
  }

  // Profile management methods
  async switchProfile(profileId) {
    const profiles = this.state.get('profiles') || [];
    const profile = profiles.find((p) => p.id === profileId);

    if (!profile) return;

    this.state.set('currentProfileId', profileId);

    // Save immediately before reload (don't wait for debounced save)
    this.state.save();

    // Update header
    document.getElementById('profile-name').textContent = profile.name;

    // Reload page to stay on settings
    window.location.hash = '#/settings';
    window.location.reload();
  }

  async createNewProfile() {
    const name = await showPromptDialog({
      title: 'Create New Profile',
      message: 'Enter a name for the new profile:',
      placeholder: 'Profile name',
      maxLength: 50,
      confirmLabel: 'Create',
      validate: (value) => {
        if (!value) {
          return { valid: false, message: 'Please enter a name' };
        }
        if (value.length > 50) {
          return {
            valid: false,
            message: 'Name must be 50 characters or less',
          };
        }
        return { valid: true };
      },
    });

    if (!name) return;

    const profile = createProfile(name);
    const profiles = this.state.get('profiles') || [];
    profiles.push(profile);

    const preferences = this.state.get('preferences') || {};
    preferences[profile.id] = createDefaultPreferences(profile.id);

    // Create default categories for new profile
    const categories = this.state.get('lifeCategories') || [];
    const defaultCategories = createDefaultCategories(profile.id);
    categories.push(...defaultCategories);

    // Save to state
    this.state.update({
      profiles: profiles,
      currentProfileId: profile.id,
      preferences: preferences,
      lifeCategories: categories,
    });

    // Save immediately before reload (don't wait for debounced save)
    this.state.save();

    // Update header
    const profileNameElement = document.getElementById('profile-name');
    if (profileNameElement) {
      profileNameElement.textContent = name;
    }

    // Reload page to stay on settings
    window.location.hash = '#/settings';
    window.location.reload();
  }

  async renameProfile() {
    const currentProfileId = this.state.get('currentProfileId');
    const profiles = this.state.get('profiles') || [];
    const currentProfile = profiles.find((p) => p.id === currentProfileId);

    if (!currentProfile) return;

    const name = await showPromptDialog({
      title: 'Rename Profile',
      message: 'Enter a new name for this profile:',
      defaultValue: currentProfile.name,
      maxLength: 50,
      confirmLabel: 'Rename',
      validate: (value) => {
        if (!value) {
          return { valid: false, message: 'Please enter a name' };
        }
        if (value.length > 50) {
          return {
            valid: false,
            message: 'Name must be 50 characters or less',
          };
        }
        return { valid: true };
      },
    });

    if (!name || name === currentProfile.name) return;

    currentProfile.name = name;
    currentProfile.updatedAt = getCurrentTimestamp();

    // Save updated profiles array to state
    this.state.set('profiles', profiles);

    // Save immediately before reload (don't wait for debounced save)
    this.state.save();

    // Update header
    const profileNameElement = document.getElementById('profile-name');
    if (profileNameElement) {
      profileNameElement.textContent = name;
    }

    // Reload page to stay on settings
    window.location.hash = '#/settings';
    window.location.reload();
  }

  async deleteProfile() {
    const profiles = this.state.get('profiles') || [];
    const currentProfileId = this.state.get('currentProfileId');
    const currentProfile = profiles.find((p) => p.id === currentProfileId);

    if (!currentProfile) return;

    const confirmed = await showConfirmDialog({
      title: 'Delete Profile',
      message: `Are you sure you want to delete "${currentProfile.name}"? All resolutions, categories, and bingo cards for this profile will be permanently deleted.`,
      confirmLabel: 'Delete',
      dangerous: true,
    });

    if (!confirmed) return;

    // Remove profile and all associated data
    const updatedProfiles = profiles.filter((p) => p.id !== currentProfileId);
    const resolutions = (this.state.get('resolutions') || []).filter(
      (r) => r.profileId !== currentProfileId
    );
    const categories = (this.state.get('lifeCategories') || []).filter(
      (c) => c.profileId !== currentProfileId
    );
    const bingoCards = (this.state.get('bingoCards') || []).filter(
      (b) => b.profileId !== currentProfileId
    );
    const preferences = this.state.get('preferences') || {};
    delete preferences[currentProfileId];

    // If this was the last profile, redirect to welcome page
    if (updatedProfiles.length === 0) {
      this.state.update({
        profiles: [],
        currentProfileId: null,
        resolutions: resolutions,
        lifeCategories: categories,
        bingoCards: bingoCards,
        preferences: preferences,
      });
      // Save immediately before reload (don't wait for debounced save)
      this.state.save();
      window.location.hash = '#/welcome';
      window.location.reload();
      return;
    }

    // Switch to first remaining profile
    const newCurrentProfileId = updatedProfiles[0].id;

    this.state.update({
      profiles: updatedProfiles,
      currentProfileId: newCurrentProfileId,
      resolutions: resolutions,
      lifeCategories: categories,
      bingoCards: bingoCards,
      preferences: preferences,
    });

    // Save immediately before reload (don't wait for debounced save)
    this.state.save();

    // Update header
    const profileNameElement = document.getElementById('profile-name');
    if (profileNameElement) {
      profileNameElement.textContent = updatedProfiles[0].name;
    }

    // Reload page to stay on settings
    window.location.hash = '#/settings';
    window.location.reload();
  }

  // Life category methods
  async addCategory() {
    const currentProfileId = this.state.get('currentProfileId');

    // Create modal content
    const content = document.createElement('div');

    // Predefined categories section
    const predefinedSection = document.createElement('div');
    predefinedSection.className = 'mb-md';
    predefinedSection.innerHTML = `
      <p class="form-label">Choose a predefined category:</p>
      <div class="category-suggestions" data-testid="category-suggestions" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.5rem;">
        ${PREDEFINED_CATEGORIES.map(
          (cat) =>
            `<button class="btn btn-sm btn-outline category-suggestion" data-category="${cat}">${cat}</button>`
        ).join('')}
      </div>
    `;

    // Custom category section
    const customSection = document.createElement('div');
    customSection.innerHTML = `
      <p class="form-label mt-md">Category Name:</p>
      <input type="text" class="form-input" id="custom-category-name" placeholder="Category name" maxlength="50" data-testid="custom-category-name" />
      <div class="char-counter" id="category-name-counter">0 / 50</div>
      
      <p class="form-label mt-md">Choose a color:</p>
      <div class="color-picker" data-testid="color-picker" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 0.5rem;">
        ${CATEGORY_COLORS.map(
          (colorInfo, index) =>
            `<div class="color-card ${
              index === 0 ? 'selected' : ''
            }" data-color="${
              colorInfo.color
            }" data-testid="color-${index}" style="border: 2px solid ${
              index === 0 ? '#333' : '#ddd'
            }; border-radius: 4px; padding: 0.5rem; cursor: pointer; text-align: center;">
              <div style="width: 100%; height: 30px; background-color: ${
                colorInfo.color
              }; border-radius: 4px; margin-bottom: 0.25rem;"></div>
              <div style="font-size: 0.75rem;">${colorInfo.name}</div>
            </div>`
        ).join('')}
      </div>
    `;

    content.appendChild(predefinedSection);
    content.appendChild(customSection);

    const modal = new Modal({
      title: 'Add Life Category',
      content: content,
      size: 'medium',
      actions: [
        {
          label: 'Cancel',
          className: 'btn-outline',
          onClick: (modal) => modal.close(),
        },
        {
          label: 'Add Category',
          className: 'btn-primary',
          onClick: (modal) => {
            const customName = document
              .getElementById('custom-category-name')
              .value.trim();
            const selectedColor =
              document.querySelector('.color-card.selected')?.dataset.color ||
              CATEGORY_COLORS[0].color;

            if (!customName) {
              alert('Please enter a category name');
              return;
            }

            if (customName.length > 50) {
              alert('Category name must be 50 characters or less');
              return;
            }

            this.saveNewCategory(customName, selectedColor, true);
            modal.close();
          },
        },
      ],
    });

    modal.open();

    // Add event listeners after modal is open
    setTimeout(() => {
      const nameInput = document.getElementById('custom-category-name');

      // Predefined category buttons - populate fields instead of auto-adding
      document
        .querySelectorAll('.category-suggestion')
        .forEach((btn, index) => {
          btn.addEventListener('click', () => {
            const categoryName = btn.dataset.category;
            // Populate the name field
            nameInput.value = categoryName;
            // Update character counter
            const counter = document.getElementById('category-name-counter');
            counter.textContent = `${categoryName.length} / 50`;
            // Select a color based on index for variety
            const colorCards = document.querySelectorAll('.color-card');
            colorCards.forEach((card) => {
              card.classList.remove('selected');
              card.style.border = '2px solid #ddd';
            });
            const selectedCard = colorCards[index % CATEGORY_COLORS.length];
            selectedCard.classList.add('selected');
            selectedCard.style.border = '2px solid #333';
          });
        });

      // Color picker
      document.querySelectorAll('.color-card').forEach((card) => {
        card.addEventListener('click', () => {
          document.querySelectorAll('.color-card').forEach((c) => {
            c.classList.remove('selected');
            c.style.border = '2px solid #ddd';
          });
          card.classList.add('selected');
          card.style.border = '2px solid #333';
        });
      });

      // Character counter
      const counter = document.getElementById('category-name-counter');
      nameInput?.addEventListener('input', () => {
        const count = nameInput.value.length;
        counter.textContent = `${count} / 50`;
        counter.classList.toggle('error', count > 50);
      });
    }, 50);
  }

  saveNewCategory(name, color, isCustom) {
    const currentProfileId = this.state.get('currentProfileId');
    const categories = this.state.get('lifeCategories') || [];

    const newCategory = createLifeCategory(
      currentProfileId,
      name,
      color,
      isCustom
    );
    categories.push(newCategory);

    this.state.set('lifeCategories', categories);

    // Save immediately before reload
    this.state.save();

    // Reload page to stay on settings
    window.location.hash = '#/settings';
    window.location.reload();
  }

  async editCategory(categoryId) {
    const categories = this.state.get('lifeCategories') || [];
    const category = categories.find((c) => c.id === categoryId);

    if (!category) return;

    // Create modal content
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="edit-category-name">Category Name</label>
        <input type="text" class="form-input" id="edit-category-name" value="${
          category.name
        }" maxlength="50" data-testid="edit-category-name" />
        <div class="char-counter" id="edit-category-name-counter">${
          category.name.length
        } / 50</div>
      </div>
      
      <div class="form-group">
        <label class="form-label">Color</label>
        <div class="color-picker" data-testid="edit-color-picker" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 0.5rem;">
          ${CATEGORY_COLORS.map(
            (colorInfo) =>
              `<div class="color-card ${
                colorInfo.color === category.color ? 'selected' : ''
              }" data-color="${colorInfo.color}" style="border: 2px solid ${
                colorInfo.color === category.color ? '#333' : '#ddd'
              }; border-radius: 4px; padding: 0.5rem; cursor: pointer; text-align: center;">
                <div style="width: 100%; height: 30px; background-color: ${
                  colorInfo.color
                }; border-radius: 4px; margin-bottom: 0.25rem;"></div>
                <div style="font-size: 0.75rem;">${colorInfo.name}</div>
              </div>`
          ).join('')}
        </div>
      </div>
    `;

    const modal = new Modal({
      title: 'Edit Category',
      content: content,
      size: 'medium',
      actions: [
        {
          label: 'Cancel',
          className: 'btn-outline',
          onClick: (modal) => modal.close(),
        },
        {
          label: 'Save Changes',
          className: 'btn-primary',
          onClick: (modal) => {
            const newName = document
              .getElementById('edit-category-name')
              .value.trim();
            const newColor = document.querySelector('.color-card.selected')
              ?.dataset.color;

            if (!newName) {
              alert('Please enter a category name');
              return;
            }

            if (newName.length > 50) {
              alert('Category name must be 50 characters or less');
              return;
            }

            category.name = newName;
            category.color = newColor || category.color;

            this.state.set('lifeCategories', categories);

            // Save immediately before reload
            this.state.save();
            modal.close();

            // Reload page to stay on settings
            window.location.hash = '#/settings';
            window.location.reload();
          },
        },
      ],
    });

    modal.open();

    // Add event listeners after modal is open
    setTimeout(() => {
      // Color picker
      document.querySelectorAll('.color-card').forEach((card) => {
        card.addEventListener('click', () => {
          document.querySelectorAll('.color-card').forEach((c) => {
            c.classList.remove('selected');
            c.style.border = '2px solid #ddd';
          });
          card.classList.add('selected');
          card.style.border = '2px solid #333';
        });
      });

      // Character counter
      const nameInput = document.getElementById('edit-category-name');
      const counter = document.getElementById('edit-category-name-counter');
      nameInput?.addEventListener('input', () => {
        const count = nameInput.value.length;
        counter.textContent = `${count} / 50`;
        counter.classList.toggle('error', count > 50);
      });
    }, 50);
  }

  async deleteCategory(categoryId) {
    const categories = this.state.get('lifeCategories') || [];
    const category = categories.find((c) => c.id === categoryId);

    if (!category) return;

    // Check if category is in use
    const resolutions = this.state.get('resolutions') || [];
    const usageCount = resolutions.filter(
      (r) => r.lifeCategoryId === categoryId
    ).length;

    let message = `Are you sure you want to delete "${category.name}"?`;
    if (usageCount > 0) {
      message += ` This category is used in ${usageCount} resolution${
        usageCount > 1 ? 's' : ''
      }. Those resolutions will have no category.`;
    }

    const confirmed = await showConfirmDialog({
      title: 'Delete Category',
      message: message,
      confirmLabel: 'Delete',
      dangerous: true,
    });

    if (!confirmed) return;

    // Remove category
    const updatedCategories = categories.filter((c) => c.id !== categoryId);

    // Update resolutions to remove this category
    const updatedResolutions = resolutions.map((r) => {
      if (r.lifeCategoryId === categoryId) {
        return { ...r, lifeCategoryId: null, updatedAt: getCurrentTimestamp() };
      }
      return r;
    });

    this.state.update({
      lifeCategories: updatedCategories,
      resolutions: updatedResolutions,
    });

    // Save immediately before reload
    this.state.save();

    // Reload page to stay on settings
    window.location.hash = '#/settings';
    window.location.reload();
  }

  // Display preference methods
  updateDisplayPreference(key, value) {
    const currentProfileId = this.state.get('currentProfileId');
    const preferences = this.state.get('preferences') || {};
    const currentPreferences =
      preferences[currentProfileId] ||
      createDefaultPreferences(currentProfileId);

    currentPreferences.displayOptions[key] = value;
    preferences[currentProfileId] = currentPreferences;

    this.state.set('preferences', preferences);
  }

  // Data management methods
  exportData() {
    const data = {
      version: this.state.get('version'),
      exportDate: getCurrentTimestamp(),
      profiles: this.state.get('profiles'),
      resolutions: this.state.get('resolutions'),
      lifeCategories: this.state.get('lifeCategories'),
      bingoCards: this.state.get('bingoCards'),
      preferences: this.state.get('preferences'),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `resolution-bingo-backup-${
      new Date().toISOString().split('T')[0]
    }.json`;
    a.click();

    URL.revokeObjectURL(url);

    // Update last backup timestamp
    this.state.set('lastBackup', getCurrentTimestamp());

    showAlertDialog({
      title: 'Export Successful',
      message: 'Your data has been exported successfully!',
    });
  }

  triggerImport() {
    document.getElementById('import-file-input')?.click();
  }

  async importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedData = JSON.parse(text);

      // Validate structure
      if (!importedData.profiles || !Array.isArray(importedData.profiles)) {
        throw new Error('Invalid file format');
      }

      // Merge data
      const currentProfiles = this.state.get('profiles') || [];
      const currentResolutions = this.state.get('resolutions') || [];
      const currentCategories = this.state.get('lifeCategories') || [];
      const currentCards = this.state.get('bingoCards') || [];
      const currentPreferences = this.state.get('preferences') || {};

      const mergedProfiles = mergeByUUID(
        currentProfiles,
        importedData.profiles || []
      );
      const mergedResolutions = mergeByUUID(
        currentResolutions,
        importedData.resolutions || []
      );
      const mergedCategories = mergeByUUID(
        currentCategories,
        importedData.lifeCategories || []
      );
      const mergedCards = mergeByUUID(
        currentCards,
        importedData.bingoCards || []
      );

      // Merge preferences
      const mergedPreferences = { ...currentPreferences };
      Object.keys(importedData.preferences || {}).forEach((profileId) => {
        mergedPreferences[profileId] = importedData.preferences[profileId];
      });

      // Update state
      this.state.update({
        profiles: mergedProfiles,
        resolutions: mergedResolutions,
        lifeCategories: mergedCategories,
        bingoCards: mergedCards,
        preferences: mergedPreferences,
      });

      const newResolutionsCount = (importedData.resolutions || []).length;
      const newCardsCount = (importedData.bingoCards || []).length;
      const newProfilesCount = (importedData.profiles || []).length;

      await showAlertDialog({
        title: 'Import Successful',
        message: `Imported ${newResolutionsCount} resolutions, ${newCardsCount} bingo cards across ${newProfilesCount} profiles.`,
      });

      // Reload page
      window.location.reload();
    } catch (error) {
      console.error('Import error:', error);
      await showAlertDialog({
        title: 'Import Failed',
        message: 'Unable to load from your file: invalid json',
      });
    }

    // Reset file input
    event.target.value = '';
  }

  async clearAllData() {
    const confirmed = await showConfirmDialog({
      title: 'Clear All Data',
      message:
        '⚠️ WARNING: This will permanently delete ALL profiles, resolutions, categories, and bingo cards. This cannot be undone. Are you absolutely sure?',
      confirmLabel: 'Delete Everything',
      dangerous: true,
    });

    if (!confirmed) return;

    // Double confirmation
    const doubleConfirmed = await showConfirmDialog({
      title: 'Final Confirmation',
      message:
        'This is your last chance. All data will be permanently lost. Do you want to proceed?',
      confirmLabel: 'Yes, Delete Everything',
      dangerous: true,
    });

    if (!doubleConfirmed) return;

    // Clear all data
    this.state.clear();

    // Reload to welcome page
    window.location.hash = '#/welcome';
    window.location.reload();
  }
}
