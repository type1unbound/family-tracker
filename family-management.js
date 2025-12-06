// ========================================
// FAMILY MANAGEMENT & SELECTION SYSTEM
// Namespace pattern for firebase.js compatibility
// ========================================

const FamilyManagement = (function() {
    // Private variables
    let userFamilies = [];
    let currentFamilyId = null;

    /**
     * Load user's families and show selection screen
     */
    async function loadUserFamilies() {
        if (!currentUser) {
            console.error('No user logged in');
            return;
        }

        try {
            console.log('📥 Loading families for user:', currentUser.email);
            
            const userRef = db.collection('users').doc(currentUser.uid);
            const userDoc = await userRef.get();
            
            if (!userDoc.exists) {
                console.log('New user detected - showing setup wizard');
                showFamilySetupChoice();
                return;
            }
            
            const userData = userDoc.data();
            
            // MIGRATION CHECK FOR EXISTING USERS
            if (userData.familyId && !userData.familyIds) {
                console.log('🔄 Detected old user format - migrating to multi-family structure...');
                
                try {
                    await migrateOldUserData(userRef, userData);
                    const updatedDoc = await userRef.get();
                    const updatedData = updatedDoc.data();
                    const familyIds = updatedData.familyIds || [];
                    
                    console.log('✅ Migration complete! User now has', familyIds.length, 'family/families');
                    
                    if (familyIds.length === 0) {
                        console.log('User has no families after migration - showing setup wizard');
                        showFamilySetupChoice();
                        return;
                    }
                    
                    await loadFamiliesAndShowScreen(updatedData, familyIds);
                    return;
                    
                } catch (error) {
                    console.error('❌ Migration failed:', error);
                    alert('Error migrating your data. Please contact support. Your original data is safe.');
                    hideLoading();
                    return;
                }
            }
            
            // NORMAL FLOW (New multi-family users)
            const familyIds = userData.familyIds || [];
            
            if (familyIds.length === 0) {
                console.log('User has no families - showing setup wizard');
                showFamilySetupChoice();
                return;
            }
            
            await loadFamiliesAndShowScreen(userData, familyIds);
            
        } catch (error) {
            console.error('❌ Error loading families:', error);
            alert('Error loading families: ' + error.message);
            hideLoading();
        }
    }

    /**
     * Load family details and show appropriate screen
     */
    async function loadFamiliesAndShowScreen(userData, familyIds) {
        userFamilies = [];
        for (const familyId of familyIds) {
            const familyDoc = await db.collection('families').doc(familyId).get();
            if (familyDoc.exists) {
                userFamilies.push({
                    id: familyId,
                    ...familyDoc.data()
                });
            }
        }
        
        console.log('✅ Loaded', userFamilies.length, 'families');
        
        const lastFamilyId = userData.lastActiveFamilyId || familyIds[0];
        
        if (userFamilies.length === 1) {
            await switchToFamily(lastFamilyId);
        } else {
            showFamilySelectionScreen(lastFamilyId);
        }
    }

    /**
     * Migrate old single-family data to new multi-family structure
     */
    async function migrateOldUserData(userRef, userData) {
        try {
            console.log('🔄 Starting migration...');
            console.log('   - Original familyId:', userData.familyId);
            
            const oldFamilyId = userData.familyId;
            const userId = userRef.id;
            
            const existingFamilyDoc = await db.collection('families').doc(oldFamilyId).get();
            
            if (existingFamilyDoc.exists) {
                console.log('   ✓ Family document already exists in /families - skipping family creation');
            } else {
                const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                
                console.log('   - Creating family document with code:', familyCode);
                
                await db.collection('families').doc(oldFamilyId).set({
                    familyCode: familyCode,
                    createdBy: userId,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    migratedFrom: 'legacy',
                    migratedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    members: [userId],
                    children: []
                });
            }
            
            console.log('   - Copying family members from /users to /families...');
            const oldMembersSnapshot = await userRef.collection('familyMembers').get();
            const childIds = [];
            
            for (const memberDoc of oldMembersSnapshot.docs) {
                childIds.push(memberDoc.id);
                const memberData = memberDoc.data();
                
                const newMemberRef = db.collection('families').doc(oldFamilyId)
                    .collection('familyMembers').doc(memberDoc.id);
                const existingMember = await newMemberRef.get();
                
                if (!existingMember.exists) {
                    await newMemberRef.set(memberData);
                    console.log(`     ✓ Copied ${memberData.name || memberDoc.id}`);
                    
                    const daysSnapshot = await memberDoc.ref.collection('days').get();
                    let dayCount = 0;
                    for (const dayDoc of daysSnapshot.docs) {
                        await newMemberRef.collection('days').doc(dayDoc.id).set(dayDoc.data());
                        dayCount++;
                    }
                    console.log(`       → Copied ${dayCount} days of data`);
                    
                    const trackerSnapshot = await memberDoc.ref.collection('trackerData').get();
                    if (!trackerSnapshot.empty) {
                        let trackerCount = 0;
                        for (const trackerDoc of trackerSnapshot.docs) {
                            await newMemberRef.collection('trackerData').doc(trackerDoc.id).set(trackerDoc.data());
                            
                            const entriesSnapshot = await trackerDoc.ref.collection('entries').get();
                            for (const entryDoc of entriesSnapshot.docs) {
                                await newMemberRef.collection('trackerData').doc(trackerDoc.id)
                                    .collection('entries').doc(entryDoc.id).set(entryDoc.data());
                            }
                            trackerCount++;
                        }
                        console.log(`       → Copied ${trackerCount} trackers`);
                    }
                } else {
                    console.log(`     ✓ ${memberData.name || memberDoc.id} already exists in new location`);
                }
            }
            
            await db.collection('families').doc(oldFamilyId).update({
                children: childIds
            });
            
            console.log('   - Updating user document to multi-family format...');
            
            await userRef.update({
                familyIds: [oldFamilyId],
                lastActiveFamilyId: oldFamilyId,
                migratedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            
            console.log('✅ Migration complete!');
            
        } catch (error) {
            console.error('❌ Migration error:', error);
            throw new Error('Migration failed: ' + error.message);
        }
    }

    /**
     * Show family selection screen - CLEAN VERSION
     */
    function showFamilySelectionScreen(defaultFamilyId) {
        const loginOverlay = document.getElementById('login-overlay');
        const loginContent = document.getElementById('login-content');
        const loadingContent = document.getElementById('loading-content');
        
        if (!loginOverlay) return;
        
        loginOverlay.style.display = 'flex';
        if (loginContent) loginContent.style.display = 'none';
        if (loadingContent) loadingContent.style.display = 'none';
        
        // Remove any existing selection screen
        const existingScreen = document.getElementById('family-selection-screen');
        if (existingScreen) existingScreen.remove();
        
        // Create clean selection screen
        const selectionContainer = document.createElement('div');
        selectionContainer.id = 'family-selection-screen';
        selectionContainer.style.cssText = 'max-width: 480px; width: 100%;';
        
        selectionContainer.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                <div style="text-align: center; margin-bottom: 28px;">
                    <h2 style="font-size: 28px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0;">Welcome Back! 👋</h2>
                    <p style="font-size: 16px; color: #6b7280; margin: 0;">Which family would you like to work with?</p>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                    ${userFamilies.map(family => {
                        const memberCount = family.children ? family.children.length : 0;
                        const isDefault = family.id === defaultFamilyId;
                        
                        return `
                            <div onclick="FamilyManagement.switchToFamily('${family.id}')" style="
                                background: ${isDefault ? 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)' : 'white'};
                                border: 2px solid ${isDefault ? '#10b981' : '#e5e7eb'};
                                border-radius: 14px;
                                padding: 20px;
                                cursor: pointer;
                                transition: all 0.2s;
                                display: flex;
                                align-items: center;
                                gap: 16px;
                            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 16px rgba(16, 185, 129, 0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <svg width="24" height="24" viewBox="0 0 24 24" stroke="white" fill="none" stroke-width="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                    </svg>
                                </div>
                                <div style="flex: 1;">
                                    <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 4px 0;">${family.familyCode || 'Family'}</h3>
                                    <p style="font-size: 13px; color: #6b7280; margin: 0;">${memberCount} member${memberCount !== 1 ? 's' : ''}</p>
                                </div>
                                ${isDefault ? '<div style="color: #10b981; font-size: 20px;">→</div>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div style="display: flex; gap: 12px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                    <button onclick="FamilyManagement.showCreateFamilyOptions()" style="flex: 1; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; font-family: inherit;">+ Create New</button>
                    <button onclick="FamilyManagement.showJoinFamilyDialog()" style="flex: 1; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; background: white; border: 2px solid #e5e7eb; color: #6b7280; font-family: inherit;">Join Family</button>
                </div>
                
                <div style="text-align: center; margin-top: 16px;">
                    <button onclick="auth.signOut()" style="padding: 8px; background: transparent; border: none; color: #9ca3af; font-size: 14px; cursor: pointer; font-family: inherit;">Sign Out</button>
                </div>
            </div>
        `;
        
        loginOverlay.appendChild(selectionContainer);
    }

    /**
     * Show setup choice for new users - CLEAN VERSION
     */
    function showFamilySetupChoice() {
        const loginOverlay = document.getElementById('login-overlay');
        const loginContent = document.getElementById('login-content');
        const loadingContent = document.getElementById('loading-content');
        
        if (!loginOverlay) return;
        
        loginOverlay.style.display = 'flex';
        if (loginContent) loginContent.style.display = 'none';
        if (loadingContent) loadingContent.style.display = 'none';
        
        // Remove any existing setup screen
        const existingScreen = document.getElementById('family-setup-screen');
        if (existingScreen) existingScreen.remove();
        
        // Create clean setup screen
        const setupContainer = document.createElement('div');
        setupContainer.id = 'family-setup-screen';
        setupContainer.style.cssText = 'max-width: 480px; width: 100%;';
        
        setupContainer.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                <div style="text-align: center; margin-bottom: 32px;">
                    <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                        <svg viewBox="0 0 24 24" stroke="white" stroke-linecap="round" stroke-linejoin="round" fill="none" width="32" height="32">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="white"></polygon>
                        </svg>
                    </div>
                    <h2 style="font-size: 28px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0;">Welcome to Compass</h2>
                    <p style="font-size: 16px; color: #6b7280; margin: 0;">Let's get your family started</p>
                </div>
                
                <div onclick="FamilyManagement.launchSetupWizard()" style="background: white; border: 3px solid #10b981; border-radius: 16px; padding: 28px; margin-bottom: 16px; cursor: pointer; text-align: center; transition: all 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(16, 185, 129, 0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    <div style="width: 48px; height: 48px; background: #f0fdf4; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <circle cx="12" cy="12" r="6"/>
                            <circle cx="12" cy="12" r="2"/>
                        </svg>
                    </div>
                    <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0;">Guided Setup Wizard</h3>
                    <p style="font-size: 15px; color: #6b7280; margin: 0 0 12px 0; line-height: 1.6;">We'll ask a few questions to create a personalized routine for your family</p>
                    <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">RECOMMENDED</div>
                </div>
                
                <div onclick="FamilyManagement.quickStartFamily()" style="background: white; border: 2px solid #e5e7eb; border-radius: 16px; padding: 28px; margin-bottom: 24px; cursor: pointer; text-align: center; transition: all 0.2s;" onmouseover="this.style.borderColor='#10b981'" onmouseout="this.style.borderColor='#e5e7eb'">
                    <div style="width: 48px; height: 48px; background: #f9fafb; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                    </div>
                    <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0;">Quick Start</h3>
                    <p style="font-size: 15px; color: #6b7280; margin: 0; line-height: 1.6;">Start with smart defaults and customize everything later</p>
                </div>
                
                <div style="text-align: center; position: relative; margin: 24px 0;">
                    <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #e5e7eb;"></div>
                    <span style="background: white; padding: 0 16px; color: #9ca3af; font-size: 13px; font-weight: 600; position: relative; z-index: 1;">OR</span>
                </div>
                
                <button onclick="FamilyManagement.showJoinFamilyDialog()" style="width: 100%; padding: 16px; background: transparent; border: 2px solid #e5e7eb; border-radius: 12px; color: #6b7280; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit;" onmouseover="this.style.borderColor='#10b981'; this.style.color='#10b981'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#6b7280'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                    Join an existing family instead
                </button>
            </div>
        `;
        
        loginOverlay.appendChild(setupContainer);
    }

    /**
     * Show options for creating additional families
     */
    function showCreateFamilyOptions() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 450px;">
                <div class="modal-header">
                    <h2>Create New Family</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p style="color: #6b7280; margin-bottom: 20px;">Choose your setup method:</p>
                    
                    <button onclick="this.closest('.modal').remove(); FamilyManagement.launchSetupWizard();" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; margin-bottom: 12px; text-align: left; display: flex; align-items: center; gap: 12px; font-family: inherit;">
                        <div style="font-size: 28px;">🎯</div>
                        <div style="flex: 1;">
                            <div style="font-size: 16px; margin-bottom: 2px;">Guided Setup</div>
                            <div style="font-size: 12px; opacity: 0.9;">Personalized (~20 min)</div>
                        </div>
                    </button>
                    
                    <button onclick="this.closest('.modal').remove(); FamilyManagement.quickStartFamily();" style="width: 100%; padding: 16px; background: white; color: #374151; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; margin-bottom: 12px; text-align: left; display: flex; align-items: center; gap: 12px; font-family: inherit;">
                        <div style="font-size: 28px;">⚡</div>
                        <div style="flex: 1;">
                            <div style="font-size: 16px; margin-bottom: 2px; color: #374151;">Quick Start</div>
                            <div style="font-size: 12px; color: #6b7280;">Default setup (~2 min)</div>
                        </div>
                    </button>
                    
                    <button onclick="this.closest('.modal').remove(); FamilyManagement.showJoinFamilyDialog();" style="width: 100%; padding: 16px; background: white; color: #374151; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 12px; font-family: inherit;">
                        <div style="font-size: 28px;">🔗</div>
                        <div style="flex: 1;">
                            <div style="font-size: 16px; margin-bottom: 2px; color: #374151;">Join Existing</div>
                            <div style="font-size: 12px; color: #6b7280;">Enter family code</div>
                        </div>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    /**
     * Launch the setup wizard
     */
    function launchSetupWizard() {
        const wizardUrl = 'https://type1unbound.github.io/family-tracker/compass-wizard.html';
        const wizardWindow = window.open(wizardUrl, 'compassWizard', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
        
        if (!wizardWindow) {
            alert('Please allow popups to use the Setup Wizard. You can also use Quick Start instead.');
            return;
        }
        
        console.log('🧙‍♂️ Setup wizard opened - waiting for completion...');
        window.addEventListener('message', handleWizardCompletion);
    }

    /**
     * Handle wizard completion
     */
    async function handleWizardCompletion(event) {
        if (!event.origin.includes('type1unbound.github.io') && !event.origin.includes('localhost')) {
            return;
        }
        
        if (event.data.type === 'WIZARD_COMPLETE') {
            console.log('✅ Wizard completed, received data:', event.data);
            
            try {
                showLoading();
                const familyId = await importWizardData(event.data.familyData);
                await switchToFamily(familyId);
                console.log('✅ Wizard import complete!');
            } catch (error) {
                console.error('❌ Error importing wizard data:', error);
                alert('Error setting up family from wizard: ' + error.message);
                hideLoading();
            }
            
            window.removeEventListener('message', handleWizardCompletion);
        }
    }

    /**
     * Import wizard data into Firebase
     */
    async function importWizardData(wizardData) {
        if (!currentUser) throw new Error('No user logged in');
        
        const familyId = 'family_' + Date.now();
        const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        await db.collection('families').doc(familyId).set({
            familyCode: familyCode,
            createdBy: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            members: [currentUser.uid],
            children: wizardData.children.map(c => c.id)
        });
        
        for (const child of wizardData.children) {
            await db.collection('families').doc(familyId)
                .collection('familyMembers').doc(child.id)
                .set({
                    name: child.name,
                    age: child.age,
                    photo: child.photo || null,
                    colorPalette: child.colorPalette || 'purple',
                    pointsBalance: 0,
                    pointsSpent: 0,
                    schedule: child.schedule || [],
                    characterValues: child.characterValues || [],
                    weeklyChores: child.weeklyChores || [],
                    rewards: child.rewards || [],
                    trackers: [],
                    days: {}
                });
        }
        
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
        
        return familyId;
    }

    /**
     * Show join family dialog
     */
    function showJoinFamilyDialog() {
        const existingModal = document.getElementById('join-family-modal');
        if (existingModal) existingModal.remove();
        
        const modal = document.createElement('div');
        modal.id = 'join-family-modal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 450px;">
                <div class="modal-header">
                    <h2>Join Existing Family</h2>
                    <button class="close-btn" onclick="document.getElementById('join-family-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p style="color: #6b7280; margin-bottom: 20px; font-size: 14px;">
                        Enter the family code shared with you to join and sync your data.
                    </p>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px;">Family Code</label>
                        <input 
                            type="text" 
                            id="join-family-code-input" 
                            placeholder="XXXXXX"
                            style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; font-family: 'Courier New', monospace; text-transform: uppercase; letter-spacing: 2px;"
                            maxlength="6"
                        >
                    </div>
                    
                    <div id="join-error-message" style="display: none; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; font-size: 13px; margin-bottom: 16px;"></div>
                    
                    <button 
                        onclick="FamilyManagement.joinFamilyByCode()"
                        style="width: 100%; padding: 14px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit;"
                    >
                        Join Family
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => document.getElementById('join-family-code-input').focus(), 100);
    }

    /**
     * Join family by code
     */
    async function joinFamilyByCode() {
        const codeInput = document.getElementById('join-family-code-input');
        const errorDiv = document.getElementById('join-error-message');
        const code = codeInput.value.trim().toUpperCase();
        
        if (!code) {
            errorDiv.textContent = 'Please enter a family code';
            errorDiv.style.display = 'block';
            return;
        }
        
        if (!currentUser) {
            errorDiv.textContent = 'You must be logged in to join a family';
            errorDiv.style.display = 'block';
            return;
        }
        
        try {
            errorDiv.style.display = 'none';
            showLoading();
            
            const familiesSnapshot = await db.collection('families')
                .where('familyCode', '==', code)
                .limit(1)
                .get();
            
            if (familiesSnapshot.empty) {
                hideLoading();
                errorDiv.textContent = 'Family code not found. Please check the code and try again.';
                errorDiv.style.display = 'block';
                return;
            }
            
            const familyDoc = familiesSnapshot.docs[0];
            const familyId = familyDoc.id;
            const familyData = familyDoc.data();
            
            const userRef = db.collection('users').doc(currentUser.uid);
            const userDoc = await userRef.get();
            const userData = userDoc.data() || {};
            const existingFamilyIds = userData.familyIds || [];
            
            if (existingFamilyIds.includes(familyId)) {
                hideLoading();
                document.getElementById('join-family-modal').remove();
                alert('You are already a member of this family!');
                await switchToFamily(familyId);
                return;
            }
            
            const members = familyData.members || [];
            if (!members.includes(currentUser.uid)) {
                await db.collection('families').doc(familyId).update({
                    members: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
                });
            }
            
            await userRef.set({
                email: currentUser.email,
                displayName: currentUser.displayName,
                familyIds: [...existingFamilyIds, familyId],
                lastActiveFamilyId: familyId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            document.getElementById('join-family-modal').remove();
            await switchToFamily(familyId);
            
        } catch (error) {
            console.error('❌ Error joining family:', error);
            hideLoading();
            errorDiv.textContent = 'Error joining family: ' + error.message;
            errorDiv.style.display = 'block';
        }
    }

    /**
     * Create empty family - QUICK START
     */
    async function quickStartFamily() {
        if (!currentUser) return;
        
        try {
            showLoading();
            
            const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const familyId = 'family_' + Date.now();
            
            await db.collection('families').doc(familyId).set({
                familyCode: familyCode,
                createdBy: currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                members: [currentUser.uid],
                children: ['child1']
            });
            
            await db.collection('families').doc(familyId)
                .collection('familyMembers').doc('child1')
                .set({
                    name: 'Family Member',
                    photo: null,
                    colorPalette: 'purple',
                    pointsBalance: 0,
                    pointsSpent: 0,
                    schedule: [],
                    characterValues: [],
                    weeklyChores: [],
                    rewards: [],
                    trackers: [],
                    days: {}
                });
            
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
            
            await switchToFamily(familyId);
            
        } catch (error) {
            console.error('❌ Error creating family:', error);
            alert('Error creating family: ' + error.message);
            hideLoading();
        }
    }

            
/**
 * Switch to a specific family
 */
async function switchToFamily(familyId) {
    if (!currentUser) return;
    
    try {
        showLoading();
        
        await db.collection('users').doc(currentUser.uid).update({
            lastActiveFamilyId: familyId,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        currentFamilyId = familyId;
        window.StateManager.state.familyId = familyId;
        
        const familyRef = db.collection('families').doc(familyId);
        const familyDoc = await familyRef.get();
        
        if (!familyDoc.exists) throw new Error('Family not found');
        
        const familyData = familyDoc.data();
        window.StateManager.state.children = familyData.children || [];
        window.StateManager.state.familyCode = familyData.familyCode;
        
        if (!window.StateManager.state.data) {
            window.StateManager.state.data = {};
        }
        
        for (const childId of window.StateManager.state.children) {
            const memberDoc = await familyRef.collection('familyMembers').doc(childId).get();
            
            if (memberDoc.exists) {
                window.StateManager.state.data[childId] = memberDoc.data();
                
                const memberData = window.StateManager.state.data[childId];
                if (!memberData.schedule) memberData.schedule = [];
                if (!memberData.weeklyChores) memberData.weeklyChores = [];
                if (!memberData.characterValues) memberData.characterValues = [];
                if (!memberData.rewards) memberData.rewards = [];
                if (!memberData.trackers) memberData.trackers = [];
                if (!memberData.days) memberData.days = {};
                
                const daysSnapshot = await familyRef.collection('familyMembers').doc(childId)
                    .collection('days').get();
                
                daysSnapshot.forEach(doc => {
                    memberData.days[doc.id] = doc.data();
                });
            } else {
                window.StateManager.createChild(childId, false);
            }
        }
        
        if (window.StateManager.state.children.length > 0 && !window.StateManager.state.currentChild) {
            window.StateManager.state.currentChild = window.StateManager.state.children[0];
        }
        
        // Show switch family button if multiple families
        if (userFamilies.length > 1) {
            const switchBtn = document.getElementById('switch-family-btn');
            if (switchBtn) switchBtn.style.display = 'flex';
        }
        
        // CRITICAL: Prepare UI for dashboard
        // 1. Hide login overlay
        const loginOverlay = document.getElementById('login-overlay');
        if (loginOverlay) {
            loginOverlay.style.display = 'none';
        }
        
        // 2. Ensure app container is visible
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.style.display = 'flex';
            appContainer.style.visibility = 'visible';
        }
        
        // 3. Wait for DOM to settle before initializing dashboard
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 4. Initialize dashboard
        await initializeDashboard();
        
    } catch (error) {
        console.error('❌ Error switching family:', error);
        alert('Error switching family: ' + error.message);
        hideLoading();
    }
}
    /**
     * Add family switcher to sidebar (if multiple families)
     */
    function addFamilySwitcher() {
        if (userFamilies.length <= 1) {
            const btn = document.getElementById('switch-family-btn');
            if (btn) btn.style.display = 'none';
            return;
        }
        
        const btn = document.getElementById('switch-family-btn');
        if (btn) btn.style.display = 'flex';
    }

    // Public API - exposed to window.FamilyManagement
    return {
        loadUserFamilies: loadUserFamilies,
        showFamilySelection: showFamilySelectionScreen,
        showFamilySelectionScreen: showFamilySelectionScreen,
        showFamilySetupChoice: showFamilySetupChoice,
        showCreateFamilyOptions: showCreateFamilyOptions,
        launchSetupWizard: launchSetupWizard,
        quickStartFamily: quickStartFamily,
        switchToFamily: switchToFamily,
        showJoinFamilyDialog: showJoinFamilyDialog,
        joinFamilyByCode: joinFamilyByCode,
        addFamilySwitcher: addFamilySwitcher,
        getUserFamilies: () => userFamilies,
        getCurrentFamilyId: () => currentFamilyId
    };
})();

// Export to window
window.FamilyManagement = FamilyManagement;

console.log('✅ Family Management System loaded (Namespace pattern)');
