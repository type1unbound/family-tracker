// ========================================
// FIREBASE INTEGRATION WITH FAMILY SHARING
// ========================================

// Wait for Firebase SDK to load
if (typeof firebase === 'undefined') {
    console.error('❌ Firebase SDK not loaded!');
    alert('Error: Firebase SDK failed to load. Please check your internet connection and refresh the page.');
} else {
    console.log('✅ Firebase SDK loaded');
}

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJzB673MruQvNpX_1wuGoHUFSk6leErFg",
    authDomain: "family-tracker-37025.firebaseapp.com",
    projectId: "family-tracker-37025",
    storageBucket: "family-tracker-37025.firebasestorage.app",
    messagingSenderId: "1004309710251",
    appId: "1:1004309710251:web:933164ffa6d5f78e6c7eee"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized');
} catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    alert('Error initializing Firebase: ' + error.message);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Set auth persistence to LOCAL (survives browser restarts)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        console.log('✅ Auth persistence set to LOCAL');
    })
    .catch((error) => {
        console.error('❌ Error setting persistence:', error);
    });

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        console.log('Offline persistence error:', err.code);
    });

// ========================================
// AUTHENTICATION & USER STATE
// ========================================

let currentUser = null;
let authInitialized = false;

// Setup Google Sign-In button
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up Google Sign-In button');
    
    const signInBtn = document.getElementById('google-signin-btn');
    if (!signInBtn) {
        console.error('❌ Google Sign-In button not found in DOM!');
        return;
    }
    
    console.log('✅ Google Sign-In button found, attaching click handler');
    
    signInBtn.addEventListener('click', async () => {
        console.log('🔐 Sign-In button clicked');
        
        // Clear any stuck session flags
        sessionStorage.clear();
        
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            
            // Force account selection
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            console.log('Attempting sign in with popup...');
            
            // Use popup
            await auth.signInWithPopup(provider);
            console.log('✅ Sign-in successful');
            
        } catch (error) {
            console.error('❌ Sign in failed:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            
            // User-friendly error messages
            if (error.code === 'auth/popup-blocked') {
                alert('⚠️ Popup was blocked! Please allow popups for this site and try again.');
            } else if (error.code === 'auth/popup-closed-by-user') {
                console.log('ℹ️ User closed the popup');
            } else {
                alert('Sign in failed: ' + error.message);
            }
        }
    });
});

// ========================================
// FIREBASE DATA OPERATIONS
// ========================================

async function saveDataToFirebase() {
    if (!currentUser) {
        console.log('⏸️ No user logged in, skipping save to Firestore');
        return;
    }

    if (!firebase || !firebase.firestore) {
        console.error('❌ Firebase Firestore not available');
        return;
    }

    if (!window.StateManager || !window.StateManager.state) {
        console.error('❌ StateManager not available');
        return;
    }

    try {
        console.log('💾 Saving data to Firestore for user:', currentUser.email);
        const userId = currentUser.uid;

        if (window.StateManager.state.familyId) {
            // Save to family document
            const familyRef = db.collection('families').doc(window.StateManager.state.familyId);
            await familyRef.set({
                children: window.StateManager.state.children,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            console.log('  Saving to family:', window.StateManager.state.familyId);

            // Save each family member under the family
            for (const childId of window.StateManager.state.children) {
                const memberData = window.StateManager.state.data[childId];
                
                if (!memberData) continue;
                
                // Separate days data
                const { days, ...memberInfo } = memberData;
                
                // Save member info
                await familyRef.collection('familyMembers').doc(childId).set(memberInfo, { merge: true });
                
                // Save days data in subcollection
                for (const [date, dayData] of Object.entries(days || {})) {
                    await familyRef.collection('familyMembers').doc(childId)
                        .collection('days').doc(date).set(dayData, { merge: true });
                }
            }
        } else {
            // Legacy: save to user document (for backward compatibility)
            const userRef = db.collection('users').doc(userId);
            
            await userRef.set({
                email: currentUser.email,
                displayName: currentUser.displayName,
                children: window.StateManager.state.children,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            // Save each family member
            for (const childId of window.StateManager.state.children) {
                const memberData = window.StateManager.state.data[childId];
                
                if (!memberData) continue;
                
                // Separate days data
                const { days, ...memberInfo } = memberData;
                
                // Save member info
                await userRef.collection('familyMembers').doc(childId).set(memberInfo, { merge: true });
                
                // Save days data in subcollection
                for (const [date, dayData] of Object.entries(days || {})) {
                    await userRef.collection('familyMembers').doc(childId)
                        .collection('days').doc(date).set(dayData, { merge: true });
                }
            }
        }

        console.log('✅ Data saved to Firestore successfully');
    } catch (error) {
        console.error('❌ Error saving data to Firestore:', error);
        console.error('Error details:', error);
    }
}

window.saveData = saveDataToFirebase;

async function loadDataFromFirebase() {
    if (!currentUser) {
        console.log('⏸️ No user logged in, skipping load from Firestore');
        return;
    }

    if (!window.StateManager || !window.StateManager.state) {
        console.error('❌ StateManager not available - cannot load data');
        return;
    }

    try {
        console.log('📥 Loading data from Firestore for user:', currentUser.email);
        showLoading();
        const userId = currentUser.uid;
        const userRef = db.collection('users').doc(userId);

// Load user metadata
        const userDoc = await userRef.get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            // Check if user is part of a family
            if (userData.familyId) {
                // Load family data instead of personal data
                const familyRef = db.collection('families').doc(userData.familyId);
                const familyDoc = await familyRef.get();
                
                if (familyDoc.exists) {
                    const familyData = familyDoc.data();
                    window.StateManager.state.children = familyData.children || ['child1', 'child2'];
                    window.StateManager.state.familyId = userData.familyId;
                    
                    // Check if family has a code, if not create one (for legacy users)
                    if (!familyData.familyCode) {
                        console.log('  Legacy family detected - generating family code...');
                        const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                        await familyRef.update({
                            familyCode: familyCode,
                            codeGeneratedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        window.StateManager.state.familyCode = familyCode;
                        console.log('  ✅ Generated family code:', familyCode);
                    } else {
                        window.StateManager.state.familyCode = familyData.familyCode;
                        console.log('  Loaded family data with code:', familyData.familyCode);
                    }
                    
                    // Load each family member from family document
                    for (const childId of window.StateManager.state.children) {
                        const memberDoc = await familyRef.collection('familyMembers').doc(childId).get();
                        
                        if (memberDoc.exists) {
                            window.StateManager.state.data[childId] = memberDoc.data();
                            
                            // Ensure required fields exist
                            if (!window.StateManager.state.data[childId].trackers) {
                                window.StateManager.state.data[childId].trackers = [];
                            }
                            if (!window.StateManager.state.data[childId].days) {
                                window.StateManager.state.data[childId].days = {};
                            }
                            
                            console.log('  Loaded member:', window.StateManager.state.data[childId].name);
                            
                            // Load days data
                            const daysSnapshot = await familyRef.collection('familyMembers').doc(childId)
                                .collection('days').get();
                            
                            daysSnapshot.forEach(doc => {
                                window.StateManager.state.data[childId].days[doc.id] = doc.data();
                            });
                            console.log('  Loaded', daysSnapshot.size, 'days of data for', window.StateManager.state.data[childId].name);
                        } else if (!window.StateManager.state.data[childId]) {
                            // Initialize new member with defaults
                            console.log('  Initializing new member:', childId);
                            window.StateManager.createChild(childId);
                        }
                    }
                } else {
                    console.error('❌ Family document not found!');
                }
            } else {
                // Personal account (legacy) - migrate to family system
                console.log('  🔄 Legacy personal account detected - migrating to family system...');
                
                window.StateManager.state.children = userData.children || ['child1', 'child2'];
                
                // Generate unique 6-character family code
                const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                const familyId = 'family_' + Date.now();
                
                // Create family document
                await db.collection('families').doc(familyId).set({
                    familyCode: familyCode,
                    createdBy: currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    migratedFrom: 'legacy_account',
                    children: window.StateManager.state.children
                });
                
                // Link user to family
                await userRef.update({
                    familyId: familyId,
                    migratedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                window.StateManager.state.familyId = familyId;
                window.StateManager.state.familyCode = familyCode;
                
                console.log('  ✅ Migrated to family system with code:', familyCode);
                
                // Load each family member from user document and copy to family
                for (const childId of window.StateManager.state.children) {
                    const memberDoc = await userRef.collection('familyMembers').doc(childId).get();
                    
                    if (memberDoc.exists) {
                        window.StateManager.state.data[childId] = memberDoc.data();
                        
                        // Ensure required fields exist
                        if (!window.StateManager.state.data[childId].trackers) {
                            window.StateManager.state.data[childId].trackers = [];
                        }
                        if (!window.StateManager.state.data[childId].days) {
                            window.StateManager.state.data[childId].days = {};
                        }
                        
                        console.log('  Loaded member:', window.StateManager.state.data[childId].name);
                        
                        // Load days data
                        const daysSnapshot = await userRef.collection('familyMembers').doc(childId)
                            .collection('days').get();
                        
                        daysSnapshot.forEach(doc => {
                            window.StateManager.state.data[childId].days[doc.id] = doc.data();
                        });
                        console.log('  Loaded', daysSnapshot.size, 'days of data for', window.StateManager.state.data[childId].name);
                    } else if (!window.StateManager.state.data[childId]) {
                        // Initialize new member with defaults
                        console.log('  Initializing new member:', childId);
                        window.StateManager.createChild(childId);
                    }
                }
                
                // Save migrated data to new family structure
                await saveDataToFirebase();
                console.log('  ✅ Legacy data migrated to family structure');
            }
            
            console.log('  Found existing user data with', window.StateManager.state.children.length, 'family members');
        } else {
            // New user - create a new family
            console.log('  New user - creating new family');
            
            // Generate unique 6-character family code
            const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const familyId = 'family_' + Date.now();
            
            // Create family document
            await db.collection('families').doc(familyId).set({
                familyCode: familyCode,
                createdBy: currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                children: ['child1', 'child2']
            });
            
            // Link user to family
            await userRef.set({
                email: currentUser.email,
                displayName: currentUser.displayName,
                familyId: familyId,
                joinedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            window.StateManager.state.children = ['child1', 'child2'];
            window.StateManager.state.familyId = familyId;
            window.StateManager.state.familyCode = familyCode;
            
            console.log('  Created family with code:', familyCode);
            
            // Initialize default children
            window.StateManager.state.children.forEach(childId => {
                if (!window.StateManager.state.data[childId]) {
                    window.StateManager.createChild(childId);
                }
            });
            
            await saveDataToFirebase();
        }

        console.log('✅ Data loaded from Firestore successfully');
        return true;
    } catch (error) {
        console.error('❌ Error loading data from Firestore:', error);
        alert('Failed to load data: ' + error.message);
        hideLoading();
        return false;
    }
}

window.loadData = loadDataFromFirebase;

// ========================================
// UI HELPER FUNCTIONS
// ========================================

function showLoading() {
    console.log('🔄 Showing loading overlay');
    const loginContent = document.getElementById('login-content');
    const loadingContent = document.getElementById('loading-content');
    if (loginContent) loginContent.style.display = 'none';
    if (loadingContent) loadingContent.style.display = 'block';
}

function hideLoading() {
    console.log('✅ Hiding loading overlay');
    const loginOverlay = document.getElementById('login-overlay');
    if (loginOverlay) {
        loginOverlay.style.display = 'none';
        console.log('✅ Login overlay hidden - dashboard should be visible');
    } else {
        console.error('❌ Login overlay element not found!');
    }
}

// ========================================
// INITIALIZE DASHBOARD
// ========================================

async function initializeDashboard() {
    console.log('🚀 Initializing dashboard...');
    
    try {
        // Check if StateManager exists
        if (!window.StateManager) {
            console.error('❌ StateManager not found - cannot initialize dashboard');
            alert('Error: Application not properly loaded. Please refresh the page.');
            return false;
        }
        
        console.log('✅ StateManager found');
        
        // Load data from Firebase
        const dataLoaded = await loadDataFromFirebase();
        if (!dataLoaded) {
            console.error('❌ Failed to load data from Firebase');
            return false;
        }
        
        // Initialize date picker
        const datePicker = document.getElementById('date-picker');
        if (datePicker && window.StateManager.state) {
            datePicker.value = window.StateManager.state.currentDate;
            console.log('✅ Date picker initialized');
        }
        
        // Initialize ProfileModule
        if (window.ProfileModule) {
            console.log('✅ ProfileModule found, initializing...');
            window.ProfileModule.renderChildButtons();
            window.ProfileModule.updateChildButtons();
            window.ProfileModule.updateTrackerButtons();
        } else {
            console.warn('⚠️ ProfileModule not found');
        }
        
        // Initialize UICore
        if (window.UICore && window.StateManager.state) {
            console.log('✅ UICore found, initializing...');
            window.UICore.selectChild(window.StateManager.state.currentChild);
            window.UICore.selectDate(window.StateManager.state.currentDate);
            window.UICore.applyColorPalette();
        } else {
            console.warn('⚠️ UICore not found');
        }
        
        console.log('✅ Dashboard initialized successfully');
        hideLoading();
        return true;
        
    } catch (error) {
        console.error('❌ Error initializing dashboard:', error);
        hideLoading();
        alert('Error initializing dashboard: ' + error.message);
        return false;
    }
}

// ========================================
// AUTH STATE LISTENER
// ========================================

auth.onAuthStateChanged(async (user) => {
    console.log('🎯 onAuthStateChanged fired!');
    console.log('   - authInitialized:', authInitialized);
    console.log('   - user:', user ? user.email : 'none');
    
    if (user) {
        // Prevent duplicate initialization
        if (authInitialized) {
            console.log('ℹ️ Already initialized, skipping...');
            return;
        }
        authInitialized = true;
        
        currentUser = user;
        console.log('✅ User signed in:', user.email);
        console.log('👤 User details:', {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified
        });
        
        // Wait a bit for other modules to load
        console.log('⏳ Waiting for modules to load...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check what modules are available
        console.log('📦 Available modules:', {
            StateManager: !!window.StateManager,
            ProfileModule: !!window.ProfileModule,
            UICore: !!window.UICore
        });
        
        // Initialize the dashboard
        console.log('🚀 Starting dashboard initialization...');
        const success = await initializeDashboard();
        
        if (success) {
            // Add sign out button
            addSignOutButton();
            // Add family code button
            addFamilyCodeButton();
            console.log('✅ Login complete - user should see dashboard now');
        } else {
            console.error('❌ Dashboard initialization failed');
        }
        
    } else {
        authInitialized = false;
        currentUser = null;
        console.log('👋 User signed out (or not yet signed in)');
        
        // Show login overlay
        const loginOverlay = document.getElementById('login-overlay');
        const loginContent = document.getElementById('login-content');
        const loadingContent = document.getElementById('loading-content');
        
        console.log('🎨 Showing login overlay');
        
        if (loginOverlay) loginOverlay.style.display = 'flex';
        if (loginContent) loginContent.style.display = 'block';
        if (loadingContent) loadingContent.style.display = 'none';
    }
});

// ========================================
// SIGN OUT BUTTON
// ========================================

function addSignOutButton() {
    const existingBtn = document.getElementById('signout-btn');
    if (existingBtn) return;

    const header = document.querySelector('h1');
    if (!header) return;
    
    const signOutBtn = document.createElement('button');
    signOutBtn.id = 'signout-btn';
    signOutBtn.innerHTML = '🚪 Sign Out';
    signOutBtn.style.cssText = `
        float: right;
        padding: 8px 16px;
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.4);
        border-radius: 8px;
        color: white;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
    `;
    signOutBtn.onmouseover = () => signOutBtn.style.background = 'rgba(255,255,255,0.3)';
    signOutBtn.onmouseout = () => signOutBtn.style.background = 'rgba(255,255,255,0.2)';
    signOutBtn.onclick = () => {
        if (confirm('Are you sure you want to sign out?')) {
            auth.signOut();
        }
    };
    header.parentElement.insertBefore(signOutBtn, header);
}

// ========================================
// FAMILY CODE BUTTON & MODAL
// ========================================

function addFamilyCodeButton() {
    const existingBtn = document.getElementById('family-code-btn');
    if (existingBtn) return;

    const header = document.querySelector('h1');
    if (!header) return;
    
    const familyCodeBtn = document.createElement('button');
    familyCodeBtn.id = 'family-code-btn';
    familyCodeBtn.innerHTML = '👨‍👩‍👧‍👦 Family Code';
    familyCodeBtn.style.cssText = `
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
    familyCodeBtn.onmouseover = () => familyCodeBtn.style.background = 'rgba(255,255,255,0.3)';
    familyCodeBtn.onmouseout = () => familyCodeBtn.style.background = 'rgba(255,255,255,0.2)';
    familyCodeBtn.onclick = () => showFamilyCodeModal();
    
    header.parentElement.insertBefore(familyCodeBtn, header);
}

function showFamilyCodeModal() {
    const familyCode = window.StateManager.state.familyCode || 'No code';
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h2>👨‍👩‍👧‍👦 Family Sharing</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 16px;">Share this code with family members so they can join:</p>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #6366f1;">${familyCode}</div>
                </div>
                
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
                
                <p style="margin-bottom: 12px; font-weight: 600;">Or enter a code to join another family:</p>
                <p style="margin-bottom: 12px; font-size: 13px; color: #ef4444;">⚠️ Warning: Joining another family will replace your current family data!</p>
                <input type="text" id="join-family-code" placeholder="Enter 6-character code" maxlength="6" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin-bottom: 12px;">
                <button onclick="joinFamily()" class="btn btn-primary" style="width: 100%;">Join Family</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function joinFamily() {
    const code = document.getElementById('join-family-code').value.toUpperCase().trim();
    
    if (!code || code.length !== 6) {
        alert('Please enter a valid 6-character code');
        return;
    }
    
    if (!confirm('⚠️ Are you sure you want to join another family? Your current family data will be replaced with the new family\'s data.')) {
        return;
    }
    
    try {
        // Find family with this code
        const familiesSnapshot = await db.collection('families')
            .where('familyCode', '==', code)
            .limit(1)
            .get();
        
        if (familiesSnapshot.empty) {
            alert('❌ Family code not found. Please check the code and try again.');
            return;
        }
        
        const familyDoc = familiesSnapshot.docs[0];
        const familyId = familyDoc.id;
        
        // Update user to join this family
        const userRef = db.collection('users').doc(currentUser.uid);
        await userRef.update({
            familyId: familyId,
            joinedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert('✅ Successfully joined family! Refreshing...');
        window.location.reload();
        
    } catch (error) {
        console.error('Error joining family:', error);
        alert('Failed to join family: ' + error.message);
    }
}

// Make joinFamily available globally
window.joinFamily = joinFamily;

// ========================================
// AUTO-SAVE & CLEANUP
// ========================================

// Auto-save data periodically (every 30 seconds)
setInterval(() => {
    if (currentUser) {
        saveDataToFirebase();
    }
}, 30000);

// Save data before page unload
window.addEventListener('beforeunload', () => {
    if (currentUser) {
        saveDataToFirebase();
    }
});
