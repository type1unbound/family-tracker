/**
 * STATE.JS - State Management
 * Manages application state and provides getters/setters
 */

const StateManager = {
    // Main state object
    state: {
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
        children: ['child1', 'child2'],
        data: {
            child1: { 
                name: 'Family Member 1',
                photo: null,
                colorPalette: 'lavender',
                pointsBalance: 0,
                pointsSpent: 0,
                trackers: [],
                days: {},
                schedule: JSON.parse(JSON.stringify(CONFIG.DEFAULT_SCHEDULE)),
                characterValues: JSON.parse(JSON.stringify(CONFIG.DEFAULT_CHARACTER_VALUES)),
                weeklyChores: JSON.parse(JSON.stringify(CONFIG.DEFAULT_WEEKLY_CHORES))
            },
            child2: { 
                name: 'Family Member 2',
                photo: null,
                colorPalette: 'lavender',
                pointsBalance: 0,
                pointsSpent: 0,
                trackers: [],
                days: {},
                schedule: JSON.parse(JSON.stringify(CONFIG.DEFAULT_SCHEDULE)),
                characterValues: JSON.parse(JSON.stringify(CONFIG.DEFAULT_CHARACTER_VALUES)),
                weeklyChores: JSON.parse(JSON.stringify(CONFIG.DEFAULT_WEEKLY_CHORES))
            }
        }
    },

    // Get current child data
    getCurrentChild() {
        return this.state.data[this.state.currentChild];
    },

    // Get specific child data
    getChild(childId) {
        return this.state.data[childId];
    },

    // Get current date
    getCurrentDate() {
        return this.state.currentDate;
    },

    // Set current date
    setCurrentDate(date) {
        this.state.currentDate = date;
    },

    // Get current child's schedule
    getSchedule(filterByDay = true) {
        const schedule = this.getCurrentChild().schedule;
        
        // Migrate old items without days field
        schedule.forEach(item => {
            if (!item.days) {
                item.days = [0,1,2,3,4,5,6];
            }
        });
        
        // Sort by time
        schedule.sort((a, b) => {
            const timeA = this.convertTimeToMinutes(a.time);
            const timeB = this.convertTimeToMinutes(b.time);
            return timeA - timeB;
        });
        
        if (!filterByDay) {
            return schedule;
        }
        
        // Filter by current day of week
        const currentDate = new Date(this.state.currentDate + 'T00:00:00');
        const dayOfWeek = currentDate.getDay(); // 0=Sunday, 1=Monday, etc.
        
        return schedule.filter(item => item.days.includes(dayOfWeek));
    },

    // Helper: Convert time string to minutes
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

    // Get current child's character values
    getCharacterValues() {
        return this.getCurrentChild().characterValues;
    },

    // Get current child's weekly chores
    getWeeklyChores() {
        return this.getCurrentChild().weeklyChores;
    },

    // Get day data (creates if doesn't exist)
    getDayData() {
        const child = this.getCurrentChild();
        if (!child.days[this.state.currentDate]) {
            child.days[this.state.currentDate] = {
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
        const dayData = child.days[this.state.currentDate];
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
        
        return child.days[this.state.currentDate];
    },

    // Get week dates (Monday-Sunday)
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

    // Get week range display string
    getWeekRangeDisplay(date) {
        const dates = this.getWeekDates(date);
        const startDate = new Date(dates[0] + 'T00:00:00');
        const endDate = new Date(dates[dates.length - 1] + 'T00:00:00');
        
        const options = { month: 'short', day: 'numeric' };
        const start = startDate.toLocaleDateString('en-US', options);
        const end = endDate.toLocaleDateString('en-US', options);
        
        return `Week of ${start} - ${end}`;
    },

    // Create new child
    createChild(childId) {
        this.state.data[childId] = {
            name: 'Family Member ' + (this.state.children.length + 1),
            photo: null,
            colorPalette: 'lavender',
            pointsBalance: 0,
            pointsSpent: 0,
            trackers: [],
            days: {},
            schedule: JSON.parse(JSON.stringify(CONFIG.DEFAULT_SCHEDULE)),
            characterValues: JSON.parse(JSON.stringify(CONFIG.DEFAULT_CHARACTER_VALUES)),
            weeklyChores: JSON.parse(JSON.stringify(CONFIG.DEFAULT_WEEKLY_CHORES))
        };
        this.state.children.push(childId);
    },

    // Delete child
    deleteChild(childId) {
        this.state.children = this.state.children.filter(id => id !== childId);
        delete this.state.data[childId];
    }
};

// Placeholder save/load functions (will be overridden by Firebase)
function saveData() {
    console.log('💾 saveData() called - will be overridden by Firebase');
}

function loadData() {
    console.log('📥 loadData() called - will be overridden by Firebase');
}

// Make state available globally
window.state = StateManager.state;
window.StateManager = StateManager;
window.saveData = saveData;
window.loadData = loadData;
