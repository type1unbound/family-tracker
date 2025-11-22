// ========================================
// UI UPDATES - Rendering Functions
// ========================================

let currentTaskIndex = 0;
let tasksCompletedToday = 0;
let totalTasksToday = 0;

function updateUI() {
    const child = StateManager.getCurrentChild();
    if (!child) {
        document.querySelector('.mobile-content').innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <h2>No Family Members Yet</h2>
                <p style="color: #6b7280; margin: 16px 0;">Add family members in the desktop app to get started.</p>
            </div>
        `;
        return;
    }
    
    applyColorTheme(child.colorPalette || 'purple');
    
    document.getElementById('current-name').textContent = child.name;
    
    const avatar = document.getElementById('current-avatar');
    if (child.photo) {
        avatar.innerHTML = `<img src="${child.photo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    } else {
        avatar.textContent = child.name ? child.name.charAt(0).toUpperCase() : '👤';
    }
    
    updateMemberDropdown();
    updateScheduleFromData();
    updateStatsCards();
    updateResponsibilities();
    updateWellnessTrackers();
}

function applyColorTheme(paletteKey) {
    const palette = CONFIG.COLOR_PALETTES[paletteKey] || CONFIG.COLOR_PALETTES.purple;
    
    document.documentElement.style.setProperty('--theme-gradient-1', palette.bgGradient1);
    document.documentElement.style.setProperty('--theme-gradient-2', palette.bgGradient2);
    document.documentElement.style.setProperty('--theme-accent', palette.accent);
    document.documentElement.style.setProperty('--theme-accent-hover', palette.accentHover);
    document.documentElement.style.setProperty('--theme-accent-light', palette.accentLight);
    
    // Apply to complete button
    const completeBtn = document.querySelector('.complete-task-btn');
    if (completeBtn && !completeBtn.classList.contains('completed')) {
        completeBtn.style.background = `linear-gradient(135deg, ${palette.bgGradient1}, ${palette.bgGradient2})`;
    }
    
    // Apply to first stat card
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[0]) {
        statCards[0].style.background = `linear-gradient(135deg, ${palette.bgGradient1}, ${palette.bgGradient2})`;
    }
}

function updateMemberDropdown() {
    const dropdown = document.getElementById('member-dropdown');
    dropdown.innerHTML = StateManager.state.children.map((childId, idx) => {
        const child = StateManager.getChild(childId);
        if (!child) return '';
        
        const schedule = StateManager.state.data[childId] ? 
            (StateManager.state.data[childId].schedule || []) : [];
        const dayData = child.days ? (child.days[StateManager.state.currentDate] || {}) : {};
        const completed = Object.values(dayData.schedule || {}).filter(v => v === true).length;
        const total = schedule.length;
        
        const isActive = childId === StateManager.state.currentChild;
        
        return `
            <div class="member-option ${isActive ? 'active' : ''}" onclick="selectMemberById('${childId}')">
                <div class="member-avatar">${child.photo ? 
                    `<img src="${child.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : 
                    child.name.charAt(0).toUpperCase()}</div>
                <div>
                    <div style="font-weight: 600;">${child.name}</div>
                    <div style="font-size: 12px; color: #6b7280;">${completed} of ${total} tasks complete</div>
                </div>
            </div>
        `;
    }).join('');
}

function updateScheduleFromData() {
    const child = StateManager.getCurrentChild();
    if (!child) {
        console.log('No child found');
        return;
    }
    
    console.log('Current child:', child.name);
    console.log('Child data:', child);
    
    const schedule = StateManager.getSchedule();
    console.log('Schedule from StateManager:', schedule);
    console.log('Schedule length:', schedule.length);
    
    const dayData = StateManager.getDayData();
    
    if (schedule.length === 0) {
        console.log('No schedule items - showing empty message');
        document.querySelector('.current-task-card').innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p>No schedule items for today. Add them in the desktop app!</p>
            </div>
        `;
        return;
    }
    
    totalTasksToday = schedule.length;
    tasksCompletedToday = Object.values(dayData.schedule || {}).filter(v => v === true).length;
    
    currentTaskIndex = schedule.findIndex(item => !dayData.schedule[item.id]);
    if (currentTaskIndex === -1) currentTaskIndex = schedule.length - 1;
    
    console.log('Updating current task, index:', currentTaskIndex);
    updateCurrentTask();
}

function updateCurrentTask() {
    const schedule = StateManager.getSchedule();
    if (schedule.length === 0) return;
    
    const task = schedule[currentTaskIndex];
    if (!task) return;
    
    const dayData = StateManager.getDayData();
    const isCompleted = dayData.schedule[task.id] === true;
    
    document.querySelector('.task-time').textContent = 
        `${task.time} — Task ${currentTaskIndex + 1} of ${totalTasksToday}`;
    document.querySelector('.task-name').textContent = task.name;
    
    const taskList = document.querySelector('.task-checklist');
    taskList.innerHTML = (task.tasks || []).map(t => `<li>${t}</li>`).join('');
    
    const completeBtn = document.querySelector('.complete-task-btn');
    if (isCompleted) {
        completeBtn.classList.add('completed');
        completeBtn.textContent = '✓ Completed';
    } else {
        completeBtn.classList.remove('completed');
        completeBtn.textContent = '✓ Mark Complete';
    }
    
    updateTimelinePreview();
}

function updateTimelinePreview() {
    const schedule = StateManager.getSchedule();
    const dayData = StateManager.getDayData();
    
    const track = document.getElementById('tasks-track');
    track.innerHTML = schedule.map((task, idx) => {
        const isCompleted = dayData.schedule[task.id] === true;
        const statusClass = isCompleted ? 'completed' : 'pending';
        const statusText = isCompleted ? '✓ Completed' : 
                          idx === currentTaskIndex ? 'In Progress' : 'Not Started';
        const cardClass = isCompleted ? 'past' : 
                         idx === currentTaskIndex ? 'current' : 'future';
        
        return `
            <div class="task-preview ${cardClass}" data-task-index="${idx}" onclick="jumpToTask(${idx})">
                <div class="preview-time">${task.time}</div>
                <div class="preview-name">${task.name}</div>
                <span class="preview-status ${statusClass}">${statusText}</span>
            </div>
        `;
    }).join('');
    
    const indicators = document.querySelector('.swipe-indicators');
    indicators.innerHTML = schedule.map((_, idx) => 
        `<div class="indicator-dot ${idx === currentTaskIndex ? 'active' : ''}"></div>`
    ).join('');
}

function updateStatsCards() {
    const child = StateManager.getCurrentChild();
    if (!child) return;
    
    // Use PointsModule from desktop app.js
    const currentDate = StateManager.state.currentDate;
    const dailyPoints = PointsModule.calculatePoints(StateManager.state.currentChild, currentDate, false);
    const weeklyPoints = PointsModule.calculateWeeklyTotal();
    const dailyGoal = PointsModule.getDailyGoal();
    const weeklyGoal = PointsModule.getWeeklyGoal();
    
    // Calculate balance
    let totalEarned = 0;
    Object.keys(child.days || {}).forEach(date => {
        const dayPoints = PointsModule.calculatePoints(StateManager.state.currentChild, date, false);
        if (dayPoints.total > 0) {
            totalEarned += dayPoints.total;
        }
    });
    
    if (child.pointsSpent === undefined) {
        child.pointsSpent = 0;
    }
    
    child.pointsBalance = totalEarned - child.pointsSpent;
    
    const dailyPercent = dailyGoal > 0 ? Math.min(Math.round((dailyPoints.total / dailyGoal) * 100), 100) : 0;
    const weeklyPercent = weeklyGoal > 0 ? Math.min(Math.round((weeklyPoints / weeklyGoal) * 100), 100) : 0;
    
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[0]) {
        statCards[0].querySelector('.stat-value').textContent = dailyPercent + '%';
        statCards[0].querySelector('.stat-subtext').textContent = 
            `${dailyPoints.total} of ${dailyGoal} points`;
    }
    
    if (statCards[1]) {
        statCards[1].querySelector('.stat-value').textContent = weeklyPercent + '%';
        statCards[1].querySelector('.stat-subtext').textContent = 
            `${weeklyPoints} of ${weeklyGoal} points`;
    }
    
    if (statCards[2] && child) {
        statCards[2].querySelector('.stat-value').textContent = child.pointsBalance || 0;
        statCards[2].querySelector('.stat-subtext').textContent = 
            `+${dailyPoints.total} points today`;
    }
}

function updateResponsibilities() {
    const child = StateManager.getCurrentChild();
    if (!child) return;
    
    const chores = child.weeklyChores || [];
    const dayData = StateManager.getDayData();
    
    const weeklyChoresData = PointsModule.getWeeklyChoresData();
    const choresCompletion = PointsModule.calculateChoresCompletion();
    
    const badge = document.querySelector('.completion-badge');
    if (badge) {
        badge.textContent = `${choresCompletion.completed} / ${choresCompletion.total} Complete (${choresCompletion.percentage}%)${choresCompletion.isComplete ? ' 🎉 5x BONUS!' : ''}`;
        badge.className = choresCompletion.isComplete ? 'completion-badge complete' : 'completion-badge incomplete';
    }
    
    const weekRange = document.getElementById('week-range');
    if (weekRange) {
        weekRange.textContent = StateManager.getWeekRangeDisplay(StateManager.state.currentDate);
    }
    
    const list = document.getElementById('weekly-chores-list');
    if (list && chores.length > 0) {
        list.innerHTML = chores.map((chore, index) => {
            const isCompleteThisWeek = weeklyChoresData[chore.id];
            
            return `
                <div class="responsibility-item" onclick="toggleWeeklyChore('${chore.id}')">
                    <div class="task-checkbox ${isCompleteThisWeek ? 'checked' : ''}"></div>
                    <span>${chore.name}</span>
                </div>
            `;
        }).join('');
    } else if (list) {
        list.innerHTML = '<div style="padding: 20px; text-align: center; color: #6b7280;">No weekly responsibilities yet. Add them in the desktop app!</div>';
    }
    
    renderCharacterValues();
}

function renderCharacterValues() {
    const child = StateManager.getCurrentChild();
    if (!child) return;
    
    const categories = child.characterValues || [];
    const dayData = StateManager.getDayData();
    
    const container = document.getElementById('character-sections');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (categories.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #6b7280;">No personal growth areas yet. Add them in the desktop app!</div>';
        return;
    }
    
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'character-category';
        
        let html = `<div class="character-category-title">${category.category}</div>`;
        
        category.items.forEach((item, itemIdx) => {
            const ratingKey = category.id;
            const currentRating = dayData.categoryMultipliers?.[ratingKey] || 1.0;
            
            html += `
                <div class="character-trait-item">
                    <div class="character-trait-text">${item}</div>
                    <div class="growth-rating">
                        <button class="rating-btn ${currentRating === 1.0 ? 'active' : ''}" 
                                onclick="setCharacterRating('${ratingKey}', 1.0)">Starting</button>
                        <button class="rating-btn ${currentRating === 1.5 ? 'active' : ''}" 
                                onclick="setCharacterRating('${ratingKey}', 1.5)">Progress</button>
                        <button class="rating-btn ${currentRating === 2.0 ? 'active' : ''}" 
                                onclick="setCharacterRating('${ratingKey}', 2.0)">Excelling</button>
                    </div>
                </div>
            `;
        });
        
        categoryDiv.innerHTML = html;
        container.appendChild(categoryDiv);
    });
}

function updateWellnessTrackers() {
    const child = StateManager.getCurrentChild();
    const selectionView = document.getElementById('wellness-tracker-selection');
    
    if (!child || !child.trackers || child.trackers.length === 0) {
        if (selectionView) {
            const trackerSelector = selectionView.querySelector('.tracker-selector');
            if (trackerSelector) {
                trackerSelector.innerHTML = '<div style="padding: 20px; text-align: center; color: #6b7280;">No wellness journals yet. Add one in the desktop app!</div>';
            }
        }
        return;
    }
    
    const trackerSelector = selectionView.querySelector('.tracker-selector');
    if (!trackerSelector) return;
    
    trackerSelector.innerHTML = child.trackers.map(tracker => {
        const entryCount = tracker.entries ? tracker.entries.length : 0;
        const lastEntry = entryCount > 0 ? 'Today' : 'Never';
        
        const iconHtml = tracker.icon ? 
            `<div style="font-size: 32px;">${tracker.icon}</div>` :
            `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>`;
        
        return `
            <div class="tracker-option" onclick="openTracker('${tracker.id}')">
                <div class="tracker-icon">${iconHtml}</div>
                <div class="tracker-info">
                    <div class="tracker-name">${tracker.templateName}</div>
                    <div class="tracker-entries">${entryCount} entries · Last: ${lastEntry}</div>
                </div>
                <div style="color: #6b7280;">›</div>
            </div>
        `;
    }).join('');
}

// Export to global scope
window.updateUI = updateUI;
window.updateStatsCards = updateStatsCards;
window.updateResponsibilities = updateResponsibilities;
window.updateCurrentTask = updateCurrentTask;
window.renderCharacterValues = renderCharacterValues;
