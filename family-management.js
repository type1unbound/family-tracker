// ========================================
// FAMILY MANAGEMENT & SELECTION SYSTEM
// With Safe Migration - PROFESSIONAL DESIGN
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
 * Show setup choice for new users - PROFESSIONAL DESIGN (NO TAGLINE)
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
        text-align: center;
        color: white;
        padding: 48px 32px;
        max-width: 720px;
        margin: 0 auto;
    `;
    
    setupScreen.innerHTML = `
        <div style="margin-bottom: 48px;">
            <div style="font-size: 56px; margin-bottom: 20px; line-height: 1;">🧭</div>
            <h1 style="margin: 0 0 12px 0; font-size: 32px; font-weight: 700; letter-spacing: -0.8px;">Welcome to Compass</h1>
            <p style="margin: 0; opacity: 0.85; font-size: 16px; font-weight: 400;">Let's set up your family tracking system</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px;">
            <!-- Guided Setup -->
            <button 
                 onclick="launchSetupWizard()"
                 style="
                    background: linear-gradient(135deg, rgba(147, 197, 147, 0.25), rgba(107, 168, 107, 0.25));
                    border: 1.5px solid rgba(147, 197, 147, 0.4);
                    border-radius: 16px;
                    padding: 32px 24px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-align: center;
                    color: white;
                 "
                 onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.2)'; this.style.borderColor='rgba(147, 197, 147, 0.6)'"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'; this.style.borderColor='rgba(147, 197, 147, 0.4)'"
            >
                <div style="font-size: 48px; margin-bottom: 16px; line-height: 1;">🎯</div>
                <h3 style="font-size: 19px; margin: 0 0 8px 0; font-weight: 600; letter-spacing: -0.3px;">Guided Setup</h3>
                <p style="font-size: 14px; opacity: 0.85; margin: 0 0 16px 0; line-height: 1.5;">
                    Personalized routines, goals, and rewards based on your family's needs
                </p>
                <div style="display: inline-block; padding: 6px 12px; background: rgba(255,255,255,0.15); border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.3px; margin-bottom: 16px;">
                    20 MIN
                </div>
                <div style="padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.15); font-size: 13px; line-height: 1.8; text-align: left;">
                    ✓ Age-appropriate tasks<br>
                    ✓ Motivation-based rewards<br>
                    ✓ Customized point system
                </div>
            </button>
            
            <!-- Quick Start -->
            <button 
                 onclick="createEmptyFamily()"
                 style="
                    background: rgba(255,255,255,0.12);
                    border: 1.5px solid rgba(255,255,255,0.25);
                    border-radius: 16px;
                    padding: 32px 24px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-align: center;
                    color: white;
                 "
                 onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.2)'; this.style.borderColor='rgba(255,255,255,0.4)'"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'; this.style.borderColor='rgba(255,255,255,0.25)'"
            >
                <div style="font-size: 48px; margin-bottom: 16px; line-height: 1;">⚡</div>
                <h3 style="font-size: 19px; margin: 0 0 8px 0; font-weight: 600; letter-spacing: -0.3px;">Quick Start</h3>
                <p style="font-size: 14px; opacity: 0.85; margin: 0 0 16px 0; line-height: 1.5;">
                    Start with basic setup and customize as you explore the system
                </p>
                <div style="display: inline-block; padding: 6px 12px; background: rgba(255,255,255,0.15); border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.3px; margin-bottom: 16px;">
                    2 MIN
                </div>
                <div style="padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.15); font-size: 13px; line-height: 1.8; text-align: left;">
                    ✓ Default templates<br>
                    ✓ Standard routines<br>
                    ✓ Edit anytime in settings
                </div>
            </button>
        </div>
        
        <div style="padding: 14px 20px; background: rgba(255,255,255,0.08); border-radius: 10px; font-size: 13px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.1);">
            <strong style="opacity: 0.95;">Tip:</strong> <span style="opacity: 0.75;">We recommend Guided Setup for a personalized experience</span>
        </div>
        
        <button 
            onclick="auth.signOut()"
            style="
                padding: 12px;
                background: transparent;
                border: none;
                color: rgba(255,255,255,0.5);
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
            "
            onmouseover="this.style.color='rgba(255,255,255,0.8)'"
            onmouseout="this.style.color='rgba(255,255,255,0.5)'"
        >
            Sign Out
        </button>
    `;
    
    if (loginOverlay) {
        const existingSetup = document.getElementById('family-setup-screen');
        if (existingSetup) existingSetup.remove();
        loginOverlay.appendChild(setupScreen);
    }
}

/**
 * Show options for creating additional families - PROFESSIONAL DESIGN
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
                        onclick="this.closest('.modal').remove(); createEmptyFamily();"
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
 * Launch the setup wizard - NO INSTRUCTION MODAL (automatic import)
 */
function launchSetupWizard() {
    const wizardUrl = 'https://type1unbound.github.io/family-tracker/onboarding.html';
    const wizardWindow = window.open(wizardUrl, '_blank', 'width=1000,height=800');
    
    if (!wizardWindow) {
        alert('Please allow popups to use the Setup Wizard.');
        return;
    }
    
    // No instruction modal - automatic import handles everything!
    console.log('🧙‍♂️ Wizard opened - waiting for automatic data transfer...');
}

/**
 * Show join family dialog
 */
function showJoinFamilyDialog() {
    if (window.showFamilyCodeModal) {
        showFamilyCodeModal();
    }
}

/**
 * Create empty family with defaults
 */
async function createEmptyFamily() {
    if (!currentUser) return;
    
    try {
        console.log('⚡ Creating empty family...');
        showLoading();
        
        const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const familyId = 'family_' + Date.now();
        
        await db.collection('families').doc(familyId).set({
            familyCode: familyCode,
            createdBy: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            children: ['child1', 'child2']
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
        
        console.log('✅ Empty family created:', familyCode);
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
        console.log('🔄 Switching to family:', familyId);
        showLoading();
        
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
        window.StateManager.state.children = familyData.children || ['child1', 'child2'];
        window.StateManager.state.familyCode = familyData.familyCode;
        
        console.log('  Loading', window.StateManager.state.children.length, 'family members...');
        
        // Initialize data object if it doesn't exist
        if (!window.StateManager.state.data) {
            window.StateManager.state.data = {};
        }
        
        for (const childId of window.StateManager.state.children) {
            const memberDoc = await familyRef.collection('familyMembers').doc(childId).get();
            
            if (memberDoc.exists) {
                window.StateManager.state.data[childId] = memberDoc.data();
                
                if (!window.StateManager.state.data[childId].trackers) {
                    window.StateManager.state.data[childId].trackers = [];
                }
                if (!window.StateManager.state.data[childId].days) {
                    window.StateManager.state.data[childId].days = {};
                }
                
                const daysSnapshot = await familyRef.collection('familyMembers').doc(childId)
                    .collection('days').get();
                
                daysSnapshot.forEach(doc => {
                    window.StateManager.state.data[childId].days[doc.id] = doc.data();
                });
                
                console.log('  ✓ Loaded', window.StateManager.state.data[childId].name);
            } else if (!window.StateManager.state.data[childId]) {
                window.StateManager.createChild(childId);
            }
        }
        
        if (window.StateManager.state.children.length > 0) {
            window.StateManager.state.currentChild = window.StateManager.state.children[0];
        }
        
        console.log('✅ Switched to family successfully');
        await initializeDashboard();
        
    } catch (error) {
        console.error('❌ Error switching family:', error);
        alert('Error switching family: ' + error.message);
        hideLoading();
    }
}

/**
 * Add family switcher to dashboard header
 */
function addFamilySwitcher() {
    if (userFamilies.length <= 1) return;
    
    const header = document.querySelector('h1');
    if (!header || document.getElementById('family-switcher-btn')) return;
    
    const switcherBtn = document.createElement('button');
    switcherBtn.id = 'family-switcher-btn';
    switcherBtn.innerHTML = '🔄 Switch Family';
    switcherBtn.style.cssText = `
        float: right;
        margin-right: 8px;
        padding: 8px 16px;
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.4);
        border-radius: 8px;
        color: white;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
    `;
    switcherBtn.onmouseover = () => switcherBtn.style.background = 'rgba(255,255,255,0.3)';
    switcherBtn.onmouseout = () => switcherBtn.style.background = 'rgba(255,255,255,0.2)';
    switcherBtn.onclick = () => showFamilySelectionScreen(currentFamilyId);
    
    header.parentElement.insertBefore(switcherBtn, header);
}

// Export functions globally
window.loadUserFamilies = loadUserFamilies;
window.showFamilySelectionScreen = showFamilySelectionScreen;
window.showFamilySetupChoice = showFamilySetupChoice;
window.showCreateFamilyOptions = showCreateFamilyOptions;
window.launchSetupWizard = launchSetupWizard;
window.createEmptyFamily = createEmptyFamily;
window.switchToFamily = switchToFamily;
window.addFamilySwitcher = addFamilySwitcher;
window.showJoinFamilyDialog = showJoinFamilyDialog;
window.migrateOldUserData = migrateOldUserData;

console.log('✅ Family Management System loaded (Professional Design)');
