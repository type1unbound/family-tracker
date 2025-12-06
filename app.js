// ========================================
// FAMILY ROUTINE & VALUES TRACKERS - Multi-Family Support Update - added multi-family login and onboarding 8:55AM 11/24
// Consolidated Single-File Application
// ========================================

// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
    COLOR_PALETTES: {
        purple: {
            name: 'Purple',
            bgGradient1: '#a78bfa',
            bgGradient2: '#6366f1',
            accent: '#6366f1',
            accentHover: '#4f46e5',
            accentLight: '#f0f9ff',
            gradientSecondary1: '#667eea',
            gradientSecondary2: '#764ba2',
            statCard: '#f3f4f6',
            profileButton: '#6366f1'
        },
        blue: {
            name: 'Blue',
            bgGradient1: '#60a5fa',
            bgGradient2: '#3b82f6',
            accent: '#3b82f6',
            accentHover: '#2563eb',
            accentLight: '#eff6ff',
            gradientSecondary1: '#3b82f6',
            gradientSecondary2: '#1e40af',
            statCard: '#f3f4f6',
            profileButton: '#3b82f6'
        },
        green: {
            name: 'Green',
            bgGradient1: '#4ade80',
            bgGradient2: '#22c55e',
            accent: '#22c55e',
            accentHover: '#16a34a',
            accentLight: '#f0fdf4',
            gradientSecondary1: '#10b981',
            gradientSecondary2: '#059669',
            statCard: '#f3f4f6',
            profileButton: '#22c55e'
        },
        pink: {
            name: 'Pink',
            bgGradient1: '#f472b6',
            bgGradient2: '#ec4899',
            accent: '#ec4899',
            accentHover: '#db2777',
            accentLight: '#fdf2f8',
            gradientSecondary1: '#ec4899',
            gradientSecondary2: '#be185d',
            statCard: '#f3f4f6',
            profileButton: '#ec4899'
        },
        orange: {
            name: 'Orange',
            bgGradient1: '#fb923c',
            bgGradient2: '#f97316',
            accent: '#f97316',
            accentHover: '#ea580c',
            accentLight: '#fff7ed',
            gradientSecondary1: '#f97316',
            gradientSecondary2: '#c2410c',
            statCard: '#f3f4f6',
            profileButton: '#f97316'
        },
        teal: {
            name: 'Teal',
            bgGradient1: '#2dd4bf',
            bgGradient2: '#14b8a6',
            accent: '#14b8a6',
            accentHover: '#0d9488',
            accentLight: '#f0fdfa',
            gradientSecondary1: '#14b8a6',
            gradientSecondary2: '#0f766e',
            statCard: '#f3f4f6',
            profileButton: '#14b8a6'
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
    ]
};

function applyTheme(palette, root) {
    const colors = CONFIG.COLOR_PALETTES[palette] || CONFIG.COLOR_PALETTES.purple;
    
    root.style.setProperty('--theme-gradient-1', colors.bgGradient1);
    root.style.setProperty('--theme-gradient-2', colors.bgGradient2);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-accent-hover', colors.accentHover);
    root.style.setProperty('--theme-accent-light', colors.accentLight);
    root.style.setProperty('--theme-gradient-secondary-1', colors.gradientSecondary1);
    root.style.setProperty('--theme-gradient-secondary-2', colors.gradientSecondary2);
}



// ========================================
// STATE MANAGEMENT
// ========================================
const StateManager = {
    state: {
        currentChild: null,  // CHANGED: was 'child1', now null until loaded
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
        children: [],  // CHANGED: was ['child1', 'child2'], now empty until loaded
        data: {},  // CHANGED: was hardcoded children, now empty until loaded
        familyId: null,  // NEW: current family ID
        familyCode: null  // NEW: current family code
    },

    getCurrentChild() {
        return this.state.data[this.state.currentChild];
    },

    getChild(childId) {
        return this.state.data[childId];
    },

    getCurrentDate() {
        return this.state.currentDate;
    },

    setCurrentDate(date) {
        this.state.currentDate = date;
    },

    getSchedule(filterByDay = true) {
        const child = this.getCurrentChild();
        if (!child) return [];
        
        // Initialize schedule if it doesn't exist
        if (!child.schedule) {
            child.schedule = [];
        }
        
        // Extra safety: ensure schedule is an array
        if (!Array.isArray(child.schedule)) {
            console.warn('⚠️ Schedule is not an array, initializing empty array');
            child.schedule = [];
        }
        
        const schedule = child.schedule;
        
        schedule.forEach(item => {
            if (!item.days) {
                item.days = [0,1,2,3,4,5,6];
            }
        });
        
        schedule.sort((a, b) => {
            const timeA = this.convertTimeToMinutes(a.time);
            const timeB = this.convertTimeToMinutes(b.time);
            return timeA - timeB;
        });
        
        if (!filterByDay) {
            return schedule;
        }
        
        const currentDate = new Date(this.state.currentDate + 'T00:00:00');
        const dayOfWeek = currentDate.getDay();
        
        return schedule.filter(item => item.days.includes(dayOfWeek));
    },

    convertTimeToMinutes(timeStr) {
        if (!timeStr) return 0;
        
        const match = timeStr.toLowerCase().match(/(\d+):?(\d*)([ap]m)?/);
        if (!match) return 0;
        
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2] || 0);
        const period = match[3];
        
        if (period === 'pm' && hours !== 12) {
            hours += 12;
        } else if (period === 'am' && hours === 12) {
            hours = 0;
        }
        
        return hours * 60 + minutes;
    },

    formatTime12Hour(timeStr) {
        if (!timeStr) return '';
        
        // If already in 12h format (has am/pm), return as-is
        if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
            return timeStr;
        }
        
        // Parse 24h time
        const match = timeStr.match(/(\d+):?(\d*)/);
        if (!match) return timeStr;
        
        let hours = parseInt(match[1]);
        const minutes = match[2] ? match[2].padStart(2, '0') : '00';
        
        const period = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12; // Convert 0 to 12, and 13-23 to 1-11
        
        return `${hours}:${minutes}${period}`;
    },

    getCharacterValues() {
        const child = this.getCurrentChild();
        if (!child) return [];
        
        // Initialize characterValues if it doesn't exist
        if (!child.characterValues) {
            child.characterValues = [];
        }
        
        // Extra safety: ensure characterValues is an array
        if (!Array.isArray(child.characterValues)) {
            console.warn('⚠️ CharacterValues is not an array, initializing empty array');
            child.characterValues = [];
        }
        
        return child.characterValues;
    },

    getWeeklyChores() {
        const child = this.getCurrentChild();
        if (!child) return [];
        
        // Initialize weeklyChores if it doesn't exist
        if (!child.weeklyChores) {
            child.weeklyChores = [];
        }
        
        // Extra safety: ensure weeklyChores is an array
        if (!Array.isArray(child.weeklyChores)) {
            console.warn('⚠️ WeeklyChores is not an array, initializing empty array');
            child.weeklyChores = [];
        }
        
        return child.weeklyChores;
    },

getDayData() {
    const child = this.getCurrentChild();
    if (!child) return { schedule: {}, weeklyChores: {}, categoryMultipliers: {}, notes: '', characterNotes: {} };
    
    // ADD THIS LINE - Initialize days object if it doesn't exist
    if (!child.days) {
        child.days = {};
    }
    
    if (!child.days[this.state.currentDate]) {
        // Initialize with all current character categories
        const categoryMultipliers = {};
        const characterValues = this.getCharacterValues();
        characterValues.forEach(cat => {
            categoryMultipliers[cat.id] = 1.0;
        });
        
        child.days[this.state.currentDate] = {
            schedule: {},
            weeklyChores: {},
            categoryMultipliers: categoryMultipliers,
            notes: '',
            characterNotes: {}
        };
    }
    
    const dayData = child.days[this.state.currentDate];
        
        // Migrate old data structure
        if (dayData.characterMultiplier && !dayData.categoryMultipliers) {
            const categoryMultipliers = {};
            const characterValues = this.getCharacterValues();
            characterValues.forEach(cat => {
                categoryMultipliers[cat.id] = dayData.characterMultiplier;
            });
            dayData.categoryMultipliers = categoryMultipliers;
            delete dayData.characterMultiplier;
        }
        
        // Ensure all current categories exist in multipliers
        if (!dayData.categoryMultipliers) {
            dayData.categoryMultipliers = {};
        }
        const characterValues = this.getCharacterValues();
        characterValues.forEach(cat => {
            if (dayData.categoryMultipliers[cat.id] === undefined) {
                dayData.categoryMultipliers[cat.id] = 1.0;
            }
        });
        
        if (!dayData.weeklyChores) {
            dayData.weeklyChores = {};
        }
        
        if (!dayData.characterNotes) {
            dayData.characterNotes = {};
        }
        
        return child.days[this.state.currentDate];
    },

    getWeekDates(date) {
        const d = new Date(date + 'T00:00:00');
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));
        
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const current = new Date(monday);
            current.setDate(monday.getDate() + i);
            dates.push(current.toISOString().split('T')[0]);
        }
        return dates;
    },

    getWeekRangeDisplay(date) {
        const dates = this.getWeekDates(date);
        const startDate = new Date(dates[0] + 'T00:00:00');
        const endDate = new Date(dates[dates.length - 1] + 'T00:00:00');
        
        const options = { month: 'short', day: 'numeric' };
        const start = startDate.toLocaleDateString('en-US', options);
        const end = endDate.toLocaleDateString('en-US', options);
        
        return `Week of ${start} - ${end}`;
    },

    createChild(childId, useDefaults = true) {
        // UPDATED: Added useDefaults parameter and rewards array
        this.state.data[childId] = {
            name: 'Family Member ' + (this.state.children.length + 1),
            photo: null,
            colorPalette: 'purple',  // CHANGED: from 'lavender' to match COLOR_PALETTES
            pointsBalance: 0,
            pointsSpent: 0,
            trackers: [],
            days: {},
            schedule: useDefaults ? JSON.parse(JSON.stringify(CONFIG.DEFAULT_SCHEDULE)) : [],
            characterValues: useDefaults ? JSON.parse(JSON.stringify(CONFIG.DEFAULT_CHARACTER_VALUES)) : [],
            weeklyChores: useDefaults ? JSON.parse(JSON.stringify(CONFIG.DEFAULT_WEEKLY_CHORES)) : [],
            rewards: []  // NEW: for rewards system
        };
        this.state.children.push(childId);
    },

    deleteChild(childId) {
        this.state.children = this.state.children.filter(id => id !== childId);
        delete this.state.data[childId];
    }
};

// ========================================
// POINTS MODULE
// ========================================
const PointsModule = {
    calculatePoints(childId, date, includeWeeklyBonus = false) {
        const child = StateManager.getChild(childId);
        
        // Safety check
        if (!child) {
            console.error('❌ Child not found:', childId);
            return { base: 0, total: 0, dailyTotal: 0, multiplier: 1.0, choresMultiplier: 1.0, finalMultiplier: 1.0, choresComplete: false };
        }
        
        const dayData = child.days[date] || { 
            schedule: {}, 
            categoryMultipliers: {}
        };
        
        const completed = Object.values(dayData.schedule).filter(v => v === true).length;
        const base = completed;
        
        let totalMultiplier = 0;
        let totalWeight = 0;
        const savedChild = StateManager.state.currentChild;
        StateManager.state.currentChild = childId;
        const characterValues = StateManager.getCharacterValues();
        StateManager.state.currentChild = savedChild;
        
        // Ensure categoryMultipliers exists
        if (!dayData.categoryMultipliers) {
            dayData.categoryMultipliers = {};
        }
        
        characterValues.forEach(cat => {
            const mult = dayData.categoryMultipliers[cat.id] !== undefined 
                ? dayData.categoryMultipliers[cat.id] 
                : 1.0;
            totalMultiplier += mult * cat.weight;
            totalWeight += cat.weight;
        });
        const avgMultiplier = totalWeight > 0 ? totalMultiplier / totalWeight : 1.0;
        
        const dailyTotal = Math.round(base * avgMultiplier);
        
        let choresMultiplier = 1.0;
        let choresComplete = false;
        
        if (includeWeeklyBonus) {
            const currentSavedChild = StateManager.state.currentChild;
            StateManager.state.currentChild = childId;
            const choresData = this.calculateChoresCompletion();
            StateManager.state.currentChild = currentSavedChild;
            
            choresMultiplier = choresData.isComplete ? 5.0 : 1.0;
            choresComplete = choresData.isComplete;
        }
        
        const finalMultiplier = avgMultiplier * choresMultiplier;
        const total = Math.round(base * finalMultiplier);
        
        return { 
            base, 
            total: includeWeeklyBonus ? total : dailyTotal,
            dailyTotal,
            multiplier: avgMultiplier,
            choresMultiplier,
            finalMultiplier,
            choresComplete
        };
    },

    calculateWeeklyTotal() {
        const dates = StateManager.getWeekDates(StateManager.state.currentDate);
        const dailySum = dates.reduce((sum, d) => {
            return sum + this.calculatePoints(StateManager.state.currentChild, d, false).dailyTotal;
        }, 0);
        
        const choresData = this.calculateChoresCompletion();
        const weeklyMultiplier = choresData.isComplete ? 5.0 : 1.0;
        
        return Math.round(dailySum * weeklyMultiplier);
    },

    getWeeklyChoresData() {
        const weekDates = StateManager.getWeekDates(StateManager.state.currentDate);
        const weeklyChores = {};
        const chores = StateManager.getWeeklyChores();
        
        chores.forEach(chore => {
            weeklyChores[chore.id] = false;
        });
        
        weekDates.forEach(date => {
            const child = StateManager.getCurrentChild();
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
    },

    calculateChoresCompletion() {
        const weeklyChores = this.getWeeklyChoresData();
        const total = StateManager.getWeeklyChores().length;
        const completed = Object.values(weeklyChores).filter(Boolean).length;
        return {
            completed,
            total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
            isComplete: completed === total
        };
    },

    calculateMaxDailyPoints() {
        const scheduleItems = StateManager.getSchedule().length;
        const maxCharacterMultiplier = 2.0;
        return Math.round(scheduleItems * maxCharacterMultiplier);
    },

    calculateMaxWeeklyPoints() {
        const scheduleItems = StateManager.getSchedule().length;
        const maxCharacterMultiplier = 2.0;
        const weekDays = 7;
        const weeklyChoresBonus = 5.0;
        
        return Math.round(scheduleItems * maxCharacterMultiplier * weekDays * weeklyChoresBonus);
    },

    getDailyGoal() {
        return Math.round(this.calculateMaxDailyPoints() * 0.7);
    },

    getWeeklyGoal() {
        return Math.round(this.calculateMaxWeeklyPoints() * 0.7);
    },

    calculateStreak() {
        const today = new Date();
        let streak = 0;
        let current = new Date(today);
        const dailyGoal = this.getDailyGoal();
        
        while (streak < 30) {
            const dateStr = current.toISOString().split('T')[0];
            
            const points = this.calculatePoints(StateManager.state.currentChild, dateStr);
            if (points.total >= dailyGoal) {
                streak++;
            } else {
                break;
            }
            
            current.setDate(current.getDate() - 1);
        }
        
        return streak;
    }
}; 

// ========================================
// SCHEDULE MODULE
// ========================================
const ScheduleModule = {
    currentFocusedItemId: null,
    scrollListenerAttached: false,

    renderSchedule() {
        const dayData = StateManager.getDayData();
        const list = document.getElementById('schedule-list');
        
        // Safety check
        if (!list) {
            console.error('❌ schedule-list container not found');
            return;
        }
        
        const isEditMode = StateManager.state.editMode;
        
        const schedule = StateManager.getSchedule(!isEditMode);
        
        if (!schedule || schedule.length === 0) {
            list.innerHTML = '<p style="padding: 40px; text-align: center; color: #6b7280;">No schedule items yet</p>';
            return;
        }
        
        // Ensure dayData.schedule exists
        if (!dayData.schedule) {
            dayData.schedule = {};
        }
        
        list.innerHTML = schedule.map((item, index) => {
            const status = dayData.schedule[item.id];
            const isYes = status === true;
            const isNo = status === false;
            const completed = isYes;
            
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const itemDays = item.days || [0,1,2,3,4,5,6];
            const dayLabels = itemDays.map(d => dayNames[d]).join(', ');
            const showsAllDays = itemDays.length === 7;
            
            // Determine status text
            let statusBadge = '';
            if (isYes) {
                statusBadge = '<div class="schedule-status-badge completed">✓ Completed</div>';
            } else if (isNo) {
                statusBadge = '<div class="schedule-status-badge incomplete">✗ Not Done</div>';
            } else {
                statusBadge = '<div class="schedule-status-badge pending">⏳ Pending</div>';
            }
            
            return `
                <div class="timeline-item" data-schedule-index="${index}">
                    <div class="schedule-item ${completed ? 'completed' : ''}" 
                         data-item-id="${item.id}">
                        <div class="schedule-header">
                            <div>
                                <div class="schedule-time">${StateManager.formatTime12Hour(item.time)}</div>
                                <div class="schedule-name">${item.name}</div>
                                ${isEditMode && !showsAllDays ? `<div style="font-size: 11px; color: #6b7280; margin-top: 4px;">📅 ${dayLabels}</div>` : ''}
                            </div>
                        </div>
                        ${!isEditMode ? statusBadge : ''}
                        <ul class="task-list">
                            ${item.tasks.map(task => `<li>${task}</li>`).join('')}
                        </ul>
                        ${isEditMode ? `
                            <div class="edit-controls">
                                <button class="edit-btn" onclick="event.stopPropagation(); ScheduleModule.editScheduleItem(${index})">✏️ Edit</button>
                                <button class="edit-btn delete" onclick="event.stopPropagation(); ScheduleModule.deleteScheduleItem(${index})">🗑️ Delete</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        if (isEditMode) {
            list.innerHTML += `
                <button class="add-item-btn" onclick="ScheduleModule.addScheduleItem()">+ Add Routine Item</button>
            `;
        }

        // Attach scroll listener if not already attached
        if (!this.scrollListenerAttached) {
            this.attachScrollListener();
        }
    },

    attachScrollListener() {
        const scheduleSection = document.querySelector('.schedule-section');
        if (!scheduleSection) return;

        scheduleSection.addEventListener('scroll', () => this.updateFocusBasedOnScroll());
        this.scrollListenerAttached = true;
        console.log('✅ Scroll-based auto-focus enabled!');
    },

    updateFocusBasedOnScroll() {
        const scheduleSection = document.querySelector('.schedule-section');
        const items = document.querySelectorAll('.timeline-item');
        
        if (!scheduleSection || items.length === 0) return;
        
        const containerRect = scheduleSection.getBoundingClientRect();
        
        // Simple approach: Find the item closest to 150px from top
        const targetPosition = 150;
        let closestIndex = -1;
        let closestDistance = Infinity;
        
        items.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemTop = itemRect.top - containerRect.top;
            const distance = Math.abs(itemTop - targetPosition);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });
        
        if (closestIndex >= 0) {
            const schedule = StateManager.getSchedule();
            const focusedItem = schedule[closestIndex];
            
            if (focusedItem && this.currentFocusedItemId !== focusedItem.id) {
                this.renderFocusedScheduleItemById(focusedItem.id);
                this.updateScheduleFocusStates(closestIndex);
            }
        }
    },

    renderFocusedScheduleItem() {
        const schedule = StateManager.getSchedule();
        const dayData = StateManager.getDayData();
        const container = document.getElementById('schedule-detail-container');
        
        // Safety check
        if (!container) {
            console.warn('schedule-detail-container not found in HTML');
            return;
        }
        
        if (schedule.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        // Get current time in minutes (local timezone)
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        // Find the next upcoming incomplete item, or most recent incomplete
        let focusedItem = null;
        let focusedIndex = -1;
        
        let firstIncompleteAtOrAfter = null;
        let firstIncompleteAtOrAfterIndex = -1;
        let lastIncompleteBefore = null;
        let lastIncompleteBeforeIndex = -1;

        for (let i = 0; i < schedule.length; i++) {
            const item = schedule[i];
            const itemMinutes = StateManager.convertTimeToMinutes(item.time);
            const isComplete = dayData.schedule[item.id] === true;
            
            if (!isComplete) {
                if (itemMinutes >= currentMinutes) {
                    // First incomplete item at or after current time
                    if (firstIncompleteAtOrAfter === null) {
                        firstIncompleteAtOrAfter = item;
                        firstIncompleteAtOrAfterIndex = i;
                    }
                } else {
                    // Most recent incomplete item before current time
                    lastIncompleteBefore = item;
                    lastIncompleteBeforeIndex = i;
                }
            }
        }

        // Prioritize upcoming incomplete items, then fall back to most recent
        if (firstIncompleteAtOrAfter) {
            focusedItem = firstIncompleteAtOrAfter;
            focusedIndex = firstIncompleteAtOrAfterIndex;
        } else if (lastIncompleteBefore) {
            focusedItem = lastIncompleteBefore;
            focusedIndex = lastIncompleteBeforeIndex;
        }
        
        // If all complete, show last item
        if (!focusedItem && schedule.length > 0) {
            focusedItem = schedule[schedule.length - 1];
            focusedIndex = schedule.length - 1;
        }
        
        if (!focusedItem) {
            container.style.display = 'none';
            return;
        }
        
        // Render the focused item (no auto-scrolling)
        this.renderFocusedScheduleItemById(focusedItem.id);
        this.updateScheduleFocusStates(focusedIndex);
    },

    renderFocusedScheduleItemById(itemId) {
        const schedule = StateManager.getSchedule();
        const dayData = StateManager.getDayData();
        const container = document.getElementById('schedule-detail-container');
        
        if (!container) return;
        
        const focusedItem = schedule.find(item => item.id === itemId);
        if (!focusedItem) return;
        
        this.currentFocusedItemId = itemId;
        
        container.style.display = 'block';
        document.getElementById('focused-time').textContent = StateManager.formatTime12Hour(focusedItem.time);
        document.getElementById('focused-name').textContent = focusedItem.name;
        
        const tasksContainer = document.getElementById('focused-tasks');
        const isComplete = dayData.schedule[itemId] === true;
        
        tasksContainer.innerHTML = focusedItem.tasks.map(task => `
            <div class="task-item ${isComplete ? 'completed' : ''}">
                <div class="task-text">${task}</div>
            </div>
        `).join('');
        
        const completeBtn = document.getElementById('focused-complete-btn');
        if (isComplete) {
            completeBtn.textContent = '✓ Completed';
            completeBtn.classList.add('completed');
        } else {
            completeBtn.textContent = '✓ Mark Complete';
            completeBtn.classList.remove('completed');
        }
    },

    updateScheduleFocusStates(focusedIndex) {
        const scheduleItems = document.querySelectorAll('.timeline-item .schedule-item');
        scheduleItems.forEach((item, index) => {
            item.classList.remove('in-focus', 'out-of-focus');
            if (index === focusedIndex) {
                item.classList.add('in-focus');
            } else {
                item.classList.add('out-of-focus');
            }
        });
    },

    completeFocusedItem() {
        if (this.currentFocusedItemId) {
            const dayData = StateManager.getDayData();
            const isCurrentlyComplete = dayData.schedule[this.currentFocusedItemId] === true;
            
            // Toggle completion
            dayData.schedule[this.currentFocusedItemId] = !isCurrentlyComplete;
            
            saveData();
            if (window.UICore) {
                UICore.updateUI();
            }
        }
    },

    setScheduleStatus(scheduleId, status) {
        const dayData = StateManager.getDayData();
        if (dayData.schedule[scheduleId] === status) {
            delete dayData.schedule[scheduleId];
        } else {
            dayData.schedule[scheduleId] = status;
        }
        saveData();
        if (window.UICore) {
            UICore.updateUI();
        }
    },

    editScheduleItem(index) {
        const schedule = StateManager.getSchedule(false);
        StateManager.state.modalData = { 
            type: 'edit', 
            index, 
            item: JSON.parse(JSON.stringify(schedule[index])) 
        };
        
        document.getElementById('modal-time').value = schedule[index].time;
        document.getElementById('modal-name').value = schedule[index].name;
        
        const days = schedule[index].days || [0,1,2,3,4,5,6];
        ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach((dayName, idx) => {
            const dayValue = idx === 6 ? 0 : idx + 1;
            const checkbox = document.getElementById(`day-${dayName}`);
            if (checkbox) {
                checkbox.checked = days.includes(dayValue);
            }
        });
        
        const tasksList = document.getElementById('modal-tasks');
        tasksList.innerHTML = schedule[index].tasks.map((task, i) => `
            <li class="task-edit-item">
                <input type="text" class="edit-input" value="${task}" data-index="${i}">
                <button class="edit-btn delete" onclick="ScheduleModule.removeModalTask(${i})">🗑️</button>
            </li>
        `).join('');
        
        document.getElementById('schedule-modal').classList.add('active');
    },

    addScheduleItem() {
        const schedule = StateManager.getSchedule(false);
        const newId = schedule.length > 0 ? Math.max(...schedule.map(s => s.id)) + 1 : 1;
        StateManager.state.modalData = { 
            type: 'add', 
            item: { id: newId, time: '', name: '', tasks: [], days: [0,1,2,3,4,5,6] } 
        };
        
        document.getElementById('modal-time').value = '';
        document.getElementById('modal-name').value = '';
        document.getElementById('modal-tasks').innerHTML = '';
        
        ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(dayName => {
            const checkbox = document.getElementById(`day-${dayName}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        document.getElementById('schedule-modal').classList.add('active');
    },

    deleteScheduleItem(index) {
        if (confirm('Delete this schedule item?')) {
            const schedule = StateManager.getSchedule(false);
            schedule.splice(index, 1);
            saveData();
            if (window.UICore) {
                UICore.updateUI();
            }
        }
    },

    addModalTask() {
        const tasksList = document.getElementById('modal-tasks');
        const index = tasksList.children.length;
        const li = document.createElement('li');
        li.className = 'task-edit-item';
        li.innerHTML = `
            <input type="text" class="edit-input" placeholder="New task" data-index="${index}">
            <button class="edit-btn delete" onclick="ScheduleModule.removeModalTask(${index})">🗑️</button>
        `;
        tasksList.appendChild(li);
    },

    removeModalTask(index) {
        const tasksList = document.getElementById('modal-tasks');
        const items = Array.from(tasksList.children);
        if (items[index]) {
            items[index].remove();
        }
    },

    saveScheduleItem() {
        const time = document.getElementById('modal-time').value;
        const name = document.getElementById('modal-name').value;
        const taskInputs = document.querySelectorAll('#modal-tasks input');
        const tasks = Array.from(taskInputs).map(input => input.value).filter(v => v.trim());
        
        const days = [];
        ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach((dayName, idx) => {
            const dayValue = idx === 6 ? 0 : idx + 1;
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
        
        const schedule = StateManager.getSchedule(false);
        if (StateManager.state.modalData.type === 'edit') {
            schedule[StateManager.state.modalData.index].time = time;
            schedule[StateManager.state.modalData.index].name = name;
            schedule[StateManager.state.modalData.index].tasks = tasks;
            schedule[StateManager.state.modalData.index].days = days;
        } else {
            schedule.push({
                id: StateManager.state.modalData.item.id,
                time,
                name,
                tasks,
                days
            });
        }
        
        schedule.sort((a, b) => {
            const timeA = StateManager.convertTimeToMinutes(a.time);
            const timeB = StateManager.convertTimeToMinutes(b.time);
            return timeA - timeB;
        });
        
        saveData();
        this.closeModal();
        if (window.UICore) {
            UICore.updateUI();
        }
    },

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        StateManager.state.modalData = null;
    }
};

// ========================================
// CHARACTER MODULE
// ========================================
const CharacterModule = {
    renderCharacterSections() {
        const dayData = StateManager.getDayData();
        const container = document.getElementById('character-sections');
        const characterValues = StateManager.getCharacterValues();
        const isEditMode = StateManager.state.editMode;
        
        // Safety check
        if (!container) {
            console.error('❌ character-sections container not found');
            return;
        }
        
        if (!characterValues || characterValues.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: #6b7280;">No character values defined</p>';
            return;
        }
        
        container.innerHTML = characterValues.map((section, index) => {
            // Ensure categoryMultipliers exists and has this category
            if (!dayData.categoryMultipliers) {
                dayData.categoryMultipliers = {};
            }
            const mult = dayData.categoryMultipliers[section.id] !== undefined 
                ? dayData.categoryMultipliers[section.id] 
                : 1.0;
            
            // Ensure characterNotes exists
            if (!dayData.characterNotes) {
                dayData.characterNotes = {};
            }
            
            return `
            <div class="character-section">
                <h3>${section.category}</h3>
                <ul class="character-list">
                    ${section.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <div style="margin-bottom: 12px;">
                    <label style="font-size: 12px; margin-bottom: 8px;">Growth Rating</label>
                    <div class="rating-buttons">
                        <button 
                            class="rating-btn level-1 ${mult === 1.0 ? 'active' : ''}" 
                            onclick="CharacterModule.setCategoryMultiplier('${section.id}', 1.0)">
                            Starting
                        </button>
                        <button 
                            class="rating-btn level-2 ${mult === 1.5 ? 'active' : ''}" 
                            onclick="CharacterModule.setCategoryMultiplier('${section.id}', 1.5)">
                            Progress
                        </button>
                        <button 
                            class="rating-btn level-3 ${mult === 2.0 ? 'active' : ''}" 
                            onclick="CharacterModule.setCategoryMultiplier('${section.id}', 2.0)">
                            Excelling
                        </button>
                    </div>
                </div>
                <textarea 
                    rows="2" 
                    placeholder="Notes about this area..."
                    onchange="CharacterModule.updateCharacterNotes('${section.id}', this.value)"
                >${dayData.characterNotes[section.id] || ''}</textarea>
                ${isEditMode ? `
                    <div class="edit-controls" style="margin-top: 8px;">
                        <button class="edit-btn" onclick="CharacterModule.editCharacterCategory(${index})">✏️ Edit Category</button>
                        <button class="edit-btn delete" onclick="CharacterModule.deleteCharacterCategory(${index})">🗑️ Delete</button>
                    </div>
                ` : ''}
            </div>
        `}).join('');
        
        if (isEditMode) {
            container.innerHTML += `
                <button class="add-item-btn" onclick="CharacterModule.addCharacterCategory()">+ Add Growth Area</button>
            `;
        }
    },

    setCategoryMultiplier(categoryId, value) {
        const dayData = StateManager.getDayData();
        dayData.categoryMultipliers[categoryId] = value;
        saveData();
        if (window.UICore) {
            UICore.updateUI();
        }
    },

    updateCharacterNotes(categoryId, notes) {
        const dayData = StateManager.getDayData();
        dayData.characterNotes[categoryId] = notes;
        saveData();
    },

    updateNotes(notes) {
        const dayData = StateManager.getDayData();
        dayData.notes = notes;
        saveData();
    },

    editCharacterCategory(index) {
        const categories = StateManager.getCharacterValues();
        StateManager.state.modalData = { 
            type: 'edit', 
            index, 
            item: JSON.parse(JSON.stringify(categories[index])) 
        };
        
        document.getElementById('modal-character-category').value = categories[index].category;
        
        const itemsList = document.getElementById('modal-character-items');
        itemsList.innerHTML = categories[index].items.map((item, i) => `
            <li class="task-edit-item">
                <input type="text" class="edit-input" value="${item}" data-index="${i}">
                <button class="edit-btn delete" onclick="CharacterModule.removeModalCharacterItem(${i})">🗑️</button>
            </li>
        `).join('');
        
        document.getElementById('character-modal').classList.add('active');
    },

    addCharacterCategory() {
        const categories = StateManager.getCharacterValues();
        const newId = 'category_' + Date.now();
        StateManager.state.modalData = { 
            type: 'add', 
            item: { id: newId, category: '', weight: 0.25, items: [] } 
        };
        
        document.getElementById('modal-character-category').value = '';
        document.getElementById('modal-character-items').innerHTML = '';
        document.getElementById('character-modal').classList.add('active');
    },

    deleteCharacterCategory(index) {
        if (confirm('Delete this character category?')) {
            const categories = StateManager.getCharacterValues();
            categories.splice(index, 1);
            saveData();
            if (window.UICore) {
                UICore.updateUI();
            }
        }
    },

    addModalCharacterItem() {
        const itemsList = document.getElementById('modal-character-items');
        const index = itemsList.children.length;
        const li = document.createElement('li');
        li.className = 'task-edit-item';
        li.innerHTML = `
            <input type="text" class="edit-input" placeholder="New item" data-index="${index}">
            <button class="edit-btn delete" onclick="CharacterModule.removeModalCharacterItem(${index})">🗑️</button>
        `;
        itemsList.appendChild(li);
    },

    removeModalCharacterItem(index) {
        const itemsList = document.getElementById('modal-character-items');
        const items = Array.from(itemsList.children);
        if (items[index]) {
            items[index].remove();
        }
    },

    saveCharacterCategory() {
        const category = document.getElementById('modal-character-category').value;
        const itemInputs = document.querySelectorAll('#modal-character-items input');
        const items = Array.from(itemInputs).map(input => input.value).filter(v => v.trim());
        
        if (!category) {
            alert('Please enter a category name');
            return;
        }
        
        const categories = StateManager.getCharacterValues();
        if (StateManager.state.modalData.type === 'edit') {
            categories[StateManager.state.modalData.index].category = category;
            categories[StateManager.state.modalData.index].items = items;
        } else {
            categories.push({
                id: StateManager.state.modalData.item.id,
                category,
                weight: StateManager.state.modalData.item.weight,
                items
            });
        }
        
        saveData();
        this.closeModal();
        if (window.UICore) {
            UICore.updateUI();
        }
    },

    renderWeeklyChores() {
        const dayData = StateManager.getDayData();
        const weeklyChoresData = PointsModule.getWeeklyChoresData();
        const choresCompletion = PointsModule.calculateChoresCompletion();
        const chores = StateManager.getWeeklyChores();
        const isEditMode = StateManager.state.editMode;
        
        const weekRange = document.getElementById('week-range');
        if (weekRange) {
            weekRange.textContent = StateManager.getWeekRangeDisplay(StateManager.state.currentDate);
        }
        
        const badge = document.getElementById('chores-completion-badge');
        if (badge) {
            badge.innerHTML = `
                <div class="completion-badge ${choresCompletion.isComplete ? 'complete' : 'incomplete'}">
                    ${choresCompletion.completed} / ${choresCompletion.total} Complete (${choresCompletion.percentage}%)
                    ${choresCompletion.isComplete ? '🎉 5x BONUS ACTIVE!' : ''}
                </div>
            `;
        }
        
        const list = document.getElementById('weekly-chores-list');
        if (!list) return;
        
        list.innerHTML = chores.map((chore, index) => {
            const isCompleteThisWeek = weeklyChoresData[chore.id];
            
            return `
                <div class="chore-item ${isCompleteThisWeek ? 'completed' : ''}" onclick="CharacterModule.toggleWeeklyChore('${chore.id}')">
                    <div class="chore-name">${chore.name}</div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <div class="checkbox ${isCompleteThisWeek ? 'checked' : ''}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                                <path d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        ${isEditMode ? `
                            <button class="edit-btn" onclick="event.stopPropagation(); CharacterModule.editChore(${index})">✏️</button>
                            <button class="edit-btn delete" onclick="event.stopPropagation(); CharacterModule.deleteChore(${index})">🗑️</button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        if (isEditMode) {
            list.innerHTML += `
                <button class="add-item-btn" onclick="CharacterModule.addChore()">+ Add Responsibility</button>
            `;
        }
    },

    toggleWeeklyChore(choreId) {
        const dayData = StateManager.getDayData();
        dayData.weeklyChores[choreId] = !dayData.weeklyChores[choreId];
        saveData();
        if (window.UICore) {
            UICore.updateUI();
        }
    },

    editChore(index) {
        const chores = StateManager.getWeeklyChores();
        StateManager.state.modalData = { 
            type: 'edit', 
            index, 
            item: JSON.parse(JSON.stringify(chores[index])) 
        };
        
        document.getElementById('modal-chore-name').value = chores[index].name;
        document.getElementById('chore-modal').classList.add('active');
    },

    addChore() {
        const chores = StateManager.getWeeklyChores();
        const newId = 'chore_' + Date.now();
        StateManager.state.modalData = { 
            type: 'add', 
            item: { id: newId, name: '' } 
        };
        
        document.getElementById('modal-chore-name').value = '';
        document.getElementById('chore-modal').classList.add('active');
    },

    deleteChore(index) {
        const chores = StateManager.getWeeklyChores();
        const goalName = chores[index].name;
        
        StateManager.state.deleteGoalIndex = index;
        
        document.getElementById('delete-goal-name').textContent = `Delete "${goalName}"?`;
        document.getElementById('delete-goal-confirm-modal').classList.add('active');
    },

    closeDeleteGoalConfirm() {
        document.getElementById('delete-goal-confirm-modal').classList.remove('active');
        delete StateManager.state.deleteGoalIndex;
    },

    confirmDeleteGoal() {
        if (StateManager.state.deleteGoalIndex === undefined) return;
        
        const chores = StateManager.getWeeklyChores();
        chores.splice(StateManager.state.deleteGoalIndex, 1);
        StateManager.getCurrentChild().weeklyChores = chores;
        
        saveData();
        
        document.getElementById('delete-goal-confirm-modal').classList.remove('active');
        delete StateManager.state.deleteGoalIndex;
        
        if (window.UICore) {
            UICore.updateUI();
        }
    },

    saveChore() {
        const name = document.getElementById('modal-chore-name').value;
        
        if (!name) {
            alert('Please enter a chore name');
            return;
        }
        
        const chores = StateManager.getWeeklyChores();
        if (StateManager.state.modalData.type === 'edit') {
            chores[StateManager.state.modalData.index].name = name;
        } else {
            chores.push({
                id: StateManager.state.modalData.item.id,
                name
            });
        }
        
        saveData();
        this.closeModal();
        if (window.UICore) {
            UICore.updateUI();
        }
    },

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        StateManager.state.modalData = null;
    }
};

// ... (continuing in next message due to length)
// ========================================
// PROFILE MODULE
// ========================================
const ProfileModule = {
    openProfileModal() {
        const child = StateManager.getCurrentChild();
        
        document.getElementById('modal-profile-name').value = child.name;
        
        this.renderTrackerList(StateManager.state.currentChild);
        
        const deleteBtn = document.getElementById('delete-child-btn');
        if (deleteBtn) {
            deleteBtn.style.display = StateManager.state.children.length > 1 ? 'block' : 'none';
        }
        
        document.getElementById('crop-area').style.display = 'none';
        document.getElementById('upload-area').style.display = 'block';
        document.getElementById('crop-container').classList.remove('active');
        
        const grid = document.getElementById('color-palette-grid');
        grid.innerHTML = Object.entries(CONFIG.COLOR_PALETTES).map(([key, palette]) => `
            <div class="color-palette-option ${child.colorPalette === key ? 'selected' : ''}" onclick="ProfileModule.selectColorPalette('${key}')">
                <div class="color-palette-preview">
                    <div class="color-palette-dot" style="background: linear-gradient(135deg, ${palette.bgGradient1}, ${palette.bgGradient2})"></div>
                    <div class="color-palette-dot" style="background: ${palette.statCard}"></div>
                    <div class="color-palette-dot" style="background: ${palette.profileButton}"></div>
                </div>
                <div class="color-palette-name">${palette.name}</div>
            </div>
        `).join('');
        
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
    },

    saveProfile() {
        const name = document.getElementById('modal-profile-name').value;
        
        if (!name) {
            alert('Please enter a name');
            return;
        }
        
        const child = StateManager.getCurrentChild();
        child.name = name;
        
        if (StateManager.state.tempPhoto !== undefined && StateManager.state.tempPhoto !== null) {
            child.photo = StateManager.state.tempPhoto;
        }
        
        if (StateManager.state.tempPalette) {
            child.colorPalette = StateManager.state.tempPalette;
        }
        
        delete StateManager.state.tempPhoto;
        delete StateManager.state.tempPalette;
        
        if (window.saveData) {
            window.saveData();
        }
        
        this.closeModal();
        this.updateSidebarAvatars();
        this.updateTrackerButtons();
        if (window.UICore) {
            UICore.applyColorPalette();
            UICore.updateUI();
        }
    },

    selectColorPalette(paletteKey) {
        document.querySelectorAll('.color-palette-option').forEach(option => {
            option.classList.remove('selected');
        });
        event.target.closest('.color-palette-option').classList.add('selected');
        
        StateManager.state.tempPalette = paletteKey;
    },

    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('upload-area').style.display = 'none';
                document.getElementById('crop-area').style.display = 'block';
                
                const img = document.getElementById('crop-image');
                img.src = e.target.result;
                StateManager.state.cropData.image = e.target.result;
                
                img.onload = function() {
                    const container = document.getElementById('crop-container');
                    container.classList.add('active');
                    
                    const imgWidth = img.clientWidth;
                    const imgHeight = img.clientHeight;
                    const cropSize = Math.min(imgWidth, imgHeight) * 0.7;
                    
                    StateManager.state.cropData.width = cropSize;
                    StateManager.state.cropData.height = cropSize;
                    StateManager.state.cropData.x = (imgWidth - cropSize) / 2;
                    StateManager.state.cropData.y = (imgHeight - cropSize) / 2;
                    
                    ProfileModule.updateCropOverlay();
                    ProfileModule.initCropHandlers();
                };
            };
            reader.readAsDataURL(file);
        }
    },

    updateCropOverlay() {
        const overlay = document.getElementById('crop-overlay');
        overlay.style.left = StateManager.state.cropData.x + 'px';
        overlay.style.top = StateManager.state.cropData.y + 'px';
        overlay.style.width = StateManager.state.cropData.width + 'px';
        overlay.style.height = StateManager.state.cropData.height + 'px';
    },

    initCropHandlers() {
        const overlay = document.getElementById('crop-overlay');
        const handles = overlay.querySelectorAll('.crop-handle');
        
        overlay.addEventListener('mousedown', function(e) {
            if (e.target === overlay) {
                StateManager.state.cropData.isDragging = true;
                StateManager.state.cropData.startX = e.clientX - StateManager.state.cropData.x;
                StateManager.state.cropData.startY = e.clientY - StateManager.state.cropData.y;
                e.preventDefault();
            }
        });
        
        handles.forEach(handle => {
            handle.addEventListener('mousedown', function(e) {
                StateManager.state.cropData.isResizing = true;
                StateManager.state.cropData.resizeHandle = handle.className.split(' ')[1];
                StateManager.state.cropData.startX = e.clientX;
                StateManager.state.cropData.startY = e.clientY;
                StateManager.state.cropData.startCropX = StateManager.state.cropData.x;
                StateManager.state.cropData.startCropY = StateManager.state.cropData.y;
                StateManager.state.cropData.startCropWidth = StateManager.state.cropData.width;
                StateManager.state.cropData.startCropHeight = StateManager.state.cropData.height;
                e.stopPropagation();
                e.preventDefault();
            });
        });
        
        document.addEventListener('mousemove', function(e) {
            if (StateManager.state.cropData.isDragging) {
                const img = document.getElementById('crop-image');
                let newX = e.clientX - StateManager.state.cropData.startX;
                let newY = e.clientY - StateManager.state.cropData.startY;
                
                newX = Math.max(0, Math.min(newX, img.clientWidth - StateManager.state.cropData.width));
                newY = Math.max(0, Math.min(newY, img.clientHeight - StateManager.state.cropData.height));
                
                StateManager.state.cropData.x = newX;
                StateManager.state.cropData.y = newY;
                ProfileModule.updateCropOverlay();
            } else if (StateManager.state.cropData.isResizing) {
                const img = document.getElementById('crop-image');
                const dx = e.clientX - StateManager.state.cropData.startX;
                const dy = e.clientY - StateManager.state.cropData.startY;
                const handle = StateManager.state.cropData.resizeHandle;
                
                let newX = StateManager.state.cropData.startCropX;
                let newY = StateManager.state.cropData.startCropY;
                let newWidth = StateManager.state.cropData.startCropWidth;
                let newHeight = StateManager.state.cropData.startCropHeight;
                
                if (handle.includes('n')) {
                    newY = StateManager.state.cropData.startCropY + dy;
                    newHeight = StateManager.state.cropData.startCropHeight - dy;
                }
                if (handle.includes('s')) {
                    newHeight = StateManager.state.cropData.startCropHeight + dy;
                }
                if (handle.includes('w')) {
                    newX = StateManager.state.cropData.startCropX + dx;
                    newWidth = StateManager.state.cropData.startCropWidth - dx;
                }
                if (handle.includes('e')) {
                    newWidth = StateManager.state.cropData.startCropWidth + dx;
                }
                
                const minSize = 50;
                if (newWidth >= minSize && newX >= 0 && newX + newWidth <= img.clientWidth) {
                    StateManager.state.cropData.x = newX;
                    StateManager.state.cropData.width = newWidth;
                }
                if (newHeight >= minSize && newY >= 0 && newY + newHeight <= img.clientHeight) {
                    StateManager.state.cropData.y = newY;
                    StateManager.state.cropData.height = newHeight;
                }
                
                ProfileModule.updateCropOverlay();
            }
        });
        
        document.addEventListener('mouseup', function() {
            StateManager.state.cropData.isDragging = false;
            StateManager.state.cropData.isResizing = false;
        });
    },

    applyCrop() {
        const img = document.getElementById('crop-image');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const scaleX = img.naturalWidth / img.clientWidth;
        const scaleY = img.naturalHeight / img.clientHeight;
        
        const cropWidth = StateManager.state.cropData.width * scaleX;
        const cropHeight = StateManager.state.cropData.height * scaleY;
        
        const MAX_SIZE = 400;
        let finalWidth = cropWidth;
        let finalHeight = cropHeight;
        
        if (cropWidth > MAX_SIZE || cropHeight > MAX_SIZE) {
            const scale = MAX_SIZE / Math.max(cropWidth, cropHeight);
            finalWidth = cropWidth * scale;
            finalHeight = cropHeight * scale;
        }
        
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        
        ctx.drawImage(
            img,
            StateManager.state.cropData.x * scaleX,
            StateManager.state.cropData.y * scaleY,
            cropWidth,
            cropHeight,
            0,
            0,
            finalWidth,
            finalHeight
        );
        
        const croppedImage = canvas.toDataURL('image/jpeg', 0.7);
        
        if (croppedImage.length > 900000) {
            alert('Image is still too large after compression. Please try a smaller crop area or a different photo.');
            return;
        }
        
        const photoContainer = document.getElementById('photo-preview-container');
        photoContainer.innerHTML = `<img src="${croppedImage}" class="photo-preview" style="max-width: 200px; border-radius: 50%;">`;
        document.getElementById('remove-photo-btn').style.display = 'inline-block';
        StateManager.state.tempPhoto = croppedImage;
        
        document.getElementById('crop-area').style.display = 'none';
        document.getElementById('upload-area').style.display = 'block';
        document.getElementById('crop-container').classList.remove('active');
    },

    cancelCrop() {
        document.getElementById('photo-upload').value = '';
        document.getElementById('crop-area').style.display = 'none';
        document.getElementById('upload-area').style.display = 'block';
        document.getElementById('crop-container').classList.remove('active');
    },

    removePhoto() {
        const photoContainer = document.getElementById('photo-preview-container');
        photoContainer.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 8px;">📷</div>
            <div style="color: #6b7280; font-size: 14px;">Click to upload photo</div>
            <div style="color: #9ca3af; font-size: 12px; margin-top: 4px;">JPG, PNG or GIF</div>
        `;
        document.getElementById('remove-photo-btn').style.display = 'none';
        document.getElementById('photo-upload').value = '';
        StateManager.state.tempPhoto = null;
        
        document.getElementById('crop-area').style.display = 'none';
        document.getElementById('upload-area').style.display = 'block';
    },

    addNewChild() {
        const childNum = Object.keys(StateManager.state.data).length + 1;
        const childId = 'child' + childNum;
        
        StateManager.createChild(childId);
        StateManager.state.currentChild = childId;
        
        saveData();
        this.updateSidebarAvatars();
        if (window.UICore) {
            UICore.updateUI();
            UICore.applyColorPalette();
        }
        
        this.openProfileModal();
    },

    deleteCurrentChild() {
        if (StateManager.state.children.length <= 1) {
            alert('Cannot delete the only family member! You must have at least one profile.');
            return;
        }
        
        const child = StateManager.getCurrentChild();
        
        document.getElementById('delete-child-name').textContent = `Delete "${child.name}"?`;
        document.getElementById('delete-confirm-modal').classList.add('active');
    },

    closeDeleteConfirm() {
        document.getElementById('delete-confirm-modal').classList.remove('active');
    },

    confirmDeleteChild() {
        const currentId = StateManager.state.currentChild;
        StateManager.deleteChild(currentId);
        
        StateManager.state.currentChild = StateManager.state.children[0];
        
        saveData();
        
        document.getElementById('delete-confirm-modal').classList.remove('active');
        this.closeModal();
        
        this.updateSidebarAvatars();
        if (window.UICore) {
            UICore.updateUI();
            UICore.applyColorPalette();
        }
    },

    updateSidebarAvatars() {
        if (window.renderSidebarAvatars) {
            renderSidebarAvatars();
        }
    },

    renderTrackerList(childId) {
        const child = StateManager.getChild(childId);
        const container = document.getElementById('tracker-list-container');
        
        if (!child.trackers || child.trackers.length === 0) {
            container.innerHTML = '<p style="color: #6b7280; font-size: 14px; font-style: italic;">No trackers added yet. Click button below to add your first tracker.</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 8px;">';
        child.trackers.forEach(tracker => {
            const template = window.TrackerTemplates ? TrackerTemplates.getTemplateList().find(t => t.id === tracker.templateId) : null;
            const icon = template ? template.icon : '📊';
            
            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f3f4f6; border-radius: 8px;">
                    <span style="font-weight: 500;">${icon} ${tracker.templateName}</span>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="ProfileModule.editTrackerConfig('${tracker.id}')" style="padding: 6px 12px; background: #6366f1; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer;">⚙️ Edit</button>
                        <button onclick="ProfileModule.removeTrackerPrompt('${tracker.id}')" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer;">×</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    editTrackerConfig(trackerId) {
        this.closeModal();
        if (window.openSpecificTracker) {
            openSpecificTracker(trackerId);
        }
    },

    removeTrackerPrompt(trackerId) {
        const child = StateManager.getCurrentChild();
        const tracker = child.trackers ? child.trackers.find(t => t.id === trackerId) : null;
        
        if (!tracker) return;
        
        if (confirm(`Remove "${tracker.templateName}" tracker?\n\nAll data for this tracker will be permanently deleted. This cannot be undone.`)) {
            const index = child.trackers.findIndex(t => t.id === trackerId);
            if (index > -1) {
                child.trackers.splice(index, 1);
                
                if (window.saveData) {
                    window.saveData();
                }
                
                this.renderTrackerList(StateManager.state.currentChild);
                this.updateTrackerButtons();
            }
        }
    },

    updateTrackerButtons() {
        if (window.renderSidebarTrackers) {
            renderSidebarTrackers();
        }
    },

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        StateManager.state.modalData = null;
    }
};

// ========================================
// UI CORE - Complete object definition
// ========================================

const UICore = {
    updateUI() {
        const child = StateManager.getCurrentChild();
        if (!child) {
            console.warn('⚠️ No current child selected');
            return;
        }

        // Update header
        const headerName = document.getElementById('header-member-name');
        if (headerName) {
            headerName.textContent = child.name || 'Family Member';
        }

        const headerAvatar = document.getElementById('header-member-avatar');
        if (headerAvatar) {
            if (child.photo) {
                headerAvatar.innerHTML = `<img src="${child.photo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
            } else {
                headerAvatar.textContent = (child.name || 'FM').charAt(0).toUpperCase();
            }
        }

        // Update date display
        const datePicker = document.getElementById('date-picker');
        if (datePicker) {
            datePicker.value = StateManager.state.currentDate;
        }

        // Calculate points
        const dailyPoints = PointsModule.calculatePoints(StateManager.state.currentChild, StateManager.state.currentDate, false);
        const weeklyPoints = PointsModule.calculateWeeklyTotal();

        // Update points displays
        const basePointsEl = document.getElementById('base-points');
        if (basePointsEl) {
            basePointsEl.textContent = child.pointsBalance || 0;
        }

        const dailyPercentEl = document.getElementById('daily-percent');
        if (dailyPercentEl) {
            const dailyGoal = PointsModule.getDailyGoal();
            const dailyPercent = dailyGoal > 0 ? Math.round((dailyPoints.dailyTotal / dailyGoal) * 100) : 0;
            dailyPercentEl.textContent = dailyPercent + '%';
        }

        const weeklyPercentEl = document.getElementById('weekly-percent');
        if (weeklyPercentEl) {
            const weeklyGoal = PointsModule.getWeeklyGoal();
            const weeklyPercent = weeklyGoal > 0 ? Math.round((weeklyPoints / weeklyGoal) * 100) : 0;
            weeklyPercentEl.textContent = weeklyPercent + '%';
        }

        // Render schedule and character sections
        if (window.ScheduleModule) {
            ScheduleModule.renderSchedule();
            ScheduleModule.renderFocusedScheduleItem();
        }

        if (window.CharacterModule) {
            CharacterModule.renderCharacterSections();
            CharacterModule.renderWeeklyChores();
        }

        if (window.RewardsModule) {
            RewardsModule.renderRewardsStore();
        }

        console.log('✅ UI updated successfully');
    },

    selectChild(childId) {
        if (!StateManager.state.children.includes(childId)) {
            console.error('❌ Invalid child ID:', childId);
            return;
        }

        StateManager.state.currentChild = childId;
        
        if (window.saveData) {
            saveData();
        }

        this.applyColorPalette();
        this.updateUI();

        console.log('✅ Selected child:', childId);
    },

    applyColorPalette() {
        const child = StateManager.getCurrentChild();
        if (!child) {
            console.warn('⚠️ No current child for color palette');
            return;
        }

        const palette = child.colorPalette || 'purple';
        const root = document.documentElement;
        
        applyTheme(palette, root);

        console.log('✅ Applied color palette:', palette);
    }
};

// ========================================
// PLACEHOLDER FUNCTIONS (Firebase overrides these)
// ========================================
function saveData() {
    console.log('saveData() called - should be overridden by Firebase');
}

function loadData() {
    console.log('loadData() called - should be overridden by Firebase');
}

// ========================================
// REWARDS MODULE
// ========================================
const RewardsModule = {
    renderRewardsStore() {
        const child = StateManager.getCurrentChild();
        if (!child) return;
        
        const container = document.getElementById('rewards-grid');
        const balanceEl = document.getElementById('rewards-balance');
        
        if (!container || !balanceEl) {
            console.warn('⚠️ Rewards UI elements not found');
            return;
        }
        
        // Initialize rewards array if it doesn't exist
        if (!child.rewards) {
            child.rewards = [];
        }
        
        // Update balance display
        balanceEl.textContent = child.pointsBalance || 0;
        
        const isEditMode = StateManager.state.editMode;
        
        // Group rewards by category
        const categories = {
            'privilege': { name: 'Privileges', icon: '🎯', rewards: [] },
            'experience': { name: 'Experiences', icon: '🎉', rewards: [] },
            'item': { name: 'Items', icon: '🎁', rewards: [] },
            'quality-time': { name: 'Quality Time', icon: '💝', rewards: [] },
            'family-time': { name: 'Family Time', icon: '👨‍👩‍👧‍👦', rewards: [] },
            'custom': { name: 'Other', icon: '⭐', rewards: [] }
        };
        
        // Sort rewards into categories
        child.rewards.forEach(reward => {
            const category = reward.category || 'custom';
            if (categories[category]) {
                categories[category].rewards.push(reward);
            }
        });
        
        // Render rewards by category
        let html = '';
        
        Object.entries(categories).forEach(([categoryId, categoryData]) => {
            if (categoryData.rewards.length > 0) {
                html += `
                    <div class="rewards-category-header">
                        <span>${categoryData.icon} ${categoryData.name}</span>
                        <span style="font-size: 12px; color: #6b7280;">(${categoryData.rewards.length})</span>
                    </div>
                `;
                
                categoryData.rewards.forEach(reward => {
                    const canAfford = child.pointsBalance >= reward.cost;
                    const isPurchased = reward.purchased || false;
                    
                    html += `
                        <div class="reward-card ${!canAfford && !isPurchased ? 'disabled' : ''} ${isPurchased ? 'purchased' : ''}"
                             onclick="${!isEditMode && !isPurchased && canAfford ? `RewardsModule.purchaseReward('${reward.id}')` : ''}">
                            ${isPurchased ? '<div class="purchased-badge">✓ EARNED</div>' : ''}
                            <div class="reward-icon">${this.getCategoryIcon(reward.category)}</div>
                            <div class="reward-name">${reward.name}</div>
                            <div class="reward-cost">
                                <span style="font-size: 20px; font-weight: 700;">${reward.cost}</span>
                                <span style="font-size: 12px; color: #6b7280;">points</span>
                            </div>
                            ${!isEditMode && !isPurchased ? `
                                <button class="reward-purchase-btn ${!canAfford ? 'disabled' : ''}"
                                        onclick="event.stopPropagation(); RewardsModule.purchaseReward('${reward.id}')">
                                    ${canAfford ? '🎁 Claim Reward' : '🔒 Not Enough Points'}
                                </button>
                            ` : ''}
                            ${isEditMode ? `
                                <div class="reward-edit-controls">
                                    <button class="edit-btn" onclick="event.stopPropagation(); RewardsModule.editReward('${reward.id}')">✏️ Edit</button>
                                    <button class="edit-btn delete" onclick="event.stopPropagation(); RewardsModule.deleteReward('${reward.id}')">🗑️ Delete</button>
                                </div>
                            ` : ''}
                        </div>
                    `;
                });
            }
        });
        
        // Add "Add Reward" button in edit mode
        if (isEditMode) {
            html += `
                <button class="add-reward-btn" onclick="RewardsModule.addReward()">
                    + Add Reward
                </button>
            `;
        }
        
        // Show message if no rewards
        if (child.rewards.length === 0) {
            html = '<p style="padding: 40px; text-align: center; color: #6b7280; grid-column: 1 / -1;">No rewards yet. Click Edit to add rewards!</p>';
        }
        
        container.innerHTML = html;
    },
    
    getCategoryIcon(category) {
        const icons = {
            'privilege': '🎯',
            'experience': '🎉',
            'item': '🎁',
            'quality-time': '💝',
            'family-time': '👨‍👩‍👧‍👦',
            'custom': '⭐'
        };
        return icons[category] || '⭐';
    },
    
    purchaseReward(rewardId) {
        const child = StateManager.getCurrentChild();
        const reward = child.rewards.find(r => r.id === rewardId);
        
        if (!reward) return;
        
        if (reward.purchased) {
            alert('This reward has already been claimed!');
            return;
        }
        
        if (child.pointsBalance < reward.cost) {
            alert(`Not enough points! You need ${reward.cost} points but only have ${child.pointsBalance}.`);
            return;
        }
        
        if (confirm(`Claim "${reward.name}" for ${reward.cost} points?`)) {
            // Deduct points
            if (child.pointsSpent === undefined) {
                child.pointsSpent = 0;
            }
            child.pointsSpent += reward.cost;
            
            // Mark as purchased
            reward.purchased = true;
            reward.purchasedDate = new Date().toISOString();
            
            // Track in purchase history
            if (!child.purchaseHistory) {
                child.purchaseHistory = [];
            }
            child.purchaseHistory.push({
                rewardId: reward.id,
                rewardName: reward.name,
                cost: reward.cost,
                date: reward.purchasedDate
            });
            
            saveData();
            UICore.updateUI();
            
            alert(`🎉 Congratulations!\n\nYou claimed "${reward.name}"!\n\nNew balance: ${child.pointsBalance - reward.cost} points`);
        }
    },
    
    addReward() {
        StateManager.state.modalData = {
            type: 'add',
            reward: {
                id: 'reward_' + Date.now(),
                name: '',
                cost: 100,
                category: 'privilege',
                purchased: false
            }
        };
        
        document.getElementById('modal-reward-name').value = '';
        document.getElementById('modal-reward-cost').value = 100;
        document.getElementById('modal-reward-category').value = 'privilege';
        
        document.getElementById('reward-modal').classList.add('active');
    },
    
    editReward(rewardId) {
        const child = StateManager.getCurrentChild();
        const reward = child.rewards.find(r => r.id === rewardId);
        
        if (!reward) return;
        
        StateManager.state.modalData = {
            type: 'edit',
            reward: JSON.parse(JSON.stringify(reward))
        };
        
        document.getElementById('modal-reward-name').value = reward.name;
        document.getElementById('modal-reward-cost').value = reward.cost;
        document.getElementById('modal-reward-category').value = reward.category || 'privilege';
        
        document.getElementById('reward-modal').classList.add('active');
    },
    
    deleteReward(rewardId) {
        const child = StateManager.getCurrentChild();
        const reward = child.rewards.find(r => r.id === rewardId);
        
        if (!reward) return;
        
        if (confirm(`Delete "${reward.name}"?\n\nThis cannot be undone.`)) {
            child.rewards = child.rewards.filter(r => r.id !== rewardId);
            saveData();
            UICore.updateUI();
        }
    },
    
    saveReward() {
        const name = document.getElementById('modal-reward-name').value.trim();
        const cost = parseInt(document.getElementById('modal-reward-cost').value);
        const category = document.getElementById('modal-reward-category').value;
        
        if (!name) {
            alert('Please enter a reward name');
            return;
        }
        
        if (!cost || cost <= 0) {
            alert('Please enter a valid point cost');
            return;
        }
        
        const child = StateManager.getCurrentChild();
        
        if (StateManager.state.modalData.type === 'edit') {
            // Update existing reward
            const reward = child.rewards.find(r => r.id === StateManager.state.modalData.reward.id);
            if (reward) {
                reward.name = name;
                reward.cost = cost;
                reward.category = category;
            }
        } else {
            // Add new reward
            child.rewards.push({
                id: StateManager.state.modalData.reward.id,
                name: name,
                cost: cost,
                category: category,
                purchased: false
            });
        }
        
        saveData();
        this.closeModal();
        UICore.updateUI();
    },
    
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        StateManager.state.modalData = null;
    }
};

// ========================================
// GLOBAL EXPORTS
// ========================================
window.CONFIG = CONFIG;
window.StateManager = StateManager;
window.PointsModule = PointsModule;
window.ScheduleModule = ScheduleModule;
window.CharacterModule = CharacterModule;
window.ProfileModule = ProfileModule;
window.UICore = UICore;
window.RewardsModule = RewardsModule;
window.state = StateManager.state;
window.saveData = saveData;
window.loadData = loadData;

// Compatibility exports
window.calculatePoints = PointsModule.calculatePoints.bind(PointsModule);
window.calculateWeeklyTotal = PointsModule.calculateWeeklyTotal.bind(PointsModule);
window.calculateStreak = PointsModule.calculateStreak.bind(PointsModule);
window.calculateChoresCompletion = PointsModule.calculateChoresCompletion.bind(PointsModule);
window.getDailyGoal = PointsModule.getDailyGoal.bind(PointsModule);
window.getWeeklyGoal = PointsModule.getWeeklyGoal.bind(PointsModule);
window.getWeeklyChoresData = PointsModule.getWeeklyChoresData.bind(PointsModule);
window.getDayData = StateManager.getDayData.bind(StateManager);
window.getSchedule = StateManager.getSchedule.bind(StateManager);
window.getCharacterValues = StateManager.getCharacterValues.bind(StateManager);
window.getWeeklyChores = StateManager.getWeeklyChores.bind(StateManager);

// ========================================
// HTML CALLBACK FUNCTIONS
// ========================================

// Photo/Crop functions
function handlePhotoUpload(event) {
    ProfileModule.handlePhotoUpload(event);
}

function applyCrop() {
    ProfileModule.applyCrop();
}

function cancelCrop() {
    ProfileModule.cancelCrop();
}

function removePhoto() {
    ProfileModule.removePhoto();
}

// Modal functions
function closeModal() {
    ProfileModule.closeModal();
}

function saveProfile() {
    ProfileModule.saveProfile();
}

function closeDeleteConfirm() {
    ProfileModule.closeDeleteConfirm();
}

function confirmDeleteChild() {
    ProfileModule.confirmDeleteChild();
}

// Schedule functions
function addModalTask() {
    ScheduleModule.addModalTask();
}

function removeModalTask(index) {
    ScheduleModule.removeModalTask(index);
}

function saveScheduleItem() {
    ScheduleModule.saveScheduleItem();
}

// Character functions
function addModalCharacterItem() {
    CharacterModule.addModalCharacterItem();
}

function removeModalCharacterItem(index) {
    CharacterModule.removeModalCharacterItem(index);
}

function saveCharacterCategory() {
    CharacterModule.saveCharacterCategory();
}

function saveChore() {
    CharacterModule.saveChore();
}

function closeDeleteGoalConfirm() {
    CharacterModule.closeDeleteGoalConfirm();
}

function confirmDeleteGoal() {
    CharacterModule.confirmDeleteGoal();
}

// Rewards functions
function saveReward() {
    RewardsModule.saveReward();
}

// ========================================
// REWARDS TOGGLE FUNCTIONS (ONLY ONCE!)
// ========================================

function toggleRewardsSection() {
    const rewardsSection = document.querySelector('.rewards-section');
    const isRewardsVisible = rewardsSection && rewardsSection.style.display === 'block';
    
    if (isRewardsVisible) {
        showGoalsSection();
    } else {
        showRewardsSection();
    }
}

function showRewardsSection() {
    document.querySelectorAll('.goals-group:not(.rewards-section)').forEach(group => {
        group.style.display = 'none';
    });
    
    const rewardsSection = document.querySelector('.rewards-section');
    if (rewardsSection) {
        rewardsSection.style.display = 'block';
        if (window.RewardsModule) {
            RewardsModule.renderRewardsStore();
        }
    }
    
    updateRewardsButtonState(true);
}

function showGoalsSection() {
    const rewardsSection = document.querySelector('.rewards-section');
    if (rewardsSection) {
        rewardsSection.style.display = 'none';
    }
    
    document.querySelectorAll('.goals-group:not(.rewards-section)').forEach(group => {
        group.style.display = 'block';
    });
    
    updateRewardsButtonState(false);
}

function updateRewardsButtonState(isShowingRewards) {
    const buttons = document.querySelectorAll('.sidebar-btn');
    buttons.forEach(btn => {
        const btnText = btn.textContent || '';
        if (btnText.includes('Rewards') || btnText.includes('Back to Goals')) {
            if (isShowingRewards) {
                btn.style.background = 'rgba(99, 102, 241, 0.1)';
                btn.style.borderLeft = '3px solid #6366f1';
                btn.innerHTML = '<span class="sidebar-icon">←</span><span>Back to Goals</span>';
                btn.onclick = toggleRewardsSection;
            } else {
                btn.style.background = '';
                btn.style.borderLeft = '';
                btn.innerHTML = `<div class="sidebar-btn-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </div>
                <span>Rewards</span>`;
                btn.onclick = toggleRewardsSection;
            }
        }
    });
}
// ============================================
// FAMILY SETTINGS MODULE
// ============================================
const FamilySettingsModule = {
    openFamilySettings() {
        const modal = document.getElementById('family-settings-modal');
        if (!modal) {
            console.error('Family settings modal not found');
            return;
        }
        
        // Update family name
        const familyNameEl = document.getElementById('settings-family-name');
        if (familyNameEl) {
            familyNameEl.textContent = StateManager.state.familyName || 'Your Family';
        }
        
        // Update family code
        const familyCodeEl = document.getElementById('settings-family-code');
        if (familyCodeEl) {
            familyCodeEl.textContent = StateManager.state.familyCode || 'XXXX-XXXX';
        }
        
        modal.style.display = 'flex';
    },
    
    closeModal() {
        const modal = document.getElementById('family-settings-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    },
    
    openAddMemberChoice() {
        // Close family settings modal
        this.closeModal();
        
        // Open add member choice modal
        const modal = document.getElementById('add-member-choice-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    },
    
    closeAddMemberChoice() {
        const modal = document.getElementById('add-member-choice-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    },
    
    addMemberWithWizard() {
        this.closeAddMemberChoice();
        
        // Check if wizard exists
        if (window.openWizard) {
            window.openWizard('add-member');
        } else {
            alert('Setup wizard is not available. Please use manual setup.');
            this.addMemberManually();
        }
    },
    
    addMemberManually() {
        this.closeAddMemberChoice();
        
        // Create a new child with default data
        const newChildId = 'child-' + Date.now();
        const newChild = {
            id: newChildId,
            name: 'New Member',
            emoji: '👤',
            schedule: [],
            weeklyChores: [],
            character: [],
            days: {},
            basePoints: 0,
            colorPalette: 'purple',
            trackers: []
        };
        
        // Add to state
        StateManager.state.childData[newChildId] = newChild;
        StateManager.state.children.push(newChildId);
        
        // Select the new child
        StateManager.state.currentChild = newChildId;
        
        // Save to Firebase
        StateManager.saveState();
        
        // Update UI
        UICore.updateUI();
        
        // Open profile modal to edit
        ProfileModule.openProfileModal();
        
        console.log('✅ New member created:', newChildId);
    },
    
    updateMemberWithWizard(childId) {
        // Check if wizard exists
        if (window.openWizard) {
            window.openWizard('update-member', childId);
        } else {
            alert('Setup wizard is not available yet.');
        }
    }
};

// Export to window
window.FamilySettingsModule = FamilySettingsModule;

console.log('✅ Family Tracker App (Multi-Family Support) loaded');
