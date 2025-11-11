// ========================================
// UI CORE - MAIN UI RENDERING FUNCTIONS
// ========================================

// Make sure we have access to required functions
const calculatePoints = window.calculatePoints || (() => ({ base: 0, total: 0, multiplier: 1.0 }));
const calculateWeeklyTotal = window.calculateWeeklyTotal || (() => 0);
const calculateStreak = window.calculateStreak || (() => 0);
const calculateChoresCompletion = window.calculateChoresCompletion || (() => ({ completed: 0, total: 0, percentage: 0, isComplete: false }));
const getDailyGoal = window.getDailyGoal || (() => 0);
const getWeeklyGoal = window.getWeeklyGoal || (() => 0);
const getWeeklyChoresData = window.getWeeklyChoresData || (() => ({}));

const UICore = {
    // ========================================
    // MAIN UI UPDATE
    // ========================================
    updateUI() {
        const dayData = StateManager.getDayData();
        const points = calculatePoints(StateManager.state.currentChild, StateManager.state.currentDate);
        const weekly = calculateWeeklyTotal();
        const streak = calculateStreak();
        const choresData = calculateChoresCompletion();
        
        // Update stats
        const maxSchedulePoints = StateManager.getSchedule().length;
        const child = StateManager.getCurrentChild();
        const dailyGoal = getDailyGoal();
        const weeklyGoal = getWeeklyGoal();
        
        // Calculate total earned points from all completed days
        let totalEarned = 0;
        Object.keys(child.days).forEach(date => {
            const dayPoints = calculatePoints(StateManager.state.currentChild, date);
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
        this.renderSchedule();
        
        // Update weekly chores
        this.renderWeeklyChores();
        
        // Update notes
        document.getElementById('daily-notes').value = dayData.notes || '';
        
        // Update character sections
        this.renderCharacterSections();
    },

    // ========================================
    // SCHEDULE RENDERING
    // ========================================
    renderSchedule() {
        const dayData = StateManager.getDayData();
        const list = document.getElementById('schedule-list');
        const isEditMode = StateManager.state.editMode;
        
        // In edit mode, show all items. Otherwise, filter by current day
        const schedule = StateManager.getSchedule(!isEditMode);
        
        list.innerHTML = schedule.map((item, index) => {
            const status = dayData.schedule[item.id];
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
                                    onclick="UICore.setScheduleStatus(${item.id}, true)"
                                >✓ Yes</button>
                                <button 
                                    class="yes-no-btn ${isNo ? 'no' : ''}" 
                                    onclick="UICore.setScheduleStatus(${item.id}, false)"
                                >✗ No</button>
                            </div>
                        </div>
                        <ul class="task-list">
                            ${item.tasks.map(task => `<li>${task}</li>`).join('')}
                        </ul>
                        ${isEditMode ? `
                            <div class="edit-controls">
                                <button class="edit-btn" onclick="ScheduleModule.editScheduleItem(${index})">✏️ Edit</button>
                                <button class="edit-btn delete" onclick="ScheduleModule.deleteScheduleItem(${index})">🗑️ Delete</button>
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

    // ========================================
    // WEEKLY CHORES RENDERING
    // ========================================
    renderWeeklyChores() {
        const dayData = StateManager.getDayData();
        const weeklyChoresData = getWeeklyChoresData();
        const choresCompletion = calculateChoresCompletion();
        const chores = StateManager.getWeeklyChores();
        const isEditMode = StateManager.state.editMode;
        
        // Update week range display
        const weekRange = document.getElementById('week-range');
        if (weekRange) {
            weekRange.textContent = StateManager.getWeekRangeDisplay(StateManager.state.currentDate);
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
                <div class="chore-item ${isCompleteThisWeek ? 'completed' : ''}" onclick="UICore.toggleWeeklyChore('${chore.id}')">
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

    // ========================================
    // CHARACTER SECTIONS RENDERING
    // ========================================
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
                    <div class="grid grid-3" style="gap: 8px;">
                        <button 
                            class="btn btn-multiplier btn-multiplier-1 ${mult === 1.0 ? 'active' : ''}" 
                            onclick="UICore.setCategoryMultiplier('${section.id}', 1.0)"
                            style="padding: 12px 8px;">
                            <div class="value" style="font-size: 18px;">1.0x</div>
                            <div class="label" style="font-size: 10px;">Standard</div>
                        </button>
                        <button 
                            class="btn btn-multiplier btn-multiplier-15 ${mult === 1.5 ? 'active' : ''}" 
                            onclick="UICore.setCategoryMultiplier('${section.id}', 1.5)"
                            style="padding: 12px 8px;">
                            <div class="value" style="font-size: 18px;">1.5x</div>
                            <div class="label" style="font-size: 10px;">Good</div>
                        </button>
                        <button 
                            class="btn btn-multiplier btn-multiplier-2 ${mult === 2.0 ? 'active' : ''}" 
                            onclick="UICore.setCategoryMultiplier('${section.id}', 2.0)"
                            style="padding: 12px 8px;">
                            <div class="value" style="font-size: 18px;">2.0x</div>
                            <div class="label" style="font-size: 10px;">Excellent</div>
                        </button>
                    </div>
                </div>
                <textarea 
                    rows="2" 
                    placeholder="Notes about this area..."
                    onchange="UICore.updateCharacterNotes('${section.id}', this.value)"
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
        
        // Apply color palette to newly rendered buttons
        const child = StateManager.getCurrentChild();
        const palette = CONFIG.COLOR_PALETTES[child.colorPalette] || CONFIG.COLOR_PALETTES.default;
        this.updateCharacterButtonColors(palette);
    },

    // ========================================
    // COLOR PALETTE APPLICATION
    // ========================================
    applyColorPalette() {
        const child = StateManager.getCurrentChild();
        const palette = CONFIG.COLOR_PALETTES[child.colorPalette] || CONFIG.COLOR_PALETTES.lavender;
        
        // Update CSS variables for theme-based button gradients
        document.documentElement.style.setProperty('--theme-gradient-1', palette.bgGradient1);
        document.documentElement.style.setProperty('--theme-gradient-2', palette.bgGradient2);
        document.documentElement.style.setProperty('--theme-stat-card', palette.statCard);
        document.documentElement.style.setProperty('--theme-profile-button', palette.profileButton);
        
        // Update body background with gradient
        document.body.style.background = `linear-gradient(135deg, ${palette.bgGradient1} 0%, ${palette.bgGradient2} 100%)`;
        
        // Stat cards now use CSS variables (will update automatically)
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.style.background = `linear-gradient(135deg, ${palette.bgGradient1} 0%, ${palette.bgGradient2} 100%)`;
            card.style.color = 'white';
        });
        
        // Update active child button with profile button color
        const activeBtn = document.getElementById(StateManager.state.currentChild + '-btn');
        if (activeBtn) {
            activeBtn.style.background = palette.profileButton;
            activeBtn.style.borderColor = palette.profileButton;
            activeBtn.style.color = 'white';
        }
        
        // Reset non-active buttons
        StateManager.state.children.forEach(childId => {
            if (childId !== StateManager.state.currentChild) {
                const btn = document.getElementById(childId + '-btn');
                if (btn) {
                    btn.style.background = '#e5e7eb';
                    btn.style.color = '#374151';
                    btn.style.borderColor = '#e5e7eb';
                }
            }
        });
        
        // Update edit mode toggle button
        const editBtn = document.getElementById('edit-mode-toggle');
        if (editBtn && !StateManager.state.editMode) {
            editBtn.style.background = palette.profileButton;
        }
        
        // Update progress bars to match theme
        const progressFills = document.querySelectorAll('.progress-fill');
        progressFills.forEach(fill => {
            fill.style.background = `linear-gradient(135deg, ${palette.bgGradient1} 0%, ${palette.bgGradient2} 100%)`;
        });
        
        // Update character value multiplier buttons
        this.updateCharacterButtonColors(palette);
    },

    updateCharacterButtonColors(palette) {
        // Update all character multiplier button colors
        const multiplierButtons = document.querySelectorAll('.btn-multiplier-1, .btn-multiplier-15, .btn-multiplier-2');
        
        multiplierButtons.forEach(btn => {
            if (btn.classList.contains('btn-multiplier-1')) {
                btn.style.background = palette.characterButton1;
                btn.style.borderColor = palette.characterButton1;
                btn.style.color = '#1f2937';
                if (btn.classList.contains('active')) {
                    btn.style.background = palette.characterButton1;
                    btn.style.borderColor = palette.profileButton;
                    btn.style.borderWidth = '3px';
                }
            } else if (btn.classList.contains('btn-multiplier-15')) {
                btn.style.background = palette.characterButton15;
                btn.style.borderColor = palette.characterButton15;
                btn.style.color = '#1f2937';
                if (btn.classList.contains('active')) {
                    btn.style.background = palette.characterButton15;
                    btn.style.borderColor = palette.profileButton;
                    btn.style.borderWidth = '3px';
                }
            } else if (btn.classList.contains('btn-multiplier-2')) {
                btn.style.background = palette.characterButton2;
                btn.style.borderColor = palette.characterButton2;
                btn.style.color = 'white';
                if (btn.classList.contains('active')) {
                    btn.style.background = palette.characterButton2;
                    btn.style.borderColor = palette.profileButton;
                    btn.style.borderWidth = '3px';
                }
            }
        });
    },

    // ========================================
    // EVENT HANDLERS
    // ========================================
    selectChild(childId) {
        StateManager.state.currentChild = childId;
        if (window.ProfileModule) {
            ProfileModule.updateChildButtons();
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

    setScheduleStatus(scheduleId, status) {
        const dayData = StateManager.getDayData();
        // If clicking the same status, toggle it off (set to undefined)
        if (dayData.schedule[scheduleId] === status) {
            delete dayData.schedule[scheduleId];
        } else {
            dayData.schedule[scheduleId] = status;
        }
        if (window.saveData) window.saveData();
        this.updateUI();
    },

    toggleWeeklyChore(choreId) {
        const dayData = StateManager.getDayData();
        dayData.weeklyChores[choreId] = !dayData.weeklyChores[choreId];
        if (window.saveData) window.saveData();
        this.updateUI();
    },

    setCategoryMultiplier(categoryId, value) {
        const dayData = StateManager.getDayData();
        dayData.categoryMultipliers[categoryId] = value;
        if (window.saveData) window.saveData();
        this.updateUI();
    },

    updateNotes(notes) {
        const dayData = StateManager.getDayData();
        dayData.notes = notes;
        if (window.saveData) window.saveData();
    },

    updateCharacterNotes(categoryId, notes) {
        const dayData = StateManager.getDayData();
        dayData.characterNotes[categoryId] = notes;
        if (window.saveData) window.saveData();
    },

    // ========================================
    // EDIT MODE
    // ========================================
    toggleEditMode() {
        StateManager.state.editMode = !StateManager.state.editMode;
        const btn = document.getElementById('edit-mode-toggle');
        const text = document.getElementById('edit-mode-text');
        const addChildBtn = document.getElementById('add-child-btn');
        
        if (StateManager.state.editMode) {
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
        
        this.updateUI();
    }
};

// Make UICore available globally
window.UICore = UICore;
