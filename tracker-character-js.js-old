/**
 * CHARACTER.JS - Character Values Management
 * Handles character development tracking and weekly chores
 */

const CharacterModule = {
    /**
     * Render character sections
     */
    renderCharacterSections() {
        const dayData = StateManager.getDayData();
        const container = document.getElementById('character-sections');
        const characterValues = StateManager.getCharacterValues();
        const isEditMode = StateManager.state.editMode;
        
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
                            onclick="CharacterModule.setCategoryMultiplier('${section.id}', 1.0)"
                            style="padding: 12px 8px;">
                            <div class="value" style="font-size: 18px;">1.0x</div>
                            <div class="label" style="font-size: 10px;">Standard</div>
                        </button>
                        <button 
                            class="btn btn-multiplier btn-multiplier-15 ${mult === 1.5 ? 'active' : ''}" 
                            onclick="CharacterModule.setCategoryMultiplier('${section.id}', 1.5)"
                            style="padding: 12px 8px;">
                            <div class="value" style="font-size: 18px;">1.5x</div>
                            <div class="label" style="font-size: 10px;">Good</div>
                        </button>
                        <button 
                            class="btn btn-multiplier btn-multiplier-2 ${mult === 2.0 ? 'active' : ''}" 
                            onclick="CharacterModule.setCategoryMultiplier('${section.id}', 2.0)"
                            style="padding: 12px 8px;">
                            <div class="value" style="font-size: 18px;">2.0x</div>
                            <div class="label" style="font-size: 10px;">Excellent</div>
                        </button>
                    </div>
                </div>
                <textarea 
                    rows="2" 
                    placeholder="Notes about this area..."
                    onchange="CharacterModule.updateCharacterNotes('${section.id}', this.value)"
                >${dayData.characterNotes[section.id] || ''}</textarea>
                ${isEditMode ? `
                    <div class="edit-controls" style="margin-top: 8px;">
                        <button class="edit-btn" onclick="CharacterModule.editCharacterCategory(${index})">✏️ Edit Category</button>
                        <button class="edit-btn delete" onclick="CharacterModule.deleteCharacterCategory(${index})">🗑️ Delete</button>
                    </div>
                ` : ''}
            </div>
        `}).join('');
        
        if (isEditMode) {
            container.innerHTML += `
                <button class="add-item-btn" onclick="CharacterModule.addCharacterCategory()">+ Add Character Category</button>
            `;
        }
        
        // Apply color palette to newly rendered buttons
        const child = StateManager.getCurrentChild();
        const palette = CONFIG.COLOR_PALETTES[child.colorPalette] || CONFIG.COLOR_PALETTES.lavender;
        this.updateCharacterButtonColors(palette);
    },

    /**
     * Update character button colors based on palette
     */
    updateCharacterButtonColors(palette) {
        const multiplierButtons = document.querySelectorAll('.btn-multiplier-1, .btn-multiplier-15, .btn-multiplier-2');
        
        multiplierButtons.forEach(btn => {
            if (btn.classList.contains('btn-multiplier-1')) {
                btn.style.background = palette.characterButton1;
                btn.style.borderColor = palette.characterButton1;
                btn.style.color = '#1f2937';
                if (btn.classList.contains('active')) {
                    btn.style.background = palette.characterButton1;
                    btn.style.borderColor = palette.profileButton;
                    btn.style.borderWidth = '3px';
                }
            } else if (btn.classList.contains('btn-multiplier-15')) {
                btn.style.background = palette.characterButton15;
                btn.style.borderColor = palette.characterButton15;
                btn.style.color = '#1f2937';
                if (btn.classList.contains('active')) {
                    btn.style.background = palette.characterButton15;
                    btn.style.borderColor = palette.profileButton;
                    btn.style.borderWidth = '3px';
                }
            } else if (btn.classList.contains('btn-multiplier-2')) {
                btn.style.background = palette.characterButton2;
                btn.style.borderColor = palette.characterButton2;
                btn.style.color = 'white';
                if (btn.classList.contains('active')) {
                    btn.style.background = palette.characterButton2;
                    btn.style.borderColor = palette.profileButton;
                    btn.style.borderWidth = '3px';
                }
            }
        });
    },

    /**
     * Set category multiplier
     */
    setCategoryMultiplier(categoryId, value) {
        const dayData = StateManager.getDayData();
        dayData.categoryMultipliers[categoryId] = value;
        saveData();
        if (window.UICore) {
            UICore.updateUI();
        }
    },

    /**
     * Update character notes
     */
    updateCharacterNotes(categoryId, notes) {
        const dayData = StateManager.getDayData();
        dayData.characterNotes[categoryId] = notes;
        saveData();
    },

    /**
     * Update daily notes
     */
    updateNotes(notes) {
        const dayData = StateManager.getDayData();
        dayData.notes = notes;
        saveData();
    },

    /**
     * Edit character category
     */
    editCharacterCategory(index) {
        const categories = StateManager.getCharacterValues();
        StateManager.state.modalData = { 
            type: 'edit', 
            index, 
            item: JSON.parse(JSON.stringify(categories[index])) 
        };
        
        document.getElementById('modal-character-category').value = categories[index].category;
        
        const itemsList = document.getElementById('modal-character-items');
        itemsList.innerHTML = categories[index].items.map((item, i) => `
            <li class="task-edit-item">
                <input type="text" class="edit-input" value="${item}" data-index="${i}">
                <button class="edit-btn delete" onclick="CharacterModule.removeModalCharacterItem(${i})">🗑️</button>
            </li>
        `).join('');
        
        document.getElementById('character-modal').classList.add('active');
    },

    /**
     * Add character category
     */
    addCharacterCategory() {
        const categories = StateManager.getCharacterValues();
        const newId = 'category_' + Date.now();
        StateManager.state.modalData = { 
            type: 'add', 
            item: { id: newId, category: '', weight: 0.25, items: [] } 
        };
        
        document.getElementById('modal-character-category').value = '';
        document.getElementById('modal-character-items').innerHTML = '';
        document.getElementById('character-modal').classList.add('active');
    },

    /**
     * Delete character category
     */
    deleteCharacterCategory(index) {
        if (confirm('Delete this character category?')) {
            const categories = StateManager.getCharacterValues();
            categories.splice(index, 1);
            saveData();
            if (window.UICore) {
                UICore.updateUI();
            }
        }
    },

    /**
     * Add modal character item
     */
    addModalCharacterItem() {
        const itemsList = document.getElementById('modal-character-items');
        const index = itemsList.children.length;
        const li = document.createElement('li');
        li.className = 'task-edit-item';
        li.innerHTML = `
            <input type="text" class="edit-input" placeholder="New item" data-index="${index}">
            <button class="edit-btn delete" onclick="CharacterModule.removeModalCharacterItem(${index})">🗑️</button>
        `;
        itemsList.appendChild(li);
    },

    /**
     * Remove modal character item
     */
    removeModalCharacterItem(index) {
        const itemsList = document.getElementById('modal-character-items');
        const items = Array.from(itemsList.children);
        if (items[index]) {
            items[index].remove();
        }
    },

    /**
     * Save character category
     */
    saveCharacterCategory() {
        const category = document.getElementById('modal-character-category').value;
        const itemInputs = document.querySelectorAll('#modal-character-items input');
        const items = Array.from(itemInputs).map(input => input.value).filter(v => v.trim());
        
        if (!category) {
            alert('Please enter a category name');
            return;
        }
        
        const categories = StateManager.getCharacterValues();
        if (StateManager.state.modalData.type === 'edit') {
            categories[StateManager.state.modalData.index].category = category;
            categories[StateManager.state.modalData.index].items = items;
        } else {
            categories.push({
                id: StateManager.state.modalData.item.id,
                category,
                weight: StateManager.state.modalData.item.weight,
                items
            });
        }
        
        saveData();
        this.closeModal();
        if (window.UICore) {
            UICore.updateUI();
        }
    },

    /**
     * Render weekly chores
     */
    renderWeeklyChores() {
        const dayData = StateManager.getDayData();
        const weeklyChoresData = PointsModule.getWeeklyChoresData();
        const choresCompletion = PointsModule.calculateChoresCompletion();
        const chores = StateManager.getWeeklyChores();
        const isEditMode = StateManager.state.editMode;
        
        // Update week range display
        const weekRange = document.getElementById('week-range');
        if (weekRange) {
            weekRange.textContent = StateManager.getWeekRangeDisplay(StateManager.state.currentDate);
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
                <div class="chore-item ${isCompleteThisWeek ? 'completed' : ''}" onclick="CharacterModule.toggleWeeklyChore('${chore.id}')">
                    <div class="chore-name">${chore.name}</div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <div class="checkbox ${isCompleteThisWeek ? 'checked' : ''}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                                <path d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        ${isEditMode ? `
                            <button class="edit-btn" onclick="event.stopPropagation(); CharacterModule.editChore(${index})">✏️</button>
                            <button class="edit-btn delete" onclick="event.stopPropagation(); CharacterModule.deleteChore(${index})">🗑️</button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        if (isEditMode) {
            list.innerHTML += `
                <button class="add-item-btn" onclick="CharacterModule.addChore()">+ Add Chore</button>
            `;
        }
    },

    /**
     * Toggle weekly chore
     */
    toggleWeeklyChore(choreId) {
        const dayData = StateManager.getDayData();
        dayData.weeklyChores[choreId] = !dayData.weeklyChores[choreId];
        saveData();
        if (window.UICore) {
            UICore.updateUI();
        }
    },

    /**
     * Edit chore
     */
    editChore(index) {
        const chores = StateManager.getWeeklyChores();
        StateManager.state.modalData = { 
            type: 'edit', 
            index, 
            item: JSON.parse(JSON.stringify(chores[index])) 
        };
        
        document.getElementById('modal-chore-name').value = chores[index].name;
        document.getElementById('chore-modal').classList.add('active');
    },

    /**
     * Add chore
     */
    addChore() {
        const chores = StateManager.getWeeklyChores();
        const newId = 'chore_' + Date.now();
        StateManager.state.modalData = { 
            type: 'add', 
            item: { id: newId, name: '' } 
        };
        
        document.getElementById('modal-chore-name').value = '';
        document.getElementById('chore-modal').classList.add('active');
    },

    /**
     * Delete chore
     */
    deleteChore(index) {
        const chores = StateManager.getWeeklyChores();
        const goalName = chores[index].name;
        
        StateManager.state.deleteGoalIndex = index;
        
        document.getElementById('delete-goal-name').textContent = `Delete "${goalName}"?`;
        document.getElementById('delete-goal-confirm-modal').classList.add('active');
    },

    /**
     * Close delete goal confirm
     */
    closeDeleteGoalConfirm() {
        document.getElementById('delete-goal-confirm-modal').classList.remove('active');
        delete StateManager.state.deleteGoalIndex;
    },

    /**
     * Confirm delete goal
     */
    confirmDeleteGoal() {
        if (StateManager.state.deleteGoalIndex === undefined) return;
        
        const chores = StateManager.getWeeklyChores();
        chores.splice(StateManager.state.deleteGoalIndex, 1);
        StateManager.getCurrentChild().weeklyChores = chores;
        
        saveData();
        
        document.getElementById('delete-goal-confirm-modal').classList.remove('active');
        delete StateManager.state.deleteGoalIndex;
        
        if (window.UICore) {
            UICore.updateUI();
        }
    },

    /**
     * Save chore
     */
    saveChore() {
        const name = document.getElementById('modal-chore-name').value;
        
        if (!name) {
            alert('Please enter a chore name');
            return;
        }
        
        const chores = StateManager.getWeeklyChores();
        if (StateManager.state.modalData.type === 'edit') {
            chores[StateManager.state.modalData.index].name = name;
        } else {
            chores.push({
                id: StateManager.state.modalData.item.id,
                name
            });
        }
        
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
window.CharacterModule = CharacterModule;
