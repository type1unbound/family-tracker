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
            console.log('Opening Google sign-in popup...');
            await auth.signInWithPopup(provider);
            console.log('✅ Sign-in successful');
        } catch (error) {
            console.error('❌ Sign in failed:', error);
            alert('Sign in failed: ' + error.message);
        }
    });
});

// ========================================
// FIREBASE DATA OPERATIONS
// ========================================

// Override saveData to use Firestore
const originalSaveData = saveData;
saveData = async function() {
    if (!currentUser) {
        console.log('⏸️ No user logged in, skipping save to Firestore');
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
            children: state.children,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Save each family member
        for (const childId of state.children) {
            const memberData = state.data[childId];
            
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
};

// Override loadData to use Firestore
const originalLoadData = loadData;
loadData = async function() {
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
            state.children = userData.children || ['child1', 'child2'];
            console.log('  Found existing user data with', state.children.length, 'family members');
        } else {
            // New user - initialize with defaults
            console.log('  New user - initializing with default data');
            state.children = ['child1', 'child2'];
            await saveData();
        }

        // Load each family member
        for (const childId of state.children) {
            const memberDoc = await userRef.collection('familyMembers').doc(childId).get();
            
            if (memberDoc.exists) {
                state.data[childId] = memberDoc.data();
                
                // Ensure medTrackerEnabled field exists (for backwards compatibility)
                if (state.data[childId].medTrackerEnabled === undefined) {
                    state.data[childId].medTrackerEnabled = false;
                }
                
                console.log('  Loaded member:', state.data[childId].name);
                
                // Load days data
                const daysSnapshot = await userRef.collection('familyMembers').doc(childId)
                    .collection('days').get();
                
                state.data[childId].days = {};
                daysSnapshot.forEach(doc => {
                    state.data[childId].days[doc.id] = doc.data();
                });
                console.log('  Loaded', daysSnapshot.size, 'days of data for', state.data[childId].name);
            } else if (!state.data[childId]) {
                // Initialize new member with defaults
                console.log('  Initializing new member:', childId);
                state.data[childId] = {
                    name: 'Family Member ' + (state.children.indexOf(childId) + 1),
                    photo: null,
                    colorPalette: 'lavender',
                    pointsBalance: 0,
                    pointsSpent: 0,
                    medTrackerEnabled: false,
                    days: {},
                    schedule: JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)),
                    characterValues: JSON.parse(JSON.stringify(DEFAULT_CHARACTER_VALUES)),
                    weeklyChores: JSON.parse(JSON.stringify(DEFAULT_WEEKLY_CHORES))
                };
            }
        }

        console.log('✅ Data loaded from Firestore successfully');
        hideLoading();
    } catch (error) {
        console.error('❌ Error loading data from Firestore:', error);
        hideLoading();
        alert('Failed to load data: ' + error.message);
    }
};

// Override photo upload to use Firebase Storage
const originalHandlePhotoUpload = handlePhotoUpload;
handlePhotoUpload = async function(event) {
    const file = event.target.files[0];
    if (!file || !currentUser) return;

    try {
        // Show loading state
        document.getElementById('upload-area').innerHTML = '<div style="padding: 40px; text-align: center;">Uploading...</div>';

        // Upload to Firebase Storage
        const userId = currentUser.uid;
        const timestamp = Date.now();
        const storageRef = storage.ref(`users/${userId}/photos/${timestamp}_${file.name}`);
        
        await storageRef.put(file);
        const downloadURL = await storageRef.getDownloadURL();

        // Now handle the photo URL
        state.tempPhoto = downloadURL;
        
        // Show preview
        const photoContainer = document.getElementById('photo-preview-container');
        photoContainer.innerHTML = `<img src="${downloadURL}" class="photo-preview">`;
        document.getElementById('remove-photo-btn').style.display = 'inline-block';
        document.getElementById('upload-area').style.display = 'none';

    } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Failed to upload photo: ' + error.message);
        document.getElementById('upload-area').innerHTML = `
            <div style="font-size: 48px; margin-bottom: 8px;">📷</div>
            <div style="color: #6b7280; font-size: 14px;">Click to upload photo</div>
        `;
    }
};

// ========================================
// UI HELPER FUNCTIONS
// ========================================

function showLoading() {
    document.getElementById('login-content').style.display = 'none';
    document.getElementById('loading-content').style.display = 'block';
}

function hideLoading() {
    document.getElementById('login-overlay').style.display = 'none';
}

// ========================================
// AUTH STATE LISTENER
// ========================================

auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        console.log('User signed in:', user.email);
        
        // Load user's data from Firestore
        await loadData();
        
        // Initialize UI
        document.getElementById('date-picker').value = state.currentDate;
        renderChildButtons();
        selectChild(state.currentChild);
        selectDate(state.currentDate);
        updateChildButtons();
        updateTrackerButtons();
        applyColorPalette();
        
        // Hide login overlay
        hideLoading();
        
        // Add sign out button
        addSignOutButton();
    } else {
        currentUser = null;
        console.log('User signed out');
        
        // Show login overlay
        document.getElementById('login-overlay').style.display = 'flex';
        document.getElementById('login-content').style.display = 'block';
        document.getElementById('loading-content').style.display = 'none';
    }
});

// ========================================
// SIGN OUT BUTTON
// ========================================

function addSignOutButton() {
    const existingBtn = document.getElementById('signout-btn');
    if (existingBtn) return;

    const header = document.querySelector('h1');
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
        saveData();
    }
}, 30000);

// Save data before page unload
window.addEventListener('beforeunload', () => {
    if (currentUser) {
        saveData();
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
        saveData,
        loadData,
        handlePhotoUpload,
        showLoading,
        hideLoading,
        addSignOutButton
    };
}
