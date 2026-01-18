# Resolution Bingo

Transform your New Year's resolutions into fun, printable bingo cards!

## Overview

Resolution Bingo is an ADHD-friendly web application that gamifies goal-setting by allowing you to create customizable bingo cards filled with your personal resolutions. The focus is on creating visual, physical reminders that are hard to ignore.

## Features

- 📝 **Resolution Management**: Add, edit, and organize your goals
- 🎨 **Custom Bingo Cards**: Create beautiful, printable bingo cards with multiple themes
- 👥 **Multiple Profiles**: Perfect for families - each person gets their own data
- 🖨️ **Print-Friendly**: Designed for home printers with various sizes and styles
- 💾 **Data Backup**: Export and import your data as JSON
- 🎯 **Visual Tracking**: Cards, table, and list views with filtering

## Getting Started

1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, or Edge)
2. Enter your name to create your first profile
3. Add some resolutions
4. Create your first bingo card
5. Print it out and start achieving your goals!

## Technology Stack

- Vanilla JavaScript (ES6+)
- HTML5
- CSS3
- LocalStorage for data persistence
- No build process required!

## Development

This is a static web application with no backend. All data is stored in the browser's LocalStorage.

To run locally:

1. Clone this repository
2. Open `index.html` in your browser
3. Or use a simple HTTP server: `python -m http.server` or VS Code's Live Server extension

## Project Structure

```
resolution-bingo/
├── index.html              # Main entry point
├── css/                    # Stylesheets
│   ├── main.css           # Global styles & variables
│   ├── components.css     # Reusable components
│   ├── pages.css          # Page-specific styles
│   ├── themes.css         # Bingo card themes
│   └── print.css          # Print-specific styles
├── js/                     # JavaScript modules
│   ├── main.js            # App initialization
│   ├── router.js          # Hash-based routing
│   ├── storage.js         # LocalStorage wrapper
│   ├── state.js           # State management
│   ├── utils.js           # Utility functions
│   └── pages/             # Page components
│       ├── WelcomePage.js
│       ├── ResolutionsPage.js
│       ├── BingoCardCreatorPage.js
│       ├── BingoCardsListPage.js
│       ├── BingoCardViewPage.js
│       ├── SettingsPage.js
│       └── HelpPage.js
└── design/                 # Design documentation
    ├── requirements-notes.md
    ├── design-document.md
    └── implementation-plan.md
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Data Storage

All data is stored in browser's LocalStorage. Remember to:

- Export your data regularly (Settings > Export Data)
- Save the JSON file as backup
- Import when switching browsers or devices

## Credits

All emojis designed by [OpenMoji](https://openmoji.org/) – the open-source emoji and icon project. License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

## Version

Current version: 1.0.0 (in development)

---

Made with 💜 for making resolutions fun!
