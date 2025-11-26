import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Users, Heart, Target, CheckCircle, GripVertical, Star, Trophy, Sparkles, Download, DollarSign } from 'lucide-react';

const OnboardingWithPointEconomy = () => {
  const [step, setStep] = useState(0);
  const [familyValues, setFamilyValues] = useState([
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
  const [orderedValues, setOrderedValues] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [currentMember, setCurrentMember] = useState({ name: '', age: '', role: 'child' });
  const [questionnaires, setQuestionnaires] = useState({});
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [generatedData, setGeneratedData] = useState(null);
  const [motivationInsights, setMotivationInsights] = useState(null);
  const [pointEconomy, setPointEconomy] = useState({});
  const [currentEconomyMember, setCurrentEconomyMember] = useState(null);

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
  };

  // AUTOMATIC SEND TO MAIN APP
  const sendToMainApp = () => {
    const exportData = {
      readyToImport: true,
      familyName: 'My Family',
      familyValues: orderedValues.map(v => v.name),
      members: Object.values(generatedData).map(member => ({
        name: member.name,
        age: member.age,
        role: member.role,
        routine: member.routine,
        responsibilities: member.responsibilities,
        goals: member.goals,
        rewards: member.suggestedRewards,
        motivationStyle: member.motivationStyle
      }))
    };

    // Send to parent window (main Compass app)
    if (window.opener) {
      console.log('📤 Sending setup data to main app...');
      window.opener.postMessage({
        type: 'COMPASS_WIZARD_COMPLETE',
        data: exportData
      }, 'https://type1unbound.github.io'); // Your main app origin
      
      // Show success message
      alert('✅ Setup complete! Your family is being created...');
      
      // Close wizard window
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
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ede8 100%)',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontFamily: '"Crimson Pro", serif',
            color: '#2d3748',
            marginBottom: '0.5rem'
          }}>
            Compass Family Setup
          </h1>
          <p style={{ color: '#718096', fontSize: '1.1rem' }}>
            Create a personalized growth journey with complete point economy
          </p>
        </div>

        {/* Progress */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {['Values', 'Family', 'Questions', 'Insights', 'Complete'].map((label, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              opacity: idx <= step ? 1 : 0.4
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: idx <= step ? 'linear-gradient(135deg, #93c593 0%, #6ba86b 100%)' : '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.85rem'
              }}>
                {idx < step ? '✓' : idx + 1}
              </div>
              <span style={{
                fontSize: '0.75rem',
                color: idx <= step ? '#2d3748' : '#a0aec0',
                fontWeight: idx === step ? '600' : '400'
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          minHeight: '500px'
        }}>
          {/* Step 0: Values */}
          {step === 0 && (
            <div>
              <h2 style={{
                fontSize: '1.6rem',
                fontFamily: '"Crimson Pro", serif',
                color: '#2d3748',
                marginBottom: '1.5rem'
              }}>
                <Heart size={24} style={{ color: '#93c593', display: 'inline', marginRight: '0.5rem' }} />
                Your Family Values
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                {familyValues.map(value => (
                  <button
                    key={value.id}
                    onClick={() => handleValueToggle(value.id)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: value.selected ? '2px solid #93c593' : '2px solid #e2e8f0',
                      background: value.selected ? '#f0f7f0' : 'white',
                      cursor: 'pointer',
                      fontWeight: value.selected ? '600' : '400',
                      fontSize: '0.9rem'
                    }}
                  >
                    {value.name}
                  </button>
                ))}
              </div>
              {orderedValues.length > 0 && (
                <div style={{
                  background: '#f7fafc',
                  borderRadius: '10px',
                  padding: '1rem'
                }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                    Priority Order ({orderedValues.length})
                  </h3>
                  {orderedValues.map((value, index) => (
                    <div key={value.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem',
                      background: 'white',
                      borderRadius: '6px',
                      marginBottom: '0.5rem'
                    }}>
                      <span><strong>{index + 1}.</strong> {value.name}</span>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          onClick={() => moveValue(index, 'up')}
                          disabled={index === 0}
                          style={{
                            padding: '0.2rem 0.4rem',
                            borderRadius: '4px',
                            border: 'none',
                            background: index === 0 ? '#f7fafc' : '#e2e8f0',
                            cursor: index === 0 ? 'not-allowed' : 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveValue(index, 'down')}
                          disabled={index === orderedValues.length - 1}
                          style={{
                            padding: '0.2rem 0.4rem',
                            borderRadius: '4px',
                            border: 'none',
                            background: index === orderedValues.length - 1 ? '#f7fafc' : '#e2e8f0',
                            cursor: index === orderedValues.length - 1 ? 'not-allowed' : 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 1: Family */}
          {step === 1 && (
            <div>
              <h2 style={{
                fontSize: '1.6rem',
                fontFamily: '"Crimson Pro", serif',
                color: '#2d3748',
                marginBottom: '1.5rem'
              }}>
                <Users size={24} style={{ color: '#93c593', display: 'inline', marginRight: '0.5rem' }} />
                Add Your Family
              </h2>
              <div style={{
                background: '#f7fafc',
                borderRadius: '10px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr auto',
                  gap: '0.75rem',
                  alignItems: 'end'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '500' }}>Name</label>
                    <input
                      type="text"
                      value={currentMember.name}
                      onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                      placeholder="Enter name"
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '500' }}>Age</label>
                    <input
                      type="number"
                      value={currentMember.age}
                      onChange={(e) => setCurrentMember({ ...currentMember, age: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '500' }}>Role</label>
                    <select
                      value={currentMember.role}
                      onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.95rem',
                        background: 'white'
                      }}
                    >
                      <option value="child">Child</option>
                      <option value="adult">Adult</option>
                    </select>
                  </div>
                  <button
                    onClick={addFamilyMember}
                    style={{
                      padding: '0.6rem 1.25rem',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #93c593 0%, #6ba86b 100%)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              {familyMembers.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Family Members ({familyMembers.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {familyMembers.map(member => (
                      <div key={member.id} style={{
                        padding: '0.75rem',
                        background: '#f7fafc',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span><strong>{member.name}</strong> ({member.age} yrs, {member.role})</span>
                        <button
                          onClick={() => setFamilyMembers(familyMembers.filter(m => m.id !== member.id))}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#fee',
                            color: '#c53030',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
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
                fontSize: '1.6rem',
                fontFamily: '"Crimson Pro", serif',
                color: '#2d3748',
                marginBottom: '0.5rem'
              }}>
                About {currentMemberData.name}
              </h2>
              <p style={{ color: '#718096', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                ({currentMemberIndex + 1} of {familyMembers.length})
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                maxHeight: '450px',
                overflowY: 'auto',
                paddingRight: '0.5rem'
              }}>
                {(isCurrentChild
                  ? getQuestionsForChild(currentMemberData.age, questionnaires[currentMemberData.id] || {})
                  : getQuestionsForAdult(questionnaires[currentMemberData.id] || {})
                ).map((q) => (
                  <div key={q.id}>
                    <h3 style={{
                      fontSize: '1rem',
                      color: '#2d3748',
                      marginBottom: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {q.question}
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: q.options.length <= 2 ? `repeat(${q.options.length}, 1fr)` : 'repeat(2, 1fr)',
                      gap: '0.6rem'
                    }}>
                      {q.options.map(option => {
                        const isSelected = questionnaires[currentMemberData.id]?.[q.id] === option;
                        return (
                          <button
                            key={option}
                            onClick={() => handleQuestionAnswer(currentMemberData.id, q.id, option)}
                            style={{
                              padding: '0.75rem',
                              borderRadius: '8px',
                              border: isSelected ? '2px solid #93c593' : '2px solid #e2e8f0',
                              background: isSelected ? '#f0f7f0' : 'white',
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontSize: '0.9rem',
                              fontWeight: isSelected ? '600' : '400'
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
              <h2 style={{
                fontSize: '1.8rem',
                fontFamily: '"Crimson Pro", serif',
                color: '#2d3748',
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>
                <Sparkles size={28} style={{ color: '#93c593', display: 'inline', marginRight: '0.5rem' }} />
                Understanding Motivation
              </h2>
              <p style={{ textAlign: 'center', color: '#718096', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Here's what motivates each person
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                maxHeight: '450px',
                overflowY: 'auto'
              }}>
                {familyMembers.map(member => {
                  const motivation = motivationInsights[member.id];
                  return (
                    <div key={member.id} style={{
                      background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                      borderRadius: '10px',
                      padding: '1.25rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                        {member.name} (Age {member.age})
                      </h3>
                      <div style={{
                        padding: '0.4rem 0.8rem',
                        background: 'linear-gradient(135deg, #93c593 0%, #6ba86b 100%)',
                        color: 'white',
                        borderRadius: '16px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        display: 'inline-block',
                        marginBottom: '0.75rem'
                      }}>
                        🎯 {motivation.primary}
                      </div>
                      <p style={{ color: '#4a5568', lineHeight: '1.6', fontSize: '0.9rem' }}>
                        {motivation.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Complete Setup */}
          {step === 4 && generatedData && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '64px', marginBottom: '1rem' }}>🎉</div>
                <h2 style={{
                  fontSize: '2rem',
                  fontFamily: '"Crimson Pro", serif',
                  color: '#2d3748',
                  marginBottom: '0.5rem'
                }}>
                  Setup Complete!
                </h2>
                <p style={{ color: '#718096', fontSize: '1rem', marginBottom: '2rem' }}>
                  Your personalized family system is ready
                </p>
                <button
                  onClick={sendToMainApp}
                  style={{
                    padding: '1rem 2.5rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #93c593 0%, #6ba86b 100%)',
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(147, 197, 147, 0.4)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  ✨ Create My Family
                </button>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f0f7f0 0%, #e6f3e6 100%)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginTop: '2rem'
              }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#2d3748' }}>
                  📦 What's Included:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.9rem', color: '#4a5568' }}>
                  <div>✓ {familyMembers.length} family member{familyMembers.length !== 1 ? 's' : ''}</div>
                  <div>✓ Personalized routines</div>
                  <div>✓ Custom rewards menus</div>
                  <div>✓ Point economy system</div>
                  <div>✓ {orderedValues.length} family values</div>
                  <div>✓ Character development goals</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {step < 4 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '1.5rem'
          }}>
            <button
              onClick={prevStep}
              disabled={step === 0}
              style={{
                padding: '0.7rem 1.25rem',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                background: 'white',
                color: '#4a5568',
                fontWeight: '600',
                cursor: step === 0 ? 'not-allowed' : 'pointer',
                opacity: step === 0 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <ChevronLeft size={18} />
              Back
            </button>
            <button
              onClick={nextStep}
              style={{
                padding: '0.7rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #93c593 0%, #6ba86b 100%)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {step === 2 && currentMemberIndex < familyMembers.length - 1 ? 'Next Person' :
               step === 2 ? 'See Insights' : 'Continue'}
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
};

// Render the app
ReactDOM.render(<OnboardingWithPointEconomy />, document.getElementById('root'));
