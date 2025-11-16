/**
 * PROFILE.JS - Profile Management
 * Handles family member profiles, photos, color palettes, and trackers
 */

const ProfileModule = {
    /**
     * Open profile modal
     */
    openProfileModal() {
        const child = StateManager.getCurrentChild();
        
        document.getElementById('modal-profile-name').value = child.name;
        
        this.renderTrackerList(StateManager.state.currentChild);
        
        const deleteBtn = document.getElementById('delete-child-btn');
        if (deleteBtn) {
            deleteBtn.style.display = StateManager.state.children.length > 1 ? 'block' : 'none';
        }
        
        document.getElementById('crop-area').style.display = 'none';
        document.getElementById('upload-area').style.display = 'block';
        document.getElementById('crop-container').classList.remove('active');
        
        // Render color palette options
        const grid = document.getElementById('color-palette-grid');
        grid.innerHTML = Object.entries(CONFIG.COLOR_PALETTES).map(([key, palette]) => `
            <div class="color-palette-option ${child.colorPalette === key ? 'selected' : ''}" onclick="ProfileModule.selectColorPalette('${key}')">
                <div class="color-palette-preview">
                    <div class="color-palette-dot" style="background: linear-gradient(135deg, ${palette.bgGradient1}, ${palette.bgGradient2})"></div>
                    <div class="color-palette-dot" style="background: ${palette.statCard}"></div>
                    <div class="color-palette-dot" style="background: ${palette.profileButton}"></div>
                </div>
                <div class="color-palette-name">${palette.name}</div>
            </div>
        `).join('');
        
        // Show current photo if exists
        const photoContainer = document.getElementById('photo-preview-container');
        if (child.photo) {
            photoContainer.innerHTML = `<img src="${child.photo}" class="photo-preview">`;
            document.getElementById('remove-photo-btn').style.display = 'inline-block';
        } else {
            photoContainer.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 8px;">📷</div>
                <div style="color: #6b7280; font-size: 14px;">Click to upload photo</div>
                <div style="color: #9ca3af; font-size: 12px; margin-top: 4px;">JPG, PNG or GIF</div>
            `;
            document.getElementById('remove-photo-btn').style.display = 'none';
        }
        
        document.getElementById('profile-modal').classList.add('active');
    },

    /**
     * Save profile
     */
    saveProfile() {
        const name = document.getElementById('modal-profile-name').value;
        
        if (!name) {
            alert('Please enter a name');
            return;
        }
        
        const child = StateManager.getCurrentChild();
        child.name = name;
        
        // Save photo - check for both undefined AND null
        if (StateManager.state.tempPhoto !== undefined && StateManager.state.tempPhoto !== null) {
            child.photo = StateManager.state.tempPhoto;
            console.log('✅ Photo saved to child:', child.photo.substring(0, 50));
        } else {
            console.log('⚠️ No tempPhoto to save');
        }
        
        if (StateManager.state.tempPalette) {
            child.colorPalette = StateManager.state.tempPalette;
        }
        
        // Clean up temp values
        delete StateManager.state.tempPhoto;
        delete StateManager.state.tempPalette;
        
        // Save to Firestore
        if (window.saveData) {
            window.saveData();
        }
        
        this.closeModal();
        this.updateChildButtons();
        this.updateTrackerButtons();
        if (window.UICore) {
            UICore.applyColorPalette();
            UICore.updateUI();
        }
    },

    /**
     * Select color palette
     */
    selectColorPalette(paletteKey) {
        document.querySelectorAll('.color-palette-option').forEach(option => {
            option.classList.remove('selected');
        });
        event.target.closest('.color-palette-option').classList.add('selected');
        
        StateManager.state.tempPalette = paletteKey;
    },

    /**
     * Handle photo upload
     */
    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('upload-area').style.display = 'none';
                document.getElementById('crop-area').style.display = 'block';
                
                const img = document.getElementById('crop-image');
                img.src = e.target.result;
                StateManager.state.cropData.image = e.target.result;
                
                img.onload = function() {
                    const container = document.getElementById('crop-container');
                    container.classList.add('active');
                    
                    const imgWidth = img.clientWidth;
                    const imgHeight = img.clientHeight;
                    const cropSize = Math.min(imgWidth, imgHeight) * 0.7;
                    
                    StateManager.state.cropData.width = cropSize;
                    StateManager.state.cropData.height = cropSize;
                    StateManager.state.cropData.x = (imgWidth - cropSize) / 2;
                    StateManager.state.cropData.y = (imgHeight - cropSize) / 2;
                    
                    ProfileModule.updateCropOverlay();
                    ProfileModule.initCropHandlers();
                };
            };
            reader.readAsDataURL(file);
        }
    },

    /**
     * Update crop overlay position
     */
    updateCropOverlay() {
        const overlay = document.getElementById('crop-overlay');
        overlay.style.left = StateManager.state.cropData.x + 'px';
        overlay.style.top = StateManager.state.cropData.y + 'px';
        overlay.style.width = StateManager.state.cropData.width + 'px';
        overlay.style.height = StateManager.state.cropData.height + 'px';
    },

    /**
     * Initialize crop handlers
     */
    initCropHandlers() {
        const overlay = document.getElementById('crop-overlay');
        const handles = overlay.querySelectorAll('.crop-handle');
        
        overlay.addEventListener('mousedown', function(e) {
            if (e.target === overlay) {
                StateManager.state.cropData.isDragging = true;
                StateManager.state.cropData.startX = e.clientX - StateManager.state.cropData.x;
                StateManager.state.cropData.startY = e.clientY - StateManager.state.cropData.y;
                e.preventDefault();
            }
        });
        
        handles.forEach(handle => {
            handle.addEventListener('mousedown', function(e) {
                StateManager.state.cropData.isResizing = true;
                StateManager.state.cropData.resizeHandle = handle.className.split(' ')[1];
                StateManager.state.cropData.startX = e.clientX;
                StateManager.state.cropData.startY = e.clientY;
                StateManager.state.cropData.startCropX = StateManager.state.cropData.x;
                StateManager.state.cropData.startCropY = StateManager.state.cropData.y;
                StateManager.state.cropData.startCropWidth = StateManager.state.cropData.width;
                StateManager.state.cropData.startCropHeight = StateManager.state.cropData.height;
                e.stopPropagation();
                e.preventDefault();
            });
        });
        
        document.addEventListener('mousemove', function(e) {
            if (StateManager.state.cropData.isDragging) {
                const img = document.getElementById('crop-image');
                let newX = e.clientX - StateManager.state.cropData.startX;
                let newY = e.clientY - StateManager.state.cropData.startY;
                
                newX = Math.max(0, Math.min(newX, img.clientWidth - StateManager.state.cropData.width));
                newY = Math.max(0, Math.min(newY, img.clientHeight - StateManager.state.cropData.height));
                
                StateManager.state.cropData.x = newX;
                StateManager.state.cropData.y = newY;
                ProfileModule.updateCropOverlay();
            } else if (StateManager.state.cropData.isResizing) {
                const img = document.getElementById('crop-image');
                const dx = e.clientX - StateManager.state.cropData.startX;
                const dy = e.clientY - StateManager.state.cropData.startY;
                const handle = StateManager.state.cropData.resizeHandle;
                
                let newX = StateManager.state.cropData.startCropX;
                let newY = StateManager.state.cropData.startCropY;
                let newWidth = StateManager.state.cropData.startCropWidth;
                let newHeight = StateManager.state.cropData.startCropHeight;
                
                if (handle.includes('n')) {
                    newY = StateManager.state.cropData.startCropY + dy;
                    newHeight = StateManager.state.cropData.startCropHeight - dy;
                }
                if (handle.includes('s')) {
                    newHeight = StateManager.state.cropData.startCropHeight + dy;
                }
                if (handle.includes('w')) {
                    newX = StateManager.state.cropData.startCropX + dx;
                    newWidth = StateManager.state.cropData.startCropWidth - dx;
                }
                if (handle.includes('e')) {
                    newWidth = StateManager.state.cropData.startCropWidth + dx;
                }
                
                const minSize = 50;
                if (newWidth >= minSize && newX >= 0 && newX + newWidth <= img.clientWidth) {
                    StateManager.state.cropData.x = newX;
                    StateManager.state.cropData.width = newWidth;
                }
                if (newHeight >= minSize && newY >= 0 && newY + newHeight <= img.clientHeight) {
                    StateManager.state.cropData.y = newY;
                    StateManager.state.cropData.height = newHeight;
                }
                
                ProfileModule.updateCropOverlay();
            }
        });
        
        document.addEventListener('mouseup', function() {
            StateManager.state.cropData.isDragging = false;
            StateManager.state.cropData.isResizing = false;
        });
    },

    /**
     * Apply crop
     */
    applyCrop() {
        const img = document.getElementById('crop-image');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const scaleX = img.naturalWidth / img.clientWidth;
        const scaleY = img.naturalHeight / img.clientHeight;
        
        // Calculate cropped dimensions
        const cropWidth = StateManager.state.cropData.width * scaleX;
        const cropHeight = StateManager.state.cropData.height * scaleY;
        
        // Set max dimensions for compression
        const MAX_SIZE = 400;
        let finalWidth = cropWidth;
        let finalHeight = cropHeight;
        
        // Scale down if needed
        if (cropWidth > MAX_SIZE || cropHeight > MAX_SIZE) {
            const scale = MAX_SIZE / Math.max(cropWidth, cropHeight);
            finalWidth = cropWidth * scale;
            finalHeight = cropHeight * scale;
        }
        
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        
        ctx.drawImage(
            img,
            StateManager.state.cropData.x * scaleX,
            StateManager.state.cropData.y * scaleY,
            cropWidth,
            cropHeight,
            0,
            0,
            finalWidth,
            finalHeight
        );
        
        // Compress to JPEG with 70% quality
        const croppedImage = canvas.toDataURL('image/jpeg', 0.7);
        
        console.log('📸 Cropped image size:', croppedImage.length, 'bytes');
        
        // Check if still too large
        if (croppedImage.length > 900000) {
            alert('Image is still too large after compression. Please try a smaller crop area or a different photo.');
            return;
        }
        
        const photoContainer = document.getElementById('photo-preview-container');
        photoContainer.innerHTML = `<img src="${croppedImage}" class="photo-preview" style="max-width: 200px; border-radius: 50%;">`;
        document.getElementById('remove-photo-btn').style.display = 'inline-block';
        StateManager.state.tempPhoto = croppedImage;
        
        document.getElementById('crop-area').style.display = 'none';
        document.getElementById('upload-area').style.display = 'block';
        document.getElementById('crop-container').classList.remove('active');
    },

    /**
     * Cancel crop
     */
    cancelCrop() {
        document.getElementById('photo-upload').value = '';
        document.getElementById('crop-area').style.display = 'none';
        document.getElementById('upload-area').style.display = 'block';
        document.getElementById('crop-container').classList.remove('active');
    },

    /**
     * Remove photo
     */
    removePhoto() {
        const photoContainer = document.getElementById('photo-preview-container');
        photoContainer.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 8px;">📷</div>
            <div style="color: #6b7280; font-size: 14px;">Click to upload photo</div>
            <div style="color: #9ca3af; font-size: 12px; margin-top: 4px;">JPG, PNG or GIF</div>
        `;
        document.getElementById('remove-photo-btn').style.display = 'none';
        document.getElementById('photo-upload').value = '';
        StateManager.state.tempPhoto = null;
        
        document.getElementById('crop-area').style.display = 'none';
        document.getElementById('upload-area').style.display = 'block';
    },

    /**
     * Add new child
     */
    addNewChild() {
        const childNum = Object.keys(StateManager.state.data).length + 1;
        const childId = 'child' + childNum;
        
        StateManager.createChild(childId);
        StateManager.state.currentChild = childId;
        
        saveData();
        this.renderChildButtons();
        this.updateChildButtons();
        if (window.UICore) {
            UICore.updateUI();
            UICore.applyColorPalette();
        }
        
        this.openProfileModal();
    },

    /**
     * Delete current child
     */
    deleteCurrentChild() {
        if (StateManager.state.children.length <= 1) {
            alert('Cannot delete the only family member! You must have at least one profile.');
            return;
        }
        
        const child = StateManager.getCurrentChild();
        
        document.getElementById('delete-child-name').textContent = `Delete "${child.name}"?`;
        document.getElementById('delete-confirm-modal').classList.add('active');
    },

    /**
     * Close delete confirm
     */
    closeDeleteConfirm() {
        document.getElementById('delete-confirm-modal').classList.remove('active');
    },

    /**
     * Confirm delete child
     */
    confirmDeleteChild() {
        const currentId = StateManager.state.currentChild;
        StateManager.deleteChild(currentId);
        
        StateManager.state.currentChild = StateManager.state.children[0];
        
        saveData();
        
        document.getElementById('delete-confirm-modal').classList.remove('active');
        this.closeModal();
        
        this.renderChildButtons();
        this.updateChildButtons();
        if (window.UICore) {
            UICore.updateUI();
            UICore.applyColorPalette();
        }
    },

    /**
     * Update child buttons
     */
    updateChildButtons() {
        this.renderChildButtons();
        
        StateManager.state.children.forEach(childId => {
            const btn = document.getElementById(childId + '-btn');
            if (btn) {
                btn.classList.toggle('btn-active', childId === StateManager.state.currentChild);
            }
        });
        
        StateManager.state.children.forEach(childId => {
            const child = StateManager.getChild(childId);
            if (!child) return;
            
            const photoContainer = document.getElementById(childId + '-photo-btn');
            const nameSpan = document.getElementById(childId + '-name-btn');
            
            if (nameSpan) {
                nameSpan.textContent = child.name;
            }
            
            if (photoContainer) {
                if (child.photo) {
                    photoContainer.innerHTML = `<img src="${child.photo}" class="profile-photo" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">`;
                } else {
                    photoContainer.innerHTML = `<div class="profile-photo-placeholder" style="width: 40px; height: 40px; font-size: 20px;">👤</div>`;
                }
            }
        });
    },

    /**
     * Render child buttons
     */
    renderChildButtons() {
        const container = document.getElementById('child-buttons-container');
        const gridClass = StateManager.state.children.length <= 2 ? 'grid-2' : 
                         StateManager.state.children.length === 3 ? 'grid-3' : 'grid-4';
        
        container.innerHTML = `
            <div class="grid ${gridClass}" style="margin-bottom: 16px;">
                ${StateManager.state.children.map(childId => {
                    const child = StateManager.getChild(childId);
                    return `
                        <button class="btn btn-secondary" id="${childId}-btn" onclick="UICore.selectChild('${childId}')" style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                            <div id="${childId}-photo-btn"></div>
                            <span id="${childId}-name-btn">${child.name}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    },

    /**
     * Render tracker list
     */
    renderTrackerList(childId) {
        const child = StateManager.getChild(childId);
        const container = document.getElementById('tracker-list-container');
        
        if (!child.trackers || child.trackers.length === 0) {
            container.innerHTML = '<p style="color: #6b7280; font-size: 14px; font-style: italic;">No trackers added yet. Click button below to add your first tracker.</p>';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 8px;">';
        child.trackers.forEach(tracker => {
            const template = window.TrackerTemplates ? TrackerTemplates.getTemplateList().find(t => t.id === tracker.templateId) : null;
            const icon = template ? template.icon : '📊';
            
            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f3f4f6; border-radius: 8px;">
                    <span style="font-weight: 500;">${icon} ${tracker.templateName}</span>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="ProfileModule.editTrackerConfig('${tracker.id}')" style="padding: 6px 12px; background: #6366f1; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer;">⚙️ Edit</button>
                        <button onclick="ProfileModule.removeTrackerPrompt('${tracker.id}')" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 13px; cursor: pointer;">×</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    /**
     * Edit tracker config
     */
    editTrackerConfig(trackerId) {
        this.closeModal();
        if (window.openSpecificTracker) {
            openSpecificTracker(trackerId);
        }
    },

    /**
     * Remove tracker prompt
     */
    removeTrackerPrompt(trackerId) {
        const child = StateManager.getCurrentChild();
        const tracker = child.trackers ? child.trackers.find(t => t.id === trackerId) : null;
        
        if (!tracker) return;
        
        if (confirm(`Remove "${tracker.templateName}" tracker?\n\nAll data for this tracker will be permanently deleted. This cannot be undone.`)) {
            // Remove the tracker from the child's trackers array
            const index = child.trackers.findIndex(t => t.id === trackerId);
            if (index > -1) {
                child.trackers.splice(index, 1);
                
                // Save changes
                if (window.saveData) {
                    window.saveData();
                }
                
                // Refresh the UI
                this.renderTrackerList(StateManager.state.currentChild);
                this.updateTrackerButtons();
            }
        }
    },

    /**
     * Update tracker buttons
     */
    updateTrackerButtons() {
        const child = StateManager.getCurrentChild();
        const container = document.getElementById('tracker-buttons-container');
        
        if (!container) return;
        
        if (!child.trackers || child.trackers.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">';
        html += '<label style="font-weight: 600; font-size: 14px; color: #374151;">Health Trackers:</label>';
        
        child.trackers.forEach(tracker => {
            const template = window.TrackerTemplates ? TrackerTemplates.getTemplateList().find(t => t.id === tracker.templateId) : null;
            const icon = template ? template.icon : '📊';
            
            html += `
                <button onclick="openSpecificTracker('${tracker.id}')" 
                        style="padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; text-align: left; transition: transform 0.2s;"
                        onmouseover="this.style.transform='translateY(-2px)'"
                        onmouseout="this.style.transform='translateY(0)'">
                    ${icon} ${tracker.templateName}
                </button>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    },

    /**
     * Close modal
     */
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        StateManager.state.modalData = null;
    }
};

// Global functions for HTML onclick handlers
function handlePhotoUpload(event) {
    ProfileModule.handlePhotoUpload(event);
}

function applyCrop() {
    ProfileModule.applyCrop();
}

function cancelCrop() {
    ProfileModule.cancelCrop();
}

function removePhoto() {
    ProfileModule.removePhoto();
}

function closeModal() {
    ProfileModule.closeModal();
}

function closeDeleteConfirm() {
    ProfileModule.closeDeleteConfirm();
}

function confirmDeleteChild() {
    ProfileModule.confirmDeleteChild();
}

// For modal task management
function addModalTask() {
    if (window.ScheduleModule) ScheduleModule.addModalTask();
}

function removeModalTask(index) {
    if (window.ScheduleModule) ScheduleModule.removeModalTask(index);
}

function saveScheduleItem() {
    if (window.ScheduleModule) ScheduleModule.saveScheduleItem();
}

function addModalCharacterItem() {
    if (window.CharacterModule) CharacterModule.addModalCharacterItem();
}

function removeModalCharacterItem(index) {
    if (window.CharacterModule) CharacterModule.removeModalCharacterItem(index);
}

function saveCharacterCategory() {
    if (window.CharacterModule) CharacterModule.saveCharacterCategory();
}

function saveChore() {
    if (window.CharacterModule) CharacterModule.saveChore();
}

function closeDeleteGoalConfirm() {
    if (window.CharacterModule) CharacterModule.closeDeleteGoalConfirm();
}

function confirmDeleteGoal() {
    if (window.CharacterModule) CharacterModule.confirmDeleteGoal();
}

function saveProfile() {
    ProfileModule.saveProfile();
}

function spendPoints() {
    if (window.PointsModule) PointsModule.spendPoints();
}

// Make module available globally
window.ProfileModule = ProfileModule;
