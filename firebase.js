// ========================================
// FIREBASE INTEGRATION
// Multi-Family Support + StateManager Integration
// Fixed: Added FamilyManagement availability check
// ========================================

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDGILJioJHY8ReJbeSKC5xaF8HrnVgwa0g",
    authDomain: "family-tracker-f288f.firebaseapp.com",
    projectId: "family-tracker-f288f",
    storageBucket: "family-tracker-f288f.firebasestorage.app",
    messagingSenderId: "198131846546",
    appId: "1:198131846546:web:9c5c1e4ebf29fc8cf1d6fd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Global variables
let currentUser = null;
let unsubscribeSnapshot = null;

// Show/Hide Loading
function showLoading() {
    const loginContent = document.getElementById('login-content');
    const loadingContent = document.getElementById('loading-content');
    
    if (loginContent) loginContent.classList.remove('active');
    if (loadingContent) loadingContent.classList.add('active');
}

function hideLoading() {
    const loginOverlay = document.getElementById('login-overlay');
    const loadingContent = document.getElementById('loading-content');
    
    if (loadingContent) loadingContent.classList.remove('active');
    if (loginOverlay) loginOverlay.style.display = 'none';
}

// Initialize Google Sign-In
function initializeAuth() {
    const signInBtn = document.getElementById('google-signin-btn');
    
    if (signInBtn) {
        signInBtn.addEventListener('click', async () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                showLoading();
                await firebase.auth().signInWithPopup(provider);
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed: ' + error.message);
                hideLoading();
            }
        });
    }

    // Auth state listener
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            console.log('✅ User logged in:', user.email);
            currentUser = user;
            
            // CRITICAL FIX: Wait for FamilyManagement to be available
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
                await FamilyManagement.loadUserFamilies(user.uid);
            } catch (error) {
                console.error('❌ Error loading families:', error);
                alert('Error loading your data. Please refresh the page.');
                hideLoading();
            }
        } else {
            console.log('❌ User logged out');
            currentUser = null;
            
            // Show login screen
            const loginOverlay = document.getElementById('login-overlay');
            if (loginOverlay) {
                loginOverlay.style.display = 'flex';
            }
            
            // Clear state
            if (window.StateManager) {
                StateManager.state.familyId = null;
                StateManager.state.familyCode = null;
                StateManager.state.currentChild = null;
                StateManager.state.children = [];
                StateManager.state.data = {};
            }
            
            // Unsubscribe from snapshots
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
                unsubscribeSnapshot = null;
            }
        }
    });
}

// Save data to Firestore
async function saveData() {
    if (!currentUser) {
        console.warn('⚠️ No user logged in, cannot save');
        return;
    }
    
    if (!StateManager.state.familyId) {
        console.warn('⚠️ No family selected, cannot save');
        return;
    }
    
    try {
        console.log('💾 Saving data to Firebase...');
        
        const familyId = StateManager.state.familyId;
        
        // Save each child's data
        for (const childId of StateManager.state.children) {
            const childData = StateManager.state.data[childId];
            
            await db.collection('families').doc(familyId)
                .collection('familyMembers').doc(childId)
                .set(childData);
            
            console.log(`  ✓ Saved ${childData.name}`);
        }
        
        // Update family document with children list
        await db.collection('families').doc(familyId).update({
            children: StateManager.state.children,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ Data saved successfully');
        
    } catch (error) {
        console.error('❌ Error saving data:', error);
        alert('Error saving data: ' + error.message);
    }
}

// Load data from Firestore (called by FamilyManagement.switchToFamily)
async function loadData() {
    // This is now handled by FamilyManagement.switchToFamily
    console.log('💡 loadData() called - handled by FamilyManagement.switchToFamily');
}

// Set up real-time listener for current family
function setupRealtimeListener(familyId) {
    // Unsubscribe from previous listener if it exists
    if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
    }
    
    console.log('👂 Setting up real-time listener for family:', familyId);
    
    // Listen to family document changes
    unsubscribeSnapshot = db.collection('families').doc(familyId)
        .onSnapshot((doc) => {
            if (doc.exists) {
                console.log('🔄 Family document updated');
                const familyData = doc.data();
                
                // Update children list if changed
                if (JSON.stringify(familyData.children) !== JSON.stringify(StateManager.state.children)) {
                    console.log('📋 Children list changed, reloading...');
                    FamilyManagement.switchToFamily(familyId);
                }
            }
        }, (error) => {
            console.error('❌ Listener error:', error);
        });
    
    console.log('✅ Real-time listener active');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to log out?')) {
        firebase.auth().signOut();
    }
}

// Override the placeholder functions from app.js
window.saveData = saveData;
window.loadData = loadData;
window.logout = logout;
window.currentUser = currentUser;
window.db = db;
window.storage = storage;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}

console.log('✅ Firebase Integration loaded (with FamilyManagement wait)');
