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
          { name: 'Special adventure day', points: 200, category: 'experience' },
          { name: 'New video game', points: 250, category: 'item' },
          { name: 'Redecorate room element', points: 300, category: 'privilege' }
        ],
        adult: [
          { name: 'Guilt-free afternoon nap', points: 30, category: 'rest' },
          { name: 'Solo coffee shop visit', points: 40, category: 'personal-time' },
          { name: 'Skip cooking dinner (order in)', points: 50, category: 'convenience' },
          { name: 'Buy that book/magazine', points: 60, category: 'item' },
          { name: 'Afternoon off (no responsibilities)', points: 80, category: 'personal-time' },
          { name: 'New clothing item (up to $50)', points: 100, category: 'item' },
          { name: 'Massage or spa service', points: 150, category: 'self-care' },
          { name: 'Date night upgrade (nice restaurant)', points: 200, category: 'experience' },
          { name: 'Weekend morning to sleep in', points: 100, category: 'rest' },
          { name: 'Personal hobby purchase (up to $100)', points: 250, category: 'item' },
          { name: 'Day trip solo or with friend', points: 300, category: 'experience' },
          { name: 'Tech gadget or upgrade', points: 400, category: 'item' }
        ]
      },
      'Praise and recognition': {
        child: [
          { name: 'Special mention at family dinner', points: 10, category: 'recognition' },
          { name: 'Achievement certificate', points: 20, category: 'recognition' },
          { name: 'Get to share accomplishment with grandparents', points: 25, category: 'recognition' },
          { name: 'Photo on family achievement wall', points: 30, category: 'recognition' },
          { name: 'Lead family meeting or devotion', points: 40, category: 'leadership' },
          { name: 'Choose and lead family activity', points: 50, category: 'leadership' },
          { name: 'Special one-on-one time with parent', points: 60, category: 'quality-time' },
          { name: 'Invite friend for special activity', points: 80, category: 'social' },
          { name: 'Be "expert" teacher to younger sibling', points: 40, category: 'leadership' },
          { name: 'Plan and execute family surprise', points: 100, category: 'leadership' },
          { name: 'Extended one-on-one date with parent', points: 120, category: 'quality-time' }
        ],
        adult: [
          { name: 'Spouse writes appreciation note', points: 20, category: 'recognition' },
          { name: 'Kids make thank-you card/art', points: 30, category: 'recognition' },
          { name: 'Family meeting highlighting your wins', points: 40, category: 'recognition' },
          { name: 'Share accomplishment in extended family group', points: 50, category: 'recognition' },
          { name: 'Dedicated appreciation time at dinner', points: 60, category: 'recognition' },
          { name: 'Partner plans special date recognizing your efforts', points: 150, category: 'quality-time' },
          { name: 'Family creates "Hall of Fame" moment', points: 100, category: 'recognition' }
        ]
      },
      'Personal achievement': {
        child: [
          { name: 'Unlock next level responsibility', points: 50, category: 'advancement' },
          { name: 'Get personal progress chart', points: 30, category: 'tracking' },
          { name: 'Start a "personal best" board', points: 40, category: 'tracking' },
          { name: 'Learn a new skill of choice', points: 80, category: 'growth' },
          { name: 'Work on independent project', points: 60, category: 'growth' },
          { name: 'Take a class or lesson', points: 120, category: 'growth' },
          { name: 'Get advanced resource (book, kit, tool)', points: 100, category: 'growth' },
          { name: 'Mentor younger sibling', points: 80, category: 'advancement' },
          { name: 'Plan and complete challenge project', points: 150, category: 'growth' },
          { name: 'Earn "Expert" status in chosen area', points: 200, category: 'advancement' }
        ],
        adult: [
          { name: 'Dedicated personal development time', points: 40, category: 'growth' },
          { name: 'Buy that course or book', points: 80, category: 'growth' },
          { name: 'Weekend intensive (conference, retreat)', points: 200, category: 'growth' },
          { name: 'Professional coaching session', points: 150, category: 'growth' },
          { name: 'Start passion project time block', points: 100, category: 'growth' },
          { name: 'Advanced training or certification', points: 300, category: 'growth' },
          { name: 'Sabbatical day for deep work', points: 120, category: 'growth' }
        ]
      },
      'Helping others': {
        child: [
          { name: 'Choose family service project', points: 40, category: 'service' },
          { name: 'One-on-one time teaching sibling', points: 30, category: 'service' },
          { name: 'Plan surprise for family member', points: 50, category: 'service' },
          { name: 'Organize family game night', points: 60, category: 'family-time' },
          { name: 'Lead family meeting or devotion', points: 70, category: 'leadership' },
          { name: 'Create care package with parent', points: 80, category: 'service' },
          { name: 'Plan and execute family outing', points: 100, category: 'family-time' },
          { name: 'Volunteer opportunity with parent', points: 120, category: 'service' },
          { name: 'Ongoing mentorship of younger sibling', points: 150, category: 'service' }
        ],
        adult: [
          { name: 'Family volunteers together', points: 80, category: 'service' },
          { name: 'Plan surprise for spouse', points: 60, category: 'relationship' },
          { name: 'Host small group or gathering', points: 100, category: 'hospitality' },
          { name: 'Extended one-on-one with each child', points: 120, category: 'relationship' },
          { name: 'Plan family adventure weekend', points: 200, category: 'family-time' },
          { name: 'Mentor someone in your field', points: 150, category: 'service' },
          { name: 'Organize community service event', points: 180, category: 'service' }
        ]
      }
    };

    const relevantRewards = rewards[motivationStyle] || rewards['Rewards and incentives'];
    return isAdult ? relevantRewards.adult : relevantRewards.child;
  };

  // Calculate suggested point values based on age and difficulty
  const calculatePointValues = (isAdult, age) => {
    if (isAdult) {
      return {
        routineItem: 3,
        responsibility: 5,
        weeklyGoal: 15,
        dailyGoal: 8
      };
    } else {
      const routinePoints = age <= 7 ? 1 : age <= 11 ? 2 : 3;
      const respPoints = age <= 7 ? 2 : age <= 11 ? 3 : 5;
      const goalPoints = age <= 7 ? 5 : age <= 11 ? 8 : 12;
      
      return {
        routineItem: routinePoints,
        responsibility: respPoints,
        weeklyGoal: goalPoints,
        dailyGoal: Math.floor(goalPoints * 0.6)
      };
    }
  };

  // Calculate total possible points per week
  const calculateWeeklyPoints = (routineItems, responsibilities, goals, pointValues) => {
    const dailyRoutinePoints = routineItems.length * pointValues.routineItem * 7;
    const weeklyRespPoints = responsibilities.length * pointValues.responsibility;
    const goalPoints = goals.length * pointValues.weeklyGoal;
    
    return {
      dailyRoutineTotal: dailyRoutinePoints,
      responsibilityTotal: weeklyRespPoints,
      goalTotal: goalPoints,
      weeklyTotal: dailyRoutinePoints + weeklyRespPoints + goalPoints,
      dailyAverage: Math.floor((dailyRoutinePoints + weeklyRespPoints + goalPoints) / 7)
    };
  };

  // Child questions
  const getQuestionsForChild = (childAge, answers = {}) => {
    const questions = [];
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

  // Adult questions
  const getQuestionsForAdult = (answers = {}) => {
    const questions = [];
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
      id: 'accountability_style',
      question: 'What kind of accountability helps you stay on track?',
      options: ['Clear rewards/consequences', 'Regular check-ins with encouragement', 'Personal tracking and reflection', 'Shared goals with others']
    });
    return questions;
  };

  // Determine motivation style
  const determineMotivationStyle = (answers, isAdult = false) => {
    const excitement = answers.excitement_trigger || answers.adult_excitement_trigger || '';
    const accomplishment = answers.accomplishment_response || answers.adult_accomplishment || '';
    const stickiness = answers.task_completion || answers.accountability_style || '';

    const scores = { extrinsic: 0, affirmation: 0, intrinsic: 0, relational: 0 };

    if (excitement.includes('Earning') || excitement.includes('benefits')) scores.extrinsic += 2;
    if (excitement.includes('told they did') || excitement.includes('Recognition')) scores.affirmation += 2;
    if (excitement.includes('challenge') || excitement.includes('mastery')) scores.intrinsic += 2;
    if (excitement.includes('Helping') || excitement.includes('Impact')) scores.relational += 2;

    if (accomplishment.includes('earned') || accomplishment.includes('outcome')) scores.extrinsic += 2;
    if (accomplishment.includes('Recognition') || accomplishment.includes('Acknowledgment')) scores.affirmation += 2;
    if (accomplishment.includes('learned') || accomplishment.includes('achievement')) scores.intrinsic += 2;
    if (accomplishment.includes('helped') || accomplishment.includes('served')) scores.relational += 2;

    if (stickiness.includes('reward') || stickiness.includes('consequences')) scores.extrinsic += 2;
    if (stickiness.includes('encouragement') || stickiness.includes('check-ins')) scores.affirmation += 2;
    if (stickiness.includes('own goals') || stickiness.includes('reflection')) scores.intrinsic += 2;
    if (stickiness.includes('with others') || stickiness.includes('Shared')) scores.relational += 2;

    const maxScore = Math.max(...Object.values(scores));
    const topMotivation = Object.keys(scores).find(key => scores[key] === maxScore) || 'intrinsic';

    const motivationMap = {
      extrinsic: 'Rewards and incentives',
      affirmation: 'Praise and recognition',
      intrinsic: 'Personal achievement',
      relational: 'Helping others'
    };

    const explanations = {
      'Rewards and incentives': 'Motivated by tangible rewards and clear incentives. Thrives with point systems and earning privileges.',
      'Praise and recognition': 'Motivated by encouragement and acknowledgment. Lights up when efforts are noticed and celebrated.',
      'Personal achievement': 'Internally motivated by accomplishing goals. Enjoys tracking progress and mastering new skills.',
      'Helping others': 'Motivated by contribution and connection. Thrives when efforts help others or the family.'
    };

    return {
      primary: motivationMap[topMotivation],
      scores,
      explanation: explanations[motivationMap[topMotivation]]
    };
  };

  const handleValueToggle = (valueId) => {
    const value = familyValues.find(v => v.id === valueId);
    if (value.selected) {
      setFamilyValues(familyValues.map(v => v.id === valueId ? { ...v, selected: false } : v));
      setOrderedValues(orderedValues.filter(v => v.id !== valueId));
    } else {
      setFamilyValues(familyValues.map(v => v.id === valueId ? { ...v, selected: true } : v));
      setOrderedValues([...orderedValues, value]);
    }
  };

  const moveValue = (index, direction) => {
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

  const handleQuestionAnswer = (memberId, questionId, answer) => {
    setQuestionnaires({
      ...questionnaires,
      [memberId]: { ...questionnaires[memberId], [questionId]: answer }
    });
  };

  const generateRecommendations = () => {
    const recommendations = {};
    const insights = {};
    const economies = {};

    familyMembers.forEach(member => {
      const isChild = member.role === 'child';
      const age = parseInt(member.age);
      const answers = questionnaires[member.id] || {};
      
      const motivation = determineMotivationStyle(answers, !isChild);
      insights[member.id] = motivation;

      const pointValues = calculatePointValues(!isChild, age);

      if (isChild) {
        let routineCount = age <= 5 ? 3 : age <= 8 ? 5 : age <= 12 ? 7 : 8;
        const routineItems = age <= 8
          ? ['Wake up', 'Brush teeth', 'Get dressed', 'Eat breakfast', 'Pack backpack', 'Make bed']
          : ['Wake up', 'Morning hygiene', 'Breakfast prep', 'Get dressed', 'Pack essentials', 'Room tidy'];

        const responsibilityPools = {
          young: ['Put dirty clothes in hamper', 'Help set the table', 'Clear own dishes', 'Put away shoes', 'Make bed'],
          middle: ['Keep room tidy', 'Set and clear table', 'Put away laundry', 'Help prepare meals', 'Load dishwasher'],
          older: ['Do own laundry', 'Prepare simple meals', 'Clean bathroom', 'Vacuum areas', 'Take out trash']
        };

        const pool = age <= 7 ? responsibilityPools.young : age <= 11 ? responsibilityPools.middle : responsibilityPools.older;
        const responsibilities = pool.slice(0, 4);

        const goals = [
          { text: 'Complete morning routine without reminders', frequency: 'daily' },
          { text: 'Keep room picked up daily', frequency: 'daily' },
          { text: `Practice ${orderedValues[0]?.name.toLowerCase() || 'kindness'} daily`, frequency: 'daily' },
          { text: answers.focus_area === 'Academic habits' ? 'Complete homework before dinner' : 'Get 20 minutes active play', frequency: 'daily' }
        ];

        const structuredRoutine = routineItems.slice(0, routineCount).map(item => ({
          text: item,
          points: pointValues.routineItem,
          frequency: 'daily'
        }));

        const structuredResponsibilities = responsibilities.map(item => ({
          text: item,
          points: pointValues.responsibility,
          frequency: 'weekly'
        }));

        const structuredGoals = goals.map(goal => ({
          text: goal.text,
          points: goal.frequency === 'daily' ? pointValues.dailyGoal : pointValues.weeklyGoal,
          frequency: goal.frequency
        }));

        const weeklyPoints = calculateWeeklyPoints(structuredRoutine, structuredResponsibilities, structuredGoals, pointValues);
        const suggestedRewards = getRewardsByMotivation(motivation.primary, false, age);

        recommendations[member.id] = {
          name: member.name,
          age: member.age,
          role: 'child',
          routine: structuredRoutine,
          responsibilities: structuredResponsibilities,
          goals: structuredGoals,
          motivationStyle: motivation.primary,
          pointValues,
          weeklyPoints,
          suggestedRewards
        };

        economies[member.id] = {
          pointValues,
          weeklyPoints,
          rewards: suggestedRewards
        };
      } else {
        // ADULT
        const routineItems = ['Morning spiritual practice', 'Physical exercise', 'Review priorities', 'Family connection'];
        const responsibilities = ['Model spiritual practice', 'Exercise 4+ days/week', 'Weekly date night'];
        const goals = [
          { text: 'Complete daily devotional', frequency: 'daily' },
          { text: 'Exercise 30 min', frequency: 'daily' },
          { text: 'One afternoon for restoration', frequency: 'weekly' }
        ];

        const structuredRoutine = routineItems.map(item => ({
          text: item,
          points: pointValues.routineItem,
          frequency: 'daily'
        }));

        const structuredResponsibilities = responsibilities.map(item => ({
          text: item,
          points: pointValues.responsibility,
          frequency: 'weekly'
        }));

        const structuredGoals = goals.map(goal => ({
          text: goal.text,
          points: goal.frequency === 'daily' ? pointValues.dailyGoal : pointValues.weeklyGoal,
          frequency: goal.frequency
        }));

        const weeklyPoints = calculateWeeklyPoints(structuredRoutine, structuredResponsibilities, structuredGoals, pointValues);
        const suggestedRewards = getRewardsByMotivation(motivation.primary, true, age);

        recommendations[member.id] = {
          name: member.name,
          age: member.age,
          role: 'adult',
          routine: structuredRoutine,
          responsibilities: structuredResponsibilities,
          goals: structuredGoals,
          motivationStyle: motivation.primary,
          pointValues,
          weeklyPoints,
          suggestedRewards
        };

        economies[member.id] = {
          pointValues,
          weeklyPoints,
          rewards: suggestedRewards
        };
      }
    });

    setGeneratedData(recommendations);
    setMotivationInsights(insights);
    setPointEconomy(economies);
    
    // Initialize customized rewards (user can edit these)
    const initialCustomRewards = {};
    familyMembers.forEach(member => {
      const memberRecs = recommendations[member.id];
      if (memberRecs && memberRecs.suggestedRewards) {
        initialCustomRewards[member.id] = memberRecs.suggestedRewards.map((reward, idx) => ({
          ...reward,
          id: `reward_${idx + 1}`,
          enabled: idx < 10 // Enable first 10 by default
        }));
      }
    });
    setCustomizedRewards(initialCustomRewards);
  };

  // AUTOMATIC SEND TO MAIN APP
  const sendToMainApp = () => {
    const exportData = {
      readyToImport: true,
      familyName: 'My Family',
      familyValues: orderedValues.map(v => v.name),
      members: familyMembers.map(member => {
        const memberData = generatedData[member.id];
        // Get customized rewards for this member (only enabled ones)
        const memberRewards = customizedRewards[member.id] || [];
        const enabledRewards = memberRewards.filter(r => r.enabled);
        
        return {
          name: memberData.name,
          age: memberData.age,
          role: memberData.role,
          routine: memberData.routine,
          responsibilities: memberData.responsibilities,
          goals: memberData.goals,
          rewards: enabledRewards.length > 0 ? enabledRewards : memberData.suggestedRewards, // Use customized or fallback to suggested
          motivationStyle: memberData.motivationStyle
        };
      })
    };

    // Send to parent window (main Compass app)
    if (window.opener) {
      console.log('📤 Sending setup data to main app...');
      window.opener.postMessage({
        type: 'COMPASS_WIZARD_COMPLETE',
        data: exportData
      }, '*'); // Send to any origin (main app is on Squarespace)
      
      alert('✅ Setup complete! Your family is being created...');
      window.close();
    } else {
      alert('Unable to send data to main app. Please ensure this window was opened from the Compass app.');
    }
  };

  const nextStep = () => {
    if (step === 0 && orderedValues.length < 3) {
      alert('Please select and order at least 3 family values');
      return;
    }
    if (step === 1 && familyMembers.length === 0) {
      alert('Please add at least one family member');
      return;
    }
    if (step === 2) {
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
    if (step === 2) setCurrentMemberIndex(0);
  };

  const currentMemberData = familyMembers[currentMemberIndex];
  const isCurrentChild = currentMemberData?.role === 'child';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '24px',
      color: '#1e293b'
    }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)'
          }}>
            <Icons.Target />
            <span style={{ color: 'white', fontSize: '28px', fontWeight: '700' }}>C</span>
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#0f172a',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px'
          }}>
            Family Setup
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
            Create your personalized growth system
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '32px'
        }}>
          {['Values', 'Family', 'Questions', 'Insights', 'Economy', 'Rewards', 'Complete'].map((label, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              flex: '1',
              maxWidth: '140px'
            }}>
              <div style={{
                width: '100%',
                height: '4px',
                background: idx <= step ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' : '#e2e8f0',
                borderRadius: '2px',
                transition: 'all 0.3s ease'
              }}></div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {idx < step ? (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Icons.Check />
                  </div>
                ) : (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '10px',
                    background: idx === step ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: idx === step ? 'white' : '#94a3b8',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {idx + 1}
                  </div>
                )}
                <span style={{
                  fontSize: '12px',
                  color: idx <= step ? '#0f172a' : '#94a3b8',
                  fontWeight: idx === step ? '600' : '500'
                }}>
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          minHeight: '500px',
          border: '1px solid #f1f5f9'
        }}>
          {/* Step 0: Values */}
          {step === 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ color: '#10b981' }}>
                  <Icons.Heart />
                </div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: 0,
                  letterSpacing: '-0.5px'
                }}>
                  Your Family Values
                </h2>
              </div>
              <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
                Select and prioritize the values that matter most to your family
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '12px',
                marginBottom: '24px'
              }}>
                {familyValues.map(value => (
                  <button
                    key={value.id}
                    onClick={() => handleValueToggle(value.id)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: value.selected ? '2px solid #10b981' : '2px solid #e2e8f0',
                      background: value.selected ? '#f0fdf4' : 'white',
                      cursor: 'pointer',
                      fontWeight: value.selected ? '600' : '500',
                      fontSize: '14px',
                      color: value.selected ? '#0f172a' : '#475569',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                    onMouseOver={(e) => {
                      if (!value.selected) {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.background = '#f8fafc';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!value.selected) {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.background = 'white';
                      }
                    }}
                  >
                    {value.name}
                  </button>
                ))}
              </div>
              {orderedValues.length > 0 && (
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#0f172a' }}>
                    Priority Order ({orderedValues.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {orderedValues.map((value, index) => (
                      <div key={value.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>
                          <strong style={{ color: '#10b981', marginRight: '8px' }}>{index + 1}.</strong>
                          {value.name}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => moveValue(index, 'up')}
                            disabled={index === 0}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              background: index === 0 ? '#f1f5f9' : 'white',
                              cursor: index === 0 ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              opacity: index === 0 ? 0.5 : 1,
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              if (index !== 0) e.currentTarget.style.background = '#f8fafc';
                            }}
                            onMouseOut={(e) => {
                              if (index !== 0) e.currentTarget.style.background = 'white';
                            }}
                          >
                            <Icons.ChevronUp />
                          </button>
                          <button
                            onClick={() => moveValue(index, 'down')}
                            disabled={index === orderedValues.length - 1}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              background: index === orderedValues.length - 1 ? '#f1f5f9' : 'white',
                              cursor: index === orderedValues.length - 1 ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              opacity: index === orderedValues.length - 1 ? 0.5 : 1,
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              if (index !== orderedValues.length - 1) e.currentTarget.style.background = '#f8fafc';
                            }}
                            onMouseOut={(e) => {
                              if (index !== orderedValues.length - 1) e.currentTarget.style.background = 'white';
                            }}
                          >
                            <Icons.ChevronDown />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Family */}
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ color: '#10b981' }}>
                  <Icons.Users />
                </div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: 0,
                  letterSpacing: '-0.5px'
                }}>
                  Add Your Family
                </h2>
              </div>
              <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
                Add each family member who will be using the tracker
              </p>
              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr auto',
                  gap: '12px',
                  alignItems: 'end'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={currentMember.name}
                      onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                      placeholder="Enter name"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#10b981';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                      Age
                    </label>
                    <input
                      type="number"
                      value={currentMember.age}
                      onChange={(e) => setCurrentMember({ ...currentMember, age: e.target.value })}
                      placeholder="Age"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#10b981';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                      Role
                    </label>
                    <select
                      value={currentMember.role}
                      onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        background: 'white',
                        outline: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#10b981';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="child">Child</option>
                      <option value="adult">Adult</option>
                    </select>
                  </div>
                  <button
                    onClick={addFamilyMember}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontFamily: 'inherit',
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
                    Add
                  </button>
                </div>
              </div>
              {familyMembers.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#0f172a' }}>
                    Family Members ({familyMembers.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {familyMembers.map(member => (
                      <div key={member.id} style={{
                        padding: '16px',
                        background: '#f8fafc',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid #e2e8f0'
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>
                          <strong>{member.name}</strong>
                          <span style={{ color: '#64748b', marginLeft: '8px' }}>
                            ({member.age} yrs, {member.role})
                          </span>
                        </span>
                        <button
                          onClick={() => setFamilyMembers(familyMembers.filter(m => m.id !== member.id))}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: '1px solid #fecaca',
                            background: '#fef2f2',
                            color: '#dc2626',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            fontFamily: 'inherit',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#fee2e2';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#fef2f2';
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Questions */}
          {step === 2 && currentMemberData && (
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 8px 0',
                letterSpacing: '-0.5px'
              }}>
                About {currentMemberData.name}
              </h2>
              <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
                Question {currentMemberIndex + 1} of {familyMembers.length}
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                maxHeight: '450px',
                overflowY: 'auto',
                paddingRight: '8px'
              }}>
                {(isCurrentChild
                  ? getQuestionsForChild(currentMemberData.age, questionnaires[currentMemberData.id] || {})
                  : getQuestionsForAdult(questionnaires[currentMemberData.id] || {})
                ).map((q) => (
                  <div key={q.id}>
                    <h3 style={{
                      fontSize: '15px',
                      color: '#0f172a',
                      marginBottom: '12px',
                      fontWeight: '600'
                    }}>
                      {q.question}
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: q.options.length <= 2 ? `repeat(${q.options.length}, 1fr)` : 'repeat(2, 1fr)',
                      gap: '10px'
                    }}>
                      {q.options.map(option => {
                        const isSelected = questionnaires[currentMemberData.id]?.[q.id] === option;
                        return (
                          <button
                            key={option}
                            onClick={() => handleQuestionAnswer(currentMemberData.id, q.id, option)}
                            style={{
                              padding: '14px 16px',
                              borderRadius: '10px',
                              border: isSelected ? '2px solid #10b981' : '2px solid #e2e8f0',
                              background: isSelected ? '#f0fdf4' : 'white',
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontSize: '14px',
                              fontWeight: isSelected ? '600' : '500',
                              color: isSelected ? '#0f172a' : '#475569',
                              fontFamily: 'inherit',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = '#cbd5e1';
                                e.currentTarget.style.background = '#f8fafc';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.background = 'white';
                              }
                            }}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Motivation Insights */}
          {step === 3 && motivationInsights && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: 'white'
                }}>
                  <Icons.Sparkles />
                </div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.5px'
                }}>
                  Understanding Motivation
                </h2>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                  Here's what motivates each person in your family
                </p>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                maxHeight: '450px',
                overflowY: 'auto'
              }}>
                {familyMembers.map(member => {
                  const motivation = motivationInsights[member.id];
                  return (
                    <div key={member.id} style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '8px', color: '#0f172a' }}>
                        {member.name}
                        <span style={{ color: '#64748b', fontWeight: '500', marginLeft: '8px' }}>
                          (Age {member.age})
                        </span>
                      </h3>
                      <div style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginBottom: '12px'
                      }}>
                        {motivation.primary}
                      </div>
                      <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '14px', margin: 0 }}>
                        {motivation.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Point Economy Review */}
          {step === 4 && pointEconomy && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '700'
                }}>
                  $
                </div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.5px'
                }}>
                  Point Economy
                </h2>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                  Personalized earning and reward systems for each member
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                maxHeight: '450px',
                overflowY: 'auto',
                paddingRight: '8px'
              }}>
                {familyMembers.map(member => {
                  const economy = pointEconomy[member.id];
                  const memberData = generatedData[member.id];
                  if (!economy || !memberData) return null;
                  
                  return (
                    <div key={member.id} style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '16px', color: '#0f172a' }}>
                        {member.name}
                        <span style={{ color: '#64748b', fontWeight: '500', marginLeft: '8px' }}>
                          (Age {member.age})
                        </span>
                      </h3>
                      
                      {/* Point Values */}
                      <div style={{
                        background: 'white',
                        borderRadius: '10px',
                        padding: '16px',
                        marginBottom: '16px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#475569' }}>
                          Point Values
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
                          <div>
                            <div style={{ color: '#64748b', marginBottom: '2px' }}>Routine Item</div>
                            <div style={{ fontWeight: '600', color: '#10b981', fontSize: '16px' }}>
                              {economy.pointValues.routineItem} pts
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#64748b', marginBottom: '2px' }}>Weekly Chore</div>
                            <div style={{ fontWeight: '600', color: '#10b981', fontSize: '16px' }}>
                              {economy.pointValues.responsibility} pts
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#64748b', marginBottom: '2px' }}>Daily Goal</div>
                            <div style={{ fontWeight: '600', color: '#10b981', fontSize: '16px' }}>
                              {economy.pointValues.dailyGoal} pts
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#64748b', marginBottom: '2px' }}>Weekly Goal</div>
                            <div style={{ fontWeight: '600', color: '#10b981', fontSize: '16px' }}>
                              {economy.pointValues.weeklyGoal} pts
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Weekly Potential */}
                      <div style={{
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        borderRadius: '10px',
                        padding: '16px',
                        marginBottom: '16px',
                        border: '1px solid #bbf7d0'
                      }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#0f172a' }}>
                          Weekly Earning Potential
                        </h4>
                        <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
                          {economy.weeklyPoints.weeklyTotal} pts
                        </div>
                        <div style={{ fontSize: '12px', color: '#475569' }}>
                          Daily average: ~{economy.weeklyPoints.dailyAverage} pts
                        </div>
                      </div>
                      
                      {/* Sample Rewards */}
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#475569' }}>
                          Sample Rewards ({memberData.motivationStyle})
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {economy.rewards.slice(0, 5).map((reward, idx) => (
                            <div key={idx} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px 12px',
                              background: 'white',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                              fontSize: '13px'
                            }}>
                              <span style={{ color: '#475569' }}>{reward.name}</span>
                              <span style={{ fontWeight: '600', color: '#10b981' }}>{reward.points} pts</span>
                            </div>
                          ))}
                          <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginTop: '4px' }}>
                            + {economy.rewards.length - 5} more rewards available
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Customize Rewards */}
          {step === 5 && customizedRewards && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '700'
                }}>
                  🎁
                </div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.5px'
                }}>
                  Customize Rewards
                </h2>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                  Adjust point values and select which rewards to include
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                maxHeight: '450px',
                overflowY: 'auto',
                paddingRight: '8px'
              }}>
                {familyMembers.map(member => {
                  const rewards = customizedRewards[member.id] || [];
                  
                  return (
                    <div key={member.id} style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '16px', color: '#0f172a' }}>
                        {member.name}'s Rewards
                        <span style={{ color: '#64748b', fontWeight: '500', marginLeft: '8px', fontSize: '14px' }}>
                          ({rewards.filter(r => r.enabled).length} selected)
                        </span>
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {rewards.map((reward, idx) => (
                          <div key={reward.id || idx} style={{
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr 120px',
                            gap: '12px',
                            alignItems: 'center',
                            padding: '12px',
                            background: reward.enabled ? 'white' : '#f1f5f9',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            opacity: reward.enabled ? 1 : 0.6
                          }}>
                            <input
                              type="checkbox"
                              checked={reward.enabled}
                              onChange={(e) => {
                                const updated = {...customizedRewards};
                                updated[member.id][idx].enabled = e.target.checked;
                                setCustomizedRewards(updated);
                              }}
                              style={{
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer'
                              }}
                            />
                            <div style={{ fontSize: '14px', color: '#475569', fontWeight: reward.enabled ? '500' : '400' }}>
                              {reward.name}
                              <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '8px' }}>
                                ({reward.category})
                              </span>
                            </div>
                            <input
                              type="number"
                              value={reward.points}
                              onChange={(e) => {
                                const updated = {...customizedRewards};
                                updated[member.id][idx].points = parseInt(e.target.value) || 0;
                                setCustomizedRewards(updated);
                              }}
                              disabled={!reward.enabled}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#10b981',
                                textAlign: 'right',
                                fontFamily: 'inherit',
                                background: reward.enabled ? 'white' : '#f8fafc',
                                outline: 'none'
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div style={{
                        marginTop: '12px',
                        padding: '10px 12px',
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#475569',
                        border: '1px solid #bbf7d0'
                      }}>
                        <strong>Tip:</strong> Select 8-12 rewards and adjust points to match earning potential (~{pointEconomy[member.id]?.weeklyPoints.weeklyTotal || 0} pts/week)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 6: Complete Setup */}
          {step === 6 && generatedData && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  fontSize: '36px',
                  boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)'
                }}>
                  <Icons.Check />
                  <span style={{ color: 'white' }}>✓</span>
                </div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: '0 0 12px 0',
                  letterSpacing: '-0.5px'
                }}>
                  Setup Complete!
                </h2>
                <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>
                  Your personalized family system is ready
                </p>
                <button
                  onClick={sendToMainApp}
                  style={{
                    padding: '16px 40px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  Create My Family
                  <Icons.ArrowRight />
                </button>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                borderRadius: '12px',
                padding: '24px',
                marginTop: '32px',
                border: '1px solid #bbf7d0'
              }}>
                <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: '#0f172a' }}>
                  What's Included
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '14px', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: '600' }}>✓</span>
                    {familyMembers.length} family member{familyMembers.length !== 1 ? 's' : ''}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: '600' }}>✓</span>
                    Personalized routines
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: '600' }}>✓</span>
                    Custom rewards menus
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: '600' }}>✓</span>
                    Point economy system
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: '600' }}>✓</span>
                    {orderedValues.length} family values
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: '600' }}>✓</span>
                    Character development goals
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {step < 6 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '24px',
            gap: '16px'
          }}>
            <button
              onClick={prevStep}
              disabled={step === 0}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: 'white',
                color: step === 0 ? '#cbd5e1' : '#475569',
                fontWeight: '600',
                cursor: step === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (step !== 0) {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }
              }}
              onMouseOut={(e) => {
                if (step !== 0) {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }
              }}
            >
              <Icons.ArrowLeft />
              Back
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
               step === 3 ? 'View Economy' :
               step === 4 ? 'Customize Rewards' : 'Continue'}
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
