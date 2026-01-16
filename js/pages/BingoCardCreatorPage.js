// Bingo Card Creator Page
import { getOpenMojiHTML } from '../utils.js';

export class BingoCardCreatorPage {
  constructor(state, params) {
    this.state = state;
    this.params = params;
    this.title = params.id ? 'Edit Bingo Card' : 'Create Bingo Card';
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page bingo-creator-page';
    container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">${this.title}</h1>
                <p class="page-description">Design your custom bingo card</p>
            </div>

            <div class="bingo-creator-layout">
                <div class="creator-panel">
                    <div class="creator-section">
                        <h3 class="section-title">Card Details</h3>
                        <div class="form-group">
                            <label class="form-label">Save Name</label>
                            <input type="text" class="form-input" placeholder="My 2026 Goals" maxlength="30">
                            <span class="char-counter">0 / 30</span>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Printed Title</label>
                            <input type="text" class="form-input" placeholder="2026 Bingo" maxlength="30">
                            <span class="char-counter">0 / 30</span>
                        </div>
                    </div>

                    <div class="creator-section">
                        <h3 class="section-title">Visual Style</h3>
                        <div class="form-group">
                            <label class="form-label">Design Theme</label>
                            <select class="form-select" id="theme-select">
                                <option value="flowers">Flowers</option>
                                <option value="cute">Cute</option>
                                <option value="science">Science</option>
                                <option value="mathy">Mathy</option>
                                <option value="animals">Animals</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Font Style</label>
                            <select class="form-select" id="font-select">
                                <option value="silly">Silly</option>
                                <option value="fancy">Fancy</option>
                                <option value="writer">Writer</option>
                                <option value="headlines">Headlines</option>
                            </select>
                        </div>
                    </div>

                    <div class="creator-section">
                        <h3 class="section-title">Actions</h3>
                        <div class="flex flex-col gap-md">
                            <button class="btn btn-secondary">${getOpenMojiHTML(
                              '1F500',
                              'shuffle'
                            )} Shuffle</button>
                            <button class="btn btn-primary">${getOpenMojiHTML(
                              '1F4BE',
                              'floppy disk'
                            )} Save Card</button>
                            <a href="#/bingo-cards" class="btn btn-outline">Cancel</a>
                        </div>
                    </div>
                </div>

                <div class="preview-panel">
                    <div class="card">
                        <h3 class="text-center mb-md">Live Preview</h3>
                        <div class="bingo-preview-container" id="bingo-preview">
                            ${this.renderBingoPreview()}
                        </div>
                    </div>
                </div>
            </div>
        `;

    return container;
  }

  renderBingoPreview() {
    return `
            <div class="bingo-card theme-flowers font-silly">
                <h2 class="bingo-card-title">2026 Bingo</h2>
                <div class="bingo-grid">
                    ${this.generateSampleSquares()}
                </div>
            </div>
        `;
  }

  generateSampleSquares() {
    const sampleTexts = [
      'Exercise 3x/week',
      'Read 12 books',
      'Visit new city',
      'Learn painting',
      'Call mom weekly',
      'Organize garage',
      'Try new recipe',
      'Meditate daily',
      'Save $1000',
      'Learn guitar',
      'Volunteer monthly',
      'Plant garden',
      'FREE',
      'Run 5K',
      'Write journal',
      'Take photos',
      'Cook healthy',
      'Visit museum',
      'Learn language',
      'Declutter home',
      'Start podcast',
      'Join book club',
      'Bike to work',
      'Attend concert',
      'Make new friend',
    ];

    return sampleTexts
      .map((text, index) => {
        const isFree = index === 12;
        return `
                <div class="bingo-square ${
                  isFree ? 'free-square' : ''
                }" data-position="${index}">
                    ${isFree ? '⭐ FREE' : text}
                </div>
            `;
      })
      .join('');
  }

  mount() {
    // Add event listeners for theme/font changes
    const themeSelect = document.getElementById('theme-select');
    const fontSelect = document.getElementById('font-select');

    themeSelect?.addEventListener('change', (e) => {
      const bingoCard = document.querySelector('.bingo-card');
      bingoCard.className = `bingo-card theme-${e.target.value} font-${fontSelect.value}`;
    });

    fontSelect?.addEventListener('change', (e) => {
      const bingoCard = document.querySelector('.bingo-card');
      bingoCard.className = `bingo-card theme-${themeSelect.value} font-${e.target.value}`;
    });
  }

  unmount() {
    // Cleanup
  }
}
