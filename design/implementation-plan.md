# Resolution Bingo - Implementation Plan

**Version:** 1.0  
**Date:** January 15, 2026  
**Project:** Resolution Bingo Web Application

---

## 1. Project Overview

This implementation plan outlines the development approach for Resolution Bingo, a static web application built with vanilla JavaScript, HTML, and CSS. The project will be developed in phases, starting with core functionality and progressively adding features.

**Development Timeline:** Estimated 6-8 weeks  
**Team Size:** 1-2 developers  
**Deployment:** Google Pages (static hosting)

---

## 2. Technology Stack & Tools

### 2.1 Core Technologies

- **HTML5:** Semantic markup, accessibility features
- **CSS3:** Flexbox/Grid layouts, print media queries, animations
- **Vanilla JavaScript (ES6+):** Modules, classes, async/await
- **LocalStorage API:** Client-side data persistence
- **HTML5 Drag and Drop API:** Reordering and swapping functionality

### 2.2 External Libraries (Optional/Minimal)

- **UUID Generation:** Use `crypto.randomUUID()` (modern browsers) or lightweight library
- **Date Handling:** Native JavaScript `Date` object (no libraries needed)
- **Print Styling:** Native CSS `@media print` queries
- **Icons:** Font Awesome or inline SVG (for UI icons)

### 2.3 Development Tools

- **Code Editor:** VS Code
- **Version Control:** Git + GitHub
- **Browser DevTools:** Chrome/Firefox for debugging
- **Linting:** ESLint for JavaScript, Stylelint for CSS
- **Testing:** Manual testing (automated tests optional for v1)
- **Design Tools:** Figma (for mockups), Excalidraw (for wireframes)

### 2.4 Build Process

- **No build step required** for v1 (vanilla JS)
- Optional: Simple bundler (Vite, Parcel) if code splitting desired later
- CSS: Native or SCSS if preprocessing desired
- Asset optimization: Manual image compression, SVG optimization

---

## 3. Project Structure

```
resolution-bingo/
├── index.html                      # Main entry point
├── css/
│   ├── main.css                    # Global styles
│   ├── components.css              # Reusable component styles
│   ├── pages.css                   # Page-specific styles
│   ├── themes.css                  # Bingo card theme styles
│   └── print.css                   # Print-specific styles
├── js/
│   ├── main.js                     # App initialization
│   ├── router.js                   # Hash-based routing
│   ├── storage.js                  # LocalStorage wrapper
│   ├── state.js                    # Global state management
│   ├── utils.js                    # Utility functions
│   ├── models/
│   │   ├── Profile.js              # Profile data model
│   │   ├── Resolution.js           # Resolution data model
│   │   ├── LifeCategory.js         # Life category data model
│   │   └── BingoCard.js            # Bingo card data model
│   ├── components/
│   │   ├── Header.js               # Navigation header
│   │   ├── ResolutionCard.js       # Resolution card view
│   │   ├── ResolutionTable.js      # Resolution table view
│   │   ├── ResolutionList.js       # Resolution list view
│   │   ├── BingoCardPreview.js     # Bingo card renderer
│   │   ├── Modal.js                # Reusable modal component
│   │   └── DragDrop.js             # Drag and drop handler
│   └── pages/
│       ├── WelcomePage.js          # First-visit onboarding
│       ├── ResolutionsPage.js      # Main resolutions page
│       ├── ResolutionFormPage.js   # Add/edit resolution
│       ├── BingoCardCreatorPage.js # Bingo card creator
│       ├── BingoCardsListPage.js   # View all cards
│       ├── BingoCardViewPage.js    # View single card
│       ├── SettingsPage.js         # Settings & preferences
│       └── HelpPage.js             # Help documentation
├── assets/
│   ├── images/                     # Theme decorations, icons
│   ├── fonts/                      # Web fonts (if self-hosted)
│   └── icons/                      # SVG icons
├── design/
│   ├── requirements-notes.md       # Requirements documentation
│   ├── design-document.md          # Full design spec
│   └── implementation-plan.md      # This file
├── README.md                       # Project overview
└── LICENSE                         # License information
```

---

## 4. Development Phases

### Phase 1: Foundation & Core Data (Week 1-2)

**Goal:** Set up project structure and implement data layer.

**Tasks:**

1. **Project Setup**

   - Initialize Git repository
   - Create folder structure
   - Set up HTML boilerplate with meta tags
   - Configure ESLint/Stylelint
   - Create README with setup instructions

2. **Data Models & Storage**

   - Implement `storage.js` (LocalStorage wrapper with error handling)
   - Create data models:
     - `Profile.js` with CRUD operations
     - `Resolution.js` with CRUD operations (including frequency object structure)
     - `LifeCategory.js` with CRUD operations
     - `BingoCard.js` with CRUD operations
   - Implement UUID generation utility
   - Add timestamp utilities (created/updated)
   - Implement data validation functions

3. **State Management**

   - Create `state.js` for global app state
   - Implement state getter/setter methods
   - Add state change listeners (pub/sub pattern)
   - Implement auto-save debouncing (500ms)

4. **Testing Data Layer**
   - Manually test CRUD operations in console
   - Test LocalStorage limits
   - Test data export/import JSON structure
   - Verify UUID uniqueness

**Deliverable:** Functional data layer with persistence.

---

### Phase 2: Routing & Navigation (Week 2)

**Goal:** Implement hash-based routing and persistent navigation.

**Tasks:**

1. **Router Implementation**

   - Create `router.js` with hash change listener
   - Define route patterns: `#/`, `#/resolutions`, `#/bingo-card/:id`, etc.
   - Implement route parameter parsing
   - Add browser back/forward button support
   - Create route guard for profile checks

2. **Header Component**

   - Build persistent navigation header
   - Display current profile name
   - Navigation links (Resolutions, My Bingo Cards, Settings, Help)
   - Active link highlighting
   - Responsive layout (desktop-focused)

3. **Page Templates**
   - Create base page class/structure
   - Implement page lifecycle: mount, unmount, render
   - Add page transitions (optional fade effects)
   - Set up page title updates

**Deliverable:** Working navigation between pages.

---

### Phase 3: Profile & Settings (Week 2-3)

**Goal:** Implement profile management and settings.

**Tasks:**

1. **Welcome Page**

   - Create first-visit detection
   - Build "What's your Name?" form
   - Implement profile creation
   - Redirect to main page after setup
   - Add "dismiss" functionality with preference storage

2. **Settings Page**

   - **Profile Management Section:**

     - Display current profile
     - Switch profile dropdown
     - Create new profile button + modal
     - Rename profile button + modal
     - Delete profile button + confirmation (disabled if only one)

   - **Life Category Management:**

     - Display list of categories with color swatches
     - Add category button (show predefined suggestions + custom)
     - Edit category (name/color) modal
     - Delete category with warning if in use
     - Predefined color palette selector

   - **Display Preferences:**

     - Checkboxes for show/hide options
     - Save preferences to state

   - **Data Management:**

     - Export data button (generate JSON, trigger download)
     - Import data button (file picker, validation, merge logic)
     - Clear all data button (serious confirmation modal)

   - **Information Display:**
     - App version
     - Last backup timestamp

3. **Profile Switching Logic**
   - Filter all data by current profile
   - Update UI when profile switches
   - Maintain separate preferences per profile

**Deliverable:** Full profile and settings functionality.

---

### Phase 4: Resolutions Management (Week 3-4)

**Goal:** Build resolution list and CRUD operations.

**Tasks:**

1. **Resolutions Page (Main Page)**

   - **View Mode Toggle:**

     - Cards view component
     - Table view component
     - List view component
     - Toggle buttons with icons

   - **Filter Controls:**

     - Multi-select filter for Frequency (Single Occurrence / Number of Times / Number per Duration)
     - Multi-select filter for Excitement Level
     - Multi-select filter for Life Category
     - "Clear Filters" button
     - Real-time filtering

   - **Sort Controls (Table View):**

     - Sortable columns
     - Ascending/descending indicators

   - **Action Buttons:**

     - "Add Resolution" button
     - "Edit Mode" toggle
     - "Create a Bingo Card" button
     - "View My Bingo Cards" button

   - **Empty State:**
     - "Add your first resolution" message
     - Large add button
     - Link to Settings for category setup

2. **Resolution Display Components**

   - **Card View:**

     - Resolution text
     - Life category badge (with color)
     - Frequency badge
     - Excitement emoji
     - Respect display preferences

   - **Table View:**

     - Columns: Resolution, Life Category, Frequency, Excitement, Actions
     - Sortable columns
     - Alternating row colors

   - **List View:**
     - Simple text format
     - Combined string display

3. **Edit Mode Features**

   - Show drag handles on cards/rows
   - Implement drag-and-drop reordering
   - Show edit/delete buttons
   - Update `order` field on reorder
   - Auto-save after changes

4. **Resolution Form Page**

   - Add/Edit form with fields:
     - Resolution text (textarea with counter)
     - Frequency type (radio buttons: Single Occurrence / Number of Times / Number per Duration)
     - Frequency details:
       - If "Number of Times": Number input field
       - If "Number per Duration": Number input + Duration dropdown (per Week / per Month / per Year)
     - Excitement level (5-point scale with emojis)
     - Life category (dropdown)
   - Real-time validation
   - Character limit enforcement
   - Auto-save on blur
   - "Done" button returns to main page

5. **Delete Confirmation**
   - Check if resolution is in bingo cards
   - Show warning modal with count
   - If confirmed, update affected cards (convert to free squares)
   - Show success message

**Deliverable:** Full resolution management system.

---

### Phase 5: Bingo Card Creator (Week 4-5)

**Goal:** Build the bingo card creator with live preview.

**Tasks:**

1. **Bingo Card Creator Page Layout**

   - Split screen: Left config panel (40%), Right preview (60%)
   - Responsive adjustment for layout

2. **Left Panel: Configuration**

   - **Card Details:**

     - Save Name input with validation
     - Printed Title input with validation
     - Default title: "<Year> Bingo" (auto-populate year)

   - **Resolution Selection:**

     - Multi-filter controls (reuse from resolutions page)
     - Filtered resolution list
     - "Add to Card" button per resolution
     - Resolution counter: "12 / 25 selected"
     - Info note about free squares
     - Handle duplicate prevention

   - **Visual Customization:**

     - Design theme selector (5 options with icons/thumbnails)
     - Font selector (4 options with preview text)

   - **Actions:**
     - "Shuffle" button (randomize positions)
     - "Save Card" button (with validation)
     - "Cancel" button (confirm if unsaved changes)

3. **Right Panel: Live Preview**

   - Real-time bingo card renderer
   - 5x5 grid with borders
   - Apply selected theme styles
   - Apply selected font
   - Show resolution text or bingo phrases
   - Free square styling (themed)
   - Header with title
   - Footer decorations (themed)
   - Responsive sizing

4. **Drag-and-Drop on Grid**

   - Enable dragging on occupied squares
   - Visual feedback during drag (ghost element)
   - Swap squares on drop
   - Update card data in state
   - Auto-save after swap

5. **Square Edit Modal**

   - Triggered by clicking a square
   - Dropdown to change resolution
   - Input for custom bingo phrase (max 30 chars)
   - Preview of square with new text
   - "Update" and "Cancel" buttons
   - Auto-save on update

6. **Shuffle Logic**

   - Randomly assign positions to selected resolutions
   - Fill remaining with free squares
   - Update preview immediately

7. **Save Card Logic**
   - Validate: save name, title not empty
   - Check: not exceeding 40 card limit
   - Generate card object with squares array
   - Save to state
   - Redirect to single card view

**Deliverable:** Fully functional bingo card creator.

---

### Phase 6: Bingo Card Viewing & Printing (Week 5-6)

**Goal:** Display saved cards and implement print functionality.

**Tasks:**

1. **Bingo Cards List Page**

   - Grid layout of card thumbnails
   - Display save name
   - Thumbnail preview of each card
   - Per-card actions:
     - "View" button
     - "Copy" button
     - "Delete" button (with confirmation)
   - "Create New Card" button
   - Empty state message
   - Handle max limit (disable create button with tooltip)

2. **View Single Bingo Card Page**

   - Full-size card display
   - Apply theme and font styles
   - Render all 25 squares correctly
   - Header/footer decorations

   - **Print Options Panel:**

     - Card size selector (radio buttons)
       - Full Page (8.5" x 11")
       - 5" x 5"
       - 6" x 6"
       - 7" x 7"
     - Color mode (radio buttons)
       - Color
       - Grayscale
     - "Print" button

   - **Action Buttons:**
     - "Edit Card" (navigate to creator with ID)
     - "Copy Card" (navigate to creator with pre-filled data)
     - "Delete Card" (with confirmation, then redirect to list)
     - "Back to My Cards" (navigate to list)

3. **Print Functionality**

   - Create `print.css` with media queries
   - Implement card size scaling
   - Adjust margins for selected size
   - Apply grayscale styles when selected
   - Hide UI elements (buttons, panels) in print
   - Show only card in print preview
   - Trigger browser print dialog with `window.print()`

4. **Print Styling per Theme**

   - Flowers: Floral borders, pastel colors, flower free square
   - Cute: Rounded corners, hearts/stars, bright pastels
   - Science: Technical borders, atom free square, blue/green tones
   - Mathy: Graph paper grid, pi symbol free square, textbook colors
   - Animals: Paw prints, natural borders, earthy tones
   - Ensure all work in grayscale

5. **Copy Card Functionality**
   - Load card data by ID
   - Pre-populate creator form fields
   - Default save name to "Copy of [original name]"
   - Allow editing before saving
   - Generate new UUID for copy

**Deliverable:** Viewing and printing functionality complete.

---

### Phase 7: Import/Export & Data Management (Week 6)

**Goal:** Implement data backup and restore features.

**Tasks:**

1. **Export Functionality**

   - Gather all profiles, resolutions, categories, cards
   - Build complete application state object
   - Include schema version number
   - Convert to JSON string
   - Create blob with data
   - Trigger file download: `resolution-bingo-backup-[timestamp].json`
   - Update last backup timestamp in state

2. **Import Functionality**

   - File picker for JSON file
   - Read file contents
   - Validate JSON structure
   - Check schema version compatibility

   - **Merge Logic:**

     - Match profiles by UUID
     - Match resolutions by UUID
     - Match categories by UUID
     - Match cards by UUID
     - For conflicts, compare `updatedAt` timestamps
     - Keep most recent version
     - Handle missing references gracefully

   - **Duplicate Name Handling:**

     - Check for profiles with identical names
     - Append "(id: [shortened-uuid])" to display name
     - User can rename later

   - Show success message with summary:

     - "Imported X resolutions, Y bingo cards across Z profiles"

   - Show error message for invalid files:
     - "Unable to load from your file: invalid json"
     - "This file doesn't appear to be a Resolution Bingo backup"

3. **Clear All Data**
   - Serious confirmation modal:
     - "This will delete ALL data for ALL profiles. This cannot be undone."
     - Checkbox: "I understand this is permanent"
     - "Clear All Data" button (red, destructive)
     - "Cancel" button
   - If confirmed:
     - Clear LocalStorage completely
     - Reset state to initial values
     - Redirect to welcome page
     - Show success message

**Deliverable:** Full data management capabilities.

---

### Phase 8: Polish & UX Refinements (Week 7)

**Goal:** Improve user experience, add animations, and fix edge cases.

**Tasks:**

1. **Animations & Transitions**

   - Page transitions (fade in/out)
   - Drag-and-drop visual feedback
   - Button hover effects
   - Modal open/close animations
   - Success/error message toasts
   - Loading states (if needed)

2. **Validation & Error Handling**

   - Real-time character counters with color coding
   - Inline error messages
   - Disabled buttons with tooltips
   - Form validation before submit
   - Handle LocalStorage quota exceeded
   - Handle browser compatibility issues

3. **Empty States**

   - No resolutions: "Add your first resolution!"
   - No bingo cards: "Create your first bingo card!"
   - No categories: "Visit Settings to add categories"
   - No profiles: (shouldn't happen, but handle gracefully)

4. **Accessibility Improvements**

   - Keyboard navigation (tab order)
   - Focus indicators (visible outlines)
   - ARIA labels for icons and buttons
   - Semantic HTML (headings, landmarks)
   - Color contrast checks
   - Alt text for decorative images

5. **Responsive Tweaks**

   - Ensure desktop layouts work on various screen sizes
   - Adjust font sizes for readability
   - Test on different browsers (Chrome, Firefox, Safari, Edge)

6. **Performance Optimization**
   - Debounce auto-save correctly
   - Optimize re-renders (avoid unnecessary DOM updates)
   - Lazy load theme images if needed
   - Minimize CSS/JS (optional for static site)

**Deliverable:** Polished, user-friendly application.

---

### Phase 9: Help Page & Documentation (Week 7)

**Goal:** Create comprehensive help documentation.

**Tasks:**

1. **Help Page Content**

   - **What is Resolution Bingo?**

     - Explain concept and benefits
     - Visual examples

   - **How to Add Resolutions**

     - Step-by-step with screenshots
     - Explain categories and fields

   - **How to Create Bingo Cards**

     - Walkthrough of card creator
     - Explain customization options

   - **Printing Your Cards**

     - Print settings guide
     - Tips for best print quality

   - **Managing Profiles**

     - How to add family members
     - Switching between profiles

   - **Backing Up Your Data**

     - Export/import instructions
     - When and why to backup

   - **Tips for Success**

     - Filter by Single Occurrence
     - Use excitement level to prioritize
     - Print multiple copies

   - **Future Features**
     - Tease upcoming gamification tools

2. **Visual Design**
   - Use screenshots of the app
   - Add icons and illustrations
   - Make it scannable (headings, lists)
   - Match app's visual style

**Deliverable:** Complete help documentation.

---

### Phase 10: Testing & Deployment (Week 8)

**Goal:** Thoroughly test and deploy to Google Pages.

**Tasks:**

1. **Testing Checklist**

   - **Functional Testing:**

     - Create/edit/delete profiles
     - Create/edit/delete resolutions
     - Create/edit/delete categories
     - Create/edit/delete bingo cards
     - Drag-and-drop functionality
     - Filtering and sorting
     - Export/import data
     - Print cards in all sizes and modes

   - **Cross-Browser Testing:**

     - Chrome, Firefox, Safari, Edge
     - Check for JavaScript errors
     - Verify LocalStorage works

   - **Edge Cases:**

     - Empty states
     - Maximum limits reached
     - Invalid JSON import
     - LocalStorage quota exceeded
     - Deleting items in use
     - Browser back/forward navigation

   - **Print Testing:**

     - Test all themes and fonts
     - Test all sizes and color modes
     - Verify print quality on actual printer
     - Check margins and alignment

   - **Performance Testing:**
     - Large datasets (many resolutions/cards)
     - Auto-save timing
     - Preview render speed

2. **Bug Fixes**

   - Address all issues found during testing
   - Document known limitations
   - Prioritize critical bugs vs. nice-to-haves

3. **Deployment to Google Pages**

   - Create Google Pages site
   - Configure custom domain (if applicable)
   - Upload files:
     - index.html
     - css/ folder
     - js/ folder
     - assets/ folder
   - Verify routing works (hash-based should work fine)
   - Test live site in all browsers
   - Check mobile devices (even if not optimized)

4. **Documentation**

   - Update README with:
     - Project description
     - Features list
     - Installation (for local development)
     - Deployment instructions
     - Credits and license
   - Add comments to complex code sections
   - Create developer guide (if team grows)

5. **Launch Preparation**
   - Test one final time on live URL
   - Prepare announcement/social media posts
   - Consider creating demo video
   - Share with initial users for feedback

**Deliverable:** Fully deployed, tested application.

---

## 5. Key Technical Implementation Details

### 5.1 Hash-Based Routing

**Router Pattern:**

```javascript
// router.js
class Router {
  constructor() {
    this.routes = {};
    this.currentPage = null;
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, params] = this.parsePath(hash);

    if (this.currentPage && this.currentPage.unmount) {
      this.currentPage.unmount();
    }

    const handler = this.routes[path];
    if (handler) {
      this.currentPage = handler(params);
      if (this.currentPage && this.currentPage.render) {
        this.currentPage.render();
      }
    } else {
      this.handleNotFound();
    }
  }

  parsePath(hash) {
    // Extract path and parameters
    const parts = hash.split('/');
    // Return [path, params object]
  }

  navigate(path) {
    window.location.hash = path;
  }
}
```

### 5.2 LocalStorage Wrapper

**Storage Pattern:**

```javascript
// storage.js
class Storage {
  constructor(key = 'resolution-bingo-data') {
    this.key = key;
  }

  load() {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : this.getDefaultState();
    } catch (error) {
      console.error('Failed to load data:', error);
      return this.getDefaultState();
    }
  }

  save(data) {
    try {
      localStorage.setItem(this.key, JSON.stringify(data));
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        alert('Storage is full. Please export your data.');
      }
      console.error('Failed to save data:', error);
      return false;
    }
  }

  clear() {
    localStorage.removeItem(this.key);
  }

  getDefaultState() {
    return {
      version: '1.0.0',
      currentProfileId: null,
      profiles: [],
      resolutions: [],
      lifeCategories: [],
      bingoCards: [],
      preferences: {},
      lastBackup: null,
    };
  }
}
```

### 5.3 State Management with Auto-Save

**State Pattern:**

```javascript
// state.js
class State {
  constructor(storage) {
    this.storage = storage;
    this.data = storage.load();
    this.listeners = [];
    this.saveTimeout = null;
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.notify(key, value);
    this.debounceSave();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify(key, value) {
    this.listeners.forEach((listener) => listener(key, value));
  }

  debounceSave() {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.storage.save(this.data);
    }, 500); // 500ms debounce
  }

  saveNow() {
    clearTimeout(this.saveTimeout);
    this.storage.save(this.data);
  }
}
```

### 5.4 Drag-and-Drop Implementation

**Drag Pattern (HTML5):**

```javascript
// components/DragDrop.js
class DragDropHandler {
  constructor(containerSelector, onReorder) {
    this.container = document.querySelector(containerSelector);
    this.onReorder = onReorder;
    this.draggedItem = null;
    this.attachListeners();
  }

  attachListeners() {
    this.container.addEventListener('dragstart', (e) => {
      this.draggedItem = e.target;
      e.target.classList.add('dragging');
    });

    this.container.addEventListener('dragend', (e) => {
      e.target.classList.remove('dragging');
      this.draggedItem = null;
    });

    this.container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = this.getDragAfterElement(e.clientY);
      if (afterElement == null) {
        this.container.appendChild(this.draggedItem);
      } else {
        this.container.insertBefore(this.draggedItem, afterElement);
      }
    });

    this.container.addEventListener('drop', (e) => {
      e.preventDefault();
      this.onReorder();
    });
  }

  getDragAfterElement(y) {
    const draggableElements = [
      ...this.container.querySelectorAll('.draggable:not(.dragging)'),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
}
```

### 5.5 Modal Component

**Modal Pattern:**

```javascript
// components/Modal.js
class Modal {
  constructor(title, content, actions) {
    this.title = title;
    this.content = content;
    this.actions = actions; // Array of { label, onClick, className }
    this.element = null;
  }

  render() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2>${this.title}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          ${this.content}
        </div>
        <div class="modal-footer">
          ${this.actions
            .map(
              (action) => `
            <button class="btn ${action.className || ''}" data-action="${
                action.label
              }">
              ${action.label}
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    this.element = modal;
    document.body.appendChild(modal);
    this.attachListeners();

    return this;
  }

  attachListeners() {
    const closeBtn = this.element.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => this.close());

    this.actions.forEach((action) => {
      const btn = this.element.querySelector(`[data-action="${action.label}"]`);
      btn.addEventListener('click', () => {
        action.onClick();
        if (action.closeOnClick !== false) {
          this.close();
        }
      });
    });

    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });
  }

  close() {
    this.element.remove();
  }
}
```

### 5.6 Bingo Card Renderer

**Preview Renderer:**

```javascript
// components/BingoCardPreview.js
class BingoCardPreview {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
  }

  render(bingoCard, theme, font) {
    const card = document.createElement('div');
    card.className = `bingo-card theme-${theme} font-${font}`;

    // Header
    const header = document.createElement('div');
    header.className = 'bingo-header';
    header.innerHTML = `<h1>${bingoCard.title}</h1>`;
    card.appendChild(header);

    // Grid
    const grid = document.createElement('div');
    grid.className = 'bingo-grid';

    for (let i = 0; i < 25; i++) {
      const square = bingoCard.squares.find((s) => s.position === i);
      const cell = document.createElement('div');
      cell.className = 'bingo-square';
      cell.dataset.position = i;

      if (square && square.resolutionId) {
        cell.textContent = square.bingoPhrase;
        cell.classList.add('filled');
      } else {
        cell.classList.add('free');
        cell.innerHTML = this.getFreeSquareContent(theme);
      }

      grid.appendChild(cell);
    }

    card.appendChild(grid);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'bingo-footer';
    card.appendChild(footer);

    this.container.innerHTML = '';
    this.container.appendChild(card);
  }

  getFreeSquareContent(theme) {
    const freeSquares = {
      flowers: '<span class="free-icon">🌸</span>',
      cute: '<span class="free-icon">⭐</span>',
      science: '<span class="free-icon">⚛️</span>',
      mathy: '<span class="free-icon">π</span>',
      animals: '<span class="free-icon">🐾</span>',
    };
    return freeSquares[theme] || 'FREE';
  }
}
```

### 5.7 Print CSS Structure

**Print Styles:**

```css
/* css/print.css */
@media print {
  /* Hide UI elements */
  header,
  .nav,
  .controls,
  .actions,
  .btn,
  footer {
    display: none !important;
  }

  /* Show only bingo card */
  body {
    margin: 0;
    padding: 0;
  }

  .bingo-card {
    page-break-after: avoid;
  }

  /* Full page size */
  .bingo-card.size-full {
    width: 8.5in;
    height: 11in;
    margin: 0;
  }

  /* Smaller sizes (centered on page) */
  .bingo-card.size-5x5 {
    width: 5in;
    height: 5in;
    margin: 3in auto;
  }

  .bingo-card.size-6x6 {
    width: 6in;
    height: 6in;
    margin: 2.5in auto;
  }

  .bingo-card.size-7x7 {
    width: 7in;
    height: 7in;
    margin: 2in auto;
  }

  /* Grayscale mode */
  .bingo-card.grayscale {
    filter: grayscale(100%);
  }

  /* Ensure colors print */
  .bingo-card {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Grid styling for print */
  .bingo-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0;
    border: 2pt solid #000;
  }

  .bingo-square {
    border: 1pt solid #000;
    padding: 8pt;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 10pt;
    min-height: 1in;
  }
}
```

---

## 6. Data Import/Export Logic

### 6.1 Export Process

```javascript
// Export all data
function exportData(state) {
  const data = {
    version: state.get('version'),
    exportDate: new Date().toISOString(),
    profiles: state.get('profiles'),
    resolutions: state.get('resolutions'),
    lifeCategories: state.get('lifeCategories'),
    bingoCards: state.get('bingoCards'),
    preferences: state.get('preferences'),
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `resolution-bingo-backup-${Date.now()}.json`;
  link.click();

  URL.revokeObjectURL(url);

  // Update last backup timestamp
  state.set('lastBackup', new Date().toISOString());
}
```

### 6.2 Import & Merge Process

```javascript
// Import and merge data
async function importData(file, state) {
  try {
    const text = await file.text();
    const imported = JSON.parse(text);

    // Validate structure
    if (!imported.version || !imported.profiles) {
      throw new Error('Invalid backup file');
    }

    const current = {
      profiles: state.get('profiles'),
      resolutions: state.get('resolutions'),
      lifeCategories: state.get('lifeCategories'),
      bingoCards: state.get('bingoCards'),
      preferences: state.get('preferences'),
    };

    // Merge logic
    const merged = {
      profiles: mergeByUUID(current.profiles, imported.profiles),
      resolutions: mergeByUUID(current.resolutions, imported.resolutions),
      lifeCategories: mergeByUUID(
        current.lifeCategories,
        imported.lifeCategories
      ),
      bingoCards: mergeByUUID(current.bingoCards, imported.bingoCards),
      preferences: { ...current.preferences, ...imported.preferences },
    };

    // Update state
    state.set('profiles', merged.profiles);
    state.set('resolutions', merged.resolutions);
    state.set('lifeCategories', merged.lifeCategories);
    state.set('bingoCards', merged.bingoCards);
    state.set('preferences', merged.preferences);

    // Show success message
    showToast(`Imported successfully!`, 'success');
  } catch (error) {
    console.error('Import failed:', error);
    showToast('Unable to load from your file: invalid json', 'error');
  }
}

function mergeByUUID(existing, incoming) {
  const merged = [...existing];

  incoming.forEach((incomingItem) => {
    const existingIndex = merged.findIndex(
      (item) => item.id === incomingItem.id
    );

    if (existingIndex === -1) {
      // New item, add it
      merged.push(incomingItem);
    } else {
      // Exists, keep most recent
      const existingItem = merged[existingIndex];
      if (new Date(incomingItem.updatedAt) > new Date(existingItem.updatedAt)) {
        merged[existingIndex] = incomingItem;
      }
    }
  });

  return merged;
}
```

---

## 7. Testing Strategy

### 7.1 Manual Testing Checklist

**Profile Management:**

- [ ] Create first profile on welcome screen
- [ ] Create additional profiles in settings
- [ ] Switch between profiles
- [ ] Rename profile
- [ ] Delete profile (confirm warning)
- [ ] Verify data isolation between profiles

**Resolution Management:**

- [ ] Add resolution with all fields
- [ ] Edit resolution
- [ ] Delete resolution (not in use)
- [ ] Delete resolution in use (see warning, confirm conversion)
- [ ] Drag and drop to reorder
- [ ] Filter by frequency, excitement, life category
- [ ] Sort table by columns
- [ ] Switch between card/table/list views
- [ ] Verify display preferences (show/hide fields)

**Life Categories:**

- [ ] Add predefined category
- [ ] Add custom category
- [ ] Edit category name and color
- [ ] Delete category (not in use)
- [ ] Delete category in use (see warning)

**Bingo Card Creation:**

- [ ] Create card with <25 resolutions (free squares fill in)
- [ ] Create card with 25 resolutions
- [ ] Filter resolutions when selecting
- [ ] Shuffle squares
- [ ] Drag and drop squares to swap
- [ ] Click square to edit (change resolution, change bingo phrase)
- [ ] Change design theme (verify preview updates)
- [ ] Change font (verify preview updates)
- [ ] Save card

**Bingo Card Viewing:**

- [ ] View list of cards
- [ ] View single card
- [ ] Copy card (verify data pre-fills)
- [ ] Edit card
- [ ] Delete card
- [ ] Print card in all sizes
- [ ] Print card in color and grayscale

**Data Management:**

- [ ] Export data (verify JSON structure)
- [ ] Import data (verify merge)
- [ ] Import with conflicts (verify most recent wins)
- [ ] Import invalid file (verify error message)
- [ ] Clear all data (verify confirmation, complete wipe)

**Validation:**

- [ ] Character limits enforced (real-time feedback)
- [ ] Max limits enforced (buttons disabled with tooltips)
- [ ] Required fields validated
- [ ] Form prevents submission when invalid

**Browser & Print:**

- [ ] Test in Chrome, Firefox, Safari, Edge
- [ ] Verify print preview matches screen
- [ ] Print actual card, check quality
- [ ] Test all themes print correctly
- [ ] Test grayscale mode

### 7.2 Edge Cases

- [ ] Empty states (no resolutions, no cards, etc.)
- [ ] LocalStorage quota exceeded
- [ ] Browser back/forward buttons
- [ ] Refresh page mid-edit (auto-save preserves data)
- [ ] Multiple tabs open (last write wins)
- [ ] Very long resolution text (wrapping, truncation)
- [ ] Special characters in text (quotes, emojis)
- [ ] Profile name collisions after import

---

## 8. Deployment Checklist

### 8.1 Pre-Deployment

- [ ] All features implemented and tested
- [ ] Cross-browser testing complete
- [ ] Print testing on physical printer complete
- [ ] No console errors in production
- [ ] README updated with project info
- [ ] Help page complete with screenshots
- [ ] Code commented where necessary
- [ ] CSS organized and documented
- [ ] Asset files optimized (images compressed, SVGs minified)

### 8.2 Deployment Steps

1. **Prepare Files**

   - [ ] Ensure all paths are relative (no absolute paths)
   - [ ] Verify hash routing works without server
   - [ ] Test locally with simple HTTP server

2. **Upload to Google Pages**

   - [ ] Create new Google Pages site
   - [ ] Upload all files maintaining folder structure
   - [ ] Set index.html as main page

3. **Verify Deployment**

   - [ ] Visit live URL
   - [ ] Test navigation (all pages load)
   - [ ] Test data persistence (create, save, refresh)
   - [ ] Test export/import
   - [ ] Test print from live site
   - [ ] Check on different browsers

4. **Post-Launch**
   - [ ] Monitor for bug reports
   - [ ] Gather user feedback
   - [ ] Plan future iterations

---

## 9. Future Iterations & Enhancements

### 9.1 Phase 11: Additional Trackers (Post-V1)

**Achievement Tree:**

- Design tree illustration
- Implement leaf addition UI
- Create printable template

**Sticker Map:**

- Design passport/map layout
- Implement sticker placement
- Create printable template

**Warrior Armor:**

- Design warrior character
- Implement armor piece addition
- Create printable template

### 9.2 Technical Enhancements

- **PWA:** Service worker for offline use
- **Cloud Sync:** Optional backend for multi-device sync
- **Image Export:** Export cards as PNG/JPEG
- **Themes:** User-created custom themes
- **Analytics:** Optional usage tracking (privacy-focused)
- **Animations:** More engaging interactions
- **Mobile:** Responsive design for small screens

### 9.3 Feature Ideas

- Daily/weekly resolution reminders (if permissions granted)
- Social sharing (generate shareable card images)
- Collaborative cards (family bingo with shared resolutions)
- Progress stats and insights
- Goal scheduling with calendar integration
- Gamification points/badges
- Community-contributed themes/fonts

---

## 10. Success Criteria

### 10.1 MVP Success (V1)

- [ ] Users can create and manage resolutions
- [ ] Users can create customized bingo cards
- [ ] Cards print correctly on home printers
- [ ] Data persists in LocalStorage
- [ ] Export/import works for backup
- [ ] Multiple profiles supported
- [ ] All core features functional
- [ ] No critical bugs
- [ ] Help documentation complete

### 10.2 User Satisfaction Metrics

- Positive feedback from initial users
- Users returning to create multiple cards
- Users printing and using cards physically
- Low bug report rate
- Feature requests indicate engagement

### 10.3 Technical Quality

- Clean, maintainable code
- Commented and documented
- Works in all target browsers
- Fast loading and responsive UI
- Graceful error handling
- Data integrity maintained

---

## 11. Resources & References

### 11.1 Documentation

- MDN Web Docs (JavaScript, HTML, CSS)
- LocalStorage API documentation
- HTML5 Drag and Drop API
- CSS Grid and Flexbox guides
- Print CSS best practices

### 11.2 Design Inspiration

- Behance (bingo card designs)
- Dribbble (gamification UI patterns)
- Pinterest (printable trackers)
- Canva (visual themes and fonts)

### 11.3 Tools

- VS Code extensions (ESLint, Prettier, Live Server)
- Browser DevTools
- Google Fonts
- Font Awesome or Feather Icons
- Excalidraw for wireframes
- Figma for mockups

---

## 12. Conclusion

This implementation plan provides a structured approach to building Resolution Bingo from scratch. By breaking development into clear phases, the project remains manageable while ensuring all features are implemented thoroughly.

**Key Success Factors:**

1. **Start with data layer** - Solid foundation prevents refactoring
2. **Incremental development** - Each phase builds on the last
3. **Test continuously** - Catch bugs early
4. **Focus on UX** - ADHD-friendly design is core to success
5. **Print quality** - Cards must look great on paper

**Timeline Overview:**

- Weeks 1-2: Foundation (data, routing, profiles)
- Weeks 3-4: Resolutions management
- Weeks 4-5: Bingo card creator
- Weeks 5-6: Viewing and printing
- Week 6: Import/export
- Week 7: Polish and help
- Week 8: Testing and deployment

With this plan, Resolution Bingo will be a delightful, functional tool for making 2026 (and beyond!) the year of achieving goals in a fun, visual way.
