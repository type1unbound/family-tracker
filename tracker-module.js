// ========================================
// TRACKER MODULE - MEDICATION/HEALTH TRACKER SYSTEM
// ========================================
// This module handles all health tracking functionality including
// entry forms, history, analytics, and settings management

const MedicationTracker = {
    // Current state
    currentMemberId: null,
    currentMemberName: null,
    currentTrackerId: null,
    currentConfig: null, // Will hold the active tracker's config
    entries: [],
    currentEntry: null,
    
    // Default configuration (fallback - not normally used with multi-tracker system)
    config: {
        observedCategories: [
            {
                name: 'Inattentive Symptoms',
                items: [
                    { id: 'attention_span', label: 'Stays focused on tasks', description: 'Can complete homework/activities without constant redirection' },
                    { id: 'morning_routine', label: 'Completes morning routine', description: 'Gets up, gets ready without excessive prompting' },
                    { id: 'motivation', label: 'Shows motivation', description: 'Engages with tasks without being bored or unmotivated' }
                ]
            },
            {
                name: 'Hyperactive Symptoms',
                items: [
                    { id: 'calm_energy', label: 'Maintains calm energy', description: 'Not constantly "on the go"' },
                    { id: 'excessive_activity', label: 'Controls activity levels', description: 'Can regulate verbal and physical activity' },
                    { id: 'sleep', label: 'Falls asleep easily', description: 'Can settle down at bedtime' }
                ]
            },
            {
                name: 'Impulsive Symptoms',
                items: [
                    { id: 'thinks_first', label: 'Pauses before acting', description: 'Takes time to think rather than reacting' },
                    { id: 'emotional_regulation', label: 'Regulates emotions', description: 'Manages disappointment proportionally' },
                    { id: 'interrupting', label: 'Controls interrupting', description: 'Lets others finish speaking' }
                ]
            }
        ],
        selfReportCategories: [
            {
                name: 'Child Self-Report',
                items: [
                    { id: 'self_focus', label: 'I can focus when I try', description: 'My brain cooperates when I want to pay attention' },
                    { id: 'self_impulses', label: 'I can stop myself', description: 'I notice and can choose to stop' },
                    { id: 'self_calm', label: 'I feel calm inside', description: 'My body and mind feel peaceful' },
                    { id: 'self_mood', label: 'I manage my feelings', description: 'I handle emotions more easily' },
                    { id: 'self_friends', label: 'Getting along is easier', description: 'Fewer conflicts with friends and family' }
                ]
            }
        ],
        ratingScale: [
            { value: 1, label: '1 - Very Difficult', color: '#ef4444' },
            { value: 2, label: '2 - Difficult', color: '#f97316' },
            { value: 3, label: '3 - Neutral', color: '#fbbf24' },
            { value: 4, label: '4 - Good', color: '#84cc16' },
            { value: 5, label: '5 - Very Good', color: '#22c55e' }
        ]
    },
    
    // Initialize the tracker with custom config
    init: function(memberId, trackerId, customConfig) {
        this.currentMemberId = memberId;
        this.currentTrackerId = trackerId;
        this.currentConfig = customConfig || this.config; // Use custom config or fall back to default
        this.currentMemberName = state.data[memberId].name;
        this.resetCurrentEntry();
        this.loadEntries();
    },
    
    // Reset current entry
    resetCurrentEntry: function() {
        this.currentEntry = {
            date: new Date().toISOString().split('T')[0],
            observer: '',
            periodType: 'baseline',
            observedRatings: {},
            selfReportedRatings: {},
            notes: ''
        };
    },
    
    // Render the entry form
    renderEntryForm: function() {
        console.log('🔷 renderEntryForm called');
        console.log('🔷 currentConfig:', this.currentConfig);
        console.log('🔷 currentMemberId:', this.currentMemberId);
        console.log('🔷 currentTrackerId:', this.currentTrackerId);
        
        const container = document.getElementById('med-rating-categories');
        if (!container) {
            console.error('❌ Container med-rating-categories not found!');
            return;
        }
        
        const cfg = this.currentConfig;
        
        if (!cfg) {
            console.error('❌ currentConfig is null or undefined!');
            container.innerHTML = '<div style="padding: 40px; text-align: center; color: red;">Error: Tracker configuration not loaded. Please close and reopen the tracker.</div>';
            return;
        }
        
        console.log('✅ Container found, rendering...');
        console.log('Observed categories:', cfg.observedCategories?.length || 0);
        console.log('Self-report categories:', cfg.selfReportCategories?.length || 0);
        
        if (!cfg.observedCategories || !cfg.selfReportCategories) {
            console.error('❌ Template missing categories!');
            container.innerHTML = '<div style="padding: 40px; text-align: center; color: red;">Error: Template data incomplete. Config: ' + JSON.stringify(cfg).substring(0, 200) + '</div>';
            return;
        }
        
        // Define rating scale once at the top so it's accessible in both loops
        const ratingScale = cfg.ratingScale || [
            { value: 1, label: '1', color: '#ef4444' },
            { value: 2, label: '2', color: '#f97316' },
            { value: 3, label: '3', color: '#fbbf24' },
            { value: 4, label: '4', color: '#84cc16' },
            { value: 5, label: '5', color: '#22c55e' }
        ];
        
        let html = '';
        
        // Observed Categories
        html += `<h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 16px;">👁️ ${cfg.observerSectionTitle || 'Observer Ratings'}</h3>`;
        cfg.observedCategories.forEach(category => {
            html += `
                <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                    <h4 style="font-size: 18px; font-weight: 600; color: #374151; margin-bottom: 16px;">${category.name}</h4>
            `;
            
            category.items.forEach(item => {
                const currentRating = this.currentEntry.observedRatings[item.id];
                html += `
                    <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
                        <div style="margin-bottom: 8px;">
                            <p style="font-weight: 600; color: #111827; margin-bottom: 4px;">${item.label}</p>
                            <p style="font-size: 13px; color: #6b7280;">${item.description}</p>
                        </div>
                        <div class="rating-buttons" style="display: flex; gap: 8px;">
                `;
                
                // Rating scale already defined at top of function
                ratingScale.forEach(rating => {
                    const isSelected = currentRating === rating.value;
                    html += `
                        <button 
                            onclick="MedicationTracker.setObservedRating('${item.id}', ${rating.value})"
                            style="flex: 1; padding: 10px 4px; border: 2px solid ${isSelected ? rating.color : '#d1d5db'}; 
                                   background: ${isSelected ? rating.color : 'white'}; 
                                   color: ${isSelected ? 'white' : '#374151'}; 
                                   border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;
                                   transition: all 0.2s;">
                            ${rating.value}
                        </button>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        });
        
        // Self-Report Categories
        html += `<h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 24px 0 16px 0;">🗣️ ${cfg.selfReportSectionTitle || 'Self-Report'}</h3>`;
        cfg.selfReportCategories.forEach(category => {
            html += `
                <div style="background: #eff6ff; padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                    <h4 style="font-size: 18px; font-weight: 600; color: #1e40af; margin-bottom: 16px;">${category.name}</h4>
            `;
            
            category.items.forEach(item => {
                const currentRating = this.currentEntry.selfReportedRatings[item.id];
                html += `
                    <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #bfdbfe;">
                        <div style="margin-bottom: 8px;">
                            <p style="font-weight: 600; color: #1e3a8a; margin-bottom: 4px;">${item.label}</p>
                            <p style="font-size: 13px; color: #1e40af;">${item.description}</p>
                        </div>
                        <div class="rating-buttons" style="display: flex; gap: 8px;">
                `;
                
                ratingScale.forEach(rating => {
                    const isSelected = currentRating === rating.value;
                    html += `
                        <button 
                            onclick="MedicationTracker.setSelfReportRating('${item.id}', ${rating.value})"
                            style="flex: 1; padding: 10px 4px; border: 2px solid ${isSelected ? rating.color : '#bfdbfe'}; 
                                   background: ${isSelected ? rating.color : 'white'}; 
                                   color: ${isSelected ? 'white' : '#1e40af'}; 
                                   border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;
                                   transition: all 0.2s;">
                            ${rating.value}
                        </button>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        });
        
        container.innerHTML = html;
    },
    
    // Set observed rating
    setObservedRating: function(itemId, value) {
        this.currentEntry.observedRatings[itemId] = value;
        this.renderEntryForm();
    },
    
    // Set self-report rating
    setSelfReportRating: function(itemId, value) {
        this.currentEntry.selfReportedRatings[itemId] = value;
        this.renderEntryForm();
    },
    
    // Save entry to Firestore
    saveEntry: async function() {
        // Validation
        const date = document.getElementById('med-entry-date').value;
        const observer = document.getElementById('med-observer').value;
        const periodType = document.querySelector('input[name="med-period"]:checked')?.value;
        const notes = document.getElementById('med-entry-notes').value;
        
        if (!date) {
            alert('Please select a date');
            return;
        }
        
        if (!observer.trim()) {
            alert('Please enter observer name');
            return;
        }
        
        if (!periodType) {
            alert('Please select a period type');
            return;
        }
        
        const hasObservedRatings = Object.keys(this.currentEntry.observedRatings).length > 0;
        const hasSelfRatings = Object.keys(this.currentEntry.selfReportedRatings).length > 0;
        
        if (!hasObservedRatings && !hasSelfRatings) {
            alert('Please complete at least some ratings before saving');
            return;
        }
        
        // Create entry object
        const entry = {
            trackerId: this.currentTrackerId,
            date: date,
            observer: observer,
            periodType: periodType,
            observedRatings: this.currentEntry.observedRatings,
            selfReportedRatings: this.currentEntry.selfReportedRatings,
            notes: notes,
            timestamp: Date.now()
        };
        
        try {
            // Save to Firestore with trackerId in path
            if (currentUser) {
                const userRef = db.collection('users').doc(currentUser.uid);
                const entryRef = userRef
                    .collection('familyMembers').doc(this.currentMemberId)
                    .collection('trackerData').doc(this.currentTrackerId)
                    .collection('entries').doc(date);
                
                await entryRef.set(entry);
                
                console.log('✅ Entry saved to Firestore:', this.currentTrackerId);
                alert('✅ Entry saved successfully!');
                
                // Reset form
                this.resetCurrentEntry();
                document.getElementById('med-observer').value = '';
                document.getElementById('med-entry-notes').value = '';
                
                // Reset to first period type
                const firstPeriodRadio = document.querySelector('input[name="med-period"]');
                if (firstPeriodRadio) {
                    firstPeriodRadio.checked = true;
                }
                
                this.renderEntryForm();
                
                // Reload entries
                await this.loadEntries();
                
            } else {
                alert('Error: Not signed in');
            }
        } catch (error) {
            console.error('Error saving entry:', error);
            alert('Failed to save entry: ' + error.message);
        }
    },
    
    // Load entries from Firestore
    loadEntries: async function() {
        if (!currentUser) return;
        
        try {
            const userRef = db.collection('users').doc(currentUser.uid);
            const entriesSnapshot = await userRef
                .collection('familyMembers').doc(this.currentMemberId)
                .collection('trackerData').doc(this.currentTrackerId)
                .collection('entries').get();
            
            this.entries = [];
            entriesSnapshot.forEach(doc => {
                this.entries.push({ id: doc.id, ...doc.data() });
            });
            
            // Sort by date descending
            this.entries.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            console.log('✅ Loaded', this.entries.length, 'entries for tracker:', this.currentTrackerId);
            
        } catch (error) {
            console.error('Error loading entries:', error);
        }
    },
    
    // Render history
    renderHistory: function() {
        const container = document.getElementById('med-history-list');
        if (!container) return;
        
        if (this.entries.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #6b7280;">
                    <div style="font-size: 64px; margin-bottom: 16px;">📋</div>
                    <p style="font-size: 18px; font-weight: 600;">No entries yet</p>
                    <p style="font-size: 14px;">Start tracking to see history here</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        // Summary stats
        const baselineCount = this.entries.filter(e => e.periodType === 'baseline').length;
        const medicationCount = this.entries.filter(e => e.periodType === 'medication').length;
        const controlCount = this.entries.filter(e => e.periodType === 'control').length;
        
        html += `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: #dbeafe; padding: 16px; border-radius: 12px;">
                    <p style="font-size: 13px; color: #1e40af; font-weight: 600;">Total Entries</p>
                    <p style="font-size: 32px; font-weight: 700; color: #1e3a8a;">${this.entries.length}</p>
                </div>
                <div style="background: #fed7aa; padding: 16px; border-radius: 12px;">
                    <p style="font-size: 13px; color: #92400e; font-weight: 600;">Baseline</p>
                    <p style="font-size: 32px; font-weight: 700; color: #78350f;">${baselineCount}</p>
                </div>
                <div style="background: #bbf7d0; padding: 16px; border-radius: 12px;">
                    <p style="font-size: 13px; color: #166534; font-weight: 600;">On Medication</p>
                    <p style="font-size: 32px; font-weight: 700; color: #14532d;">${medicationCount}</p>
                </div>
                <div style="background: #e9d5ff; padding: 16px; border-radius: 12px;">
                    <p style="font-size: 13px; color: #6b21a8; font-weight: 600;">Control</p>
                    <p style="font-size: 32px; font-weight: 700; color: #581c87;">${controlCount}</p>
                </div>
            </div>
        `;
        
        // Entry list
        this.entries.forEach(entry => {
            const periodColor = entry.periodType === 'baseline' ? '#fb923c' : 
                               entry.periodType === 'medication' ? '#22c55e' : '#a855f7';
            const periodLabel = entry.periodType === 'baseline' ? '📊 Baseline' :
                               entry.periodType === 'medication' ? '💊 On Med' : '🔄 Control';
            
            // Calculate average rating
            const allRatings = [...Object.values(entry.observedRatings || {}), ...Object.values(entry.selfReportedRatings || {})];
            const avgRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : 'N/A';
            
            html += `
                <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <div>
                            <p style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 4px;">${entry.date}</p>
                            <p style="font-size: 14px; color: #6b7280;">Observer: ${entry.observer}</p>
                        </div>
                        <div style="text-align: right;">
                            <span style="display: inline-block; padding: 6px 12px; background: ${periodColor}; color: white; border-radius: 8px; font-size: 13px; font-weight: 600;">
                                ${periodLabel}
                            </span>
                            <p style="font-size: 24px; font-weight: 700; color: #6366f1; margin-top: 8px;">
                                ${avgRating} <span style="font-size: 14px; color: #6b7280;">/5</span>
                            </p>
                        </div>
                    </div>
                    ${entry.notes ? `
                        <div style="background: #fffbeb; padding: 12px; border-radius: 8px; border-left: 4px solid #fbbf24;">
                            <p style="font-size: 13px; color: #92400e; font-weight: 600; margin-bottom: 4px;">📝 Notes:</p>
                            <p style="font-size: 14px; color: #78350f;">${entry.notes}</p>
                        </div>
                    ` : ''}
                    <button onclick="MedicationTracker.deleteEntry('${entry.id}')" style="margin-top: 12px; padding: 8px 16px; background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">
                        🗑️ Delete
                    </button>
                </div>
            `;
        });
        
        container.innerHTML = html;
    },
    
    // Delete entry
    deleteEntry: async function(entryId) {
        if (!confirm('Delete this entry? This cannot be undone.')) return;
        
        try {
            if (currentUser) {
                const userRef = db.collection('users').doc(currentUser.uid);
                await userRef
                    .collection('familyMembers').doc(this.currentMemberId)
                    .collection('trackerData').doc(this.currentTrackerId)
                    .collection('entries').doc(entryId).delete();
                
                console.log('✅ Entry deleted from tracker:', this.currentTrackerId);
                alert('Entry deleted successfully');
                
                // Reload
                await this.loadEntries();
                this.renderHistory();
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
            alert('Failed to delete entry: ' + error.message);
        }
    },
    
    // Render analytics
    renderAnalytics: function() {
        const container = document.getElementById('med-analytics-content');
        if (!container) return;
        
        if (this.entries.length < 5) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; background: #eff6ff; border-radius: 12px; border: 2px dashed #3b82f6;">
                    <div style="font-size: 64px; margin-bottom: 16px;">📊</div>
                    <p style="font-size: 18px; font-weight: 600; color: #1e40af;">Not Enough Data</p>
                    <p style="font-size: 14px; color: #3b82f6; margin-top: 8px;">Add at least 5 entries to see analytics</p>
                    <p style="font-size: 13px; color: #6b7280; margin-top: 4px;">Currently have: ${this.entries.length} entries</p>
                </div>
            `;
            return;
        }
        
        // Calculate statistics
        const baselineEntries = this.entries.filter(e => e.periodType === 'baseline');
        const medicationEntries = this.entries.filter(e => e.periodType === 'medication');
        
        // Calculate averages
        const getAverageRating = (entries) => {
            if (entries.length === 0) return null;
            let total = 0;
            let count = 0;
            entries.forEach(entry => {
                Object.values(entry.observedRatings || {}).forEach(rating => {
                    total += rating;
                    count++;
                });
                Object.values(entry.selfReportedRatings || {}).forEach(rating => {
                    total += rating;
                    count++;
                });
            });
            return count > 0 ? (total / count).toFixed(2) : null;
        };
        
        const baselineAvg = getAverageRating(baselineEntries);
        const medicationAvg = getAverageRating(medicationEntries);
        
        let html = '';
        
        // Summary
        html += `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">📊 Overall Analysis</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                    ${baselineAvg ? `
                        <div style="background: rgba(255,255,255,0.2); padding: 16px; border-radius: 8px;">
                            <p style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Baseline Average</p>
                            <p style="font-size: 36px; font-weight: 700;">${baselineAvg}</p>
                            <p style="font-size: 13px; opacity: 0.8;">${baselineEntries.length} entries</p>
                        </div>
                    ` : ''}
                    ${medicationAvg ? `
                        <div style="background: rgba(255,255,255,0.2); padding: 16px; border-radius: 8px;">
                            <p style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Medication Average</p>
                            <p style="font-size: 36px; font-weight: 700;">${medicationAvg}</p>
                            <p style="font-size: 13px; opacity: 0.8;">${medicationEntries.length} entries</p>
                        </div>
                    ` : ''}
                    ${baselineAvg && medicationAvg ? `
                        <div style="background: rgba(255,255,255,0.2); padding: 16px; border-radius: 8px;">
                            <p style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Improvement</p>
                            <p style="font-size: 36px; font-weight: 700;">
                                ${(medicationAvg - baselineAvg > 0 ? '+' : '')}${(medicationAvg - baselineAvg).toFixed(2)}
                            </p>
                            <p style="font-size: 13px; opacity: 0.8;">
                                ${(((medicationAvg - baselineAvg) / baselineAvg) * 100).toFixed(1)}% change
                            </p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Timeline view
        html += '<h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 16px;">📈 Timeline</h3>';
        html += '<div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">';
        
        // Sort entries by date
        const sortedEntries = [...this.entries].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        sortedEntries.forEach((entry, index) => {
            const allRatings = [...Object.values(entry.observedRatings || {}), ...Object.values(entry.selfReportedRatings || {})];
            const avgRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : 0;
            const barWidth = (avgRating / 5) * 100;
            const periodColor = entry.periodType === 'baseline' ? '#fb923c' : 
                               entry.periodType === 'medication' ? '#22c55e' : '#a855f7';
            
            html += `
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-size: 13px; font-weight: 600; color: #6b7280;">${entry.date}</span>
                        <span style="font-size: 14px; font-weight: 700; color: #374151;">${avgRating}</span>
                    </div>
                    <div style="height: 24px; background: #f3f4f6; border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; background: ${periodColor}; width: ${barWidth}%; transition: width 0.3s;"></div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Insights
        if (baselineAvg && medicationAvg) {
            const improvement = medicationAvg - baselineAvg;
            const improvementPercent = ((improvement / baselineAvg) * 100).toFixed(1);
            
            html += `
                <div style="background: ${improvement > 0 ? '#d1fae5' : '#fee2e2'}; border: 2px solid ${improvement > 0 ? '#10b981' : '#ef4444'}; border-radius: 12px; padding: 20px;">
                    <h3 style="font-size: 18px; font-weight: 700; color: ${improvement > 0 ? '#065f46' : '#991b1b'}; margin-bottom: 12px;">
                        ${improvement > 0 ? '✅ Positive Progress' : '⚠️ Consider Adjustments'}
                    </h3>
                    <p style="font-size: 14px; color: ${improvement > 0 ? '#047857' : '#b91c1c'};">
                        ${improvement > 0 ? 
                            `Average ratings improved by ${improvementPercent}% from baseline to medication period. This suggests the current approach is beneficial.` :
                            `Average ratings decreased by ${Math.abs(improvementPercent)}% from baseline. Consider discussing adjustments with healthcare provider.`
                        }
                    </p>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }
};

// Tab switching function
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MedicationTracker;
}
