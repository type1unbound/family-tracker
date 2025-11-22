// ========================================
// AUTHENTICATION HANDLERS
// ========================================

let authInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    setupGoogleSignIn();
    setupJoinFamily();
});

function setupGoogleSignIn() {
    const signInBtn = document.getElementById('google-signin-btn');
    if (!signInBtn) return;
    
    signInBtn.addEventListener('click', async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            document.getElementById('login-content').style.display = 'none';
            document.getElementById('loading-content').style.display = 'block';
            
            await auth.signInWithPopup(provider);
        } catch (error) {
            console.error('Sign in failed:', error);
            document.getElementById('login-content').style.display = 'block';
            document.getElementById('loading-content').style.display = 'none';
            
            if (error.code === 'auth/popup-blocked') {
                alert('⚠️ Popup was blocked! Please allow popups for this site and try again.');
            } else if (error.code !== 'auth/popup-closed-by-user') {
                alert('Sign in failed: ' + error.message);
            }
        }
    });
}

function setupJoinFamily() {
    const joinFamilyBtn = document.getElementById('join-family-btn');
    if (!joinFamilyBtn) return;
    
    joinFamilyBtn.addEventListener('click', async () => {
        if (!window.currentUser) {
            alert('Please sign in first!');
            return;
        }
        
        const familyCode = document.getElementById('family-code-input').value.trim().toUpperCase();
        if (!familyCode) {
            alert('Please enter a family code');
            return;
        }
        
        try {
            joinFamilyBtn.disabled = true;
            joinFamilyBtn.textContent = 'Joining...';
            
            const familiesSnapshot = await db.collection('families')
                .where('familyCode', '==', familyCode)
                .limit(1)
                .get();
            
            if (familiesSnapshot.empty) {
                alert('Family code not found. Please check and try again.');
                joinFamilyBtn.disabled = false;
                joinFamilyBtn.textContent = 'Join Family';
                return;
            }
            
            const familyDoc = familiesSnapshot.docs[0];
            const familyId = familyDoc.id;
            
            await db.collection('users').doc(window.currentUser.uid).set({
                familyId: familyId,
                joinedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            document.getElementById('loading-content').style.display = 'block';
            document.getElementById('login-content').style.display = 'none';
            
            await loadDataFromFirebase();
            updateUI();
            
            document.getElementById('login-overlay').style.display = 'none';
            document.getElementById('app-container').style.display = 'block';
            
            alert('✓ Successfully joined family!');
        } catch (error) {
            console.error('Join family error:', error);
            alert('Failed to join family: ' + error.message);
            joinFamilyBtn.disabled = false;
            joinFamilyBtn.textContent = 'Join Family';
        }
    });
}

auth.onAuthStateChanged(async (user) => {
    if (user && !authInitialized) {
        authInitialized = true;
        window.currentUser = user;
        console.log('✅ User signed in:', user.email);
        
        document.getElementById('loading-content').style.display = 'block';
        
        const success = await loadDataFromFirebase();
        
        if (success) {
            if (StateManager.state.familyCode) {
                const familyCodeDisplay = document.getElementById('family-code-display');
                const familyCodeText = document.getElementById('family-code-text');
                if (familyCodeDisplay && familyCodeText) {
                    familyCodeText.textContent = StateManager.state.familyCode;
                    familyCodeDisplay.style.display = 'block';
                }
            }
            
            updateUI();
            
            setTimeout(() => {
                document.getElementById('login-overlay').style.display = 'none';
                document.getElementById('app-container').style.display = 'block';
                initStatsSwipe();
            }, StateManager.state.familyCode ? 2000 : 100);
        } else {
            document.getElementById('loading-content').style.display = 'none';
            document.getElementById('login-content').style.display = 'block';
        }
    } else if (!user) {
        authInitialized = false;
        window.currentUser = null;
        document.getElementById('login-overlay').style.display = 'flex';
        document.getElementById('app-container').style.display = 'none';
        document.getElementById('login-content').style.display = 'block';
        document.getElementById('loading-content').style.display = 'none';
        document.getElementById('family-code-display').style.display = 'none';
    }
});
