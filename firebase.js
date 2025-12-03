// ========================================
// FIREBASE INTEGRATION - MULTI-FAMILY SUPPORT
// Updated to work with family-management.js
// Fixed: Waits for FamilyManagement module
// ========================================

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
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Auth state tracking
let currentUser = null;
let authInitialized = false;

console.log('🔥 Firebase initialized');

// ========================================
// GOOGLE SIGN-IN
// ========================================

document.getElementById('google-signin-btn')?.addEventListener('click', async () => {
    try {
        console.log('🔐 Starting Google sign-in...');
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        console.log('✅ Google sign-in successful');
    } catch (error) {
        console.error('❌ Sign-in error:', error);
        alert('Sign-in failed: ' + error.message);
    }
});

// ========================================
// AUTH STATE LISTENER (MODIFIED FOR MULTI-FAMILY)
// ========================================

auth.onAuthStateChanged(async (user) => {
    console.log('🎯 Auth state changed');
    console.log('   - User:', user ? user.email : 'none');
    console.log('   - Already initialized:', authInitialized);
    
    if (user) {
        // Prevent duplicate initialization
        if (authInitialized) {
            console.log('ℹ️ Already initialized, skipping...');
            return;
        }
        authInitialized = true;
        
        currentUser = user;
        console.log('✅ User signed in:', user.email);
        
        // Show loading
        showLoading();
        
        // CRITICAL FIX: Wait for FamilyManagement module to be available
        console.log('⏳ Waiting for FamilyManagement module...');
        let retries = 0;
        while (!window.FamilyManagement && retries < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }
        
        if (!window.FamilyManagement) {
            console.error('❌ FamilyManagement not available after waiting');
            alert('App modules not loaded. Please refresh the page.');
            hideLoading();
            return;
        }
        
        console.log('✅ FamilyManagement module loaded');
        
        // Load user's families
        try {
            // Try FamilyManagement.loadUserFamilies (new way)
            if (window.FamilyManagement && typeof window.FamilyManagement.loadUserFamilies === 'function') {
                console.log('🚀 Loading user families (via FamilyManagement)...');
                await FamilyManagement.loadUserFamilies(user.uid);
            }
            // Fallback to global loadUserFamilies function (old way)
            else if (typeof window.loadUserFamilies === 'function') {
                console.log('🚀 Loading user families (via global function)...');
                await loadUserFamilies();
            }
            else {
                console.error('❌ No loadUserFamilies function found!');
                alert('Error: Family management system not loaded. Please refresh the page.');
                hideLoading();
            }
        } catch (error) {
            console.error('❌ Error loading families:', error);
            alert('Error loading your data. Please refresh the page.');
            hideLoading();
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
        
        // Clear any family selection screens
        const familySelection = document.getElementById('family-selection-screen');
        const familySetup = document.getElementById('family-setup-screen');
        if (familySelection) familySelection.remove();
        if (familySetup) familySetup.remove();
    }
});

// ========================================
// INITIALIZE DASHBOARD (MODIFIED FOR MULTI-FAMILY)
// Called by switchToFamily() in family-management.js
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
        console.log('   Current family:', window.StateManager.state.familyId);
        console.log('   Current child:', window.StateManager.state.currentChild);
        console.log('   Children count:', window.StateManager.state.children.length);
        
        // Data already loaded by switchToFamily, just initialize UI
        
        // Initialize date picker
        const datePicker = document.getElementById('date-picker');
        if (datePicker && window.StateManager.state) {
            datePicker.value = window.StateManager.state.currentDate;
            console.log('✅ Date picker initialized');
        }
        
        // Initialize sidebar avatars
        if (window.renderSidebarAvatars) {
            console.log('✅ Rendering sidebar avatars...');
            window.renderSidebarAvatars();
        }
        
        // Initialize sidebar trackers
        if (window.renderSidebarTrackers) {
            console.log('✅ Rendering sidebar trackers...');
            window.renderSidebarTrackers();
        }
        
        // Initialize UICore
        if (window.UICore && window.StateManager.state) {
            console.log('✅ UICore found, initializing...');
            window.UICore.selectChild(window.StateManager.state.currentChild);
            window.UICore.selectDate(window.StateManager.state.currentDate);
            window.UICore.applyColorPalette();
        }
        
        console.log('✅ Dashboard initialized successfully');
        
        // Add header buttons
        addSignOutButton();
        addFamilyCodeButton();
        
        // Add family switcher if multiple families exist
        if (window.addFamilySwitcher) {
            addFamilySwitcher();
        }
        
        // Show switch family button in sidebar if user has multiple families
        updateSwitchFamilyButton();
        
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
// SAVE DATA TO FIREBASE
// ========================================

async function saveData() {
    if (!currentUser) {
        console.warn('No user logged in, cannot save');
        return;
    }

    const familyId = window.StateManager?.state?.familyId;
    if (!familyId) {
        console.warn('No family selected, cannot save');
        return;
    }

    try {
        console.log('💾 Saving data to Firebase...');
        
        const familyRef = db.collection('families').doc(familyId);
        
        // Update family document
        await familyRef.set({
            familyCode: window.StateManager.state.familyCode,
            children: window.StateManager.state.children,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        // Save each family member
        for (const childId of window.StateManager.state.children) {
            const childData = window.StateManager.state.data[childId];
            if (!childData) continue;
            
            // Separate days data from main data
            const { days, ...memberData } = childData;
            
            // Save member document
            await familyRef.collection('familyMembers').doc(childId).set(memberData, { merge: true });
            
            // Save days data in subcollection
            if (days) {
                for (const [date, dayData] of Object.entries(days)) {
                    await familyRef.collection('familyMembers').doc(childId)
                        .collection('days').doc(date)
                        .set(dayData, { merge: true });
                }
            }
        }
        
        console.log('✅ Data saved successfully');
        
    } catch (error) {
        console.error('❌ Error saving data:', error);
        alert('Error saving data: ' + error.message);
    }
}

// Override global saveData
window.saveData = saveData;

// ========================================
// LOADING INDICATORS
// ========================================

function showLoading() {
    const loginOverlay = document.getElementById('login-overlay');
    const loginContent = document.getElementById('login-content');
    const loadingContent = document.getElementById('loading-content');
    
    if (loginOverlay) loginOverlay.style.display = 'flex';
    if (loginContent) loginContent.style.display = 'none';
    if (loadingContent) loadingContent.style.display = 'block';
}

function hideLoading() {
    const loginOverlay = document.getElementById('login-overlay');
    const loginContent = document.getElementById('login-content');
    const loadingContent = document.getElementById('loading-content');
    
    if (loginOverlay) loginOverlay.style.display = 'none';
    if (loginContent) loginContent.style.display = 'block';
    if (loadingContent) loadingContent.style.display = 'none';
}

// ========================================
// HEADER BUTTONS
// ========================================

function addSignOutButton() {
    const utilityRight = document.querySelector('.utility-right');
    if (!utilityRight || document.getElementById('signout-btn')) return;
    
    const signOutBtn = document.createElement('button');
    signOutBtn.id = 'signout-btn';
    signOutBtn.innerHTML = '🚪 Sign Out';
    signOutBtn.style.cssText = `
        margin-right: 8px;
        padding: 8px 16px;
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.4);
        border-radius: 8px;
        color: #1a202c;
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
    
    utilityRight.insertBefore(signOutBtn, utilityRight.firstChild);
}

function addFamilyCodeButton() {
    const utilityRight = document.querySelector('.utility-right');
    if (!utilityRight || document.getElementById('family-code-btn')) return;
    
    const familyCode = window.StateManager?.state?.familyCode;
    if (!familyCode) return;
    
    const codeBtn = document.createElement('button');
    codeBtn.id = 'family-code-btn';
    codeBtn.innerHTML = `👨‍👩‍👧‍👦 Code: ${familyCode}`;
    codeBtn.style.cssText = `
        margin-right: 8px;
        padding: 8px 16px;
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.4);
        border-radius: 8px;
        color: #1a202c;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
    `;
    codeBtn.onmouseover = () => codeBtn.style.background = 'rgba(255,255,255,0.3)';
    codeBtn.onmouseout = () => codeBtn.style.background = 'rgba(255,255,255,0.2)';
    codeBtn.onclick = () => showFamilyCodeModal();
    
    utilityRight.insertBefore(codeBtn, utilityRight.firstChild);
}

function updateSwitchFamilyButton() {
    const switchBtn = document.getElementById('switch-family-btn');
    if (!switchBtn) return;
    
    // Show button only if user has multiple families
    if (window.userFamilies && window.userFamilies.length > 1) {
        switchBtn.style.display = 'flex';
    } else {
        switchBtn.style.display = 'none';
    }
}

// ========================================
// FAMILY CODE MODAL
// ========================================

function showFamilyCodeModal() {
    const familyCode = window.StateManager?.state?.familyCode;
    if (!familyCode) return;
    
    const existingModal = document.getElementById('family-code-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'family-code-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 16px; padding: 32px; max-width: 400px; width: 90%; text-align: center;">
            <h2 style="margin-bottom: 16px; color: #1a202c;">👨‍👩‍👧‍👦 Family Code</h2>
            <p style="color: #6b7280; margin-bottom: 24px;">Share this code with family members so they can join and collaborate!</p>
            
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #6366f1;">${familyCode}</div>
            </div>
            
            <button 
                onclick="navigator.clipboard.writeText('${familyCode}'); this.textContent='✅ Copied!'; setTimeout(() => this.textContent='📋 Copy Code', 2000)"
                style="
                    width: 100%;
                    padding: 12px 24px;
                    background: #6366f1;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-bottom: 12px;
                    transition: background 0.2s;
                "
                onmouseover="this.style.background='#4f46e5'"
                onmouseout="this.style.background='#6366f1'"
            >
                📋 Copy Code
            </button>
            
            <button 
                onclick="this.closest('#family-code-modal').remove()"
                style="
                    width: 100%;
                    padding: 12px 24px;
                    background: #e5e7eb;
                    color: #1a202c;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                "
                onmouseover="this.style.background='#d1d5db'"
                onmouseout="this.style.background='#e5e7eb'"
            >
                Close
            </button>
        </div>
    `;
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}

// ========================================
// EXPORT FUNCTIONS
// ========================================

window.initializeDashboard = initializeDashboard;
window.saveData = saveData;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.addSignOutButton = addSignOutButton;
window.addFamilyCodeButton = addFamilyCodeButton;
window.showFamilyCodeModal = showFamilyCodeModal;
window.updateSwitchFamilyButton = updateSwitchFamilyButton;

// Make Firebase services globally available
window.auth = auth;
window.db = db;
window.storage = storage;
window.currentUser = currentUser;

console.log('✅ Firebase integration loaded (Multi-Family Support with FamilyManagement wait)');
