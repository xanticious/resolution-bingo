// Utility functions
export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getCurrentTimestamp() {
  return new Date().toISOString();
}

export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function createElement(tag, className = '', innerHTML = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// OpenMoji codes for excitement levels
export const EXCITEMENT_EMOJIS = {
  1: '1F630', // Anxious Face with Sweat
  2: '1F615', // Confused Face
  3: '1F610', // Neutral Face
  4: '1F642', // Slightly Smiling Face
  5: '1F601', // Beaming Face with Smiling Eyes
};

export const EXCITEMENT_LABELS = {
  1: 'Dreading',
  2: 'Not fond of',
  3: 'Neutral',
  4: 'Feeling good',
  5: 'Really excited',
};

export const PREDEFINED_CATEGORIES = [
  'Health',
  'Social',
  'Creative',
  'Career',
  'Nutrition',
  'Exercise',
  'Friendships',
  'Getting out of the House',
  'Self-Care',
  'Finances',
  'Education',
  'Travel',
];

export const CATEGORY_COLORS = [
  '#E74C3C', // Red
  '#E67E22', // Orange
  '#F39C12', // Yellow
  '#27AE60', // Green
  '#16A085', // Teal
  '#2980B9', // Blue
  '#8E44AD', // Purple
  '#E91E63', // Pink
  '#795548', // Brown
  '#95A5A6', // Gray
];

// Helper function to create OpenMoji img element
export function createOpenMoji(code, alt = '', className = '') {
  const img = document.createElement('img');
  img.src = `https://openmoji.org/data/color/svg/${code}.svg`;
  img.alt = alt;
  img.className = `openmoji ${className}`.trim();
  img.width = 72;
  img.height = 72;
  img.style.width = '1.5em';
  img.style.height = '1.5em';
  img.style.display = 'inline-block';
  img.style.verticalAlign = 'middle';
  return img;
}

// Helper function to get OpenMoji as inline HTML
export function getOpenMojiHTML(code, alt = '', className = '') {
  return `<img src="https://openmoji.org/data/color/svg/${code}.svg" alt="${alt}" class="openmoji ${className}" width="72" height="72" style="width: 1.5em; height: 1.5em; display: inline-block; vertical-align: middle;">`;
}
