// Welcome Page - First visit onboarding
import {
  generateUUID,
  getCurrentTimestamp,
  getOpenMojiHTML,
  createDefaultCategories,
} from '../utils.js';

export class WelcomePage {
  constructor(state, params) {
    this.state = state;
    this.params = params;
    this.title = 'Welcome';
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page welcome-page';
    container.setAttribute('data-testid', 'welcome-page');
    container.innerHTML = `
            <div class="welcome-icon">${getOpenMojiHTML(
              '1F3AF',
              'target'
            )}</div>
            <h1 class="welcome-title">Welcome to Resolution Bingo!</h1>
            <p class="welcome-description">
                Transform your New Year's resolutions into fun, printable bingo cards. 
                Track your goals in a visual, engaging way that's hard to ignore!
            </p>
            <div class="welcome-form">
                <div class="form-group">
                    <label class="form-label" for="welcome-name-input">What's your name?</label>
                    <input 
                        type="text" 
                        id="welcome-name-input" 
                        class="form-input" 
                        placeholder="Enter your name"
                        maxlength="50"
                        autofocus
                        data-testid="profile-name-input"
                    />
                    <span class="form-helper">We'll use this to create your profile</span>
                </div>
                <button class="btn btn-primary btn-lg" id="get-started-btn" data-testid="get-started-btn">
                    Get Started ${getOpenMojiHTML('1F680', 'rocket')}
                </button>
            </div>
        `;

    return container;
  }

  mount() {
    const nameInput = document.getElementById('welcome-name-input');
    const getStartedBtn = document.getElementById('get-started-btn');

    getStartedBtn.addEventListener('click', () => {
      this.createProfile(nameInput.value.trim());
    });

    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.createProfile(nameInput.value.trim());
      }
    });
  }

  createProfile(name) {
    if (!name) {
      alert('Please enter your name');
      return;
    }

    const profile = {
      id: generateUUID(),
      name: name,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    const profiles = this.state.get('profiles') || [];
    profiles.push(profile);

    const preferences = this.state.get('preferences') || {};
    preferences[profile.id] = {
      displayOptions: {
        showExcitementLevel: true,
        showFrequency: true,
        showLifeCategory: true,
      },
      resolutionView: 'cards',
      hasSeenWelcome: true,
    };

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

    // Redirect to main page
    window.location.hash = '#/';
  }

  unmount() {
    // Cleanup if needed
  }
}
