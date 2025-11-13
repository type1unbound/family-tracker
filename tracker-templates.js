// ========================================
// TRACKER TEMPLATES - ALL 14 HEALTH TRACKING TEMPLATES
// ========================================

const TrackerTemplates = {
    // Get list of all available templates
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

    // Get template by ID
    getTemplate: function(templateId) {
        const template = this.templates[templateId];
        if (!template) return this.templates.blank;
        // Return deep copy
        return JSON.parse(JSON.stringify(template));
    },

    // All template definitions
    templates: {
        // ========================================
        // 1. ADHD MEDICATION TRACKER
        // ========================================
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

        // ========================================
        // 2. PHYSICAL THERAPY
        // ========================================
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

        // ========================================
        // 3. SUBSTANCE USE DISORDER
        // ========================================
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

        // ========================================
        // 4. SPEECH THERAPY
        // ========================================
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

        // ========================================
        // 5. TYPE 2 DIABETES
        // ========================================
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

        // ========================================
        // 6. TYPE 1 DIABETES
        // ========================================
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

        // ========================================
        // 7. ANXIETY (GAD-7 inspired)
        // ========================================
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

        // ========================================
        // 8. DEPRESSION (PHQ-9 inspired)
        // ========================================
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

        // ========================================
        // 9. HIGH BLOOD PRESSURE
        // ========================================
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

        // ========================================
        // 10. WEIGHT LOSS
        // ========================================
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

        // ========================================
        // 11. SOCIAL MEDIA USE
        // ========================================
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

        // ========================================
        // 12. CAFFEINE/COFFEE
        // ========================================
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

        // ========================================
        // 13. OCCUPATIONAL THERAPY
        // ========================================
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

        // ========================================
        // 14. BLANK/CUSTOM TRACKER
        // ========================================
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
    }
};



    // Open modal to add a new tracker
    openAddTrackerModal: function() {
        console.log('📋 Opening add tracker modal...');
        
        // Create modal HTML
        const modalHtml = `
            <div id="add-tracker-modal" class="modal active">
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h2>➕ Add Health Tracker</h2>
                        <button class="close-btn" onclick="TrackerTemplates.closeAddTrackerModal()">×</button>
                    </div>
                    <div class="modal-body">
                        <p style="color: #6b7280; margin-bottom: 20px;">Choose a health tracker template for ${state.data[state.currentChild].name}:</p>
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
        
        // Add to page
        const container = document.getElementById('modals-container') || document.body;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHtml;
        container.appendChild(tempDiv.firstElementChild);
    },
    
    // Select a template and add tracker
    selectTemplate: async function(templateId) {
        console.log('✅ Selected template:', templateId);
        
        const template = this.getTemplate(templateId);
        const templateInfo = this.getTemplateList().find(t => t.id === templateId);
        
        if (!template || !templateInfo) {
            alert('Error: Template not found');
            return;
        }
        
        // Create new tracker
        const trackerId = 'tracker_' + Date.now();
        const child = state.data[state.currentChild];
        
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
        
        // Save to Firestore
        try {
            if (window.currentUser && window.db) {
                const userRef = db.collection('users').doc(currentUser.uid);
                await userRef.collection('familyMembers').doc(state.currentChild).update({
                    trackers: child.trackers
                });
                console.log('✅ Tracker saved to Firestore');
            }
            
            // Update UI
            if (window.saveData) await saveData();
            if (window.updateTrackerButtons) updateTrackerButtons();
            
            // Close modals
            this.closeAddTrackerModal();
            if (window.ProfileModule && ProfileModule.closeModal) {
                ProfileModule.closeModal();
            }
            
            alert(`✅ ${templateInfo.name} tracker added successfully!`);
            
        } catch (error) {
            console.error('Error saving tracker:', error);
            alert('Failed to save tracker: ' + error.message);
        }
    },
    
    // Close add tracker modal
    closeAddTrackerModal: function() {
        const modal = document.getElementById('add-tracker-modal');
        if (modal) {
            modal.remove();
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrackerTemplates;
}

// Always export for browser
window.TrackerTemplates = TrackerTemplates;

console.log('✅ TrackerTemplates exported globally');


