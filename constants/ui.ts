/**
 * UI Constants - Colors, Labels, and App Constants
 * Centralized constants for consistent styling across the app
 */

// User roles
export const USER_ROLES = {
  admin: "admin",
  parent: "parent",
} as const;

// Subscription statuses
export const SUBSCRIPTION_STATUS = {
  free: "free",
  active: "active",
} as const;

// Colors that extend beyond tailwind config
export const COLORS = {
  // Primary colors (matching tailwind.config.js)
  primary: "#EC4007",
  blue: "#4807EC",
  purple: "#866EFF",

  // Text colors
  text: {
    primary: "#212121",
    secondary: "#616161",
    muted: "#646577",
    light: "#F1D7C9",
    quiz: "#B89DFD",
  },

  // Border colors
  border: {
    default: "#4A413F",
    light: "#E0E0E0",
    lighter: "#FAF4F2",
    gray: "#E5E7EB",
  },

  // UI element colors
  skeleton: "#9CA3AF",
  dragHandle: "#C5C5C5",

  // Progress bar
  progressBar: {
    background: "#B0BAFF",
    border: "#DAE1F1",
    shadow: "#9A39FF",
  },

  // Modal/Button colors
  exitButton: {
    background: "#FFE0E0",
    border: "#FFC8C8",
    icon: "#EC0707",
  },
  yellowButton: "#F8D62B",
  shareModal: "#FFF8D7",

  // Mode selection
  modeText: {
    active: "#FED0C1",
    inactive: "#616161",
  },
} as const;

// Voice player labels
export const VOICE_LABELS = {
  loading: "Loading voice",
  play: "Play Voice",
  mute: "Mute Voice",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  favourites: {
    toggleFailed: "Failed to add/remove story from favourites",
  },
} as const;

// Query keys
export const QUERY_KEYS = {
  parentsFavourites: "parentsFavourites",
  availableVoices: "availableVoices",
} as const;
