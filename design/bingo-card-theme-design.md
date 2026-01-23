# Bingo Card Theme Design Document

**Version:** 1.0  
**Date:** January 22, 2026  
**Project:** Resolution Bingo - Visual Theme System

---

## 1. Overview

This document defines the visual design system for Resolution Bingo cards, including Design Themes and Font Styles. Each theme creates a cohesive, printable aesthetic that works in both color and grayscale. Users can mix and match any theme with any font.

**Design Principles:**

- **Print-Friendly:** Line art and patterns that work in color and grayscale
- **Readable:** Text remains legible against all backgrounds
- **Distinctive:** Each theme is easily distinguishable from others
- **Inclusive:** Range of aesthetics appealing to various ages and genders
- **ADHD-Friendly:** Clear visual structure without overwhelming decoration

---

## 2. Design Themes

Each theme includes:

- **Color Palette:** 3-5 hex colors for squares, borders, text, and accents
- **Border Pattern:** SVG line art around the entire grid
- **Corner Flourishes:** Decorative elements in the four corners
- **Grid Lines:** Standard or custom styling
- **Free Square Design:** Centered text with optional symmetrical symbols
- **Grayscale Notes:** How the theme adapts without color

---

### Theme 1: Botanical Garden

**Vibe:** Elegant, nature-inspired, slightly feminine but accessible  
**Target Audience:** Adults, plant lovers, nature enthusiasts

**Color Palette:**

- Primary: `#2D5A3D` (Deep forest green)
- Secondary: `#7FA88E` (Sage green)
- Accent 1: `#E8C4A8` (Warm beige)
- Accent 2: `#C47B5C` (Terracotta)
- Background: `#F8F6F1` (Cream)

**Visual Elements:**

- **Border Pattern:** Continuous vine with leaves wrapping around the grid (line art, 3-4pt stroke)
- **Corner Flourishes:** Botanical illustration clusters (ferns, leaves, small flowers) in corners
- **Grid Lines:** Standard 2pt lines in Primary color
- **Free Square:**
  ```
      🌿 🌿
  🌿  FREE  🌿
      🌿 🌿
  ```
  Or use text only: "FREE" with leaf motifs as background

**Implementation Notes:**

- Square backgrounds: Alternating Accent 1 and Background in checkerboard pattern
- Text color: Primary on light squares
- Border uses Primary with Accent 2 highlights on leaves

**Grayscale Performance:** ★★★★★  
Botanical line art reads excellently in grayscale with good stroke contrast.

---

### Theme 2: Cosmic Explorer

**Vibe:** Space-themed, wonder-filled, gender-neutral, inspiring  
**Target Audience:** Teens to adults, astronomy enthusiasts, dreamers

**Color Palette:**

- Primary: `#1A1F3A` (Deep space blue)
- Secondary: `#4A5899` (Nebula purple-blue)
- Accent 1: `#FFD700` (Golden star)
- Accent 2: `#E8E8FF` (Pale lavender)
- Background: `#0A0E1B` (Near-black space)

**Visual Elements:**

- **Border Pattern:** Constellation lines connecting stars, orbiting planets (minimalist line art)
- **Corner Flourishes:** Stylized planetary systems with orbital rings
- **Grid Lines:** Dotted/dashed 2pt lines (like star trails) in Accent 1
- **Free Square:**
  ```
      ⭐ ✨
  🌟  FREE  ⭐
      ✨ ⭐
  ```

**Implementation Notes:**

- Square backgrounds: Secondary color with slight transparency
- Text color: Accent 2 (light text on dark background)
- Small star scatter (5pt circles) in border corners
- Alternative light version: Invert to Background `#E8E8FF`, text in Primary

**Grayscale Performance:** ★★★★☆  
Good contrast in light version; dark version needs careful handling for home printers.

---

### Theme 3: Ocean Waves

**Vibe:** Calming, fluid, natural, fresh  
**Target Audience:** All ages, ocean lovers, seeking tranquility

**Color Palette:**

- Primary: `#0C5B7A` (Deep ocean blue)
- Secondary: `#3A8BA8` (Tropical water)
- Accent 1: `#7CC9D9` (Seafoam)
- Accent 2: `#F4E6D8` (Sandy beige)
- Background: `#FAFCFD` (Sea mist white)

**Visual Elements:**

- **Border Pattern:** Stylized wave pattern (curved lines) flowing around grid
- **Corner Flourishes:** Seashells, starfish, coral illustrations
- **Grid Lines:** Wavy 2pt lines (subtle curves) in Primary color
- **Free Square:**
  ```
      🌊 🐚
  🐚  FREE  🌊
      🌊 🐚
  ```

**Implementation Notes:**

- Square backgrounds: Gradient effect using Secondary → Accent 1 (or solid Accent 1 for simplicity)
- Text color: Primary on light backgrounds
- Wave pattern uses 3-4 parallel curved lines

**Grayscale Performance:** ★★★★★  
Excellent - wave patterns and line art translate perfectly.

---

### Theme 4: Retro Arcade

**Vibe:** Energetic, playful, nostalgic, fun  
**Target Audience:** Teens to adults, gamers, 80s/90s nostalgia lovers

**Color Palette:**

- Primary: `#FF006E` (Hot pink/magenta)
- Secondary: `#FFBE0B` (Bright yellow)
- Accent 1: `#00F5FF` (Cyan)
- Accent 2: `#8338EC` (Electric purple)
- Background: `#000000` (Black) or `#1A1A1A` (Near-black)

**Visual Elements:**

- **Border Pattern:** Pixel-style geometric patterns, zigzags, and 8-bit inspired shapes
- **Corner Flourishes:** Simplified pixel art icons (hearts, stars, lightning bolts)
- **Grid Lines:** Bold 3pt lines in alternating Primary/Secondary colors (checkerboard corners)
- **Free Square:**
  ```
  ⚡ FREE ⚡
  ```
  With geometric background pattern

**Implementation Notes:**

- Square backgrounds: Alternating colors from palette (high contrast)
- Text color: White or Background on bright squares
- Use CSS to create scan-line effect (subtle horizontal lines) as optional overlay
- Alternative light version: Invert to white background with bright borders

**Grayscale Performance:** ★★☆☆☆  
Challenging - recommend light version for grayscale. Use bold borders and patterns.

---

### Theme 5: Modern Minimal

**Vibe:** Clean, sophisticated, calm, professional  
**Target Audience:** Adults, minimalism lovers, professional settings

**Color Palette:**

- Primary: `#2B2D42` (Charcoal)
- Secondary: `#8D99AE` (Cool gray)
- Accent 1: `#EDF2F4` (Off-white)
- Accent 2: `#D90429` (Crimson - single pop of color)
- Background: `#FFFFFF` (Pure white)

**Visual Elements:**

- **Border Pattern:** Single elegant line (2pt) with minimal geometric corner accents
- **Corner Flourishes:** Simple geometric shapes (circles, triangles, lines) arranged asymmetrically
- **Grid Lines:** Clean 1pt lines in Primary color
- **Free Square:**
  ```
  FREE
  ```
  Text only, or single centered dot in Accent 2

**Implementation Notes:**

- Square backgrounds: All Accent 1 (consistent, not checkerboard)
- Text color: Primary
- Accent 2 used sparingly for Free square and minimal corner details
- Maximum whitespace, minimal decoration

**Grayscale Performance:** ★★★★★  
Perfect - already designed with grayscale in mind.

---

### Theme 6: Whimsical Doodles

**Vibe:** Playful, hand-drawn, creative, joyful  
**Target Audience:** Pre-teens to adults, creative types, ADHD-friendly visual variety

**Color Palette:**

- Primary: `#4A5759` (Charcoal gray)
- Secondary: `#FFB4A2` (Coral pink)
- Accent 1: `#FDFFB6` (Soft yellow)
- Accent 2: `#B8E0D2` (Mint green)
- Background: `#FFFEF9` (Warm white)

**Visual Elements:**

- **Border Pattern:** Hand-drawn style doodles (stars, hearts, clouds, lightning, smiley faces) scattered around border
- **Corner Flourishes:** Clusters of playful doodles in corners
- **Grid Lines:** Slightly wobbly/hand-drawn style 2pt lines in Primary
- **Free Square:**
  ```
      ⭐ ☁️
  💫  FREE  ✨
      ☁️ ⭐
  ```

**Implementation Notes:**

- Square backgrounds: Random assignment from Secondary, Accent 1, Accent 2 (cheerful variety)
- Text color: Primary on all light backgrounds
- Use SVG path with slight irregularity to simulate hand-drawn lines
- Doodles should be simple outline drawings (2-3pt stroke)

**Grayscale Performance:** ★★★★☆  
Good - variety comes from pattern density, not just color.

---

### Theme 7: Zen Garden

**Vibe:** Peaceful, balanced, meditative, refined  
**Target Audience:** Adults seeking calm, mindfulness practitioners

**Color Palette:**

- Primary: `#1C3738` (Deep teal-black)
- Secondary: `#586F6B` (Muted sage)
- Accent 1: `#D4C5B9` (Warm sand)
- Accent 2: `#8B7E74` (Stone gray)
- Background: `#F5F2ED` (Parchment)

**Visual Elements:**

- **Border Pattern:** Raked sand patterns (parallel curved lines), bamboo stalks in corners
- **Corner Flourishes:** Zen stones (simple circles) stacked, minimalist branch with leaves
- **Grid Lines:** Standard 1pt lines in Primary color, very subtle
- **Free Square:**
  ```
      🪨 ☯️
  ☯️  FREE  🪨
      🪨 ☯️
  ```
  Or simple enso circle (Zen circle) behind text

**Implementation Notes:**

- Square backgrounds: Subtle texture/pattern in Accent 1, mostly flat
- Text color: Primary
- Border pattern uses thin parallel lines (1pt) to create sand texture
- Overall impression should be spacious and calm

**Grayscale Performance:** ★★★★★  
Excellent - subtle tones and line work translate beautifully.

---

### Theme 8: Bold & Bright

**Vibe:** Energetic, motivational, confident, optimistic  
**Target Audience:** All ages, those seeking energy and motivation

**Color Palette:**

- Primary: `#FF6B35` (Vibrant orange)
- Secondary: `#F7931E` (Golden orange)
- Accent 1: `#FDC500` (Sunshine yellow)
- Accent 2: `#C1292E` (Bold red)
- Background: `#FFFFFF` (White)

**Visual Elements:**

- **Border Pattern:** Thick stripes and geometric shapes (triangles, zigzags) creating dynamic frame
- **Corner Flourishes:** Burst/sunburst patterns radiating from corners
- **Grid Lines:** Bold 3pt lines in Accent 2
- **Free Square:**
  ```
  ⚡ FREE ⚡
  ```
  Or starburst background pattern

**Implementation Notes:**

- Square backgrounds: Alternating Primary and Accent 1 in checkerboard
- Text color: White text on bright backgrounds, or use bold black if readability is concern
- High contrast, high energy design
- Border uses thick lines (4-5pt) with geometric patterns

**Grayscale Performance:** ★★★☆☆  
Moderate - ensure border patterns have enough variation to read without color.

---

## 3. Font Styles

All fonts are from Google Fonts. Each style applies to the entire card (title, squares, Free squares) with size variations.

**Sizing Guidelines:**

- **Title:** 32-48pt
- **Square Text:** 12-16pt (auto-sized based on content length)
- **Free Square:** 18-24pt

---

### Font Style 1: Cheerful Handwriting

**Google Font:** "Patrick Hand"  
**Backup:** "Shadows Into Light"

**Character:** Friendly, casual, hand-drawn feel  
**Best Paired With:** Whimsical Doodles, Ocean Waves, Botanical Garden

**Specifications:**

- Weight: Regular (400)
- Letter Spacing: Normal
- Line Height: 1.3

**Free Square Example:**

```
FREE (in Patrick Hand, 20pt)
```

---

### Font Style 2: Bold Headlines

**Google Font:** "Bebas Neue"  
**Backup:** "Oswald"

**Character:** Strong, impactful, all-caps energy  
**Best Paired With:** Bold & Bright, Retro Arcade, Cosmic Explorer

**Specifications:**

- Weight: Regular (400)
- Letter Spacing: 0.05em (slightly expanded)
- Text Transform: Uppercase
- Line Height: 1.2

**Free Square Example:**

```
FREE (in Bebas Neue, all caps, 22pt)
```

---

### Font Style 3: Elegant Script

**Google Font:** "Dancing Script"  
**Backup:** "Pacifico"

**Character:** Flowing, sophisticated, celebratory  
**Best Paired With:** Botanical Garden, Zen Garden

**Specifications:**

- Weight: Medium (500) or Bold (700) for better readability
- Letter Spacing: Normal
- Line Height: 1.4

**Free Square Example:**

```
Free (in Dancing Script, 20pt, mixed case)
```

---

### Font Style 4: Quirky Fun

**Google Font:** "Fredoka"  
**Backup:** "Baloo 2"

**Character:** Rounded, playful, approachable  
**Best Paired With:** Whimsical Doodles, Ocean Waves

**Specifications:**

- Weight: Medium (500)
- Letter Spacing: Normal
- Line Height: 1.3

**Free Square Example:**

```
FREE (in Fredoka, 20pt)
```

---

### Font Style 5: Modern Sans

**Google Font:** "Poppins"  
**Backup:** "Montserrat"

**Character:** Clean, contemporary, professional  
**Best Paired With:** Modern Minimal, Zen Garden, Cosmic Explorer

**Specifications:**

- Weight: Medium (500) for body, SemiBold (600) for title
- Letter Spacing: Normal
- Line Height: 1.4

**Free Square Example:**

```
FREE (in Poppins, 20pt)
```

---

### Font Style 6: Vintage Typewriter

**Google Font:** "Special Elite"  
**Backup:** "Courier Prime"

**Character:** Nostalgic, authentic, literary  
**Best Paired With:** Zen Garden, Modern Minimal

**Specifications:**

- Weight: Regular (400)
- Letter Spacing: 0.02em
- Line Height: 1.3

**Free Square Example:**

```
FREE (in Special Elite, 18pt)
```

---

### Font Style 7: Comic Fun

**Google Font:** "Comic Neue"  
**Backup:** "Bubblegum Sans"

**Character:** Lighthearted, accessible, youthful  
**Best Paired With:** Retro Arcade, Whimsical Doodles, Bold & Bright

**Specifications:**

- Weight: Regular (400) or Bold (700)
- Letter Spacing: Normal
- Line Height: 1.3

**Free Square Example:**

```
FREE (in Comic Neue, 20pt)
```

---

### Font Style 8: Refined Serif

**Google Font:** "Playfair Display"  
**Backup:** "Merriweather"

**Character:** Classic, elegant, sophisticated  
**Best Paired With:** Botanical Garden, Zen Garden, Modern Minimal

**Specifications:**

- Weight: Medium (500) for body, Bold (700) for title
- Letter Spacing: Normal
- Line Height: 1.4

**Free Square Example:**

```
FREE (in Playfair Display, 20pt)
```

---

## 4. Implementation Guidelines

### 4.1 CSS Architecture

**Theme Classes:**

```css
.bingo-card.theme-botanical {
  /* colors, background */
}
.bingo-card.theme-cosmic {
  /* colors, background */
}
/* etc. */
```

**Font Classes:**

```css
.bingo-card.font-handwriting {
  font-family: 'Patrick Hand', cursive;
}
.bingo-card.font-headlines {
  font-family: 'Bebas Neue', sans-serif;
}
/* etc. */
```

**Combination Example:**

```html
<div class="bingo-card theme-botanical font-elegant">
  <!-- Card content -->
</div>
```

### 4.2 SVG Border Implementation

Create separate SVG files for each theme's border pattern:

- `/assets/borders/botanical-border.svg`
- `/assets/borders/cosmic-border.svg`
- etc.

Apply via CSS:

```css
.bingo-card.theme-botanical::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('/assets/borders/botanical-border.svg') no-repeat;
  background-size: 100% 100%;
  pointer-events: none;
}
```

### 4.3 Free Square Styling

Free squares should:

1. Use the theme's Free Square design specification
2. Center text both vertically and horizontally
3. Apply background patterns/symbols using pseudo-elements or background SVG
4. Scale symbols proportionally with square size

```css
.bingo-square.free-square {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  font-weight: bold;
  position: relative;
}

.theme-botanical .free-square::before {
  content: '🌿';
  position: absolute;
  /* Position decoratively */
}
```

### 4.4 Print Optimization

**Print-Specific CSS:**

```css
@media print {
  .bingo-card {
    /* Ensure high contrast */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Grayscale override if needed */
  @media print and (prefers-color-scheme: grayscale) {
    .bingo-card {
      filter: grayscale(100%);
    }
  }
}
```

**Color to Grayscale Mapping:**

- Ensure 30% minimum contrast difference between adjacent colors
- Test all themes in grayscale mode
- Use pattern density/line weight to create distinction

### 4.5 Responsive Text Sizing

Auto-size text in squares based on content length:

```javascript
function adjustTextSize(squareElement, text) {
  const baseSize = 14; // Base font size in pt
  const maxLength = 100; // Characters
  const minSize = 10;

  const length = text.length;
  let fontSize = baseSize;

  if (length > 50) {
    fontSize = Math.max(minSize, baseSize - (length - 50) * 0.1);
  }

  squareElement.style.fontSize = `${fontSize}pt`;
}
```

---

## 5. Accessibility & Usability

### 5.1 Color Contrast

All themes must meet:

- **Minimum contrast ratio:** 3:1 for large text (title)
- **Standard contrast ratio:** 4.5:1 for body text (squares)
- **Grayscale readability:** Patterns and borders visible without color

### 5.2 Font Legibility

- Minimum font size in print: 10pt
- Avoid extremely thin font weights (< 300)
- Ensure sufficient letter spacing for decorative fonts
- Test readability at arm's length (typical wall viewing distance)

### 5.3 ADHD-Friendly Design

- Clear visual hierarchy (title > squares > decorations)
- Consistent grid structure across all themes
- Decorations support focus, don't distract
- High contrast between text and background
- Visual interest without clutter

---

## 6. Future Enhancements

### 6.1 Additional Themes to Consider

- **Forest Trail:** Earthy, hiking-inspired
- **Urban Street Art:** Graffiti-style, edgy
- **Cottagecore:** Cozy, rustic, pastoral
- **Cyberpunk:** Neon, futuristic, tech
- **Desert Sunset:** Warm, southwestern
- **Northern Lights:** Aurora-inspired, magical

### 6.2 Customization Features

- User-uploaded SVG borders
- Custom color palette creator
- Theme randomizer
- Seasonal theme variants (spring florals, winter snowflakes)
- Hybrid themes (combine elements from two themes)

### 6.3 Interactive Preview

- Real-time theme switching in creator
- Side-by-side comparison view
- Grayscale preview toggle
- Print preview with actual dimensions

---

## 7. Design Asset Checklist

For each theme, create:

- [ ] Border SVG (transparent background, theme colors)
- [ ] Corner flourish SVGs (4 individual or 1 reusable)
- [ ] Free square background pattern (if using)
- [ ] CSS theme class with all colors
- [ ] Grayscale test print
- [ ] Documentation of hex codes and specifications

For each font:

- [ ] Add Google Font import to HTML
- [ ] Create CSS font class
- [ ] Test at multiple sizes (10pt - 48pt)
- [ ] Test with longest possible resolution text
- [ ] Print test for readability

---

## 8. Conclusion

This design system provides a comprehensive framework for creating beautiful, functional, printable bingo cards. Each theme and font combination offers a unique aesthetic while maintaining readability and print quality. The modular approach allows for easy expansion and user customization.

**Key Success Factors:**

1. ✅ Print-friendly line art and patterns
2. ✅ Grayscale-compatible designs
3. ✅ Distinctive, non-overlapping themes
4. ✅ Range of aesthetics (playful → sophisticated)
5. ✅ Gender-inclusive options
6. ✅ ADHD-friendly visual structure
7. ✅ Easy implementation with CSS classes
8. ✅ Google Fonts for web-safe typography

**Next Steps:**

1. Create SVG assets for each theme's border patterns
2. Implement CSS theme classes with color palettes
3. Add Google Font imports and font style classes
4. Build theme/font selector UI in card creator
5. Test print quality for all combinations
6. Gather user feedback on aesthetic preferences
