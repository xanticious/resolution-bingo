# 2026 Bingo - Requirements Notes

**Date:** January 15, 2026
**Project:** Resolution Bingo Web App

## Initial Concept

ADHD-friendly webapp to gamify New Year's resolutions through a "2026 Bingo" card system.

## Tech Stack

- Vanilla JS, HTML, CSS
- Static website (client-side only)

## Initial Requirements Summary

### Main Page - Resolution Management

- View mode: List of resolutions with properties:
  - Resolution text
  - Frequency (once and done vs. ongoing)
  - Excitement level (dreading → neutral → exciting)
- Edit mode:
  - Add/modify/delete resolutions
  - Drag/drop reordering
- Actions: "Create a 2026 Bingo Card", "View your Bingo Cards"

### Bingo Card Creator

- Real-time preview of bingo card
- Customizable card name
- Customizable title (defaults to "<Year> Bingo")
- Select up to 25 resolutions (unfilled squares = "Free")
- Filter resolutions by categories during selection
- Random shuffle with manual shuffle button
- Drag/drop to swap card positions
- Click squares to edit:
  - Resolution selection
  - Custom bingo phrase (shorter version)
- Visual customization:
  - Designs: Flowers, Cute, Science, Mathy, Animals
  - Fonts: Silly, Fancy, Writer, Headlines
- Save card to collection

### View Bingo Cards (List)

- Shows collection of saved cards
- Actions per card: View / Copy / Delete
- Create new card

### View Single Bingo Card

- Visual preview
- Print/Export to PDF options:
  - Paper size: 8.5x11 + others
  - Color or Grayscale

## Design Goals

- Fun and ADHD-friendly
- Enjoyable experience
- Simple, artistic, easily readable fonts

## Future Gamification Ideas (for later phases)

- **Achievement Tree** - Printable tracker where you add leaves each week you keep a habit (good for recurring resolutions)
- **Sticker Map/Passport** - Visual tracker for ongoing goals
- **Warrior Armor** - Add pieces when completing dreaded tasks (gamifies the hard stuff!)
- _Focus: Visual, printable, low-tech trackers that are hard to ignore_

## Questions & Answers

### Round 1 - Data, Categories, Interactivity

**Q: Data Persistence?**

- **A:** LocalStorage for primary storage
- JSON Export/Import functionality for backup and moving between devices
- Hosting on Google Pages (static site requirement)

**Q: Categories?**

- **A:** Three types of categories:

1. **Frequency** (per resolution)

   - Recurring (e.g., "exercise 3 times per week")
   - Single Occurrence (e.g., "see a play")

2. **Excitement Level** (per resolution)

   - Dreading
   - Not fond of
   - Neutral
   - Feeling good about it
   - Really excited to do this

3. **Life Categories** (user customizable)
   - Provided options: Health, Social, Creative, Career, Nutrition, Exercise, Friendships, Getting out of the House, Self-Care, Finances, Education, Travel
   - Users can create their own categories
   - Users select which categories they want to use

**Display Options:**

- Show/Hide Excitement Level
- Show/Hide Frequency
- Show/Hide Life Category

**Q: Should bingo cards be interactive for completion tracking?**

- **A:** No - bingo cards are designed to be printed as physical, persistent visual reminders. Users cross them off physically.

### Round 2 - Visual Design & UX

**Q: What do design themes affect?**

- **A:** Themes (Flowers, Cute, Science, Mathy, Animals) affect:
  - Background patterns/images
  - Grid lines
  - Free square shape
  - Framing around the grid
  - Header font/position
  - Designs in header/footer position
  - Color palette
- **Design constraint:** Must work well on home printers - simple traced line drawings, stick figures, etc.

**Q: How to edit bingo squares?**

- **A:** Modal/popup that allows changing:
  - Resolution selection
  - Bingo text (custom short form)

**Q: How should resolutions display on main page?**

- **A:** Provide 3 view options:

1. **Cards View**

   ```
   Exercise 3 times a week
      Health
      Recurring
      Dreading
   ```

   - Life categories have user-chosen colors (affects card color)
   - Use emojis/smileys for excitement level

2. **Table View**

   - Separate columns
   - All columns sortable

3. **Simple List View**
   - Combined text format: "Health - Exercise 3 times a week - Recurring - :O"
   - Uses emojis for excitement level

**Q: How should Free squares work?**

- **A:** Styled according to chosen bingo card theme
  - Examples: big star, "Free" in cursive
  - NOT user-customizable
  - Automatically fill spaces when < 25 resolutions selected

### Round 3 - Data Management & User Flow

**Q: When do users set up Life Categories?**

- **A:**
  - Settings page accessible anytime
  - First-time users see message directing them to Settings to choose colors and categories
  - Can modify at any time

**Q: How should filtering work in Bingo Card Creator?**

- **A:** Multi-option filters for all 3 category types:
  - Frequency filter (Recurring, Single Occurrence)
  - Excitement Level filter (Dreading, Not fond of, Neutral, Feeling good, Really excited)
  - Life Category filter (Health, Social, Travel, etc.)
  - Example: "Show me Single Occurrence resolutions that are Education OR Social AND are 'Feeling good' OR 'Really excited'"

**Q: Should we enforce Single Occurrence resolutions only for Bingo?**

- **A:** No enforcement - users can choose whatever they want
  - Provide helpful suggestion to filter by Single Occurrence (since those can be crossed off)
  - Some users may not fill out recurrence and hide that field entirely

**Q: What print sizes to support?**

- **A:** Not paper size, but **bingo card dimensions** (printed on 8.5x11 then cut if needed):
  - Full page (8.5x11)
  - Common smaller sizes - approximately 5" x 5"? (need to determine standard bingo card sizes)

### Round 4 - Navigation & Export

**Q: How should navigation work?**

- **A:**
  - Persistent header with nav bar on all pages
  - Browser back button should work (may need special handling for Google Pages)
  - No in-app back buttons needed
  - Clear page titles to indicate current location
  - No breadcrumbs needed
  - **Auto-save as you go** (no explicit save buttons)

**Q: How should PDF export work?**

- **A:** Use browser's Print Dialog (users can "print to PDF")
  - Target audience: home use, not businesses
  - Keep it simple

**Q: How should JSON Import/Export work?**

- **A:**
  - **Export:** Include ALL data (resolutions + all saved bingo cards)
  - **Import:** Merge with existing data
  - **Merge logic:**
    - Resolutions have unique UUID IDs and last changed timestamps
    - During merge, favor most recently modified version of each record
  - **Error handling:** Show user-friendly message for invalid files: "Unable to load from your file: invalid json"

**Q: What happens when deleting a resolution that's in saved bingo cards?**

- **A:**
  - Show warning that resolution is in use in X card(s)
  - If user proceeds with deletion:
    - Automatically update affected cards
    - Resolution becomes a "Free" square
    - Custom bingo phrase is also deleted

### Round 5 - First-Time Experience & Limits

**Q: What should first-time users see?**

- **A:**
  - Welcome message (can be dismissed/hidden)
  - Once hidden: Empty list with "Add your first resolution" button
  - Settings button visible
  - No sample data provided

**Q: What should Settings page include?**

- **A:**
  - Life Category management (add/edit/delete categories, choose colors)
  - Display preferences (show/hide fields)
  - Import/Export data buttons
  - Clear all data option

**Q: How does year/title selection work?**

- **A:**
  - Default title: "<Year> Bingo" (e.g., "2026 Bingo")
  - Fully customizable by user (can change to "2027 Bingo", "Goals", "Jim's Goals", etc.)
  - Default is just a placeholder - many users will keep it
  - User can create cards for any year regardless of current date

**Q: What limits should we set?**

- **A:**
  - Max 2000 resolutions
  - Max 40 saved bingo cards
  - Max 1000 characters for resolution text
  - Max 30 characters for bingo phrase
  - Max 30 characters for bingo card title
  - Max 30 characters for bingo card save name

### Round 6 - Profiles & Final Details

**Q: Should we support multiple people/profiles?**

- **A:** Yes! Add a 4th category type: **Person/Profile**
  - On first visit, ask "What's your Name?"
  - Settings page includes profile switching
  - Each person has completely separate data (resolutions, bingo cards, categories)
  - Use case: Family members can each have their own goals and cards

**Q: How should Life Category color selection work?**

- **A:** Predefined palette of colors (easier, more cohesive design)

**Q: Should drag & drop work on mobile/tablets?**

- **A:** Desktop-only for now
  - Not targeting small devices in foreseeable future
  - Simplifies implementation

**Q: What about responsive design for mobile?**

- **A:** Desktop-focused (mobile not a priority)

**Q: How should validation and limits be handled?**

- **A:**
  - **Max limits (40 cards, 2000 resolutions):** Disable "Create" button with tooltip explaining why
  - **Character limits:** Real-time validation
    - Mark field/text red when too long
    - Show inline error message "too long" immediately
    - Prevent submission until fixed

### Round 7 - Profile Management

**Q: How should profile management work?**

- **A:**
  - All profiles are equal (no "main" or "default")
  - Settings page allows: Create / Delete / Rename profiles
  - Profile switching available in Settings
  - Each profile has unique UUID

**Q: Are Life Categories shared across profiles?**

- **A:** No, completely independent per person
  - Each profile has their own Life Categories with their own colors
  - Predefined category suggestions (Health, Social, etc.) available to all users
  - Each person configures their own

**Q: How does Export/Import handle profiles?**

- **A:**
  - Export: ALL profiles exported at once
  - Import: ALL profiles imported and merged
  - Merge logic: Profiles matched by unique UUID
  - Name conflict handling: If two profiles have identical names, display UUID in parenthesis after name
    - Example: "John (id: 1111-2222-333-444)"
    - User can rename or delete duplicate as needed

### Round 8 - Final UI Details

**Q: Bingo Card Name vs Title - how do they work?**

- **A:** Two separate fields:
  - **Save Name** (internal, shown in card list) - e.g., "Summer Goals", "Q1 2026"
  - **Title** (printed on card header) - e.g., "2026 Bingo", "Jim's Goals"
  - Can be the same or different values

**Q: Should there be a "B-I-N-G-O" header row?**

- **A:** No - just the grid with title at top

**Q: Accessibility requirements?**

- **A:** Keep it simple for v1
  - No specific accessibility requirements yet
  - Basic color contrast for printing

**Q: Help/Documentation?**

- **A:** Yes - "Help" button in nav
  - Links to Help page explaining what app does and its features
  - Keep it simple and intuitive otherwise
