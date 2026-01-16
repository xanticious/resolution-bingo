// Settings Page
import { getOpenMojiHTML } from '../utils.js';

export class SettingsPage {
  constructor(state, params) {
    this.state = state;
    this.params = params;
    this.title = 'Settings';
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page settings-page';
    container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Settings</h1>
                <p class="page-description">Manage your profile and preferences</p>
            </div>

            <div class="settings-section">
                <h2 class="settings-section-title">Profile Management</h2>
                <div class="form-group">
                    <label class="form-label">Current Profile</label>
                    <select class="form-select">
                        <option>John</option>
                        <option>Add another option in Settings</option>
                    </select>
                </div>
                <div class="flex gap-md">
                    <button class="btn btn-primary">${getOpenMojiHTML(
                      '2795',
                      'plus'
                    )} Create New Profile</button>
                    <button class="btn btn-outline">${getOpenMojiHTML(
                      '270F',
                      'pencil'
                    )} Rename Profile</button>
                    <button class="btn btn-danger" disabled>${getOpenMojiHTML(
                      '1F5D1',
                      'wastebasket'
                    )} Delete Profile</button>
                </div>
            </div>

            <div class="settings-section">
                <h2 class="settings-section-title">Life Categories</h2>
                <p class="text-muted mb-md">Customize the categories you use to organize your resolutions</p>
                
                <div class="category-list">
                    <div class="category-item">
                        <div class="category-info">
                            <div class="category-color-swatch" style="background-color: #27AE60;"></div>
                            <span class="category-name">Health</span>
                        </div>
                        <div class="category-actions">
                            <button class="btn btn-sm btn-outline">Edit</button>
                            <button class="btn btn-sm btn-danger">Delete</button>
                        </div>
                    </div>

                    <div class="category-item">
                        <div class="category-info">
                            <div class="category-color-swatch" style="background-color: #2980B9;"></div>
                            <span class="category-name">Education</span>
                        </div>
                        <div class="category-actions">
                            <button class="btn btn-sm btn-outline">Edit</button>
                            <button class="btn btn-sm btn-danger">Delete</button>
                        </div>
                    </div>

                    <div class="category-item">
                        <div class="category-info">
                            <div class="category-color-swatch" style="background-color: #E91E63;"></div>
                            <span class="category-name">Travel</span>
                        </div>
                        <div class="category-actions">
                            <button class="btn btn-sm btn-outline">Edit</button>
                            <button class="btn btn-sm btn-danger">Delete</button>
                        </div>
                    </div>
                </div>

                <button class="btn btn-secondary mt-md">${getOpenMojiHTML(
                  '2795',
                  'plus'
                )} Add Category</button>
            </div>

            <div class="settings-section">
                <h2 class="settings-section-title">Display Preferences</h2>
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" checked> Show Excitement Level
                    </label>
                </div>
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" checked> Show Frequency
                    </label>
                </div>
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" checked> Show Life Category
                    </label>
                </div>
            </div>

            <div class="settings-section">
                <h2 class="settings-section-title">Data Management</h2>
                <p class="text-muted mb-md">Backup and restore your data</p>
                <div class="flex gap-md flex-wrap">
                    <button class="btn btn-primary">${getOpenMojiHTML(
                      '1F4E5',
                      'inbox tray'
                    )} Export Data</button>
                    <button class="btn btn-outline">${getOpenMojiHTML(
                      '1F4E4',
                      'outbox tray'
                    )} Import Data</button>
                    <button class="btn btn-danger">${getOpenMojiHTML(
                      '1F5D1',
                      'wastebasket'
                    )} Clear All Data</button>
                </div>
                <p class="text-muted mt-md">
                    <small>Last backup: Never</small>
                </p>
            </div>

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

    return container;
  }

  mount() {
    // Event listeners
  }

  unmount() {
    // Cleanup
  }
}
