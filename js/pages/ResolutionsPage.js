// Resolutions Page - Main page for managing resolutions
import { getOpenMojiHTML, EXCITEMENT_EMOJIS } from '../utils.js';

export class ResolutionsPage {
  constructor(state, params) {
    this.state = state;
    this.params = params;
    this.title = 'Resolutions';
    this.viewMode = 'cards'; // cards, table, list
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page resolutions-page';

    const resolutions = this.getResolutionsForCurrentProfile();

    if (resolutions.length === 0) {
      container.innerHTML = this.renderEmptyState();
    } else {
      container.innerHTML = this.renderResolutionsList();
    }

    return container;
  }

  renderEmptyState() {
    return `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h2 class="empty-state-title">No Resolutions Yet</h2>
                <p class="empty-state-description">
                    Start by adding your first resolution! You can also visit Settings to 
                    customize your life categories and colors.
                </p>
                <div class="flex gap-md justify-center">
                    <button class="btn btn-primary btn-lg" onclick="alert('Add resolution feature coming soon!')">
                        ${getOpenMojiHTML(
                          '2795',
                          'plus'
                        )} Add Your First Resolution
                    </button>
                    <a href="#/settings" class="btn btn-outline btn-lg">
                        ${getOpenMojiHTML('2699', 'gear')} Go to Settings
                    </a>
                </div>
            </div>
        `;
  }

  renderResolutionsList() {
    return `
            <div class="page-header">
                <h1 class="page-title">My Resolutions</h1>
                <p class="page-description">Manage your goals and create bingo cards</p>
            </div>

            <div class="action-bar">
                <div class="action-group">
                    <div class="view-toggle">
                        <button class="view-toggle-btn active" data-view="cards">${getOpenMojiHTML(
                          '1F5C2',
                          'card index'
                        )} Cards</button>
                        <button class="view-toggle-btn" data-view="table">${getOpenMojiHTML(
                          '1F4CA',
                          'bar chart'
                        )} Table</button>
                        <button class="view-toggle-btn" data-view="list">${getOpenMojiHTML(
                          '1F4CB',
                          'clipboard'
                        )} List</button>
                    </div>
                </div>
                <div class="action-group">
                    <button class="btn btn-secondary" onclick="alert('Add resolution feature coming soon!')">
                        ${getOpenMojiHTML('2795', 'plus')} Add Resolution
                    </button>
                    <a href="#/bingo-card/new" class="btn btn-primary">
                        ${getOpenMojiHTML('1F3AF', 'target')} Create Bingo Card
                    </a>
                </div>
            </div>

            <div class="filter-bar">
                <div class="filter-group">
                    <span class="filter-label">Filter:</span>
                    <div class="filter-options">
                        <button class="filter-option active">All</button>
                        <button class="filter-option">Recurring</button>
                        <button class="filter-option">Single Occurrence</button>
                        <button class="filter-option">😄 Excited</button>
                        <button class="filter-option">😐 Neutral</button>
                        <button class="filter-option">😰 Dreading</button>
                    </div>
                </div>
            </div>

            <div id="resolutions-container">
                ${this.renderSampleCards()}
            </div>
        `;
  }

  renderSampleCards() {
    return `
            <div class="resolutions-grid">
                <div class="resolution-card" style="border-left-color: #27AE60;">
                    <div class="resolution-text">Exercise 3 times a week</div>
                    <div class="resolution-meta">
                        <span class="badge badge-category" style="background-color: #27AE60;">Health</span>
                        <span class="badge badge-frequency">Recurring</span>
                        <span class="badge badge-excitement badge-excitement-5">😄 Really excited</span>
                    </div>
                </div>

                <div class="resolution-card" style="border-left-color: #2980B9;">
                    <div class="resolution-text">Read 12 books this year</div>
                    <div class="resolution-meta">
                        <span class="badge badge-category" style="background-color: #2980B9;">Education</span>
                        <span class="badge badge-frequency">Recurring</span>
                        <span class="badge badge-excitement badge-excitement-4">🙂 Feeling good</span>
                    </div>
                </div>

                <div class="resolution-card" style="border-left-color: #E91E63;">
                    <div class="resolution-text">Visit a new city</div>
                    <div class="resolution-meta">
                        <span class="badge badge-category" style="background-color: #E91E63;">Travel</span>
                        <span class="badge badge-frequency">Single Occurrence</span>
                        <span class="badge badge-excitement badge-excitement-5">😄 Really excited</span>
                    </div>
                </div>

                <div class="resolution-card" style="border-left-color: #E67E22;">
                    <div class="resolution-text">Organize the garage</div>
                    <div class="resolution-meta">
                        <span class="badge badge-category" style="background-color: #E67E22;">Self-Care</span>
                        <span class="badge badge-frequency">Single Occurrence</span>
                        <span class="badge badge-excitement badge-excitement-1">😰 Dreading</span>
                    </div>
                </div>

                <div class="resolution-card" style="border-left-color: #8E44AD;">
                    <div class="resolution-text">Learn to paint watercolors</div>
                    <div class="resolution-meta">
                        <span class="badge badge-category" style="background-color: #8E44AD;">Creative</span>
                        <span class="badge badge-frequency">Recurring</span>
                        <span class="badge badge-excitement badge-excitement-5">😄 Really excited</span>
                    </div>
                </div>

                <div class="resolution-card" style="border-left-color: #16A085;">
                    <div class="resolution-text">Call mom every Sunday</div>
                    <div class="resolution-meta">
                        <span class="badge badge-category" style="background-color: #16A085;">Social</span>
                        <span class="badge badge-frequency">Recurring</span>
                        <span class="badge badge-excitement badge-excitement-3">😐 Neutral</span>
                    </div>
                </div>
            </div>
        `;
  }

  getResolutionsForCurrentProfile() {
    const currentProfileId = this.state.get('currentProfileId');
    const allResolutions = this.state.get('resolutions') || [];
    return allResolutions.filter((r) => r.profileId === currentProfileId);
  }

  mount() {
    // Add event listeners for view toggle
    const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
    viewToggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        viewToggleBtns.forEach((b) => b.classList.remove('active'));
        e.target.classList.add('active');
        // View switching logic would go here
      });
    });
  }

  unmount() {
    // Cleanup
  }
}
