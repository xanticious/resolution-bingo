// Bingo Card View Page - View and print a single card
import { getOpenMojiHTML } from '../utils.js';

export class BingoCardViewPage {
  constructor(state, params) {
    this.state = state;
    this.params = params;
    this.title = 'View Bingo Card';
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page bingo-card-view-page';
    container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">2026 Goals</h1>
                <p class="page-description">View and print your bingo card</p>
            </div>

            <div class="bingo-card-viewer">
                <div class="card">
                    ${this.renderBingoCard()}
                </div>

                <div class="print-options">
                    <h3 class="mb-md">Print Options</h3>
                    <div class="print-options-grid">
                        <div class="form-group">
                            <label class="form-label">Card Size</label>
                            <select class="form-select">
                                <option value="full">Full Page (8.5x11)</option>
                                <option value="5x5">5" x 5"</option>
                                <option value="6x6">6" x 6"</option>
                                <option value="7x7">7" x 7"</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Color Mode</label>
                            <select class="form-select">
                                <option value="color">Color</option>
                                <option value="grayscale">Grayscale</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-center mt-lg">
                        <button class="btn btn-primary btn-lg" onclick="window.print()">
                            ${getOpenMojiHTML('1F5A8', 'printer')} Print Card
                        </button>
                    </div>
                </div>

                <div class="bingo-card-actions">
                    <a href="#/bingo-card/${
                      this.params.id
                    }/edit" class="btn btn-outline">✏️ Edit</a>
                    <button class="btn btn-outline">📋 Copy</button>
                    <button class="btn btn-danger">🗑️ Delete</button>
                    <a href="#/bingo-cards" class="btn btn-secondary">← Back to Cards</a>
                </div>
            </div>
        `;

    return container;
  }

  renderBingoCard() {
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

    const squares = sampleTexts
      .map((text, index) => {
        const isFree = index === 12;
        return `
                <div class="bingo-square ${isFree ? 'free-square' : ''}">
                    ${isFree ? '⭐ FREE' : text}
                </div>
            `;
      })
      .join('');

    return `
            <div class="bingo-card theme-flowers font-silly">
                <h2 class="bingo-card-title">2026 Bingo</h2>
                <div class="bingo-grid">
                    ${squares}
                </div>
            </div>
        `;
  }

  mount() {
    // Event listeners
  }

  unmount() {
    // Cleanup
  }
}
