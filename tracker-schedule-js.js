/**
 * SCHEDULE.JS - Schedule Management
 * Handles daily routine/schedule features
 */

const ScheduleModule = {
    /**
     * Render schedule list
     */
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
                                    onclick="ScheduleModule.setScheduleStatus(${item.id}, true)"
                                >✓ Yes</button>
                                <button 
                                    class="yes-no-btn ${isNo ? 'no' : ''}" 
                                    onclick="ScheduleModule.setScheduleStatus(${item.id}, false)"
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

    /**
     * Set schedule status (Yes/No)
     */
    setScheduleStatus(scheduleId, status) {
        const dayData = StateManager.getDayData();
        if (dayData.schedule[scheduleId] === status) {
            delete dayData.schedule[scheduleId];
        } else {
            dayData.schedule[scheduleId] = status;
        }
        saveData();
        if (window.UICore) {
            UICore.updateUI();
        }
    },

    /**
     * Edit schedule item
     */
    editScheduleItem(index) {
        const schedule = StateManager.getSchedule(false);
        StateManager.state.modalData = { 
            type: 'edit', 
            index, 
            item: JSON.parse(JSON.stringify(schedule[index])) 
        };
        
        document.getElementById('modal-time').value = schedule[index].time;
        document.getElementById('modal-name').value = schedule[index].name;
        
        const days = schedule[index].days || [0,1,2,3,4,5,6];
        ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach((dayName, idx) => {
            const dayValue = idx === 6 ? 0 : idx + 1;
            const checkbox = document.getElementById(`day-${dayName}`);
            if (checkbox) {
                checkbox.checked = days.includes(dayValue);
            }
        });
        
        const tasksList = document.getElementById('modal-tasks');
        tasksList.innerHTML = schedule[index].tasks.map((task, i) => `
            <li class="task-edit-item">
                <input type="text" class="edit-input" value="${task}" data-index="${i}">
                <button class="edit-btn delete" onclick="ScheduleModule.removeModalTask(${i})">🗑️</button>
            </li>
        `).join('');
        
        document.getElementById('schedule-modal').classList.add('active');
    },

    /**
     * Add new schedule item
     */
    addScheduleItem() {
        const schedule = StateManager.getSchedule(false);
        const newId = schedule.length > 0 ? Math.max(...schedule.map(s => s.id)) + 1 : 1;
        StateManager.state.modalData = { 
            type: 'add', 
            item: { id: newId, time: '', name: '', tasks: [], days: [0,1,2,3,4,5,6] } 
        };
        
        document.getElementById('modal-time').value = '';
        document.getElementById('modal-name').value = '';
        document.getElementById('modal-tasks').innerHTML = '';
        
        ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(dayName => {
            const checkbox = document.getElementById(`day-${dayName}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        document.getElementById('schedule-modal').classList.add('active');
    },

    /**
     * Delete schedule item
     */
    deleteScheduleItem(index) {
        if (confirm('Delete this schedule item?')) {
            const schedule = StateManager.getSchedule(false);
            schedule.splice(index, 1);
            saveData();
            if (window.UICore) {
                UICore.updateUI();
            }
        }
    },

    /**
     * Add task to modal
     */
    addModalTask() {
        const tasksList = document.getElementById('modal-tasks');
        const index = tasksList.children.length;
        const li = document.createElement('li');
        li.className = 'task-edit-item';
        li.innerHTML = `
            <input type="text" class="edit-input" placeholder="New task" data-index="${index}">
            <button class="edit-btn delete" onclick="ScheduleModule.removeModalTask(${index})">🗑️</button>
        `;
        tasksList.appendChild(li);
    },

    /**
     * Remove task from modal
     */
    removeModalTask(index) {
        const tasksList = document.getElementById('modal-tasks');
        const items = Array.from(tasksList.children);
        if (items[index]) {
            items[index].remove();
        }
    },

    /**
     * Save schedule item
     */
    saveScheduleItem() {
        const time = document.getElementById('modal-time').value;
        const name = document.getElementById('modal-name').value;
        const taskInputs = document.querySelectorAll('#modal-tasks input');
        const tasks = Array.from(taskInputs).map(input => input.value).filter(v => v.trim());
        
        const days = [];
        ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach((dayName, idx) => {
            const dayValue = idx === 6 ? 0 : idx + 1;
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
        
        const schedule = StateManager.getSchedule(false);
        if (StateManager.state.modalData.type === 'edit') {
            schedule[StateManager.state.modalData.index].time = time;
            schedule[StateManager.state.modalData.index].name = name;
            schedule[StateManager.state.modalData.index].tasks = tasks;
            schedule[StateManager.state.modalData.index].days = days;
        } else {
            schedule.push({
                id: StateManager.state.modalData.item.id,
                time,
                name,
                tasks,
                days
            });
        }
        
        // Sort schedule by time
        schedule.sort((a, b) => {
            const timeA = StateManager.convertTimeToMinutes(a.time);
            const timeB = StateManager.convertTimeToMinutes(b.time);
            return timeA - timeB;
        });
        
        saveData();
        this.closeModal();
        if (window.UICore) {
            UICore.updateUI();
        }
    },

    /**
     * Close modal
     */
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        StateManager.state.modalData = null;
    }
};

// Make module available globally
window.ScheduleModule = ScheduleModule;
