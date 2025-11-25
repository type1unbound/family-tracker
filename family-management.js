// ========================================
// FAMILY MANAGEMENT & SELECTION SYSTEM
// With Safe Migration for Existing Users
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
        
        // ========================================
        // MIGRATION CHECK FOR EXISTING USERS
        // ========================================
        // If user has old single familyId but no familyIds array, migrate them
        if (userData.familyId && !userData.familyIds) {
            console.log('🔄 Detected old user format - migrating to multi-family structure...');
            
            try {
                await migrateOldUserData(userRef, userData);
                
                // Reload user data after migration
                const updatedDoc = await userRef.get();
                const updatedData = updatedDoc.data();
                const familyIds = updatedData.familyIds || [];
                
                console.log('✅ Migration complete! User now has', familyIds.length, 'family/families');
                
                if (familyIds.length === 0) {
                    console.log('User has no families after migration - showing setup wizard');
                    showFamilySetupChoice();
                    return;
                }
                
                // Continue with migrated data
                await loadFamiliesAndShowScreen(updatedData, familyIds);
                return;
                
            } catch (error) {
                console.error('❌ Migration failed:', error);
                alert('Error migrating your data. Please contact support. Your original data is safe.');
                hideLoading();
                return;
            }
        }
        
        // ========================================
        // NORMAL FLOW (New multi-family users)
        // ========================================
        
        // Get all family IDs user belongs to
        const familyIds = userData.familyIds || [];
        
        if (familyIds.length === 0) {
            // User exists but has no families - show setup
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
    // Load family details
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
    
    // Get last active family or use first one
    const lastFamilyId = userData.lastActiveFamilyId || familyIds[0];
    
    if (userFamilies.length === 1) {
        // Only one family - go directly to dashboard
        await switchToFamily(lastFamilyId);
    } else {
        // Multiple families - show selection screen
        showFamilySelectionScreen(lastFamilyId);
    }
}

/**
 * Migrate old single-family data to new multi-family structure
 * SAFE: Copies data, does NOT delete original
 */
async function migrateOldUserData(userRef, userData) {
    try {
        console.log('🔄 Starting migration...');
        console.log('   - Original familyId:', userData.familyId);
        
        const oldFamilyId = userData.familyId;
        const userId = userRef.id;
        
        // Check if family document already exists in new location
        const existingFamilyDoc = await db.collection('families').doc(oldFamilyId).get();
        
        if (existingFamilyDoc.exists) {
            console.log('   ✓ Family document already exists in /families - skipping family creation');
        } else {
            // Create new family document in /families collection
            const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            
            console.log('   - Creating family document with code:', familyCode);
            
            await db.collection('families').doc(oldFamilyId).set({
                familyCode: familyCode,
                createdBy: userId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                migratedFrom: 'legacy',
                migratedAt: firebase.firestore.FieldValue.serverTimestamp(),
                children: [] // Will be populated below
            });
        }
        
        // Get all family members from old location (/users/{uid}/familyMembers)
        console.log('   - Copying family members from /users to /families...');
        const oldMembersSnapshot = await userRef.collection('familyMembers').get();
        const childIds = [];
        
        for (const memberDoc of oldMembersSnapshot.docs) {
            childIds.push(memberDoc.id);
            const memberData = memberDoc.data();
            
            // Check if member already exists in new location
            const newMemberRef = db.collection('families').doc(oldFamilyId)
                .collection('familyMembers').doc(memberDoc.id);
            const existingMember = await newMemberRef.get();
            
            if (!existingMember.exists) {
                // Copy member to new location (COPY, not move - original stays)
                await newMemberRef.set(memberData);
                console.log(`     ✓ Copied ${memberData.name || memberDoc.id}`);
                
                // Copy days data
                const daysSnapshot = await memberDoc.ref.collection('days').get();
                let dayCount = 0;
                for (const dayDoc of daysSnapshot.docs) {
                    await newMemberRef.collection('days').doc(dayDoc.id).set(dayDoc.data());
                    dayCount++;
                }
                console.log(`       → Copied ${dayCount} days of data`);
                
                // Copy tracker data if it exists
                const trackerSnapshot = await memberDoc.ref.collection('trackerData').get();
                if (!trackerSnapshot.empty) {
                    let trackerCount = 0;
                    for (const trackerDoc of trackerSnapshot.docs) {
                        await newMemberRef.collection('trackerData').doc(trackerDoc.id).set(trackerDoc.data());
                        
                        // Copy tracker entries
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
        
        // Update family document with children list
        await db.collection('families').doc(oldFamilyId).update({
            children: childIds
        });
        
        console.log('   - Updating user document to multi-family format...');
        
        // Update user document to new format
        // IMPORTANT: We keep the old familyId field for backwards compatibility
        await userRef.update({
            familyIds: [oldFamilyId],  // NEW: Array of family IDs
            lastActiveFamilyId: oldFamilyId,  // NEW: Track last active
            migratedAt: firebase.firestore.FieldValue.serverTimestamp(),
            // familyId: oldFamilyId  ← KEPT (not removed) for backwards compatibility
        });
        
        console.log('✅ Migration complete!');
        console.log('   ℹ️  Original data in /users collection is preserved');
        console.log('   ℹ️  New data is in /families collection');
        console.log('   ℹ️  User can now access multi-family features');
        
    } catch (error) {
        console.error('❌ Migration error:', error);
        throw new Error('Migration failed: ' + error.message);
    }
}

/**
 * Show family selection screen for users with multiple families
 */
function showFamilySelectionScreen(defaultFamilyId) {
    const loginOverlay = document.getElementById('login-overlay');
    const loginContent = document.getElementById('login-content');
    const loadingContent = document.getElementById('loading-content');
    
    if (loginOverlay) loginOverlay.style.display = 'flex';
    if (loginContent) loginContent.style.display = 'none';
    if (loadingContent) loadingContent.style.display = 'none';
    
    // Create family selection UI
    const selectionScreen = document.createElement('div');
    selectionScreen.id = 'family-selection-screen';
    selectionScreen.style.cssText = `
        display: block;
        text-align: center;
        color: white;
        padding: 40px;
        max-width: 600px;
        margin: 0 auto;
    `;
    
    selectionScreen.innerHTML = `
        <h1 style="margin-bottom: 16px; font-size: 32px;">👨‍👩‍👧‍👦 Select Family</h1>
        <p style="margin-bottom: 32px; opacity: 0.9;">Choose which family to manage:</p>
        
        <div id="family-cards-container" style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
            ${userFamilies.map(family => {
                const memberCount = family.children ? family.children.length : 0;
                const isDefault = family.id === defaultFamilyId;
                
                return `
                    <div class="family-card" 
                         onclick="switchToFamily('${family.id}')"
                         style="
                            background: ${isDefault ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'};
                            border: 2px solid ${isDefault ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)'};
                            border-radius: 12px;
                            padding: 24px;
                            cursor: pointer;
                            transition: all 0.3s;
                            text-align: left;
                            position: relative;
                         "
                         onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.transform='translateX(8px)'"
                         onmouseout="this.style.background='${isDefault ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'}'; this.style.transform='translateX(0)'"
                    >
                        ${isDefault ? '<div style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.3); padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">LAST ACTIVE</div>' : ''}
                        
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="font-size: 48px;">👨‍👩‍👧‍👦</div>
                            <div style="flex: 1;">
                                <div style="font-size: 20px; font-weight: 600; margin-bottom: 4px;">
                                    Family ${family.familyCode || ''}
                                </div>
                                <div style="opacity: 0.8; font-size: 14px;">
                                    ${memberCount} member${memberCount !== 1 ? 's' : ''}
                                </div>
                            </div>
                            <div style="font-size: 24px;">→</div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <button 
            onclick="showCreateFamilyOptions()"
            style="
                width: 100%;
                padding: 16px;
                background: rgba(255,255,255,0.2);
                border: 2px dashed rgba(255,255,255,0.5);
                border-radius: 12px;
                color: white;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            "
            onmouseover="this.style.background='rgba(255,255,255,0.3)'"
            onmouseout="this.style.background='rgba(255,255,255,0.2)'"
        >
            ➕ Create New Family
        </button>
        
        <button 
            onclick="auth.signOut()"
            style="
                margin-top: 24px;
                padding: 12px 24px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.3);
                border-radius: 8px;
                color: white;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
            "
            onmouseover="this.style.background='rgba(255,255,255,0.2)'"
            onmouseout="this.style.background='rgba(255,255,255,0.1)'"
        >
            🚪 Sign Out
        </button>
    `;
    
    // Add to overlay
    if (loginOverlay) {
        // Clear existing content
        const existingSelection = document.getElementById('family-selection-screen');
        if (existingSelection) existingSelection.remove();
        
        loginOverlay.appendChild(selectionScreen);
    }
}

/**
 * Show setup choice for new users (wizard or manual)
 */
function showFamilySetupChoice() {
    const loginOverlay = document.getElementById('login-overlay');
    const loginContent = document.getElementById('login-content');
    const loadingContent = document.getElementById('loading-content');
    
    if (loginOverlay) loginOverlay.style.display = 'flex';
    if (loginContent) loginContent.style.display = 'none';
    if (loadingContent) loadingContent.style.display = 'none';
    
    // Create setup choice UI
    const setupScreen = document.createElement('div');
    setupScreen.id = 'family-setup-screen';
    setupScreen.style.cssText = `
        display: block;
        text-align: center;
        color: white;
        padding: 40px;
        max-width: 700px;
        margin: 0 auto;
    `;
    
    setupScreen.innerHTML = `
        <h1 style="margin-bottom: 16px; font-size: 36px;">🎉 Welcome to Compass!</h1>
        <p style="margin-bottom: 48px; font-size: 18px; opacity: 0.9;">Let's set up your first family</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
            <!-- Setup Wizard Option -->
            <div class="setup-option"
                 onclick="launchSetupWizard()"
                 style="
                    background: linear-gradient(135deg, rgba(147, 197, 147, 0.3), rgba(107, 168, 107, 0.3));
                    border: 2px solid rgba(147, 197, 147, 0.5);
                    border-radius: 16px;
                    padding: 32px 24px;
                    cursor: pointer;
                    transition: all 0.3s;
                 "
                 onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.2)'"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
            >
                <div style="font-size: 64px; margin-bottom: 16px;">🧙‍♂️</div>
                <h3 style="font-size: 20px; margin-bottom: 12px; font-weight: 600;">Setup Wizard</h3>
                <p style="font-size: 14px; opacity: 0.9; margin-bottom: 16px; line-height: 1.5;">
                    Answer a few questions and we'll create a personalized system for your family
                </p>
                <div style="display: inline-block; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 13px; font-weight: 600;">
                    ⏱️ ~20 minutes
                </div>
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 13px;">
                    ✓ Personalized routines<br>
                    ✓ Age-appropriate tasks<br>
                    ✓ Custom rewards menu
                </div>
            </div>
            
            <!-- Quick Start Option -->
            <div class="setup-option"
                 onclick="createEmptyFamily()"
                 style="
                    background: rgba(255,255,255,0.15);
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 16px;
                    padding: 32px 24px;
                    cursor: pointer;
                    transition: all 0.3s;
                 "
                 onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.2)'"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
            >
                <div style="font-size: 64px; margin-bottom: 16px;">⚡</div>
                <h3 style="font-size: 20px; margin-bottom: 12px; font-weight: 600;">Quick Start</h3>
                <p style="font-size: 14px; opacity: 0.9; margin-bottom: 16px; line-height: 1.5;">
                    Start with default setup and customize as you go
                </p>
                <div style="display: inline-block; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 13px; font-weight: 600;">
                    ⏱️ ~2 minutes
                </div>
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 13px;">
                    ✓ Default routines<br>
                    ✓ Basic tasks<br>
                    ✓ Customize in Edit mode
                </div>
            </div>
        </div>
        
        <div style="padding: 16px; background: rgba(255,255,255,0.1); border-radius: 8px; font-size: 14px; margin-bottom: 24px;">
            💡 <strong>Tip:</strong> We recommend the Setup Wizard for the best experience!
        </div>
        
        <button 
            onclick="auth.signOut()"
            style="
                padding: 12px 24px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.3);
                border-radius: 8px;
                color: white;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
            "
            onmouseover="this.style.background='rgba(255,255,255,0.2)'"
            onmouseout="this.style.background='rgba(255,255,255,0.1)'"
        >
            🚪 Sign Out
        </button>
    `;
    
    // Add to overlay
    if (loginOverlay) {
        // Clear existing content
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
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>➕ Create New Family</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 24px; color: #6b7280;">Choose how to set up your new family:</p>
                
                <div style="display: grid; gap: 16px;">
                    <button 
                        onclick="this.closest('.modal').remove(); launchSetupWizard();"
                        style="
                            width: 100%;
                            padding: 20px;
                            background: linear-gradient(135deg, #93c593, #6ba86b);
                            color: white;
                            border: none;
                            border-radius: 12px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            text-align: left;
                            transition: all 0.2s;
                        "
                        onmouseover="this.style.transform='translateX(4px)'"
                        onmouseout="this.style.transform='translateX(0)'"
                    >
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="font-size: 32px;">🧙‍♂️</div>
                            <div style="flex: 1;">
                                <div style="font-size: 18px; margin-bottom: 4px;">Setup Wizard</div>
                                <div style="font-size: 13px; opacity: 0.9;">Personalized system (~20 min)</div>
                            </div>
                            <div style="font-size: 24px;">→</div>
                        </div>
                    </button>
                    
                    <button 
                        onclick="this.closest('.modal').remove(); createEmptyFamily();"
                        style="
                            width: 100%;
                            padding: 20px;
                            background: white;
                            color: #1f2937;
                            border: 2px solid #e5e7eb;
                            border-radius: 12px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            text-align: left;
                            transition: all 0.2s;
                        "
                        onmouseover="this.style.borderColor='#6366f1'; this.style.transform='translateX(4px)'"
                        onmouseout="this.style.borderColor='#e5e7eb'; this.style.transform='translateX(0)'"
                    >
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="font-size: 32px;">⚡</div>
                            <div style="flex: 1;">
                                <div style="font-size: 18px; margin-bottom: 4px;">Quick Start</div>
                                <div style="font-size: 13px; color: #6b7280;">Default setup (~2 min)</div>
                            </div>
                            <div style="font-size: 24px;">→</div>
                        </div>
                    </button>
                    
                    <button 
                        onclick="this.closest('.modal').remove(); showJoinFamilyDialog();"
                        style="
                            width: 100%;
                            padding: 20px;
                            background: white;
                            color: #1f2937;
                            border: 2px solid #e5e7eb;
                            border-radius: 12px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            text-align: left;
                            transition: all 0.2s;
                        "
                        onmouseover="this.style.borderColor='#6366f1'; this.style.transform='translateX(4px)'"
                        onmouseout="this.style.borderColor='#e5e7eb'; this.style.transform='translateX(0)'"
                    >
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="font-size: 32px;">🔗</div>
                            <div style="flex: 1;">
                                <div style="font-size: 18px; margin-bottom: 4px;">Join Existing Family</div>
                                <div style="font-size: 13px; color: #6b7280;">Enter family code</div>
                            </div>
                            <div style="font-size: 24px;">→</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

/**
 * Launch the setup wizard (opens onboarding in new tab/window)
 */
function launchSetupWizard() {
    // Change this URL to wherever you host the React wizard
    const wizardUrl = 'https://type1unbound.github.io/family-tracker/';
    
    // Open wizard in new window
    const wizardWindow = window.open(wizardUrl, '_blank', 'width=1000,height=800');
    
    if (!wizardWindow) {
        alert('Please allow popups to use the Setup Wizard, or click the button again.');
        return;
    }
    
    // Show instruction modal
    showWizardLaunchedMessage();
}

/**
 * Show message that wizard was launched
 */
function showWizardLaunchedMessage() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; text-align: center;">
            <div class="modal-body" style="padding: 40px;">
                <div style="font-size: 64px; margin-bottom: 24px;">🧙‍♂️</div>
                <h2 style="margin-bottom: 16px;">Setup Wizard Opened!</h2>
                <p style="margin-bottom: 24px; color: #6b7280; line-height: 1.6;">
                    The Setup Wizard has opened in a new tab. Complete the assessment there, then return here to import your setup.
                </p>
                <div style="padding: 16px; background: #f0f9ff; border-radius: 8px; margin-bottom: 24px; font-size: 14px; text-align: left;">
                    <strong>Steps:</strong><br>
                    1. Complete wizard in new tab<br>
                    2. Export your setup (JSON file)<br>
                    3. Return here and click "Import Setup"<br>
                    4. Upload the JSON file
                </div>
                <button 
                    onclick="this.closest('.modal').remove();"
                    style="
                        padding: 12px 32px;
                        background: #6366f1;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                    "
                >
                    Got It!
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

/**
 * Show join family dialog
 */
function showJoinFamilyDialog() {
    // Use existing join family modal from firebase integration
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
        
        // Generate family ID and code
        const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const familyId = 'family_' + Date.now();
        
        // Create family document
        await db.collection('families').doc(familyId).set({
            familyCode: familyCode,
            createdBy: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            children: ['child1', 'child2']
        });
        
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
        
        console.log('✅ Empty family created:', familyCode);
        
        // Switch to new family
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
        
        // Update user's last active family
        await db.collection('users').doc(currentUser.uid).update({
            lastActiveFamilyId: familyId,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Store in state
        currentFamilyId = familyId;
        window.StateManager.state.familyId = familyId;
        
        // Load family data
        const familyRef = db.collection('families').doc(familyId);
        const familyDoc = await familyRef.get();
        
        if (!familyDoc.exists) {
            throw new Error('Family not found');
        }
        
        const familyData = familyDoc.data();
        window.StateManager.state.children = familyData.children || ['child1', 'child2'];
        window.StateManager.state.familyCode = familyData.familyCode;
        
        console.log('  Loading', window.StateManager.state.children.length, 'family members...');
        
        // Load each family member
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
                
                // Load days data
                const daysSnapshot = await familyRef.collection('familyMembers').doc(childId)
                    .collection('days').get();
                
                daysSnapshot.forEach(doc => {
                    window.StateManager.state.data[childId].days[doc.id] = doc.data();
                });
                
                console.log('  ✓ Loaded', window.StateManager.state.data[childId].name);
            } else if (!window.StateManager.state.data[childId]) {
                // Initialize with defaults
                window.StateManager.createChild(childId);
            }
        }
        
        // Set first child as current
        if (window.StateManager.state.children.length > 0) {
            window.StateManager.state.currentChild = window.StateManager.state.children[0];
        }
        
        console.log('✅ Switched to family successfully');
        
        // Initialize dashboard
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
window.migrateOldUserData = migrateOldUserData; // Export for manual migration if needed

console.log('✅ Family Management System loaded (with migration support)');
