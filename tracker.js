// ========================================
// TRACKER TEMPLATES - ALL 14 HEALTH TRACKING TEMPLATES
// ========================================

const TrackerTemplates = {
    getTemplateList: function() {
        return [
            { id: 'adhd', name: 'ADHD Medication', icon: '🧠', description: 'Track attention, hyperactivity, and impulse control' },
            { id: 'physical_therapy', name: 'Physical Therapy', icon: '🦴', description: 'Track pain levels, mobility, and function' },
            { id: 'substance_use', name: 'Substance Use Disorder', icon: '🎗️', description: 'Track cravings, triggers, and recovery progress' },
            { id: 'speech_therapy', name: 'Speech Therapy', icon: '💬', description: 'Track articulation, fluency, and communication' },
            { id: 'type2_diabetes', name: 'Type 2 Diabetes', icon: '🩸', description: 'Track blood sugar, diet, and symptoms' },
            { id: 'type1_diabetes', name: 'Type 1 Diabetes', icon: '💉', description: 'Track blood sugar, insulin, and patterns' },
            { id: 'anxiety', name: 'Anxiety', icon: '😰', description: 'Track anxiety symptoms and coping strategies' },
            { id: 'depression', name: 'Depression', icon: '💙', description: 'Track mood, energy, and daily functioning' },
            { id: 'blood_pressure', name: 'High Blood Pressure', icon: '❤️', description: 'Track BP readings and lifestyle factors' },
            { id: 'weight_loss', name: 'Weight Loss', icon: '⚖️', description: 'Track weight, diet, and exercise habits' },
            { id: 'social_media', name: 'Social Media Use', icon: '📱', description: 'Track screen time and digital wellness' },
            { id: 'caffeine', name: 'Coffee/Caffeine', icon: '☕', description: 'Track intake and effects on sleep/mood' },
            { id: 'occupational_therapy', name: 'Occupational Therapy', icon: '🖐️', description: 'Track daily living skills and independence' },
            { id: 'blank', name: 'Custom Tracker', icon: '📝', description: 'Create your own tracking categories' }
        ];
    },

    getTemplate: function(templateId) {
        const template = this.templates[templateId];
        if (!template) return this.templates.blank;
        return JSON.parse(JSON.stringify(template));
    },

    templates: {
        adhd: {
            name: 'ADHD Medication Tracker',
            observerSectionTitle: 'Observer Ratings',
            selfReportSectionTitle: 'Self-Report',
            periodTypes: [
                { value: 'baseline', label: '📊 Baseline' },
                { value: 'treatment', label: '💊 Treatment' },
                { value: 'maintenance', label: '✅ Maintenance' }
            ],
            observedCategories: [
                {
                    name: 'Inattentive Symptoms',
                    items: [
                        { id: 'attention_span', label: 'Stays focused on tasks', description: 'Can complete homework/activities without constant redirection' },
                        { id: 'morning_routine', label: 'Completes morning routine', description: 'Gets up, gets ready without excessive prompting' },
                        { id: 'motivation', label: 'Shows motivation', description: 'Engages with tasks without being bored' }
                    ]
                },
                {
                    name: 'Hyperactive Symptoms',
                    items: [
                        { id: 'calm_energy', label: 'Maintains calm energy', description: 'Not constantly "on the go"' },
                        { id: 'excessive_activity', label: 'Controls activity levels', description: 'Regulates verbal and physical activity' },
                        { id: 'sleep', label: 'Falls asleep easily', description: 'Settles down at bedtime' }
                    ]
                },
                {
                    name: 'Impulsive Symptoms',
                    items: [
                        { id: 'thinks_first', label: 'Pauses before acting', description: 'Takes time to think rather than reacting' },
                        { id: 'emotional_regulation', label: 'Regulates emotions', description: 'Manages disappointment proportionally' },
                        { id: 'interrupting', label: 'Controls interrupting', description: 'Lets others finish speaking' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Self-Assessment',
                    items: [
                        { id: 'self_focus', label: 'I can focus when I try', description: 'My brain cooperates when I want to pay attention' },
                        { id: 'self_impulses', label: 'I can stop myself', description: 'I notice and can choose to stop' },
                        { id: 'self_calm', label: 'I feel calm inside', description: 'My body and mind feel peaceful' },
                        { id: 'self_mood', label: 'I manage my feelings', description: 'I handle emotions more easily' },
                        { id: 'self_friends', label: 'Getting along is easier', description: 'Fewer conflicts with friends and family' }
                    ]
                }
            ]
        },

        physical_therapy: {
            name: 'Physical Therapy Progress',
            observerSectionTitle: 'Therapist/Observer Assessment',
            selfReportSectionTitle: 'Patient Self-Report',
            periodTypes: [
                { value: 'baseline', label: 'Initial Assessment' },
                { value: 'treatment', label: 'Active Treatment' },
                { value: 'maintenance', label: 'Maintenance' }
            ],
            observedCategories: [
                {
                    name: 'Pain Management',
                    items: [
                        { id: 'pain_at_rest', label: 'Pain level at rest', description: 'Pain when not moving or active' },
                        { id: 'pain_with_activity', label: 'Pain during activity', description: 'Pain during exercises or daily activities' },
                        { id: 'pain_medication', label: 'Medication needs', description: 'Reduced need for pain medication' }
                    ]
                },
                {
                    name: 'Mobility & Function',
                    items: [
                        { id: 'range_of_motion', label: 'Range of motion', description: 'Ability to move joints through full range' },
                        { id: 'strength', label: 'Muscle strength', description: 'Strength in affected areas' },
                        { id: 'balance', label: 'Balance and stability', description: 'Steady on feet, reduced fall risk' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Personal Assessment',
                    items: [
                        { id: 'self_pain', label: 'My pain is manageable', description: 'Pain does not interfere with daily life' },
                        { id: 'self_confidence', label: 'I feel confident moving', description: 'Confident in my physical abilities' },
                        { id: 'self_independence', label: 'I can do things myself', description: 'Less dependent on others' }
                    ]
                }
            ]
        },

        anxiety: {
            name: 'Anxiety Management',
            observerSectionTitle: 'Observer Assessment',
            selfReportSectionTitle: 'Anxiety Self-Assessment',
            periodTypes: [
                { value: 'baseline', label: 'Baseline' },
                { value: 'treatment', label: 'Active Treatment' },
                { value: 'maintenance', label: 'Maintenance' }
            ],
            observedCategories: [
                {
                    name: 'Observable Behaviors',
                    items: [
                        { id: 'restlessness', label: 'Appears calm vs. restless', description: 'Sits still, not constantly fidgeting' },
                        { id: 'avoidance', label: 'Engages vs. avoids', description: 'Participates in activities' },
                        { id: 'sleep_quality', label: 'Sleeping well', description: 'Falling and staying asleep' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Anxiety Symptoms',
                    items: [
                        { id: 'feeling_nervous', label: 'Not feeling nervous/on edge', description: 'Calm, not anxious or keyed up' },
                        { id: 'stop_worrying', label: 'Can stop worrying', description: 'Can control my worrying' },
                        { id: 'worry_too_much', label: 'Not worrying excessively', description: 'Worry does not dominate thoughts' },
                        { id: 'trouble_relaxing', label: 'Can relax', description: 'Can unwind and calm down' },
                        { id: 'irritable', label: 'Not easily irritated', description: 'Mood is even' }
                    ]
                }
            ]
        },

        depression: {
            name: 'Depression Management',
            observerSectionTitle: 'Observer Assessment',
            selfReportSectionTitle: 'Mood Self-Assessment',
            periodTypes: [
                { value: 'baseline', label: 'Baseline' },
                { value: 'treatment', label: 'Active Treatment' },
                { value: 'recovery', label: 'Recovery' }
            ],
            observedCategories: [
                {
                    name: 'Observable Functioning',
                    items: [
                        { id: 'engagement', label: 'Engaged in activities', description: 'Participating in daily life' },
                        { id: 'appearance', label: 'Self-care maintained', description: 'Grooming, hygiene appropriate' },
                        { id: 'social', label: 'Socially interactive', description: 'Spending time with others' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Mood Symptoms',
                    items: [
                        { id: 'interest', label: 'Interest in activities', description: 'Enjoying things I usually enjoy' },
                        { id: 'feeling_down', label: 'Not feeling down/hopeless', description: 'Mood is positive or neutral' },
                        { id: 'sleep', label: 'Sleeping well', description: 'Not too much or too little' },
                        { id: 'energy', label: 'Having energy', description: 'Not feeling tired or fatigued' },
                        { id: 'concentration', label: 'Can concentrate', description: 'Able to focus on tasks' }
                    ]
                }
            ]
        },

        type2_diabetes: {
            name: 'Type 2 Diabetes Management',
            observerSectionTitle: 'Healthcare Provider Assessment',
            selfReportSectionTitle: 'Self-Monitoring',
            periodTypes: [
                { value: 'baseline', label: 'Uncontrolled' },
                { value: 'treatment', label: 'Active Management' },
                { value: 'controlled', label: 'Well-Controlled' }
            ],
            observedCategories: [
                {
                    name: 'Blood Sugar Control',
                    items: [
                        { id: 'fasting_glucose', label: 'Fasting glucose in range', description: '80-130 mg/dL' },
                        { id: 'post_meal_glucose', label: 'Post-meal glucose', description: '<180 mg/dL after meals' },
                        { id: 'a1c_trend', label: 'A1C trending down', description: 'Moving toward target' }
                    ]
                },
                {
                    name: 'Lifestyle Management',
                    items: [
                        { id: 'diet_adherence', label: 'Following meal plan', description: 'Eating diabetes-friendly meals' },
                        { id: 'exercise', label: 'Physical activity', description: 'Regular exercise most days' },
                        { id: 'medication_adherence', label: 'Taking medications', description: 'Consistent with prescriptions' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Daily Management',
                    items: [
                        { id: 'self_monitoring', label: 'I check my blood sugar', description: 'Monitoring as recommended' },
                        { id: 'self_diet', label: 'I make healthy food choices', description: 'Following dietary guidelines' },
                        { id: 'self_active', label: 'I stay physically active', description: 'Exercising regularly' }
                    ]
                }
            ]
        },

        weight_loss: {
            name: 'Weight Loss Progress',
            observerSectionTitle: 'Support Assessment',
            selfReportSectionTitle: 'Personal Progress',
            periodTypes: [
                { value: 'baseline', label: 'Starting Point' },
                { value: 'active', label: 'Active Loss' },
                { value: 'maintenance', label: 'Maintenance' }
            ],
            observedCategories: [
                {
                    name: 'Behaviors & Habits',
                    items: [
                        { id: 'portion_control', label: 'Appropriate portions', description: 'Reasonable serving sizes' },
                        { id: 'food_choices', label: 'Healthy food choices', description: 'Choosing nutritious foods' },
                        { id: 'activity_level', label: 'Physically active', description: 'Regular exercise and movement' }
                    ]
                },
                {
                    name: 'Progress Markers',
                    items: [
                        { id: 'weight_trend', label: 'Weight trending down', description: '1-2 lbs/week pace' },
                        { id: 'energy', label: 'Increased energy', description: 'More energy throughout day' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Daily Habits',
                    items: [
                        { id: 'self_tracking', label: 'I track my food', description: 'Logging meals and snacks' },
                        { id: 'self_exercise', label: 'I exercise regularly', description: 'Meeting activity goals' },
                        { id: 'self_water', label: 'I drink enough water', description: 'Staying hydrated' }
                    ]
                }
            ]
        },

        speech_therapy: {
            name: 'Speech Therapy Progress',
            observerSectionTitle: 'Therapist/Parent Assessment',
            selfReportSectionTitle: 'Self-Assessment',
            periodTypes: [
                { value: 'baseline', label: '📊 Initial Assessment' },
                { value: 'treatment', label: '💬 Active Therapy' },
                { value: 'maintenance', label: '✅ Maintenance' }
            ],
            observedCategories: [
                {
                    name: 'Articulation & Clarity',
                    items: [
                        { id: 'sound_production', label: 'Clear sound production', description: 'Produces target sounds correctly' },
                        { id: 'intelligibility', label: 'Speech intelligibility', description: 'Others can understand what is said' },
                        { id: 'consistency', label: 'Consistent articulation', description: 'Uses correct sounds across contexts' }
                    ]
                },
                {
                    name: 'Language & Communication',
                    items: [
                        { id: 'vocabulary', label: 'Vocabulary use', description: 'Uses age-appropriate words' },
                        { id: 'sentence_structure', label: 'Sentence formation', description: 'Puts words together grammatically' },
                        { id: 'comprehension', label: 'Understanding others', description: 'Comprehends spoken language' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Communication Confidence',
                    items: [
                        { id: 'self_understood', label: 'People understand me', description: 'Others know what I am trying to say' },
                        { id: 'self_confident', label: 'I feel confident speaking', description: 'Not worried about how I sound' },
                        { id: 'self_practice', label: 'I practice my exercises', description: 'Working on speech goals at home' }
                    ]
                }
            ]
        },

        type1_diabetes: {
            name: 'Type 1 Diabetes Management',
            observerSectionTitle: 'Healthcare Provider/Parent',
            selfReportSectionTitle: 'Self-Management',
            periodTypes: [
                { value: 'baseline', label: '📊 New Diagnosis' },
                { value: 'treatment', label: '💉 Active Management' },
                { value: 'controlled', label: '✅ Optimized' }
            ],
            observedCategories: [
                {
                    name: 'Glucose Management',
                    items: [
                        { id: 'time_in_range', label: 'Time in range (70-180)', description: 'Blood sugar in target most of time' },
                        { id: 'hypo_frequency', label: 'Avoiding low blood sugar', description: 'Infrequent hypoglycemic episodes' },
                        { id: 'hyper_frequency', label: 'Avoiding high blood sugar', description: 'Infrequent hyperglycemic episodes' }
                    ]
                },
                {
                    name: 'Treatment Adherence',
                    items: [
                        { id: 'dosing_accuracy', label: 'Accurate insulin dosing', description: 'Correct calculations for meals' },
                        { id: 'carb_counting', label: 'Carb counting skills', description: 'Accurately estimating carbs' },
                        { id: 'tech_use', label: 'Using technology', description: 'Proper use of pump/CGM' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Daily Management',
                    items: [
                        { id: 'self_checking', label: 'I check blood sugar regularly', description: 'Testing as recommended' },
                        { id: 'self_dosing', label: 'I dose insulin correctly', description: 'Confident in calculations' },
                        { id: 'self_recognizing', label: 'I recognize highs/lows', description: 'Know symptoms and treat' },
                        { id: 'self_coping', label: 'I cope well', description: 'Managing emotional burden' }
                    ]
                }
            ]
        },

        blood_pressure: {
            name: 'Blood Pressure Management',
            observerSectionTitle: 'Healthcare Provider',
            selfReportSectionTitle: 'Daily Monitoring',
            periodTypes: [
                { value: 'baseline', label: '📊 Uncontrolled' },
                { value: 'treatment', label: '❤️ Active Management' },
                { value: 'controlled', label: '✅ Controlled' }
            ],
            observedCategories: [
                {
                    name: 'BP Readings',
                    items: [
                        { id: 'systolic', label: 'Systolic in range', description: 'Top number < 130 mmHg' },
                        { id: 'diastolic', label: 'Diastolic in range', description: 'Bottom number < 80 mmHg' },
                        { id: 'consistency', label: 'Consistent readings', description: 'BP stable, not variable' }
                    ]
                },
                {
                    name: 'Lifestyle',
                    items: [
                        { id: 'diet', label: 'Low sodium diet', description: 'Following DASH or similar' },
                        { id: 'exercise', label: 'Regular exercise', description: 'Active 30+ min most days' },
                        { id: 'medication', label: 'Taking medications', description: 'Consistent with meds' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Self-Management',
                    items: [
                        { id: 'self_monitoring', label: 'I check BP regularly', description: 'Home monitoring' },
                        { id: 'self_diet', label: 'I follow dietary guidelines', description: 'Low-sodium eating' },
                        { id: 'self_active', label: 'I exercise regularly', description: 'Getting activity' },
                        { id: 'self_meds', label: 'I take medications', description: 'Not missing doses' }
                    ]
                }
            ]
        },

        social_media: {
            name: 'Social Media & Screen Time',
            observerSectionTitle: 'Observer Assessment',
            selfReportSectionTitle: 'Self-Assessment',
            periodTypes: [
                { value: 'baseline', label: '📊 Current Usage' },
                { value: 'reduction', label: '📱 Reducing' },
                { value: 'balanced', label: '✅ Balanced' }
            ],
            observedCategories: [
                {
                    name: 'Usage Patterns',
                    items: [
                        { id: 'frequency', label: 'Limited checking', description: 'Not constantly on phone' },
                        { id: 'mealtime', label: 'Present during meals', description: 'Not on phone at meals' },
                        { id: 'engagement', label: 'Engages in-person', description: 'Interacting with people' }
                    ]
                },
                {
                    name: 'Life Balance',
                    items: [
                        { id: 'activities', label: 'Other activities', description: 'Hobbies, sports, reading' },
                        { id: 'productivity', label: 'Completing tasks', description: 'School/work not suffering' },
                        { id: 'relationships', label: 'Quality time', description: 'Time with others' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Digital Wellness',
                    items: [
                        { id: 'self_time', label: 'I limit screen time', description: 'Within my goals' },
                        { id: 'self_mindless', label: 'I avoid mindless scrolling', description: 'Intentional use' },
                        { id: 'self_fomo', label: 'No FOMO', description: 'Not anxious offline' },
                        { id: 'self_mood', label: 'Positive mood', description: 'Not feeling bad' },
                        { id: 'self_control', label: 'I have control', description: 'Can put phone down' }
                    ]
                }
            ]
        },

        caffeine: {
            name: 'Caffeine Intake Tracker',
            observerSectionTitle: 'Observer Assessment',
            selfReportSectionTitle: 'Self-Monitoring',
            periodTypes: [
                { value: 'baseline', label: '📊 Current Intake' },
                { value: 'reduction', label: '☕ Reducing' },
                { value: 'maintenance', label: '✅ Optimal' }
            ],
            observedCategories: [
                {
                    name: 'Consumption',
                    items: [
                        { id: 'amount', label: 'Moderate amount', description: 'Not excessive' },
                        { id: 'timing', label: 'Appropriate timing', description: 'Not late in day' },
                        { id: 'sleep', label: 'Sleeping well', description: 'Good sleep quality' }
                    ]
                },
                {
                    name: 'Effects',
                    items: [
                        { id: 'mood', label: 'Stable mood', description: 'No crashes' },
                        { id: 'anxiety', label: 'Not jittery', description: 'Calm and steady' },
                        { id: 'energy', label: 'Natural energy', description: 'Not reliant' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Awareness',
                    items: [
                        { id: 'self_tracking', label: 'I track intake', description: 'Know how much' },
                        { id: 'self_amount', label: 'I limit consumption', description: 'Within healthy limits' },
                        { id: 'self_sleep', label: 'Sleep is good', description: 'Not interfering' },
                        { id: 'self_anxiety', label: 'Not anxious', description: 'Not jittery' }
                    ]
                }
            ]
        },

        occupational_therapy: {
            name: 'Occupational Therapy Progress',
            observerSectionTitle: 'Therapist/Caregiver',
            selfReportSectionTitle: 'Self-Assessment',
            periodTypes: [
                { value: 'baseline', label: '📊 Initial' },
                { value: 'treatment', label: '🖐️ Active Therapy' },
                { value: 'maintenance', label: '✅ Independence' }
            ],
            observedCategories: [
                {
                    name: 'Daily Living',
                    items: [
                        { id: 'dressing', label: 'Dressing', description: 'Minimal assistance' },
                        { id: 'grooming', label: 'Grooming', description: 'Personal care' },
                        { id: 'eating', label: 'Self-feeding', description: 'Uses utensils' }
                    ]
                },
                {
                    name: 'Fine Motor',
                    items: [
                        { id: 'handwriting', label: 'Writing', description: 'Legible writing' },
                        { id: 'manipulation', label: 'Object use', description: 'Buttons, zips, ties' },
                        { id: 'coordination', label: 'Coordination', description: 'Catches, throws' }
                    ]
                },
                {
                    name: 'Sensory',
                    items: [
                        { id: 'sensory', label: 'Sensory processing', description: 'Appropriate responses' },
                        { id: 'attention', label: 'Attention', description: 'Sustained focus' },
                        { id: 'transitions', label: 'Transitions', description: 'Smooth changes' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Independence',
                    items: [
                        { id: 'self_independent', label: 'I do things myself', description: 'Less reliance on others' },
                        { id: 'self_confident', label: 'I feel confident', description: 'Believe in abilities' },
                        { id: 'self_participate', label: 'I participate', description: 'Engage in activities' }
                    ]
                }
            ]
        },

        substance_use: {
            name: 'Substance Use Recovery',
            observerSectionTitle: 'Counselor/Support Person',
            selfReportSectionTitle: 'Self-Assessment',
            periodTypes: [
                { value: 'baseline', label: '📊 Beginning' },
                { value: 'active', label: '🎗️ Active Treatment' },
                { value: 'maintenance', label: '✅ Long-term' }
            ],
            observedCategories: [
                {
                    name: 'Recovery Behaviors',
                    items: [
                        { id: 'attendance', label: 'Program attendance', description: 'Attends meetings/therapy' },
                        { id: 'engagement', label: 'Engagement', description: 'Active participation' },
                        { id: 'honesty', label: 'Honest communication', description: 'Open about struggles' },
                        { id: 'relationships', label: 'Healthy relationships', description: 'Supportive connections' }
                    ]
                },
                {
                    name: 'Stability',
                    items: [
                        { id: 'stress', label: 'Manages stress', description: 'Healthy coping' },
                        { id: 'mood', label: 'Emotional stability', description: 'Stable mood' },
                        { id: 'structure', label: 'Daily structure', description: 'Routine activities' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Personal Recovery',
                    items: [
                        { id: 'cravings', label: 'Cravings manageable', description: 'Can manage cravings' },
                        { id: 'triggers', label: 'Know triggers', description: 'Recognize risk situations' },
                        { id: 'support', label: 'Use support', description: 'Reach out when needed' },
                        { id: 'confidence', label: 'Believe in recovery', description: 'Confident staying sober' }
                    ]
                }
            ]
        },

        blank: {
            name: 'Custom Tracker',
            observerSectionTitle: 'Observer Assessment',
            selfReportSectionTitle: 'Self-Assessment',
            periodTypes: [
                { value: 'baseline', label: 'Baseline' },
                { value: 'treatment', label: 'Treatment' },
                { value: 'maintenance', label: 'Maintenance' }
            ],
            observedCategories: [
                {
                    name: 'Category 1',
                    items: [
                        { id: 'item1', label: 'Question 1', description: 'Description of what to observe' },
                        { id: 'item2', label: 'Question 2', description: 'Description of what to observe' }
                    ]
                }
            ],
            selfReportCategories: [
                {
                    name: 'Self-Report',
                    items: [
                        { id: 'self1', label: 'Self-report question 1', description: 'How you feel about this' },
                        { id: 'self2', label: 'Self-report question 2', description: 'How you feel about this' }
                    ]
                }
            ]
        }
    },

    openAddTrackerModal: function() {
        const modalHtml = `
            <div id="add-tracker-modal" class="modal active">
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h2>➕ Add Health Tracker</h2>
                        <button class="close-btn" onclick="TrackerTemplates.closeAddTrackerModal()">×</button>
                    </div>
                    <div class="modal-body">
                        <p style="color: #6b7280; margin-bottom: 20px;">Choose a health tracker template for ${window.StateManager?.getCurrentChild()?.name || 'family member'}:</p>
                        <div id="tracker-template-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px;">
                            ${this.getTemplateList().map(template => `
                                <div onclick="TrackerTemplates.selectTemplate('${template.id}')" 
                                     style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                            color: white; border-radius: 12px; cursor: pointer; text-align: center;
                                            transition: transform 0.2s, box-shadow 0.2s;"
                                     onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.2)';"
                                     onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                                    <div style="font-size: 36px; margin-bottom: 8px;">${template.icon}</div>
                                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">${template.name}</div>
                                    <div style="font-size: 11px; opacity: 0.9;">${template.description}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const container = document.getElementById('modals-container') || document.body;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHtml;
        container.appendChild(tempDiv.firstElementChild);
    },

    selectTemplate: async function(templateId) {
        const template = this.getTemplate(templateId);
        const templateInfo = this.getTemplateList().find(t => t.id === templateId);
        
        if (!template || !templateInfo) {
            alert('Error: Template not found');
            return;
        }
        
        const trackerId = 'tracker_' + Date.now();
        const child = window.StateManager?.getCurrentChild();
        
        if (!child) {
            alert('Error: No child selected');
            return;
        }
        
        if (!child.trackers) {
            child.trackers = [];
        }
        
        const newTracker = {
            id: trackerId,
            templateId: templateId,
            templateName: templateInfo.name,
            icon: templateInfo.icon,
            customConfig: template,
            createdAt: Date.now()
        };
        
        child.trackers.push(newTracker);
        
        try {
            if (window.currentUser && window.db) {
                const userRef = db.collection('users').doc(currentUser.uid);
                await userRef.collection('familyMembers').doc(window.StateManager.state.currentChild).update({
                    trackers: child.trackers
                });
            }
            
            if (window.saveData) await saveData();
            if (window.ProfileModule?.updateTrackerButtons) ProfileModule.updateTrackerButtons();
            
            this.closeAddTrackerModal();
            if (window.ProfileModule?.closeModal) {
                ProfileModule.closeModal();
            }
            
            alert(`✅ ${templateInfo.name} tracker added successfully!`);
            
        } catch (error) {
            alert('Failed to save tracker: ' + error.message);
        }
    },

    closeAddTrackerModal: function() {
        const modal = document.getElementById('add-tracker-modal');
        if (modal) {
            modal.remove();
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrackerTemplates;
}

window.TrackerTemplates = TrackerTemplates;

// ========================================
// MEDICATION TRACKER MODULE
// ========================================

const MedicationTracker = {
    currentChildId: null,
    currentTrackerId: null,
    currentConfig: null,
    editingEntryIndex: null,

    init: function(childId, trackerId, config) {
        this.currentChildId = childId;
        this.currentTrackerId = trackerId;
        this.currentConfig = config || TrackerTemplates.getTemplate('blank');
        this.editingEntryIndex = null;
        console.log('MedicationTracker initialized:', { childId, trackerId, config: this.currentConfig });
    },

    renderEntryForm: function() {
        const container = document.getElementById('med-content-entry');
        if (!container) return;

        const today = new Date().toISOString().split('T')[0];
        
        let html = `
            <div style="margin-bottom: 16px;">
                <label>Date:</label>
                <input type="date" id="med-entry-date" class="edit-input" value="${today}">
            </div>
            <div style="margin-bottom: 16px;">
                <label>Observer Name:</label>
                <input type="text" id="med-observer" class="edit-input" placeholder="Who is filling this out?">
            </div>
        `;

        // Period types
        if (this.currentConfig.periodTypes && this.currentConfig.periodTypes.length > 0) {
            html += `
                <div style="margin-bottom: 16px;">
                    <label>Period/Phase:</label>
                    <select id="med-period-type" class="edit-input">
                        ${this.currentConfig.periodTypes.map(pt => `
                            <option value="${pt.value}">${pt.label}</option>
                        `).join('')}
                    </select>
                </div>
            `;
        }

        // Observer ratings
        if (this.currentConfig.observedCategories) {
            html += `<h3 style="margin-top: 24px; margin-bottom: 16px;">${this.currentConfig.observerSectionTitle || 'Observer Ratings'}</h3>`;
            
            this.currentConfig.observedCategories.forEach(category => {
                html += `
                    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                        <h4 style="margin-bottom: 12px; color: #374151;">${category.name}</h4>
                `;
                
                category.items.forEach(item => {
                    html += `
                        <div style="margin-bottom: 12px;">
                            <label style="font-weight: 600; display: block; margin-bottom: 4px;">${item.label}</label>
                            <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">${item.description}</p>
                            <div style="display: flex; gap: 8px;">
                                ${[1, 2, 3, 4, 5].map(rating => `
                                    <button type="button" class="rating-btn" data-item="${item.id}" data-rating="${rating}" 
                                            onclick="MedicationTracker.selectRating('${item.id}', ${rating})"
                                            style="flex: 1; padding: 8px; border: 2px solid #e5e7eb; border-radius: 6px; background: white; cursor: pointer; transition: all 0.2s;">
                                        ${rating}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    `;
                });
                
                html += `</div>`;
            });
        }

        // Self-report
        if (this.currentConfig.selfReportCategories) {
            html += `<h3 style="margin-top: 24px; margin-bottom: 16px;">${this.currentConfig.selfReportSectionTitle || 'Self-Report'}</h3>`;
            
            this.currentConfig.selfReportCategories.forEach(category => {
                html += `
                    <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                        <h4 style="margin-bottom: 12px; color: #374151;">${category.name}</h4>
                `;
                
                category.items.forEach(item => {
                    html += `
                        <div style="margin-bottom: 12px;">
                            <label style="font-weight: 600; display: block; margin-bottom: 4px;">${item.label}</label>
                            <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">${item.description}</p>
                            <div style="display: flex; gap: 8px;">
                                ${[1, 2, 3, 4, 5].map(rating => `
                                    <button type="button" class="rating-btn" data-item="${item.id}" data-rating="${rating}"
                                            onclick="MedicationTracker.selectRating('${item.id}', ${rating})"
                                            style="flex: 1; padding: 8px; border: 2px solid #e5e7eb; border-radius: 6px; background: white; cursor: pointer; transition: all 0.2s;">
                                        ${rating}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    `;
                });
                
                html += `</div>`;
            });
        }

        // Notes
        html += `
            <div style="margin-top: 20px; margin-bottom: 16px;">
                <label>Notes (optional):</label>
                <textarea id="med-entry-notes" class="edit-input" rows="4" placeholder="Any additional observations or notes..."></textarea>
            </div>
            <button onclick="MedicationTracker.saveEntry()" class="btn btn-primary" style="width: 100%; margin-top: 20px;">Save Entry</button>
        `;

        container.innerHTML = html;
    },

    selectRating: function(itemId, rating) {
        // Update button styles
        const buttons = document.querySelectorAll(`[data-item="${itemId}"]`);
        buttons.forEach(btn => {
            const btnRating = parseInt(btn.getAttribute('data-rating'));
            if (btnRating === rating) {
                btn.style.background = '#6366f1';
                btn.style.borderColor = '#6366f1';
                btn.style.color = 'white';
                btn.setAttribute('data-selected', 'true');
            } else {
                btn.style.background = 'white';
                btn.style.borderColor = '#e5e7eb';
                btn.style.color = '#374151';
                btn.removeAttribute('data-selected');
            }
        });
    },

    saveEntry: function() {
        const date = document.getElementById('med-entry-date').value;
        const observer = document.getElementById('med-observer').value;
        const periodType = document.getElementById('med-period-type')?.value || 'baseline';
        const notes = document.getElementById('med-entry-notes').value;

        if (!date) {
            alert('Please select a date');
            return;
        }

        // Collect all ratings
        const ratings = {};
        const selectedButtons = document.querySelectorAll('[data-selected="true"]');
        selectedButtons.forEach(btn => {
            const itemId = btn.getAttribute('data-item');
            const rating = parseInt(btn.getAttribute('data-rating'));
            ratings[itemId] = rating;
        });

        const child = window.StateManager.getChild(this.currentChildId);
        if (!child) {
            alert('Error: Child not found');
            return;
        }

        const tracker = child.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) {
            alert('Error: Tracker not found');
            return;
        }

        if (!tracker.entries) {
            tracker.entries = [];
        }

        // Check if we're editing an existing entry
        if (this.editingEntryIndex !== undefined && this.editingEntryIndex !== null) {
            // Update existing entry
            const existingEntry = tracker.entries[this.editingEntryIndex];
            tracker.entries[this.editingEntryIndex] = {
                date,
                observer,
                periodType,
                ratings,
                notes,
                timestamp: existingEntry.timestamp // Keep original timestamp
            };
            
            alert('✅ Entry updated successfully!');
            
            // Clear editing state
            this.editingEntryIndex = null;
            
        } else {
            // Create new entry
            const entry = {
                date,
                observer,
                periodType,
                ratings,
                notes,
                timestamp: Date.now()
            };
            
            tracker.entries.push(entry);
            alert('✅ Entry saved successfully!');
        }

        // Save to database
        if (window.saveData) {
            window.saveData();
        }
        
        // Clear form
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.style.background = 'white';
            btn.style.borderColor = '#e5e7eb';
            btn.style.color = '#374151';
            btn.removeAttribute('data-selected');
        });
        document.getElementById('med-observer').value = '';
        document.getElementById('med-entry-notes').value = '';
        
        // Reset date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('med-entry-date').value = today;
        
        // Reset button text
        const saveBtn = document.querySelector('#med-content-entry button[onclick*="saveEntry"]');
        if (saveBtn) {
            saveBtn.textContent = 'Save Entry';
            saveBtn.style.background = '';
        }
        
        // Update history and analytics
        this.renderHistory();
        this.renderAnalytics();
    },

    renderHistory: function() {
        const container = document.getElementById('med-history-list');
        if (!container) return;

        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        const entries = tracker?.entries || [];

        if (entries.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 40px;">No entries yet. Add your first entry in the Entry tab!</p>';
            return;
        }

        // Sort by date, newest first
        const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

        let html = '<div style="display: flex; flex-direction: column; gap: 16px;">';
        sortedEntries.forEach((entry, index) => {
            const avgRating = Object.values(entry.ratings).length > 0
                ? (Object.values(entry.ratings).reduce((a, b) => a + b, 0) / Object.values(entry.ratings).length).toFixed(1)
                : 'N/A';

            html += `
                <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <strong style="font-size: 16px;">${new Date(entry.date).toLocaleDateString()}</strong>
                        <span style="background: #6366f1; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">
                            Avg: ${avgRating}
                        </span>
                    </div>
                    ${entry.observer ? `<p style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Observer: ${entry.observer}</p>` : ''}
                    ${entry.periodType ? `<p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Phase: ${entry.periodType}</p>` : ''}
                    ${entry.notes ? `<p style="font-size: 14px; margin-top: 8px; padding: 8px; background: white; border-radius: 4px;">${entry.notes}</p>` : ''}
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <button onclick="MedicationTracker.editEntry(${index})" style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">✏️ Edit</button>
                        <button onclick="MedicationTracker.deleteEntry(${index})" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">🗑️ Delete</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    },

    editEntry: function(index) {
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        
        if (!tracker?.entries) return;
        
        // Get the sorted entries to find the correct one to edit
        const sortedEntries = [...tracker.entries].sort((a, b) => new Date(b.date) - new Date(a.date));
        const entryToEdit = sortedEntries[index];
        const originalIndex = tracker.entries.findIndex(e => e.timestamp === entryToEdit.timestamp);
        
        if (originalIndex === -1) return;
        
        // Switch to entry tab
        switchMedTab('entry');
        
        // Store the index being edited
        this.editingEntryIndex = originalIndex;
        
        // Re-render the form
        this.renderEntryForm();
        
        // Populate the form with existing data
        setTimeout(() => {
            // Set basic fields
            document.getElementById('med-entry-date').value = entryToEdit.date;
            document.getElementById('med-observer').value = entryToEdit.observer || '';
            if (document.getElementById('med-period-type')) {
                document.getElementById('med-period-type').value = entryToEdit.periodType || 'baseline';
            }
            document.getElementById('med-entry-notes').value = entryToEdit.notes || '';
            
            // Set ratings
            Object.entries(entryToEdit.ratings).forEach(([itemId, rating]) => {
                this.selectRating(itemId, rating);
            });
            
            // Update save button text
            const saveBtn = document.querySelector('#med-content-entry button[onclick*="saveEntry"]');
            if (saveBtn) {
                saveBtn.textContent = '💾 Update Entry';
                saveBtn.style.background = '#f59e0b';
            }
            
            // Scroll to top
            document.getElementById('med-content-entry').scrollTop = 0;
        }, 100);
    },

    deleteEntry: function(index) {
        if (!confirm('Are you sure you want to delete this entry?')) return;

        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        
        if (tracker?.entries) {
            // Get the sorted entries to find the correct one to delete
            const sortedEntries = [...tracker.entries].sort((a, b) => new Date(b.date) - new Date(a.date));
            const entryToDelete = sortedEntries[index];
            
            // Find and remove the entry from the original array
            const originalIndex = tracker.entries.findIndex(e => e.timestamp === entryToDelete.timestamp);
            if (originalIndex > -1) {
                tracker.entries.splice(originalIndex, 1);
                
                if (window.saveData) {
                    window.saveData();
                }
                
                this.renderHistory();
                this.renderAnalytics();
                alert('✅ Entry deleted');
            }
        }
    },

    renderAnalytics: function() {
        const container = document.getElementById('med-analytics-content');
        if (!container) return;

        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        const entries = tracker?.entries || [];

        if (entries.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 40px;">No data yet. Add entries to see analytics!</p>';
            return;
        }

        // Calculate analytics
        const totalEntries = entries.length;
        const avgOverall = entries.reduce((sum, entry) => {
            const entryAvg = Object.values(entry.ratings).length > 0
                ? Object.values(entry.ratings).reduce((a, b) => a + b, 0) / Object.values(entry.ratings).length
                : 0;
            return sum + entryAvg;
        }, 0) / totalEntries;

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px;">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Total Entries</div>
                    <div style="font-size: 32px; font-weight: bold;">${totalEntries}</div>
                </div>
                <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 12px;">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Average Rating</div>
                    <div style="font-size: 32px; font-weight: bold;">${avgOverall.toFixed(1)}</div>
                </div>
            </div>
            <p style="text-align: center; color: #6b7280; margin-top: 40px;">📊 More detailed analytics coming soon!</p>
        `;
    },

    renderSettings: function() {
        const container = document.getElementById('med-settings-content');
        if (!container) return;

        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        
        if (!tracker || !tracker.customConfig) {
            container.innerHTML = '<p>Error: Tracker configuration not found</p>';
            return;
        }

        const config = tracker.customConfig;

        container.innerHTML = `
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
                <h3 style="margin-bottom: 16px;">Tracker Settings</h3>
                
                <!-- Tracker Name -->
                <div style="margin-bottom: 20px;">
                    <label style="font-weight: 600; display: block; margin-bottom: 8px;">Tracker Name:</label>
                    <input type="text" id="tracker-name" value="${config.name}" class="edit-input" placeholder="Tracker name">
                </div>

                <!-- Observer Section Title -->
                <div style="margin-bottom: 20px;">
                    <label style="font-weight: 600; display: block; margin-bottom: 8px;">Observer Section Title:</label>
                    <input type="text" id="observer-title" value="${config.observerSectionTitle}" class="edit-input" placeholder="e.g., Observer Ratings">
                </div>

                <!-- Self-Report Section Title -->
                <div style="margin-bottom: 20px;">
                    <label style="font-weight: 600; display: block; margin-bottom: 8px;">Self-Report Section Title:</label>
                    <input type="text" id="self-report-title" value="${config.selfReportSectionTitle}" class="edit-input" placeholder="e.g., Self-Report">
                </div>

                <!-- Period Types -->
                <div style="margin-bottom: 20px;">
                    <h4 style="margin-bottom: 12px;">Period/Phase Types:</h4>
                    <div id="period-types-list">
                        ${config.periodTypes.map((pt, idx) => `
                            <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                                <input type="text" value="${pt.value}" class="edit-input" style="flex: 1;" placeholder="Value" data-period-idx="${idx}" data-period-field="value">
                                <input type="text" value="${pt.label}" class="edit-input" style="flex: 2;" placeholder="Label" data-period-idx="${idx}" data-period-field="label">
                                <button onclick="MedicationTracker.removePeriodType(${idx})" class="edit-btn delete">🗑️</button>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="MedicationTracker.addPeriodType()" class="add-item-btn" style="margin-top: 8px;">+ Add Period Type</button>
                </div>

                <!-- Observer Categories -->
                <div style="margin-bottom: 20px;">
                    <h4 style="margin-bottom: 12px;">Observer Categories & Questions:</h4>
                    <div id="observer-categories-list">
                        ${config.observedCategories.map((cat, catIdx) => `
                            <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #e5e7eb;">
                                <div style="display: flex; gap: 8px; margin-bottom: 12px; align-items: center;">
                                    <input type="text" value="${cat.name}" class="edit-input" style="flex: 1; font-weight: 600;" placeholder="Category name" onchange="MedicationTracker.updateObservedCategoryName(${catIdx}, this.value)">
                                    <button onclick="MedicationTracker.removeObservedCategory(${catIdx})" class="edit-btn delete">🗑️</button>
                                </div>
                                ${cat.items.map((item, itemIdx) => `
                                    <div style="background: #f9fafb; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
                                        <input type="text" value="${item.label}" class="edit-input" placeholder="Question" style="margin-bottom: 4px; font-weight: 500;" onchange="MedicationTracker.updateObservedItem(${catIdx}, ${itemIdx}, 'label', this.value)">
                                        <input type="text" value="${item.description}" class="edit-input" placeholder="Description" style="font-size: 12px;" onchange="MedicationTracker.updateObservedItem(${catIdx}, ${itemIdx}, 'description', this.value)">
                                        <button onclick="MedicationTracker.removeObservedItem(${catIdx}, ${itemIdx})" class="edit-btn delete" style="margin-top: 4px; font-size: 11px;">Remove Question</button>
                                    </div>
                                `).join('')}
                                <button onclick="MedicationTracker.addObservedItem(${catIdx})" class="add-item-btn" style="font-size: 12px; width: 100%;">+ Add Question</button>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="MedicationTracker.addObservedCategory()" class="add-item-btn" style="margin-top: 8px;">+ Add Observer Category</button>
                </div>

                <!-- Self-Report Categories -->
                <div style="margin-bottom: 20px;">
                    <h4 style="margin-bottom: 12px;">Self-Report Categories & Questions:</h4>
                    <div id="self-report-categories-list">
                        ${config.selfReportCategories.map((cat, catIdx) => `
                            <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #e5e7eb;">
                                <div style="display: flex; gap: 8px; margin-bottom: 12px; align-items: center;">
                                    <input type="text" value="${cat.name}" class="edit-input" style="flex: 1; font-weight: 600;" placeholder="Category name" onchange="MedicationTracker.updateSelfReportCategoryName(${catIdx}, this.value)">
                                    <button onclick="MedicationTracker.removeSelfReportCategory(${catIdx})" class="edit-btn delete">🗑️</button>
                                </div>
                                ${cat.items.map((item, itemIdx) => `
                                    <div style="background: #f0f9ff; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
                                        <input type="text" value="${item.label}" class="edit-input" placeholder="Question" style="margin-bottom: 4px; font-weight: 500;" onchange="MedicationTracker.updateSelfReportItem(${catIdx}, ${itemIdx}, 'label', this.value)">
                                        <input type="text" value="${item.description}" class="edit-input" placeholder="Description" style="font-size: 12px;" onchange="MedicationTracker.updateSelfReportItem(${catIdx}, ${itemIdx}, 'description', this.value)">
                                        <button onclick="MedicationTracker.removeSelfReportItem(${catIdx}, ${itemIdx})" class="edit-btn delete" style="margin-top: 4px; font-size: 11px;">Remove Question</button>
                                    </div>
                                `).join('')}
                                <button onclick="MedicationTracker.addSelfReportItem(${catIdx})" class="add-item-btn" style="font-size: 12px; width: 100%;">+ Add Question</button>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="MedicationTracker.addSelfReportCategory()" class="add-item-btn" style="margin-top: 8px;">+ Add Self-Report Category</button>
                </div>

 <!-- Save Button -->
                <button onclick="MedicationTracker.saveSettings()" class="btn btn-primary" style="width: 100%; margin-bottom: 12px;">💾 Save Changes</button>
                
                <!-- Export/Delete -->
                <button onclick="MedicationTracker.exportData()" class="btn btn-secondary" style="margin-bottom: 8px; width: 100%;">📥 Export Data (CSV)</button>
                <button onclick="MedicationTracker.deleteAllData()" class="btn" style="background: #ef4444; color: white; width: 100%;">🗑️ Delete All Data</button>
            </div>
        `;
    },

    // Helper functions for settings editing
    addPeriodType: function() {
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        tracker.customConfig.periodTypes.push({ value: 'new', label: 'New Period' });
        this.renderSettings();
    },

    removePeriodType: function(idx) {
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        tracker.customConfig.periodTypes.splice(idx, 1);
        this.renderSettings();
    },

    addObservedCategory: function() {
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        tracker.customConfig.observedCategories.push({
            name: 'New Category',
            items: [{ id: 'new_' + Date.now(), label: 'New question', description: 'Description' }]
        });
        this.renderSettings();
    },

    removeObservedCategory: function(catIdx) {
        if (!confirm('Remove this entire category?')) return;
        
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        tracker.customConfig.observedCategories.splice(catIdx, 1);
        this.renderSettings();
    },

    addObservedItem: function(catIdx) {
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        tracker.customConfig.observedCategories[catIdx].items.push({
            id: 'item_' + Date.now(),
            label: 'New question',
            description: 'Description'
        });
        this.renderSettings();
    },

    removeObservedItem: function(catIdx, itemIdx) {
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        tracker.customConfig.observedCategories[catIdx].items.splice(itemIdx, 1);
        this.renderSettings();
    },

    updateObservedCategoryName: function(catIdx, value) {
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        tracker.customConfig.observedCategories[catIdx].name = value;
    },

    updateObservedItem: function(catIdx, itemIdx, field, value) {
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        tracker.customConfig.observedCategories[catIdx].items[itemIdx][field] = value;
    },

    addSelfReportCategory: function() {
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        tracker.customConfig.selfReportCategories.push({
            name: 'New Category',
            items: [{ id: 'new_' + Date.now(), label: 'New question', description: 'Description' }]
        });
        this.renderSettings();
    },

    removeSelfReportCategory: function(catIdx) {
        if (!confirm('Remove this entire category?')) return;
        
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        tracker.customConfig.selfReportCategories.splice(catIdx, 1);
        this.renderSettings();
    },

    addSelfReportItem: function(catIdx) {
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        tracker.customConfig.selfReportCategories[catIdx].items.push({
            id: 'item_' + Date.now(),
            label: 'New question',
            description: 'Description'
        });
        this.renderSettings();
    },

    removeSelfReportItem: function(catIdx, itemIdx) {
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        tracker.customConfig.selfReportCategories[catIdx].items.splice(itemIdx, 1);
        this.renderSettings();
    },

    updateSelfReportCategoryName: function(catIdx, value) {
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        tracker.customConfig.selfReportCategories[catIdx].name = value;
    },

    updateSelfReportItem: function(catIdx, itemIdx, field, value) {
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        tracker.customConfig.selfReportCategories[catIdx].items[itemIdx][field] = value;
    },

    saveSettings: function() {
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        if (!tracker) return;
        
        // Update basic settings
        const name = document.getElementById('tracker-name')?.value;
        const observerTitle = document.getElementById('observer-title')?.value;
        const selfReportTitle = document.getElementById('self-report-title')?.value;
        
        if (name) tracker.customConfig.name = name;
        if (observerTitle) tracker.customConfig.observerSectionTitle = observerTitle;
        if (selfReportTitle) tracker.customConfig.selfReportSectionTitle = selfReportTitle;
        
        // Update period types
        const periodInputs = document.querySelectorAll('[data-period-idx]');
        periodInputs.forEach(input => {
            const idx = parseInt(input.getAttribute('data-period-idx'));
            const field = input.getAttribute('data-period-field');
            if (tracker.customConfig.periodTypes[idx]) {
                tracker.customConfig.periodTypes[idx][field] = input.value;
            }
        });
        
        // Save to database
        if (window.saveData) {
            window.saveData();
        }
        
        alert('✅ Settings saved successfully!');
        
        // Re-render entry form with new config
        this.renderEntryForm();
    },

    exportData: function() {
        // TODO: Implement CSV export
        alert('Export feature coming soon!');
    },

    deleteAllData: function() {
        if (!confirm('Delete ALL entries for this tracker? This cannot be undone!')) return;
        
        const child = window.StateManager.getChild(this.currentChildId);
        const tracker = child?.trackers?.find(t => t.id === this.currentTrackerId);
        
        if (tracker) {
            tracker.entries = [];
            
            if (window.saveData) {
                window.saveData();
            }
            
            this.renderHistory();
            this.renderAnalytics();
            alert('✅ All data deleted');
        }
    }
};

// Export to window
window.MedicationTracker = MedicationTracker;

// ========================================
// GLOBAL HELPER FUNCTIONS FOR TRACKER
// ========================================

function switchMedTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tracker-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Update content
    document.querySelectorAll('.tracker-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const targetContent = document.getElementById(`tracker-${tabName}-content`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Render appropriate content
    if (tabName === 'history') {
        MedicationTracker.renderHistory();
    } else if (tabName === 'analytics') {
        MedicationTracker.renderAnalytics();
    } else if (tabName === 'settings') {
        MedicationTracker.renderSettings();
    }
}

function closeMedTrackerModal() {
    const modal = document.getElementById('med-tracker-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Auto-refresh focused schedule item every 1.5 minutes
setInterval(() => {
    if (window.ScheduleModule && window.StateManager) {
        ScheduleModule.renderFocusedScheduleItem();
    }
}, 90000); // Update every 60 seconds                
