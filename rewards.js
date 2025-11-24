// ========================================
// REWARDS MODULE - PASTE THIS INTO YOUR APP
// Add after CharacterModule and before UICore
// ========================================

const RewardsModule = {
    /**
     * Render the rewards store grid
     */
    renderRewardsStore() {
        const child = StateManager.getCurrentChild();
        const container = document.getElementById('rewards-grid');
        const balanceEl = document.getElementById('store-balance');
        
        // Safety check
        if (!container) {
            console.warn('rewards-grid container not found');
            return;
        }
        
        // Update balance display
        if (balanceEl) {
            balanceEl.textContent = child.pointsBalance || 0;
        }
        
        // Check if rewards exist
        if (!child.rewards || child.rewards.length === 0) {
            container.innerHTML = `
                <div style="
                    grid-column: 1/-1; 
                    text-align: center; 
                    padding: 60px 20px;
                    background: #f9fafb;
                    border-radius: 12px;
                    border: 2px dashed #e5e7eb;
                ">
                    <div style="font-size: 48px; margin-bottom: 16px;">🎁</div>
                    <h3 style="color: #6b7280; margin: 0 0 8px 0;">No Rewards Yet</h3>
                    <p style="color: #9ca3af; margin: 0;">Use the "📥 Import Setup" button to load rewards from your onboarding assessment.</p>
                </div>
            `;
            return;
        }
        
        // Sort rewards by cost (cheapest first)
        const rewards = child.rewards.sort((a, b) => a.cost - b.cost);
        
        // Category emojis
        const categoryEmoji = {
            digital: '📱',
            privilege: '⭐',
            treat: '🍰',
            social: '👥',
            experience: '🎉',
            item: '🎁',
            rest: '😴',
            'personal-time': '☕',
            convenience: '🛋️',
            'self-care': '💆',
            recognition: '🏅',
            leadership: '👑',
            'quality-time': '❤️',
            tracking: '📊',
            advancement: '📈',
            growth: '📚',
            service: '🤝',
            'family-time': '👨‍👩‍👧',
            hospitality: '🏠',
            relationship: '💑',
            custom: '✨'
        };
        
        // Render reward cards
        container.innerHTML = rewards.map(reward => {
            const canAfford = (child.pointsBalance || 0) >= reward.cost;
            const emoji = categoryEmoji[reward.category] || '🎁';
            
            return `
                <div class="reward-card" 
                     data-reward-id="${reward.id}"
                     onclick="${canAfford ? `RewardsModule.redeemReward('${reward.id}')` : ''}"
                     style="
                        background: ${canAfford ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : '#f9fafb'};
                        border: 2px solid ${canAfford ? '#86efac' : '#e5e7eb'};
                        border-radius: 12px;
                        padding: 20px;
                        ${canAfford ? 'cursor: pointer;' : 'opacity: 0.6;'}
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                     "
                     ${canAfford ? 'onmouseover="this.style.transform=\'translateY(-4px)\'; this.style.boxShadow=\'0 8px 16px rgba(0,0,0,0.1)\';" onmouseout="this.style.transform=\'translateY(0)\'; this.style.boxShadow=\'none\';"' : ''}
                >
                    ${canAfford ? '<div style="position: absolute; top: 8px; right: 8px; background: #22c55e; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">AVAILABLE</div>' : ''}
                    
                    <div style="font-size: 48px; margin-bottom: 12px; text-align: center;">${emoji}</div>
                    
                    <h3 style="
                        font-weight: 600; 
                        margin: 0 0 8px 0; 
                        color: ${canAfford ? '#1f2937' : '#6b7280'}; 
                        font-size: 16px;
                        min-height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                    ">${reward.name}</h3>
                    
                    <div style="
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        gap: 8px;
                        margin-top: 12px;
                        padding-top: 12px;
                        border-top: 1px solid ${canAfford ? '#86efac' : '#e5e7eb'};
                    ">
                        <span style="
                            font-size: 24px; 
                            font-weight: 700; 
                            color: ${canAfford ? '#6366f1' : '#6b7280'};
                        ">${reward.cost}</span>
                        <span style="
                            font-size: 14px; 
                            color: ${canAfford ? '#6366f1' : '#6b7280'};
                            font-weight: 600;
                        ">pts</span>
                    </div>
                    
                    ${!canAfford ? `
                        <div style="
                            margin-top: 8px;
                            text-align: center;
                            color: #ef4444;
                            font-size: 12px;
                            font-weight: 500;
                        ">
                            Need ${reward.cost - (child.pointsBalance || 0)} more points
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        console.log('✅ Rendered', rewards.length, 'rewards');
    },
    
    /**
     * Redeem a reward
     */
    redeemReward(rewardId) {
        const child = StateManager.getCurrentChild();
        const reward = child.rewards ? child.rewards.find(r => r.id === rewardId) : null;
        
        if (!reward) {
            alert('Reward not found!');
            return;
        }
        
        // Check balance
        if ((child.pointsBalance || 0) < reward.cost) {
            alert(`Not enough points!\n\nYou have: ${child.pointsBalance || 0} pts\nNeed: ${reward.cost} pts\nShort: ${reward.cost - (child.pointsBalance || 0)} pts`);
            return;
        }
        
        // Confirm redemption
        if (!confirm(`🎁 Redeem "${reward.name}" for ${reward.cost} points?\n\nNew balance: ${(child.pointsBalance || 0) - reward.cost} pts`)) {
            return;
        }
        
        // Deduct points
        child.pointsSpent = (child.pointsSpent || 0) + reward.cost;
        
        // Initialize reward history if needed
        if (!child.rewardHistory) {
            child.rewardHistory = [];
        }
        
        // Log transaction
        child.rewardHistory.push({
            rewardId: reward.id,
            rewardName: reward.name,
            cost: reward.cost,
            category: reward.category,
            redeemedAt: new Date().toISOString(),
            redeemedDate: new Date().toLocaleDateString()
        });
        
        console.log('✅ Reward redeemed:', reward.name, 'for', reward.cost, 'pts');
        
        // Save data
        if (window.saveData) {
            window.saveData();
        }
        
        // Update UI
        this.renderRewardsStore();
        if (window.UICore) {
            UICore.updateUI();
        }
        
        // Success message
        alert(`✨ Enjoy your reward!\n\n🎁 ${reward.name}\n\n💰 New balance: ${child.pointsBalance || 0} pts`);
    },
    
    /**
     * Get reward history for current child
     */
    getRewardHistory() {
        const child = StateManager.getCurrentChild();
        return child.rewardHistory || [];
    },
    
    /**
     * Show reward history modal
     */
    showRewardHistory() {
        const history = this.getRewardHistory();
        
        if (history.length === 0) {
            alert('No rewards redeemed yet!');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>🏆 Reward History</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div style="max-height: 400px; overflow-y: auto;">
                        ${history.reverse().map(item => `
                            <div style="
                                padding: 12px;
                                background: #f9fafb;
                                border-radius: 8px;
                                margin-bottom: 8px;
                                border-left: 4px solid #6366f1;
                            ">
                                <div style="font-weight: 600; margin-bottom: 4px;">${item.rewardName}</div>
                                <div style="display: flex; justify-content: space-between; font-size: 13px; color: #6b7280;">
                                    <span>${item.redeemedDate}</span>
                                    <span style="font-weight: 600; color: #6366f1;">${item.cost} pts</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="
                        margin-top: 16px;
                        padding: 12px;
                        background: #f0f9ff;
                        border-radius: 8px;
                        text-align: center;
                    ">
                        <strong>Total Spent:</strong> ${history.reduce((sum, item) => sum + item.cost, 0)} points
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
};

// Export globally
window.RewardsModule = RewardsModule;

console.log('✅ Rewards Module loaded');
