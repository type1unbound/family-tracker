// ========================================
// COMPASS UI COMPATIBILITY BRIDGE
// Replace your existing compass-compatibility.js with this file
// ========================================

console.log('🧭 Compass Compatibility Bridge Loading...');

// ========================================
// EARLY FUNCTION STUBS
// ========================================

window.openWellnessJournal = function() {
    console.log('⚕️ openWellnessJournal stub called');
    if (window.CompassUI?.openWellnessJournal) {
        window.CompassUI.openWellnessJournal();
    } else {
        setTimeout(() => {
            if (window.CompassUI?.openWellnessJournal) {
                window.CompassUI.openWellnessJournal();
            }
        }, 200);
    }
};

window.closeTrackerList = function() { console.log('closeTrackerList stub'); };
window.renderTrackerButtons = function() { console.log('renderTrackerButtons stub'); };
window.openTemplateSelection = function() { console.log('openTemplateSelection stub'); };
window.openSpecificTracker = function(id) { console.log('openSpecificTracker stub:', id); };

// ========================================
// CREATE REQUIRED LEGACY ELEMENTS
// ========================================

const LEGACY_ELEMENTS = [
    { id: 'child-buttons-container', tag: 'div' },
    { id: 'add-child-btn', tag: 'button' },
    { id: 'tracker-buttons-container', tag: 'div' },
    { id: 'schedule-buttons-container', tag: 'div' },
    { id: 'schedule-detail-container', tag: 'div' },
    { id: 'schedule-list', tag: 'div' },
    { id: 'weekly-goals-container', tag: 'div' },
    { id: 'character-sections', tag: 'div' }
];

function createRequiredElements() {
    console.log('🔨 Creating legacy elements...');
    LEGACY_ELEMENTS.forEach(({ id, tag }) => {
        if (!document.getElementById(id)) {
            const element = document.createElement(tag);
            element.id = id;
            element.style.display = 'none';
            document.body.appendChild(element);
            console.log(`  ✓ Created: #${id}`);
        }
    });
}

if (document.body) {
    createRequiredElements();
} else {
    document.addEventListener('DOMContentLoaded', createRequiredElements);
}

// ========================================
// RENDER FUNCTIONS
// ========================================

function renderSidebarAvatars() {
    console.log('🎨 renderSidebarAvatars() called');
    
    const container = document.getElementById('sidebar-avatars-container');
    if (!container) return;
    
    if (!window.StateManager || !StateManager.state) return;
    
    const children = StateManager.state.children || StateManager.state.data?.children || [];
    const currentChildId = StateManager.state.currentChild;
    
    console.log(`🎨 Rendering ${children.length} avatars`);
    
    container.innerHTML = '';
    
    children.forEach(childId => {
        const child = StateManager.getChild(childId);
        if (!child) return;
        
        const avatar = document.createElement('div');
        avatar.className = 'sidebar-avatar';
        if (childId === currentChildId) {
            avatar.classList.add('active');
        }
        
        if (child.colorPalette && window.CONFIG?.COLOR_PALETTES) {
            const palette = CONFIG.COLOR_PALETTES[child.colorPalette];
            if (palette) {
                avatar.style.background = `linear-gradient(135deg, ${palette.bgGradient1}, ${palette.bgGradient2})`;
            }
        }
        
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
        
        const nameLabel = document.createElement('div');
        nameLabel.className = 'name';
        nameLabel.textContent = child.name;
        avatar.appendChild(nameLabel);
        
        avatar.onclick = () => {
            if (window.UICore?.selectChild) {
                UICore.selectChild(childId);
            }
        };
        
        container.appendChild(avatar);
    });
}

function updateHeaderBadge() {
    console.log('🏷️ updateHeaderBadge() called');
    
    if (!window.StateManager) return;
    
    const currentChild = StateManager.getCurrentChild();
    if (!currentChild) return;
    
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
        
        if (currentChild.colorPalette && window.CONFIG?.COLOR_PALETTES) {
            const palette = CONFIG.COLOR_PALETTES[currentChild.colorPalette];
            if (palette) {
                avatarEl.style.background = `linear-gradient(135deg, ${palette.bgGradient1}, ${palette.bgGradient2})`;
            }
        }
    }
}

function renderScheduleWithFocus() {
    console.log('📅 renderScheduleWithFocus() called');
    
    const scheduleContainer = document.getElementById('schedule-buttons-container');
    const detailContainer = document.getElementById('schedule-detail-container');
    
    if (!scheduleContainer) return;
    if (!window.StateManager?.state) return;
    
    const currentChild = StateManager.getCurrentChild();
    if (!currentChild?.schedule) return;
    
    const schedule = currentChild.schedule;
    const focusedId = StateManager.state.focusedScheduleId || (schedule.length > 0 ? schedule[0].id : null);
    
    scheduleContainer.innerHTML = '';
    
    schedule.forEach(item => {
        const isFocused = item.id === focusedId;
        const dayData = StateManager.getDayData();
        const status = dayData.schedule[item.id];
        const completed = status === true;
        
        const div = document.createElement('div');
        div.className = `schedule-item ${isFocused ? 'in-focus' : 'out-of-focus'}`;
        div.onclick = () => selectScheduleItem(item.id);
        
        let statusBadge = '';
        if (completed) {
            statusBadge = '<span class="status-badge completed">✓ Completed</span>';
        } else if (isFocused) {
            const taskCount = item.tasks?.length || 0;
            statusBadge = `<span class="status-badge in-progress">⏳ ${taskCount} tasks</span>`;
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
    
    const hint = document.createElement('div');
    hint.className = 'scroll-hint';
    hint.textContent = '↕️ Click to focus';
    scheduleContainer.appendChild(hint);
    
    if (detailContainer && focusedId) {
        const focusedItem = schedule.find(item => item.id === focusedId);
        if (focusedItem) {
            renderScheduleDetails(focusedItem, detailContainer);
        }
    }
}

function renderScheduleDetails(item, container) {
    const dayData = StateManager.getDayData();
    const status = dayData.schedule[item.id];
    const completed = status === true;
    const taskCount = item.tasks?.length || 0;
    
    container.innerHTML = `
        <div class="detail-header">
            <div class="detail-time">${item.time}</div>
            <div class="detail-name">${item.name}</div>
        </div>
        
        ${taskCount > 0 ? `
        <div class="progress-section">
            <div class="progress-label">
                <span>Task Checklist</span>
                <span>${taskCount} tasks</span>
            </div>
        </div>
        ` : ''}
        
        <div class="section-subtitle">Tasks & Expectations</div>
        
        <div class="detail-tasks">
            ${item.tasks && item.tasks.length > 0 ? item.tasks.map((task, index) => `
                <div class="task-item">
                    <input type="checkbox" class="task-checkbox" id="task-${item.id}-${index}">
                    <div class="task-text">${task}</div>
                </div>
            `).join('') : '<p style="color: #6b7280; font-size: 14px;">No tasks defined</p>'}
            
            ${taskCount > 0 ? `
            <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 1px solid #fbbf24; border-radius: 10px; padding: 12px; margin-top: 12px;">
                <div style="font-size: 12px; font-weight: 700; color: #78350f; margin-bottom: 4px;">💡 Helpful Tip</div>
                <div style="font-size: 11px; color: #78350f; line-height: 1.4;">Mark complete when all tasks are done!</div>
            </div>
            ` : ''}
        </div>
        
        <button class="complete-btn ${completed ? 'completed' : ''}" onclick="toggleScheduleComplete('${item.id}')">
            ${completed ? '✓ Completed' : '✓ Mark Activity Complete'}
        </button>
    `;
}

function selectScheduleItem(itemId) {
    console.log(`🎯 Selecting schedule item: ${itemId}`);
    if (window.StateManager) {
        StateManager.state.focusedScheduleId = itemId;
        renderScheduleWithFocus();
    }
}

function toggleScheduleComplete(itemId) {
    console.log(`✓ Toggling completion for: ${itemId}`);
    if (window.ScheduleModule?.setScheduleStatus) {
        const dayData = StateManager.getDayData();
        const currentStatus = dayData.schedule[itemId];
        ScheduleModule.setScheduleStatus(itemId, !currentStatus);
    }
    renderScheduleWithFocus();
}

function renderCharacterGrowth() {
    console.log('⭐ renderCharacterGrowth() called');
    
    const container = document.getElementById('character-sections');
    if (!container) return;
    
    const currentChild = StateManager.getCurrentChild();
    if (!currentChild) return;
    
    const dayData = StateManager.getDayData();
    const characterValues = StateManager.getCharacterValues();
    
    let html = '';
    
    characterValues.forEach(category => {
        const mult = dayData.categoryMultipliers?.[category.id] || 1.0;
        
        html += `
            <div class="character-category">
                <div class="character-category-title">${category.category}</div>
                ${category.items.map(item => {
                    const traitKey = `${category.id}_${item.replace(/\s+/g, '_')}`;
                    const traitRating = dayData.traitRatings?.[traitKey] || mult;
                    
                    return `
                        <div class="character-trait-item">
                            <div class="character-trait-text">${item}</div>
                            <div class="rating-buttons">
                                <button 
                                    class="rating-btn ${traitRating === 2.0 ? 'active level-3' : ''}" 
                                    onclick="setTraitRating('${traitKey}', 2.0)">
                                    Excelling
                                </button>
                                <button 
                                    class="rating-btn ${traitRating === 1.5 ? 'active level-2' : ''}" 
                                    onclick="setTraitRating('${traitKey}', 1.5)">
                                    Progress
                                </button>
                                <button 
                                    class="rating-btn ${traitRating === 1.0 ? 'active level-1' : ''}" 
                                    onclick="setTraitRating('${traitKey}', 1.0)">
                                    Starting
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    });
    
    html += `
        <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); padding: 12px; border-radius: 10px; border: 1px solid #86efac; margin-top: 12px;">
            <div style="font-size: 11px; font-weight: 700; color: #166534; margin-bottom: 4px;">💡 Growth Multipliers</div>
            <div style="font-size: 10px; color: #166534; line-height: 1.4;">
                <strong>Starting</strong> 1.0x · <strong>Progress</strong> 1.5x · <strong>Excelling</strong> 2.0x
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function setTraitRating(traitKey, rating) {
    console.log(`⭐ Setting rating for ${traitKey}: ${rating}x`);
    
    const dayData = StateManager.getDayData();
    
    if (!dayData.traitRatings) {
        dayData.traitRatings = {};
    }
    
    dayData.traitRatings[traitKey] = rating;
    
    const categoryId = traitKey.split('_')[0];
    const categoryTraits = Object.keys(dayData.traitRatings).filter(k => k.startsWith(categoryId + '_'));
    if (categoryTraits.length > 0) {
        const avgRating = categoryTraits.reduce((sum, k) => sum + dayData.traitRatings[k], 0) / categoryTraits.length;
        dayData.categoryMultipliers[categoryId] = avgRating;
    }
    
    if (window.saveData) saveData();
    if (window.UICore) {
        UICore.updateUI();
    } else {
        renderCharacterGrowth();
    }
}

function renderWeeklyGoals() {
    console.log('🎯 renderWeeklyGoals() called');
    
    const container = document.getElementById('weekly-goals-container');
    if (!container) return;
    
    const currentChild = StateManager.getCurrentChild();
    if (!currentChild) return;
    
    const weeklyChores = currentChild.weeklyChores || [];
    const weeklyChoresData = window.PointsModule?.getWeeklyChoresData() || {};
    const choresCompletion = window.PointsModule?.calculateChoresCompletion() || {
        completed: 0, 
        total: 0, 
        percentage: 0, 
        isComplete: false
    };
    
    let html = `
        <div class="goals-progress">
            <div class="goals-progress-text">Weekly Completion</div>
            <div class="goals-progress-number">${choresCompletion.percentage}%</div>
            <div class="goals-subtext">${choresCompletion.isComplete ? '🎉 5x BONUS ACTIVE!' : `Complete ${choresCompletion.total - choresCompletion.completed} more for 5x bonus!`}</div>
        </div>
        
        <div class="week-range">Mon-Sun · Resets Weekly</div>
    `;
    
    weeklyChores.forEach(chore => {
        const isComplete = weeklyChoresData[chore.id];
        html += `
            <div class="weekly-goal-item ${isComplete ? 'completed' : ''}" onclick="toggleWeeklyChore('${chore.id}')">
                <input type="checkbox" class="weekly-goal-checkbox" ${isComplete ? 'checked' : ''}>
                <div class="weekly-goal-text">${chore.name}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function toggleWeeklyChore(choreId) {
    console.log(`🎯 Toggling chore: ${choreId}`);
    
    const dayData = StateManager.getDayData();
    
    if (!dayData.weeklyChores) {
        dayData.weeklyChores = {};
    }
    
    dayData.weeklyChores[choreId] = !dayData.weeklyChores[choreId];
    
    if (window.saveData) saveData();
    if (window.UICore) {
        UICore.updateUI();
    } else {
        renderWeeklyGoals();
    }
}

function openWellnessJournal() {
    console.log('⚕️ openWellnessJournal() called');
    
    const container = document.getElementById('tracker-buttons-container');
    if (!container) {
        console.error('❌ tracker-buttons-container not found');
        return;
    }
    
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
        renderTrackerButtons();
        setTimeout(() => {
            document.addEventListener('click', closeTrackerListOnClickOutside);
        }, 100);
    } else {
        closeTrackerList();
    }
}

function closeTrackerList() {
    const container = document.getElementById('tracker-buttons-container');
    if (container) {
        container.style.display = 'none';
    }
    document.removeEventListener('click', closeTrackerListOnClickOutside);
}

function closeTrackerListOnClickOutside(event) {
    const container = document.getElementById('tracker-buttons-container');
    const wellnessBtn = event.target.closest('.sidebar-action-btn.wellness');
    
    if (container && !container.contains(event.target) && !wellnessBtn) {
        closeTrackerList();
    }
}

function renderTrackerButtons() {
    console.log('📊 renderTrackerButtons() called');
    
    const container = document.getElementById('tracker-buttons-container');
    if (!container) return;
    
    const currentChild = StateManager.getCurrentChild();
    if (!currentChild) {
        container.innerHTML = `
            <div style="padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h3 style="font-size: 14px; font-weight: 700; color: #111827; margin: 0;">Wellness Journal</h3>
                    <button onclick="closeTrackerList()" style="background: none; border: none; font-size: 20px; color: #9ca3af; cursor: pointer; padding: 0; line-height: 1;">×</button>
                </div>
                <p style="color: #6b7280; font-size: 12px; text-align: center;">No child selected</p>
            </div>
        `;
        return;
    }
    
    const trackers = currentChild.trackers || [];
    
    let html = `
        <div style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 14px; font-weight: 700; color: #111827; margin: 0;">Wellness Journal</h3>
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
            const template = window.TrackerTemplates?.getTemplateList()?.find(t => t.id === tracker.templateId);
            const icon = template ? template.icon : '📊';
            
            html += `
                <button onclick="openSpecificTracker('${tracker.id}'); closeTrackerList();" 
                        style="width: 100%; padding: 12px; margin-bottom: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; text-align: left; transition: all 0.2s; display: flex; align-items: center; gap: 8px; font-size: 13px;"
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    <span style="font-size: 18px;">${icon}</span>
                    <span>${tracker.templateName || 'Health Tracker'}</span>
                </button>
            `;
        });
        
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
}

// ========================================
// PATCH EXISTING MODULES
// ========================================

function patchProfileModule() {
    if (!window.ProfileModule) return;
    
    const originalRenderChildButtons = ProfileModule.renderChildButtons;
    ProfileModule.renderChildButtons = function() {
        const container = document.getElementById('child-buttons-container');
        if (container) container.innerHTML = '';
        renderSidebarAvatars();
        updateHeaderBadge();
    };
    
    const originalUpdateChildButtons = ProfileModule.updateChildButtons;
    ProfileModule.updateChildButtons = function() {
        if (originalUpdateChildButtons) originalUpdateChildButtons.call(this);
        renderSidebarAvatars();
        updateHeaderBadge();
    };
}

function patchUICore() {
    if (!window.UICore) return;
    
    const originalUpdateUI = UICore.updateUI;
    UICore.updateUI = function() {
        if (originalUpdateUI) originalUpdateUI.call(this);
        renderSidebarAvatars();
        updateHeaderBadge();
        renderScheduleWithFocus();
        renderCharacterGrowth();
        renderWeeklyGoals();
    };
    
    const originalSelectChild = UICore.selectChild;
    UICore.selectChild = function(childId) {
        if (originalSelectChild) originalSelectChild.call(this, childId);
        renderSidebarAvatars();
        updateHeaderBadge();
        renderScheduleWithFocus();
        renderCharacterGrowth();
        renderWeeklyGoals();
    };
}

function patchCharacterModule() {
    if (!window.CharacterModule) return;
    
    const originalRenderCharacterSections = CharacterModule.renderCharacterSections;
    CharacterModule.renderCharacterSections = function() {
        if (document.getElementById('character-sections')) {
            renderCharacterGrowth();
        } else if (originalRenderCharacterSections) {
            originalRenderCharacterSections.call(this);
        }
    };
    
    const originalRenderWeeklyChores = CharacterModule.renderWeeklyChores;
    CharacterModule.renderWeeklyChores = function() {
        if (document.getElementById('weekly-goals-container')) {
            renderWeeklyGoals();
        } else if (originalRenderWeeklyChores) {
            originalRenderWeeklyChores.call(this);
        }
    };
}

// ========================================
// INITIALIZATION
// ========================================

function initCompatibilityBridge() {
    console.log('🔧 Initializing Compass UI compatibility...');
    
    const checkProfileModule = setInterval(() => {
        if (window.ProfileModule) {
            clearInterval(checkProfileModule);
            patchProfileModule();
        }
    }, 50);
    
    const checkUICore = setInterval(() => {
        if (window.UICore) {
            clearInterval(checkUICore);
            patchUICore();
        }
    }, 50);
    
    const checkCharacterModule = setInterval(() => {
        if (window.CharacterModule) {
            clearInterval(checkCharacterModule);
            patchCharacterModule();
        }
    }, 50);
    
    let retryCount = 0;
    const maxRetries = 10;
    const retryInterval = setInterval(() => {
        retryCount++;
        
        const children = StateManager?.state?.children || StateManager?.state?.data?.children;
        
        if (window.StateManager && StateManager.state && children && children.length > 0) {
            console.log('✅ Data found! Rendering UI...');
            clearInterval(retryInterval);
            renderSidebarAvatars();
            updateHeaderBadge();
            renderScheduleWithFocus();
            renderCharacterGrowth();
            renderWeeklyGoals();
        } else if (retryCount >= maxRetries) {
            console.log('❌ Max retries reached');
            clearInterval(retryInterval);
        }
    }, 200);
}

// ========================================
// GLOBAL EXPORTS
// ========================================

window.CompassUI = {
    renderSidebarAvatars,
    updateHeaderBadge,
    renderScheduleWithFocus,
    renderCharacterGrowth,
    renderWeeklyGoals,
    renderTrackerButtons,
    openWellnessJournal,
    selectScheduleItem,
    refresh: function() {
        renderSidebarAvatars();
        updateHeaderBadge();
        renderScheduleWithFocus();
        renderCharacterGrowth();
        renderWeeklyGoals();
    }
};

window.openWellnessJournal = openWellnessJournal;
window.selectScheduleItem = selectScheduleItem;
window.toggleScheduleComplete = toggleScheduleComplete;
window.closeTrackerList = closeTrackerList;
window.renderTrackerButtons = renderTrackerButtons;
window.setTraitRating = setTraitRating;
window.toggleWeeklyChore = toggleWeeklyChore;

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompatibilityBridge);
} else {
    initCompatibilityBridge();
}

console.log('✅ Compass Compatibility Bridge Loaded');
