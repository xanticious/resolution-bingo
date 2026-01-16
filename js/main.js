// Main application entry point
import { Router } from './router.js';
import { State } from './state.js';
import { Storage } from './storage.js';

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
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
  });
} else {
  window.app = new App();
}
