// ========================================
// FAMILY MANAGEMENT MODULE - Multi-Family Support
// Fixed: Added StateManager availability checks
// ========================================

const FamilyManagement = {
    async loadUserFamilies(userId) {
        console.log('📂 Loading families for user:', userId);
        
        try {
            // Get user document
            const userDoc = await db.collection('users').doc(userId).get();
            
            if (!userDoc.exists) {
                console.log('⚠️ User document not found, will create on first family');
                await this.showFamilySelectionOrCreate([]);
                return;
            }
            
            const userData = userDoc.data();
            const familyIds = userData.familyIds || [];
            
            console.log('📋 User has', familyIds.length, 'families');
            
            if (familyIds.length === 0) {
                // No families - show family selection/creation screen
                await this.showFamilySelectionOrCreate([]);
            } else if (familyIds.length === 1) {
                // Single family - load it directly
                console.log('🏠 Single family detected, loading directly');
                await this.switchToFamily(familyIds[0]);
            } else {
                // Multiple families - show selection screen
                console.log('🏘️ Multiple families, showing selection');
                await this.loadFamiliesAndShowScreen(familyIds, userData.lastActiveFamilyId);
            }
            
        } catch (error) {
            console.error('❌ Error loading families:', error);
            alert('Error loading your families. Please refresh the page.');
        }
    },

    async loadFamiliesAndShowScreen(familyIds, lastActiveFamilyId) {
        try {
            const families = [];
            
            for (const familyId of familyIds) {
                const familyDoc = await db.collection('families').doc(familyId).get();
                if (familyDoc.exists) {
                    families.push({
                        id: familyId,
                        ...familyDoc.data()
                    });
                }
            }
            
            if (families.length === 0) {
                await this.showFamilySelectionOrCreate([]);
                return;
            }
            
            // If there's a last active family and it still exists, use it
            if (lastActiveFamilyId && families.find(f => f.id === lastActiveFamilyId)) {
                await this.switchToFamily(lastActiveFamilyId);
            } else {
                // Otherwise show selection screen
                this.renderFamilySelection(families);
            }
            
        } catch (error) {
            console.error('❌ Error loading families:', error);
        }
    },

    async showFamilySelectionOrCreate(existingFamilies) {
        if (existingFamilies.length === 0) {
            // No families exist - show setup options
            this.renderSetupScreen();
        } else {
            // Show family selection with create option
            this.renderFamilySelection(existingFamilies);
        }
    },

    renderSetupScreen() {
        const overlay = document.getElementById('family-selection-overlay');
        if (!overlay) {
            console.error('❌ family-selection-overlay not found in HTML');
            return;
        }
        
        overlay.style.display = 'block';
        overlay.innerHTML = `
            <div class="family-selection-container">
                <div class="family-selection-header">
                    <h1>Welcome to Compass! 🧭</h1>
                    <p>Let's set up your family tracking system</p>
                </div>
                
                <div class="family-list">
                    <button class="family-card" onclick="FamilyManagement.openWizardSetup()">
                        <div class="family-card-header">
                            <div class="family-card-icon">🧙‍♂️</div>
                            <div class="family-card-info">
                                <h3>Guided Setup (Recommended)</h3>
                                <p>Answer a few questions and we'll create a personalized routine for your family</p>
                            </div>
                        </div>
                    </button>
                    
                    <button class="family-card" onclick="FamilyManagement.quickStart()">
                        <div class="family-card-header">
                            <div class="family-card-icon">⚡</div>
                            <div class="family-card-info">
                                <h3>Quick Start</h3>
                                <p>Start with default settings and customize later</p>
                            </div>
                        </div>
                    </button>
                    
                    <button class="family-card" onclick="FamilyManagement.joinExistingFamily()">
                        <div class="family-card-header">
                            <div class="family-card-icon">🔗</div>
                            <div class="family-card-info">
                                <h3>Join Existing Family</h3>
                                <p>Enter a family code to join an existing family</p>
                            </div>
                        </div>
                    </button>
                </div>
                
                <div style="text-align: center; margin-top: 24px;">
                    <button onclick="logout()" style="padding: 12px 24px; background: rgba(255,255,255,0.2); color: white; border: 2px solid white; border-radius: 8px; cursor: pointer; font-size: 14px;">
                        Sign Out
                    </button>
                </div>
            </div>
        `;
    },

    renderFamilySelection(families) {
        const overlay = document.getElementById('family-selection-overlay');
        if (!overlay) {
            console.error('❌ family-selection-overlay not found');
            return;
        }
        
        overlay.style.display = 'block';
        overlay.innerHTML = `
            <div class="family-selection-container">
                <div class="family-selection-header">
                    <h1>Select Your Family</h1>
                    <p>Choose which family you'd like to work with</p>
                </div>
                
                <div class="family-list">
                    ${families.map(family => `
                        <div class="family-card" onclick="FamilyManagement.switchToFamily('${family.id}')">
                            <div class="family-card-header">
                                <div class="family-card-icon">👨‍👩‍👧‍👦</div>
                                <div class="family-card-info">
                                    <h3>${family.familyName || 'My Family'}</h3>
                                    <p>Family Code: ${family.familyCode}</p>
                                    <p style="font-size: 12px; color: #9ca3af;">${family.children?.length || 0} family members</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    
                    <button class="create-family-btn" onclick="FamilyManagement.renderSetupScreen()">
                        + Create New Family
                    </button>
                </div>
            </div>
        `;
    },

    openWizardSetup() {
        const wizardUrl = 'https://type1unbound.github.io/family-tracker/compass-professional-COMPLETE.html';
        
        console.log('🧙‍♂️ Opening wizard setup...');
        
        // Open wizard in new window
        const wizardWindow = window.open(wizardUrl, 'compass-wizard', 'width=1200,height=800');
        
        if (!wizardWindow) {
            alert('Please allow popups to use the guided setup wizard');
            return;
        }
        
        // The wizard will send data back via postMessage
        // This is handled by the message listener in onboarding-import.js
    },

    async quickStart() {
        console.log('⚡ Quick start initiated');
        
        if (!currentUser) {
            alert('Not logged in');
            return;
        }
        
        try {
            showLoading();
            
            // Create new family
            const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const familyId = 'family_' + Date.now();
            
            await db.collection('families').doc(familyId).set({
                familyCode: familyCode,
                familyName: 'My Family',
                values: [],
                createdBy: currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                children: []
            });
            
            console.log('✅ Family created:', familyId);
            
            // Update user document
            const userRef = db.collection('users').doc(currentUser.uid);
            const userDoc = await userRef.get();
            const existingFamilyIds = userDoc.exists && userDoc.data().familyIds ? userDoc.data().familyIds : [];
            
            await userRef.set({
                email: currentUser.email,
                displayName: currentUser.displayName,
                familyIds: [...existingFamilyIds, familyId],
                lastActiveFamilyId: familyId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            console.log('✅ User document updated');
            
            // Switch to new family
            await this.switchToFamily(familyId);
            
            hideLoading();
            
        } catch (error) {
            console.error('❌ Error in quick start:', error);
            alert('Error creating family: ' + error.message);
            hideLoading();
        }
    },

    async joinExistingFamily() {
        const familyCode = prompt('Enter the 6-character family code:');
        
        if (!familyCode) return;
        
        const code = familyCode.toUpperCase().trim();
        
        if (code.length !== 6) {
            alert('Family code must be 6 characters');
            return;
        }
        
        try {
            showLoading();
            
            // Find family by code
            const familiesSnapshot = await db.collection('families')
                .where('familyCode', '==', code)
                .limit(1)
                .get();
            
            if (familiesSnapshot.empty) {
                alert('Family not found. Please check the code and try again.');
                hideLoading();
                return;
            }
            
            const familyDoc = familiesSnapshot.docs[0];
            const familyId = familyDoc.id;
            
            // Add user to family
            const userRef = db.collection('users').doc(currentUser.uid);
            const userDoc = await userRef.get();
            const existingFamilyIds = userDoc.exists && userDoc.data().familyIds ? userDoc.data().familyIds : [];
            
            if (existingFamilyIds.includes(familyId)) {
                alert('You are already a member of this family!');
                await this.switchToFamily(familyId);
                hideLoading();
                return;
            }
            
            await userRef.set({
                email: currentUser.email,
                displayName: currentUser.displayName,
                familyIds: [...existingFamilyIds, familyId],
                lastActiveFamilyId: familyId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            console.log('✅ Joined family:', familyId);
            
            // Switch to family
            await this.switchToFamily(familyId);
            
            hideLoading();
            
        } catch (error) {
            console.error('❌ Error joining family:', error);
            alert('Error joining family: ' + error.message);
            hideLoading();
        }
    },

    async switchToFamily(familyId) {
        console.log('🔄 Switching to family:', familyId);
        
        // CRITICAL FIX: Wait for StateManager to be available
        let retries = 0;
        while (!window.StateManager && retries < 50) {
            console.log('⏳ Waiting for StateManager... attempt', retries + 1);
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }
        
        if (!window.StateManager) {
            console.error('❌ StateManager not available after waiting');
            alert('App not ready. Please refresh the page.');
            return;
        }
        
        try {
            if (typeof showLoading === 'function') showLoading();
            
            // Load family data from Firestore
            const familyDoc = await db.collection('families').doc(familyId).get();
            
            if (!familyDoc.exists) {
                console.error('❌ Family not found:', familyId);
                alert('Family not found');
                if (typeof hideLoading === 'function') hideLoading();
                return;
            }
            
            const familyData = familyDoc.data();
            console.log('📦 Family data loaded:', familyData);
            
            // Update StateManager
            StateManager.state.familyId = familyId;
            StateManager.state.familyCode = familyData.familyCode;
            StateManager.state.children = familyData.children || [];
            StateManager.state.data = {};
            
            // Load each child's data
            const childrenSnapshot = await db.collection('families').doc(familyId)
                .collection('familyMembers').get();
            
            childrenSnapshot.forEach(doc => {
                const childData = doc.data();
                StateManager.state.data[doc.id] = childData;
                console.log('  ✓ Loaded child:', childData.name);
            });
            
            // Set current child to first child if available
            if (StateManager.state.children.length > 0) {
                StateManager.state.currentChild = StateManager.state.children[0];
            } else {
                // No children yet - create a default one
                console.log('📝 No children found, creating default child');
                const childId = 'child1';
                StateManager.createChild(childId, true); // true = use defaults
                StateManager.state.currentChild = childId;
                
                // Save to Firestore
                await db.collection('families').doc(familyId).update({
                    children: [childId]
                });
                
                await db.collection('families').doc(familyId)
                    .collection('familyMembers').doc(childId)
                    .set(StateManager.state.data[childId]);
            }
            
            // Update user's last active family
            await db.collection('users').doc(currentUser.uid).update({
                lastActiveFamilyId: familyId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Hide family selection overlay
            const overlay = document.getElementById('family-selection-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
            
            // Hide login overlay
            const loginOverlay = document.getElementById('login-overlay');
            if (loginOverlay) {
                loginOverlay.style.display = 'none';
            }
            
            // Update "Switch Family" button visibility
            const switchFamilyBtn = document.getElementById('switch-family-btn');
            if (switchFamilyBtn) {
                const userDoc = await db.collection('users').doc(currentUser.uid).get();
                const familyIds = userDoc.exists && userDoc.data().familyIds ? userDoc.data().familyIds : [];
                switchFamilyBtn.style.display = familyIds.length > 1 ? 'block' : 'none';
            }
            
            // Initialize UI
            if (window.UICore) {
                UICore.applyColorPalette();
                UICore.updateUI();
            }
            
            // Update sidebar
            if (window.renderSidebarAvatars) {
                renderSidebarAvatars();
            }
            if (window.renderSidebarTrackers) {
                renderSidebarTrackers();
            }
            
            // Set today's date
            const today = new Date().toISOString().split('T')[0];
            StateManager.state.currentDate = today;
            
            const datePicker = document.getElementById('date-picker');
            if (datePicker) {
                datePicker.value = today;
            }
            
            if (typeof hideLoading === 'function') hideLoading();
            
            console.log('✅ Successfully switched to family:', familyId);
            
        } catch (error) {
            console.error('❌ Error switching family:', error);
            alert('Error loading family data: ' + error.message);
            if (typeof hideLoading === 'function') hideLoading();
        }
    },

    showFamilySelection() {
        console.log('📋 Showing family selection');
        
        if (!currentUser) {
            alert('Not logged in');
            return;
        }
        
        // Load and show family selection
        this.loadUserFamilies(currentUser.uid);
    }
};

// Make available globally
window.FamilyManagement = FamilyManagement;

console.log('✅ Family Management Module loaded (with StateManager safety checks)');
