// ========================================
// INTERACTION HANDLERS - User Actions
// ========================================

function toggleMemberDropdown() {
    const dropdown = document.getElementById('member-dropdown');
    dropdown.classList.toggle('active');
}

function selectMemberById(childId) {
    StateManager.state.currentChild = childId;
    updateUI();
    toggleMemberDropdown();
    saveDataToFirebase();
}

function switchView(view) {
    const views = ['routine', 'responsibilities', 'wellness'];
    views.forEach(v => {
        const viewEl = document.getElementById(`${v}-view`);
        if (viewEl) viewEl.classList.remove('active');
    });
    document.getElementById(`${view}-view`).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if (view === 'wellness') {
        document.getElementById('wellness-tracker-selection').style.display = 'block';
        document.getElementById('wellness-tracker-entry').style.display = 'none';
    }
}

function toggleWeeklyChore(choreId) {
    const dayData = StateManager.getDayData();
    if (!dayData.weeklyChores) dayData.weeklyChores = {};
    
    dayData.weeklyChores[choreId] = !dayData.weeklyChores[choreId];
    
    saveDataToFirebase();
    updateResponsibilities();
    updateStatsCards();
}

function setCharacterRating(ratingKey, rating) {
    const dayData = StateManager.getDayData();
    if (!dayData.categoryMultipliers) dayData.categoryMultipliers = {};
    
    dayData.categoryMultipliers[ratingKey] = rating;
    
    renderCharacterValues();
    updateStatsCards();
    saveDataToFirebase();
}

function completeTask() {
    const btn = event.currentTarget;
    const child = StateManager.getCurrentChild();
    if (!child) return;
    
    const schedule = child.schedule || [];
    const task = schedule[currentTaskIndex];
    
    if (!task) return;
    
    const dayData = StateManager.getDayData();
    if (dayData.schedule[task.id]) {
        return;
    }
    
    btn.classList.add('completed');
    btn.textContent = '✓ Completed!';
    
    dayData.schedule[task.id] = true;
    tasksCompletedToday++;
    
    updateStatsCards();
    
    setTimeout(() => {
        let nextIndex = currentTaskIndex + 1;
        while (nextIndex < schedule.length && dayData.schedule[schedule[nextIndex].id]) {
            nextIndex++;
        }
        
        if (nextIndex < schedule.length) {
            currentTaskIndex = nextIndex;
            updateCurrentTask();
        } else {
            btn.textContent = '🎉 All Done!';
        }
        
        saveDataToFirebase();
    }, 1000);
}

function jumpToTask(index) {
    currentTaskIndex = index;
    updateCurrentTask();
}

// ========================================
// STATS SWIPE HANDLER
// ========================================

let statsStartX = 0;
let statsCurrentX = 0;
let statsIsDragging = false;
let currentStatIndex = 0;

function initStatsSwipe() {
    const statsTrack = document.getElementById('stats-track');
    if (!statsTrack) return;
    
    const statCards = document.querySelectorAll('.stat-card');

    statsTrack.addEventListener('touchstart', (e) => {
        statsStartX = e.touches[0].clientX;
        statsIsDragging = true;
        statsTrack.style.transition = 'none';
    });

    statsTrack.addEventListener('touchmove', (e) => {
        if (!statsIsDragging) return;
        statsCurrentX = e.touches[0].clientX;
        const diff = statsCurrentX - statsStartX;
        const currentOffset = -currentStatIndex * (window.innerWidth - 32);
        statsTrack.style.transform = `translateX(${currentOffset + diff}px)`;
    });

    statsTrack.addEventListener('touchend', () => {
        if (!statsIsDragging) return;
        statsIsDragging = false;
        
        const diff = statsCurrentX - statsStartX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentStatIndex > 0) {
                currentStatIndex--;
            } else if (diff < 0 && currentStatIndex < statCards.length - 1) {
                currentStatIndex++;
            }
        }
        
        statsTrack.style.transition = 'transform 0.3s ease';
        const offset = -currentStatIndex * (window.innerWidth - 32);
        statsTrack.style.transform = `translateX(${offset}px)`;
        
        document.querySelectorAll('.stat-dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentStatIndex);
        });
    });
}

// Export to global scope for onclick handlers
window.toggleMemberDropdown = toggleMemberDropdown;
window.selectMemberById = selectMemberById;
window.switchView = switchView;
window.toggleWeeklyChore = toggleWeeklyChore;
window.setCharacterRating = setCharacterRating;
window.completeTask = completeTask;
window.jumpToTask = jumpToTask;
window.initStatsSwipe = initStatsSwipe;
