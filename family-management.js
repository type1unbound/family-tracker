// ========================================
// FAMILY MANAGEMENT & SELECTION SYSTEM
// With Join Family Feature & Wizard Integration
// ========================================

// Track user's families
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
            // New user - no families yet
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
        console.log('   ℹ️  Original data in /users collection is preserved');
        console.log('   ℹ️  New data is in /families collection');
        
    } catch (error) {
        console.error('❌ Migration error:', error);
        throw new Error('Migration failed: ' + error.message);
    }
}

/**
 * Show family selection screen - PROFESSIONAL DESIGN
 */
function showFamilySelectionScreen(defaultFamilyId) {
    const loginOverlay = document.getElementById('login-overlay');
    const loginContent = document.getElementById('login-content');
    const loadingContent = document.getElementById('loading-content');
    
    if (loginOverlay) loginOverlay.style.display = 'flex';
    if (loginContent) loginContent.style.display = 'none';
    if (loadingContent) loadingContent.style.display = 'none';
    
    const selectionScreen = document.createElement('div');
    selectionScreen.id = 'family-selection-screen';
    selectionScreen.style.cssText = `
        display: block;
        text-align: center;
        color: white;
        padding: 48px 32px;
        max-width: 560px;
        margin: 0 auto;
    `;
    
    selectionScreen.innerHTML = `
        <div style="margin-bottom: 40px;">
            <div style="font-size: 48px; margin-bottom: 16px;">👨‍👩‍👧‍👦</div>
            <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Select Family</h1>
            <p style="margin: 0; opacity: 0.85; font-size: 15px;">Choose which family to manage</p>
        </div>
        
        <div id="family-cards-container" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
            ${userFamilies.map(family => {
                const memberCount = family.children ? family.children.length : 0;
                const isDefault = family.id === defaultFamilyId;
                
                return `
                    <button 
                         onclick="switchToFamily('${family.id}')"
                         style="
                            background: ${isDefault ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.12)'};
                            border: 1.5px solid ${isDefault ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'};
                            border-radius: 12px;
                            padding: 20px;
                            cursor: pointer;
                            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                            text-align: left;
                            position: relative;
                            width: 100%;
                            color: white;
                            font-size: 15px;
                         "
                         onmouseover="this.style.background='rgba(255,255,255,0.25)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.15)'"
                         onmouseout="this.style.background='${isDefault ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.12)'}'; this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                    >
                        ${isDefault ? '<div style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.25); padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px;">ACTIVE</div>' : ''}
                        
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div style="font-size: 32px; line-height: 1;">👨‍👩‍👧‍👦</div>
                            <div style="flex: 1;">
                                <div style="font-size: 17px; font-weight: 600; margin-bottom: 2px; letter-spacing: -0.2px;">
                                    ${family.familyCode || 'Family'}
                                </div>
                                <div style="opacity: 0.75; font-size: 13px;">
                                    ${memberCount} member${memberCount !== 1 ? 's' : ''}
                                </div>
                            </div>
                            <div style="font-size: 18px; opacity: 0.6;">→</div>
                        </div>
                    </button>
                `;
            }).join('')}
        </div>
        
        <button 
            onclick="showCreateFamilyOptions()"
            style="
                width: 100%;
                padding: 16px;
                background: rgba(255,255,255,0.08);
                border: 1.5px dashed rgba(255,255,255,0.3);
                border-radius: 12px;
                color: white;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                margin-bottom: 16px;
            "
            onmouseover="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.4)'"
            onmouseout="this.style.background='rgba(255,255,255,0.08)'; this.style.borderColor='rgba(255,255,255,0.3)'"
        >
            <span style="margin-right: 6px;">+</span> Create New Family
        </button>
        
        <button 
            onclick="auth.signOut()"
            style="
                padding: 12px;
                background: transparent;
                border: none;
                color: rgba(255,255,255,0.6);
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
                width: 100%;
            "
            onmouseover="this.style.color='rgba(255,255,255,0.9)'"
            onmouseout="this.style.color='rgba(255,255,255,0.6)'"
        >
            Sign Out
        </button>
    `;
    
    if (loginOverlay) {
        const existingSelection = document.getElementById('family-selection-screen');
        if (existingSelection) existingSelection.remove();
        loginOverlay.appendChild(selectionScreen);
    }
}

/**
 * Show setup choice for new users - NEW SIMPLIFIED VERSION
 */
function showFamilySetupChoice() {
    const loginOverlay = document.getElementById('login-overlay');
    const loginContent = document.getElementById('login-content');
    const loadingContent = document.getElementById('loading-content');
    
    if (loginOverlay) loginOverlay.style.display = 'flex';
    if (loginContent) loginContent.style.display = 'none';
    if (loadingContent) loadingContent.style.display = 'none';
    
    const setupScreen = document.createElement('div');
    setupScreen.id = 'family-setup-screen';
    setupScreen.style.cssText = `
        display: block;
        padding: 48px 32px;
        max-width: 480px;
        margin: 0 auto;
    `;
    
    setupScreen.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px; color: white;">
            <div style="width: 64px; height: 64px; margin: 0 auto 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                <svg viewBox="0 0 24 24" stroke="white" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="2.5" style="width: 32px; height: 32px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="white"></polygon>
                </svg>
            </div>
            <h2 style="font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">Welcome to Compass</h2>
            <p style="font-size: 16px; opacity: 0.85; margin: 0;">Let's get your family started</p>
        </div>
        
        <div onclick="launchSetupWizard()" style="background: white; border: 3px solid #10b981; border-radius: 16px; padding: 28px; margin-bottom: 16px; cursor: pointer; text-align: center; transition: all 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(16, 185, 129, 0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
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
        
        <div onclick="quickStartFamily()" style="background: white; border: 2px solid #e5e7eb; border-radius: 16px; padding: 28px; margin-bottom: 24px; cursor: pointer; text-align: center; transition: all 0.2s;" onmouseover="this.style.borderColor='#10b981'" onmouseout="this.style.borderColor='#e5e7eb'">
            <div style="width: 48px; height: 48px; background: #f9fafb; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
            </div>
            <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0;">Quick Start</h3>
            <p style="font-size: 15px; color: #6b7280; margin: 0; line-height: 1.6;">Start with smart defaults and customize everything later</p>
        </div>
        
        <div style="text-align: center; position: relative; margin: 24px 0;">
            <span style="background: transparent; padding: 0 16px; color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 600; position: relative; z-index: 1;">OR</span>
            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(255,255,255,0.2);"></div>
        </div>
        
        <button onclick="showJoinFamilyDialog()" style="width: 100%; padding: 16px; background: transparent; border: 2px solid rgba(255,255,255,0.3); border-radius: 12px; color: white; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;" onmouseover="this.style.borderColor='rgba(255,255,255,0.5)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.3)'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            Join an existing family instead
        </button>
    `;
    
    if (loginOverlay) {
        const existingSetup = document.getElementById('family-setup-screen');
        if (existingSetup) existingSetup.remove();
        loginOverlay.appendChild(setupScreen);
    }
}

/**
 * Show options for creating additional families
 */
function showCreateFamilyOptions() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 520px; border-radius: 16px;">
            <div class="modal-header" style="padding: 24px 24px 16px 24px; border-bottom: 1px solid #e5e7eb;">
                <h2 style="margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.3px;">Create New Family</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()" style="font-size: 24px; color: #9ca3af; background: none; border: none; cursor: pointer; padding: 0; width: 32px; height: 32px;">×</button>
            </div>
            <div class="modal-body" style="padding: 24px;">
                <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">Choose your setup method:</p>
                
                <div style="display: grid; gap: 12px;">
                    <button 
                        onclick="this.closest('.modal').remove(); launchSetupWizard();"
                        style="
                            width: 100%;
                            padding: 18px;
                            background: linear-gradient(135deg, #93c593, #6ba86b);
                            color: white;
                            border: none;
                            border-radius: 10px;
                            font-size: 15px;
                            font-weight: 600;
                            cursor: pointer;
                            text-align: left;
                            transition: all 0.2s;
                        "
                        onmouseover="this.style.transform='translateX(4px)'; this.style.boxShadow='0 4px 12px rgba(147, 197, 147, 0.3)'"
                        onmouseout="this.style.transform='translateX(0)'; this.style.boxShadow='none'"
                    >
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div style="font-size: 28px; line-height: 1;">🎯</div>
                            <div style="flex: 1;">
                                <div style="font-size: 16px; margin-bottom: 2px;">Guided Setup</div>
                                <div style="font-size: 12px; opacity: 0.9;">Personalized (~20 min)</div>
                            </div>
                            <div style="font-size: 18px; opacity: 0.7;">→</div>
                        </div>
                    </button>
                    
                    <button 
                        onclick="this.closest('.modal').remove(); quickStartFamily();"
                        style="
                            width: 100%;
                            padding: 18px;
                            background: white;
                            color: #1f2937;
                            border: 1.5px solid #e5e7eb;
                            border-radius: 10px;
                            font-size: 15px;
                            font-weight: 600;
                            cursor: pointer;
                            text-align: left;
                            transition: all 0.2s;
                        "
                        onmouseover="this.style.borderColor='#93c593'; this.style.transform='translateX(4px)'"
                        onmouseout="this.style.borderColor='#e5e7eb'; this.style.transform='translateX(0)'"
                    >
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div style="font-size: 28px; line-height: 1;">⚡</div>
                            <div style="flex: 1;">
                                <div style="font-size: 16px; margin-bottom: 2px;">Quick Start</div>
                                <div style="font-size: 12px; color: #6b7280;">Default setup (~2 min)</div>
                            </div>
                            <div style="font-size: 18px; opacity: 0.4;">→</div>
                        </div>
                    </button>
                    
                    <button 
                        onclick="this.closest('.modal').remove(); showJoinFamilyDialog();"
                        style="
                            width: 100%;
                            padding: 18px;
                            background: white;
                            color: #1f2937;
                            border: 1.5px solid #e5e7eb;
                            border-radius: 10px;
                            font-size: 15px;
                            font-weight: 600;
                            cursor: pointer;
                            text-align: left;
                            transition: all 0.2s;
                        "
                        onmouseover="this.style.borderColor='#93c593'; this.style.transform='translateX(4px)'"
                        onmouseout="this.style.borderColor='#e5e7eb'; this.style.transform='translateX(0)'"
                    >
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div style="font-size: 28px; line-height: 1;">🔗</div>
                            <div style="flex: 1;">
                                <div style="font-size: 16px; margin-bottom: 2px;">Join Existing</div>
                                <div style="font-size: 12px; color: #6b7280;">Enter family code</div>
                            </div>
                            <div style="font-size: 18px; opacity: 0.4;">→</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

/**
 * Launch the setup wizard - Opens wizard in new window
 */
function launchSetupWizard() {
    const wizardUrl = 'https://type1unbound.github.io/family-tracker/compass-wizard.html';
    const wizardWindow = window.open(wizardUrl, 'compassWizard', 'width=1200,height=900,menubar=no,toolbar=no,location=no,status=no');
    
    if (!wizardWindow) {
        alert('Please allow popups to use the Setup Wizard. You can also use Quick Start instead.');
        return;
    }
    
    console.log('🧙‍♂️ Setup wizard opened - waiting for completion...');
    
    // Listen for wizard completion message
    window.addEventListener('message', handleWizardCompletion);
}

/**
 * Handle wizard completion - receives data from compass-wizard.html
 */
async function handleWizardCompletion(event) {
    // Verify origin for security
    if (!event.origin.includes('type1unbound.github.io') && !event.origin.includes('localhost')) {
        return;
    }
    
    if (event.data.type === 'WIZARD_COMPLETE') {
        console.log('✅ Wizard completed, received data:', event.data);
        
        try {
            showLoading();
            
            // Import wizard data into new family
            const familyId = await importWizardData(event.data.familyData);
            
            // Switch to the new family
            await switchToFamily(familyId);
            
            console.log('✅ Wizard import complete!');
            
        } catch (error) {
            console.error('❌ Error importing wizard data:', error);
            alert('Error setting up family from wizard: ' + error.message);
            hideLoading();
        }
        
        // Remove event listener
        window.removeEventListener('message', handleWizardCompletion);
    }
}

/**
 * Import wizard data into Firebase
 */
async function importWizardData(wizardData) {
    if (!currentUser) {
        throw new Error('No user logged in');
    }
    
    const familyId = 'family_' + Date.now();
    const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Create family document
    await db.collection('families').doc(familyId).set({
        familyCode: familyCode,
        createdBy: currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        members: [currentUser.uid],
        children: wizardData.children.map(c => c.id)
    });
    
    // Create each child
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
    
    // Add family to user's list
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
 * Show join family dialog - allows user to join existing family by code
 */
function showJoinFamilyDialog() {
    const existingModal = document.getElementById('join-family-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'join-family-modal';
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 450px; border-radius: 16px;">
            <div class="modal-header" style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
                <h2 style="margin: 0; font-size: 20px; font-weight: 600;">Join Existing Family</h2>
                <button class="close-btn" onclick="document.getElementById('join-family-modal').remove()">×</button>
            </div>
            <div class="modal-body" style="padding: 24px;">
                <p style="color: #6b7280; margin-bottom: 20px; font-size: 14px;">
                    Enter the family code shared with you to join and sync your data.
                </p>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 8px;">Family Code</label>
                    <input 
                        type="text" 
                        id="join-family-code-input" 
                        placeholder="XXXXXX"
                        style="
                            width: 100%;
                            padding: 12px;
                            border: 2px solid #e5e7eb;
                            border-radius: 8px;
                            font-size: 16px;
                            font-family: 'Courier New', monospace;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                        "
                        maxlength="6"
                    >
                </div>
                
                <div id="join-error-message" style="display: none; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; font-size: 13px; margin-bottom: 16px;"></div>
                
                <button 
                    onclick="joinFamilyByCode()"
                    style="
                        width: 100%;
                        padding: 14px;
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-size: 15px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                    "
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.3)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                >
                    Join Family
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus the input
    setTimeout(() => {
        document.getElementById('join-family-code-input').focus();
    }, 100);
}

/**
 * Join family by code - adds user to existing family
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
        
        console.log('🔍 Looking for family with code:', code);
        
        // Search for family with this code
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
        
        console.log('✅ Found family:', familyId);
        
        // Check if user is already in this family
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
        
        // Add user to family members list
        const members = familyData.members || [];
        if (!members.includes(currentUser.uid)) {
            await db.collection('families').doc(familyId).update({
                members: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
            });
        }
        
        // Add family to user's familyIds
        await userRef.set({
            email: currentUser.email,
            displayName: currentUser.displayName,
            familyIds: [...existingFamilyIds, familyId],
            lastActiveFamilyId: familyId,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log('✅ Successfully joined family:', code);
        
        // Close modal
        document.getElementById('join-family-modal').remove();
        
        // Switch to the new family
        await switchToFamily(familyId);
        
    } catch (error) {
        console.error('❌ Error joining family:', error);
        hideLoading();
        errorDiv.textContent = 'Error joining family: ' + error.message;
        errorDiv.style.display = 'block';
    }
}

/**
 * Create empty family with defaults - QUICK START
 */
async function quickStartFamily() {
    if (!currentUser) return;
    
    try {
        console.log('⚡ Creating quick start family...');
        showLoading();
        
        const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const familyId = 'family_' + Date.now();
        
        // Create family with one default child
        await db.collection('families').doc(familyId).set({
            familyCode: familyCode,
            createdBy: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            members: [currentUser.uid],
            children: ['child1']
        });
        
        // Create default child with empty data
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
        
        // Add family to user
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
        
        console.log('✅ Quick start family created:', familyCode);
        await switchToFamily(familyId);
        
    } catch (error) {
        console.error('❌ Error creating family:', error);
        alert('Error creating family: ' + error.message);
        hideLoading();
    }
}

/**
 * Switch to a specific family - UPDATED with better data loading
 */
async function switchToFamily(familyId) {
    if (!currentUser) return;
    
    try {
        console.log('🔄 Switching to family:', familyId);
        showLoading();
        
        // Update user's active family
        await db.collection('users').doc(currentUser.uid).update({
            lastActiveFamilyId: familyId,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        currentFamilyId = familyId;
        window.StateManager.state.familyId = familyId;
        
        const familyRef = db.collection('families').doc(familyId);
        const familyDoc = await familyRef.get();
        
        if (!familyDoc.exists) {
            throw new Error('Family not found');
        }
        
        const familyData = familyDoc.data();
        window.StateManager.state.children = familyData.children || [];
        window.StateManager.state.familyCode = familyData.familyCode;
        
        console.log('  Loading', window.StateManager.state.children.length, 'family members...');
        
        // Initialize data object if it doesn't exist
        if (!window.StateManager.state.data) {
            window.StateManager.state.data = {};
        }
        
        // Load each child's data
        for (const childId of window.StateManager.state.children) {
            const memberDoc = await familyRef.collection('familyMembers').doc(childId).get();
            
            if (memberDoc.exists) {
                window.StateManager.state.data[childId] = memberDoc.data();
                
                // Verify and initialize missing arrays
                const memberData = window.StateManager.state.data[childId];
                if (!memberData.schedule) memberData.schedule = [];
                if (!memberData.weeklyChores) memberData.weeklyChores = [];
                if (!memberData.characterValues) memberData.characterValues = [];
                if (!memberData.rewards) memberData.rewards = [];
                if (!memberData.trackers) memberData.trackers = [];
                if (!memberData.days) memberData.days = {};
                
                // Load days data
                const daysSnapshot = await familyRef.collection('familyMembers').doc(childId)
                    .collection('days').get();
                
                daysSnapshot.forEach(doc => {
                    memberData.days[doc.id] = doc.data();
                });
                
                console.log('  ✓ Loaded', memberData.name || childId);
            } else {
                // Create empty child if doesn't exist
                window.StateManager.createChild(childId, false);
            }
        }
        
        // Set current child if not set
        if (window.StateManager.state.children.length > 0 && !window.StateManager.state.currentChild) {
            window.StateManager.state.currentChild = window.StateManager.state.children[0];
        }
        
        console.log('✅ Switched to family successfully');
        
        // Show switch family button if multiple families
        if (userFamilies.length > 1) {
            const switchBtn = document.getElementById('switch-family-btn');
            if (switchBtn) switchBtn.style.display = 'flex';
        }
        
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

// Export functions globally
window.loadUserFamilies = loadUserFamilies;
window.showFamilySelectionScreen = showFamilySelectionScreen;
window.showFamilySetupChoice = showFamilySetupChoice;
window.showCreateFamilyOptions = showCreateFamilyOptions;
window.launchSetupWizard = launchSetupWizard;
window.handleWizardCompletion = handleWizardCompletion;
window.importWizardData = importWizardData;
window.showJoinFamilyDialog = showJoinFamilyDialog;
window.joinFamilyByCode = joinFamilyByCode;
window.quickStartFamily = quickStartFamily;
window.switchToFamily = switchToFamily;
window.addFamilySwitcher = addFamilySwitcher;
window.migrateOldUserData = migrateOldUserData;

console.log('✅ Family Management System loaded (with Join Family & Wizard support)');
