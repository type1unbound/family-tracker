// Compass UI Compatibility Bridge
// This file ensures your existing JavaScript modules work with the new Compass UI structure

console.log('🧭 Compass Compatibility Loading...');

const LEGACY_ELEMENTS = [
    { id: 'child-buttons-container', tag: 'div' },
    { id: 'add-child-btn', tag: 'button' },
    { id: 'tracker-buttons-container', tag: 'div' }
];

function createRequiredElements() {
    console.log('🔨 Creating legacy elements...');
    LEGACY_ELEMENTS.forEach(({ id, tag, content }) => {
        if (!document.getElementById(id)) {
            console.log(`  ✓ Creating: #${id}`);
            const element = document.createElement(tag);
            element.id = id;
            element.style.display = 'none';
            if (content) element.textContent = content;
            document.body.appendChild(element);
        }
    });
    console.log('✅ All legacy elements created');
}

// Create elements as soon as body is available
if (document.body) {
    createRequiredElements();
} else {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createRequiredElements);
    } else {
        document.addEventListener('DOMContentLoaded', createRequiredElements);
    }
}

console.log('✅ Compatibility script loaded');

// Set up UI patching
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCompatibilityBridge);
    } else {
        initCompatibilityBridge();
    }
    
    function initCompatibilityBridge() {
        console.log('🔧 Initializing Compass UI compatibility...');
        overrideUIFunctions();
    }
    
    function overrideUIFunctions() {
        console.log('🔧 Setting up UI function overrides...');
        
        // Wait for ProfileModule
        const checkProfileModule = setInterval(() => {
            if (window.ProfileModule) {
                clearInterval(checkProfileModule);
                patchProfileModule();
            }
        }, 50);
        
        // Wait for UICore
        const checkUICore = setInterval(() => {
            if (window.UICore && UICore.updateUI) {
                clearInterval(checkUICore);
                patchUICore();
            }
        }, 50);
        
        function patchProfileModule() {
            console.log('📝 Patching ProfileModule...');
            
            const originalRenderChildButtons = ProfileModule.renderChildButtons;
            ProfileModule.renderChildButtons = function() {
                console.log('🎨 renderChildButtons() called');
                const container = document.getElementById('child-buttons-container');
                if (container) {
                    container.innerHTML = '';
                }
                renderSidebarAvatars();
                updateHeaderBadge();
            };
            
            const originalUpdateChildButtons = ProfileModule.updateChildButtons;
            ProfileModule.updateChildButtons = function() {
                console.log('🔄 updateChildButtons() called');
                originalUpdateChildButtons.call(this);
                renderSidebarAvatars();
                updateHeaderBadge();
            };
            
            console.log('✅ ProfileModule patched');
            
            // Force render with multiple retries
            let retryCount = 0;
            const maxRetries = 10;
            const retryInterval = setInterval(() => {
                retryCount++;
                console.log(`🔄 Retry ${retryCount}/${maxRetries}: Checking for data...`);
                
                if (window.StateManager && StateManager.state && StateManager.state.data && StateManager.state.data.children) {
                    console.log('✅ Data found! Rendering sidebar...');
                    clearInterval(retryInterval);
                    renderSidebarAvatars();
                    updateHeaderBadge();
                } else if (retryCount >= maxRetries) {
                    console.log('❌ Max retries reached, no data found');
                    console.log('StateManager:', window.StateManager);
                    console.log('State:', StateManager?.state);
                    console.log('Data:', StateManager?.state?.data);
                    clearInterval(retryInterval);
                }
            }, 200); // Check every 200ms
        }
        
        function patchUICore() {
            console.log('📝 Patching UICore...');
            
            const originalUpdateUI = UICore.updateUI;
            UICore.updateUI = function() {
                originalUpdateUI.call(this);
                renderSidebarAvatars();
                updateHeaderBadge();
            };
            
            const originalSelectChild = UICore.selectChild;
            UICore.selectChild = function(childId) {
                originalSelectChild.call(this, childId);
                renderSidebarAvatars();
                updateHeaderBadge();
            };
            
            console.log('✅ UICore patched');
        }
        
        function renderSidebarAvatars() {
            const container = document.getElementById('sidebar-avatars-container');
            if (!container) {
                console.log('⚠️ sidebar-avatars-container not found');
                return;
            }
            
            if (!window.StateManager || !StateManager.state || !StateManager.state.data) {
                console.log('⚠️ StateManager or data not available');
                return;
            }
            
            const children = StateManager.state.data.children || [];
            const currentChildId = StateManager.state.currentChildId;
            
            console.log(`🎨 Rendering ${children.length} avatars, current: ${currentChildId}`);
            
            container.innerHTML = '';
            
            children.forEach(childId => {
                const child = StateManager.getChild(childId);
                if (!child) {
                    console.log(`⚠️ Child ${childId} not found`);
                    return;
                }
                
                console.log(`  ✓ Rendering avatar for ${child.name}`);
                
                const avatar = document.createElement('div');
                avatar.className = 'sidebar-avatar';
                if (childId === currentChildId) {
                    avatar.classList.add('active');
                }
                
                // Apply color gradient
                if (child.colorPalette && window.CONFIG && CONFIG.COLOR_PALETTES) {
                    const palette = CONFIG.COLOR_PALETTES[child.colorPalette];
                    if (palette) {
                        avatar.style.background = `linear-gradient(135deg, ${palette.bgGradient1}, ${palette.bgGradient2})`;
                    }
                }
                
                // Add photo or emoji
                if (child.photo) {
                    const img = document.createElement('img');
                    img.src = child.photo;
                    img.alt = child.name;
                    avatar.appendChild(img);
                } else if (child.emoji) {
                    avatar.textContent = child.emoji;
                } else {
                    avatar.textContent = '👤';
                }
                
                // Add name label
                const nameLabel = document.createElement('div');
                nameLabel.className = 'name';
                nameLabel.textContent = child.name;
                avatar.appendChild(nameLabel);
                
                // Click handler
                avatar.onclick = () => {
                    console.log(`🖱️ Clicked ${child.name}`);
                    if (window.UICore && UICore.selectChild) {
                        UICore.selectChild(childId);
                    }
                };
                
                container.appendChild(avatar);
            });
            
            console.log('✅ Sidebar avatars rendered');
        }
        
        function updateHeaderBadge() {
            if (!window.StateManager) return;
            
            const currentChild = StateManager.getCurrentChild();
            if (!currentChild) {
                console.log('⚠️ No current child');
                return;
            }
            
            const avatarEl = document.getElementById('header-member-avatar');
            const nameEl = document.getElementById('header-member-name');
            
            if (nameEl) {
                nameEl.textContent = `${currentChild.name}'s Dashboard`;
            }
            
            if (avatarEl) {
                avatarEl.innerHTML = '';
                
                if (currentChild.photo) {
                    const img = document.createElement('img');
                    img.src = currentChild.photo;
                    img.alt = currentChild.name;
                    avatarEl.appendChild(img);
                } else if (currentChild.emoji) {
                    avatarEl.textContent = currentChild.emoji;
                } else {
                    avatarEl.textContent = '👤';
                }
                
                // Apply color gradient
                if (currentChild.colorPalette && window.CONFIG && CONFIG.COLOR_PALETTES) {
                    const palette = CONFIG.COLOR_PALETTES[currentChild.colorPalette];
                    if (palette) {
                        avatarEl.style.background = `linear-gradient(135deg, ${palette.bgGradient1}, ${palette.bgGradient2})`;
                    }
                }
            }
            
            console.log(`✅ Header updated for ${currentChild.name}`);
        }
        
        // Make functions globally available
        window.CompassUI = {
            renderSidebarAvatars: renderSidebarAvatars,
            updateHeaderBadge: updateHeaderBadge,
            refresh: function() {
                console.log('🔄 Manual refresh called');
                renderSidebarAvatars();
                updateHeaderBadge();
            }
        };
        
        console.log('✅ Compass UI compatibility complete');
    }
})();
