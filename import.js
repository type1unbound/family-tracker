// ========================================
// ONBOARDING IMPORT MODULE
// Add this to your main app after the StateManager
// ========================================

const OnboardingImport = {
    /**
     * Import onboarding data and set up family members
     * @param {Object} importData - The exported JSON from onboarding
     * @returns {Promise<boolean>} - Success status
     */
    async importOnboardingData(importData) {
    // NEW: Handle wizard schema (no "members" wrapper)
    const isWizardData = importData.children && importData.data;
    
    if (!isWizardData && (!importData.members || !importData.readyToImport)) {
        alert('Invalid import data.');
        return false;
    }
    
    // Convert wizard format to expected format if needed
    if (isWizardData) {
        importData = {
            members: importData.children.map(childId => ({
                id: childId,
                ...importData.data[childId]
            })),
            readyToImport: true
        };
    }

    if (!confirm(`This will replace your current family setup with ${importData.members.length} member(s). Continue?`)) {
        return false;
    }

    try {
        console.log('📥 Starting import...');
        
        StateManager.state.children = [];
        StateManager.state.data = {};

        importData.members.forEach((member, index) => {
            const childId = member.id || `child${index + 1}`;
            
            StateManager.state.data[childId] = {
                name: member.name,
                photo: member.photo || null,
                colorPalette: member.colorPalette || 'purple',
                pointsBalance: member.pointsBalance || 0,
                pointsSpent: member.pointsSpent || 0,
                trackers: member.trackers || [],
                days: member.days || {},
                schedule: member.schedule || [],
                characterValues: member.characterValues || [],
                weeklyChores: member.weeklyChores || [],
                rewards: member.rewards || []
            };
            
            StateManager.state.children.push(childId);
        });

        if (StateManager.state.children.length > 0) {
            StateManager.state.currentChild = StateManager.state.children[0];
        }

        console.log('✅ Import successful!');
        
        if (window.saveData) {
            await window.saveData();
        }

        if (window.UICore) {
            UICore.updateUI();
        }

        alert(`✅ Successfully imported ${importData.members.length} family member(s)!`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Import failed:', error);
        alert('Import failed: ' + error.message);
        return false;
    }
},

    /**
     * Convert onboarding schedule format to app schedule format
     */
    convertSchedule(schedule) {
        if (!schedule || !Array.isArray(schedule)) return [];

        return schedule.map(item => ({
            id: item.id,
            time: item.time || '7:00am',
            name: item.name || 'Unnamed routine',
            tasks: item.tasks || [],
            days: item.days || [0,1,2,3,4,5,6],
            points: item.points // Store for reference
        }));
    },

    /**
     * Show import dialog
     */
    showImportDialog() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>📥 Import Onboarding Data</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 16px;">Upload the JSON file exported from Compass Onboarding:</p>
                    
                    <input type="file" id="import-file-input" accept=".json" style="display: none;">
                    
                    <button 
                        onclick="document.getElementById('import-file-input').click()"
                        style="
                            width: 100%;
                            padding: 16px;
                            background: linear-gradient(135deg, #93c593 0%, #6ba86b 100%);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            margin-bottom: 16px;
                        "
                    >
                        📁 Choose JSON File
                    </button>
                    
                    <div style="text-align: center; color: #6b7280; font-size: 14px; margin: 16px 0;">OR</div>
                    
                    <textarea 
                        id="import-json-text" 
                        placeholder="Paste JSON data here..."
                        rows="6"
                        style="
                            width: 100%;
                            padding: 12px;
                            border: 2px solid #e5e7eb;
                            border-radius: 8px;
                            font-family: monospace;
                            font-size: 12px;
                            resize: vertical;
                            margin-bottom: 16px;
                        "
                    ></textarea>
                    
                    <button 
                        onclick="OnboardingImport.processImport()"
                        style="
                            width: 100%;
                            padding: 12px;
                            background: #6366f1;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                        "
                    >
                        Import Data
                    </button>
                    
                    <div style="margin-top: 16px; padding: 12px; background: #fef3c7; border-radius: 8px; font-size: 13px;">
                        ⚠️ <strong>Warning:</strong> This will replace your current family setup with the imported data.
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Handle file selection
        const fileInput = document.getElementById('import-file-input');
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const jsonData = JSON.parse(event.target.result);
                        const success = await this.importOnboardingData(jsonData);
                        if (success) {
                            modal.remove();
                        }
                    } catch (error) {
                        alert('Error reading file: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        });
    },

    /**
     * Process import from textarea or file
     */
    async processImport() {
        const jsonText = document.getElementById('import-json-text').value;
        
        if (!jsonText.trim()) {
            // Check if data is available from window (from export button)
            if (window.compassImportData) {
                const success = await this.importOnboardingData(window.compassImportData);
                if (success) {
                    document.querySelector('.modal').remove();
                }
                return;
            }
            
            alert('Please paste JSON data or select a file.');
            return;
        }

        try {
            const jsonData = JSON.parse(jsonText);
            const success = await this.importOnboardingData(jsonData);
            if (success) {
                document.querySelector('.modal').remove();
            }
        } catch (error) {
            alert('Invalid JSON: ' + error.message);
        }
    },

    /**
     * Add import button to sidebar
     */
    addImportButton() {
        const sidebar = document.querySelector('.sidebar-section');
        if (!sidebar) return;

        const existingBtn = document.getElementById('import-onboarding-btn');
        if (existingBtn) return;

        const importBtn = document.createElement('button');
        importBtn.id = 'import-onboarding-btn';
        importBtn.className = 'sidebar-btn';
        importBtn.innerHTML = `
            <span class="sidebar-icon">📥</span>
            <span>Import Setup</span>
        `;
        importBtn.onclick = () => this.showImportDialog();

        // Insert after edit button
        const editBtn = document.getElementById('sidebar-edit-btn');
        if (editBtn && editBtn.parentNode) {
            editBtn.parentNode.insertBefore(importBtn, editBtn.nextSibling);
        } else {
            sidebar.appendChild(importBtn);
        }
    }
};

// Make available globally
window.OnboardingImport = OnboardingImport;

// Auto-add import button when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => OnboardingImport.addImportButton(), 1000);
    });
} else {
    setTimeout(() => OnboardingImport.addImportButton(), 1000);
}

console.log('✅ Onboarding Import module loaded');

// ============================================
// ============================================
// WIZARD MESSAGE LISTENER (postMessage)
// ============================================
window.addEventListener('message', async (event) => {
    if (event.data.type !== 'WIZARD_COMPLETE') {
        return;
    }
    
    console.log('📥 Received wizard data via postMessage');
    const wizardData = event.data.data;
    
    if (!currentUser) {
        console.error('No user logged in');
        return;
    }
    
    try {
        if (typeof showLoading === 'function') showLoading();
        
        console.log('💾 Creating new family with wizard data...');
        
        // Create new family in Firebase
        const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const familyId = 'family_' + Date.now();
        
        // Save family document
        await db.collection('families').doc(familyId).set({
            familyCode: familyCode,
            familyName: wizardData.familyName || 'My Family',
            values: wizardData.values || [],
            createdBy: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            children: wizardData.children || []
        });
        
        console.log('  ✓ Family created:', familyCode);
        
        // Save each child's data
        for (const childId of wizardData.children) {
            const childData = wizardData.data[childId];
            
            await db.collection('families').doc(familyId)
                .collection('familyMembers').doc(childId).set(childData);
            
            console.log('  ✓ Saved:', childData.name);
        }
        
        // Update user document with new family
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
        
        console.log('✅ Wizard data saved to Firebase!');
        
        // Switch to the new family (this will load dashboard)
        if (typeof switchToFamily === 'function') {
            await switchToFamily(familyId);
        } else {
            console.error('switchToFamily function not found');
            if (typeof hideLoading === 'function') hideLoading();
        }
        
    } catch (error) {
        console.error('❌ Error saving wizard data:', error);
        alert('Error saving wizard data: ' + error.message);
        if (typeof hideLoading === 'function') hideLoading();
    }
});

console.log('✅ Wizard message listener registered');
