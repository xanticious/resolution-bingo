// Main application entry point
import { Router } from './router.js';
import { State } from './state.js';
import { Storage } from './storage.js';
import {
  createProfile,
  createDefaultPreferences,
  createDefaultCategories,
} from './utils.js';
import { showPromptDialog } from './components/Modal.js';

// Import pages
import { WelcomePage } from './pages/WelcomePage.js';
import { ResolutionsPage } from './pages/ResolutionsPage.js';
import { BingoCardCreatorPage } from './pages/BingoCardCreatorPage.js';
import { BingoCardsListPage } from './pages/BingoCardsListPage.js';
import { BingoCardViewPage } from './pages/BingoCardViewPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { HelpPage } from './pages/HelpPage.js';

class App {
  constructor() {
    this.storage = new Storage();
    this.state = new State(this.storage);
    this.router = new Router(this.state);

    this.init();
  }

  init() {
    // Register routes
    this.router.addRoute('/', ResolutionsPage);
    this.router.addRoute('/resolutions', ResolutionsPage);
    this.router.addRoute('/welcome', WelcomePage);
    this.router.addRoute('/bingo-cards', BingoCardsListPage);
    this.router.addRoute('/bingo-card/new', BingoCardCreatorPage);
    this.router.addRoute('/bingo-card/:id', BingoCardViewPage);
    this.router.addRoute('/bingo-card/:id/edit', BingoCardCreatorPage);
    this.router.addRoute('/settings', SettingsPage);
    this.router.addRoute('/help', HelpPage);

    // Setup profile dropdown
    this.setupProfileDropdown();

    // Update navigation active state
    this.setupNavigation();

    // Start the router
    this.router.start();

    // Check if first visit
    this.checkFirstVisit();
  }

  checkFirstVisit() {
    const profiles = this.state.get('profiles') || [];
    if (profiles.length === 0) {
      // First visit - redirect to welcome
      window.location.hash = '#/welcome';
    }
  }

  setupNavigation() {
    // Update active nav link based on current page
    window.addEventListener('hashchange', () => {
      this.updateActiveNav();
    });
    this.updateActiveNav();
  }

  updateActiveNav() {
    const hash = window.location.hash || '#/';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (hash === href || (hash === '#/' && href === '#/')) {
        link.classList.add('active');
      } else if (hash.startsWith('#/bingo-card') && href === '#/bingo-cards') {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setupProfileDropdown() {
    const profileIndicator = document.getElementById('profile-indicator');
    const profileDropdown = document.getElementById('profile-dropdown');
    const profileName = document.getElementById('profile-name');

    if (!profileIndicator || !profileDropdown || !profileName) return;

    // Update profile name display
    this.updateProfileDisplay();

    // Subscribe to profile changes
    this.state.subscribe('currentProfileId', () => {
      this.updateProfileDisplay();
      this.populateProfileDropdown();
    });

    this.state.subscribe('profiles', () => {
      this.updateProfileDisplay();
      this.populateProfileDropdown();
    });

    // Toggle dropdown on click
    profileIndicator.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('open');
      if (profileDropdown.classList.contains('open')) {
        this.populateProfileDropdown();
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!profileIndicator.contains(e.target)) {
        profileDropdown.classList.remove('open');
      }
    });

    // Populate initial dropdown
    this.populateProfileDropdown();
  }

  updateProfileDisplay() {
    const profileName = document.getElementById('profile-name');
    if (!profileName) return;

    const currentProfileId = this.state.get('currentProfileId');
    const profiles = this.state.get('profiles') || [];
    const currentProfile = profiles.find((p) => p.id === currentProfileId);

    if (currentProfile) {
      profileName.textContent = currentProfile.name;
    } else if (profiles.length > 0) {
      // If no current profile but profiles exist, set the first one
      this.state.set('currentProfileId', profiles[0].id);
      profileName.textContent = profiles[0].name;
    } else {
      profileName.textContent = 'No Profile';
    }
  }

  populateProfileDropdown() {
    const profileDropdown = document.getElementById('profile-dropdown');
    if (!profileDropdown) return;

    const currentProfileId = this.state.get('currentProfileId');
    const profiles = this.state.get('profiles') || [];

    if (profiles.length === 0) {
      profileDropdown.innerHTML = `
        <div class="profile-dropdown-item">No profiles</div>
        <div class="profile-dropdown-divider"></div>
        <div 
          class="profile-dropdown-item profile-dropdown-action" 
          data-action="create-profile"
          data-testid="profile-dropdown-create"
        >
          + Create New Profile
        </div>
      `;
      // Add click handlers even when no profiles
      profileDropdown
        .querySelectorAll('.profile-dropdown-item')
        .forEach((item) => {
          const action = item.dataset.action;
          if (action === 'create-profile') {
            item.addEventListener('click', (e) => {
              profileDropdown.classList.remove('open');
              this.createNewProfileFromHeader();
            });
          }
        });
      return;
    }

    profileDropdown.innerHTML =
      profiles
        .map((profile) => {
          const isActive = profile.id === currentProfileId;
          return `
          <div 
            class="profile-dropdown-item ${isActive ? 'active' : ''}" 
            data-profile-id="${profile.id}"
            data-testid="profile-dropdown-item-${profile.id}"
          >
            ${profile.name}
          </div>
        `;
        })
        .join('') +
      `
        <div class="profile-dropdown-divider"></div>
        <div 
          class="profile-dropdown-item profile-dropdown-action" 
          data-action="create-profile"
          data-testid="profile-dropdown-create"
        >
          + Create New Profile
        </div>
      `;

    // Add click handlers to dropdown items
    profileDropdown
      .querySelectorAll('.profile-dropdown-item')
      .forEach((item) => {
        const profileId = item.dataset.profileId;
        const action = item.dataset.action;

        item.addEventListener('click', (e) => {
          if (action === 'create-profile') {
            profileDropdown.classList.remove('open');
            this.createNewProfileFromHeader();
          } else if (profileId && profileId !== currentProfileId) {
            this.switchProfile(profileId);
            profileDropdown.classList.remove('open');
          }
        });
      });
  }

  switchProfile(profileId) {
    const profiles = this.state.get('profiles') || [];
    const profile = profiles.find((p) => p.id === profileId);

    if (!profile) return;

    this.state.set('currentProfileId', profileId);

    // Save immediately before reload (don't wait for debounced save)
    this.state.save();

    // Reload the page to reflect new profile data
    window.location.reload();
  }

  async createNewProfileFromHeader() {
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

    this.state.update({
      profiles: profiles,
      currentProfileId: profile.id,
      preferences: preferences,
      lifeCategories: categories,
    });

    // Save immediately before reload (don't wait for debounced save)
    this.state.save();

    // If on welcome page, redirect to resolutions; otherwise just reload
    if (window.location.hash === '#/welcome') {
      window.location.hash = '#/';
    }
    window.location.reload();
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
  });
} else {
  window.app = new App();
}
