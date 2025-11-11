// ========================================
// MAIN.JS - APPLICATION INITIALIZATION
// ========================================

// ========================================
// TRACKER HELPER FUNCTIONS
// ========================================

// Open specific tracker by ID
function openSpecificTracker(trackerId) {
    // Use TrackerModule if available
    if (window.TrackerModule && typeof MedicationTracker.openSpecificTracker === 'function') {
        MedicationTracker.openSpecificTracker(trackerId);
        return;
    }
    
    // Fallback implementation
    const child = StateManager.getCurrentChild();
    const tracker = child.trackers ? child.trackers.find(t => t.id === trackerId) : null;
    
    if (!tracker) {
        alert('Tracker not found');
        return;
    }
    
    // Check if modal exists
    const modal = document.getElementById('med-tracker-modal');
    if (!modal) {
        console.error('❌ Medication tracker modal not found in HTML!');
        alert('Tracker modal not available. Please check your HTML setup.');
        return;
    }
    
    // Store current tracker ID globally
    window.currentTrackerId = trackerId;
    
    // Open modal
    modal.classList.add('active');
    
    // Initialize with specific tracker
    initMedicationTrackerWithConfig(trackerId, tracker);
}

// Initialize tracker with specific config
function initMedicationTrackerWithConfig(trackerId, tracker) {
    const child = StateManager.getCurrentChild();
    
    console.log('🔷 Init tracker:', tracker.templateName, 'for:', child.name);
    
    setTimeout(() => {
        // Set modal title
        const titleEl = document.getElementById('med-tracker-member-name');
        if (titleEl) {
            titleEl.textContent = `${child.name} - ${tracker.templateName}`;
        }
        
        // Initialize MedicationTracker with custom config if available
        if (window.MedicationTracker && tracker.customConfig) {
            MedicationTracker.init(StateManager.state.currentChild, trackerId, tracker.customConfig);
            
            // Render period type options from template
            if (tracker.customConfig.periodTypes) {
                renderPeriodTypes(tracker.customConfig.periodTypes);
            }
            
            // Set date
            const dateEl = document.getElementById('med-entry-date');
            if (dateEl) {
                dateEl.value = new Date().toISOString().split('T')[0];
                console.log('✅ Date set');
            }
            
            // Render the entry form
            console.log('🔷 Rendering entry form...');
            MedicationTracker.renderEntryForm();
            console.log('✅ Render complete');
        }
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

// Close medication tracker
function closeMedicationTracker() {
    const modal = document.getElementById('med-tracker-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Save entry function
function saveMedEntry() {
    if (window.MedicationTracker && typeof MedicationTracker.saveEntry === 'function') {
        MedicationTracker.saveEntry();
    }
}

// Switch medication tracker tabs
function switchMedTab(tab) {
    // Update tab buttons
    const tabs = ['entry', 'history', 'analytics', 'settings'];
    tabs.forEach(t => {
        const tabBtn = document.getElementById(`med-tab-${t}`);
        const content = document.getElementById(`med-content-${t}`);
        if (tabBtn) {
            tabBtn.style.borderBottomColor = tab === t ? '#6366f1' : 'transparent';
            tabBtn.style.color = tab === t ? '#6366f1' : '#6b7280';
        }
        if (content) {
            content.style.display = tab === t ? 'block' : 'none';
        }
    });
    
    // Render appropriate content
    if (window.MedicationTracker) {
        if (tab === 'history') {
            MedicationTracker.renderHistory();
        } else if (tab === 'analytics') {
            MedicationTracker.renderAnalytics();
        } else if (tab === 'settings') {
            renderTrackerSettings();
        }
    }
}

// Render tracker settings
function renderTrackerSettings() {
    const content = document.getElementById('med-settings-content');
    if (!content) return;
    
    content.innerHTML = '<p>Settings configuration coming soon...</p>';
}

console.log('✅ Main.js loaded - waiting for Firebase authentication');
