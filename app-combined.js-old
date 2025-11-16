// ========================================
// FAMILY ROUTINE & VALUES TRACKER
// Combined Single-File Version for Squarespace
// All modules in one file - Ready to use!
// ========================================

const COLOR_PALETTES = {
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
};

// Data structures - now stored per child
const DEFAULT_SCHEDULE = [
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
];

const DEFAULT_CHARACTER_VALUES = [
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
];

const DEFAULT_WEEKLY_CHORES = [
    { id: 'sweep', name: 'Sweeping floors' },
    { id: 'table', name: 'Cleaning table' },
    { id: 'bathrooms', name: 'Cleaning up bathrooms' },
    { id: 'basement', name: 'Cleaning basement' },
    { id: 'garbage', name: 'Taking out garbage/recycling' },
    { id: 'shoes', name: 'Cleaning up shoe/backpack area' }
];

// State
let state = {
    currentChild: 'child1',
    currentDate: new Date().toISOString().split('T')[0],
    editMode: false,
    modalData: null,
    cropData: {
        image: null,
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        isDragging: false,
        isResizing: false,
        resizeHandle: null,
        startX: 0,
        startY: 0
    },
    children: ['child1', 'child2'], // List of active members
    data: {
        child1: { 
            name: 'Family Member 1',
            photo: null,
            colorPalette: 'lavender',
            pointsBalance: 0,
            pointsSpent: 0,
            trackers: [], // Array of health trackers
            days: {},
            schedule: JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)),
            characterValues: JSON.parse(JSON.stringify(DEFAULT_CHARACTER_VALUES)),
            weeklyChores: JSON.parse(JSON.stringify(DEFAULT_WEEKLY_CHORES))
        },
        child2: { 
            name: 'Family Member 2',
            photo: null,
            colorPalette: 'lavender',
            pointsBalance: 0,
            pointsSpent: 0,
            trackers: [], // Array of health trackers
            days: {},
            schedule: JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)),
            characterValues: JSON.parse(JSON.stringify(DEFAULT_CHARACTER_VALUES)),
            weeklyChores: JSON.parse(JSON.stringify(DEFAULT_WEEKLY_CHORES))
        }
    }
};

// Load from localStorage
// PLACEHOLDER: This will be overridden by Firebase version below
// Do NOT use localStorage - Firebase handles all storage
function loadData() {
    // This function is overridden by Firebase code
    // If you see this console log, Firebase override didn't work
    console.warn('Using placeholder loadData - Firebase override should replace this');
}

// Save to localStorage
// PLACEHOLDER: This will be overridden by Firebase version below
// Do NOT use localStorage - Firebase handles all storage
function saveData() {
    // This function is overridden by Firebase code
    // If you see this console log, Firebase override didn't work
    console.warn('Using placeholder saveData - Firebase override should replace this');
}

// Apply color palette
function applyColorPalette() {
    const child = state.data[state.currentChild];
    const palette = COLOR_PALETTES[child.colorPalette] || COLOR_PALETTES.lavender;
    
    // Update CSS variables for theme-based button gradients
    document.documentElement.style.setProperty('--theme-gradient-1', palette.bgGradient1);
    document.documentElement.style.setProperty('--theme-gradient-2', palette.bgGradient2);
    document.documentElement.style.setProperty('--theme-stat-card', palette.statCard);
    document.documentElement.style.setProperty('--theme-profile-button', palette.profileButton);
    
    // Update body background with gradient
    document.body.style.background = `linear-gradient(135deg, ${palette.bgGradient1} 0%, ${palette.bgGradient2} 100%)`;
    
    // Stat cards now use CSS variables (will update automatically)
    // But we still need to apply for existing elements
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.style.background = `linear-gradient(135deg, ${palette.bgGradient1} 0%, ${palette.bgGradient2} 100%)`;
        card.style.color = 'white';
    });
    
    // Update active child button with profile button color
    const activeBtn = document.getElementById(state.currentChild + '-btn');
    if (activeBtn) {
        activeBtn.style.background = palette.profileButton;
        activeBtn.style.borderColor = palette.profileButton;
        activeBtn.style.color = 'white';
    }
    
    // Reset non-active button
    const otherChild = state.currentChild === 'child1' ? 'child2' : 'child1';
    const otherBtn = document.getElementById(otherChild + '-btn');
    if (otherBtn) {
        otherBtn.style.background = '#e5e7eb';
        otherBtn.style.color = '#374151';
        otherBtn.style.borderColor = '#e5e7eb';
    }
    
    // Update edit mode toggle button
    const editBtn = document.getElementById('edit-mode-toggle');
    if (editBtn && !state.editMode) {
        editBtn.style.background = palette.profileButton;
    }
    
    // Update progress bars to match theme
    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach(fill => {
        fill.style.background = `linear-gradient(135deg, ${palette.bgGradient1} 0%, ${palette.bgGradient2} 100%)`;
    });
    
    // Update character value multiplier buttons
    updateCharacterButtonColors(palette);
}

function updateCharacterButtonColors(palette) {
    // Update all character multiplier button colors
    const multiplierButtons = document.querySelectorAll('.btn-multiplier-1, .btn-multiplier-15, .btn-multiplier-2');
    
    multiplierButtons.forEach(btn => {
        if (btn.classList.contains('btn-multiplier-1')) {
            btn.style.background = palette.characterButton1;
            btn.style.borderColor = palette.characterButton1;
            btn.style.color = '#1f2937'; // Dark text for light buttons
            if (btn.classList.contains('active')) {
                btn.style.background = palette.characterButton1;
                btn.style.borderColor = palette.profileButton;
                btn.style.borderWidth = '3px';
            }
        } else if (btn.classList.contains('btn-multiplier-15')) {
            btn.style.background = palette.characterButton15;
            btn.style.borderColor = palette.characterButton15;
            btn.style.color = '#1f2937'; // Dark text
            if (btn.classList.contains('active')) {
                btn.style.background = palette.characterButton15;
                btn.style.borderColor = palette.profileButton;
                btn.style.borderWidth = '3px';
            }
        } else if (btn.classList.contains('btn-multiplier-2')) {
            btn.style.background = palette.characterButton2;
            btn.style.borderColor = palette.characterButton2;
            btn.style.color = 'white'; // White text for darker button
            if (btn.classList.contains('active')) {
                btn.style.background = palette.characterButton2;
                btn.style.borderColor = palette.profileButton;
                btn.style.borderWidth = '3px';
            }
        }
    });
}

// Get current child's schedule
function getSchedule(filterByDay = true) {
    const schedule = state.data[state.currentChild].schedule;
    
    // Migrate old schedule items that don't have days field
    schedule.forEach(item => {
        if (!item.days) {
            item.days = [0,1,2,3,4,5,6]; // Default to all days
        }
    });
    
    // Sort by time
    schedule.sort((a, b) => {
        const timeA = convertTimeToMinutes(a.time);
        const timeB = convertTimeToMinutes(b.time);
        return timeA - timeB;
    });
    
    if (!filterByDay) {
        return schedule;
    }
    
    // Filter by current day of week
    const currentDate = new Date(state.currentDate + 'T00:00:00');
    const dayOfWeek = currentDate.getDay(); // 0=Sunday, 1=Monday, etc.
    
    return schedule.filter(item => item.days.includes(dayOfWeek));
}

// Helper function to convert time string to minutes for sorting
function convertTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    
    // Handle formats like "7:00am", "12:30pm", etc.
    const match = timeStr.toLowerCase().match(/(\d+):?(\d*)([ap]m)?/);
    if (!match) return 0;
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2] || 0);
    const period = match[3];
    
    // Convert to 24-hour format
    if (period === 'pm' && hours !== 12) {
        hours += 12;
    } else if (period === 'am' && hours === 12) {
        hours = 0;
    }
    
    return hours * 60 + minutes;
}

// Get current child's character values
function getCharacterValues() {
    return state.data[state.currentChild].characterValues;
}

// Get current child's weekly chores
function getWeeklyChores() {
    return state.data[state.currentChild].weeklyChores;
}

// Get day data
function getDayData() {
    const child = state.data[state.currentChild];
    if (!child.days[state.currentDate]) {
        child.days[state.currentDate] = {
            schedule: {},
            weeklyChores: {},
            categoryMultipliers: {
                conflict: 1.0,
                respect: 1.0,
                etiquette: 1.0,
                transitions: 1.0
            },
            notes: '',
            characterNotes: {}
        };
    }
    // Migrate old data format if needed
    const dayData = child.days[state.currentDate];
    if (dayData.characterMultiplier && !dayData.categoryMultipliers) {
        dayData.categoryMultipliers = {
            conflict: dayData.characterMultiplier,
            respect: dayData.characterMultiplier,
            etiquette: dayData.characterMultiplier,
            transitions: dayData.characterMultiplier
        };
        delete dayData.characterMultiplier;
    }
    if (!dayData.weeklyChores) {
        dayData.weeklyChores = {};
    }
    return child.days[state.currentDate];
}

// Get weekly chores data (aggregated across the week)
function getWeeklyChoresData() {
    const weekDates = getWeekDates(state.currentDate);
    const weeklyChores = {};
    const chores = getWeeklyChores();
    
    // Initialize all chores as not done
    chores.forEach(chore => {
        weeklyChores[chore.id] = false;
    });
    
    // Check across all days in the week
    weekDates.forEach(date => {
        const child = state.data[state.currentChild];
        const dayData = child.days[date];
        if (dayData && dayData.weeklyChores) {
            Object.keys(dayData.weeklyChores).forEach(choreId => {
                if (dayData.weeklyChores[choreId]) {
                    weeklyChores[choreId] = true;
                }
            });
        }
    });
    
    return weeklyChores;
}

// Calculate weekly chores completion percentage
function calculateChoresCompletion() {
    const weeklyChores = getWeeklyChoresData();
    const total = getWeeklyChores().length;
    const completed = Object.values(weeklyChores).filter(Boolean).length;
    return {
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        isComplete: completed === total
    };
}

// Calculate points
function calculatePoints(childId, date, includeWeeklyBonus = false) {
    const child = state.data[childId];
    const dayData = child.days[date] || { 
        schedule: {}, 
        categoryMultipliers: {
            conflict: 1.0,
            respect: 1.0,
            etiquette: 1.0,
            transitions: 1.0
        }
    };
    
    // Count completed schedule items (only count 'yes', not 'no' or undefined)
    const completed = Object.values(dayData.schedule).filter(v => v === true).length;
    const base = completed;
    
    // Calculate weighted average multiplier
    let totalMultiplier = 0;
    let totalWeight = 0;
    const savedChild = state.currentChild;
    state.currentChild = childId;
    const characterValues = getCharacterValues();
    state.currentChild = savedChild;
    
    characterValues.forEach(cat => {
        const mult = dayData.categoryMultipliers[cat.id] || 1.0;
        totalMultiplier += mult * cat.weight;
        totalWeight += cat.weight;
    });
    const avgMultiplier = totalWeight > 0 ? totalMultiplier / totalWeight : 1.0;
    
    // Calculate daily points (without weekly bonus)
    const dailyTotal = Math.round(base * avgMultiplier);
    
    // Apply weekly chores bonus only if requested (for weekly totals)
    let choresMultiplier = 1.0;
    let choresComplete = false;
    
    if (includeWeeklyBonus) {
        const currentSavedChild = state.currentChild;
        state.currentChild = childId;
        const choresData = calculateChoresCompletion();
        state.currentChild = currentSavedChild;
        
        choresMultiplier = choresData.isComplete ? 5.0 : 1.0;
        choresComplete = choresData.isComplete;
    }
    
    const finalMultiplier = avgMultiplier * choresMultiplier;
    const total = Math.round(base * finalMultiplier);
    
    return { 
        base, 
        total: includeWeeklyBonus ? total : dailyTotal,
        dailyTotal, // Always available
        multiplier: avgMultiplier,
        choresMultiplier,
        finalMultiplier,
        choresComplete
    };
}

// Get week dates
function getWeekDates(date) {
    const d = new Date(date + 'T00:00:00');
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {  // Changed from 5 to 7 days
        const current = new Date(monday);
        current.setDate(monday.getDate() + i);
        dates.push(current.toISOString().split('T')[0]);
    }
    return dates;
}

// Format week range for display
function getWeekRangeDisplay(date) {
    const dates = getWeekDates(date);
    const startDate = new Date(dates[0] + 'T00:00:00');
    const endDate = new Date(dates[dates.length - 1] + 'T00:00:00');
    
    const options = { month: 'short', day: 'numeric' };
    const start = startDate.toLocaleDateString('en-US', options);
    const end = endDate.toLocaleDateString('en-US', options);
    
    return `Week of ${start} - ${end}`;
}

// Calculate weekly total (with weekly bonus)
function calculateWeeklyTotal() {
    const dates = getWeekDates(state.currentDate);
    const dailySum = dates.reduce((sum, d) => {
        return sum + calculatePoints(state.currentChild, d, false).dailyTotal;
    }, 0);
    
    // Apply weekly chores bonus to the total
    const choresData = calculateChoresCompletion();
    const weeklyMultiplier = choresData.isComplete ? 5.0 : 1.0;
    
    return Math.round(dailySum * weeklyMultiplier);
}

// Calculate maximum possible daily points
function calculateMaxDailyPoints() {
    const scheduleItems = getSchedule().length;
    const maxCharacterMultiplier = 2.0; // Maximum character multiplier
    // Don't include weekly 5x bonus for daily max (it's a weekly bonus)
    return Math.round(scheduleItems * maxCharacterMultiplier);
}

// Calculate maximum possible weekly points
function calculateMaxWeeklyPoints() {
    const scheduleItems = getSchedule().length;
    const maxCharacterMultiplier = 2.0;
    const weekDays = 7; // Mon-Sun (full week)
    const weeklyChoresBonus = 5.0; // 5x multiplier
    
    // Max weekly = (daily max × 7 days) × weekly chores bonus
    return Math.round(scheduleItems * maxCharacterMultiplier * weekDays * weeklyChoresBonus);
}

// Calculate dynamic goals (70% of max possible)
function getDailyGoal() {
    return Math.round(calculateMaxDailyPoints() * 0.7);
}

function getWeeklyGoal() {
    return Math.round(calculateMaxWeeklyPoints() * 0.7);
}

// Calculate streak
function calculateStreak() {
    const today = new Date();
    let streak = 0;
    let current = new Date(today);
    const dailyGoal = getDailyGoal();
    
    while (streak < 30) {
        const dateStr = current.toISOString().split('T')[0];
        
        // Count all days (including weekends) for streak
        const points = calculatePoints(state.currentChild, dateStr);
        if (points.total >= dailyGoal) {
            streak++;
        } else {
            break;
        }
        
        current.setDate(current.getDate() - 1);
    }
    
    return streak;
}

// UI Updates
function updateUI() {
    const dayData = getDayData();
    const points = calculatePoints(state.currentChild, state.currentDate);
    const weekly = calculateWeeklyTotal();
    const streak = calculateStreak();
    const choresData = calculateChoresCompletion();
    
    // Update stats
    const maxSchedulePoints = getSchedule().length;
    const child = state.data[state.currentChild];
    const dailyGoal = getDailyGoal();
    const weeklyGoal = getWeeklyGoal();
    
    // Calculate total earned points from all completed days
    let totalEarned = 0;
    Object.keys(child.days).forEach(date => {
        const dayPoints = calculatePoints(state.currentChild, date);
        if (dayPoints.total > 0) {
            totalEarned += dayPoints.total;
        }
    });
    
    // Track spent points separately
    if (child.pointsSpent === undefined) {
        child.pointsSpent = 0;
    }
    
    // Balance = Total Earned - Total Spent
    child.pointsBalance = totalEarned - child.pointsSpent;
    
    document.getElementById('base-points').textContent = child.pointsBalance;
    document.getElementById('balance-sublabel').textContent = `+${points.total} today`;
    document.getElementById('multiplier').textContent = points.multiplier.toFixed(1) + 'x';
    document.getElementById('multiplier-label').textContent = 
        points.multiplier < 1.3 ? 'Standard' : 
        points.multiplier < 1.8 ? 'Good!' : 'Excellent!';
    
    // Show chores completion status (5x applies to weekly total)
    document.getElementById('chores-multiplier').textContent = choresData.isComplete ? '5.0x' : '1.0x';
    document.getElementById('chores-label').textContent = 
        choresData.isComplete ? '🎉 Weekly Bonus!' : `${choresData.completed}/${choresData.total} goals`;
    
    document.getElementById('total-points').textContent = points.total;
    document.getElementById('daily-goal-label').textContent = `Goal: ${dailyGoal}`;
    document.getElementById('weekly-points').textContent = weekly;
    document.getElementById('weekly-goal-label').textContent = `Goal: ${weeklyGoal}`;
    
    // Update progress bars with dynamic goals
    const dailyPercent = Math.min(Math.round((points.total / dailyGoal) * 100), 100);
    const weeklyPercent = Math.min(Math.round((weekly / weeklyGoal) * 100), 100);
    
    document.getElementById('daily-percent').textContent = dailyPercent + '%';
    document.getElementById('daily-progress').style.width = dailyPercent + '%';
    document.getElementById('weekly-percent').textContent = weeklyPercent + '%';
    document.getElementById('weekly-progress').style.width = weeklyPercent + '%';
    
    // Update streak
    const streakContainer = document.getElementById('streak-container');
    if (streak > 0) {
        streakContainer.innerHTML = `
            <div class="streak-card">
                <div class="streak-icon">🔥</div>
                <div>
                    <div class="streak-text">${streak} Day Streak!</div>
                    <div class="streak-subtext">Keep up the great work!</div>
                </div>
            </div>
        `;
    } else {
        streakContainer.innerHTML = '';
    }
    
    // Update schedule
    renderSchedule();
    
    // Update weekly chores
    renderWeeklyChores();
    
    // Update notes
    document.getElementById('daily-notes').value = dayData.notes || '';
    
    // Update character sections
    renderCharacterSections();
}

function renderSchedule() {
    const dayData = getDayData();
    const list = document.getElementById('schedule-list');
    const isEditMode = state.editMode;
    
    // In edit mode, show all items. Otherwise, filter by current day
    const schedule = getSchedule(!isEditMode);
    
    list.innerHTML = schedule.map((item, index) => {
        const status = dayData.schedule[item.id]; // true, false, or undefined
        const isYes = status === true;
        const isNo = status === false;
        const completed = isYes;
        
        // Get day names for display
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const itemDays = item.days || [0,1,2,3,4,5,6];
        const dayLabels = itemDays.map(d => dayNames[d]).join(', ');
        const showsAllDays = itemDays.length === 7;
        
        return `
            <div class="timeline-item">
                <div class="timeline-dot ${completed ? 'completed' : ''}"></div>
                <div class="schedule-item ${completed ? 'completed' : ''}">
                    <div class="schedule-header">
                        <div>
                            <div class="schedule-time">${item.time}</div>
                            <div class="schedule-name">${item.name}</div>
                            ${isEditMode && !showsAllDays ? `<div style="font-size: 11px; color: #6b7280; margin-top: 4px;">📅 ${dayLabels}</div>` : ''}
                        </div>
                        <div class="yes-no-buttons">
                            <button 
                                class="yes-no-btn ${isYes ? 'yes' : ''}" 
                                onclick="setScheduleStatus(${item.id}, true)"
                            >✓ Yes</button>
                            <button 
                                class="yes-no-btn ${isNo ? 'no' : ''}" 
                                onclick="setScheduleStatus(${item.id}, false)"
                            >✗ No</button>
                        </div>
                    </div>
                    <ul class="task-list">
                        ${item.tasks.map(task => `<li>${task}</li>`).join('')}
                    </ul>
                    ${isEditMode ? `
                        <div class="edit-controls">
                            <button class="edit-btn" onclick="editScheduleItem(${index})">✏️ Edit</button>
                            <button class="edit-btn delete" onclick="deleteScheduleItem(${index})">🗑️ Delete</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    if (isEditMode) {
        list.innerHTML += `
            <button class="add-item-btn" onclick="addScheduleItem()">+ Add Routine Item</button>
        `;
    }
}

function renderWeeklyChores() {
    const dayData = getDayData();
    const weeklyChoresData = getWeeklyChoresData();
    const choresCompletion = calculateChoresCompletion();
    const chores = getWeeklyChores();
    const isEditMode = state.editMode;
    
    // Update week range display
    const weekRange = document.getElementById('week-range');
    if (weekRange) {
        weekRange.textContent = getWeekRangeDisplay(state.currentDate);
    }
    
    // Update completion badge
    const badge = document.getElementById('chores-completion-badge');
    badge.innerHTML = `
        <div class="completion-badge ${choresCompletion.isComplete ? 'complete' : 'incomplete'}">
            ${choresCompletion.completed} / ${choresCompletion.total} Complete (${choresCompletion.percentage}%)
            ${choresCompletion.isComplete ? '🎉 5x BONUS ACTIVE!' : ''}
        </div>
    `;
    
    // Render chores list
    const list = document.getElementById('weekly-chores-list');
    list.innerHTML = chores.map((chore, index) => {
        const isCompleteThisWeek = weeklyChoresData[chore.id];
        
        return `
            <div class="chore-item ${isCompleteThisWeek ? 'completed' : ''}" onclick="toggleWeeklyChore('${chore.id}')">
                <div class="chore-name">${chore.name}</div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <div class="checkbox ${isCompleteThisWeek ? 'checked' : ''}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                            <path d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    ${isEditMode ? `
                        <button class="edit-btn" onclick="event.stopPropagation(); editChore(${index})">✏️</button>
                        <button class="edit-btn delete" onclick="event.stopPropagation(); deleteChore(${index})">🗑️</button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    if (isEditMode) {
        list.innerHTML += `
            <button class="add-item-btn" onclick="addChore()">+ Add Chore</button>
        `;
    }
}

function renderCharacterSections() {
    const dayData = getDayData();
    const container = document.getElementById('character-sections');
    const characterValues = getCharacterValues();
    const isEditMode = state.editMode;
    
    container.innerHTML = characterValues.map((section, index) => {
        const mult = dayData.categoryMultipliers[section.id] || 1.0;
        return `
        <div class="character-section">
            <h3>${section.category}</h3>
            <ul class="character-list">
                ${section.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <div style="margin-bottom: 12px;">
                <label style="font-size: 12px; margin-bottom: 8px;">Performance Rating</label>
                <div class="grid grid-3" style="gap: 8px;">
                    <button 
                        class="btn btn-multiplier btn-multiplier-1 ${mult === 1.0 ? 'active' : ''}" 
                        onclick="setCategoryMultiplier('${section.id}', 1.0)"
                        style="padding: 12px 8px;">
                        <div class="value" style="font-size: 18px;">1.0x</div>
                        <div class="label" style="font-size: 10px;">Standard</div>
                    </button>
                    <button 
                        class="btn btn-multiplier btn-multiplier-15 ${mult === 1.5 ? 'active' : ''}" 
                        onclick="setCategoryMultiplier('${section.id}', 1.5)"
                        style="padding: 12px 8px;">
                        <div class="value" style="font-size: 18px;">1.5x</div>
                        <div class="label" style="font-size: 10px;">Good</div>
                    </button>
                    <button 
                        class="btn btn-multiplier btn-multiplier-2 ${mult === 2.0 ? 'active' : ''}" 
                        onclick="setCategoryMultiplier('${section.id}', 2.0)"
                        style="padding: 12px 8px;">
                        <div class="value" style="font-size: 18px;">2.0x</div>
                        <div class="label" style="font-size: 10px;">Excellent</div>
                    </button>
                </div>
            </div>
            <textarea 
                rows="2" 
                placeholder="Notes about this area..."
                onchange="updateCharacterNotes('${section.id}', this.value)"
            >${dayData.characterNotes[section.id] || ''}</textarea>
            ${isEditMode ? `
                <div class="edit-controls" style="margin-top: 8px;">
                    <button class="edit-btn" onclick="editCharacterCategory(${index})">✏️ Edit Category</button>
                    <button class="edit-btn delete" onclick="deleteCharacterCategory(${index})">🗑️ Delete</button>
                </div>
            ` : ''}
        </div>
    `}).join('');
    
    if (isEditMode) {
        container.innerHTML += `
            <button class="add-item-btn" onclick="addCharacterCategory()">+ Add Character Category</button>
        `;
    }
    
    // Apply color palette to newly rendered buttons
    const child = state.data[state.currentChild];
    const palette = COLOR_PALETTES[child.colorPalette] || COLOR_PALETTES.default;
    updateCharacterButtonColors(palette);
}

// Event handlers
function selectChild(childId) {
    state.currentChild = childId;
    updateChildButtons();
    updateTrackerButtons();
    updateUI();
    applyColorPalette();
}

function updateChildButtons() {
    // Render all child buttons
    renderChildButtons();
    
    // Apply active styling
    state.children.forEach(childId => {
        const btn = document.getElementById(childId + '-btn');
        if (btn) {
            btn.classList.toggle('btn-active', childId === state.currentChild);
        }
    });
    
    // Update photos and names in buttons
    state.children.forEach(childId => {
        const child = state.data[childId];
        if (!child) return;
        
        const photoContainer = document.getElementById(childId + '-photo-btn');
        const nameSpan = document.getElementById(childId + '-name-btn');
        
        if (nameSpan) {
            nameSpan.textContent = child.name;
        }
        
        if (photoContainer) {
            if (child.photo) {
                photoContainer.innerHTML = `<img src="${child.photo}" class="profile-photo" style="width: 40px; height: 40px;">`;
            } else {
                photoContainer.innerHTML = `<div class="profile-photo-placeholder" style="width: 40px; height: 40px; font-size: 20px;">👤</div>`;
            }
        }
    });
}

function renderChildButtons() {
    const container = document.getElementById('child-buttons-container');
    const gridClass = state.children.length <= 2 ? 'grid-2' : state.children.length === 3 ? 'grid-3' : 'grid-4';
    
    container.innerHTML = `
        <div class="grid ${gridClass}" style="margin-bottom: 16px;">
            ${state.children.map(childId => {
                const child = state.data[childId];
                return `
                    <button class="btn btn-secondary" id="${childId}-btn" onclick="selectChild('${childId}')" style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                        <div id="${childId}-photo-btn"></div>
                        <span id="${childId}-name-btn">${child.name}</span>
                    </button>
                `;
            }).join('')}
        </div>
    `;
}

function selectDate(date) {
    state.currentDate = date;
    const d = new Date(date + 'T00:00:00');
    document.getElementById('date-display').textContent = d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    updateUI();
}

function updateChildName(childId, name) {
    state.data[childId].name = name;
    document.getElementById(childId + '-btn').textContent = name;
    saveData();
}

function setScheduleStatus(scheduleId, status) {
    const dayData = getDayData();
    // If clicking the same status, toggle it off (set to undefined)
    if (dayData.schedule[scheduleId] === status) {
        delete dayData.schedule[scheduleId];
    } else {
        dayData.schedule[scheduleId] = status;
    }
    saveData();
    updateUI();
}

function toggleWeeklyChore(choreId) {
    const dayData = getDayData();
    dayData.weeklyChores[choreId] = !dayData.weeklyChores[choreId];
    saveData();
    updateUI();
}

function setCategoryMultiplier(categoryId, value) {
    const dayData = getDayData();
    dayData.categoryMultipliers[categoryId] = value;
    saveData();
    updateUI();
}

function updateNotes(notes) {
    const dayData = getDayData();
    dayData.notes = notes;
    saveData();
}

function updateCharacterNotes(categoryId, notes) {
    const dayData = getDayData();
    dayData.characterNotes[categoryId] = notes;
    saveData();
}

// Edit Mode Functions
function toggleEditMode() {
    state.editMode = !state.editMode;
    const btn = document.getElementById('edit-mode-toggle');
    const text = document.getElementById('edit-mode-text');
    const addChildBtn = document.getElementById('add-child-btn');
    
    if (state.editMode) {
        btn.classList.add('active');
        text.textContent = '✓ Done Editing';
        document.body.classList.add('edit-mode');
        if (addChildBtn) addChildBtn.style.display = 'inline-block';
    } else {
        btn.classList.remove('active');
        text.textContent = '✏️ Edit Mode';
        document.body.classList.remove('edit-mode');
        if (addChildBtn) addChildBtn.style.display = 'none';
    }
    
    updateUI();
}

// Schedule Edit Functions
function editScheduleItem(index) {
    const schedule = getSchedule(false); // Get unfiltered schedule for editing
    state.modalData = { type: 'edit', index, item: JSON.parse(JSON.stringify(schedule[index])) };
    
    document.getElementById('modal-time').value = schedule[index].time;
    document.getElementById('modal-name').value = schedule[index].name;
    
    // Set days checkboxes
    const days = schedule[index].days || [0,1,2,3,4,5,6];
    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach((dayName, idx) => {
        const dayValue = idx === 6 ? 0 : idx + 1; // Sunday is 0, Monday is 1, etc.
        const checkbox = document.getElementById(`day-${dayName}`);
        if (checkbox) {
            checkbox.checked = days.includes(dayValue);
        }
    });
    
    const tasksList = document.getElementById('modal-tasks');
    tasksList.innerHTML = schedule[index].tasks.map((task, i) => `
        <li class="task-edit-item">
            <input type="text" class="edit-input" value="${task}" data-index="${i}">
            <button class="edit-btn delete" onclick="removeModalTask(${i})">🗑️</button>
        </li>
    `).join('');
    
    document.getElementById('schedule-modal').classList.add('active');
}

function addScheduleItem() {
    const schedule = getSchedule(false); // Get unfiltered schedule
    const newId = schedule.length > 0 ? Math.max(...schedule.map(s => s.id)) + 1 : 1;
    state.modalData = { type: 'add', item: { id: newId, time: '', name: '', tasks: [], days: [0,1,2,3,4,5,6] } };
    
    document.getElementById('modal-time').value = '';
    document.getElementById('modal-name').value = '';
    document.getElementById('modal-tasks').innerHTML = '';
    
    // Check all days by default
    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(dayName => {
        const checkbox = document.getElementById(`day-${dayName}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    
    document.getElementById('schedule-modal').classList.add('active');
}

function deleteScheduleItem(index) {
    if (confirm('Delete this schedule item?')) {
        const schedule = getSchedule(false); // Get unfiltered schedule
        schedule.splice(index, 1);
        saveData();
        updateUI();
    }
}

function addModalTask() {
    const tasksList = document.getElementById('modal-tasks');
    const index = tasksList.children.length;
    const li = document.createElement('li');
    li.className = 'task-edit-item';
    li.innerHTML = `
        <input type="text" class="edit-input" placeholder="New task" data-index="${index}">
        <button class="edit-btn delete" onclick="removeModalTask(${index})">🗑️</button>
    `;
    tasksList.appendChild(li);
}

function removeModalTask(index) {
    const tasksList = document.getElementById('modal-tasks');
    const items = Array.from(tasksList.children);
    if (items[index]) {
        items[index].remove();
    }
}

function saveScheduleItem() {
    const time = document.getElementById('modal-time').value;
    const name = document.getElementById('modal-name').value;
    const taskInputs = document.querySelectorAll('#modal-tasks input');
    const tasks = Array.from(taskInputs).map(input => input.value).filter(v => v.trim());
    
    // Get selected days
    const days = [];
    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach((dayName, idx) => {
        const dayValue = idx === 6 ? 0 : idx + 1; // Sunday is 0, Monday is 1, etc.
        const checkbox = document.getElementById(`day-${dayName}`);
        if (checkbox && checkbox.checked) {
            days.push(dayValue);
        }
    });
    
    if (!time || !name) {
        alert('Please fill in time and name');
        return;
    }
    
    if (days.length === 0) {
        alert('Please select at least one day');
        return;
    }
    
    const schedule = getSchedule(false); // Get unfiltered schedule
    if (state.modalData.type === 'edit') {
        schedule[state.modalData.index].time = time;
        schedule[state.modalData.index].name = name;
        schedule[state.modalData.index].tasks = tasks;
        schedule[state.modalData.index].days = days;
    } else {
        schedule.push({
            id: state.modalData.item.id,
            time,
            name,
            tasks,
            days
        });
    }
    
    // Sort schedule by time after adding/editing
    schedule.sort((a, b) => {
        const timeA = convertTimeToMinutes(a.time);
        const timeB = convertTimeToMinutes(b.time);
        return timeA - timeB;
    });
    
    saveData();
    closeModal();
    updateUI();
}

// Chore Edit Functions
function editChore(index) {
    const chores = getWeeklyChores();
    state.modalData = { type: 'edit', index, item: JSON.parse(JSON.stringify(chores[index])) };
    
    document.getElementById('modal-chore-name').value = chores[index].name;
    document.getElementById('chore-modal').classList.add('active');
}

function addChore() {
    const chores = getWeeklyChores();
    const newId = 'chore_' + Date.now();
    state.modalData = { type: 'add', item: { id: newId, name: '' } };
    
    document.getElementById('modal-chore-name').value = '';
    document.getElementById('chore-modal').classList.add('active');
}

function deleteChore(index) {
    const chores = getWeeklyChores();
    const goalName = chores[index].name;
    
    // Store index for confirmation
    state.deleteGoalIndex = index;
    
    // Show custom confirmation modal
    document.getElementById('delete-goal-name').textContent = `Delete "${goalName}"?`;
    document.getElementById('delete-goal-confirm-modal').classList.add('active');
}

function closeDeleteGoalConfirm() {
    document.getElementById('delete-goal-confirm-modal').classList.remove('active');
    delete state.deleteGoalIndex;
}

function confirmDeleteGoal() {
    if (state.deleteGoalIndex === undefined) return;
    
    const chores = getWeeklyChores();
    chores.splice(state.deleteGoalIndex, 1);
    state.data[state.currentChild].weeklyChores = chores;
    
    saveData();
    
    // Close modal
    document.getElementById('delete-goal-confirm-modal').classList.remove('active');
    delete state.deleteGoalIndex;
    
    updateUI();
}

function saveChore() {
    const name = document.getElementById('modal-chore-name').value;
    
    if (!name) {
        alert('Please enter a chore name');
        return;
    }
    
    const chores = getWeeklyChores();
    if (state.modalData.type === 'edit') {
        chores[state.modalData.index].name = name;
    } else {
        chores.push({
            id: state.modalData.item.id,
            name
        });
    }
    
    saveData();
    closeModal();
    updateUI();
}

// Character Category Edit Functions
function editCharacterCategory(index) {
    const categories = getCharacterValues();
    state.modalData = { type: 'edit', index, item: JSON.parse(JSON.stringify(categories[index])) };
    
    document.getElementById('modal-character-category').value = categories[index].category;
    
    const itemsList = document.getElementById('modal-character-items');
    itemsList.innerHTML = categories[index].items.map((item, i) => `
        <li class="task-edit-item">
            <input type="text" class="edit-input" value="${item}" data-index="${i}">
            <button class="edit-btn delete" onclick="removeModalCharacterItem(${i})">🗑️</button>
        </li>
    `).join('');
    
    document.getElementById('character-modal').classList.add('active');
}

function addCharacterCategory() {
    const categories = getCharacterValues();
    const newId = 'category_' + Date.now();
    state.modalData = { type: 'add', item: { id: newId, category: '', weight: 0.25, items: [] } };
    
    document.getElementById('modal-character-category').value = '';
    document.getElementById('modal-character-items').innerHTML = '';
    document.getElementById('character-modal').classList.add('active');
}

function deleteCharacterCategory(index) {
    if (confirm('Delete this character category?')) {
        const categories = getCharacterValues();
        categories.splice(index, 1);
        saveData();
        updateUI();
    }
}

function addModalCharacterItem() {
    const itemsList = document.getElementById('modal-character-items');
    const index = itemsList.children.length;
    const li = document.createElement('li');
    li.className = 'task-edit-item';
    li.innerHTML = `
        <input type="text" class="edit-input" placeholder="New item" data-index="${index}">
        <button class="edit-btn delete" onclick="removeModalCharacterItem(${index})">🗑️</button>
    `;
    itemsList.appendChild(li);
}

function removeModalCharacterItem(index) {
    const itemsList = document.getElementById('modal-character-items');
    const items = Array.from(itemsList.children);
    if (items[index]) {
        items[index].remove();
    }
}

function saveCharacterCategory() {
    const category = document.getElementById('modal-character-category').value;
    const itemInputs = document.querySelectorAll('#modal-character-items input');
    const items = Array.from(itemInputs).map(input => input.value).filter(v => v.trim());
    
    if (!category) {
        alert('Please enter a category name');
        return;
    }
    
    const categories = getCharacterValues();
    if (state.modalData.type === 'edit') {
        categories[state.modalData.index].category = category;
        categories[state.modalData.index].items = items;
    } else {
        categories.push({
            id: state.modalData.item.id,
            category,
            weight: state.modalData.item.weight,
            items
        });
    }
    
    saveData();
    closeModal();
    updateUI();
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    state.modalData = null;
}

// Profile Edit Functions
function openProfileModal() {
    const child = state.data[state.currentChild];
    
    document.getElementById('modal-profile-name').value = child.name;
    
    // Render tracker list
    renderTrackerList(state.currentChild);
    
    // Show/hide delete button (can't delete if only one child)
    const deleteBtn = document.getElementById('delete-child-btn');
    if (deleteBtn) {
        deleteBtn.style.display = state.children.length > 1 ? 'block' : 'none';
    }
    
    // Reset crop interface
    document.getElementById('crop-area').style.display = 'none';
    document.getElementById('upload-area').style.display = 'block';
    document.getElementById('crop-container').classList.remove('active');
    
    // Render color palette options
    const grid = document.getElementById('color-palette-grid');
    grid.innerHTML = Object.entries(COLOR_PALETTES).map(([key, palette]) => `
        <div class="color-palette-option ${child.colorPalette === key ? 'selected' : ''}" onclick="selectColorPalette('${key}')">
            <div class="color-palette-preview">
                <div class="color-palette-dot" style="background: linear-gradient(135deg, ${palette.bgGradient1}, ${palette.bgGradient2})"></div>
                <div class="color-palette-dot" style="background: ${palette.statCard}"></div>
                <div class="color-palette-dot" style="background: ${palette.profileButton}"></div>
            </div>
            <div class="color-palette-name">${palette.name}</div>
        </div>
    `).join('');
    
    // Show current photo if exists
    const photoContainer = document.getElementById('photo-preview-container');
    if (child.photo) {
        photoContainer.innerHTML = `<img src="${child.photo}" class="photo-preview">`;
        document.getElementById('remove-photo-btn').style.display = 'inline-block';
    } else {
        photoContainer.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 8px;">📷</div>
            <div style="color: #6b7280; font-size: 14px;">Click to upload photo</div>
            <div style="color: #9ca3af; font-size: 12px; margin-top: 4px;">JPG, PNG or GIF</div>
        `;
        document.getElementById('remove-photo-btn').style.display = 'none';
    }
    
    document.getElementById('profile-modal').classList.add('active');
}

function selectColorPalette(paletteKey) {
    // Update visual selection
    document.querySelectorAll('.color-palette-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.color-palette-option').classList.add('selected');
    
    // Temporarily store selection (will be saved on "Save Profile")
    state.tempPalette = paletteKey;
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Show crop interface
            document.getElementById('upload-area').style.display = 'none';
            document.getElementById('crop-area').style.display = 'block';
            
            const img = document.getElementById('crop-image');
            img.src = e.target.result;
            state.cropData.image = e.target.result;
            
            // Wait for image to load to set initial crop
            img.onload = function() {
                const container = document.getElementById('crop-container');
                container.classList.add('active');
                
                // Set initial crop to center square
                const imgWidth = img.clientWidth;
                const imgHeight = img.clientHeight;
                const cropSize = Math.min(imgWidth, imgHeight) * 0.7;
                
                state.cropData.width = cropSize;
                state.cropData.height = cropSize;
                state.cropData.x = (imgWidth - cropSize) / 2;
                state.cropData.y = (imgHeight - cropSize) / 2;
                
                updateCropOverlay();
                initCropHandlers();
            };
        };
        reader.readAsDataURL(file);
    }
}

function updateCropOverlay() {
    const overlay = document.getElementById('crop-overlay');
    overlay.style.left = state.cropData.x + 'px';
    overlay.style.top = state.cropData.y + 'px';
    overlay.style.width = state.cropData.width + 'px';
    overlay.style.height = state.cropData.height + 'px';
}

function initCropHandlers() {
    const overlay = document.getElementById('crop-overlay');
    const handles = overlay.querySelectorAll('.crop-handle');
    
    // Drag overlay
    overlay.addEventListener('mousedown', function(e) {
        if (e.target === overlay) {
            state.cropData.isDragging = true;
            state.cropData.startX = e.clientX - state.cropData.x;
            state.cropData.startY = e.clientY - state.cropData.y;
            e.preventDefault();
        }
    });
    
    // Resize handles
    handles.forEach(handle => {
        handle.addEventListener('mousedown', function(e) {
            state.cropData.isResizing = true;
            state.cropData.resizeHandle = handle.className.split(' ')[1];
            state.cropData.startX = e.clientX;
            state.cropData.startY = e.clientY;
            state.cropData.startCropX = state.cropData.x;
            state.cropData.startCropY = state.cropData.y;
            state.cropData.startCropWidth = state.cropData.width;
            state.cropData.startCropHeight = state.cropData.height;
            e.stopPropagation();
            e.preventDefault();
        });
    });
    
    // Mouse move
    document.addEventListener('mousemove', function(e) {
        if (state.cropData.isDragging) {
            const img = document.getElementById('crop-image');
            let newX = e.clientX - state.cropData.startX;
            let newY = e.clientY - state.cropData.startY;
            
            // Constrain to image bounds
            newX = Math.max(0, Math.min(newX, img.clientWidth - state.cropData.width));
            newY = Math.max(0, Math.min(newY, img.clientHeight - state.cropData.height));
            
            state.cropData.x = newX;
            state.cropData.y = newY;
            updateCropOverlay();
        } else if (state.cropData.isResizing) {
            const img = document.getElementById('crop-image');
            const dx = e.clientX - state.cropData.startX;
            const dy = e.clientY - state.cropData.startY;
            const handle = state.cropData.resizeHandle;
            
            let newX = state.cropData.startCropX;
            let newY = state.cropData.startCropY;
            let newWidth = state.cropData.startCropWidth;
            let newHeight = state.cropData.startCropHeight;
            
            // Handle resizing based on which handle is being dragged
            if (handle.includes('n')) {
                newY = state.cropData.startCropY + dy;
                newHeight = state.cropData.startCropHeight - dy;
            }
            if (handle.includes('s')) {
                newHeight = state.cropData.startCropHeight + dy;
            }
            if (handle.includes('w')) {
                newX = state.cropData.startCropX + dx;
                newWidth = state.cropData.startCropWidth - dx;
            }
            if (handle.includes('e')) {
                newWidth = state.cropData.startCropWidth + dx;
            }
            
            // Constrain to minimum size and image bounds
            const minSize = 50;
            if (newWidth >= minSize && newX >= 0 && newX + newWidth <= img.clientWidth) {
                state.cropData.x = newX;
                state.cropData.width = newWidth;
            }
            if (newHeight >= minSize && newY >= 0 && newY + newHeight <= img.clientHeight) {
                state.cropData.y = newY;
                state.cropData.height = newHeight;
            }
            
            updateCropOverlay();
        }
    });
    
    // Mouse up
    document.addEventListener('mouseup', function() {
        state.cropData.isDragging = false;
        state.cropData.isResizing = false;
    });
}

function applyCrop() {
    const img = document.getElementById('crop-image');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Calculate scale factor between displayed size and natural size
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;
    
    // Set canvas size to crop size
    canvas.width = state.cropData.width * scaleX;
    canvas.height = state.cropData.height * scaleY;
    
    // Draw cropped portion
    ctx.drawImage(
        img,
        state.cropData.x * scaleX,
        state.cropData.y * scaleY,
        state.cropData.width * scaleX,
        state.cropData.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
    );
    
    // Convert to data URL and show preview
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    const photoContainer = document.getElementById('photo-preview-container');
    photoContainer.innerHTML = `<img src="${croppedImage}" class="photo-preview">`;
    document.getElementById('remove-photo-btn').style.display = 'inline-block';
    state.tempPhoto = croppedImage;
    
    // Hide crop interface and show preview
    document.getElementById('crop-area').style.display = 'none';
    document.getElementById('upload-area').style.display = 'block';
    document.getElementById('crop-container').classList.remove('active');
}

function cancelCrop() {
    // Reset file input
    document.getElementById('photo-upload').value = '';
    
    // Hide crop interface
    document.getElementById('crop-area').style.display = 'none';
    document.getElementById('upload-area').style.display = 'block';
    document.getElementById('crop-container').classList.remove('active');
}

function removePhoto() {
    const photoContainer = document.getElementById('photo-preview-container');
    photoContainer.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 8px;">📷</div>
        <div style="color: #6b7280; font-size: 14px;">Click to upload photo</div>
        <div style="color: #9ca3af; font-size: 12px; margin-top: 4px;">JPG, PNG or GIF</div>
    `;
    document.getElementById('remove-photo-btn').style.display = 'none';
    document.getElementById('photo-upload').value = '';
    state.tempPhoto = null;
    
    // Reset crop interface if it was showing
    document.getElementById('crop-area').style.display = 'none';
    document.getElementById('upload-area').style.display = 'block';
}


// ========================================
// TRACKER MANAGEMENT FUNCTIONS
// ========================================

// Render tracker list in profile modal
function renderTrackerList(childId) {
    const child = state.data[childId];
    const container = document.getElementById('tracker-list-container');
    
    if (!child.trackers || child.trackers.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; font-size: 14px; font-style: italic;">No trackers added yet. Click button below to add your first tracker.</p>';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 8px;">';
    child.trackers.forEach(tracker => {
        const template = TrackerTemplates.getTemplateList().find(t => t.id === tracker.templateId);
        const icon = template ? template.icon : '📊';
        
        html += `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f3f4f6; border-radius: 8px;">
                <span style="font-weight: 500;">${icon} ${tracker.templateName}</span>
                <div style="display: flex; gap: 8px;">
                    <button onclick="editTrackerConfig('${tracker.id}')" style="padding: 6px 12px; background: #6366f1; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer;">⚙️ Edit</button>
                    <button onclick="removeTrackerPrompt('${tracker.id}')" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer;">×</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// Open template selection modal
function openTemplateSelection() {
    const templates = TrackerTemplates.getTemplateList();
    const grid = document.getElementById('template-grid');
    
    let html = '';
    templates.forEach(template => {
        html += `
            <div onclick="selectTemplate('${template.id}')" style="cursor: pointer; padding: 20px; border: 2px solid #e5e7eb; border-radius: 12px; transition: all 0.2s; background: white;" onmouseover="this.style.borderColor='#6366f1'; this.style.boxShadow='0 4px 12px rgba(99, 102, 241, 0.15)'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
                <div style="font-size: 48px; margin-bottom: 12px; text-align: center;">${template.icon}</div>
                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; text-align: center; color: #111827;">${template.name}</h3>
                <p style="font-size: 13px; color: #6b7280; text-align: center; line-height: 1.4;">${template.description}</p>
            </div>
        `;
    });
    
    grid.innerHTML = html;
    document.getElementById('template-selection-modal').classList.add('active');
}

// Close template selection
function closeTemplateSelection() {
    document.getElementById('template-selection-modal').classList.remove('active');
}

// Select a template and add tracker
function selectTemplate(templateId) {
    addTracker(state.currentChild, templateId);
    closeTemplateSelection();
}

// Add a tracker
function addTracker(childId, templateId) {
    const child = state.data[childId];
    const template = TrackerTemplates.getTemplate(templateId);
    
    if (!child.trackers) {
        child.trackers = [];
    }
    
    const tracker = {
        id: `tracker_${templateId}_${Date.now()}`,
        templateId: templateId,
        templateName: template.name,
        enabled: true,
        customConfig: template, // Full template config (editable)
        createdAt: Date.now()
    };
    
    child.trackers.push(tracker);
    saveData();
    renderTrackerList(childId);
    updateTrackerButtons();
    
    console.log('✅ Added tracker:', tracker.templateName);
}

// Remove tracker with confirmation
function removeTrackerPrompt(trackerId) {
    const child = state.data[state.currentChild];
    const tracker = child.trackers.find(t => t.id === trackerId);
    
    if (!tracker) return;
    
    if (confirm(`Remove "${tracker.templateName}" tracker?\n\nAll data for this tracker will be permanently deleted. This cannot be undone.`)) {
        removeTracker(state.currentChild, trackerId);
    }
}

// Remove a tracker
async function removeTracker(childId, trackerId) {
    const child = state.data[childId];
    const index = child.trackers.findIndex(t => t.id === trackerId);
    
    if (index > -1) {
        child.trackers.splice(index, 1);
        saveData();
        renderTrackerList(childId);
        updateTrackerButtons();
        
        // Delete from Firestore if user is signed in
        if (currentUser) {
            try {
                const userRef = db.collection('users').doc(currentUser.uid);
                const trackerRef = userRef
                    .collection('familyMembers').doc(childId)
                    .collection('trackerData').doc(trackerId);
                
                await trackerRef.delete();
                console.log('✅ Deleted tracker data from Firestore');
            } catch (error) {
                console.error('Error deleting tracker data:', error);
            }
        }
    }
}

// Edit tracker configuration (opens settings tab in tracker modal)
function editTrackerConfig(trackerId) {
    closeModal(); // Close profile modal
    openSpecificTracker(trackerId);
    // TODO: Switch to settings tab once implemented
}

// Update tracker buttons on dashboard
function updateTrackerButtons() {
    const child = state.data[state.currentChild];
    const container = document.getElementById('tracker-buttons-container');
    
    if (!container) return;
    
    if (!child.trackers || child.trackers.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">';
    html += '<label style="font-weight: 600; font-size: 14px; color: #374151;">Health Trackers:</label>';
    
    child.trackers.forEach(tracker => {
        const template = TrackerTemplates.getTemplateList().find(t => t.id === tracker.templateId);
        const icon = template ? template.icon : '📊';
        
        html += `
            <button onclick="openSpecificTracker('${tracker.id}')" 
                    style="padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; text-align: left; transition: transform 0.2s;"
                    onmouseover="this.style.transform='translateY(-2px)'"
                    onmouseout="this.style.transform='translateY(0)'">
                ${icon} ${tracker.templateName}
            </button>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Open specific tracker by ID
function openSpecificTracker(trackerId) {
    const child = state.data[state.currentChild];
    const tracker = child.trackers.find(t => t.id === trackerId);
    
    if (!tracker) {
        alert('Tracker not found');
        return;
    }
    
    // Store current tracker ID globally
    window.currentTrackerId = trackerId;
    
    // Open modal
    document.getElementById('med-tracker-modal').classList.add('active');
    
    // Initialize with specific tracker
    initMedicationTrackerWithConfig(trackerId, tracker);
}

// Initialize tracker with specific config
function initMedicationTrackerWithConfig(trackerId, tracker) {
    const child = state.data[state.currentChild];
    
    console.log('🔷 Init tracker:', tracker.templateName, 'for:', child.name);
    
    setTimeout(() => {
        // Set modal title
        const titleEl = document.getElementById('med-tracker-member-name');
        if (titleEl) {
            titleEl.textContent = `${child.name} - ${tracker.templateName}`;
        }
        
        // Initialize MedicationTracker with custom config
        MedicationTracker.init(state.currentChild, trackerId, tracker.customConfig);
        
        // Render period type options from template
        renderPeriodTypes(tracker.customConfig.periodTypes);
        
        // Set date
        const dateEl = document.getElementById('med-entry-date');
        if (dateEl) {
            dateEl.value = new Date().toISOString().split('T')[0];
            console.log('✅ Date set');
        } else {
            console.error('❌ Date input not found!');
        }
        
        // Check container
        const container = document.getElementById('med-rating-categories');
        console.log('Container exists:', !!container);
        
        // Render the entry form
        console.log('🔷 Rendering entry form...');
        MedicationTracker.renderEntryForm();
        console.log('✅ Render complete');
    }, 150);
}

// Render period type radio buttons
function renderPeriodTypes(periodTypes) {
    const container = document.getElementById('med-period-types-container');
    if (!container || !periodTypes) return;
    
    let html = '';
    periodTypes.forEach((period, index) => {
        const isFirst = index === 0;
        html += `
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="radio" name="med-period" value="${period.value}" ${isFirst ? 'checked' : ''} style="width: 18px; height: 18px;">
                <span style="font-weight: 500;">${period.label}</span>
            </label>
        `;
    });
    
    container.innerHTML = html;
}

function saveProfile() {
    const name = document.getElementById('modal-profile-name').value;
    
    if (!name) {
        alert('Please enter a name');
        return;
    }
    
    const child = state.data[state.currentChild];
    child.name = name;
    
    // Trackers are managed separately via addTracker/removeTracker functions
    // No need to save tracker state here
    
    if (state.tempPhoto !== undefined) {
        child.photo = state.tempPhoto;
    }
    
    if (state.tempPalette) {
        child.colorPalette = state.tempPalette;
    }
    
    // Clean up temp values
    delete state.tempPhoto;
    delete state.tempPalette;
    
    saveData();
    closeModal();
    updateChildButtons();
    updateTrackerButtons();
    applyColorPalette();
}

// Add New Child
function addNewChild() {
    const childNum = Object.keys(state.data).length + 1;
    const childId = 'child' + childNum;
    
    // Create new member data
    state.data[childId] = {
        name: 'Family Member ' + childNum,
        photo: null,
        colorPalette: 'lavender',
        pointsBalance: 0,
        pointsSpent: 0,
        trackers: [],
        days: {},
        schedule: JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)),
        characterValues: JSON.parse(JSON.stringify(DEFAULT_CHARACTER_VALUES)),
        weeklyChores: JSON.parse(JSON.stringify(DEFAULT_WEEKLY_CHORES))
    };
    
    // Add to children list
    state.children.push(childId);
    
    // Switch to new member
    state.currentChild = childId;
    
    saveData();
    renderChildButtons();
    updateChildButtons();
    updateUI();
    applyColorPalette();
    
    // Open profile modal to edit the new member
    openProfileModal();
}

// Delete Child
function deleteCurrentChild() {
    if (state.children.length <= 1) {
        alert('Cannot delete the only family member! You must have at least one profile.');
        return;
    }
    
    const child = state.data[state.currentChild];
    
    // Show custom confirmation modal
    document.getElementById('delete-child-name').textContent = `Delete "${child.name}"?`;
    document.getElementById('delete-confirm-modal').classList.add('active');
}

function closeDeleteConfirm() {
    document.getElementById('delete-confirm-modal').classList.remove('active');
}

function confirmDeleteChild() {
    // Remove from children array
    state.children = state.children.filter(id => id !== state.currentChild);
    
    // Delete data
    delete state.data[state.currentChild];
    
    // Switch to first available child
    state.currentChild = state.children[0];
    
    saveData();
    
    // Close both modals
    document.getElementById('delete-confirm-modal').classList.remove('active');
    closeModal();
    
    renderChildButtons();
    updateChildButtons();
    updateUI();
    applyColorPalette();
}

// Spend Points Functions
function openSpendPointsModal() {
    const child = state.data[state.currentChild];
    document.getElementById('spend-modal-balance').textContent = child.pointsBalance;
    document.getElementById('modal-spend-amount').value = '';
    document.getElementById('modal-spend-reason').value = '';
    document.getElementById('spend-points-modal').classList.add('active');
}

function spendPoints() {
    const amount = parseInt(document.getElementById('modal-spend-amount').value);
    const reason = document.getElementById('modal-spend-reason').value;
    const child = state.data[state.currentChild];
    
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (amount > child.pointsBalance) {
        alert('Not enough points! Current balance: ' + child.pointsBalance);
        return;
    }
    
    // Track spent points separately
    if (child.pointsSpent === undefined) {
        child.pointsSpent = 0;
    }
    child.pointsSpent += amount;
    
    saveData();
    closeModal();
    updateUI();
    
    const reasonText = reason ? ` for ${reason}` : '';
    const newBalance = child.pointsBalance;
    alert(`✅ Spent ${amount} points${reasonText}!\nNew balance: ${newBalance}`);
}

// ========================================
// MEDICATION & THERAPY TRACKER
// ========================================

// Old single-tracker functions removed - now using multi-tracker system
// updateMedTrackerButton() replaced with updateTrackerButtons()
// openMedicationTracker() replaced with openSpecificTracker(trackerId)

// Old initMedicationTracker removed - now using initMedicationTrackerWithConfig()

// Close medication tracker
function closeMedicationTracker() {
    document.getElementById('med-tracker-modal').classList.remove('active');
}

// ========================================
// TRACKER TEMPLATES - ALL 14 HEALTH TRACKING TEMPLATES
// ========================================

const TrackerTemplates = {
    // Get list of all available templates
    getTemplateList: function() {
        return [
            { id: 'adhd', name: 'ADHD Medication', icon: '🧠', description: 'Track attention, hyperactivity, and impulse control' },
            { id: 'physical_therapy', name: 'Physical Therapy', icon: '🦴', description: 'Track pain levels, mobility, and function' },
            { id: 'substance_use', name: 'Substance Use Disorder', icon: '🎗️', description: 'Track cravings, triggers, and recovery progress' },
            { id: 'speech_therapy', name: 'Speech Therapy', icon: '💬', description: 'Track articulation, fluency, and communication' },
            { id: 'type2_diabetes', name: 'Type 2 Diabetes', icon: '🩸', description: 'Track blood sugar, diet, and symptoms' },
            { id: 'type1_diabetes', name: 'Type 1 Diabetes', icon: '💉', description: 'Track blood sugar, insulin, and patterns' },
            { id: 'anxiety', name: 'Anxiety', icon: '😰', description: 'Track anxiety symptoms and coping strategies' },
            { id: 'depression', name: 'Depression', icon: '💙', description: 'Track mood, energy, and daily functioning' },
            { id: 'blood_pressure', name: 'High Blood Pressure', icon: '❤️', description: 'Track BP readings and lifestyle factors' },
            { id: 'weight_loss', name: 'Weight Loss', icon: '⚖️', description: 'Track weight, diet, and exercise habits' },
            { id: 'social_media', name: 'Social Media Use', icon: '📱', description: 'Track screen time and digital wellness' },
            { id: 'caffeine', name: 'Coffee/Caffeine', icon: '☕', description: 'Track intake and effects on sleep/mood' },
            { id: 'occupational_therapy', name: 'Occupational Therapy', icon: '🖐️', description: 'Track daily living skills and independence' },
            { id: 'blank', name: 'Custom Tracker', icon: '📝', description: 'Create your own tracking categories' }
        ];
    },

    // Get template by ID
    getTemplate: function(templateId) {
        const template = this.templates[templateId];
        if (!template) return this.templates.blank;
        // Return deep copy
        return JSON.parse(JSON.stringify(template));
    },

    // All template definitions
    templates: {
        // ADHD Template
        adhd: {
            name: 'ADHD Medication Tracker',
            observerSectionTitle: 'Observer Ratings',
            selfReportSectionTitle: 'Self-Report',
            periodTypes: [
                { value: 'baseline', label: '📊 Baseline' },
                { value: 'treatment', label: '💊 Treatment' },
                { value: 'maintenance', label: '✅ Maintenance' }
            ],
            observedCategories: [
                {
                    name: 'Inattentive Symptoms',
                    items: [
                        { id: 'attention_span', label: 'Stays focused on tasks', description: 'Can complete homework/activities without constant redirection' },
                        { id: 'morning_routine', label: 'Completes morning routine', description: 'Gets up, gets ready without excessive prompting' },
                        { id: 'motivation', label: 'Shows motivation', description: 'Engages with tasks without being bored' }
                    ]
                },
                {
                    name: 'Hyperactive Symptoms',
                    items: [
                        { id: 'calm_energy', label: 'Maintains calm energy', description: 'Not constantly "on the go"' },
                        { id: 'excessive_activity', label: 'Controls activity levels', description: 'Regulates verbal and physical activity' },
                        { id: 'sleep', label: 'Falls asleep easily', description: 'Settles down at bedtime' }
                    ]
                },
                {
                    name: 'Impulsive Symptoms',
                    items: [
                        { id: 'thinks_first', label: 'Pauses before acting', description: 'Takes time to think rather than reacting' },
                        { id: 'emotional_regulation', label: 'Regulates emotions', description: 'Manages disappointment proportionally' },
                        { id: 'interrupting', label: 'Controls interrupting', description: 'Lets others finish speaking' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Self-Assessment',
                    items: [
                        { id: 'self_focus', label: 'I can focus when I try', description: 'My brain cooperates when I want to pay attention' },
                        { id: 'self_impulses', label: 'I can stop myself', description: 'I notice and can choose to stop' },
                        { id: 'self_calm', label: 'I feel calm inside', description: 'My body and mind feel peaceful' },
                        { id: 'self_mood', label: 'I manage my feelings', description: 'I handle emotions more easily' },
                        { id: 'self_friends', label: 'Getting along is easier', description: 'Fewer conflicts with friends and family' }
                    ]
                }
            ]
        },

        // Physical Therapy Template
        physical_therapy: {
            name: 'Physical Therapy Progress',
            observerSectionTitle: 'Therapist/Observer Assessment',
            selfReportSectionTitle: 'Patient Self-Report',
            periodTypes: [
                { value: 'baseline', label: 'Initial Assessment' },
                { value: 'treatment', label: 'Active Treatment' },
                { value: 'maintenance', label: 'Maintenance' }
            ],
            observedCategories: [
                {
                    name: 'Pain Management',
                    items: [
                        { id: 'pain_at_rest', label: 'Pain level at rest', description: 'Pain when not moving or active' },
                        { id: 'pain_with_activity', label: 'Pain during activity', description: 'Pain during exercises or daily activities' },
                        { id: 'pain_medication', label: 'Medication needs', description: 'Reduced need for pain medication' }
                    ]
                },
                {
                    name: 'Mobility & Function',
                    items: [
                        { id: 'range_of_motion', label: 'Range of motion', description: 'Ability to move joints through full range' },
                        { id: 'strength', label: 'Muscle strength', description: 'Strength in affected areas' },
                        { id: 'balance', label: 'Balance and stability', description: 'Steady on feet, reduced fall risk' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Personal Assessment',
                    items: [
                        { id: 'self_pain', label: 'My pain is manageable', description: 'Pain does not interfere with daily life' },
                        { id: 'self_confidence', label: 'I feel confident moving', description: 'Confident in my physical abilities' },
                        { id: 'self_independence', label: 'I can do things myself', description: 'Less dependent on others' }
                    ]
                }
            ]
        },

        // Anxiety Template (GAD-7 inspired)
        anxiety: {
            name: 'Anxiety Management',
            observerSectionTitle: 'Observer Assessment',
            selfReportSectionTitle: 'Anxiety Self-Assessment',
            periodTypes: [
                { value: 'baseline', label: 'Baseline' },
                { value: 'treatment', label: 'Active Treatment' },
                { value: 'maintenance', label: 'Maintenance' }
            ],
            observedCategories: [
                {
                    name: 'Observable Behaviors',
                    items: [
                        { id: 'restlessness', label: 'Appears calm vs. restless', description: 'Sits still, not constantly fidgeting' },
                        { id: 'avoidance', label: 'Engages vs. avoids', description: 'Participates in activities' },
                        { id: 'sleep_quality', label: 'Sleeping well', description: 'Falling and staying asleep' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Anxiety Symptoms',
                    items: [
                        { id: 'feeling_nervous', label: 'Not feeling nervous/on edge', description: 'Calm, not anxious or keyed up' },
                        { id: 'stop_worrying', label: 'Can stop worrying', description: 'Can control my worrying' },
                        { id: 'worry_too_much', label: 'Not worrying excessively', description: 'Worry does not dominate thoughts' },
                        { id: 'trouble_relaxing', label: 'Can relax', description: 'Can unwind and calm down' },
                        { id: 'irritable', label: 'Not easily irritated', description: 'Mood is even' }
                    ]
                }
            ]
        },

        // Depression Template (PHQ-9 inspired)
        depression: {
            name: 'Depression Management',
            observerSectionTitle: 'Observer Assessment',
            selfReportSectionTitle: 'Mood Self-Assessment',
            periodTypes: [
                { value: 'baseline', label: 'Baseline' },
                { value: 'treatment', label: 'Active Treatment' },
                { value: 'recovery', label: 'Recovery' }
            ],
            observedCategories: [
                {
                    name: 'Observable Functioning',
                    items: [
                        { id: 'engagement', label: 'Engaged in activities', description: 'Participating in daily life' },
                        { id: 'appearance', label: 'Self-care maintained', description: 'Grooming, hygiene appropriate' },
                        { id: 'social', label: 'Socially interactive', description: 'Spending time with others' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Mood Symptoms',
                    items: [
                        { id: 'interest', label: 'Interest in activities', description: 'Enjoying things I usually enjoy' },
                        { id: 'feeling_down', label: 'Not feeling down/hopeless', description: 'Mood is positive or neutral' },
                        { id: 'sleep', label: 'Sleeping well', description: 'Not too much or too little' },
                        { id: 'energy', label: 'Having energy', description: 'Not feeling tired or fatigued' },
                        { id: 'concentration', label: 'Can concentrate', description: 'Able to focus on tasks' }
                    ]
                }
            ]
        },

        // Type 2 Diabetes Template
        type2_diabetes: {
            name: 'Type 2 Diabetes Management',
            observerSectionTitle: 'Healthcare Provider Assessment',
            selfReportSectionTitle: 'Self-Monitoring',
            periodTypes: [
                { value: 'baseline', label: 'Uncontrolled' },
                { value: 'treatment', label: 'Active Management' },
                { value: 'controlled', label: 'Well-Controlled' }
            ],
            observedCategories: [
                {
                    name: 'Blood Sugar Control',
                    items: [
                        { id: 'fasting_glucose', label: 'Fasting glucose in range', description: '80-130 mg/dL' },
                        { id: 'post_meal_glucose', label: 'Post-meal glucose', description: '<180 mg/dL after meals' },
                        { id: 'a1c_trend', label: 'A1C trending down', description: 'Moving toward target' }
                    ]
                },
                {
                    name: 'Lifestyle Management',
                    items: [
                        { id: 'diet_adherence', label: 'Following meal plan', description: 'Eating diabetes-friendly meals' },
                        { id: 'exercise', label: 'Physical activity', description: 'Regular exercise most days' },
                        { id: 'medication_adherence', label: 'Taking medications', description: 'Consistent with prescriptions' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Daily Management',
                    items: [
                        { id: 'self_monitoring', label: 'I check my blood sugar', description: 'Monitoring as recommended' },
                        { id: 'self_diet', label: 'I make healthy food choices', description: 'Following dietary guidelines' },
                        { id: 'self_active', label: 'I stay physically active', description: 'Exercising regularly' }
                    ]
                }
            ]
        },

        // Weight Loss Template
        weight_loss: {
            name: 'Weight Loss Progress',
            observerSectionTitle: 'Support Assessment',
            selfReportSectionTitle: 'Personal Progress',
            periodTypes: [
                { value: 'baseline', label: 'Starting Point' },
                { value: 'active', label: 'Active Loss' },
                { value: 'maintenance', label: 'Maintenance' }
            ],
            observedCategories: [
                {
                    name: 'Behaviors & Habits',
                    items: [
                        { id: 'portion_control', label: 'Appropriate portions', description: 'Reasonable serving sizes' },
                        { id: 'food_choices', label: 'Healthy food choices', description: 'Choosing nutritious foods' },
                        { id: 'activity_level', label: 'Physically active', description: 'Regular exercise and movement' }
                    ]
                },
                {
                    name: 'Progress Markers',
                    items: [
                        { id: 'weight_trend', label: 'Weight trending down', description: '1-2 lbs/week pace' },
                        { id: 'energy', label: 'Increased energy', description: 'More energy throughout day' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Daily Habits',
                    items: [
                        { id: 'self_tracking', label: 'I track my food', description: 'Logging meals and snacks' },
                        { id: 'self_exercise', label: 'I exercise regularly', description: 'Meeting activity goals' },
                        { id: 'self_water', label: 'I drink enough water', description: 'Staying hydrated' }
                    ]
                }
            ]
        },

        
        // Speech Therapy Template
        speech_therapy: {
            name: 'Speech Therapy Progress',
            observerSectionTitle: 'Therapist/Parent Assessment',
            selfReportSectionTitle: 'Self-Assessment',
            periodTypes: [
                { value: 'baseline', label: '📊 Initial Assessment' },
                { value: 'treatment', label: '💬 Active Therapy' },
                { value: 'maintenance', label: '✅ Maintenance' }
            ],
            observedCategories: [
                {
                    name: 'Articulation & Clarity',
                    items: [
                        { id: 'sound_production', label: 'Clear sound production', description: 'Produces target sounds correctly' },
                        { id: 'intelligibility', label: 'Speech intelligibility', description: 'Others can understand what is said' },
                        { id: 'consistency', label: 'Consistent articulation', description: 'Uses correct sounds across contexts' }
                    ]
                },
                {
                    name: 'Language & Communication',
                    items: [
                        { id: 'vocabulary', label: 'Vocabulary use', description: 'Uses age-appropriate words' },
                        { id: 'sentence_structure', label: 'Sentence formation', description: 'Puts words together grammatically' },
                        { id: 'comprehension', label: 'Understanding others', description: 'Comprehends spoken language' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Communication Confidence',
                    items: [
                        { id: 'self_understood', label: 'People understand me', description: 'Others know what I am trying to say' },
                        { id: 'self_confident', label: 'I feel confident speaking', description: 'Not worried about how I sound' },
                        { id: 'self_practice', label: 'I practice my exercises', description: 'Working on speech goals at home' }
                    ]
                }
            ]
        },

        // Type 1 Diabetes Template  
        type1_diabetes: {
            name: 'Type 1 Diabetes Management',
            observerSectionTitle: 'Healthcare Provider/Parent',
            selfReportSectionTitle: 'Self-Management',
            periodTypes: [
                { value: 'baseline', label: '📊 New Diagnosis' },
                { value: 'treatment', label: '💉 Active Management' },
                { value: 'controlled', label: '✅ Optimized' }
            ],
            observedCategories: [
                {
                    name: 'Glucose Management',
                    items: [
                        { id: 'time_in_range', label: 'Time in range (70-180)', description: 'Blood sugar in target most of time' },
                        { id: 'hypo_frequency', label: 'Avoiding low blood sugar', description: 'Infrequent hypoglycemic episodes' },
                        { id: 'hyper_frequency', label: 'Avoiding high blood sugar', description: 'Infrequent hyperglycemic episodes' }
                    ]
                },
                {
                    name: 'Treatment Adherence',
                    items: [
                        { id: 'dosing_accuracy', label: 'Accurate insulin dosing', description: 'Correct calculations for meals' },
                        { id: 'carb_counting', label: 'Carb counting skills', description: 'Accurately estimating carbs' },
                        { id: 'tech_use', label: 'Using technology', description: 'Proper use of pump/CGM' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Daily Management',
                    items: [
                        { id: 'self_checking', label: 'I check blood sugar regularly', description: 'Testing as recommended' },
                        { id: 'self_dosing', label: 'I dose insulin correctly', description: 'Confident in calculations' },
                        { id: 'self_recognizing', label: 'I recognize highs/lows', description: 'Know symptoms and treat' },
                        { id: 'self_coping', label: 'I cope well', description: 'Managing emotional burden' }
                    ]
                }
            ]
        },

        // Blood Pressure Template
        blood_pressure: {
            name: 'Blood Pressure Management',
            observerSectionTitle: 'Healthcare Provider',
            selfReportSectionTitle: 'Daily Monitoring',
            periodTypes: [
                { value: 'baseline', label: '📊 Uncontrolled' },
                { value: 'treatment', label: '❤️ Active Management' },
                { value: 'controlled', label: '✅ Controlled' }
            ],
            observedCategories: [
                {
                    name: 'BP Readings',
                    items: [
                        { id: 'systolic', label: 'Systolic in range', description: 'Top number < 130 mmHg' },
                        { id: 'diastolic', label: 'Diastolic in range', description: 'Bottom number < 80 mmHg' },
                        { id: 'consistency', label: 'Consistent readings', description: 'BP stable, not variable' }
                    ]
                },
                {
                    name: 'Lifestyle',
                    items: [
                        { id: 'diet', label: 'Low sodium diet', description: 'Following DASH or similar' },
                        { id: 'exercise', label: 'Regular exercise', description: 'Active 30+ min most days' },
                        { id: 'medication', label: 'Taking medications', description: 'Consistent with meds' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Self-Management',
                    items: [
                        { id: 'self_monitoring', label: 'I check BP regularly', description: 'Home monitoring' },
                        { id: 'self_diet', label: 'I follow dietary guidelines', description: 'Low-sodium eating' },
                        { id: 'self_active', label: 'I exercise regularly', description: 'Getting activity' },
                        { id: 'self_meds', label: 'I take medications', description: 'Not missing doses' }
                    ]
                }
            ]
        },

        // Social Media Template
        social_media: {
            name: 'Social Media & Screen Time',
            observerSectionTitle: 'Observer Assessment',
            selfReportSectionTitle: 'Self-Assessment',
            periodTypes: [
                { value: 'baseline', label: '📊 Current Usage' },
                { value: 'reduction', label: '📱 Reducing' },
                { value: 'balanced', label: '✅ Balanced' }
            ],
            observedCategories: [
                {
                    name: 'Usage Patterns',
                    items: [
                        { id: 'frequency', label: 'Limited checking', description: 'Not constantly on phone' },
                        { id: 'mealtime', label: 'Present during meals', description: 'Not on phone at meals' },
                        { id: 'engagement', label: 'Engages in-person', description: 'Interacting with people' }
                    ]
                },
                {
                    name: 'Life Balance',
                    items: [
                        { id: 'activities', label: 'Other activities', description: 'Hobbies, sports, reading' },
                        { id: 'productivity', label: 'Completing tasks', description: 'School/work not suffering' },
                        { id: 'relationships', label: 'Quality time', description: 'Time with others' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Digital Wellness',
                    items: [
                        { id: 'self_time', label: 'I limit screen time', description: 'Within my goals' },
                        { id: 'self_mindless', label: 'I avoid mindless scrolling', description: 'Intentional use' },
                        { id: 'self_fomo', label: 'No FOMO', description: 'Not anxious offline' },
                        { id: 'self_mood', label: 'Positive mood', description: 'Not feeling bad' },
                        { id: 'self_control', label: 'I have control', description: 'Can put phone down' }
                    ]
                }
            ]
        },

        // Caffeine Template
        caffeine: {
            name: 'Caffeine Intake Tracker',
            observerSectionTitle: 'Observer Assessment',
            selfReportSectionTitle: 'Self-Monitoring',
            periodTypes: [
                { value: 'baseline', label: '📊 Current Intake' },
                { value: 'reduction', label: '☕ Reducing' },
                { value: 'maintenance', label: '✅ Optimal' }
            ],
            observedCategories: [
                {
                    name: 'Consumption',
                    items: [
                        { id: 'amount', label: 'Moderate amount', description: 'Not excessive' },
                        { id: 'timing', label: 'Appropriate timing', description: 'Not late in day' },
                        { id: 'sleep', label: 'Sleeping well', description: 'Good sleep quality' }
                    ]
                },
                {
                    name: 'Effects',
                    items: [
                        { id: 'mood', label: 'Stable mood', description: 'No crashes' },
                        { id: 'anxiety', label: 'Not jittery', description: 'Calm and steady' },
                        { id: 'energy', label: 'Natural energy', description: 'Not reliant' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Awareness',
                    items: [
                        { id: 'self_tracking', label: 'I track intake', description: 'Know how much' },
                        { id: 'self_amount', label: 'I limit consumption', description: 'Within healthy limits' },
                        { id: 'self_sleep', label: 'Sleep is good', description: 'Not interfering' },
                        { id: 'self_anxiety', label: 'Not anxious', description: 'Not jittery' }
                    ]
                }
            ]
        },

        // Occupational Therapy Template
        occupational_therapy: {
            name: 'Occupational Therapy Progress',
            observerSectionTitle: 'Therapist/Caregiver',
            selfReportSectionTitle: 'Self-Assessment',
            periodTypes: [
                { value: 'baseline', label: '📊 Initial' },
                { value: 'treatment', label: '🖐️ Active Therapy' },
                { value: 'maintenance', label: '✅ Independence' }
            ],
            observedCategories: [
                {
                    name: 'Daily Living',
                    items: [
                        { id: 'dressing', label: 'Dressing', description: 'Minimal assistance' },
                        { id: 'grooming', label: 'Grooming', description: 'Personal care' },
                        { id: 'eating', label: 'Self-feeding', description: 'Uses utensils' }
                    ]
                },
                {
                    name: 'Fine Motor',
                    items: [
                        { id: 'handwriting', label: 'Writing', description: 'Legible writing' },
                        { id: 'manipulation', label: 'Object use', description: 'Buttons, zips, ties' },
                        { id: 'coordination', label: 'Coordination', description: 'Catches, throws' }
                    ]
                },
                {
                    name: 'Sensory',
                    items: [
                        { id: 'sensory', label: 'Sensory processing', description: 'Appropriate responses' },
                        { id: 'attention', label: 'Attention', description: 'Sustained focus' },
                        { id: 'transitions', label: 'Transitions', description: 'Smooth changes' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Independence',
                    items: [
                        { id: 'self_independent', label: 'I do things myself', description: 'Less reliance on others' },
                        { id: 'self_confident', label: 'I feel confident', description: 'Believe in abilities' },
                        { id: 'self_participate', label: 'I participate', description: 'Engage in activities' }
                    ]
                }
            ]
        },

        // Substance Use Template
        substance_use: {
            name: 'Substance Use Recovery',
            observerSectionTitle: 'Counselor/Support Person',
            selfReportSectionTitle: 'Self-Assessment',
            periodTypes: [
                { value: 'baseline', label: '📊 Beginning' },
                { value: 'active', label: '🎗️ Active Treatment' },
                { value: 'maintenance', label: '✅ Long-term' }
            ],
            observedCategories: [
                {
                    name: 'Recovery Behaviors',
                    items: [
                        { id: 'attendance', label: 'Program attendance', description: 'Attends meetings/therapy' },
                        { id: 'engagement', label: 'Engagement', description: 'Active participation' },
                        { id: 'honesty', label: 'Honest communication', description: 'Open about struggles' },
                        { id: 'relationships', label: 'Healthy relationships', description: 'Supportive connections' }
                    ]
                },
                {
                    name: 'Stability',
                    items: [
                        { id: 'stress', label: 'Manages stress', description: 'Healthy coping' },
                        { id: 'mood', label: 'Emotional stability', description: 'Stable mood' },
                        { id: 'structure', label: 'Daily structure', description: 'Routine activities' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Personal Recovery',
                    items: [
                        { id: 'cravings', label: 'Cravings manageable', description: 'Can manage cravings' },
                        { id: 'triggers', label: 'Know triggers', description: 'Recognize risk situations' },
                        { id: 'support', label: 'Use support', description: 'Reach out when needed' },
                        { id: 'confidence', label: 'Believe in recovery', description: 'Confident staying sober' }
                    ]
                }
            ]
        },
        
        // Blank Custom Template
        blank: {
            name: 'Custom Tracker',
            observerSectionTitle: 'Observer Assessment',
            selfReportSectionTitle: 'Self-Assessment',
            periodTypes: [
                { value: 'baseline', label: 'Baseline' },
                { value: 'treatment', label: 'Treatment' },
                { value: 'maintenance', label: 'Maintenance' }
            ],
            observedCategories: [
                {
                    name: 'Category 1',
                    items: [
                        { id: 'item1', label: 'Question 1', description: 'Description of what to observe' },
                        { id: 'item2', label: 'Question 2', description: 'Description of what to observe' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Self-Report',
                    items: [
                        { id: 'self1', label: 'Self-report question 1', description: 'How you feel about this' },
                        { id: 'self2', label: 'Self-report question 2', description: 'How you feel about this' }
                    ]
                }
            ]
        }
    }
};

// ========================================
// MEDICATION TRACKER MODULE - FULL IMPLEMENTATION
// ========================================

const MedicationTracker = {
    // Current state
    currentMemberId: null,
    currentMemberName: null,
    currentTrackerId: null,
    currentConfig: null, // Will hold the active tracker's config
    entries: [],
    currentEntry: null,
    
    // Default configuration (fallback - not normally used with multi-tracker system)
    config: {
        observedCategories: [
            {
                name: 'Inattentive Symptoms',
                items: [
                    { id: 'attention_span', label: 'Stays focused on tasks', description: 'Can complete homework/activities without constant redirection' },
                    { id: 'morning_routine', label: 'Completes morning routine', description: 'Gets up, gets ready without excessive prompting' },
                    { id: 'motivation', label: 'Shows motivation', description: 'Engages with tasks without being bored or unmotivated' }
                ]
            },
            {
                name: 'Hyperactive Symptoms',
                items: [
                    { id: 'calm_energy', label: 'Maintains calm energy', description: 'Not constantly "on the go"' },
                    { id: 'excessive_activity', label: 'Controls activity levels', description: 'Can regulate verbal and physical activity' },
                    { id: 'sleep', label: 'Falls asleep easily', description: 'Can settle down at bedtime' }
                ]
            },
            {
                name: 'Impulsive Symptoms',
                items: [
                    { id: 'thinks_first', label: 'Pauses before acting', description: 'Takes time to think rather than reacting' },
                    { id: 'emotional_regulation', label: 'Regulates emotions', description: 'Manages disappointment proportionally' },
                    { id: 'interrupting', label: 'Controls interrupting', description: 'Lets others finish speaking' }
                ]
            }
        ],
        selfReportCategories: [
            {
                name: 'Child Self-Report',
                items: [
                    { id: 'self_focus', label: 'I can focus when I try', description: 'My brain cooperates when I want to pay attention' },
                    { id: 'self_impulses', label: 'I can stop myself', description: 'I notice and can choose to stop' },
                    { id: 'self_calm', label: 'I feel calm inside', description: 'My body and mind feel peaceful' },
                    { id: 'self_mood', label: 'I manage my feelings', description: 'I handle emotions more easily' },
                    { id: 'self_friends', label: 'Getting along is easier', description: 'Fewer conflicts with friends and family' }
                ]
            }
        ],
        ratingScale: [
            { value: 1, label: '1 - Very Difficult', color: '#ef4444' },
            { value: 2, label: '2 - Difficult', color: '#f97316' },
            { value: 3, label: '3 - Neutral', color: '#fbbf24' },
            { value: 4, label: '4 - Good', color: '#84cc16' },
            { value: 5, label: '5 - Very Good', color: '#22c55e' }
        ]
    },
    
    // Initialize the tracker with custom config
    init: function(memberId, trackerId, customConfig) {
        this.currentMemberId = memberId;
        this.currentTrackerId = trackerId;
        this.currentConfig = customConfig || this.config; // Use custom config or fall back to default
        this.currentMemberName = state.data[memberId].name;
        this.resetCurrentEntry();
        this.loadEntries();
    },
    
    // Reset current entry
    resetCurrentEntry: function() {
        this.currentEntry = {
            date: new Date().toISOString().split('T')[0],
            observer: '',
            periodType: 'baseline',
            observedRatings: {},
            selfReportedRatings: {},
            notes: ''
        };
    },
    
    // Render the entry form
    renderEntryForm: function() {
        console.log('🔷 renderEntryForm called');
        console.log('🔷 currentConfig:', this.currentConfig);
        console.log('🔷 currentMemberId:', this.currentMemberId);
        console.log('🔷 currentTrackerId:', this.currentTrackerId);
        
        const container = document.getElementById('med-rating-categories');
        if (!container) {
            console.error('❌ Container med-rating-categories not found!');
            return;
        }
        
        const cfg = this.currentConfig;
        
        if (!cfg) {
            console.error('❌ currentConfig is null or undefined!');
            container.innerHTML = '<div style="padding: 40px; text-align: center; color: red;">Error: Tracker configuration not loaded. Please close and reopen the tracker.</div>';
            return;
        }
        
        console.log('✅ Container found, rendering...');
        console.log('Observed categories:', cfg.observedCategories?.length || 0);
        console.log('Self-report categories:', cfg.selfReportCategories?.length || 0);
        
        if (!cfg.observedCategories || !cfg.selfReportCategories) {
            console.error('❌ Template missing categories!');
            container.innerHTML = '<div style="padding: 40px; text-align: center; color: red;">Error: Template data incomplete. Config: ' + JSON.stringify(cfg).substring(0, 200) + '</div>';
            return;
        }
        
        // Define rating scale once at the top so it's accessible in both loops
        const ratingScale = cfg.ratingScale || [
            { value: 1, label: '1', color: '#ef4444' },
            { value: 2, label: '2', color: '#f97316' },
            { value: 3, label: '3', color: '#fbbf24' },
            { value: 4, label: '4', color: '#84cc16' },
            { value: 5, label: '5', color: '#22c55e' }
        ];
        
        let html = '';
        
        // Observed Categories
        html += `<h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 16px;">👁️ ${cfg.observerSectionTitle || 'Observer Ratings'}</h3>`;
        cfg.observedCategories.forEach(category => {
            html += `
                <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                    <h4 style="font-size: 18px; font-weight: 600; color: #374151; margin-bottom: 16px;">${category.name}</h4>
            `;
            
            category.items.forEach(item => {
                const currentRating = this.currentEntry.observedRatings[item.id];
                html += `
                    <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
                        <div style="margin-bottom: 8px;">
                            <p style="font-weight: 600; color: #111827; margin-bottom: 4px;">${item.label}</p>
                            <p style="font-size: 13px; color: #6b7280;">${item.description}</p>
                        </div>
                        <div class="rating-buttons" style="display: flex; gap: 8px;">
                `;
                
                // Rating scale already defined at top of function
                ratingScale.forEach(rating => {
                    const isSelected = currentRating === rating.value;
                    html += `
                        <button 
                            onclick="MedicationTracker.setObservedRating('${item.id}', ${rating.value})"
                            style="flex: 1; padding: 10px 4px; border: 2px solid ${isSelected ? rating.color : '#d1d5db'}; 
                                   background: ${isSelected ? rating.color : 'white'}; 
                                   color: ${isSelected ? 'white' : '#374151'}; 
                                   border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;
                                   transition: all 0.2s;">
                            ${rating.value}
                        </button>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        });
        
        // Self-Report Categories
        html += `<h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 24px 0 16px 0;">🗣️ ${cfg.selfReportSectionTitle || 'Self-Report'}</h3>`;
        cfg.selfReportCategories.forEach(category => {
            html += `
                <div style="background: #eff6ff; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                    <h4 style="font-size: 18px; font-weight: 600; color: #1e40af; margin-bottom: 16px;">${category.name}</h4>
            `;
            
            category.items.forEach(item => {
                const currentRating = this.currentEntry.selfReportedRatings[item.id];
                html += `
                    <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #bfdbfe;">
                        <div style="margin-bottom: 8px;">
                            <p style="font-weight: 600; color: #1e3a8a; margin-bottom: 4px;">${item.label}</p>
                            <p style="font-size: 13px; color: #1e40af;">${item.description}</p>
                        </div>
                        <div class="rating-buttons" style="display: flex; gap: 8px;">
                `;
                
                ratingScale.forEach(rating => {
                    const isSelected = currentRating === rating.value;
                    html += `
                        <button 
                            onclick="MedicationTracker.setSelfReportRating('${item.id}', ${rating.value})"
                            style="flex: 1; padding: 10px 4px; border: 2px solid ${isSelected ? rating.color : '#bfdbfe'}; 
                                   background: ${isSelected ? rating.color : 'white'}; 
                                   color: ${isSelected ? 'white' : '#1e40af'}; 
                                   border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;
                                   transition: all 0.2s;">
                            ${rating.value}
                        </button>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        });
        
        container.innerHTML = html;
    },
    
    // Set observed rating
    setObservedRating: function(itemId, value) {
        this.currentEntry.observedRatings[itemId] = value;
        this.renderEntryForm();
    },
    
    // Set self-report rating
    setSelfReportRating: function(itemId, value) {
        this.currentEntry.selfReportedRatings[itemId] = value;
        this.renderEntryForm();
    },
    
    // Save entry to Firestore
    saveEntry: async function() {
        // Validation
        const date = document.getElementById('med-entry-date').value;
        const observer = document.getElementById('med-observer').value;
        const periodType = document.querySelector('input[name="med-period"]:checked')?.value;
        const notes = document.getElementById('med-entry-notes').value;
        
        if (!date) {
            alert('Please select a date');
            return;
        }
        
        if (!observer.trim()) {
            alert('Please enter observer name');
            return;
        }
        
        if (!periodType) {
            alert('Please select a period type');
            return;
        }
        
        const hasObservedRatings = Object.keys(this.currentEntry.observedRatings).length > 0;
        const hasSelfRatings = Object.keys(this.currentEntry.selfReportedRatings).length > 0;
        
        if (!hasObservedRatings && !hasSelfRatings) {
            alert('Please complete at least some ratings before saving');
            return;
        }
        
        // Create entry object
        const entry = {
            trackerId: this.currentTrackerId,
            date: date,
            observer: observer,
            periodType: periodType,
            observedRatings: this.currentEntry.observedRatings,
            selfReportedRatings: this.currentEntry.selfReportedRatings,
            notes: notes,
            timestamp: Date.now()
        };
        
        try {
            // Save to Firestore with trackerId in path
            if (currentUser) {
                const userRef = db.collection('users').doc(currentUser.uid);
                const entryRef = userRef
                    .collection('familyMembers').doc(this.currentMemberId)
                    .collection('trackerData').doc(this.currentTrackerId)
                    .collection('entries').doc(date);
                
                await entryRef.set(entry);
                
                console.log('✅ Entry saved to Firestore:', this.currentTrackerId);
                alert('✅ Entry saved successfully!');
                
                // Reset form
                this.resetCurrentEntry();
                document.getElementById('med-observer').value = '';
                document.getElementById('med-entry-notes').value = '';
                
                // Reset to first period type
                const firstPeriodRadio = document.querySelector('input[name="med-period"]');
                if (firstPeriodRadio) {
                    firstPeriodRadio.checked = true;
                }
                
                this.renderEntryForm();
                
                // Reload entries
                await this.loadEntries();
                
            } else {
                alert('Error: Not signed in');
            }
        } catch (error) {
            console.error('Error saving entry:', error);
            alert('Failed to save entry: ' + error.message);
        }
    },
    
    // Load entries from Firestore
    loadEntries: async function() {
        if (!currentUser) return;
        
        try {
            const userRef = db.collection('users').doc(currentUser.uid);
            const entriesSnapshot = await userRef
                .collection('familyMembers').doc(this.currentMemberId)
                .collection('trackerData').doc(this.currentTrackerId)
                .collection('entries').get();
            
            this.entries = [];
            entriesSnapshot.forEach(doc => {
                this.entries.push({ id: doc.id, ...doc.data() });
            });
            
            // Sort by date descending
            this.entries.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            console.log('✅ Loaded', this.entries.length, 'entries for tracker:', this.currentTrackerId);
            
        } catch (error) {
            console.error('Error loading entries:', error);
        }
    },
    
    // Render history
    renderHistory: function() {
        const container = document.getElementById('med-history-list');
        if (!container) return;
        
        if (this.entries.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #6b7280;">
                    <div style="font-size: 64px; margin-bottom: 16px;">📋</div>
                    <p style="font-size: 18px; font-weight: 600;">No entries yet</p>
                    <p style="font-size: 14px;">Start tracking to see history here</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        // Summary stats
        const baselineCount = this.entries.filter(e => e.periodType === 'baseline').length;
        const medicationCount = this.entries.filter(e => e.periodType === 'medication').length;
        const controlCount = this.entries.filter(e => e.periodType === 'control').length;
        
        html += `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: #dbeafe; padding: 16px; border-radius: 12px;">
                    <p style="font-size: 13px; color: #1e40af; font-weight: 600;">Total Entries</p>
                    <p style="font-size: 32px; font-weight: 700; color: #1e3a8a;">${this.entries.length}</p>
                </div>
                <div style="background: #fed7aa; padding: 16px; border-radius: 12px;">
                    <p style="font-size: 13px; color: #92400e; font-weight: 600;">Baseline</p>
                    <p style="font-size: 32px; font-weight: 700; color: #78350f;">${baselineCount}</p>
                </div>
                <div style="background: #bbf7d0; padding: 16px; border-radius: 12px;">
                    <p style="font-size: 13px; color: #166534; font-weight: 600;">On Medication</p>
                    <p style="font-size: 32px; font-weight: 700; color: #14532d;">${medicationCount}</p>
                </div>
                <div style="background: #e9d5ff; padding: 16px; border-radius: 12px;">
                    <p style="font-size: 13px; color: #6b21a8; font-weight: 600;">Control</p>
                    <p style="font-size: 32px; font-weight: 700; color: #581c87;">${controlCount}</p>
                </div>
            </div>
        `;
        
        // Entry list
        this.entries.forEach(entry => {
            const periodColor = entry.periodType === 'baseline' ? '#fb923c' : 
                               entry.periodType === 'medication' ? '#22c55e' : '#a855f7';
            const periodLabel = entry.periodType === 'baseline' ? '📊 Baseline' :
                               entry.periodType === 'medication' ? '💊 On Med' : '🔄 Control';
            
            // Calculate average rating
            const allRatings = [...Object.values(entry.observedRatings || {}), ...Object.values(entry.selfReportedRatings || {})];
            const avgRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : 'N/A';
            
            html += `
                <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <div>
                            <p style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 4px;">${entry.date}</p>
                            <p style="font-size: 14px; color: #6b7280;">Observer: ${entry.observer}</p>
                        </div>
                        <div style="text-align: right;">
                            <span style="display: inline-block; padding: 6px 12px; background: ${periodColor}; color: white; border-radius: 8px; font-size: 13px; font-weight: 600;">
                                ${periodLabel}
                            </span>
                            <p style="font-size: 24px; font-weight: 700; color: #6366f1; margin-top: 8px;">
                                ${avgRating} <span style="font-size: 14px; color: #6b7280;">/5</span>
                            </p>
                        </div>
                    </div>
                    ${entry.notes ? `
                        <div style="background: #fffbeb; padding: 12px; border-radius: 8px; border-left: 4px solid #fbbf24;">
                            <p style="font-size: 13px; color: #92400e; font-weight: 600; margin-bottom: 4px;">📝 Notes:</p>
                            <p style="font-size: 14px; color: #78350f;">${entry.notes}</p>
                        </div>
                    ` : ''}
                    <button onclick="MedicationTracker.deleteEntry('${entry.id}')" style="margin-top: 12px; padding: 8px 16px; background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">
                        🗑️ Delete
                    </button>
                </div>
            `;
        });
        
        container.innerHTML = html;
    },
    
    // Delete entry
    deleteEntry: async function(entryId) {
        if (!confirm('Delete this entry? This cannot be undone.')) return;
        
        try {
            if (currentUser) {
                const userRef = db.collection('users').doc(currentUser.uid);
                await userRef
                    .collection('familyMembers').doc(this.currentMemberId)
                    .collection('trackerData').doc(this.currentTrackerId)
                    .collection('entries').doc(entryId).delete();
                
                console.log('✅ Entry deleted from tracker:', this.currentTrackerId);
                alert('Entry deleted successfully');
                
                // Reload
                await this.loadEntries();
                this.renderHistory();
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
            alert('Failed to delete entry: ' + error.message);
        }
    },
    
    // Render analytics
    renderAnalytics: function() {
        const container = document.getElementById('med-analytics-content');
        if (!container) return;
        
        if (this.entries.length < 5) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; background: #eff6ff; border-radius: 12px; border: 2px dashed #3b82f6;">
                    <div style="font-size: 64px; margin-bottom: 16px;">📊</div>
                    <p style="font-size: 18px; font-weight: 600; color: #1e40af;">Not Enough Data</p>
                    <p style="font-size: 14px; color: #3b82f6; margin-top: 8px;">Add at least 5 entries to see analytics</p>
                    <p style="font-size: 13px; color: #6b7280; margin-top: 4px;">Currently have: ${this.entries.length} entries</p>
                </div>
            `;
            return;
        }
        
        // Calculate statistics
        const baselineEntries = this.entries.filter(e => e.periodType === 'baseline');
        const medicationEntries = this.entries.filter(e => e.periodType === 'medication');
        
        // Calculate averages
        const getAverageRating = (entries) => {
            if (entries.length === 0) return null;
            let total = 0;
            let count = 0;
            entries.forEach(entry => {
                Object.values(entry.observedRatings || {}).forEach(rating => {
                    total += rating;
                    count++;
                });
                Object.values(entry.selfReportedRatings || {}).forEach(rating => {
                    total += rating;
                    count++;
                });
            });
            return count > 0 ? (total / count).toFixed(2) : null;
        };
        
        const baselineAvg = getAverageRating(baselineEntries);
        const medicationAvg = getAverageRating(medicationEntries);
        
        let html = '';
        
        // Summary
        html += `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">📊 Overall Analysis</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                    ${baselineAvg ? `
                        <div style="background: rgba(255,255,255,0.2); padding: 16px; border-radius: 8px;">
                            <p style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Baseline Average</p>
                            <p style="font-size: 36px; font-weight: 700;">${baselineAvg}</p>
                            <p style="font-size: 13px; opacity: 0.8;">${baselineEntries.length} entries</p>
                        </div>
                    ` : ''}
                    ${medicationAvg ? `
                        <div style="background: rgba(255,255,255,0.2); padding: 16px; border-radius: 8px;">
                            <p style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Medication Average</p>
                            <p style="font-size: 36px; font-weight: 700;">${medicationAvg}</p>
                            <p style="font-size: 13px; opacity: 0.8;">${medicationEntries.length} entries</p>
                        </div>
                    ` : ''}
                    ${baselineAvg && medicationAvg ? `
                        <div style="background: rgba(255,255,255,0.2); padding: 16px; border-radius: 8px;">
                            <p style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Improvement</p>
                            <p style="font-size: 36px; font-weight: 700;">
                                ${(medicationAvg - baselineAvg > 0 ? '+' : '')}${(medicationAvg - baselineAvg).toFixed(2)}
                            </p>
                            <p style="font-size: 13px; opacity: 0.8;">
                                ${(((medicationAvg - baselineAvg) / baselineAvg) * 100).toFixed(1)}% change
                            </p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Timeline view
        html += '<h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 16px;">📈 Timeline</h3>';
        html += '<div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">';
        
        // Sort entries by date
        const sortedEntries = [...this.entries].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        sortedEntries.forEach((entry, index) => {
            const allRatings = [...Object.values(entry.observedRatings || {}), ...Object.values(entry.selfReportedRatings || {})];
            const avgRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : 0;
            const barWidth = (avgRating / 5) * 100;
            const periodColor = entry.periodType === 'baseline' ? '#fb923c' : 
                               entry.periodType === 'medication' ? '#22c55e' : '#a855f7';
            
            html += `
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-size: 13px; font-weight: 600; color: #6b7280;">${entry.date}</span>
                        <span style="font-size: 14px; font-weight: 700; color: #374151;">${avgRating}</span>
                    </div>
                    <div style="height: 24px; background: #f3f4f6; border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; background: ${periodColor}; width: ${barWidth}%; transition: width 0.3s;"></div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Insights
        if (baselineAvg && medicationAvg) {
            const improvement = medicationAvg - baselineAvg;
            const improvementPercent = ((improvement / baselineAvg) * 100).toFixed(1);
            
            html += `
                <div style="background: ${improvement > 0 ? '#d1fae5' : '#fee2e2'}; border: 2px solid ${improvement > 0 ? '#10b981' : '#ef4444'}; border-radius: 12px; padding: 20px;">
                    <h3 style="font-size: 18px; font-weight: 700; color: ${improvement > 0 ? '#065f46' : '#991b1b'}; margin-bottom: 12px;">
                        ${improvement > 0 ? '✅ Positive Progress' : '⚠️ Consider Adjustments'}
                    </h3>
                    <p style="font-size: 14px; color: ${improvement > 0 ? '#047857' : '#b91c1c'};">
                        ${improvement > 0 ? 
                            `Average ratings improved by ${improvementPercent}% from baseline to medication period. This suggests the current approach is beneficial.` :
                            `Average ratings decreased by ${Math.abs(improvementPercent)}% from baseline. Consider discussing adjustments with healthcare provider.`
                        }
                    </p>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }
};

// Tab switching function
function switchMedTab(tab) {
    // Update tab buttons
    document.getElementById('med-tab-entry').style.borderBottomColor = tab === 'entry' ? '#6366f1' : 'transparent';
    document.getElementById('med-tab-entry').style.color = tab === 'entry' ? '#6366f1' : '#6b7280';
    document.getElementById('med-tab-history').style.borderBottomColor = tab === 'history' ? '#6366f1' : 'transparent';
    document.getElementById('med-tab-history').style.color = tab === 'history' ? '#6366f1' : '#6b7280';
    document.getElementById('med-tab-analytics').style.borderBottomColor = tab === 'analytics' ? '#6366f1' : 'transparent';
    document.getElementById('med-tab-analytics').style.color = tab === 'analytics' ? '#6366f1' : '#6b7280';
    document.getElementById('med-tab-settings').style.borderBottomColor = tab === 'settings' ? '#6366f1' : 'transparent';
    document.getElementById('med-tab-settings').style.color = tab === 'settings' ? '#6366f1' : '#6b7280';
    
    // Update content visibility
    document.getElementById('med-content-entry').style.display = tab === 'entry' ? 'block' : 'none';
    document.getElementById('med-content-history').style.display = tab === 'history' ? 'block' : 'none';
    document.getElementById('med-content-analytics').style.display = tab === 'analytics' ? 'block' : 'none';
    document.getElementById('med-content-settings').style.display = tab === 'settings' ? 'block' : 'none';
    
    // Render appropriate content
    if (tab === 'history') {
        MedicationTracker.renderHistory();
    } else if (tab === 'analytics') {
        MedicationTracker.renderAnalytics();
    } else if (tab === 'settings') {
        renderTrackerSettings();
    }
}

// ========================================
// TRACKER SETTINGS - CUSTOMIZE QUESTIONS
// ========================================

// Render settings interface
function renderTrackerSettings() {
    const child = state.data[state.currentChild];
    const tracker = child.trackers.find(t => t.id === window.currentTrackerId);
    
    if (!tracker) {
        console.error('Tracker not found');
        return;
    }
    
    const config = tracker.customConfig;
    
    // Render observer categories
    renderObserverCategoriesSettings(config.observedCategories);
    
    // Render self-report categories
    renderSelfReportCategoriesSettings(config.selfReportCategories);
}

// Render observer categories in settings
function renderObserverCategoriesSettings(categories) {
    const container = document.getElementById('settings-observer-categories');
    
    let html = '';
    categories.forEach((category, catIndex) => {
        html += `
            <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 16px; border: 2px solid #e5e7eb;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <input type="text" value="${category.name}" onchange="updateCategoryName('observed', ${catIndex}, this.value)" 
                           style="flex: 1; padding: 8px 12px; border: 2px solid #d1d5db; border-radius: 8px; font-weight: 600; font-size: 16px; margin-right: 12px;">
                    <button onclick="removeCategory('observed', ${catIndex})" 
                            style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer;">
                        🗑️ Delete
                    </button>
                </div>
                
                <div style="margin-bottom: 12px;">
        `;
        
        category.items.forEach((item, itemIndex) => {
            html += `
                <div style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #e5e7eb;">
                    <div style="display: flex; gap: 12px; margin-bottom: 8px;">
                        <div style="flex: 1;">
                            <label style="font-size: 12px; font-weight: 600; color: #6b7280;">Question</label>
                            <input type="text" value="${item.label}" onchange="updateQuestionLabel('observed', ${catIndex}, ${itemIndex}, this.value)"
                                   style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; margin-top: 4px;">
                        </div>
                        <button onclick="removeQuestion('observed', ${catIndex}, ${itemIndex})"
                                style="align-self: flex-end; padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; height: fit-content;">
                            ×
                        </button>
                    </div>
                    <div>
                        <label style="font-size: 12px; font-weight: 600; color: #6b7280;">Description</label>
                        <input type="text" value="${item.description}" onchange="updateQuestionDescription('observed', ${catIndex}, ${itemIndex}, this.value)"
                               style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; margin-top: 4px;">
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
                <button onclick="addQuestion('observed', ${catIndex})" 
                        style="width: 100%; padding: 10px; background: white; border: 2px dashed #d1d5db; border-radius: 8px; color: #6366f1; font-weight: 600; cursor: pointer;">
                    + Add Question
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Render self-report categories in settings
function renderSelfReportCategoriesSettings(categories) {
    const container = document.getElementById('settings-self-report-categories');
    
    let html = '';
    categories.forEach((category, catIndex) => {
        html += `
            <div style="background: #eff6ff; padding: 20px; border-radius: 12px; margin-bottom: 16px; border: 2px solid #bfdbfe;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <input type="text" value="${category.name}" onchange="updateCategoryName('self-report', ${catIndex}, this.value)" 
                           style="flex: 1; padding: 8px 12px; border: 2px solid #93c5fd; border-radius: 8px; font-weight: 600; font-size: 16px; margin-right: 12px;">
                    <button onclick="removeCategory('self-report', ${catIndex})" 
                            style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer;">
                        🗑️ Delete
                    </button>
                </div>
                
                <div style="margin-bottom: 12px;">
        `;
        
        category.items.forEach((item, itemIndex) => {
            html += `
                <div style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #bfdbfe;">
                    <div style="display: flex; gap: 12px; margin-bottom: 8px;">
                        <div style="flex: 1;">
                            <label style="font-size: 12px; font-weight: 600; color: #1e40af;">Question</label>
                            <input type="text" value="${item.label}" onchange="updateQuestionLabel('self-report', ${catIndex}, ${itemIndex}, this.value)"
                                   style="width: 100%; padding: 8px; border: 1px solid #93c5fd; border-radius: 6px; margin-top: 4px;">
                        </div>
                        <button onclick="removeQuestion('self-report', ${catIndex}, ${itemIndex})"
                                style="align-self: flex-end; padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; height: fit-content;">
                            ×
                        </button>
                    </div>
                    <div>
                        <label style="font-size: 12px; font-weight: 600; color: #1e40af;">Description</label>
                        <input type="text" value="${item.description}" onchange="updateQuestionDescription('self-report', ${catIndex}, ${itemIndex}, this.value)"
                               style="width: 100%; padding: 8px; border: 1px solid #93c5fd; border-radius: 6px; margin-top: 4px;">
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
                <button onclick="addQuestion('self-report', ${catIndex})" 
                        style="width: 100%; padding: 10px; background: white; border: 2px dashed #93c5fd; border-radius: 8px; color: #2563eb; font-weight: 600; cursor: pointer;">
                    + Add Question
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Get current tracker config (working copy)
function getCurrentTrackerConfig() {
    const child = state.data[state.currentChild];
    const tracker = child.trackers.find(t => t.id === window.currentTrackerId);
    return tracker ? tracker.customConfig : null;
}

// Update category name
function updateCategoryName(type, catIndex, newName) {
    const config = getCurrentTrackerConfig();
    if (!config) return;
    
    const categories = type === 'observed' ? config.observedCategories : config.selfReportCategories;
    categories[catIndex].name = newName;
}

// Update question label
function updateQuestionLabel(type, catIndex, itemIndex, newLabel) {
    const config = getCurrentTrackerConfig();
    if (!config) return;
    
    const categories = type === 'observed' ? config.observedCategories : config.selfReportCategories;
    categories[catIndex].items[itemIndex].label = newLabel;
}

// Update question description
function updateQuestionDescription(type, catIndex, itemIndex, newDescription) {
    const config = getCurrentTrackerConfig();
    if (!config) return;
    
    const categories = type === 'observed' ? config.observedCategories : config.selfReportCategories;
    categories[catIndex].items[itemIndex].description = newDescription;
}

// Add new question to category
function addQuestion(type, catIndex) {
    const config = getCurrentTrackerConfig();
    if (!config) return;
    
    const categories = type === 'observed' ? config.observedCategories : config.selfReportCategories;
    const newId = 'custom_' + Date.now();
    
    categories[catIndex].items.push({
        id: newId,
        label: 'New Question',
        description: 'Description of what to observe or how you feel'
    });
    
    renderTrackerSettings();
}

// Remove question from category
function removeQuestion(type, catIndex, itemIndex) {
    const config = getCurrentTrackerConfig();
    if (!config) return;
    
    const categories = type === 'observed' ? config.observedCategories : config.selfReportCategories;
    
    if (categories[catIndex].items.length <= 1) {
        alert('Cannot remove the last question. Delete the category instead.');
        return;
    }
    
    if (confirm('Remove this question? Any data collected for this question will still be preserved in history.')) {
        categories[catIndex].items.splice(itemIndex, 1);
        renderTrackerSettings();
    }
}

// Add new category
function addObserverCategory() {
    const config = getCurrentTrackerConfig();
    if (!config) return;
    
    config.observedCategories.push({
        name: 'New Category',
        items: [
            {
                id: 'custom_' + Date.now(),
                label: 'New Question',
                description: 'Description of what to observe'
            }
        ]
    });
    
    renderTrackerSettings();
}

function addSelfReportCategory() {
    const config = getCurrentTrackerConfig();
    if (!config) return;
    
    config.selfReportCategories.push({
        name: 'New Category',
        items: [
            {
                id: 'custom_' + Date.now(),
                label: 'New Question',
                description: 'Description of how you feel'
            }
        ]
    });
    
    renderTrackerSettings();
}

// Remove category
function removeCategory(type, catIndex) {
    const config = getCurrentTrackerConfig();
    if (!config) return;
    
    const categories = type === 'observed' ? config.observedCategories : config.selfReportCategories;
    
    if (categories.length <= 1) {
        alert('Cannot remove the last category. A tracker must have at least one category.');
        return;
    }
    
    if (confirm('Remove this entire category and all its questions? Data will still be preserved in history.')) {
        categories.splice(catIndex, 1);
        renderTrackerSettings();
    }
}

// Save tracker settings
function saveTrackerSettings() {
    const child = state.data[state.currentChild];
    const tracker = child.trackers.find(t => t.id === window.currentTrackerId);
    
    if (!tracker) {
        alert('Error: Tracker not found');
        return;
    }
    
    // Validate - must have at least one question
    const hasObservedQuestions = tracker.customConfig.observedCategories.some(cat => cat.items.length > 0);
    const hasSelfReportQuestions = tracker.customConfig.selfReportCategories.some(cat => cat.items.length > 0);
    
    if (!hasObservedQuestions && !hasSelfReportQuestions) {
        alert('Tracker must have at least one question!');
        return;
    }
    
    // Save to local storage
    saveData();
    
    // Re-initialize the tracker with new config
    MedicationTracker.init(state.currentChild, tracker.id, tracker.customConfig);
    MedicationTracker.renderEntryForm();
    
    // Switch back to entry tab
    switchMedTab('entry');
    
    alert('✅ Settings saved! Your custom questions are now active.');
}

// Save entry function
function saveMedEntry() {
    MedicationTracker.saveEntry();
}


// Initialize will be done by Firebase auth state listener
// Don't initialize here - wait for Firebase authentication
