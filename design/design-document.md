# Resolution Bingo - Design Document

**Version:** 1.0  
**Date:** January 15, 2026  
**Project:** Resolution Bingo Web Application

---

## 1. Executive Summary

Resolution Bingo is a fun, ADHD-friendly web application that gamifies New Year's resolutions by allowing users to create customizable bingo cards filled with their personal goals. The application enables users to curate resolutions, design printable bingo cards with various visual themes, and track multiple profiles (perfect for families). The focus is on creating visual, physical reminders that are hard to ignore.

**Target Audience:** Individuals and families looking for engaging, low-tech ways to track and celebrate their goals.

**Key Value Proposition:** Transform goal-setting from a dreaded task into an enjoyable, visual experience with printable bingo cards.

---

## 2. Technical Overview

### 2.1 Technology Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Storage:** LocalStorage (client-side)
- **Hosting:** Google Pages (static site)
- **Print:** Browser Print Dialog with PDF export capability
- **Target Platform:** Desktop browsers (Chrome, Firefox, Safari, Edge)

### 2.2 Architecture

- Single Page Application (SPA) with hash-based routing
- Client-side only (no backend/server)
- Data persistence via LocalStorage
- Export/Import via JSON files for backup and portability

---

## 3. Data Models

### 3.1 Profile

```javascript
{
  id: "uuid-v4",                    // Unique identifier
  name: "string",                   // Profile name (max 50 chars)
  createdAt: "ISO8601 timestamp",
  updatedAt: "ISO8601 timestamp"
}
```

### 3.2 Resolution

```javascript
{
  id: "uuid-v4",                    // Unique identifier
  profileId: "uuid-v4",             // Reference to profile
  text: "string",                   // Resolution text (max 1000 chars)
  frequency: "single|recurring",    // Type of goal
  excitementLevel: 1-5,             // 1=Dreading, 2=Not fond of, 3=Neutral, 4=Feeling good, 5=Really excited
  lifeCategoryId: "uuid-v4",        // Reference to life category
  order: number,                    // Display order in list
  createdAt: "ISO8601 timestamp",
  updatedAt: "ISO8601 timestamp"
}
```

### 3.3 Life Category

```javascript
{
  id: "uuid-v4",                    // Unique identifier
  profileId: "uuid-v4",             // Reference to profile
  name: "string",                   // Category name (max 50 chars)
  color: "string",                  // Hex color code from predefined palette
  isCustom: boolean,                // True if user-created, false if from suggestions
  createdAt: "ISO8601 timestamp"
}
```

### 3.4 Bingo Card

```javascript
{
  id: "uuid-v4",                    // Unique identifier
  profileId: "uuid-v4",             // Reference to profile
  saveName: "string",               // Internal name (max 30 chars)
  title: "string",                  // Printed title (max 30 chars)
  design: "flowers|cute|science|mathy|animals",
  font: "silly|fancy|writer|headlines",
  squares: [                        // Array of 25 squares (5x5 grid)
    {
      position: 0-24,               // Grid position (0 = top-left, 24 = bottom-right)
      resolutionId: "uuid-v4|null", // Reference to resolution, or null for free square
      bingoPhrase: "string|null"    // Custom short text (max 30 chars), or null for free square
    }
  ],
  createdAt: "ISO8601 timestamp",
  updatedAt: "ISO8601 timestamp"
}
```

### 3.5 User Preferences

```javascript
{
  profileId: "uuid-v4",             // Reference to profile
  displayOptions: {
    showExcitementLevel: boolean,
    showFrequency: boolean,
    showLifeCategory: boolean
  },
  resolutionView: "cards|table|list", // Current view mode
  hasSeenWelcome: boolean
}
```

### 3.6 Application State

```javascript
{
  version: "1.0.0",                 // Data schema version
  currentProfileId: "uuid-v4",      // Active profile
  profiles: [],                     // Array of Profile objects
  resolutions: [],                  // Array of Resolution objects
  lifeCategories: [],               // Array of Life Category objects
  bingoCards: [],                   // Array of Bingo Card objects
  preferences: {},                  // Map of profileId to User Preferences
  lastBackup: "ISO8601 timestamp"   // When last export occurred
}
```

---

## 4. Page Structure & User Flows

### 4.1 Navigation Structure

```
Header (Persistent on all pages)
├── Logo/App Name
├── Current Profile Indicator
├── Nav Links
│   ├── Resolutions (Main Page)
│   ├── My Bingo Cards
│   ├── Settings
│   └── Help
```

### 4.2 Pages Overview

#### **Page 1: First Visit / Onboarding**

- **URL:** `#/welcome`
- **Purpose:** Greet new users and collect initial profile name
- **Components:**
  - Welcome message explaining the app concept
  - "What's your Name?" input field
  - "Get Started" button
  - Can be dismissed and won't show again (stored in preferences)

#### **Page 2: Resolutions (Main Page)**

- **URL:** `#/` or `#/resolutions`
- **Purpose:** Manage list of resolutions
- **Components:**
  - **View Mode Toggle:** Cards / Table / List
  - **Filter Controls:** Filter by Frequency, Excitement, Life Category
  - **Sort Options:** (for table view) Sort by any column
  - **Resolution Display:** Shows resolutions based on selected view
  - **Action Buttons:**
    - "Add Resolution" (enters edit mode for new item)
    - "Edit Mode" toggle (enables drag/drop reordering and edit/delete)
    - "Create a Bingo Card" (navigates to card creator)
    - "View My Bingo Cards" (navigates to card list)
- **Edit Mode Features:**
  - Drag handles for reordering
  - Edit button per resolution
  - Delete button per resolution (with confirmation if used in cards)
  - Inline validation for character limits

#### **Page 3: Add/Edit Resolution**

- **URL:** `#/resolution/new` or `#/resolution/:id`
- **Purpose:** Form to create or modify a resolution
- **Components:**
  - Resolution text (textarea, max 1000 chars)
  - Frequency (radio: Single Occurrence / Recurring)
  - Excitement Level (5-point scale with emoji indicators)
  - Life Category (dropdown of user's categories)
  - Real-time character counter
  - Auto-save on blur
  - "Done" button to return to main page

#### **Page 4: Bingo Card Creator**

- **URL:** `#/bingo-card/new` or `#/bingo-card/:id/edit`
- **Purpose:** Design and customize a bingo card
- **Layout:** Split screen

  - **Left Panel (40%):** Configuration
  - **Right Panel (60%):** Live Preview

- **Left Panel Components:**

  - **Card Details:**
    - Save Name input (max 30 chars)
    - Printed Title input (max 30 chars)
  - **Resolution Selection:**
    - Multi-filter controls (Frequency, Excitement, Life Category)
    - Filtered list of available resolutions
    - "Add to Card" button per resolution
    - Current count (e.g., "12 / 25 selected")
    - Note: "Unfilled squares will be Free squares"
  - **Visual Customization:**
    - Design theme selector (Flowers, Cute, Science, Mathy, Animals)
    - Font selector (Silly, Fancy, Writer, Headlines)
  - **Actions:**
    - "Shuffle" button (randomize square positions)
    - "Save Card" button (disabled if at max cards with tooltip)
    - "Cancel" button

- **Right Panel: Live Preview**

  - Real-time rendered bingo card
  - 5x5 grid with selected resolutions
  - Drag-and-drop enabled to swap squares
  - Click any square to open edit modal

- **Square Edit Modal:**
  - Dropdown to change resolution selection
  - Bingo phrase input (max 30 chars)
  - "Update" and "Cancel" buttons

#### **Page 5: My Bingo Cards (List)**

- **URL:** `#/bingo-cards`
- **Purpose:** View collection of saved bingo cards
- **Components:**
  - Grid or list of saved cards (thumbnails with save names)
  - Per card actions:
    - View (navigates to single card view)
    - Copy (navigates to creator with pre-filled data)
    - Delete (with confirmation)
  - "Create New Card" button (disabled if at max with tooltip)
  - Empty state: "You haven't created any bingo cards yet"

#### **Page 6: View Single Bingo Card**

- **URL:** `#/bingo-card/:id`
- **Purpose:** View and print a specific bingo card
- **Components:**
  - Full-size card preview
  - Print options panel:
    - Card size selector (Full Page / 5"x5" / 6"x6" / 7"x7")
    - Color mode (Color / Grayscale)
    - "Print" button (opens browser print dialog)
  - Action buttons:
    - "Edit Card" (returns to creator)
    - "Copy Card" (navigates to creator with pre-filled data)
    - "Delete Card" (with confirmation)
    - "Back to My Cards"

#### **Page 7: Settings**

- **URL:** `#/settings`
- **Purpose:** Configure app preferences and manage data
- **Sections:**

  **Profile Management**

  - Current profile indicator
  - "Switch Profile" dropdown
  - "Create New Profile" button
  - "Rename Profile" button
  - "Delete Profile" button (with confirmation, disabled if only profile)

  **Life Categories**

  - List of current categories with color swatches
  - "Add Category" button (shows predefined suggestions + custom option)
  - Edit button per category (change name or color)
  - Delete button per category (with warning if used in resolutions)

  **Display Preferences**

  - Checkboxes for:
    - Show Excitement Level
    - Show Frequency
    - Show Life Category

  **Data Management**

  - "Export Data" button (downloads JSON file)
  - "Import Data" button (file picker for JSON)
  - "Clear All Data" button (with serious confirmation warning)

  **Information**

  - App version
  - Last backup date (if any exports done)

#### **Page 8: Help**

- **URL:** `#/help`
- **Purpose:** Explain app features and usage
- **Content:**
  - What is Resolution Bingo?
  - How to add resolutions
  - How to create bingo cards
  - How to customize and print cards
  - Using profiles for family members
  - Backing up your data
  - Tips for success (e.g., filter by Single Occurrence for bingo)
  - Future features (Achievement Tree, Warrior Armor, etc.)

---

## 5. Visual Design Specifications

### 5.1 Design Principles

- **ADHD-Friendly:** Clear visual hierarchy, minimal distractions, satisfying interactions
- **Playful & Artistic:** Hand-drawn aesthetics, fun fonts, colorful but not overwhelming
- **Printer-Friendly:** Simple line art, good contrast, works in grayscale

### 5.2 Color Palette

**Primary Colors:**

- Primary Blue: `#4A90E2`
- Primary Green: `#7ED321`
- Primary Purple: `#9B59B6`

**Life Category Predefined Colors:**

- Red: `#E74C3C`
- Orange: `#E67E22`
- Yellow: `#F39C12`
- Green: `#27AE60`
- Teal: `#16A085`
- Blue: `#2980B9`
- Purple: `#8E44AD`
- Pink: `#E91E63`
- Brown: `#795548`
- Gray: `#95A5A6`

**Excitement Level Colors/Emojis:**

1. Dreading: 😰 (Red tint)
2. Not fond of: 😕 (Orange tint)
3. Neutral: 😐 (Gray)
4. Feeling good: 🙂 (Light green)
5. Really excited: 😄 (Bright green)

### 5.3 Typography

**Web Interface Fonts:**

- Headers: "Fredoka One" or "Baloo 2" (playful, rounded)
- Body: "Open Sans" or "Roboto" (clean, readable)
- Accents: "Patrick Hand" (handwritten feel)

**Bingo Card Fonts:**

- **Silly:** "Comic Neue", "Bangers"
- **Fancy:** "Playfair Display", "Cinzel"
- **Writer:** "Patrick Hand", "Shadows Into Light"
- **Headlines:** "Bebas Neue", "Oswald"

### 5.4 Bingo Card Themes

Each theme affects multiple visual elements:

**Flowers Theme:**

- Background: Subtle floral pattern (line art)
- Grid: Vine-like borders
- Free Square: Flower icon (daisy or sunflower)
- Header/Footer: Floral garland decoration
- Colors: Pastels (pink, lavender, mint)

**Cute Theme:**

- Background: Stars, hearts, tiny doodles
- Grid: Rounded corners, soft lines
- Free Square: Heart or star
- Header/Footer: Cute character illustrations
- Colors: Bright pastels (baby blue, light pink, yellow)

**Science Theme:**

- Background: Atoms, beakers, chemical formulas
- Grid: Technical, ruler-like borders
- Free Square: Atom symbol or beaker
- Header/Footer: Laboratory equipment illustrations
- Colors: Blues, greens, scientific aesthetic

**Mathy Theme:**

- Background: Geometric patterns, equations
- Grid: Graph paper aesthetic
- Free Square: Pi symbol or calculator
- Header/Footer: Mathematical symbols and shapes
- Colors: Black, white, primary colors (like textbooks)

**Animals Theme:**

- Background: Paw prints, animal tracks
- Grid: Natural, organic borders
- Free Square: Paw print or generic animal silhouette
- Header/Footer: Animal illustrations
- Colors: Earthy tones (browns, greens, tans)

### 5.5 Print Specifications

**Card Sizes:**

- **Full Page:** 8.5" x 11" (with margins for header/footer)
- **5" x 5":** Standard bingo card size
- **6" x 6":** Medium size (better readability)
- **7" x 7":** Large size (most readable)

**Print Margins:**

- Minimum 0.25" bleed on all sides
- Safe zone for text: 0.5" from edges

**Print Considerations:**

- Use strokes/outlines instead of solid fills where possible
- Minimum font size: 10pt for readability
- High contrast in grayscale mode
- Grid lines: 2pt weight

---

## 6. User Interactions & Workflows

### 6.1 First-Time User Journey

1. User visits site for first time
2. Welcome screen appears: "What's your Name?"
3. User enters name (creates first profile)
4. Redirect to main resolutions page (empty state)
5. Message appears: "Get started by adding your first resolution! Visit Settings to customize your categories and colors."
6. User adds resolutions
7. User creates first bingo card
8. User prints card

### 6.2 Creating a Bingo Card Workflow

1. From main page, click "Create a Bingo Card"
2. Enter save name and printed title
3. Apply filters to view specific resolutions
4. Click "Add to Card" for desired resolutions (up to 25)
5. Select design theme and font
6. Preview updates in real-time
7. Click "Shuffle" to randomize positions (optional)
8. Drag-and-drop to manually adjust positions (optional)
9. Click individual squares to customize bingo phrases
10. Click "Save Card"
11. Redirect to single card view
12. Adjust print options and click "Print"

### 6.3 Managing Multiple Profiles

1. Go to Settings
2. Click "Create New Profile"
3. Enter name for new profile
4. System switches to new profile (empty data)
5. To switch back: Settings > "Switch Profile" dropdown
6. Each profile has independent:
   - Resolutions
   - Life categories (with own colors)
   - Bingo cards
   - Display preferences

### 6.4 Data Export/Import Workflow

**Export:**

1. Settings > "Export Data"
2. Browser downloads `resolution-bingo-backup-[timestamp].json`
3. File contains all profiles and their data
4. App records last backup timestamp

**Import:**

1. Settings > "Import Data"
2. User selects JSON file
3. App validates file structure
4. If valid, merges data:
   - Profiles matched by UUID
   - Resolutions/cards matched by UUID
   - Conflicts resolved by most recent `updatedAt`
   - Duplicate profile names show UUID in parentheses
5. Success message with summary: "Imported X resolutions, Y bingo cards across Z profiles"
6. If invalid: "Unable to load from your file: invalid json"

### 6.5 Deleting a Resolution in Use

1. User clicks delete on resolution
2. App checks if resolution is in any saved bingo cards
3. If yes, modal appears: "This resolution is used in 3 bingo card(s). If you delete it, those squares will become Free squares. Continue?"
4. If user confirms:
   - Resolution is deleted
   - All affected bingo cards update automatically
   - Affected squares become Free squares (theme-styled)
   - Custom bingo phrases removed
5. Auto-save triggers
6. User returns to resolution list

---

## 7. Validation & Error Handling

### 7.1 Input Validation

**Resolution Text:**

- Max 1000 characters
- Real-time counter: "950 / 1000"
- Warning at 980+: Red text, "Too long"
- Cannot save if over limit

**Bingo Phrase:**

- Max 30 characters
- Real-time validation in modal
- Red border and "Too long" message if exceeded

**Titles & Names:**

- Max 30 characters (bingo card save name, title)
- Max 50 characters (profile name, life category name)
- Real-time feedback

**Profile Name:**

- Required field
- Minimum 1 character
- Maximum 50 characters

### 7.2 System Limits

**Maximum Counts:**

- Resolutions: 2000 per profile
- Bingo Cards: 40 per profile
- Profiles: No hard limit (reasonable use expected)
- Life Categories: No hard limit (reasonable use expected)

**Enforcement:**

- "Create" buttons disabled when at limit
- Tooltip on hover: "You've reached the maximum of X resolutions/cards"
- Visual indicator (grayed out button)

### 7.3 Error Messages

**Import Errors:**

- Invalid JSON: "Unable to load from your file: invalid json"
- Wrong format: "This file doesn't appear to be a Resolution Bingo backup"
- Corrupted data: "Some data in this file is corrupted and couldn't be imported"

**LocalStorage Errors:**

- Quota exceeded: "Storage is full. Please export your data and clear old items, or use a different browser."
- Access denied: "Unable to save data. Please check your browser settings."

**General Errors:**

- Network issues (N/A for static site)
- Browser compatibility: "This browser may not support all features. Please use a modern browser."

---

## 8. Non-Functional Requirements

### 8.1 Performance

- Page load: < 2 seconds
- Auto-save delay: 500ms after last keystroke (debounced)
- Real-time preview: < 100ms update latency
- Smooth drag-and-drop: 60fps animations

### 8.2 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 8.3 Storage

- Estimate: ~5KB per resolution, ~10KB per bingo card
- Expected usage: 100 resolutions + 10 cards = ~600KB
- LocalStorage limit: 5-10MB (browser dependent)
- Sufficient for expected use cases

### 8.4 Print Quality

- Minimum 300 DPI equivalent for crisp lines
- Font sizes readable at print size
- Margins prevent content cutoff
- Grayscale mode maintains sufficient contrast

### 8.5 Accessibility (V1)

- Keyboard navigation for forms
- Focus indicators on interactive elements
- Semantic HTML for screen readers (basic support)
- Color contrast meets WCAG 2.1 Level AA (for web interface)
- Print output optimized for visual use (not screen reader focused)

---

## 9. Future Enhancements (Post-V1)

### 9.1 Additional Gamification Trackers

- **Achievement Tree:** Printable tree that grows as you complete habits
- **Sticker Map/Passport:** Travel-style tracker for ongoing goals
- **Warrior Armor:** Piece-by-piece visual for completing dreaded tasks

### 9.2 Feature Ideas

- Bingo completion tracking (digital checkboxes before printing)
- Social sharing (export card as image)
- Collaborative cards (family bingo cards)
- Progress statistics and insights
- Reminder notifications (if hosted with backend)
- Mobile app version
- Additional themes and fonts
- Custom theme creator
- Animation effects on completion
- Goal scheduling/calendar integration

### 9.3 Technical Improvements

- Backend sync for cross-device access
- Cloud backup integration
- PWA (Progressive Web App) for offline use
- Export cards as PNG/JPEG images
- Collaborative editing (real-time with others)

---

## 10. Success Metrics

### 10.1 User Engagement (If analytics added)

- Number of resolutions created per user
- Number of bingo cards created per user
- Return visits (weekly/monthly active users)
- Time spent in card creator
- Print button clicks

### 10.2 Quality Indicators

- Low bounce rate on first visit
- High completion rate (welcome → first card printed)
- Frequent data exports (indicates value)
- Multiple profiles created (family usage)

### 10.3 User Satisfaction

- Qualitative feedback
- Feature requests
- Bug reports
- Social media mentions/shares

---

## 11. Conclusion

Resolution Bingo is designed to transform goal-setting from a chore into a delightful, creative experience. By focusing on visual appeal, ease of use, and the satisfying feeling of crossing items off a physical bingo card, the app leverages gamification principles to help users stay engaged with their resolutions throughout the year.

The architecture prioritizes simplicity and user control, with all data stored locally and easy export/import for peace of mind. The ADHD-friendly design ensures the interface is not overwhelming while still providing powerful customization options.

**Core Success Factors:**

1. **Visual Appeal:** Beautiful, printable bingo cards
2. **Ease of Use:** Intuitive interface with auto-save
3. **Flexibility:** Customizable categories, themes, and multiple profiles
4. **Physical Reminder:** Printable output that's hard to ignore
5. **Family-Friendly:** Multi-profile support for household use

With this foundation, Resolution Bingo can evolve into a comprehensive goal-tracking ecosystem with additional gamification tools while maintaining its core mission: making resolutions fun.
