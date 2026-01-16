// Hash-based router for single-page navigation
export class Router {
  constructor(state) {
    this.state = state;
    this.routes = new Map();
    this.currentPage = null;
    this.mainContainer = document.getElementById('app-main');
  }

  addRoute(path, pageClass) {
    // Convert path pattern to regex
    const pattern = path.replace(/:[^\s/]+/g, '([^/]+)').replace(/\//g, '\\/');
    const regex = new RegExp(`^${pattern}$`);

    this.routes.set(regex, { path, pageClass });
  }

  start() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';

    // Find matching route
    let match = null;
    let params = {};

    for (const [regex, route] of this.routes) {
      const matches = hash.match(regex);
      if (matches) {
        match = route;

        // Extract parameters
        const paramNames = route.path.match(/:[^\s/]+/g) || [];
        paramNames.forEach((param, index) => {
          const paramName = param.slice(1);
          params[paramName] = matches[index + 1];
        });
        break;
      }
    }

    if (match) {
      this.loadPage(match.pageClass, params);
    } else {
      // 404 - redirect to home
      window.location.hash = '#/';
    }
  }

  async loadPage(PageClass, params = {}) {
    // Unmount current page
    if (this.currentPage && typeof this.currentPage.unmount === 'function') {
      this.currentPage.unmount();
    }

    // Clear main container
    this.mainContainer.innerHTML = '';

    // Create and mount new page
    this.currentPage = new PageClass(this.state, params);
    const pageElement = await this.currentPage.render();
    this.mainContainer.appendChild(pageElement);

    // Call mount lifecycle method if exists
    if (typeof this.currentPage.mount === 'function') {
      this.currentPage.mount();
    }

    // Update page title
    if (this.currentPage.title) {
      document.title = `${this.currentPage.title} - Resolution Bingo`;
    }
  }

  navigate(path) {
    window.location.hash = `#${path}`;
  }
}
