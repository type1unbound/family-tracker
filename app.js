// ========================================
// REWARDS MODULE
// ========================================
const RewardsModule = {
    renderRewardsStore() {
        const child = StateManager.getCurrentChild();
        if (!child) return;
        
        const container = document.getElementById('rewards-grid');
        const balanceEl = document.getElementById('rewards-balance');
        
        if (!container || !balanceEl) {
            console.warn('⚠️ Rewards UI elements not found');
            return;
        }
        
        // Initialize rewards array if it doesn't exist
        if (!child.rewards) {
            child.rewards = [];
        }
        
        // Update balance display
        balanceEl.textContent = child.pointsBalance || 0;
        
        const isEditMode = StateManager.state.editMode;
        
        // Group rewards by category
        const categories = {
            'privilege': { name: 'Privileges', icon: '🎯', rewards: [] },
            'experience': { name: 'Experiences', icon: '🎉', rewards: [] },
            'item': { name: 'Items', icon: '🎁', rewards: [] },
            'quality-time': { name: 'Quality Time', icon: '💝', rewards: [] },
            'family-time': { name: 'Family Time', icon: '👨‍👩‍👧‍👦', rewards: [] },
            'custom': { name: 'Other', icon: '⭐', rewards: [] }
        };
        
        // Sort rewards into categories
        child.rewards.forEach(reward => {
            const category = reward.category || 'custom';
            if (categories[category]) {
                categories[category].rewards.push(reward);
            }
        });
        
        // Render rewards by category
        let html = '';
        
        Object.entries(categories).forEach(([categoryId, categoryData]) => {
            if (categoryData.rewards.length > 0) {
                html += `
                    <div class="rewards-category-header">
                        <span>${categoryData.icon} ${categoryData.name}</span>
                        <span style="font-size: 12px; color: #6b7280;">(${categoryData.rewards.length})</span>
                    </div>
                `;
                
                categoryData.rewards.forEach(reward => {
                    const canAfford = child.pointsBalance >= reward.cost;
                    const isPurchased = reward.purchased || false;
                    
                    html += `
                        <div class="reward-card ${!canAfford && !isPurchased ? 'disabled' : ''} ${isPurchased ? 'purchased' : ''}"
                             onclick="${!isEditMode && !isPurchased && canAfford ? `RewardsModule.purchaseReward('${reward.id}')` : ''}">
                            ${isPurchased ? '<div class="purchased-badge">✓ EARNED</div>' : ''}
                            <div class="reward-icon">${this.getCategoryIcon(reward.category)}</div>
                            <div class="reward-name">${reward.name}</div>
                            <div class="reward-cost">
                                <span style="font-size: 20px; font-weight: 700;">${reward.cost}</span>
                                <span style="font-size: 12px; color: #6b7280;">points</span>
                            </div>
                            ${!isEditMode && !isPurchased ? `
                                <button class="reward-purchase-btn ${!canAfford ? 'disabled' : ''}"
                                        onclick="event.stopPropagation(); RewardsModule.purchaseReward('${reward.id}')">
                                    ${canAfford ? '🎁 Claim Reward' : '🔒 Not Enough Points'}
                                </button>
                            ` : ''}
                            ${isEditMode ? `
                                <div class="reward-edit-controls">
                                    <button class="edit-btn" onclick="event.stopPropagation(); RewardsModule.editReward('${reward.id}')">✏️ Edit</button>
                                    <button class="edit-btn delete" onclick="event.stopPropagation(); RewardsModule.deleteReward('${reward.id}')">🗑️ Delete</button>
                                </div>
                            ` : ''}
                        </div>
                    `;
                });
            }
        });
        
        // Add "Add Reward" button in edit mode
        if (isEditMode) {
            html += `
                <button class="add-reward-btn" onclick="RewardsModule.addReward()">
                    + Add Reward
                </button>
            `;
        }
        
        // Show message if no rewards
        if (child.rewards.length === 0) {
            html = '<p style="padding: 40px; text-align: center; color: #6b7280; grid-column: 1 / -1;">No rewards yet. Click Edit to add rewards!</p>';
        }
        
        container.innerHTML = html;
    },
    
    getCategoryIcon(category) {
        const icons = {
            'privilege': '🎯',
            'experience': '🎉',
            'item': '🎁',
            'quality-time': '💝',
            'family-time': '👨‍👩‍👧‍👦',
            'custom': '⭐'
        };
        return icons[category] || '⭐';
    },
    
    purchaseReward(rewardId) {
        const child = StateManager.getCurrentChild();
        const reward = child.rewards.find(r => r.id === rewardId);
        
        if (!reward) return;
        
        if (reward.purchased) {
            alert('This reward has already been claimed!');
            return;
        }
        
        if (child.pointsBalance < reward.cost) {
            alert(`Not enough points! You need ${reward.cost} points but only have ${child.pointsBalance}.`);
            return;
        }
        
        if (confirm(`Claim "${reward.name}" for ${reward.cost} points?`)) {
            // Deduct points
            if (child.pointsSpent === undefined) {
                child.pointsSpent = 0;
            }
            child.pointsSpent += reward.cost;
            
            // Mark as purchased
            reward.purchased = true;
            reward.purchasedDate = new Date().toISOString();
            
            // Track in purchase history
            if (!child.purchaseHistory) {
                child.purchaseHistory = [];
            }
            child.purchaseHistory.push({
                rewardId: reward.id,
                rewardName: reward.name,
                cost: reward.cost,
                date: reward.purchasedDate
            });
            
            saveData();
            UICore.updateUI();
            
            alert(`🎉 Congratulations!\n\nYou claimed "${reward.name}"!\n\nNew balance: ${child.pointsBalance - reward.cost} points`);
        }
    },
    
    addReward() {
        StateManager.state.modalData = {
            type: 'add',
            reward: {
                id: 'reward_' + Date.now(),
                name: '',
                cost: 100,
                category: 'privilege',
                purchased: false
            }
        };
        
        document.getElementById('modal-reward-name').value = '';
        document.getElementById('modal-reward-cost').value = 100;
        document.getElementById('modal-reward-category').value = 'privilege';
        
        document.getElementById('reward-modal').classList.add('active');
    },
    
    editReward(rewardId) {
        const child = StateManager.getCurrentChild();
        const reward = child.rewards.find(r => r.id === rewardId);
        
        if (!reward) return;
        
        StateManager.state.modalData = {
            type: 'edit',
            reward: JSON.parse(JSON.stringify(reward))
        };
        
        document.getElementById('modal-reward-name').value = reward.name;
        document.getElementById('modal-reward-cost').value = reward.cost;
        document.getElementById('modal-reward-category').value = reward.category || 'privilege';
        
        document.getElementById('reward-modal').classList.add('active');
    },
    
    deleteReward(rewardId) {
        const child = StateManager.getCurrentChild();
        const reward = child.rewards.find(r => r.id === rewardId);
        
        if (!reward) return;
        
        if (confirm(`Delete "${reward.name}"?\n\nThis cannot be undone.`)) {
            child.rewards = child.rewards.filter(r => r.id !== rewardId);
            saveData();
            UICore.updateUI();
        }
    },
    
    saveReward() {
        const name = document.getElementById('modal-reward-name').value.trim();
        const cost = parseInt(document.getElementById('modal-reward-cost').value);
        const category = document.getElementById('modal-reward-category').value;
        
        if (!name) {
            alert('Please enter a reward name');
            return;
        }
        
        if (!cost || cost <= 0) {
            alert('Please enter a valid point cost');
            return;
        }
        
        const child = StateManager.getCurrentChild();
        
        if (StateManager.state.modalData.type === 'edit') {
            // Update existing reward
            const reward = child.rewards.find(r => r.id === StateManager.state.modalData.reward.id);
            if (reward) {
                reward.name = name;
                reward.cost = cost;
                reward.category = category;
            }
        } else {
            // Add new reward
            child.rewards.push({
                id: StateManager.state.modalData.reward.id,
                name: name,
                cost: cost,
                category: category,
                purchased: false
            });
        }
        
        saveData();
        this.closeModal();
        UICore.updateUI();
    },
    
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        StateManager.state.modalData = null;
    }
};
