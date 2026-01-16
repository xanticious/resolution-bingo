// Welcome Page - First visit onboarding
import {
  generateUUID,
  getCurrentTimestamp,
  getOpenMojiHTML,
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
                    <label class="form-label" for="profile-name">What's your name?</label>
                    <input 
                        type="text" 
                        id="profile-name" 
                        class="form-input" 
                        placeholder="Enter your name"
                        maxlength="50"
                        autofocus
                    />
                    <span class="form-helper">We'll use this to create your profile</span>
                </div>
                <button class="btn btn-primary btn-lg" id="get-started-btn">
                    Get Started ${getOpenMojiHTML('1F680', 'rocket')}
                </button>
            </div>
        `;

    return container;
  }

  mount() {
    const nameInput = document.getElementById('profile-name');
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

    this.state.update({
      profiles: profiles,
      currentProfileId: profile.id,
      preferences: preferences,
    });

    // Update header
    document.getElementById('profile-indicator').textContent = name;

    // Redirect to main page
    window.location.hash = '#/';
  }

  unmount() {
    // Cleanup if needed
  }
}
