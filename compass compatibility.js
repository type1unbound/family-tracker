// Compass UI Compatibility Bridge
// This file ensures your existing JavaScript modules work with the new Compass UI structure

// CREATE ELEMENTS - Handle both head and body loading
console.log('🧭 Compass Compatibility Loading...');

const REQUIRED_ELEMENTS = [
    { id: 'child-buttons-container', tag: 'div' },
    { id: 'add-child-btn', tag: 'button' },
    { id: 'date-display', tag: 'div' },
    { id: 'tracker-buttons-container', tag: 'div' },
    { id: 'total-points', tag: 'div', content: '0' },
    { id: 'weekly-points', tag: 'div', content: '0' }
];

function createRequiredElements() {
    console.log('🔨 Creating required elements...');
    REQUIRED_ELEMENTS.forEach(({ id, tag, content }) => {
        if (!document.getElementById(id)) {
            console.log(`  ✓ Creating: #${id}`);
            const element = document.createElement(tag);
            element.id = id;
            element.style.display = 'none'; // Hidden, new UI handles these
            if (content) element.textContent = content;
            document.body.appendChild(element);
        }
    });
    console.log('✅ All elements created');
}

// Create elements as soon as body is available
if (document.body) {
    createRequiredElements();
} else {
    // Body doesn't exist yet, wait for it
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createRequiredElements);
    } else {
        // DOM is already loaded but no body?? Create one
        document.addEventListener('DOMContentLoaded', createRequiredElements);
    }
}

console.log('✅ Compatibility script loaded');

// NOW set up the rest of compatibility
(function() {
    // Wait for DOM to be ready for other compatibility features
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCompatibilityBridge);
    } else {
        initCompatibilityBridge();
    }
    
    function initCompatibilityBridge() {
        console.log('🔧 Initializing Compass UI compatibility bridge...');
        overrideUIFunctions();
        console.log('✅ Compass UI compatibility bridge loaded');
    }
    
    function overrideUIFunctions() {
        console.log('🔧 Setting up UI function overrides...');
        
        // Wait for ProfileModule to be available, then patch it
        const checkProfileModule = setInterval(() => {
            if (window.ProfileModule) {
                clearInterval(checkProfileModule);
                patchProfileModule();
            }
        }, 50);
        
        function patchProfileModule() {
            console.log('📝 Patching ProfileModule.renderChildButtons...');
            
            // Save original function
            const originalRenderChildButtons = ProfileModule.renderChildButtons;
            
            // Replace with our version that handles both old and new UI
            ProfileModule.renderChildButtons = function() {
                console.log('🎨 Rendering child buttons (Compass version)...');
                
                // Get the container - it should exist now
                const container = document.getElementById('child-buttons-container');
                if (!container) {
                    console.error('❌ child-buttons-container still missing!');
                    return;
                }
                
                // Clear it (this is what the original code does)
                container.innerHTML = '';
                
                // Now render sidebar avatars for the new UI
                renderSidebarAvatars();
                
                // Also update header badge
                updateHeaderBadge();
                
                console.log('✅ Child buttons rendered');
            };
            
            // Also patch updateChildButtons to update sidebar
            const originalUpdateChildButtons = ProfileModule.updateChildButtons;
            ProfileModule.updateChildButtons = function() {
                console.log('🔄 Updating child buttons (Compass version)...');
                
                // Call original to update hidden elements
                originalUpdateChildButtons.call(this);
                
                // Update sidebar
                renderSidebarAvatars();
                updateHeaderBadge();
            };
            
            console.log('✅ ProfileModule patched');
        }
        
        // Helper to render sidebar avatars
        function renderSidebarAvatars() {
            const container = document.getElementById('sidebar-avatars-container');
            if (!container || !window.StateManager || !StateManager.state.data) {
                console.log('⚠️ Cannot render sidebar avatars - missing container or StateManager');
                return;
            }
            
            const children = StateManager.state.data.children || [];
            const currentChildId = StateManager.state.currentChildId;
            
            container.innerHTML = '';
            
            children.forEach(childId => {
                const child = StateManager.getChild(childId);
                if (!child) return;
                
                const avatar = document.createElement('div');
                avatar.className = 'sidebar-avatar';
                if (childId === currentChildId) {
                    avatar.classList.add('active');
                }
                
                // Apply color gradient if available
                if (child.colorPalette) {
                    const palette = window.CONFIG && CONFIG.COLOR_PALETTES ? CONFIG.COLOR_PALETTES[child.colorPalette] : null;
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
                    if (window.UICore && UICore.selectChild) {
                        UICore.selectChild(childId);
                    }
                };
                
                container.appendChild(avatar);
            });
            
            console.log(`✅ Rendered ${children.length} sidebar avatars`);
        }
        
        // Helper to update header member badge
        function updateHeaderBadge() {
            if (!window.StateManager) return;
            
            const currentChild = StateManager.getCurrentChild();
            if (!currentChild) return;
            
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
                if (currentChild.colorPalette) {
                    const palette = window.CONFIG && CONFIG.COLOR_PALETTES ? CONFIG.COLOR_PALETTES[currentChild.colorPalette] : null;
                    if (palette) {
                        avatarEl.style.background = `linear-gradient(135deg, ${palette.bgGradient1}, ${palette.bgGradient2})`;
                    }
                }
            }
            
            console.log(`✅ Updated header badge for ${currentChild.name}`);
        }
        
        // Make functions globally available
        window.CompassUI = {
            renderSidebarAvatars: renderSidebarAvatars,
            updateHeaderBadge: updateHeaderBadge,
            refresh: function() {
                renderSidebarAvatars();
                updateHeaderBadge();
            }
        };
        
        console.log('✅ UI function overrides complete');
    }
})();
