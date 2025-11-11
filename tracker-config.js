/**
 * CONFIG.JS - Configuration Constants
 * Centralized configuration for the application
 */

const CONFIG = {
    // Color palettes for theming
    COLOR_PALETTES: {
        default: {
            name: 'Default',
            bgGradient1: '#667eea',
            bgGradient2: '#764ba2',
            statCard: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            profileButton: '#667eea',
            characterButton1: '#e0e7ff',
            characterButton15: '#c7d2fe',
            characterButton2: '#818cf8'
        },
        lavender: {
            name: 'Lavender',
            bgGradient1: '#667eea',
            bgGradient2: '#764ba2',
            statCard: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            profileButton: '#667eea',
            characterButton1: '#e0e7ff',
            characterButton15: '#c7d2fe',
            characterButton2: '#818cf8'
        },
        ocean: {
            name: 'Ocean',
            bgGradient1: '#06b6d4',
            bgGradient2: '#0284c7',
            statCard: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
            profileButton: '#06b6d4',
            characterButton1: '#cffafe',
            characterButton15: '#a5f3fc',
            characterButton2: '#22d3ee'
        },
        sunset: {
            name: 'Sunset',
            bgGradient1: '#f59e0b',
            bgGradient2: '#dc2626',
            statCard: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
            profileButton: '#f59e0b',
            characterButton1: '#fed7aa',
            characterButton15: '#fdba74',
            characterButton2: '#fb923c'
        },
        forest: {
            name: 'Forest',
            bgGradient1: '#10b981',
            bgGradient2: '#059669',
            statCard: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            profileButton: '#10b981',
            characterButton1: '#d1fae5',
            characterButton15: '#a7f3d0',
            characterButton2: '#6ee7b7'
        },
        rose: {
            name: 'Rose',
            bgGradient1: '#ec4899',
            bgGradient2: '#db2777',
            statCard: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            profileButton: '#ec4899',
            characterButton1: '#fce7f3',
            characterButton15: '#fbcfe8',
            characterButton2: '#f9a8d4'
        }
    },

    // Default schedule items
    DEFAULT_SCHEDULE: [],

    // Default character values
    DEFAULT_CHARACTER_VALUES: [],

    // Default weekly chores/goals
    DEFAULT_WEEKLY_CHORES: []
};

// Make CONFIG available globally
window.CONFIG = CONFIG;
