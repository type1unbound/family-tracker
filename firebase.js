// ========================================
// FIREBASE INTEGRATION
// ========================================
// This module handles all Firebase operations including:
// - Authentication (Google Sign-In)
// - Firestore database operations
// - Firebase Storage for photos
// - Real-time data sync

// ========================================
// FIREBASE CONFIGURATION
// ========================================

// Wait for Firebase SDK to load
if (typeof firebase === 'undefined') {
    console.error('❌ Firebase SDK not loaded!');
    alert('Error: Firebase SDK failed to load. Please check your internet connection and refresh the page.');
} else {
    console.log('✅ Firebase SDK loaded');
}

// Firebase configuration for Type1Unbound Family Tracker
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

// IMPORTANT: Disable localStorage - we use Firebase only
const FIREBASE_MODE = true;

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        console.log('Offline persistence error:', err.code);
    });

// ========================================
// AUTHENTICATION & USER STATE
// ========================================

let currentUser = null;
let isLoading = false;

// Login overlay already exists in HTML (no need to create it)
// Just set up the Google Sign-In button handler
// Wait for DOM to be ready before attaching event listener
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
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            console.log('Redirecting to Google sign-in...');
            await auth.signInWithRedirect(provider);
        } catch (error) {
            console.error('❌ Sign in failed:', error);
            alert('Sign in failed: ' + error.message);
        }
    });

    // Handle redirect result when user returns
    auth.getRedirectResult()
        .then((result) => {
            if (result.user) {
                console.log('✅ Sign-in successful via redirect:', result.user.email);
            }
        })
        .catch((error) => {
            console.error('❌ Redirect sign-in error:', error);
            alert('Sign in failed: ' + error.message);
        });
});

// ========================================
// FIREBASE DATA OPERATIONS
// ========================================

// Create a new saveData function for Firebase
async function saveDataToFirebase() {
    if (!currentUser) {
        console.log('⏸️ No user logged in, skipping save to Firestore');
        return;
    }

    // Check if Firestore is available
    if (!firebase || !firebase.firestore) {
        console.error('❌ Firebase Firestore not available');
        return;
    }

    try {
        console.log('💾 Saving data to Firestore for user:', currentUser.email);
        const userId = currentUser.uid;
        const userRef = db.collection('users').doc(userId);

        // Save user metadata
        await userRef.set({
            email: currentUser.email,
            displayName: currentUser.displayName,
            children: StateManager.state.children,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Save each family member
        for (const childId of StateManager.state.children) {
            const memberData = StateManager.state.data[childId];
            
            // Separate days data (it can get large)
            const { days, ...memberInfo } = memberData;
            
            // Save member info
            await userRef.collection('familyMembers').doc(childId).set(memberInfo, { merge: true });
            
            // Save days data in subcollection (only recent days to avoid size limits)
            for (const [date, dayData] of Object.entries(days || {})) {
                await userRef.collection('familyMembers').doc(childId)
                    .collection('days').doc(date).set(dayData, { merge: true });
            }
        }

        console.log('✅ Data saved to Firestore successfully');
    } catch (error) {
        console.error('❌ Error saving data to Firestore:', error);
        alert('Failed to save data: ' + error.message);
    }
}

// Make saveDataToFirebase available globally as saveData
window.saveData = saveDataToFirebase;

// Create a new loadData function for Firebase
async function loadDataFromFirebase() {
    if (!currentUser) {
        console.log('⏸️ No user logged in, skipping load from Firestore');
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
            StateManager.state.children = userData.children || ['child1', 'child2'];
            console.log('  Found existing user data with', StateManager.state.children.length, 'family members');
        } else {
            // New user - initialize with defaults
            console.log('  New user - initializing with default data');
            StateManager.state.children = ['child1', 'child2'];
            
            // Initialize default children
            StateManager.state.children.forEach(childId => {
                if (!StateManager.state.data[childId]) {
                    StateManager.createChild(childId);
                }
            });
            
            await saveDataToFirebase();
        }

        // Load each family member
        for (const childId of StateManager.state.children) {
            const memberDoc = await userRef.collection('familyMembers').doc(childId).get();
            
            if (memberDoc.exists) {
                StateManager.state.data[childId] = memberDoc.data();
                
                // Ensure trackers array exists
                if (!StateManager.state.data[childId].trackers) {
                    StateManager.state.data[childId].trackers = [];
                }
                
                console.log('  Loaded member:', StateManager.state.data[childId].name);
                
                // Load days data
                const daysSnapshot = await userRef.collection('familyMembers').doc(childId)
                    .collection('days').get();
                
                StateManager.state.data[childId].days = {};
                daysSnapshot.forEach(doc => {
                    StateManager.state.data[childId].days[doc.id] = doc.data();
                });
                console.log('  Loaded', daysSnapshot.size, 'days of data for', StateManager.state.data[childId].name);
            } else if (!StateManager.state.data[childId]) {
                // Initialize new member with defaults
                console.log('  Initializing new member:', childId);
                StateManager.createChild(childId);
            }
        }

        console.log('✅ Data loaded from Firestore successfully');
        hideLoading();
    } catch (error) {
        console.error('❌ Error loading data from Firestore:', error);
        hideLoading();
        alert('Failed to load data: ' + error.message);
    }
}

// Make loadDataFromFirebase available globally as loadData
window.loadData = loadDataFromFirebase;

// Override photo upload to use Firebase Storage
// We'll set this up after the page loads to ensure the original function exists
window.addEventListener('DOMContentLoaded', function() {
    window.handlePhotoUpload = async function(event) {
        const file = event.target.files[0];
        if (!file || !currentUser) return;

        try {
            // Show loading state
            const uploadArea = document.getElementById('upload-area');
            if (uploadArea) {
                uploadArea.innerHTML = '<div style="padding: 40px; text-align: center;">Uploading...</div>';
            }

            // Upload to Firebase Storage
            const userId = currentUser.uid;
            const timestamp = Date.now();
            const storageRef = storage.ref(`users/${userId}/photos/${timestamp}_${file.name}`);
            
            await storageRef.put(file);
            const downloadURL = await storageRef.getDownloadURL();

            // Now handle the photo URL
            StateManager.state.tempPhoto = downloadURL;
            
            // Show preview
            const photoContainer = document.getElementById('photo-preview-container');
            if (photoContainer) {
                photoContainer.innerHTML = `<img src="${downloadURL}" class="photo-preview">`;
            }
            
            const removeBtn = document.getElementById('remove-photo-btn');
            if (removeBtn) {
                removeBtn.style.display = 'inline-block';
            }
            
            if (uploadArea) {
                uploadArea.style.display = 'none';
            }

        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Failed to upload photo: ' + error.message);
            const uploadArea = document.getElementById('upload-area');
            if (uploadArea) {
                uploadArea.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 8px;">📷</div>
                    <div style="color: #6b7280; font-size: 14px;">Click to upload photo</div>
                `;
            }
        }
    };
});

// ========================================
// UI HELPER FUNCTIONS
// ========================================

function showLoading() {
    const loginContent = document.getElementById('login-content');
    const loadingContent = document.getElementById('loading-content');
    if (loginContent) loginContent.style.display = 'none';
    if (loadingContent) loadingContent.style.display = 'block';
}

function hideLoading() {
    const loginOverlay = document.getElementById('login-overlay');
    if (loginOverlay) loginOverlay.style.display = 'none';
}

// ========================================
// AUTH STATE LISTENER
// ========================================

auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        console.log('User signed in:', user.email);
        
        // Load user's data from Firestore
        await loadDataFromFirebase();
        
        // Initialize UI - use proper module references
        const datePicker = document.getElementById('date-picker');
        if (datePicker) {
            datePicker.value = StateManager.state.currentDate;
        }
        
        // Use ProfileModule if available
        if (window.ProfileModule) {
            ProfileModule.renderChildButtons();
            ProfileModule.updateChildButtons();
            ProfileModule.updateTrackerButtons();
        }
        
        // Use UICore if available
        if (window.UICore) {
            UICore.selectChild(StateManager.state.currentChild);
            UICore.selectDate(StateManager.state.currentDate);
            UICore.applyColorPalette();
        }
        
        // Hide login overlay
        hideLoading();
        
        // Add sign out button
        addSignOutButton();
    } else {
        currentUser = null;
        console.log('User signed out');
        
        // Show login overlay
        const loginOverlay = document.getElementById('login-overlay');
        const loginContent = document.getElementById('login-content');
        const loadingContent = document.getElementById('loading-content');
        
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

// ========================================
// EXPORTS
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        auth,
        db,
        storage,
        currentUser,
        saveData: saveDataToFirebase,
        loadData: loadDataFromFirebase,
        handlePhotoUpload,
        showLoading,
        hideLoading,
        addSignOutButton
    };
}
