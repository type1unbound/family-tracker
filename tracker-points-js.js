/**
 * POINTS.JS - Points Calculation Engine
 * Handles all points calculations, goals, and weekly chores
 */

const PointsModule = {
    /**
     * Calculate points for a specific child and date
     * @param {string} childId - Child identifier
     * @param {string} date - Date string (YYYY-MM-DD)
     * @param {boolean} includeWeeklyBonus - Whether to apply weekly chores bonus
     * @returns {object} Points breakdown
     */
    calculatePoints(childId, date, includeWeeklyBonus = false) {
        const child = StateManager.getChild(childId);
        const dayData = child.days[date] || { 
            schedule: {}, 
            categoryMultipliers: {
                conflict: 1.0,
                respect: 1.0,
                etiquette: 1.0,
                transitions: 1.0
            }
        };
        
        // Count completed schedule items (only 'yes' counts)
        const completed = Object.values(dayData.schedule).filter(v => v === true).length;
        const base = completed;
        
        // Calculate weighted average multiplier from character values
        let totalMultiplier = 0;
        let totalWeight = 0;
        const savedChild = StateManager.state.currentChild;
        StateManager.state.currentChild = childId;
        const characterValues = StateManager.getCharacterValues();
        StateManager.state.currentChild = savedChild;
        
        characterValues.forEach(cat => {
            const mult = dayData.categoryMultipliers[cat.id] || 1.0;
            totalMultiplier += mult * cat.weight;
            totalWeight += cat.weight;
        });
        const avgMultiplier = totalWeight > 0 ? totalMultiplier / totalWeight : 1.0;
        
        // Calculate daily points (without weekly bonus)
        const dailyTotal = Math.round(base * avgMultiplier);
        
        // Apply weekly chores bonus only if requested
        let choresMultiplier = 1.0;
        let choresComplete = false;
        
        if (includeWeeklyBonus) {
            const currentSavedChild = StateManager.state.currentChild;
            StateManager.state.currentChild = childId;
            const choresData = this.calculateChoresCompletion();
            StateManager.state.currentChild = currentSavedChild;
            
            choresMultiplier = choresData.isComplete ? 5.0 : 1.0;
            choresComplete = choresData.isComplete;
        }
        
        const finalMultiplier = avgMultiplier * choresMultiplier;
        const total = Math.round(base * finalMultiplier);
        
        return { 
            base, 
            total: includeWeeklyBonus ? total : dailyTotal,
            dailyTotal,
            multiplier: avgMultiplier,
            choresMultiplier,
            finalMultiplier,
            choresComplete
        };
    },

    /**
     * Calculate weekly total points
     * @returns {number} Total points for the week
     */
    calculateWeeklyTotal() {
        const dates = StateManager.getWeekDates(StateManager.state.currentDate);
        const dailySum = dates.reduce((sum, d) => {
            return sum + this.calculatePoints(StateManager.state.currentChild, d, false).dailyTotal;
        }, 0);
        
        // Apply weekly chores bonus to the total
        const choresData = this.calculateChoresCompletion();
        const weeklyMultiplier = choresData.isComplete ? 5.0 : 1.0;
        
        return Math.round(dailySum * weeklyMultiplier);
    },

    /**
     * Get weekly chores data (aggregated across the week)
     * @returns {object} Chore completion status
     */
    getWeeklyChoresData() {
        const weekDates = StateManager.getWeekDates(StateManager.state.currentDate);
        const weeklyChores = {};
        const chores = StateManager.getWeeklyChores();
        
        // Initialize all chores as not done
        chores.forEach(chore => {
            weeklyChores[chore.id] = false;
        });
        
        // Check across all days in the week
        weekDates.forEach(date => {
            const child = StateManager.getCurrentChild();
            const dayData = child.days[date];
            if (dayData && dayData.weeklyChores) {
                Object.keys(dayData.weeklyChores).forEach(choreId => {
                    if (dayData.weeklyChores[choreId]) {
                        weeklyChores[choreId] = true;
                    }
                });
            }
        });
        
        return weeklyChores;
    },

    /**
     * Calculate weekly chores completion percentage
     * @returns {object} Completion stats
     */
    calculateChoresCompletion() {
        const weeklyChores = this.getWeeklyChoresData();
        const total = StateManager.getWeeklyChores().length;
        const completed = Object.values(weeklyChores).filter(Boolean).length;
        return {
            completed,
            total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
            isComplete: completed === total
        };
    },

    /**
     * Calculate maximum possible daily points
     * @returns {number} Max daily points
     */
    calculateMaxDailyPoints() {
        const scheduleItems = StateManager.getSchedule().length;
        const maxCharacterMultiplier = 2.0;
        return Math.round(scheduleItems * maxCharacterMultiplier);
    },

    /**
     * Calculate maximum possible weekly points
     * @returns {number} Max weekly points
     */
    calculateMaxWeeklyPoints() {
        const scheduleItems = StateManager.getSchedule().length;
        const maxCharacterMultiplier = 2.0;
        const weekDays = 7;
        const weeklyChoresBonus = 5.0;
        
        return Math.round(scheduleItems * maxCharacterMultiplier * weekDays * weeklyChoresBonus);
    },

    /**
     * Get daily goal (70% of max possible)
     * @returns {number} Daily goal
     */
    getDailyGoal() {
        return Math.round(this.calculateMaxDailyPoints() * 0.7);
    },

    /**
     * Get weekly goal (70% of max possible)
     * @returns {number} Weekly goal
     */
    getWeeklyGoal() {
        return Math.round(this.calculateMaxWeeklyPoints() * 0.7);
    },

    /**
     * Calculate current streak
     * @returns {number} Number of consecutive days meeting goal
     */
    calculateStreak() {
        const today = new Date();
        let streak = 0;
        let current = new Date(today);
        const dailyGoal = this.getDailyGoal();
        
        while (streak < 30) {
            const dateStr = current.toISOString().split('T')[0];
            
            const points = this.calculatePoints(StateManager.state.currentChild, dateStr);
            if (points.total >= dailyGoal) {
                streak++;
            } else {
                break;
            }
            
            current.setDate(current.getDate() - 1);
        }
        
        return streak;
    },

    /**
     * Open spend points modal
     */
    openSpendPointsModal() {
        const child = StateManager.getCurrentChild();
        document.getElementById('spend-modal-balance').textContent = child.pointsBalance;
        document.getElementById('modal-spend-amount').value = '';
        document.getElementById('modal-spend-reason').value = '';
        document.getElementById('spend-points-modal').classList.add('active');
    },

    /**
     * Spend points
     */
    spendPoints() {
        const amount = parseInt(document.getElementById('modal-spend-amount').value);
        const reason = document.getElementById('modal-spend-reason').value;
        const child = StateManager.getCurrentChild();
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        if (amount > child.pointsBalance) {
            alert('Not enough points! Current balance: ' + child.pointsBalance);
            return;
        }
        
        // Track spent points separately
        if (child.pointsSpent === undefined) {
            child.pointsSpent = 0;
        }
        child.pointsSpent += amount;
        
        // Save data
        if (window.saveData) {
            window.saveData();
        }
        
        // Close modal
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        
        // Update UI
        if (window.UICore) {
            UICore.updateUI();
        }
        
        const reasonText = reason ? ` for ${reason}` : '';
        const newBalance = child.pointsBalance;
        alert(`✅ Spent ${amount} points${reasonText}!\nNew balance: ${newBalance}`);
    }
};

// Make module available globally
window.PointsModule = PointsModule;

// Make individual functions available globally for backward compatibility
window.calculatePoints = PointsModule.calculatePoints.bind(PointsModule);
window.calculateWeeklyTotal = PointsModule.calculateWeeklyTotal.bind(PointsModule);
window.calculateStreak = PointsModule.calculateStreak.bind(PointsModule);
window.calculateChoresCompletion = PointsModule.calculateChoresCompletion.bind(PointsModule);
window.getDailyGoal = PointsModule.getDailyGoal.bind(PointsModule);
window.getWeeklyGoal = PointsModule.getWeeklyGoal.bind(PointsModule);
window.getWeeklyChoresData = PointsModule.getWeeklyChoresData.bind(PointsModule);
