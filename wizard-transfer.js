// ========================================
// AUTOMATIC WIZARD DATA RECEIVER
// Add this to your main Compass app HTML or as a separate JS file
// ========================================

// Listen for wizard completion
window.addEventListener('message', async function(event) {
    // Security: Only accept messages from trusted wizard domains
    const allowedOrigins = [
        'https://type1unbound.github.io',
        'https://family-tracker-37025.firebaseapp.com',
        'https://family-tracker-37025.web.app'
    ];
    
    if (!allowedOrigins.includes(event.origin)) {
        console.log('❌ Rejected message from unknown origin:', event.origin);
        return;
    }
    
    // Check if this is wizard data
    if (event.data.type === 'COMPASS_WIZARD_COMPLETE') {
        console.log('📥 Received wizard data from child window');
        console.log('   Data:', event.data.data);
        
        const wizardData = event.data.data;
        
        // Validate data
        if (!wizardData.readyToImport || !wizardData.members || wizardData.members.length === 0) {
            alert('Invalid wizard data received. Please try again.');
            return;
        }
        
        // Show loading
        if (window.showLoading) {
            showLoading();
        }
        
        try {
            // Create family from wizard data
            await createFamilyFromWizard(wizardData);
            
            console.log('✅ Family created from wizard data successfully!');
            
            // Hide loading
            if (window.hideLoading) {
                hideLoading();
            }
            
            // Show success message
            alert(`🎉 Success! Your family "${wizardData.familyName}" has been created with ${wizardData.members.length} member(s)!`);
            
        } catch (error) {
            console.error('❌ Error creating family from wizard:', error);
            
            if (window.hideLoading) {
                hideLoading();
            }
            
            alert('Error creating family: ' + error.message);
        }
    }
});

/**
 * Create family from wizard data
 */
async function createFamilyFromWizard(wizardData) {
    if (!currentUser) {
        throw new Error('No user logged in');
    }
    
    console.log('🏗️ Creating family from wizard data...');
    
    // Generate family ID and code
    const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const familyId = 'family_' + Date.now();
    
    // Extract member IDs
    const childIds = wizardData.members.map((member, index) => `child${index + 1}`);
    
    // Create family document
    console.log('  - Creating family document...');
    await db.collection('families').doc(familyId).set({
        familyCode: familyCode,
        createdBy: currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        children: childIds,
        familyValues: wizardData.familyValues || [],
        familyName: wizardData.familyName || 'My Family'
    });
    
    console.log('  - Family created with code:', familyCode);
    
    // Create each family member
    console.log('  - Creating family members...');
    for (let i = 0; i < wizardData.members.length; i++) {
        const member = wizardData.members[i];
        const childId = childIds[i];
        
        console.log(`    Processing member ${i + 1}:`, member.name);
        console.log(`      - Routine items:`, member.routine ? member.routine.length : 0);
        console.log(`      - Responsibilities:`, member.responsibilities ? member.responsibilities.length : 0);
        console.log(`      - Goals:`, member.goals ? member.goals.length : 0);
        console.log(`      - Rewards:`, member.rewards ? member.rewards.length : 0);
        
        // ============================================
        // SCHEMA TRANSFORMATION
        // Match EXACT structure from CONFIG.DEFAULT_* in app.js
        // ============================================
        
        // 1. SCHEDULE TRANSFORMATION
        // From: { text: "Wake up", points: 2 }
        // To:   { id: 1, time: "7:00am", name: "Wake up", tasks: ["Wake up"], days: [0,1,2,3,4,5,6] }
        const schedule = [];
        if (Array.isArray(member.routine)) {
            member.routine.forEach((routineItem, idx) => {
                // Generate sequential times: 7:00am, 7:30am, 8:00am, etc.
                const baseHour = 7;
                const intervalMinutes = 30;
                const totalMinutes = baseHour * 60 + (idx * intervalMinutes);
                const hours = Math.floor(totalMinutes / 60) % 24;
                const minutes = totalMinutes % 60;
                const hour12 = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
                const period = hours >= 12 ? 'pm' : 'am';
                const timeStr = `${hour12}:${minutes.toString().padStart(2, '0')}${period}`;
                
                schedule.push({
                    id: idx + 1,                              // Number ID (1, 2, 3...)
                    time: timeStr,                            // "7:00am" format
                    name: routineItem.text || 'Routine item', // String
                    tasks: [routineItem.text || 'Complete task'], // Array of strings
                    days: [0, 1, 2, 3, 4, 5, 6]              // All days (Sun-Sat)
                });
            });
        }
        
        // 2. WEEKLY CHORES TRANSFORMATION
        // From: { text: "Clean room", points: 3 }
        // To:   { id: "chore1", name: "Clean room" }
        const weeklyChores = [];
        if (Array.isArray(member.responsibilities)) {
            member.responsibilities.forEach((resp, idx) => {
                weeklyChores.push({
                    id: `chore${idx + 1}`,           // String ID
                    name: resp.text || 'Chore'       // String
                });
            });
        }
        
        // 3. CHARACTER VALUES TRANSFORMATION
        // From: [{ text: "Be kind", points: 8 }, { text: "Help others", points: 8 }]
        // To:   [{ id: "personal_goals", category: "Personal Goals", weight: 1.0, items: ["Be kind", "Help others"] }]
        const characterValues = [];
        if (Array.isArray(member.goals) && member.goals.length > 0) {
            characterValues.push({
                id: 'personal_goals',                    // String ID
                category: 'Personal Goals',              // String
                weight: 1.0,                            // Number
                items: member.goals.map(g => g.text || 'Goal') // Array of strings
            });
        }
        
        // 4. REWARDS TRANSFORMATION
        // From: { name: "Extra screen time", points: 50, category: "digital" }
        // To:   { id: "reward1", name: "Extra screen time", points: 50, category: "digital", available: true, redeemed: false }
        const rewards = [];
        if (Array.isArray(member.rewards)) {
            member.rewards.forEach((reward, idx) => {
                rewards.push({
                    id: `reward${idx + 1}`,                    // String ID
                    name: reward.name || 'Reward',             // String
                    points: parseInt(reward.points) || 10,     // Number
                    category: reward.category || 'general',    // String
                    available: true,                           // Boolean
                    redeemed: false                            // Boolean
                });
            });
        }
        
        // ============================================
        // PREPARE MEMBER DATA WITH TRANSFORMED SCHEMAS
        // ============================================
        const memberData = {
            name: member.name,
            age: parseInt(member.age),
            role: member.role || 'child',
            colorPalette: getDefaultColorForIndex(i),
            photo: null,
            
            // EXACT SCHEMA MATCHES
            schedule: schedule,           // Matches DEFAULT_SCHEDULE structure
            weeklyChores: weeklyChores,   // Matches DEFAULT_WEEKLY_CHORES structure
            characterValues: characterValues, // Matches DEFAULT_CHARACTER_VALUES structure
            rewards: rewards,             // Matches rewards structure
            
            // Additional required fields
            pointsBalance: 0,
            pointsSpent: 0,
            pointsEarned: 0,
            
            // Motivation
            motivationStyle: member.motivationStyle || 'Rewards and incentives',
            
            // Trackers and days
            trackers: [],
            days: {}
        };
        
        // Save member to Firestore
        await db.collection('families').doc(familyId)
            .collection('familyMembers').doc(childId)
            .set(memberData);
        
        console.log(`    ✓ Created ${member.name}`);
        console.log(`      ✅ Schedule: ${memberData.schedule.length} items`);
        if (memberData.schedule.length > 0) {
            console.log(`         Sample:`, memberData.schedule[0]);
            console.log(`         ✓ Has 'tasks' array:`, Array.isArray(memberData.schedule[0].tasks));
        }
        console.log(`      ✅ Weekly Chores: ${memberData.weeklyChores.length} chores`);
        if (memberData.weeklyChores.length > 0) {
            console.log(`         Sample:`, memberData.weeklyChores[0]);
        }
        console.log(`      ✅ Character Values: ${memberData.characterValues.length} categories`);
        if (memberData.characterValues.length > 0) {
            console.log(`         Sample:`, memberData.characterValues[0]);
            console.log(`         ✓ Has 'items' array:`, Array.isArray(memberData.characterValues[0].items));
        }
        console.log(`      ✅ Rewards: ${memberData.rewards.length} rewards`);
    }
    
    // Update user document
    console.log('  - Updating user document...');
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
    
    console.log('✅ Family setup complete!');
    
    // Switch to new family
    if (window.switchToFamily) {
        await switchToFamily(familyId);
    }
}

/**
 * Get default color palette for member index
 */
function getDefaultColorForIndex(index) {
    const colors = ['purple', 'blue', 'green', 'orange', 'pink', 'teal', 'red', 'yellow'];
    return colors[index % colors.length];
}

console.log('✅ Automatic wizard data receiver loaded');
