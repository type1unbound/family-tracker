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
        
        // Prepare member data with GUARANTEED arrays
        const memberData = {
            name: member.name,
            age: parseInt(member.age),
            role: member.role || 'child',
            colorPalette: getDefaultColorForIndex(i),
            photo: null,
            
            // Schedule (routine items) - ALWAYS create array in proper format
            schedule: Array.isArray(member.routine) ? member.routine.map((item, idx) => {
                // Generate time based on index: 7:00am, 7:30am, 8:00am, etc.
                const baseHour = 7;
                const intervalMinutes = 30;
                const totalMinutes = baseHour * 60 + (idx * intervalMinutes);
                const hours = Math.floor(totalMinutes / 60) % 24;
                const minutes = totalMinutes % 60;
                const hour12 = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
                const period = hours >= 12 ? 'pm' : 'am';
                const timeStr = `${hour12}:${minutes.toString().padStart(2, '0')}${period}`;
                
                return {
                    id: idx + 1,
                    time: timeStr,
                    name: item.text || 'Routine item',
                    tasks: [item.text || 'Complete task'],
                    days: item.days || [0,1,2,3,4,5,6],
                    points: parseInt(item.points) || 1,
                    frequency: item.frequency || 'daily'
                };
            }) : [],
            
            // Weekly chores (responsibilities) - ALWAYS create array in proper format
            weeklyChores: Array.isArray(member.responsibilities) ? member.responsibilities.map((item, idx) => ({
                id: `chore${idx + 1}`,
                name: item.text || ''
            })) : [],
            
            // Character values (goals) - ALWAYS create array in proper category format
            characterValues: Array.isArray(member.goals) && member.goals.length > 0 ? [{
                id: 'personal_goals',
                category: 'Personal Goals',
                weight: 1.0,
                items: member.goals.map(goal => goal.text || '')
            }] : [],
            
            // Rewards - ALWAYS create array
            rewards: Array.isArray(member.rewards) ? member.rewards.map((reward, idx) => ({
                id: `reward${idx + 1}`,
                name: reward.name || '',
                points: parseInt(reward.points) || 10,
                category: reward.category || 'general',
                available: true,
                redeemed: false
            })) : [],
            
            // Points
            pointsBalance: 0,
            pointsSpent: 0,
            pointsEarned: 0,
            
            // Motivation
            motivationStyle: member.motivationStyle || 'Rewards and incentives',
            
            // Trackers
            trackers: [],
            
            // Days data
            days: {}
        };
        
        // Save member to Firestore
        await db.collection('families').doc(familyId)
            .collection('familyMembers').doc(childId)
            .set(memberData);
        
        console.log(`    ✓ Created ${member.name}`);
        console.log(`      Schedule: ${memberData.schedule.length} items with times ${memberData.schedule[0]?.time} to ${memberData.schedule[memberData.schedule.length-1]?.time}`);
        console.log(`      Weekly Chores: ${memberData.weeklyChores.length} chores`);
        console.log(`      Character Values: ${memberData.characterValues.length} categories`);
        if (memberData.schedule.length > 0) {
            console.log(`      Sample schedule item:`, memberData.schedule[0]);
        }
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
