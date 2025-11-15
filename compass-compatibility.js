// Compass UI Compatibility Bridge
// This file ensures your existing JavaScript modules work with the new Compass UI structure

console.log('🧭 Compass Compatibility Loading...');

const LEGACY_ELEMENTS = [
    { id: 'child-buttons-container', tag: 'div' },
    { id: 'add-child-btn', tag: 'button' },
    { id: 'tracker-buttons-container', tag: 'div' }
];

// Create required legacy elements
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
    document.addEventListener('DOMContentLoaded', createRequiredElements);
}

console.log('✅ Compatibility script loaded');

// Render sidebar avatars
function renderSidebarAvatars() {
    console.log('🎨 renderSidebarAvatars() called');
    
    const container = document.getElementById('sidebar-avatars-container');
    if (!container) {
        console.log('⚠️ sidebar-avatars-container not found');
        return;
    }
    
    if (!window.StateManager || !StateManager.state) {
        console.log('⚠️ StateManager or state not available');
        return;
    }
    
    // Handle both possible data structures
    const children = StateManager.state.children || StateManager.state.data?.children || [];
    const currentChildId = StateManager.state.currentChildId;
    
    console.log(`🎨 Rendering ${children.length} avatars, current: ${currentChildId}`);
    console.log('Children array:', children);
    
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

// Update header badge
function updateHeaderBadge() {
    console.log('🏷️ updateHeaderBadge() called');
    
    if (!window.StateManager) {
        console.log('⚠️ StateManager not available');
        return;
    }
    
    const currentChild = StateManager.getCurrentChild();
    if (!currentChild) {
        console.log('⚠️ No current child');
        return;
    }
    
    console.log(`🏷️ Updating header for ${currentChild.name}`);
    
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

// Patch ProfileModule
function patchProfileModule() {
    console.log('📝 Patching ProfileModule...');
    
    if (!window.ProfileModule) {
        console.log('⚠️ ProfileModule not found');
        return;
    }
    
    const originalRenderChildButtons = ProfileModule.renderChildButtons;
    ProfileModule.renderChildButtons = function() {
        console.log('🎨 ProfileModule.renderChildButtons() called');
        const container = document.getElementById('child-buttons-container');
        if (container) {
            container.innerHTML = '';
        }
        renderSidebarAvatars();
        updateHeaderBadge();
    };
    
    const originalUpdateChildButtons = ProfileModule.updateChildButtons;
    ProfileModule.updateChildButtons = function() {
        console.log('🔄 ProfileModule.updateChildButtons() called');
        if (originalUpdateChildButtons) {
            originalUpdateChildButtons.call(this);
        }
        renderSidebarAvatars();
        updateHeaderBadge();
    };
    
    console.log('✅ ProfileModule patched');
}

// Patch UICore
function patchUICore() {
    console.log('📝 Patching UICore...');
    
    if (!window.UICore) {
        console.log('⚠️ UICore not found');
        return;
    }
    
    const originalUpdateUI = UICore.updateUI;
    UICore.updateUI = function() {
        console.log('🎨 UICore.updateUI() called');
        if (originalUpdateUI) {
            originalUpdateUI.call(this);
        }
        renderSidebarAvatars();
        updateHeaderBadge();
    };
    
    const originalSelectChild = UICore.selectChild;
    UICore.selectChild = function(childId) {
        console.log(`🎯 UICore.selectChild(${childId}) called`);
        if (originalSelectChild) {
            originalSelectChild.call(this, childId);
        }
        renderSidebarAvatars();
        updateHeaderBadge();
    };
    
    console.log('✅ UICore patched');
}

// Initialize compatibility bridge
function initCompatibilityBridge() {
    console.log('🔧 Initializing Compass UI compatibility...');
    
    // Wait for ProfileModule
    const checkProfileModule = setInterval(() => {
        if (window.ProfileModule) {
            clearInterval(checkProfileModule);
            patchProfileModule();
        }
    }, 50);
    
    // Wait for UICore
    const checkUICore = setInterval(() => {
        if (window.UICore) {
            clearInterval(checkUICore);
            patchUICore();
        }
    }, 50);
    
    // Wait for StateManager with data - check both possible structures
    let retryCount = 0;
    const maxRetries = 10;
    const retryInterval = setInterval(() => {
        retryCount++;
        console.log(`🔄 Retry ${retryCount}/${maxRetries}: Checking for data...`);
        
        // Check both possible data structures
        const children = StateManager?.state?.children || StateManager?.state?.data?.children;
        
        if (window.StateManager && StateManager.state && children && children.length > 0) {
            console.log('✅ Data found! Rendering sidebar...');
            console.log('Children:', children);
            clearInterval(retryInterval);
            renderSidebarAvatars();
            updateHeaderBadge();
        } else if (retryCount >= maxRetries) {
            console.log('❌ Max retries reached');
            console.log('StateManager:', window.StateManager);
            console.log('State:', StateManager?.state);
            console.log('Children (state.children):', StateManager?.state?.children);
            console.log('Children (state.data.children):', StateManager?.state?.data?.children);
            clearInterval(retryInterval);
        }
    }, 200);
    
    console.log('✅ Compass UI compatibility initialized');
}

// Make everything globally available for debugging
window.CompassUI = {
    renderSidebarAvatars,
    updateHeaderBadge,
    patchProfileModule,
    patchUICore,
    initCompatibilityBridge,
    refresh: function() {
        console.log('🔄 Manual refresh called');
        renderSidebarAvatars();
        updateHeaderBadge();
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompatibilityBridge);
} else {
    initCompatibilityBridge();
}

console.log('✅ CompassUI object created and available globally');
