// Compass UI Compatibility Bridge
// This file ensures your existing JavaScript modules work with the new Compass UI structure

(function() {
    console.log('🧭 Compass UI Compatibility Bridge Loading...');
    
    // Create missing elements immediately (body exists since script is in body tag)
    createMissingElements();
    
    // Wait for DOM to be ready for other compatibility features
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCompatibilityBridge);
    } else {
        initCompatibilityBridge();
    }
    
    function createMissingElements() {
        console.log('🔨 Creating missing UI elements...');
        
        // List of all elements that old code expects
        const requiredElements = [
            { id: 'child-buttons-container', tag: 'div' },
            { id: 'add-child-btn', tag: 'button' },
            { id: 'date-display', tag: 'div' },
            { id: 'tracker-buttons-container', tag: 'div' },
            { id: 'total-points', tag: 'div', content: '0' },
            { id: 'weekly-points', tag: 'div', content: '0' }
        ];
        
        requiredElements.forEach(({ id, tag, content }) => {
            if (!document.getElementById(id)) {
                console.log(`  ✓ Creating: #${id}`);
                const element = document.createElement(tag);
                element.id = id;
                element.style.display = 'none'; // Hidden, new UI handles these
                if (content) element.textContent = content;
                document.body.appendChild(element);
            } else {
                console.log(`  ✓ Already exists: #${id}`);
            }
        });
        
        console.log('✅ All required elements ready');
    }
    
    function initCompatibilityBridge() {
        console.log('🔧 Initializing Compass UI compatibility...');
        
        // Override any functions that need to work differently with new UI
        overrideUIFunctions();
        
        console.log('✅ Compass UI compatibility bridge loaded');
    }
    
    function overrideUIFunctions() {
        // Override child button rendering to use sidebar avatars
        if (window.UICore && UICore.renderChildButtons) {
            const originalRenderChildButtons = UICore.renderChildButtons;
            UICore.renderChildButtons = function() {
                // Call original to maintain backward compatibility
                originalRenderChildButtons.apply(this, arguments);
                
                // Also render sidebar avatars
                renderSidebarAvatars();
            };
        }
        
        // Helper to render sidebar avatars
        function renderSidebarAvatars() {
            const container = document.getElementById('sidebar-avatars-container');
            if (!container || !window.StateManager || !StateManager.state.data) return;
            
            const children = StateManager.state.data.children || [];
            const currentChildId = StateManager.state.currentChildId;
            
            container.innerHTML = '';
            
            children.forEach(child => {
                const avatar = document.createElement('div');
                avatar.className = 'sidebar-avatar';
                if (child.id === currentChildId) {
                    avatar.classList.add('active');
                }
                
                // Apply color gradient if available
                if (child.colorPalette) {
                    avatar.style.background = `linear-gradient(135deg, ${child.colorPalette.gradient1}, ${child.colorPalette.gradient2})`;
                }
                
                // Add photo or emoji
                if (child.photo) {
                    const img = document.createElement('img');
                    img.src = child.photo;
                    img.alt = child.name;
                    avatar.appendChild(img);
                } else if (child.emoji) {
                    avatar.textContent = child.emoji;
                }
                
                // Add name label
                const nameLabel = document.createElement('div');
                nameLabel.className = 'name';
                nameLabel.textContent = child.name;
                avatar.appendChild(nameLabel);
                
                // Click handler
                avatar.onclick = () => {
                    if (window.UICore && UICore.selectChild) {
                        UICore.selectChild(child.id);
                    }
                };
                
                container.appendChild(avatar);
            });
        }
        
        // Override member badge update in header
        if (window.UICore && UICore.selectChild) {
            const originalSelectChild = UICore.selectChild;
            UICore.selectChild = function(childId) {
                // Call original
                originalSelectChild.apply(this, arguments);
                
                // Update header member badge
                updateHeaderBadge();
            };
        }
        
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
                }
                
                // Apply color gradient
                if (currentChild.colorPalette) {
                    avatarEl.style.background = `linear-gradient(135deg, ${currentChild.colorPalette.gradient1}, ${currentChild.colorPalette.gradient2})`;
                }
            }
        }
        
        // Make renderSidebarAvatars and updateHeaderBadge globally available
        window.CompassUI = {
            renderSidebarAvatars: renderSidebarAvatars,
            updateHeaderBadge: updateHeaderBadge,
            refresh: function() {
                renderSidebarAvatars();
                updateHeaderBadge();
            }
        };
    }
})();
