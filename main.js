// ========================================
// MAIN.JS - APPLICATION INITIALIZATION
// ========================================
// This module handles app initialization, event listeners,
// and helper functions that connect all modules together

// ========================================
// TRACKER HELPER FUNCTIONS
// ========================================

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

// Close medication tracker
function closeMedicationTracker() {
    document.getElementById('med-tracker-modal').classList.remove('active');
}

// Save entry function
function saveMedEntry() {
    MedicationTracker.saveEntry();
}

// Switch medication tracker tabs
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
// DATE PICKER INITIALIZATION
// ========================================

// Note: Date picker onchange event is handled inline in HTML
// The selectDate() function is in ui-core.js

// ========================================
// INITIALIZATION
// ========================================

// Initialize will be done by Firebase auth state listener
// Don't initialize here - wait for Firebase authentication

console.log('✅ Main.js loaded - waiting for Firebase authentication');

// ========================================
// EXPORTS
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openSpecificTracker,
        initMedicationTrackerWithConfig,
        renderPeriodTypes,
        closeMedicationTracker,
        saveMedEntry,
        switchMedTab
    };
}
