/**
 * CONFIG.JS - Configuration & Constants
 * Contains all default data, color palettes, and configuration
 */

const CONFIG = {
    // Color Palettes
    COLOR_PALETTES: {
        lavender: {
            name: 'Lavender Dreams',
            bgGradient1: '#a78bfa',
            bgGradient2: '#6366f1',
            statCard: '#4c1d95',
            profileButton: '#7c3aed',
            characterButton1: '#e9d5ff',
            characterButton15: '#c4b5fd',
            characterButton2: '#a78bfa'
        },
        peach: {
            name: 'Peach Blossom',
            bgGradient1: '#fda4af',
            bgGradient2: '#fb923c',
            statCard: '#9a3412',
            profileButton: '#f97316',
            characterButton1: '#fed7aa',
            characterButton15: '#fdba74',
            characterButton2: '#fb923c'
        },
        sage: {
            name: 'Sage Meadow',
            bgGradient1: '#86efac',
            bgGradient2: '#059669',
            statCard: '#064e3b',
            profileButton: '#10b981',
            characterButton1: '#d1fae5',
            characterButton15: '#86efac',
            characterButton2: '#34d399'
        },
        sky: {
            name: 'Clear Sky',
            bgGradient1: '#7dd3fc',
            bgGradient2: '#2563eb',
            statCard: '#1e3a8a',
            profileButton: '#3b82f6',
            characterButton1: '#dbeafe',
            characterButton15: '#93c5fd',
            characterButton2: '#60a5fa'
        },
        honey: {
            name: 'Honey Gold',
            bgGradient1: '#fcd34d',
            bgGradient2: '#d97706',
            statCard: '#78350f',
            profileButton: '#f59e0b',
            characterButton1: '#fef3c7',
            characterButton15: '#fde68a',
            characterButton2: '#fbbf24'
        },
        rose: {
            name: 'Rose Garden',
            bgGradient1: '#f9a8d4',
            bgGradient2: '#db2777',
            statCard: '#831843',
            profileButton: '#ec4899',
            characterButton1: '#fce7f3',
            characterButton15: '#f9a8d4',
            characterButton2: '#f472b6'
        },
        slate: {
            name: 'Soft Slate',
            bgGradient1: '#94a3b8',
            bgGradient2: '#475569',
            statCard: '#1e293b',
            profileButton: '#64748b',
            characterButton1: '#f1f5f9',
            characterButton15: '#cbd5e1',
            characterButton2: '#94a3b8'
        },
        aqua: {
            name: 'Aqua Marine',
            bgGradient1: '#5eead4',
            bgGradient2: '#0891b2',
            statCard: '#134e4a',
            profileButton: '#14b8a6',
            characterButton1: '#ccfbf1',
            characterButton15: '#5eead4',
            characterButton2: '#2dd4bf'
        },
        terracotta: {
            name: 'Terracotta',
            bgGradient1: '#fb923c',
            bgGradient2: '#c2410c',
            statCard: '#7c2d12',
            profileButton: '#ea580c',
            characterButton1: '#fed7aa',
            characterButton15: '#fdba74',
            characterButton2: '#fb923c'
        }
    },

    // Default Schedule
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

    // Default Character Values
    DEFAULT_CHARACTER_VALUES: [
        { 
            id: 'conflict', 
            category: 'Conflict Resolution & Emotional Regulation', 
            weight: 0.3, 
            items: [
                'Solving problems without escalating emotions',
                'Apologizing and recognizing own part',
                'Making relationship right before justifying position'
            ]
        },
        { 
            id: 'respect', 
            category: 'Respect & Consideration', 
            weight: 0.2, 
            items: [
                'Asking and putting others first',
                'Not interrupting when others speak'
            ]
        },
        { 
            id: 'etiquette', 
            category: 'Dinner Table Etiquette', 
            weight: 0.2, 
            items: [
                'Using utensils properly',
                'Asking to be excused',
                'Chewing with mouth closed',
                'Staying seated / calm body'
            ]
        },
        { 
            id: 'transitions', 
            category: 'Self-Managing Transitions', 
            weight: 0.3, 
            items: [
                'Moving between activities without reminders',
                'Getting ready on time',
                'Leaving places after cleaning/tidying',
                'Stopping when time, asking calmly for more',
                'Being OK if answer is no'
            ]
        }
    ],

    // Default Weekly Chores
    DEFAULT_WEEKLY_CHORES: [
        { id: 'sweep', name: 'Sweeping floors' },
        { id: 'table', name: 'Cleaning table' },
        { id: 'bathrooms', name: 'Cleaning up bathrooms' },
        { id: 'basement', name: 'Cleaning basement' },
        { id: 'garbage', name: 'Taking out garbage/recycling' },
        { id: 'shoes', name: 'Cleaning up shoe/backpack area' }
    ]
};

// Make config available globally
window.CONFIG = CONFIG;
