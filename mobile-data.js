// ========================================
// DATA OPERATIONS - Firebase Sync
// ========================================

async function saveDataToFirebase() {
    if (!window.currentUser) return;
    
    try {
        console.log('💾 Saving data to Firebase...');
        
        if (StateManager.state.familyId) {
            const familyRef = db.collection('families').doc(StateManager.state.familyId);
            await familyRef.set({
                children: StateManager.state.children,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            for (const childId of StateManager.state.children) {
                const memberData = StateManager.state.data[childId];
                if (!memberData) continue;
                
                const { days, ...memberInfo } = memberData;
                await familyRef.collection('familyMembers').doc(childId).set(memberInfo, { merge: true });
                
                for (const [date, dayData] of Object.entries(days || {})) {
                    await familyRef.collection('familyMembers').doc(childId)
                        .collection('days').doc(date).set(dayData, { merge: true });
                }
            }
        }
        
        console.log('✅ Data saved');
    } catch (error) {
        console.error('❌ Save error:', error);
    }
}

async function loadDataFromFirebase() {
    if (!window.currentUser) return;
    
    try {
        console.log('📥 Loading data from Firebase...');
        const userId = window.currentUser.uid;
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            if (userData.familyId) {
                const familyRef = db.collection('families').doc(userData.familyId);
                const familyDoc = await familyRef.get();
                
                if (familyDoc.exists) {
                    const familyData = familyDoc.data();
                    StateManager.state.children = familyData.children || [];
                    StateManager.state.familyId = userData.familyId;
                    StateManager.state.familyCode = familyData.familyCode;
                    
                    for (const childId of StateManager.state.children) {
                        const memberDoc = await familyRef.collection('familyMembers').doc(childId).get();
                        if (memberDoc.exists) {
                            StateManager.state.data[childId] = memberDoc.data();
                            
                            // Initialize missing properties
                            if (!StateManager.state.data[childId].trackers) {
                                StateManager.state.data[childId].trackers = [];
                            }
                            if (!StateManager.state.data[childId].days) {
                                StateManager.state.data[childId].days = {};
                            }
                            if (!StateManager.state.data[childId].schedule) {
                                StateManager.state.data[childId].schedule = [];
                            }
                            if (!StateManager.state.data[childId].weeklyChores) {
                                StateManager.state.data[childId].weeklyChores = [];
                            }
                            if (!StateManager.state.data[childId].characterValues) {
                                StateManager.state.data[childId].characterValues = [];
                            }
                            
                            console.log('  Loaded member:', StateManager.state.data[childId].name);
                            
                            // Load daily data
                            const daysSnapshot = await familyRef.collection('familyMembers').doc(childId)
                                .collection('days').get();
                            StateManager.state.data[childId].days = {};
                            daysSnapshot.forEach(doc => {
                                StateManager.state.data[childId].days[doc.id] = doc.data();
                            });
                            console.log('  Loaded', daysSnapshot.size, 'days of data for', StateManager.state.data[childId].name);
                        } else if (!StateManager.state.data[childId]) {
                            console.log('  Initializing new member:', childId);
                            StateManager.createChild(childId);
                        }
                    }
                    
                    if (StateManager.state.children.length > 0) {
                        StateManager.state.currentChild = StateManager.state.children[0];
                    }
                }
            } else {
                // Create new family
                console.log('Creating new family for user...');
                const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                const familyId = 'family_' + Date.now();
                
                await db.collection('families').doc(familyId).set({
                    familyCode: familyCode,
                    createdBy: window.currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    children: []
                });
                
                await userRef.set({
                    email: window.currentUser.email,
                    displayName: window.currentUser.displayName,
                    familyId: familyId,
                    joinedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                StateManager.state.familyId = familyId;
                StateManager.state.familyCode = familyCode;
                StateManager.state.children = [];
                
                console.log('✅ New family created with code:', familyCode);
            }
        }
        
        console.log('✅ Data loaded');
        return true;
    } catch (error) {
        console.error('❌ Load error:', error);
        alert('Failed to load data: ' + error.message);
        return false;
    }
}

// Export to global scope
window.saveDataToFirebase = saveDataToFirebase;
window.loadDataFromFirebase = loadDataFromFirebase;
