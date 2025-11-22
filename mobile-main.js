// ========================================
// MAIN INITIALIZATION
// ========================================

// Global state
window.currentUser = null;

// Export functions to global scope for onclick handlers
window.toggleMemberDropdown = toggleMemberDropdown;
window.selectMemberById = selectMemberById;
window.jumpToTask = jumpToTask;
window.toggleWeeklyChore = toggleWeeklyChore;
window.setCharacterRating = setCharacterRating;
window.switchView = switchView;
window.completeTask = completeTask;
window.selectObserverRating = selectObserverRating;
window.selectSelfRating = selectSelfRating;
window.openTracker = openTracker;
window.backToTrackerList = backToTrackerList;
window.saveWellness = saveWellness;

console.log('✅ Compass Mobile App Loaded');
