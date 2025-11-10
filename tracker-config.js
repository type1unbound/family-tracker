/**
 * TRACKER-CONFIG.JS - Application Configuration
 * Contains all default configurations, color palettes, and initial data structures
 */

const CONFIG = {
    COLOR_PALETTES: {
    lavender: {
        name: 'Lavender Dreams',
        bgGradient1: '#a78bfa', // Soft purple
        bgGradient2: '#6366f1', // Rich indigo
        statCard: '#4c1d95', // Dark purple - excellent contrast
        profileButton: '#7c3aed',
        characterButton1: '#e9d5ff', // Lightest lavender
        characterButton15: '#c4b5fd', // Soft purple
        characterButton2: '#a78bfa'  // Medium purple
    },
    peach: {
        name: 'Peach Blossom',
        bgGradient1: '#fda4af', // Soft pink
        bgGradient2: '#fb923c', // Warm peach
        statCard: '#9a3412', // Deep orange-brown - excellent contrast
        profileButton: '#f97316',
        characterButton1: '#fed7aa', // Lightest peach
        characterButton15: '#fdba74', // Soft peach
        characterButton2: '#fb923c'  // Warm peach
    },
    sage: {
        name: 'Sage Meadow',
        bgGradient1: '#86efac', // Light green
        bgGradient2: '#059669', // Deep emerald
        statCard: '#064e3b', // Deep forest - excellent contrast
        profileButton: '#10b981',
        characterButton1: '#d1fae5', // Lightest mint
        characterButton15: '#86efac', // Soft green
        characterButton2: '#34d399'  // Emerald
    },
    sky: {
        name: 'Clear Sky',
        bgGradient1: '#7dd3fc', // Light sky blue
        bgGradient2: '#2563eb', // Deep blue
        statCard: '#1e3a8a', // Deep navy - excellent contrast
        profileButton: '#3b82f6',
        characterButton1: '#dbeafe', // Lightest sky
        characterButton15: '#93c5fd', // Soft blue
        characterButton2: '#60a5fa'  // Bright blue
    },
    honey: {
        name: 'Honey Gold',
        bgGradient1: '#fcd34d', // Soft gold
        bgGradient2: '#d97706', // Rich amber
        statCard: '#78350f', // Deep brown - excellent contrast
        profileButton: '#f59e0b',
        characterButton1: '#fef3c7', // Cream
        characterButton15: '#fde68a', // Soft gold
        characterButton2: '#fbbf24'  // Warm yellow
    },
    rose: {
        name: 'Rose Garden',
        bgGradient1: '#f9a8d4', // Soft pink
        bgGradient2: '#db2777', // Deep rose
        statCard: '#831843', // Deep burgundy - excellent contrast
        profileButton: '#ec4899',
        characterButton1: '#fce7f3', // Lightest pink
        characterButton15: '#f9a8d4', // Soft rose
        characterButton2: '#f472b6'  // Bright pink
    },
    slate: {
        name: 'Soft Slate',
        bgGradient1: '#94a3b8', // Medium gray
        bgGradient2: '#475569', // Slate
        statCard: '#1e293b', // Deep slate - excellent contrast
        profileButton: '#64748b',
        characterButton1: '#f1f5f9', // Lightest slate
        characterButton15: '#cbd5e1', // Soft gray
        characterButton2: '#94a3b8'  // Medium gray
    },
    aqua: {
        name: 'Aqua Marine',
        bgGradient1: '#5eead4', // Bright aqua
        bgGradient2: '#0891b2', // Deep teal
        statCard: '#134e4a', // Deep teal - excellent contrast
        profileButton: '#14b8a6',
        characterButton1: '#ccfbf1', // Lightest mint
        characterButton15: '#5eead4', // Soft aqua
        characterButton2: '#2dd4bf'  // Bright teal
    },
    terracotta: {
        name: 'Terracotta',
        bgGradient1: '#fb923c', // Warm orange
        bgGradient2: '#c2410c', // Deep terracotta
        statCard: '#7c2d12', // Rich brown - excellent contrast
        profileButton: '#ea580c',
        characterButton1: '#fed7aa', // Soft peach
        characterButton15: '#fdba74', // Light orange
        characterButton2: '#fb923c'  // Warm orange
    }
},

DEFAULT_SCHEDULE: [
    { id: 1, time: '7:00am', name: 'Wake-up time', tasks: ['Wake up on time'], days: [0,1,2,3,4,5,6] },
    { id: 2, time: '7:15am', name: 'Breakfast time', tasks: ['Eat full serving of fruits/vegetables', 'Drink water'], days: [0,1,2,3,4,5,6] },
    { id: 3, time: '7:40am', name: 'Morning routine', tasks: ['Brush teeth', 'Take vitamins/meds', 'Get dressed', 'Backpack ready'], days: [0,1,2,3,4,5,6] },
    { id: 4, time: '8:20am', name: 'School departure', tasks: ['Leave on time'], days: [0,1,2,3,4,5,6] },
    { id: 5, time: '4:00pm', name: 'After school cool-down', tasks: ['Remove headphones when entering', 'Take care of lunchbox, backpack, and shoes', 'Snack', 'Outdoor/fresh air time'], days: [0,1,2,3,4,5,6] },
    { id: 6, time: '4:30pm', name: 'Homework check/plan', tasks: ['Review homework', 'No headphones during planning'], days: [0,1,2,3,4,5,6] },
    { id: 7, time: '4:45pm', name: 'Daily chores/room tidy', tasks: ['Complete daily chores', 'Quick room tidy', 'Box check'], days: [0,1,2,3,4,5,6] },
    { id: 8, time: '5:00pm', name: 'Homework time', tasks: ['Complete homework', 'No recreational audio'], days: [0,1,2,3,4,5,6] },
    { id: 9, time: '5:30pm', name: 'Free time', tasks: ['30 min exercise (if not done)', 'Screen time only if chores/homework done', 'Personal audio allowed'], days: [0,1,2,3,4,5,6] },
    { id: 10, time: '5:45pm', name: 'Dinner prep', tasks: ['Help in kitchen', 'No headphones'], days: [0,1,2,3,4,5,6] },
    { id: 11, time: '6:00pm', name: 'Dinner', tasks: ['Eat full serving of fruits/vegetables', 'Drink water', 'Table etiquette', 'No screens/headphones'], days: [0,1,2,3,4,5,6] },
    { id: 12, time: '6:30pm', name: 'Dinner clean-up', tasks: ['Help clean up', 'No headphones'], days: [0,1,2,3,4,5,6] },
    { id: 13, time: '6:45pm', name: 'Family time', tasks: ['No personal screens', 'Be present'], days: [0,1,2,3,4,5,6] },
    { id: 14, time: '7:45pm', name: 'Evening snack', tasks: ['Drink water'], days: [0,1,2,3,4,5,6] },
    { id: 15, time: '8:00pm', name: 'PJs and teeth', tasks: ['Brush teeth', 'Evening meds if needed', 'Put on pajamas'], days: [0,1,2,3,4,5,6] },
    { id: 16, time: '8:30pm', name: 'In bed/reading', tasks: ['In bed by 8:30', 'No screens', 'Reading time'], days: [0,1,2,3,4,5,6] },
    { id: 17, time: '9:00pm', name: 'Lights out', tasks: ['Lights out', 'Sleep'], days: [0,1,2,3,4,5,6] }
],

DEFAULT_CHARACTER_VALUES: [
    { id: 'conflict', category: 'Conflict Resolution & Emotional Regulation', weight: 0.3, items: [
        'Solving problems without escalating emotions',
        'Apologizing and recognizing own part',
        'Making relationship right before justifying position'
    ]},
    { id: 'respect', category: 'Respect & Consideration', weight: 0.2, items: [
        'Asking and putting others first',
        'Not interrupting when others speak'
    ]},
    { id: 'etiquette', category: 'Dinner Table Etiquette', weight: 0.2, items: [
        'Using utensils properly',
        'Asking to be excused',
        'Chewing with mouth closed',
        'Staying seated / calm body'
    ]},
    { id: 'transitions', category: 'Self-Managing Transitions', weight: 0.3, items: [
        'Moving between activities without reminders',
        'Getting ready on time',
        'Leaving places after cleaning/tidying',
        'Stopping when time, asking calmly for more',
        'Being OK if answer is no'
    ]}
],

DEFAULT_WEEKLY_CHORES: [
    { id: 'sweep', name: 'Sweeping floors' },
    { id: 'table', name: 'Cleaning table' },
    { id: 'bathrooms', name: 'Cleaning up bathrooms' },
    { id: 'basement', name: 'Cleaning basement' },
    { id: 'garbage', name: 'Taking out garbage/recycling' },
    { id: 'shoes', name: 'Cleaning up shoe/backpack area' }
];

]
};

// Make CONFIG available globally
window.CONFIG = CONFIG;
