// ========================================
// WIZARD IMPORT MODULE
// Add this to your dashboard to import wizard data
// ========================================

const WizardImportModule = {
    /**
     * Import wizard data from localStorage
     */
    importWizardData() {
        // Get data from localStorage
        const wizardDataJson = localStorage.getItem('compassWizardData');
        
        if (!wizardDataJson) {
            alert('❌ No wizard data found!\n\nPlease complete the Compass Setup Wizard first.');
            return;
        }
        
        try {
            const wizardData = JSON.parse(wizardDataJson);
            
            // Validate data
            if (!wizardData.children || !wizardData.data) {
                throw new Error('Invalid wizard data format');
            }
            
            // Confirm with user
            const childCount = wizardData.children.length;
            const childNames = wizardData.children.map(id => wizardData.data[id].name).join(', ');
            
            if (!confirm(`📥 Import Wizard Data?\n\n` +
                         `Family: ${wizardData.familyName || 'My Family'}\n` +
                         `Members: ${childNames}\n` +
                         `Values: ${wizardData.values ? wizardData.values.length : 0} selected\n\n` +
                         `This will replace current family data. Continue?`)) {
                return;
            }
            
            // Import into StateManager
            StateManager.state.children = wizardData.children;
            StateManager.state.data = wizardData.data;
            
            // Optional: Store family name and values
            if (wizardData.familyName) {
                StateManager.state.familyName = wizardData.familyName;
            }
            if (wizardData.values) {
                StateManager.state.familyValues = wizardData.values;
            }
            
            // Switch to first child
            if (wizardData.children.length > 0) {
                StateManager.state.currentChild = wizardData.children[0];
            }
            
            // Save to Firebase (if using Firebase)
            if (typeof FirebaseManager !== 'undefined' && FirebaseManager.saveState) {
                console.log('💾 Saving to Firebase...');
                FirebaseManager.saveState();
            }
            
            // Refresh UI
            if (typeof UICore !== 'undefined' && UICore.switchChild) {
                UICore.switchChild(StateManager.state.currentChild);
            }
            
            // Refresh rewards if module exists
            if (typeof RewardsModule !== 'undefined' && RewardsModule.renderRewardsStore) {
                RewardsModule.renderRewardsStore();
            }
            
            // Clear wizard data from localStorage
            localStorage.removeItem('compassWizardData');
            
            alert('✅ Wizard data imported successfully!\n\n' +
                  `${childCount} family member(s) added with:\n` +
                  `• Complete schedules\n` +
                  `• Character goals\n` +
                  `• Responsibilities\n` +
                  `• Rewards ready to earn!`);
            
            console.log('✅ Wizard data imported:', wizardData);
            
            // Reload page to ensure everything updates
            location.reload();
            
        } catch (error) {
            console.error('❌ Error importing wizard data:', error);
            alert('❌ Error importing wizard data. Check console for details.');
        }
    },
    
    /**
     * Check for wizard data on page load and show notification
     */
    checkForWizardData() {
        const wizardData = localStorage.getItem('compassWizardData');
        
        // Only show if no children exist yet
        if (wizardData && (!StateManager.state.children || StateManager.state.children.length === 0)) {
            this.showImportNotification();
        }
    },
    
    /**
     * Show floating notification about wizard data
     */
    showImportNotification() {
        const banner = document.createElement('div');
        banner.id = 'wizard-import-banner';
        banner.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 20px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
            z-index: 1000;
            cursor: pointer;
            animation: slideIn 0.5s ease;
            max-width: 320px;
        `;
        
        banner.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="font-size: 32px; margin-right: 12px;">✨</div>
                <div>
                    <div style="font-weight: 700; font-size: 18px;">Setup Complete!</div>
                    <div style="font-size: 14px; opacity: 0.9;">Click to import your family data</div>
                </div>
            </div>
            <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">
                Or click the "Import Wizard Setup" button
            </div>
        `;
        
        banner.onclick = () => {
            this.importWizardData();
            banner.remove();
        };
        
        document.body.appendChild(banner);
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// Auto-check on page load
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        // Wait a bit for StateManager to initialize
        setTimeout(() => {
            if (typeof StateManager !== 'undefined') {
                WizardImportModule.checkForWizardData();
            }
        }, 1000);
    });
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.WizardImportModule = WizardImportModule;
}
