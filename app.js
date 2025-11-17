// ========================================
// FAMILY ROUTINE & VALUES TRACKERS
// Consolidated Single-File Application
// ========================================

// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
    COLOR_PALETTES: {
        lavender: {
            name: 'Lavender Dreams',
            bgGradient1: '#a78bfa',
            bgGradient2: '#6366f1',
            statCard: '#4c1d95',
            profileButton: '#7c3aed'
        },
        peach: {
            name: 'Peach Blossom',
            bgGradient1: '#fda4af',
            bgGradient2: '#fb923c',
            statCard: '#9a3412',
            profileButton: '#f97316'
        },
        sage: {
            name: 'Sage Meadow',
            bgGradient1: '#86efac',
            bgGradient2: '#059669',
            statCard: '#064e3b',
            profileButton: '#10b981'
        },
        sky: {
            name: 'Clear Sky',
            bgGradient1: '#7dd3fc',
            bgGradient2: '#2563eb',
            statCard: '#1e3a8a',
            profileButton: '#3b82f6'
        },
        honey: {
            name: 'Honey Gold',
            bgGradient1: '#fcd34d',
            bgGradient2: '#d97706',
            statCard: '#78350f',
            profileButton: '#f59e0b'
        },
        rose: {
            name: 'Rose Garden',
            bgGradient1: '#f9a8d4',
            bgGradient2: '#db2777',
            statCard: '#831843',
            profileButton: '#ec4899'
        },
        slate: {
            name: 'Soft Slate',
            bgGradient1: '#94a3b8',
            bgGradient2: '#475569',
            statCard: '#1e293b',
            profileButton: '#64748b'
        },
        aqua: {
            name: 'Aqua Marine',
            bgGradient1: '#5eead4',
            bgGradient2: '#0891b2',
            statCard: '#134e4a',
            profileButton: '#14b8a6'
        },
        terracotta: {
            name: 'Terracotta',
            bgGradient1: '#fb923c',
            bgGradient2: '#c2410c',
            statCard: '#7c2d12',
            profileButton: '#ea580c'
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

// ========================================
// STATE MANAGEMENT
// ========================================
const StateManager = {
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
        const schedule = this.getCurrentChild().schedule;
        
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

    getCharacterValues() {
        return this.getCurrentChild().characterValues;
    },

    getWeeklyChores() {
        return this.getCurrentChild().weeklyChores;
    },

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
        const dayData = child.days[date] || { 
            schedule: {}, 
            categoryMultipliers: {
                conflict: 1.0,
                respect: 1.0,
                etiquette: 1.0,
                transitions: 1.0
            }
        };
        
        const completed = Object.values(dayData.schedule).filter(v => v === true).length;
        const base = completed;
        
        let totalMultiplier = 0;
        let totalWeight = 0;
        const savedChild = StateManager.state.currentChild;
        StateManager.state.currentChild = childId;
        const characterValues = StateManager.getCharacterValues();
        StateManager.state.currentChild = savedChild;
        
        characterValues.forEach(cat => {
            const mult = dayData.categoryMultipliers[cat.id] || 1.0;
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
    },

    openSpendPointsModal() {
        const child = StateManager.getCurrentChild();
        document.getElementById('spend-modal-balance').textContent = child.pointsBalance;
        document.getElementById('modal-spend-amount').value = '';
        document.getElementById('modal-spend-reason').value = '';
        document.getElementById('spend-points-modal').classList.add('active');
    },

    spendPoints() {
        const amount = parseInt(document.getElementById('modal-spend-amount').value);
        const reason = document.getElementById('modal-spend-reason').value;
        const child = StateManager.getCurrentChild();
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        if (amount > child.pointsBalance) {
            alert('Not enough points! Current balance: ' + child.pointsBalance);
            return;
        }
        
        if (child.pointsSpent === undefined) {
            child.pointsSpent = 0;
        }
        child.pointsSpent += amount;
        
        if (window.saveData) {
            window.saveData();
        }
        
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        
        if (window.UICore) {
            UICore.updateUI();
        }
        
        const reasonText = reason ? ` for ${reason}` : '';
        const newBalance = child.pointsBalance;
        alert(`✅ Spent ${amount} points${reasonText}!\nNew balance: ${newBalance}`);
    }
};

// ========================================
// SCHEDULE MODULE
// ========================================
renderSchedule() {
    const dayData = StateManager.getDayData();
    const list = document.getElementById('schedule-list');
    const isEditMode = StateManager.state.editMode;
    
    const schedule = StateManager.getSchedule(!isEditMode);
    
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
                     onclick="ScheduleModule.focusScheduleItem(${item.id}, ${index})"
                     data-item-id="${item.id}">
                    <div class="schedule-header">
                        <div>
                            <div class="schedule-time">${item.time}</div>
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
},

    renderFocusedScheduleItem() {
    const schedule = StateManager.getSchedule();
    const dayData = StateManager.getDayData();
    const container = document.getElementById('schedule-detail-container');
    
    if (schedule.length === 0) {
        container.style.display = 'none';
        return;
    }

    focusScheduleItem(itemId, index) {
    // Store the focused item
    this.currentFocusedItemId = itemId;
    
    // Update the center column
    this.renderFocusedScheduleItemById(itemId);
    
    // Update focus states
    this.updateScheduleFocusStates(index);
    
    // Scroll the item into view
    const items = document.querySelectorAll('.timeline-item');
    if (items[index]) {
        items[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
},
    
    // Get current time in minutes
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Find the next incomplete item or current time item
    let focusedItem = null;
    let focusedIndex = -1;
    
    for (let i = 0; i < schedule.length; i++) {
        const item = schedule[i];
        const itemMinutes = StateManager.convertTimeToMinutes(item.time);
        const isComplete = dayData.schedule[item.id] === true;
        
        // If this item is not yet complete and is current or upcoming
        if (!isComplete) {
            if (!focusedItem || itemMinutes <= currentMinutes + 120) { // Within 2 hours
                focusedItem = item;
                focusedIndex = i;
                if (itemMinutes <= currentMinutes) {
                    break; // This is the current item
                }
            }
        }
    }
    
    // If all items complete, show the last item
    if (!focusedItem && schedule.length > 0) {
        focusedItem = schedule[schedule.length - 1];
        focusedIndex = schedule.length - 1;
    }
    
    if (!focusedItem) {
        container.style.display = 'none';
        return;
    }
    
    // Store focused item ID for completion
    this.currentFocusedItemId = focusedItem.id;
    
    // Render the focused item
    container.style.display = 'block';
    document.getElementById('focused-time').textContent = focusedItem.time;
    document.getElementById('focused-name').textContent = focusedItem.name;
    
    const tasksContainer = document.getElementById('focused-tasks');
    const isComplete = dayData.schedule[focusedItem.id] === true;
    
    tasksContainer.innerHTML = focusedItem.tasks.map(task => `
        <div class="task-item ${isComplete ? 'completed' : ''}">
            <div class="task-text">${task}</div>
        </div>
    `).join('');
    
    // Update complete button
    const completeBtn = document.getElementById('focused-complete-btn');
    if (isComplete) {
        completeBtn.textContent = '✓ Completed';
        completeBtn.classList.add('completed');
    } else {
        completeBtn.textContent = '✓ Mark Complete';
        completeBtn.classList.remove('completed');
    }
    
    // Update schedule list focus states
    this.updateScheduleFocusStates(focusedIndex);
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
                <button class="add-item-btn" onclick="CharacterModule.addCharacterCategory()">+ Add Character Category</button>
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
        badge.innerHTML = `
            <div class="completion-badge ${choresCompletion.isComplete ? 'complete' : 'incomplete'}">
                ${choresCompletion.completed} / ${choresCompletion.total} Complete (${choresCompletion.percentage}%)
                ${choresCompletion.isComplete ? '🎉 5x BONUS ACTIVE!' : ''}
            </div>
        `;
        
        const list = document.getElementById('weekly-chores-list');
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
                <button class="add-item-btn" onclick="CharacterModule.addChore()">+ Add Chore</button>
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
// UI CORE
// ========================================
const UICore = {
    updateUI() {
        const dayData = StateManager.getDayData();
        const points = PointsModule.calculatePoints(StateManager.state.currentChild, StateManager.state.currentDate);
        const weekly = PointsModule.calculateWeeklyTotal();
        const streak = PointsModule.calculateStreak();
        const choresData = PointsModule.calculateChoresCompletion();
        
        const maxSchedulePoints = StateManager.getSchedule().length;
        const child = StateManager.getCurrentChild();
        const dailyGoal = PointsModule.getDailyGoal();
        const weeklyGoal = PointsModule.getWeeklyGoal();
        
        let totalEarned = 0;
        Object.keys(child.days).forEach(date => {
            const dayPoints = PointsModule.calculatePoints(StateManager.state.currentChild, date);
            if (dayPoints.total > 0) {
                totalEarned += dayPoints.total;
            }
        });
        
        if (child.pointsSpent === undefined) {
            child.pointsSpent = 0;
        }
        
        child.pointsBalance = totalEarned - child.pointsSpent;
        
        document.getElementById('base-points').textContent = child.pointsBalance;
        document.getElementById('balance-sublabel').textContent = `+${points.total} today`;
        document.getElementById('multiplier').textContent = points.multiplier.toFixed(1) + 'x';
        document.getElementById('multiplier-label').textContent = 
            points.multiplier < 1.3 ? 'Standard' : 
            points.multiplier < 1.8 ? 'Good!' : 'Excellent!';
        
        document.getElementById('chores-multiplier').textContent = choresData.isComplete ? '5.0x' : '1.0x';
        document.getElementById('chores-label').textContent = 
            choresData.isComplete ? '🎉 Weekly Bonus!' : `${choresData.completed}/${choresData.total} goals`;
        
        document.getElementById('total-points').textContent = points.total;
        document.getElementById('daily-goal-label').textContent = `Goal: ${dailyGoal}`;
        document.getElementById('weekly-points').textContent = weekly;
        document.getElementById('weekly-goal-label').textContent = `Goal: ${weeklyGoal}`;
        
        const dailyPercent = Math.min(Math.round((points.total / dailyGoal) * 100), 100);
        const weeklyPercent = Math.min(Math.round((weekly / weeklyGoal) * 100), 100);
        
        document.getElementById('daily-percent').textContent = dailyPercent + '%';
        document.getElementById('daily-progress').style.width = dailyPercent + '%';
        document.getElementById('weekly-percent').textContent = weeklyPercent + '%';
        document.getElementById('weekly-progress').style.width = weeklyPercent + '%';
        
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
        
        const headerName = document.getElementById('header-member-name');
        const headerAvatar = document.getElementById('header-member-avatar');
        if (headerName) {
            headerName.textContent = child.name + "'s Dashboard";
        }
        if (headerAvatar) {
            if (child.photo) {
                headerAvatar.innerHTML = `<img src="${child.photo}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            } else {
                headerAvatar.textContent = '👤';
            }
        }
        
        ScheduleModule.renderSchedule();
        ScheduleModule.renderFocusedScheduleItem();
        CharacterModule.renderWeeklyChores();
        
        document.getElementById('daily-notes').value = dayData.notes || '';
        
        CharacterModule.renderCharacterSections();
    },

    applyColorPalette() {
        const child = StateManager.getCurrentChild();
        const palette = CONFIG.COLOR_PALETTES[child.colorPalette] || CONFIG.COLOR_PALETTES.lavender;
        
        document.documentElement.style.setProperty('--theme-gradient-1', palette.bgGradient1);
        document.documentElement.style.setProperty('--theme-gradient-2', palette.bgGradient2);
        document.documentElement.style.setProperty('--theme-stat-card', palette.statCard);
        document.documentElement.style.setProperty('--theme-profile-button', palette.profileButton);
        
        document.body.style.background = `linear-gradient(135deg, ${palette.bgGradient1} 0%, ${palette.bgGradient2} 100%)`;
        
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.style.background = `linear-gradient(135deg, ${palette.bgGradient1} 0%, ${palette.bgGradient2} 100%)`;
            card.style.color = 'white';
        });
        
        const progressFills = document.querySelectorAll('.progress-fill');
        progressFills.forEach(fill => {
            fill.style.background = `linear-gradient(135deg, ${palette.bgGradient1} 0%, ${palette.bgGradient2} 100%)`;
        });
    },

    selectChild(childId) {
        StateManager.state.currentChild = childId;
        if (window.ProfileModule) {
            ProfileModule.updateSidebarAvatars();
            ProfileModule.updateTrackerButtons();
        }
        this.updateUI();
        this.applyColorPalette();
    },

    selectDate(date) {
        StateManager.state.currentDate = date;
        const d = new Date(date + 'T00:00:00');
        document.getElementById('date-display').textContent = d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        this.updateUI();
    },

    toggleEditMode() {
        StateManager.state.editMode = !StateManager.state.editMode;
        const btn = document.getElementById('sidebar-edit-btn');
        const icon = document.getElementById('sidebar-edit-icon');
        const text = document.getElementById('sidebar-edit-text');
        
        if (StateManager.state.editMode) {
            if (icon) icon.textContent = '✓';
            if (text) text.textContent = 'Done';
            document.body.classList.add('edit-mode');
        } else {
            if (icon) icon.textContent = '✏️';
            if (text) text.textContent = 'Edit';
            document.body.classList.remove('edit-mode');
        }
        
        this.updateUI();
    }
};

// ========================================
// PLACEHOLDER FUNCTIONS (Firebase overrides these)
// ========================================
function saveData() {
    // Overridden by Firebase
}

function loadData() {
    // Overridden by Firebase
}

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

// HTML callback functions
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

function addModalTask() {
    ScheduleModule.addModalTask();
}

function removeModalTask(index) {
    ScheduleModule.removeModalTask(index);
}

function saveScheduleItem() {
    ScheduleModule.saveScheduleItem();
}

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

function spendPoints() {
    PointsModule.spendPoints();
}

// Auto-refresh focused schedule item every minute
setInterval(() => {
    if (window.ScheduleModule && window.StateManager) {
        ScheduleModule.renderFocusedScheduleItem();
    }
}, 60000); // Update every 60 seconds
