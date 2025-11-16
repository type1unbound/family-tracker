// Compass UI Compatibility Bridge
// This file ensures your existing JavaScript modules work with the new Compass UI structure

console.log('🧭 Compass Compatibility Loading...');

// Make wellness functions available IMMEDIATELY (before anything else)
// This early binding ensures the button works even if scripts load out of order
let wellnessJournalStub = function() {
    console.log('⚕️ WELLNESS BUTTON CLICKED - Early stub called');
    console.log('🔍 Checking if main function is loaded...');
    
    // Try to find the real implementation
    const realImpl = window.CompassUI?.openWellnessJournal;
    
    if (realImpl && typeof realImpl === 'function') {
        console.log('✅ Found real implementation, calling it');
        realImpl();
    } else {
        console.log('⏳ Real implementation not ready, retrying in 200ms');
        setTimeout(() => {
            const delayedImpl = window.CompassUI?.openWellnessJournal;
            if (delayedImpl && typeof delayedImpl === 'function') {
                console.log('✅ Found real implementation on retry');
                delayedImpl();
            } else {
                console.log('❌ Still no implementation found');
                console.log('Available:', Object.keys(window.CompassUI || {}));
                alert('Wellness tracker is still loading. Please refresh the page and try again.');
            }
        }, 200);
    }
};

window.openWellnessJournal = wellnessJournalStub;

// Stub other functions
window.closeTrackerList = function() { console.log('closeTrackerList stub called'); };
window.renderTrackerButtons = function() { console.log('renderTrackerButtons stub called'); };
window.openTemplateSelection = function() { 
    console.log('openTemplateSelection called');
    if (window.TrackerModule && TrackerModule.openTemplateSelection) {
        TrackerModule.openTemplateSelection();
    } else {
        alert('Template selection is loading. Please try again.');
    }
};
window.openSpecificTracker = function(id) { 
    console.log('openSpecificTracker called:', id);
    if (window.TrackerModule && TrackerModule.openSpecificTracker) {
        TrackerModule.openSpecificTracker(id);
    } else if (window.openSpecificTracker && window.openSpecificTracker !== arguments.callee) {
        window.openSpecificTracker(id);
    }
};

console.log('✅ Early stubs created');

const LEGACY_ELEMENTS = [
    { id: 'child-buttons-container', tag: 'div' },
    { id: 'add-child-btn', tag: 'button' },
    { id: 'tracker-buttons-container', tag: 'div' },
    { id: 'schedule-buttons-container', tag: 'div' },
    { id: 'schedule-detail-container', tag: 'div' },
    { id: 'schedule-list', tag: 'div' },
    { id: 'weekly-goals-container', tag: 'div' },
    { id: 'chores-container', tag: 'div' },
    { id: 'character-container', tag: 'div' }
];

// Create required legacy elements
function createRequiredElements() {
    console.log('🔨 Creating legacy elements...');
    LEGACY_ELEMENTS.forEach(({ id, tag, content }) => {
        if (!document.getElementById(id)) {
            console.log(`  ✓ Creating: #${id}`);
            const element = document.createElement(tag);
            element.id = id;
            element.style.display = 'none';
            if (content) element.textContent = content;
            document.body.appendChild(element);
        }
    });
    console.log('✅ All legacy elements created');
}

// Create elements as soon as body is available
if (document.body) {
    createRequiredElements();
} else {
    document.addEventListener('DOMContentLoaded', createRequiredElements);
}

console.log('✅ Compatibility script loaded');

// Render sidebar avatars
function renderSidebarAvatars() {
    console.log('🎨 renderSidebarAvatars() called');
    
    const container = document.getElementById('sidebar-avatars-container');
    if (!container) {
        console.log('⚠️ sidebar-avatars-container not found');
        return;
    }
    
    if (!window.StateManager || !StateManager.state) {
        console.log('⚠️ StateManager or state not available');
        return;
    }
    
    // Handle both possible data structures
    const children = StateManager.state.children || StateManager.state.data?.children || [];
    const currentChildId = StateManager.state.currentChildId;
    
    console.log(`🎨 Rendering ${children.length} avatars, current: ${currentChildId}`);
    console.log('Children array:', children);
    
    container.innerHTML = '';
    
    children.forEach(childId => {
        const child = StateManager.getChild(childId);
        if (!child) {
            console.log(`⚠️ Child ${childId} not found`);
            return;
        }
        
        console.log(`  ✓ Rendering avatar for ${child.name}`);
        
        const avatar = document.createElement('div');
        avatar.className = 'sidebar-avatar';
        if (childId === currentChildId) {
            avatar.classList.add('active');
        }
        
        // Apply color gradient
        if (child.colorPalette && window.CONFIG && CONFIG.COLOR_PALETTES) {
            const palette = CONFIG.COLOR_PALETTES[child.colorPalette];
            if (palette) {
                avatar.style.background = `linear-gradient(135deg, ${palette.bgGradient1}, ${palette.bgGradient2})`;
            }
        }
        
        // Add photo or emoji
        if (child.photo) {
            const img = document.createElement('img');
            img.src = child.photo;
            img.alt = child.name;
            avatar.appendChild(img);
        } else if (child.emoji) {
            avatar.textContent = child.emoji;
        } else {
            avatar.textContent = '👤';
        }
        
        // Add name label
        const nameLabel = document.createElement('div');
        nameLabel.className = 'name';
        nameLabel.textContent = child.name;
        avatar.appendChild(nameLabel);
        
        // Click handler
        avatar.onclick = () => {
            console.log(`🖱️ Clicked ${child.name}`);
            if (window.UICore && UICore.selectChild) {
                UICore.selectChild(childId);
            }
        };
        
        container.appendChild(avatar);
    });
    
    console.log('✅ Sidebar avatars rendered');
}

// Update header badge
function updateHeaderBadge() {
    console.log('🏷️ updateHeaderBadge() called');
    
    if (!window.StateManager) {
        console.log('⚠️ StateManager not available');
        return;
    }
    
    const currentChild = StateManager.getCurrentChild();
    if (!currentChild) {
        console.log('⚠️ No current child');
        return;
    }
    
    console.log(`🏷️ Updating header for ${currentChild.name}`);
    
    const avatarEl = document.getElementById('header-member-avatar');
    const nameEl = document.getElementById('header-member-name');
    
    if (nameEl) {
        nameEl.textContent = `${currentChild.name}'s Dashboard`;
    }
    
    if (avatarEl) {
        avatarEl.innerHTML = '';
        
        if (currentChild.photo) {
            const img = document.createElement('img');
            img.src = currentChild.photo;
            img.alt = currentChild.name;
            avatarEl.appendChild(img);
        } else if (currentChild.emoji) {
            avatarEl.textContent = currentChild.emoji;
        } else {
            avatarEl.textContent = '👤';
        }
        
        // Apply color gradient
        if (currentChild.colorPalette && window.CONFIG && CONFIG.COLOR_PALETTES) {
            const palette = CONFIG.COLOR_PALETTES[currentChild.colorPalette];
            if (palette) {
                avatarEl.style.background = `linear-gradient(135deg, ${palette.bgGradient1}, ${palette.bgGradient2})`;
            }
        }
    }
    
    console.log(`✅ Header updated for ${currentChild.name}`);
}

// Patch ProfileModule
function patchProfileModule() {
    console.log('📝 Patching ProfileModule...');
    
    if (!window.ProfileModule) {
        console.log('⚠️ ProfileModule not found');
        return;
    }
    
    const originalRenderChildButtons = ProfileModule.renderChildButtons;
    ProfileModule.renderChildButtons = function() {
        console.log('🎨 ProfileModule.renderChildButtons() called');
        const container = document.getElementById('child-buttons-container');
        if (container) {
            container.innerHTML = '';
        }
        renderSidebarAvatars();
        updateHeaderBadge();
    };
    
    const originalUpdateChildButtons = ProfileModule.updateChildButtons;
    ProfileModule.updateChildButtons = function() {
        console.log('🔄 ProfileModule.updateChildButtons() called');
        if (originalUpdateChildButtons) {
            originalUpdateChildButtons.call(this);
        }
        renderSidebarAvatars();
        updateHeaderBadge();
    };
    
    console.log('✅ ProfileModule patched');
}

// Patch UICore
function patchUICore() {
    console.log('📝 Patching UICore...');
    
    if (!window.UICore) {
        console.log('⚠️ UICore not found');
        return;
    }
    
    const originalUpdateUI = UICore.updateUI;
    UICore.updateUI = function() {
        console.log('🎨 UICore.updateUI() called');
        if (originalUpdateUI) {
            originalUpdateUI.call(this);
        }
        renderSidebarAvatars();
        updateHeaderBadge();
        renderScheduleWithFocus();
    };
    
    const originalSelectChild = UICore.selectChild;
    UICore.selectChild = function(childId) {
        console.log(`🎯 UICore.selectChild(${childId}) called`);
        if (originalSelectChild) {
            originalSelectChild.call(this, childId);
        }
        renderSidebarAvatars();
        updateHeaderBadge();
        renderScheduleWithFocus();
        
        // Update tracker buttons if they're visible
        const trackerContainer = document.getElementById('tracker-buttons-container');
        if (trackerContainer && trackerContainer.style.display === 'block') {
            renderTrackerButtons();
        }
    };
    
    // Patch toggleEditMode to prevent errors with missing elements
    const originalToggleEditMode = UICore.toggleEditMode;
    UICore.toggleEditMode = function() {
        console.log('✏️ toggleEditMode() called');
        try {
            if (originalToggleEditMode) {
                originalToggleEditMode.call(this);
            }
        } catch (error) {
            console.log('⚠️ toggleEditMode error (expected with new UI):', error.message);
            // Manually toggle edit mode
            const isEditMode = document.body.classList.contains('edit-mode');
            if (isEditMode) {
                document.body.classList.remove('edit-mode');
            } else {
                document.body.classList.add('edit-mode');
            }
            
            // Update button appearance
            const editBtn = document.getElementById('edit-mode-toggle');
            const editIcon = document.getElementById('edit-mode-icon');
            const editText = document.getElementById('edit-mode-text');
            
            if (editBtn) {
                if (isEditMode) {
                    editBtn.classList.remove('active');
                    if (editIcon) editIcon.textContent = '✏️';
                    if (editText) editText.textContent = 'Edit';
                } else {
                    editBtn.classList.add('active');
                    if (editIcon) editIcon.textContent = '💾';
                    if (editText) editText.textContent = 'Done';
                }
            }
            
            console.log(`✅ Edit mode ${isEditMode ? 'disabled' : 'enabled'}`);
        }
    };
    
    console.log('✅ UICore patched');
}

// Initialize compatibility bridge
function initCompatibilityBridge() {
    console.log('🔧 Initializing Compass UI compatibility...');
    
    // Wait for ProfileModule
    const checkProfileModule = setInterval(() => {
        if (window.ProfileModule) {
            clearInterval(checkProfileModule);
            patchProfileModule();
        }
    }, 50);
    
    // Wait for UICore
    const checkUICore = setInterval(() => {
        if (window.UICore) {
            clearInterval(checkUICore);
            patchUICore();
        }
    }, 50);
    
    // Wait for StateManager with data - check both possible structures
    let retryCount = 0;
    const maxRetries = 10;
    const retryInterval = setInterval(() => {
        retryCount++;
        console.log(`🔄 Retry ${retryCount}/${maxRetries}: Checking for data...`);
        
        // Check both possible data structures
        const children = StateManager?.state?.children || StateManager?.state?.data?.children;
        
        if (window.StateManager && StateManager.state && children && children.length > 0) {
            console.log('✅ Data found! Rendering UI...');
            console.log('Children:', children);
            clearInterval(retryInterval);
            renderSidebarAvatars();
            updateHeaderBadge();
            renderScheduleWithFocus();
        } else if (retryCount >= maxRetries) {
            console.log('❌ Max retries reached');
            console.log('StateManager:', window.StateManager);
            console.log('State:', StateManager?.state);
            console.log('Children (state.children):', StateManager?.state?.children);
            console.log('Children (state.data.children):', StateManager?.state?.data?.children);
            clearInterval(retryInterval);
        }
    }, 200);
    
    console.log('✅ Compass UI compatibility initialized');
}

// Render schedule with focus system
function renderScheduleWithFocus() {
    console.log('📅 renderScheduleWithFocus() called');
    
    const scheduleContainer = document.getElementById('schedule-buttons-container');
    const detailContainer = document.getElementById('schedule-detail-container');
    
    if (!scheduleContainer) {
        console.log('⚠️ schedule-buttons-container not found');
        return;
    }
    
    if (!window.StateManager || !StateManager.state) {
        console.log('⚠️ StateManager not available');
        return;
    }
    
    const currentChild = StateManager.getCurrentChild();
    if (!currentChild || !currentChild.schedule) {
        console.log('⚠️ No schedule data');
        return;
    }
    
    const schedule = currentChild.schedule;
    const focusedId = StateManager.state.focusedScheduleId || (schedule.length > 0 ? schedule[0].id : null);
    
    console.log(`📅 Rendering ${schedule.length} schedule items, focused: ${focusedId}`);
    
    // Render high-level list in left column
    scheduleContainer.innerHTML = '';
    schedule.forEach(item => {
        const isFocused = item.id === focusedId;
        const completed = item.completedDates && item.completedDates.includes(StateManager.state.currentDate);
        
        const div = document.createElement('div');
        div.className = `schedule-item ${isFocused ? 'in-focus' : 'out-of-focus'}`;
        div.onclick = () => selectScheduleItem(item.id);
        
        let statusBadge = '';
        if (completed) {
            statusBadge = '<span class="status-badge completed">✓ Completed</span>';
        } else if (isFocused) {
            const taskCount = item.tasks ? item.tasks.length : 0;
            const completedTasks = 0; // Would need to track this
            statusBadge = `<span class="status-badge in-progress">⏳ In Progress · ${completedTasks}/${taskCount}</span>`;
        } else {
            statusBadge = '<span class="status-badge upcoming">⏰ Upcoming</span>';
        }
        
        div.innerHTML = `
            <div class="schedule-time">${item.time}</div>
            <div class="schedule-name">${item.name}</div>
            <div class="schedule-status">${statusBadge}</div>
        `;
        
        scheduleContainer.appendChild(div);
    });
    
    // Render details in center column
    if (detailContainer && focusedId) {
        const focusedItem = schedule.find(item => item.id === focusedId);
        if (focusedItem) {
            renderScheduleDetails(focusedItem, detailContainer);
        }
    }
    
    console.log('✅ Schedule rendered with focus');
}

// Render schedule item details
function renderScheduleDetails(item, container) {
    const completed = item.completedDates && item.completedDates.includes(StateManager.state.currentDate);
    const taskCount = item.tasks ? item.tasks.length : 0;
    const completedTasks = 0; // Would need to track this
    const progress = taskCount > 0 ? (completedTasks / taskCount * 100) : 0;
    
    container.innerHTML = `
        <div class="detail-header">
            <div class="detail-time">${item.time}</div>
            <div class="detail-name">${item.name}</div>
        </div>
        
        <div class="progress-section">
            <div class="progress-label">
                <span>Task Progress</span>
                <span>${completedTasks}/${taskCount} completed</span>
            </div>
            <div class="progress-mini">
                <div class="progress-fill-mini" style="width: ${progress}%;"></div>
            </div>
        </div>
        
        <div class="section-subtitle">Tasks & Expectations</div>
        
        <div class="detail-tasks">
            ${item.tasks ? item.tasks.map((task, index) => `
                <div class="task-item">
                    <input type="checkbox" class="task-checkbox" id="task-${index}">
                    <div class="task-text">${task}</div>
                </div>
            `).join('') : '<p>No tasks defined</p>'}
        </div>
        
        <button class="complete-btn ${completed ? 'completed' : ''}" onclick="toggleScheduleComplete(${item.id})">
            ${completed ? '✓ Completed' : '✓ Mark Activity Complete'}
        </button>
    `;
}

// Select a schedule item to focus
function selectScheduleItem(itemId) {
    console.log(`🎯 Selecting schedule item: ${itemId}`);
    if (window.StateManager) {
        StateManager.state.focusedScheduleId = itemId;
        renderScheduleWithFocus();
    }
}

// Toggle schedule item completion
function toggleScheduleComplete(itemId) {
    console.log(`✓ Toggling completion for: ${itemId}`);
    if (window.ScheduleModule && ScheduleModule.setScheduleStatus) {
        // Use existing function if available
        ScheduleModule.setScheduleStatus(itemId, true);
    }
    renderScheduleWithFocus();
}

// Toggle wellness tracker list visibility
function openWellnessJournal() {
    console.log('⚕️ Toggling wellness tracker list...');
    
    const container = document.getElementById('tracker-buttons-container');
    if (!container) {
        console.log('⚠️ tracker-buttons-container not found');
        return;
    }
    
    // Toggle visibility
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
        renderTrackerButtons();
        
        // Add click-outside-to-close handler
        setTimeout(() => {
            document.addEventListener('click', closeTrackerListOnClickOutside);
        }, 100);
    } else {
        closeTrackerList();
    }
}

// Close tracker list
function closeTrackerList() {
    const container = document.getElementById('tracker-buttons-container');
    if (container) {
        container.style.display = 'none';
    }
    document.removeEventListener('click', closeTrackerListOnClickOutside);
}

// Close tracker list when clicking outside
function closeTrackerListOnClickOutside(event) {
    const container = document.getElementById('tracker-buttons-container');
    const wellnessBtn = event.target.closest('.sidebar-action-btn.wellness');
    
    if (container && 
        !container.contains(event.target) && 
        !wellnessBtn) {
        closeTrackerList();
    }
}

// Render tracker buttons for current child
function renderTrackerButtons() {
    console.log('📊 renderTrackerButtons() called');
    
    const container = document.getElementById('tracker-buttons-container');
    if (!container) {
        console.log('⚠️ tracker-buttons-container not found');
        return;
    }
    
    const currentChild = StateManager.getCurrentChild();
    if (!currentChild) {
        console.log('⚠️ No current child');
        container.innerHTML = `
            <div style="padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h3 style="font-size: 14px; font-weight: 700; color: #111827; margin: 0;">Wellness Trackers</h3>
                    <button onclick="closeTrackerList()" style="background: none; border: none; font-size: 20px; color: #9ca3af; cursor: pointer; padding: 0; line-height: 1;">×</button>
                </div>
                <p style="color: #6b7280; font-size: 12px; text-align: center;">No child selected</p>
            </div>
        `;
        return;
    }
    
    const trackers = currentChild.trackers || [];
    
    console.log(`📊 Rendering ${trackers.length} trackers for ${currentChild.name}`);
    
    // Header
    let html = `
        <div style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 14px; font-weight: 700; color: #111827; margin: 0;">Wellness Trackers</h3>
                <button onclick="closeTrackerList()" style="background: none; border: none; font-size: 20px; color: #9ca3af; cursor: pointer; padding: 0; line-height: 1;">×</button>
            </div>
            <p style="font-size: 11px; color: #6b7280; margin: 4px 0 0 0;">${currentChild.name}'s trackers</p>
        </div>
    `;
    
    if (trackers.length === 0) {
        html += `
            <div style="padding: 16px; text-align: center;">
                <p style="color: #6b7280; font-size: 13px; margin-bottom: 12px;">No wellness trackers yet</p>
                <button onclick="openTemplateSelection(); closeTrackerList();" 
                        style="padding: 8px 16px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;">
                    ➕ Add Tracker
                </button>
            </div>
        `;
    } else {
        html += '<div style="padding: 12px;">';
        
        trackers.forEach(tracker => {
            // Get template icon if available
            const template = window.TrackerTemplates ? 
                TrackerTemplates.getTemplateList().find(t => t.id === tracker.templateId) : null;
            const icon = template ? template.icon : '📊';
            
            html += `
                <button onclick="openSpecificTracker('${tracker.id}'); closeTrackerList();" 
                        class="tracker-list-btn"
                        style="width: 100%; padding: 12px; margin-bottom: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; text-align: left; transition: all 0.2s; display: flex; align-items: center; gap: 8px; font-size: 13px;"
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    <span style="font-size: 18px;">${icon}</span>
                    <span>${tracker.templateName || 'Health Tracker'}</span>
                </button>
            `;
        });
        
        // Add button to create new tracker
        html += `
            <button onclick="openTemplateSelection(); closeTrackerList();" 
                    style="width: 100%; padding: 10px; margin-top: 4px; background: rgba(99, 102, 241, 0.1); color: #6366f1; border: 2px dashed #6366f1; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;"
                    onmouseover="this.style.background='rgba(99, 102, 241, 0.2)'"
                    onmouseout="this.style.background='rgba(99, 102, 241, 0.1)'">
                ➕ Add New Tracker
            </button>
        `;
        
        html += '</div>';
    }
    
    container.innerHTML = html;
    
    console.log('✅ Tracker buttons rendered');
}

// Open template selection modal
function openTemplateSelection() {
    console.log('📋 Opening template selection...');
    
    if (window.TrackerModule && TrackerModule.openTemplateSelection) {
        TrackerModule.openTemplateSelection();
    } else {
        alert('Template selection is loading. Please try again in a moment.');
    }
}

// Open specific tracker modal
function openSpecificTracker(trackerId) {
    console.log(`📊 Opening tracker: ${trackerId}`);
    
    if (window.TrackerModule && TrackerModule.openSpecificTracker) {
        TrackerModule.openSpecificTracker(trackerId);
    } else if (window.openSpecificTracker) {
        window.openSpecificTracker(trackerId);
    } else {
        alert('Tracker is loading. Please try again in a moment.');
    }
}

// Make everything globally available for debugging
window.CompassUI = {
    renderSidebarAvatars,
    updateHeaderBadge,
    renderScheduleWithFocus,
    renderTrackerButtons,
    openWellnessJournal: function() {
        console.log('⚕️ CompassUI.openWellnessJournal called');
        const actualFunction = typeof openWellnessJournal === 'function' ? openWellnessJournal : null;
        if (actualFunction) {
            actualFunction();
        } else {
            console.log('❌ openWellnessJournal function not found');
        }
    },
    selectScheduleItem,
    patchProfileModule,
    patchUICore,
    initCompatibilityBridge,
    refresh: function() {
        console.log('🔄 Manual refresh called');
        renderSidebarAvatars();
        updateHeaderBadge();
        renderScheduleWithFocus();
        renderTrackerButtons();
    }
};

// Replace the stub functions with real implementations
window.openWellnessJournal = openWellnessJournal;  // Reference the actual function defined above
window.selectScheduleItem = selectScheduleItem;
window.toggleScheduleComplete = toggleScheduleComplete;
window.closeTrackerList = closeTrackerList;
window.renderTrackerButtons = renderTrackerButtons;
window.openTemplateSelection = openTemplateSelection;
window.openSpecificTracker = openSpecificTracker;

console.log('✅ All global functions assigned');
console.log('✅ openWellnessJournal is now:', typeof window.openWellnessJournal);

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompatibilityBridge);
} else {
    initCompatibilityBridge();
}

console.log('✅ CompassUI object created and available globally');
