// ========================================
// UI CORE - MAIN UI RENDERING FUNCTIONS
// ========================================

// ========================================
// COLOR PALETTES
// ========================================

const COLOR_PALETTES = {
    default: {
        bgGradient1: '#667eea',
        bgGradient2: '#764ba2',
        statCard: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        profileButton: '#667eea',
        characterButton1: '#e0e7ff',
        characterButton15: '#c7d2fe',
        characterButton2: '#818cf8'
    },
    lavender: {
        bgGradient1: '#667eea',
        bgGradient2: '#764ba2',
        statCard: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        profileButton: '#667eea',
        characterButton1: '#e0e7ff',
        characterButton15: '#c7d2fe',
        characterButton2: '#818cf8'
    },
    ocean: {
        bgGradient1: '#06b6d4',
        bgGradient2: '#0284c7',
        statCard: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
        profileButton: '#06b6d4',
        characterButton1: '#cffafe',
        characterButton15: '#a5f3fc',
        characterButton2: '#22d3ee'
    },
    sunset: {
        bgGradient1: '#f59e0b',
        bgGradient2: '#dc2626',
        statCard: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
        profileButton: '#f59e0b',
        characterButton1: '#fed7aa',
        characterButton15: '#fdba74',
        characterButton2: '#fb923c'
    },
    forest: {
        bgGradient1: '#10b981',
        bgGradient2: '#059669',
        statCard: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        profileButton: '#10b981',
        characterButton1: '#d1fae5',
        characterButton15: '#a7f3d0',
        characterButton2: '#6ee7b7'
    },
    rose: {
        bgGradient1: '#ec4899',
        bgGradient2: '#db2777',
        statCard: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        profileButton: '#ec4899',
        characterButton1: '#fce7f3',
        characterButton15: '#fbcfe8',
        characterButton2: '#f9a8d4'
    }
};

// Main UI update function
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

// ========================================
// SCHEDULE RENDERING
// ========================================

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

// ========================================
// WEEKLY CHORES RENDERING
// ========================================

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

// ========================================
// CHARACTER SECTIONS RENDERING
// ========================================

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

// ========================================
// CHILD BUTTONS RENDERING
// ========================================

function renderChildButtons() {
    const container = document.getElementById('child-buttons-container');
    const gridClass = state.children.length <= 2 ? 'grid-2' : state.children.length === 3 ? 'grid-3' : 'grid-4';
    
    container.innerHTML = `
        <div class="grid ${gridClass}" style="margin-bottom: 16px;">
            ${state.children.map(childId => {
                const child = state.data[childId];
                return `
                    <button class="btn btn-secondary child-btn" id="${childId}-btn" onclick="selectChild('${childId}')" style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                        <div id="${childId}-photo-btn"></div>
                        <span id="${childId}-name-btn">${child.name}</span>
                    </button>
                `;
            }).join('')}
        </div>
    `;
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

// ========================================
// TRACKER BUTTONS RENDERING
// ========================================

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

// ========================================
// COLOR PALETTE APPLICATION
// ========================================

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
    
    // Reset non-active buttons
    state.children.forEach(childId => {
        if (childId !== state.currentChild) {
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

// ========================================
// EVENT HANDLERS
// ========================================

function selectChild(childId) {
    state.currentChild = childId;
    updateChildButtons();
    updateTrackerButtons();
    updateUI();
    applyColorPalette();
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

// ========================================
// EDIT MODE
// ========================================

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

// ========================================
// SCHEDULE EDIT FUNCTIONS
// ========================================

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

// ========================================
// CHORE EDIT FUNCTIONS
// ========================================

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

// ========================================
// CHARACTER CATEGORY EDIT FUNCTIONS
// ========================================

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

// ========================================
// MODAL CONTROL
// ========================================

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    state.modalData = null;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateUI,
        renderSchedule,
        renderWeeklyChores,
        renderCharacterSections,
        renderChildButtons,
        updateChildButtons,
        updateTrackerButtons,
        applyColorPalette,
        updateCharacterButtonColors,
        selectChild,
        selectDate,
        updateChildName,
        setScheduleStatus,
        toggleWeeklyChore,
        setCategoryMultiplier,
        updateNotes,
        updateCharacterNotes,
        toggleEditMode,
        editScheduleItem,
        addScheduleItem,
        deleteScheduleItem,
        addModalTask,
        removeModalTask,
        saveScheduleItem,
        editChore,
        addChore,
        deleteChore,
        closeDeleteGoalConfirm,
        confirmDeleteGoal,
        saveChore,
        editCharacterCategory,
        addCharacterCategory,
        deleteCharacterCategory,
        addModalCharacterItem,
        removeModalCharacterItem,
        saveCharacterCategory,
        closeModal
    };
}
