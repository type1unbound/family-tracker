// ========================================
// SCHEDULE MODULE
// ========================================
const ScheduleModule = {
    currentFocusedItemId: null,
    scrollListenerAttached: false,

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
                         data-item-id="${item.id}">
                        <div class="schedule-header">
                            <div>
                                <div class="schedule-time">${StateManager.formatTime12Hour(item.time)}</div>
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

        // Add padding to schedule list for better scrolling
        if (list) {
            list.style.paddingBottom = '400px';
        }

        // Attach scroll listener if not already attached
        if (!this.scrollListenerAttached) {
            this.attachScrollListener();
        }
    },

    attachScrollListener() {
        const scheduleSection = document.querySelector('.schedule-section');
        if (!scheduleSection) return;

        scheduleSection.addEventListener('scroll', () => this.updateFocusBasedOnScroll());
        this.scrollListenerAttached = true;
        console.log('✅ Scroll-based auto-focus enabled!');
    },

    updateFocusBasedOnScroll() {
        const scheduleSection = document.querySelector('.schedule-section');
        const items = document.querySelectorAll('.timeline-item');
        
        if (!scheduleSection || items.length === 0) return;
        
        const headerHeight = 70;
        const focusZoneTop = headerHeight + 10;
        const focusZoneBottom = focusZoneTop + 100;
        
        const containerRect = scheduleSection.getBoundingClientRect();
        const scrollTop = scheduleSection.scrollTop;
        
        let focusedIndex = -1;
        
        // Special case: if scrolled to very top, focus first item
        if (scrollTop < 20) {
            focusedIndex = 0;
        } else {
            // Find which item is in the focus zone
            items.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();
                const itemTop = itemRect.top - containerRect.top;
                
                if (itemTop >= focusZoneTop && itemTop < focusZoneBottom) {
                    focusedIndex = index;
                }
            });
        }
        
        if (focusedIndex >= 0) {
            const schedule = StateManager.getSchedule();
            const focusedItem = schedule[focusedIndex];
            
            if (focusedItem && this.currentFocusedItemId !== focusedItem.id) {
                console.log('📍 Auto-focusing:', focusedItem.time, focusedItem.name);
                this.renderFocusedScheduleItemById(focusedItem.id);
                this.updateScheduleFocusStates(focusedIndex);
            }
        }
    },
