const OnboardingWithPointEconomy = () => {
  const [step, setStep] = React.useState(0);
  const [familyValues, setFamilyValues] = React.useState([
    { id: 1, name: 'Kindness', selected: false },
    { id: 2, name: 'Responsibility', selected: false },
    { id: 3, name: 'Courage', selected: false },
    { id: 4, name: 'Honesty', selected: false },
    { id: 5, name: 'Respect', selected: false },
    { id: 6, name: 'Perseverance', selected: false },
    { id: 7, name: 'Gratitude', selected: false },
    { id: 8, name: 'Creativity', selected: false },
    { id: 9, name: 'Independence', selected: false },
    { id: 10, name: 'Compassion', selected: false }
  ]);
  const [orderedValues, setOrderedValues] = React.useState([]);
  const [familyMembers, setFamilyMembers] = React.useState([]);
  const [currentMember, setCurrentMember] = React.useState({ name: '', age: '', role: 'child' });
  const [questionnaires, setQuestionnaires] = React.useState({});
  const [currentMemberIndex, setCurrentMemberIndex] = React.useState(0);
  const [generatedData, setGeneratedData] = React.useState(null);
  const [motivationInsights, setMotivationInsights] = React.useState(null);
  const [pointEconomy, setPointEconomy] = React.useState({});
  const [customizedRewards, setCustomizedRewards] = React.useState({});
  const [customizedTasks, setCustomizedTasks] = React.useState({});
  const [recurringEvents, setRecurringEvents] = React.useState({});

  // SVG Icons - Professional & Consistent
  const Icons = {
    Heart: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    ),
    Users: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    Sparkles: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6"></path>
      </svg>
    ),
    Check: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    ),
    ArrowRight: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    ),
    ArrowLeft: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    ),
    Target: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    ),
    ChevronUp: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    ),
    ChevronDown: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    ),
    Plus: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    ),
    X: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    )
  };

  // Get rewards based on motivation style and age/role
  const getRewardsByMotivation = (motivationStyle, isAdult, age) => {
    const rewards = {
      'Rewards and incentives': {
        child: [
          { name: '15 minutes extra screen time', points: 15, category: 'digital' },
          { name: '30 minutes extra screen time', points: 30, category: 'digital' },
          { name: 'Choose family movie', points: 20, category: 'privilege' },
          { name: 'Stay up 15 minutes late', points: 25, category: 'privilege' },
          { name: 'Stay up 30 minutes late', points: 40, category: 'privilege' },
          { name: 'Special dessert', points: 20, category: 'treat' },
          { name: 'Pick dinner menu for family', points: 30, category: 'privilege' },
          { name: 'Skip one chore this week', points: 35, category: 'privilege' },
          { name: 'Friend sleepover', points: 60, category: 'social' },
          { name: 'Go to favorite restaurant', points: 75, category: 'experience' },
          { name: 'New book', points: 50, category: 'item' },
          { name: 'Small toy or game (up to $15)', points: 80, category: 'item' },
          { name: 'Special outing (park, ice cream, etc)', points: 100, category: 'experience' },
          { name: 'Bigger toy or game (up to $30)', points: 150, category: 'item' },
        ],
        adult: [
          { name: 'Guilt-free Netflix binge (2 hours)', points: 30, category: 'digital' },
          { name: 'Sleep in on weekend', points: 40, category: 'privilege' },
          { name: 'Choose date night activity', points: 50, category: 'privilege' },
          { name: 'Special coffee/tea treat', points: 20, category: 'treat' },
          { name: 'Skip one household task', points: 35, category: 'privilege' },
          { name: 'Solo time (2 hours)', points: 60, category: 'experience' },
          { name: 'New book or audiobook', points: 50, category: 'item' },
          { name: 'Personal hobby supplies (up to $25)', points: 100, category: 'item' },
          { name: 'Spa treatment or massage', points: 150, category: 'experience' },
          { name: 'Weekend getaway', points: 300, category: 'experience' }
        ]
      },
      'Praise and recognition': {
        child: [
          { name: 'Special shout-out at family dinner', points: 20, category: 'recognition' },
          { name: 'Photo on family achievement board', points: 25, category: 'recognition' },
          { name: 'Call grandparent to share achievement', points: 30, category: 'recognition' },
          { name: 'Lead family activity', points: 35, category: 'leadership' },
          { name: 'Choose family game night game', points: 20, category: 'privilege' },
          { name: 'One-on-one time with parent (1 hour)', points: 60, category: 'quality-time' },
          { name: 'Pick family weekend activity', points: 50, category: 'privilege' },
          { name: 'Family meeting highlighting your wins', points: 40, category: 'recognition' },
          { name: 'Teach sibling/family a skill you learned', points: 45, category: 'leadership' },
          { name: 'Special family celebration in your honor', points: 80, category: 'recognition' },
          { name: 'Extended one-on-one outing with parent', points: 100, category: 'quality-time' },
          { name: 'Family creates "Hall of Fame" moment', points: 100, category: 'recognition' }
        ],
        adult: [
          { name: 'Partner appreciation note', points: 20, category: 'recognition' },
          { name: 'Family acknowledgment at dinner', points: 25, category: 'recognition' },
          { name: 'Date night focused on you', points: 80, category: 'quality-time' },
          { name: 'Day off from cooking/cleaning', points: 50, category: 'privilege' },
          { name: 'Plan next family vacation', points: 40, category: 'leadership' },
          { name: 'Lead family devotional/meeting', points: 30, category: 'leadership' },
          { name: 'Special couples time (2 hours)', points: 70, category: 'quality-time' },
          { name: 'Personal celebration dinner', points: 100, category: 'recognition' }
        ]
      },
      'Personal achievement': {
        child: [
          { name: 'Add skill badge to achievement chart', points: 25, category: 'tracking' },
          { name: 'Level up in responsibility category', points: 40, category: 'advancement' },
          { name: 'Unlock new privilege', points: 50, category: 'advancement' },
          { name: 'Start new learning project', points: 60, category: 'growth' },
          { name: 'Earn "Expert" status in area', points: 80, category: 'tracking' },
          { name: 'Add to personal portfolio', points: 30, category: 'tracking' },
          { name: 'Set and track new personal goal', points: 35, category: 'growth' },
          { name: 'Get increased autonomy in schedule', points: 70, category: 'advancement' },
          { name: 'Take on leadership role', points: 75, category: 'advancement' },
          { name: 'Master new skill or hobby', points: 100, category: 'growth' }
        ],
        adult: [
          { name: 'Start new personal development course', points: 60, category: 'growth' },
          { name: 'Add milestone to achievement tracker', points: 30, category: 'tracking' },
          { name: 'Advance in personal goal category', points: 50, category: 'advancement' },
          { name: 'Begin new fitness challenge', points: 70, category: 'growth' },
          { name: 'Level up in habit consistency', points: 45, category: 'tracking' },
          { name: 'Invest in professional development', points: 100, category: 'growth' },
          { name: 'Complete personal project', points: 80, category: 'advancement' },
          { name: 'Master new skill', points: 120, category: 'growth' }
        ]
      },
      'Helping others': {
        child: [
          { name: 'Lead family service project', points: 60, category: 'service' },
          { name: 'Teach younger sibling', points: 30, category: 'relationship' },
          { name: 'Plan family kindness activity', points: 40, category: 'service' },
          { name: 'Extra one-on-one time with sibling', points: 35, category: 'relationship' },
          { name: 'Help plan family dinner', points: 25, category: 'family-time' },
          { name: 'Organize family game night', points: 30, category: 'family-time' },
          { name: 'Create care package for neighbor', points: 50, category: 'service' },
          { name: 'Family volunteers together', points: 80, category: 'service' },
          { name: 'Host friend for kindness project', points: 70, category: 'hospitality' },
          { name: 'Extended time serving others', points: 100, category: 'service' }
        ],
        adult: [
          { name: 'Lead family service project', points: 60, category: 'service' },
          { name: 'Extra focused time with each child', points: 80, category: 'family-time' },
          { name: 'Plan date focused on spouse', points: 70, category: 'relationship' },
          { name: 'Organize family giving project', points: 50, category: 'service' },
          { name: 'Host gathering to bless others', points: 90, category: 'hospitality' },
          { name: 'Mentor someone in your field', points: 100, category: 'service' },
          { name: 'Community volunteer day', points: 75, category: 'service' },
          { name: 'Extended family bonding time', points: 85, category: 'family-time' }
        ]
      }
    };

    const roleKey = isAdult ? 'adult' : 'child';
    return rewards[motivationStyle]?.[roleKey] || rewards['Rewards and incentives'][roleKey];
  };

  const calculatePointValues = (isAdult, age) => {
    if (isAdult) {
      return { routineItem: 3, responsibility: 5, dailyGoal: 8, weeklyGoal: 15 };
    }
    if (age <= 7) {
      return { routineItem: 1, responsibility: 2, dailyGoal: 5, weeklyGoal: 5 };
    } else if (age <= 11) {
      return { routineItem: 2, responsibility: 3, dailyGoal: 8, weeklyGoal: 8 };
    } else {
      return { routineItem: 3, responsibility: 5, dailyGoal: 12, weeklyGoal: 12 };
    }
  };

  const calculateWeeklyPoints = (routineItems, responsibilities, goals, pointValues) => {
    const dailyRoutinePoints = routineItems.length * pointValues.routineItem * 7;
    const weeklyRespPoints = responsibilities.length * pointValues.responsibility;
    const goalPoints = goals.reduce((sum, goal) => {
      return sum + (goal.frequency === 'daily' ? pointValues.dailyGoal * 7 : pointValues.weeklyGoal);
    }, 0);
    return dailyRoutinePoints + weeklyRespPoints + goalPoints;
  };

  // ENHANCED: Full-day routine questions for children
  const getQuestionsForChild = (childAge, answers = {}) => {
    const questions = [];
    
    // === SCHEDULE QUESTIONS ===
    questions.push({
      id: 'wake_time',
      question: 'What time do they typically wake up?',
      type: 'time',
      placeholder: '7:00'
    });
    
    if (childAge >= 5) {
      questions.push({
        id: 'school_start',
        question: 'What time does school start?',
        type: 'time',
        placeholder: '8:00'
      });
      
      questions.push({
        id: 'school_end',
        question: 'What time does school end?',
        type: 'time',
        placeholder: '3:00'
      });
    }
    
    if (childAge >= 6) {
      questions.push({
        id: 'homework_time',
        question: 'When do they typically do homework?',
        type: 'time',
        placeholder: '4:00'
      });
    }
    
    questions.push({
      id: 'dinner_time',
      question: 'What time is dinner?',
      type: 'time',
      placeholder: '6:00'
    });
    
    questions.push({
      id: 'bedtime',
      question: 'What is their bedtime?',
      type: 'time',
      placeholder: '8:30'
    });
    
    // === RECURRING EVENTS ===
    questions.push({
      id: 'recurring_events',
      question: 'Do they have regular activities? (sports, clubs, church, etc.)',
      type: 'recurring',
      placeholder: 'Add activities with day and time'
    });
    
    // === MOTIVATION QUESTIONS ===
    questions.push({
      id: 'self_management',
      question: 'How would you describe their current self-management?',
      options: ['Needs help with most tasks', 'Can do basics with reminders', 'Handles daily tasks independently', 'Self-directed and proactive']
    });
    
    questions.push({
      id: 'morning_routine',
      question: 'Describe their morning routine independence:',
      options: ['Needs full guidance', 'Needs frequent reminders', 'Occasional reminders', 'Fully independent']
    });
    
    questions.push({
      id: 'focus_area',
      question: 'What area is most important to develop right now?',
      options: ['Academic habits', 'Physical health', 'Emotional regulation', 'Spiritual/character growth', 'Life skills', 'Social development']
    });
    
    questions.push({
      id: 'excitement_trigger',
      question: 'What gets them most excited about trying something new?',
      options: ['Earning something they want', 'Being told they did a good job', 'The challenge itself', 'Helping or being with others']
    });
    
    questions.push({
      id: 'accomplishment_response',
      question: 'After accomplishing something, what do they talk about or seek?',
      options: ['What they earned or won', 'Recognition and praise', 'What they learned or achieved', 'How it helped someone']
    });
    
    questions.push({
      id: 'task_completion',
      question: 'What helps them stick with tasks they find difficult?',
      options: ['Knowing a reward is coming', 'Regular encouragement', 'Their own goals', 'Working with others']
    });
    
    return questions;
  };

  // ENHANCED: Full schedule questions for adults
  const getQuestionsForAdult = (answers = {}) => {
    const questions = [];
    
    // === SCHEDULE QUESTIONS ===
    questions.push({
      id: 'wake_time',
      question: 'What time do you typically wake up?',
      type: 'time',
      placeholder: '6:00'
    });
    
    questions.push({
      id: 'work_start',
      question: 'What time does your workday start?',
      type: 'time',
      placeholder: '8:00'
    });
    
    questions.push({
      id: 'work_end',
      question: 'What time does your workday end?',
      type: 'time',
      placeholder: '5:00'
    });
    
    questions.push({
      id: 'dinner_time',
      question: 'What time is dinner?',
      type: 'time',
      placeholder: '6:00'
    });
    
    questions.push({
      id: 'bedtime',
      question: 'What is your target bedtime?',
      type: 'time',
      placeholder: '10:00'
    });
    
    // === RECURRING EVENTS ===
    questions.push({
      id: 'recurring_events',
      question: 'Do you have regular commitments? (gym, church, meetings, etc.)',
      type: 'recurring',
      placeholder: 'Add activities with day and time'
    });
    
    // === MOTIVATION QUESTIONS ===
    questions.push({
      id: 'life_balance',
      question: 'How would you describe your current work-life balance?',
      options: ['Overwhelmed and stressed', 'Managing but stretched', 'Generally balanced', 'Thriving and energized']
    });
    
    questions.push({
      id: 'adult_focus_area',
      question: 'What area of personal growth is most important right now?',
      options: ['Physical health & fitness', 'Emotional/mental wellness', 'Spiritual development', 'Professional/career', 'Relationships', 'Personal skills']
    });
    
    questions.push({
      id: 'adult_excitement_trigger',
      question: 'What motivates you most to take on new challenges?',
      options: ['Tangible rewards or benefits', 'Recognition and affirmation', 'Personal growth and mastery', 'Impact on others']
    });
    
    questions.push({
      id: 'adult_accomplishment',
      question: 'When you complete a goal, what matters most to you?',
      options: ['The reward or outcome', 'Acknowledgment from others', 'Sense of achievement', 'How it served others']
    });
    
    questions.push({
      id: 'adult_persistence',
      question: 'What keeps you committed when things get tough?',
      options: ['End benefits or payoff', 'Support and encouragement', 'Personal standards', 'Commitment to others']
    });
    
    return questions;
  };

  // NEW: Generate categorical goals based on age
  const generateCategoricalGoals = (age, isAdult, answers, values) => {
    if (isAdult) {
      return [
        {
          id: 'emotional_leadership',
          category: 'Emotional Leadership',
          weight: 0.25,
          items: [
            'Model emotional regulation for children',
            'Process stress in healthy ways',
            'Respond rather than react to challenges'
          ]
        },
        {
          id: 'family_connection',
          category: 'Family Connection',
          weight: 0.3,
          items: [
            'Daily meaningful conversation with spouse',
            'Individual time with each child',
            'Lead family activities'
          ]
        },
        {
          id: 'personal_development',
          category: 'Personal Development',
          weight: 0.2,
          items: [
            'Consistent morning routine',
            'Regular exercise or movement'
          ]
        },
        {
          id: 'health_wellness',
          category: 'Health & Wellness',
          weight: 0.25,
          items: [
            'Prioritize adequate sleep',
            'Make healthy meal choices',
            'Manage stress proactively'
          ]
        }
      ];
    } else if (age <= 7) {
      // Ages 0-7: 2 categories
      return [
        {
          id: 'emotional_regulation',
          category: 'Emotional Regulation',
          weight: 0.6,
          items: [
            'Use words when upset',
            'Take deep breaths when frustrated',
            'Ask for help calmly'
          ]
        },
        {
          id: 'daily_responsibilities',
          category: 'Daily Responsibilities',
          weight: 0.4,
          items: [
            'Put toys away after playing',
            'Help set the table'
          ]
        }
      ];
    } else if (age <= 11) {
      // Ages 8-11: 3 categories
      return [
        {
          id: 'emotional_regulation',
          category: 'Emotional Regulation',
          weight: 0.35,
          items: [
            'Pause before reacting when upset',
            'Apologize when wrong',
            'Talk through problems calmly'
          ]
        },
        {
          id: 'responsibility_independence',
          category: 'Responsibility & Independence',
          weight: 0.35,
          items: [
            'Complete homework without reminders',
            'Manage morning routine independently',
            'Keep room organized'
          ]
        },
        {
          id: 'social_skills',
          category: 'Social Skills',
          weight: 0.3,
          items: [
            'Include others in activities',
            'Listen when others speak'
          ]
        }
      ];
    } else {
      // Ages 12-17: 4 categories
      return [
        {
          id: 'emotional_regulation',
          category: 'Emotional Regulation',
          weight: 0.25,
          items: [
            'Process emotions before responding',
            'Own mistakes and make amends',
            'Manage stress in healthy ways'
          ]
        },
        {
          id: 'time_management',
          category: 'Time Management',
          weight: 0.25,
          items: [
            'Plan ahead for assignments',
            'Balance activities and rest',
            'Meet deadlines consistently'
          ]
        },
        {
          id: 'communication',
          category: 'Communication',
          weight: 0.25,
          items: [
            'Express needs clearly',
            'Listen to understand',
            'Resolve conflicts respectfully'
          ]
        },
        {
          id: 'personal_growth',
          category: 'Personal Growth',
          weight: 0.25,
          items: [
            'Set personal goals',
            'Practice new skills regularly'
          ]
        }
      ];
    }
  };

  const analyzeMotivationProfile = (answers) => {
    const scores = {
      'Rewards and incentives': 0,
      'Praise and recognition': 0,
      'Personal achievement': 0,
      'Helping others': 0
    };

    const mappings = {
      'Earning something they want': 'Rewards and incentives',
      'Being told they did a good job': 'Praise and recognition',
      'The challenge itself': 'Personal achievement',
      'Helping or being with others': 'Helping others',
      'What they earned or won': 'Rewards and incentives',
      'Recognition and praise': 'Praise and recognition',
      'What they learned or achieved': 'Personal achievement',
      'How it helped someone': 'Helping others',
      'Knowing a reward is coming': 'Rewards and incentives',
      'Regular encouragement': 'Praise and recognition',
      'Their own goals': 'Personal achievement',
      'Working with others': 'Helping others',
      'Tangible rewards or benefits': 'Rewards and incentives',
      'Recognition and affirmation': 'Praise and recognition',
      'Personal growth and mastery': 'Personal achievement',
      'Impact on others': 'Helping others',
      'The reward or outcome': 'Rewards and incentives',
      'Acknowledgment from others': 'Praise and recognition',
      'Sense of achievement': 'Personal achievement',
      'How it served others': 'Helping others',
      'End benefits or payoff': 'Rewards and incentives',
      'Support and encouragement': 'Praise and recognition',
      'Personal standards': 'Personal achievement',
      'Commitment to others': 'Helping others'
    };

    Object.values(answers).forEach(answer => {
      const category = mappings[answer];
      if (category) {
        scores[category]++;
      }
    });

    const maxScore = Math.max(...Object.values(scores));
    const primaryStyle = Object.keys(scores).find(key => scores[key] === maxScore);
    
    return {
      primary: primaryStyle,
      scores: scores,
      description: getMotivationDescription(primaryStyle)
    };
  };

  const getMotivationDescription = (style) => {
    const descriptions = {
      'Rewards and incentives': 'Motivated by earning tangible rewards and seeing clear benefits from effort',
      'Praise and recognition': 'Thrives on acknowledgment, affirmation, and being seen for accomplishments',
      'Personal achievement': 'Driven by growth, mastery, and the satisfaction of reaching personal goals',
      'Helping others': 'Energized by serving, supporting, and making a positive impact on people'
    };
    return descriptions[style] || '';
  };

  // UPDATED: Generate recommendations using categorical goals
  const generateRecommendations = () => {
    const recommendations = {};
    
    familyMembers.forEach(member => {
      const answers = questionnaires[member.id] || {};
      const isChild = member.role === 'child';
      const age = parseInt(member.age);
      const pointValues = calculatePointValues(!isChild, age);
      
      const motivationProfile = analyzeMotivationProfile(answers);
      
      // Generate routine items from time-based answers
      const routineItems = [];
      
      if (answers.wake_time) {
        routineItems.push(`Wake up at ${answers.wake_time}`);
      }
      
      if (isChild) {
        routineItems.push('Morning hygiene (brush teeth, wash face)');
        routineItems.push('Get dressed');
        routineItems.push('Eat breakfast');
        
        if (answers.school_start) {
          routineItems.push('Pack backpack and prepare for school');
        }
        
        if (answers.homework_time) {
          routineItems.push('Complete homework');
        }
        
        if (age >= 8) {
          routineItems.push('Daily chores');
        }
        
        if (answers.dinner_time) {
          routineItems.push('Help with dinner preparation or cleanup');
        }
        
        routineItems.push('Evening routine (shower, brush teeth)');
        
        if (answers.bedtime) {
          routineItems.push('Reading or quiet time before bed');
        }
      } else {
        // Adult routine
        routineItems.push('Morning spiritual practice or meditation');
        routineItems.push('Physical exercise or movement');
        routineItems.push('Review daily priorities');
        routineItems.push('Family connection time');
      }
      
      // Add recurring events to routine
      const memberEvents = recurringEvents[member.id] || [];
      memberEvents.forEach(event => {
        routineItems.push(`${event.name} (${event.day} at ${event.time})`);
      });
      
      const structuredRoutine = routineItems.map((item, idx) => ({
        text: item,
        points: pointValues.routineItem,
        frequency: 'daily'
      }));
      
      // Generate responsibilities
      let responsibilities = [];
      if (isChild) {
        if (age <= 7) {
          responsibilities = [
            'Put away toys after playing',
            'Help set the table',
            'Put dirty clothes in hamper'
          ];
        } else if (age <= 11) {
          responsibilities = [
            'Keep room clean and organized',
            'Clear dishes after meals',
            'Take out trash',
            'Help with laundry'
          ];
        } else {
          responsibilities = [
            'Clean own room thoroughly',
            'Do own laundry',
            'Prepare simple meals',
            'Help with household cleaning',
            'Yard work or outdoor chores'
          ];
        }
      } else {
        responsibilities = [
          'Lead family meeting or devotional',
          'Mentor children in life skills',
          'Maintain household systems',
          'Financial planning and budgeting'
        ];
      }
      
      const structuredResponsibilities = responsibilities.map((item, idx) => ({
        text: item,
        points: pointValues.responsibility,
        frequency: 'weekly'
      }));
      
      // Generate CATEGORICAL goals using new function
      const categoricalGoals = generateCategoricalGoals(age, !isChild, answers, orderedValues);
      
      // Flatten for display but maintain category structure
      const structuredGoals = categoricalGoals.flatMap(category => 
        category.items.map(item => ({
          text: item,
          points: pointValues.dailyGoal,
          frequency: 'daily',
          category: category.category
        }))
      );
      
      const weeklyPoints = calculateWeeklyPoints(structuredRoutine, structuredResponsibilities, structuredGoals, pointValues);
      
      recommendations[member.id] = {
        routine: structuredRoutine,
        responsibilities: structuredResponsibilities,
        goals: structuredGoals,
        categoricalGoals: categoricalGoals, // Store categorical structure
        motivationStyle: motivationProfile.primary,
        motivationProfile: motivationProfile,
        pointValues,
        weeklyPoints,
        rewards: getRewardsByMotivation(motivationProfile.primary, !isChild, age).map(r => ({ ...r, enabled: false }))
      };
    });
    
    setGeneratedData(recommendations);
    
    // Create insights summary
    const insights = {};
    familyMembers.forEach(member => {
      const rec = recommendations[member.id];
      insights[member.id] = {
        name: member.name,
        motivationStyle: rec.motivationStyle,
        description: rec.motivationProfile.description,
        weeklyPoints: rec.weeklyPoints,
        recommendedRewards: rec.rewards.slice(0, 5)
      };
    });
    setMotivationInsights(insights);
    
    // Initialize customized tasks
    const initialTasks = {};
    familyMembers.forEach(member => {
      initialTasks[member.id] = {
        routine: [...recommendations[member.id].routine],
        responsibilities: [...recommendations[member.id].responsibilities],
        goals: [...recommendations[member.id].goals],
        categoricalGoals: [...recommendations[member.id].categoricalGoals]
      };
    });
    setCustomizedTasks(initialTasks);
    
    // Initialize customized rewards (first 10 enabled by default)
    const initialRewards = {};
    familyMembers.forEach(member => {
      initialRewards[member.id] = recommendations[member.id].rewards.map((reward, idx) => ({
        ...reward,
        enabled: idx < 10
      }));
    });
    setCustomizedRewards(initialRewards);
  };

  const toggleValue = (valueId) => {
    const value = familyValues.find(v => v.id === valueId);
    if (value.selected) {
      setFamilyValues(familyValues.map(v => v.id === valueId ? { ...v, selected: false } : v));
      setOrderedValues(orderedValues.filter(v => v.id !== valueId));
    } else {
      setFamilyValues(familyValues.map(v => v.id === valueId ? { ...v, selected: true } : v));
      setOrderedValues([...orderedValues, value]);
    }
  };

  const reorderValue = (index, direction) => {
    const newOrdered = [...orderedValues];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newOrdered.length) {
      [newOrdered[index], newOrdered[newIndex]] = [newOrdered[newIndex], newOrdered[index]];
      setOrderedValues(newOrdered);
    }
  };

  const addFamilyMember = () => {
    if (currentMember.name && currentMember.age) {
      setFamilyMembers([...familyMembers, { ...currentMember, id: Date.now() }]);
      setCurrentMember({ name: '', age: '', role: 'child' });
    }
  };

  const removeFamilyMember = (id) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id));
  };

  const handleQuestionAnswer = (questionId, answer) => {
    const currentMemberData = familyMembers[currentMemberIndex];
    setQuestionnaires({
      ...questionnaires,
      [currentMemberData.id]: {
        ...(questionnaires[currentMemberData.id] || {}),
        [questionId]: answer
      }
    });
  };

  // NEW: Handle recurring events
  const addRecurringEvent = (memberId) => {
    const currentEvents = recurringEvents[memberId] || [];
    setRecurringEvents({
      ...recurringEvents,
      [memberId]: [...currentEvents, { name: '', day: 'Monday', time: '' }]
    });
  };

  const updateRecurringEvent = (memberId, index, field, value) => {
    const currentEvents = [...(recurringEvents[memberId] || [])];
    currentEvents[index][field] = value;
    setRecurringEvents({
      ...recurringEvents,
      [memberId]: currentEvents
    });
  };

  const removeRecurringEvent = (memberId, index) => {
    const currentEvents = [...(recurringEvents[memberId] || [])];
    currentEvents.splice(index, 1);
    setRecurringEvents({
      ...recurringEvents,
      [memberId]: currentEvents
    });
  };

  // NEW: Update task editing
  const updateTaskText = (memberId, section, index, newText) => {
    setCustomizedTasks({
      ...customizedTasks,
      [memberId]: {
        ...customizedTasks[memberId],
        [section]: customizedTasks[memberId][section].map((item, idx) => 
          idx === index ? { ...item, text: newText } : item
        )
      }
    });
  };

  const updateTaskPoints = (memberId, section, index, newPoints) => {
    setCustomizedTasks({
      ...customizedTasks,
      [memberId]: {
        ...customizedTasks[memberId],
        [section]: customizedTasks[memberId][section].map((item, idx) => 
          idx === index ? { ...item, points: parseInt(newPoints) || 0 } : item
        )
      }
    });
  };

  const updateReward = (memberId, index, field, value) => {
    setCustomizedRewards({
      ...customizedRewards,
      [memberId]: customizedRewards[memberId].map((reward, idx) => 
        idx === index ? { ...reward, [field]: value } : reward
      )
    });
  };

  const nextStep = () => {
    if (step === 0 && orderedValues.length < 3) {
      alert('Please select at least 3 family values');
      return;
    }
    if (step === 1 && familyMembers.length === 0) {
      alert('Please add at least one family member');
      return;
    }
    if (step === 2) {
      const currentMemberData = familyMembers[currentMemberIndex];
      const answers = questionnaires[currentMemberData.id] || {};
      const isChild = currentMemberData.role === 'child';
      const questions = isChild 
        ? getQuestionsForChild(currentMemberData.age, answers)
        : getQuestionsForAdult(answers);
      
      const requiredQuestions = questions.filter(q => q.type !== 'recurring' && q.type !== 'time');
      const answeredCount = requiredQuestions.filter(q => answers[q.id]).length;
      
      if (answeredCount < requiredQuestions.length) {
        alert('Please answer all motivation questions');
        return;
      }
      
      if (currentMemberIndex < familyMembers.length - 1) {
        setCurrentMemberIndex(currentMemberIndex + 1);
        return;
      } else {
        generateRecommendations();
      }
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    if (step === 2 && currentMemberIndex > 0) {
      setCurrentMemberIndex(currentMemberIndex - 1);
      return;
    }
    setStep(Math.max(0, step - 1));
  };

  const sendToMainApp = () => {
    const setupData = {
      values: orderedValues,
      members: familyMembers.map(member => {
        const customTasks = customizedTasks[member.id];
        const customRewards = customizedRewards[member.id];
        
        return {
          name: member.name,
          age: member.age,
          role: member.role,
          motivationStyle: generatedData[member.id].motivationStyle,
          routine: customTasks.routine,
          responsibilities: customTasks.responsibilities,
          goals: customTasks.goals,
          categoricalGoals: customTasks.categoricalGoals, // Include categorical structure
          rewards: customRewards.filter(r => r.enabled)
        };
      })
    };
    
    console.log('📤 Sending setup data to main app...', setupData);
    
    window.parent.postMessage({
      type: 'WIZARD_COMPLETE',
      data: setupData
    }, '*');
    
    setTimeout(() => {
      window.close();
    }, 500);
  };

  // Render step content
  const renderStepContent = () => {
    if (step === 0) {
      // Step 1: Values Selection
      return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', marginBottom: '16px' }}>
              <Icons.Heart />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Select Your Family Values</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Choose at least 3 values that matter most to your family</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '32px' }}>
            {familyValues.map(value => (
              <button
                key={value.id}
                onClick={() => toggleValue(value.id)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: value.selected ? '2px solid #10b981' : '1px solid #e2e8f0',
                  background: value.selected ? '#f0fdf4' : 'white',
                  color: value.selected ? '#059669' : '#64748b',
                  fontSize: '14px',
                  fontWeight: value.selected ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
              >
                {value.name}
              </button>
            ))}
          </div>

          {orderedValues.length > 0 && (
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Priority Order</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {orderedValues.map((value, index) => (
                  <div key={value.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600' }}>
                        {index + 1}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>{value.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {index > 0 && (
                        <button onClick={() => reorderValue(index, 'up')} style={{ padding: '4px 8px', border: 'none', background: '#f1f5f9', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}>
                          <Icons.ChevronUp />
                        </button>
                      )}
                      {index < orderedValues.length - 1 && (
                        <button onClick={() => reorderValue(index, 'down')} style={{ padding: '4px 8px', border: 'none', background: '#f1f5f9', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}>
                          <Icons.ChevronDown />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (step === 1) {
      // Step 2: Family Members
      return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', marginBottom: '16px' }}>
              <Icons.Users />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Add Family Members</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Who will be using this tracker?</p>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px auto', gap: '12px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '6px' }}>Name</label>
                <input
                  type="text"
                  value={currentMember.name}
                  onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                  placeholder="Enter name"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '6px' }}>Age</label>
                <input
                  type="number"
                  value={currentMember.age}
                  onChange={(e) => setCurrentMember({ ...currentMember, age: e.target.value })}
                  placeholder="Age"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '6px' }}>Role</label>
                <select
                  value={currentMember.role}
                  onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', background: 'white' }}
                >
                  <option value="child">Child</option>
                  <option value="adult">Adult</option>
                </select>
              </div>
              <button
                onClick={addFamilyMember}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Icons.Plus /> Add
              </button>
            </div>
          </div>

          {familyMembers.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {familyMembers.map(member => (
                <div key={member.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>{member.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Age {member.age} • {member.role === 'child' ? 'Child' : 'Adult'}</div>
                  </div>
                  <button
                    onClick={() => removeFamilyMember(member.id)}
                    style={{ padding: '8px', border: 'none', background: '#fee2e2', borderRadius: '8px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}
                  >
                    <Icons.X />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (step === 2) {
      // Step 3: Questions - ENHANCED with full day schedule
      const currentMemberData = familyMembers[currentMemberIndex];
      const answers = questionnaires[currentMemberData.id] || {};
      const isChild = currentMemberData.role === 'child';
      const questions = isChild 
        ? getQuestionsForChild(currentMemberData.age, answers)
        : getQuestionsForAdult(answers);
      const memberEvents = recurringEvents[currentMemberData.id] || [];

      return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', marginBottom: '16px' }}>
              <Icons.Sparkles />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>About {currentMemberData.name}</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
              Member {currentMemberIndex + 1} of {familyMembers.length}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {questions.map((q, index) => (
              <div key={q.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>
                  {q.question}
                </label>
                
                {q.type === 'time' && (
                  <input
                    type="text"
                    value={answers[q.id] || ''}
                    onChange={(e) => handleQuestionAnswer(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
                  />
                )}
                
                {q.type === 'recurring' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {memberEvents.map((event, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={event.name}
                          onChange={(e) => updateRecurringEvent(currentMemberData.id, idx, 'name', e.target.value)}
                          placeholder="Activity name"
                          style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit' }}
                        />
                        <select
                          value={event.day}
                          onChange={(e) => updateRecurringEvent(currentMemberData.id, idx, 'day', e.target.value)}
                          style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', background: 'white' }}
                        >
                          <option>Monday</option>
                          <option>Tuesday</option>
                          <option>Wednesday</option>
                          <option>Thursday</option>
                          <option>Friday</option>
                          <option>Saturday</option>
                          <option>Sunday</option>
                        </select>
                        <input
                          type="text"
                          value={event.time}
                          onChange={(e) => updateRecurringEvent(currentMemberData.id, idx, 'time', e.target.value)}
                          placeholder="Time"
                          style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit' }}
                        />
                        <button
                          onClick={() => removeRecurringEvent(currentMemberData.id, idx)}
                          style={{ padding: '8px', border: 'none', background: '#fee2e2', borderRadius: '6px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}
                        >
                          <Icons.X />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addRecurringEvent(currentMemberData.id)}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                    >
                      <Icons.Plus /> Add Activity
                    </button>
                  </div>
                )}
                
                {!q.type && q.options && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {q.options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleQuestionAnswer(q.id, option)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: answers[q.id] === option ? '2px solid #10b981' : '1px solid #e2e8f0',
                          background: answers[q.id] === option ? '#f0fdf4' : 'white',
                          color: answers[q.id] === option ? '#059669' : '#64748b',
                          fontSize: '14px',
                          fontWeight: answers[q.id] === option ? '500' : '400',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (step === 3 && motivationInsights) {
      // Step 4: Insights
      return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', marginBottom: '16px' }}>
              <Icons.Sparkles />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Motivation Insights</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Here's what we learned about your family</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.keys(motivationInsights).map(memberId => {
              const insight = motivationInsights[memberId];
              return (
                <div key={memberId} style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>{insight.name}</h3>
                  <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '6px', background: '#f0fdf4', color: '#059669', fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>
                    {insight.motivationStyle}
                  </div>
                  <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
                    {insight.description}
                  </p>
                  <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>Weekly earning potential</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{insight.weeklyPoints} points</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (step === 4 && customizedTasks) {
      // Step 5: Tasks Review - EDITABLE
      return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', marginBottom: '16px' }}>
              <Icons.Target />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Review & Edit Tasks</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Customize routines, responsibilities, and goals</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {familyMembers.map(member => {
              const tasks = customizedTasks[member.id];
              if (!tasks) return null;

              return (
                <div key={member.id} style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>{member.name}</h3>
                  
                  {/* Routine Items */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600', color: '#475569' }}>Daily Routine</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {tasks.routine.map((item, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '12px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => updateTaskText(member.id, 'routine', idx, e.target.value)}
                            style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="number"
                              value={item.points}
                              onChange={(e) => updateTaskPoints(member.id, 'routine', idx, e.target.value)}
                              style={{ width: '70px', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
                            />
                            <span style={{ fontSize: '13px', color: '#64748b' }}>pts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600', color: '#475569' }}>Weekly Responsibilities</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {tasks.responsibilities.map((item, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '12px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => updateTaskText(member.id, 'responsibilities', idx, e.target.value)}
                            style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="number"
                              value={item.points}
                              onChange={(e) => updateTaskPoints(member.id, 'responsibilities', idx, e.target.value)}
                              style={{ width: '70px', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
                            />
                            <span style={{ fontSize: '13px', color: '#64748b' }}>pts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Growth Goals - Show by category */}
                  <div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600', color: '#475569' }}>Character Growth Goals</h4>
                    {tasks.categoricalGoals && tasks.categoricalGoals.map((category, catIdx) => (
                      <div key={catIdx} style={{ marginBottom: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>{category.category}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {category.items.map((itemText, itemIdx) => {
                            const flatIndex = tasks.goals.findIndex(g => g.text === itemText && g.category === category.category);
                            const goalItem = tasks.goals[flatIndex];
                            return (
                              <div key={itemIdx} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '12px', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  value={itemText}
                                  onChange={(e) => {
                                    // Update in both places
                                    updateTaskText(member.id, 'goals', flatIndex, e.target.value);
                                    const newCategories = [...tasks.categoricalGoals];
                                    newCategories[catIdx].items[itemIdx] = e.target.value;
                                    setCustomizedTasks({
                                      ...customizedTasks,
                                      [member.id]: {
                                        ...tasks,
                                        categoricalGoals: newCategories
                                      }
                                    });
                                  }}
                                  style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', background: 'white' }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <input
                                    type="number"
                                    value={goalItem?.points || 0}
                                    onChange={(e) => updateTaskPoints(member.id, 'goals', flatIndex, e.target.value)}
                                    style={{ width: '70px', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', background: 'white' }}
                                  />
                                  <span style={{ fontSize: '13px', color: '#64748b' }}>pts</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (step === 5 && pointEconomy) {
      // Step 6: Economy Overview
      const memberData = familyMembers[0];
      const tasks = customizedTasks[memberData.id];
      const pointValues = generatedData[memberData.id].pointValues;
      
      const dailyRoutinePoints = tasks.routine.reduce((sum, item) => sum + item.points, 0);
      const weeklyRespPoints = tasks.responsibilities.reduce((sum, item) => sum + item.points, 0);
      const weeklyGoalPoints = tasks.goals.reduce((sum, item) => sum + item.points, 0);
      const weeklyTotal = (dailyRoutinePoints * 7) + weeklyRespPoints + weeklyGoalPoints;
      
      return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', marginBottom: '16px' }}>
              <Icons.Target />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Point Economy</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>How points are earned</p>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>Point Values</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Routine Item</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{pointValues.routineItem} pts</div>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Weekly Chore</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{pointValues.responsibility} pts</div>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Daily Goal</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{pointValues.dailyGoal} pts</div>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Weekly Goal</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{pointValues.weeklyGoal} pts</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>Weekly Earning Potential</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Daily routine (×7 days)</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{dailyRoutinePoints * 7} pts</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Weekly responsibilities</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{weeklyRespPoints} pts</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Growth goals</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{weeklyGoalPoints} pts</span>
              </div>
            </div>
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#059669', marginBottom: '4px', fontWeight: '500' }}>Total Weekly Potential</div>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#059669' }}>{weeklyTotal} points</div>
              <div style={{ fontSize: '13px', color: '#059669', marginTop: '4px' }}>≈ {Math.round(weeklyTotal / 7)} per day</div>
            </div>
          </div>
        </div>
      );
    }

    if (step === 6 && customizedRewards) {
      // Step 7: Rewards Customization
      const memberData = familyMembers[0];
      const rewards = customizedRewards[memberData.id] || [];
      const enabledCount = rewards.filter(r => r.enabled).length;
      const weeklyPoints = generatedData[memberData.id].weeklyPoints;

      return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', marginBottom: '16px' }}>
              <Icons.Target />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Customize Rewards</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Select rewards and adjust point costs</p>
          </div>

          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', color: '#92400e', lineHeight: '1.6' }}>
              <strong>{enabledCount} rewards</strong> currently enabled • Weekly earning potential: <strong>{weeklyPoints} points</strong>
              <br />
              <em>Tip: Aim for 8-12 rewards with a mix of point values</em>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
            {rewards.map((reward, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: reward.enabled ? 'white' : '#f8fafc',
                  border: reward.enabled ? '1px solid #10b981' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  opacity: reward.enabled ? 1 : 0.6
                }}
              >
                <input
                  type="checkbox"
                  checked={reward.enabled}
                  onChange={(e) => updateReward(familyMembers[0].id, index, 'enabled', e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a', marginBottom: '4px' }}>{reward.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{reward.category}</div>
                </div>
                <input
                  type="number"
                  value={reward.points}
                  onChange={(e) => updateReward(familyMembers[0].id, index, 'points', parseInt(e.target.value) || 0)}
                  disabled={!reward.enabled}
                  style={{ width: '70px', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', textAlign: 'center' }}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (step === 7) {
      // Step 8: Complete
      return (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', marginBottom: '24px' }}>
            <Icons.Check />
          </div>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '32px', fontWeight: '700', color: '#0f172a' }}>Setup Complete!</h2>
          <p style={{ margin: '0 0 32px 0', color: '#64748b', fontSize: '16px', lineHeight: '1.6' }}>
            Your family tracking system is ready. Click below to start your journey toward your family's true north.
          </p>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', marginBottom: '32px', textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>What's Next</h3>
            <ul style={{ margin: 0, padding: '0 0 0 20px', color: '#64748b', fontSize: '14px', lineHeight: '1.8' }}>
              <li>Your dashboard will load with personalized routines</li>
              <li>Track daily progress and earn points</li>
              <li>Redeem points for rewards</li>
              <li>Watch growth over time</li>
            </ul>
          </div>

          <button
            onClick={sendToMainApp}
            style={{
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }}
          >
            Create Family & Load Dashboard
          </button>
        </div>
      );
    }
  };

  const getStepName = (stepNum) => {
    const names = ['Values', 'Family', 'Questions', 'Insights', 'Tasks', 'Economy', 'Rewards', 'Complete'];
    return names[stepNum] || '';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(s => (
              <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '120px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: s <= step ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#e2e8f0',
                  color: s <= step ? 'white' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  transition: 'all 0.3s ease'
                }}>
                  {s < step ? <Icons.Check /> : s + 1}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: s <= step ? '#059669' : '#94a3b8',
                  fontWeight: s === step ? '600' : '400',
                  textAlign: 'center'
                }}>
                  {getStepName(s)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(step / 7) * 100}%`,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Step Content */}
        <div style={{ marginBottom: '32px' }}>
          {renderStepContent()}
        </div>

        {/* Navigation */}
        {step < 7 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '700px', margin: '0 auto' }}>
            <button
              onClick={prevStep}
              disabled={step === 0}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: 'white',
                color: '#64748b',
                fontWeight: '600',
                cursor: step === 0 ? 'not-allowed' : 'pointer',
                opacity: step === 0 ? 0.5 : 1,
                fontSize: '14px',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <Icons.ArrowLeft /> Back
            </button>
            <button
              onClick={nextStep}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.2)';
              }}
            >
              {step === 2 && currentMemberIndex < familyMembers.length - 1 ? 'Next Person' :
               step === 2 ? 'See Insights' :
               step === 3 ? 'Review Tasks' :
               step === 4 ? 'View Economy' :
               step === 5 ? 'Customize Rewards' : 'Continue'}
              <Icons.ArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(<OnboardingWithPointEconomy />, document.getElementById('root'));
