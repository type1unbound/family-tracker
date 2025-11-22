// ========================================
// WELLNESS TRACKER - Entry Forms
// ========================================

function openTracker(trackerId) {
    document.getElementById('wellness-tracker-selection').style.display = 'none';
    document.getElementById('wellness-tracker-entry').style.display = 'block';
    
    const child = StateManager.getCurrentChild();
    if (!child || !child.trackers) return;
    
    const tracker = child.trackers.find(t => t.id === trackerId);
    if (!tracker) return;
    
    window.currentTrackerId = trackerId;
    
    document.getElementById('tracker-title').textContent = tracker.templateName || 'Wellness Tracker';
    
    const ratingsContainer = document.querySelector('.wellness-card');
    if (!ratingsContainer) return;
    
    const config = tracker.customConfig || tracker;
    
    // Extract observer ratings
    let observerRatings = [];
    if (config.observedCategories && Array.isArray(config.observedCategories)) {
        config.observedCategories.forEach(category => {
            if (category.items && Array.isArray(category.items)) {
                category.items.forEach(item => {
                    observerRatings.push(item.label || item);
                });
            }
        });
    }
    
    // Extract self ratings
    let selfRatings = [];
    if (config.selfReportCategories && Array.isArray(config.selfReportCategories)) {
        config.selfReportCategories.forEach(category => {
            if (category.items && Array.isArray(category.items)) {
                category.items.forEach(item => {
                    selfRatings.push(item.label || item);
                });
            }
        });
    }
    
    // Build form HTML
    let html = `
        <div class="form-group">
            <label class="form-label">Date:</label>
            <input type="date" class="form-input" id="wellness-date" value="${new Date().toISOString().split('T')[0]}">
        </div>

        <div class="form-group">
            <label class="form-label">Observer Name:</label>
            <input type="text" class="form-input" id="observer-name" placeholder="Who is filling this out?">
        </div>

        <div class="form-group">
            <label class="form-label">Period/Phase:</label>
            <select class="form-input" id="wellness-phase">
                <option>📊 Baseline</option>
                <option>💊 Treatment</option>
                <option>✅ Maintenance</option>
            </select>
        </div>
    `;
    
    window.observerRatings = {};
    window.selfRatings = {};
    
    let sectionCount = 0;
    
    // Observer Ratings Section
    if (observerRatings.length > 0) {
        sectionCount++;
        
        html += `
            <div class="form-group" style="margin-top: 24px;">
                <label class="form-label">Observer Ratings</label>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 12px;">Rate observed behaviors (1=Poor, 5=Excellent)</p>
                
                <div class="wellness-ratings-container" id="observer-ratings-container">
        `;
        
        observerRatings.forEach((rating, idx) => {
            html += `
                <div class="wellness-rating-group" data-observer-rating-index="${idx}">
                    <div style="font-weight: 600; font-size: 14px; margin-bottom: 12px; color: #111827; line-height: 1.4;">${rating}</div>
                    <div style="display: flex; gap: 8px;">
                        <button class="rating-btn" onclick="selectObserverRating(${idx}, 1)">1</button>
                        <button class="rating-btn" onclick="selectObserverRating(${idx}, 2)">2</button>
                        <button class="rating-btn" onclick="selectObserverRating(${idx}, 3)">3</button>
                        <button class="rating-btn" onclick="selectObserverRating(${idx}, 4)">4</button>
                        <button class="rating-btn" onclick="selectObserverRating(${idx}, 5)">5</button>
                    </div>
                    <div style="margin-top: 8px; font-size: 11px; color: #6b7280; text-align: center;">
                        Question ${idx + 1} of ${observerRatings.length}
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="rating-indicators" id="observer-rating-indicators">
                    ${observerRatings.map((_, i) => 
                        `<div class="rating-indicator-dot ${i === 0 ? 'active' : ''}"></div>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    // Self Ratings Section
    if (selfRatings.length > 0) {
        sectionCount++;
        
        html += `
            <div class="form-group" style="margin-top: 24px;">
                <label class="form-label">Self Ratings</label>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 12px;">How do you feel? (1=Poor, 5=Excellent)</p>
                
                <div class="wellness-ratings-container" id="self-ratings-container">
        `;
        
        selfRatings.forEach((rating, idx) => {
            html += `
                <div class="wellness-rating-group" data-self-rating-index="${idx}">
                    <div style="font-weight: 600; font-size: 14px; margin-bottom: 12px; color: #111827; line-height: 1.4;">${rating}</div>
                    <div style="display: flex; gap: 8px;">
                        <button class="rating-btn" onclick="selectSelfRating(${idx}, 1)">1</button>
                        <button class="rating-btn" onclick="selectSelfRating(${idx}, 2)">2</button>
                        <button class="rating-btn" onclick="selectSelfRating(${idx}, 3)">3</button>
                        <button class="rating-btn" onclick="selectSelfRating(${idx}, 4)">4</button>
                        <button class="rating-btn" onclick="selectSelfRating(${idx}, 5)">5</button>
                    </div>
                    <div style="margin-top: 8px; font-size: 11px; color: #6b7280; text-align: center;">
                        Question ${idx + 1} of ${selfRatings.length}
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="rating-indicators" id="self-rating-indicators">
                    ${selfRatings.map((_, i) => 
                        `<div class="rating-indicator-dot ${i === 0 ? 'active' : ''}"></div>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    if (sectionCount === 0) {
        html += `
            <div style="padding: 20px; text-align: center; color: #6b7280; background: #f9fafb; border-radius: 12px; margin: 16px 0;">
                No questions configured for this tracker yet. Please configure it in the desktop app.
            </div>
        `;
    }
    
    html += `
        <div class="form-group" style="margin-top: 24px;">
            <label class="form-label">Additional Notes:</label>
            <textarea class="form-input" id="wellness-notes" placeholder="Any additional observations or notes..."></textarea>
        </div>

        <button class="save-btn" onclick="saveWellness()" id="save-wellness-btn">
            💾 Save Entry
        </button>
    `;
    
    ratingsContainer.innerHTML = html;
    
    setTimeout(() => {
        initScrollHandler('observer-ratings-container', 'observer-rating-indicators');
        initScrollHandler('self-ratings-container', 'self-rating-indicators');
    }, 100);
}

function initScrollHandler(containerId, indicatorsId) {
    const track = document.getElementById(containerId);
    if (!track) return;
    
    track.addEventListener('scroll', () => {
        const scrollLeft = track.scrollLeft;
        const firstCard = track.querySelector('.wellness-rating-group');
        if (!firstCard) return;
        
        const itemWidth = firstCard.offsetWidth + 16;
        const currentIndex = Math.round(scrollLeft / itemWidth);
        
        const indicators = document.querySelectorAll(`#${indicatorsId} .rating-indicator-dot`);
        indicators.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    });
}

function selectObserverRating(ratingIndex, value) {
    window.observerRatings[ratingIndex] = value;
    
    const ratingGroup = document.querySelector(`[data-observer-rating-index="${ratingIndex}"]`);
    if (!ratingGroup) return;
    
    ratingGroup.querySelectorAll('.rating-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', idx + 1 === value);
    });
}

function selectSelfRating(ratingIndex, value) {
    window.selfRatings[ratingIndex] = value;
    
    const ratingGroup = document.querySelector(`[data-self-rating-index="${ratingIndex}"]`);
    if (!ratingGroup) return;
    
    ratingGroup.querySelectorAll('.rating-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', idx + 1 === value);
    });
}

function saveWellness() {
    const btn = document.getElementById('save-wellness-btn');
    if (!btn || btn.disabled) return;
    
    btn.disabled = true;
    btn.classList.add('saving');
    btn.innerHTML = '<div class="btn-spinner"></div> Saving...';
    
    const date = document.getElementById('wellness-date').value;
    const observer = document.getElementById('observer-name').value;
    const phase = document.getElementById('wellness-phase').value;
    const notes = document.getElementById('wellness-notes').value;
    
    const entry = {
        date,
        observer,
        phase,
        notes,
        observerRatings: window.observerRatings || {},
        selfRatings: window.selfRatings || {},
        timestamp: Date.now()
    };
    
    const child = StateManager.getCurrentChild();
    if (child && child.trackers && window.currentTrackerId) {
        const tracker = child.trackers.find(t => t.id === window.currentTrackerId);
        if (tracker) {
            if (!tracker.entries) tracker.entries = [];
            tracker.entries.push(entry);
            
            saveDataToFirebase().then(() => {
                btn.classList.remove('saving');
                btn.classList.add('success');
                btn.innerHTML = '✓ Saved!';
                
                setTimeout(() => {
                    btn.disabled = false;
                    btn.classList.remove('success');
                    btn.innerHTML = '💾 Save Entry';
                    
                    backToTrackerList();
                }, 1500);
            }).catch(error => {
                console.error('Save failed:', error);
                btn.disabled = false;
                btn.classList.remove('saving');
                btn.innerHTML = '❌ Save Failed - Retry';
                
                setTimeout(() => {
                    btn.innerHTML = '💾 Save Entry';
                }, 2000);
            });
        }
    }
}

function backToTrackerList() {
    document.getElementById('wellness-tracker-selection').style.display = 'block';
    document.getElementById('wellness-tracker-entry').style.display = 'none';
    
    window.observerRatings = {};
    window.selfRatings = {};
    window.currentTrackerId = null;
}
