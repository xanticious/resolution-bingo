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
  'Education',
  'Career',
  'Finances',
  'Relationships',
  'Family',
  'Friendships',
  'Social',
  'Exercise',
  'Nutrition',
  'Self-Care',
  'Mental Health',
  'Creative',
  'Hobbies',
  'Travel',
  'Adventure',
  'Home',
  'Environment',
  'Community',
  'Spirituality',
];

export const CATEGORY_COLORS = [
  { name: 'Coral', color: '#E74C3C' },
  { name: 'Orange', color: '#E67E22' },
  { name: 'Sunflower', color: '#F39C12' },
  { name: 'Gold', color: '#F4D03F' },
  { name: 'Lime', color: '#A9DFBF' },
  { name: 'Emerald', color: '#27AE60' },
  { name: 'Mint', color: '#16A085' },
  { name: 'Turquoise', color: '#48C9B0' },
  { name: 'Sky', color: '#5DADE2' },
  { name: 'Ocean', color: '#2980B9' },
  { name: 'Lavender', color: '#BB8FCE' },
  { name: 'Purple', color: '#8E44AD' },
  { name: 'Violet', color: '#9B59B6' },
  { name: 'Pink', color: '#E91E63' },
  { name: 'Rose', color: '#F8B4D9' },
  { name: 'Peach', color: '#FADBD8' },
  { name: 'Brown', color: '#795548' },
  { name: 'Slate', color: '#5D6D7E' },
  { name: 'Gray', color: '#95A5A6' },
  { name: 'Silver', color: '#BDC3C7' },
];

/**
 * Format frequency object for display
 * @param {Object} frequency - Frequency object with type, count, duration
 * @returns {string} - Formatted frequency string
 */
export function formatFrequency(frequency) {
  if (!frequency || !frequency.type) return 'Not set';

  switch (frequency.type) {
    case 'single':
      return 'Single';
    case 'count':
      return `${frequency.count} ${frequency.count === 1 ? 'time' : 'times'}`;
    case 'rate':
      const perDuration =
        frequency.duration === 'week'
          ? 'week'
          : frequency.duration === 'month'
          ? 'month'
          : 'year';
      return `${frequency.count} per ${perDuration}`;
    default:
      return 'Not set';
  }
}

/**
 * Get frequency type label for filtering
 * @param {string} type - Frequency type (single, count, rate)
 * @returns {string} - Human-readable type label
 */
export function getFrequencyTypeLabel(type) {
  switch (type) {
    case 'single':
      return 'Single Occurrence';
    case 'count':
      return 'Number of Times';
    case 'rate':
      return 'Number per Duration';
    default:
      return 'Unknown';
  }
}

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

/**
 * Create a new profile object
 */
export function createProfile(name) {
  return {
    id: generateUUID(),
    name: name,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  };
}

/**
 * Create a new resolution object
 */
export function createResolution(profileId, data) {
  return {
    id: generateUUID(),
    profileId: profileId,
    text: data.text || '',
    frequency: data.frequency || {
      type: 'single',
      count: null,
      duration: null,
    },
    excitementLevel: data.excitementLevel || 3,
    lifeCategoryId: data.lifeCategoryId || null,
    order: data.order || 0,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  };
}

/**
 * Create a new life category object
 */
export function createLifeCategory(profileId, name, color, isCustom = false) {
  return {
    id: generateUUID(),
    profileId: profileId,
    name: name,
    color: color,
    isCustom: isCustom,
    createdAt: getCurrentTimestamp(),
  };
}

/**
 * Create default life categories for a new profile
 */
export function createDefaultCategories(profileId) {
  const defaultCategoryNames = [
    'Health',
    'Education',
    'Career',
    'Finances',
    'Relationships',
    'Exercise',
    'Self-Care',
    'Creative',
  ];

  return defaultCategoryNames.map((name, index) => {
    const colorInfo = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
    return createLifeCategory(profileId, name, colorInfo.color, false);
  });
}

/**
 * Create a new bingo card object
 */
export function createBingoCard(profileId, data) {
  return {
    id: generateUUID(),
    profileId: profileId,
    saveName: data.saveName || '',
    title: data.title || `${new Date().getFullYear()} Bingo`,
    design: data.design || 'flowers',
    font: data.font || 'silly',
    squares: data.squares || [],
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  };
}

/**
 * Create default preferences for a profile
 */
export function createDefaultPreferences(profileId) {
  return {
    profileId: profileId,
    displayOptions: {
      showExcitementLevel: true,
      showFrequency: true,
      showLifeCategory: true,
    },
    resolutionView: 'cards',
    hasSeenWelcome: false,
  };
}

/**
 * Validate character limit
 */
export function validateCharacterLimit(text, maxLength) {
  return text.length <= maxLength;
}

/**
 * Get character count display
 */
export function getCharacterCountDisplay(text, maxLength) {
  const count = text.length;
  const isOverLimit = count > maxLength;
  return {
    count,
    maxLength,
    isOverLimit,
    display: `${count} / ${maxLength}`,
  };
}

/**
 * Merge imported data with existing data by UUID and timestamp
 */
export function mergeByUUID(existing, incoming) {
  const merged = [...existing];
  const existingMap = new Map(existing.map((item) => [item.id, item]));

  incoming.forEach((incomingItem) => {
    const existingItem = existingMap.get(incomingItem.id);

    if (!existingItem) {
      merged.push(incomingItem);
    } else if (
      new Date(incomingItem.updatedAt || incomingItem.createdAt) >
      new Date(existingItem.updatedAt || existingItem.createdAt)
    ) {
      const index = merged.findIndex((item) => item.id === incomingItem.id);
      merged[index] = incomingItem;
    }
  });

  return merged;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
