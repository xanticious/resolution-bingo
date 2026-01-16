// Bingo Cards List Page
import { getOpenMojiHTML } from '../utils.js';

export class BingoCardsListPage {
  constructor(state, params) {
    this.state = state;
    this.params = params;
    this.title = 'My Bingo Cards';
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page bingo-cards-list-page';

    const cards = this.getCardsForCurrentProfile();

    if (cards.length === 0) {
      container.innerHTML = this.renderEmptyState();
    } else {
      container.innerHTML = this.renderCardsList();
    }

    return container;
  }

  renderEmptyState() {
    return `
            <div class="empty-state">
                <div class="empty-state-icon">🎯</div>
                <h2 class="empty-state-title">No Bingo Cards Yet</h2>
                <p class="empty-state-description">
                    Create your first bingo card to start tracking your resolutions in a fun way!
                </p>
                <a href="#/bingo-card/new" class="btn btn-primary btn-lg">
                    ${getOpenMojiHTML('2795', 'plus')} Create Your First Card
                </a>
            </div>
        `;
  }

  renderCardsList() {
    return `
            <div class="page-header">
                <h1 class="page-title">My Bingo Cards</h1>
                <p class="page-description">View and manage your collection</p>
            </div>

            <div class="action-bar">
                <div></div>
                <a href="#/bingo-card/new" class="btn btn-primary">
                    ${getOpenMojiHTML('2795', 'plus')} Create New Card
                </a>
            </div>

            <div class="bingo-cards-grid">
                ${this.renderSampleCards()}
            </div>
        `;
  }

  renderSampleCards() {
    return `
            <div class="bingo-card-thumbnail">
                <div class="thumbnail-preview">${getOpenMojiHTML(
                  '1F338',
                  'cherry blossom'
                )}</div>
                <h3 class="thumbnail-title">2026 Goals</h3>
                <p class="text-muted">Created Jan 15, 2026</p>
                <div class="thumbnail-actions">
                    <a href="#/bingo-card/sample-1" class="btn btn-sm btn-primary">View</a>
                    <button class="btn btn-sm btn-outline">Copy</button>
                    <button class="btn btn-sm btn-danger">Delete</button>
                </div>
            </div>

            <div class="bingo-card-thumbnail">
                <div class="thumbnail-preview">${getOpenMojiHTML(
                  '1F496',
                  'sparkling heart'
                )}</div>
                <h3 class="thumbnail-title">Health Journey</h3>
                <p class="text-muted">Created Jan 10, 2026</p>
                <div class="thumbnail-actions">
                    <a href="#/bingo-card/sample-2" class="btn btn-sm btn-primary">View</a>
                    <button class="btn btn-sm btn-outline">Copy</button>
                    <button class="btn btn-sm btn-danger">Delete</button>
                </div>
            </div>

            <div class="bingo-card-thumbnail">
                <div class="thumbnail-preview">${getOpenMojiHTML(
                  '1F52C',
                  'microscope'
                )}</div>
                <h3 class="thumbnail-title">Learning Goals</h3>
                <p class="text-muted">Created Jan 5, 2026</p>
                <div class="thumbnail-actions">
                    <a href="#/bingo-card/sample-3" class="btn btn-sm btn-primary">View</a>
                    <button class="btn btn-sm btn-outline">Copy</button>
                    <button class="btn btn-sm btn-danger">Delete</button>
                </div>
            </div>
        `;
  }

  getCardsForCurrentProfile() {
    const currentProfileId = this.state.get('currentProfileId');
    const allCards = this.state.get('bingoCards') || [];
    return allCards.filter((c) => c.profileId === currentProfileId);
  }

  mount() {
    // Event listeners would go here
  }

  unmount() {
    // Cleanup
  }
}
