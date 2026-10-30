export const interestAreas = [
  { id: 'logic', name: 'Logic & Problem Solving', description: 'Find patterns, reason through problems, and test solutions.', icon: 'Brain', color: 'teal', time: '5 min', signal: 72 },
  { id: 'creative', name: 'Creativity & Design', description: 'Imagine experiences, communicate visually, and improve ideas.', icon: 'Palette', color: 'violet', time: '4 min', signal: 58 },
  { id: 'science', name: 'Science & Investigation', description: 'Ask questions, investigate evidence, and understand how things work.', icon: 'FlaskConical', color: 'amber', time: '6 min', signal: 44 },
  { id: 'business', name: 'Business & Strategy', description: 'Make decisions, organize resources, and spot opportunities.', icon: 'ChartNoAxesCombined', color: 'blue', time: '5 min', signal: 39 },
  { id: 'people', name: 'People & Communication', description: 'Explain ideas, listen, collaborate, and support others.', icon: 'Users', color: 'rose', time: '4 min', signal: 63 },
  { id: 'building', name: 'Building & Engineering', description: 'Design practical solutions and understand how systems fit together.', icon: 'Wrench', color: 'green', time: '6 min', signal: 51 },
  { id: 'data', name: 'Data & Research', description: 'Explore information, spot trends, and draw careful conclusions.', icon: 'ChartColumn', color: 'blue', time: '5 min', signal: 67 },
  { id: 'society', name: 'Society & Environment', description: 'Understand communities and work on real-world challenges.', icon: 'Leaf', color: 'green', time: '4 min', signal: 42 },
]

export const careers = [
  { id: 'software', title: 'Software Developer', category: 'Technology', description: 'Design, build, test, and maintain software that solves practical problems.', interests: ['Logic & Problem Solving', 'Building & Engineering'], skills: ['Programming fundamentals', 'Problem solving', 'Git and collaboration'], pathway: 'Build programming fundamentals, create small projects, and explore internships or further study.', tags: ['Problem solving', 'Building'], level: 'Beginner-friendly exploration' },
  { id: 'data', title: 'Data Analyst', category: 'Data & Research', description: 'Use data to answer questions, find patterns, and help people make decisions.', interests: ['Data & Research', 'Logic & Problem Solving'], skills: ['Spreadsheets', 'SQL basics', 'Data visualization'], pathway: 'Start with spreadsheets and basic statistics, then build a small analysis project.', tags: ['Research', 'Patterns'], level: 'Beginner-friendly exploration' },
  { id: 'ux', title: 'UX / Product Designer', category: 'Design', description: 'Understand user needs and design digital experiences that are clear and useful.', interests: ['Creativity & Design', 'People & Communication'], skills: ['Observation', 'Wireframing', 'User research'], pathway: 'Study everyday usability problems and create a simple prototype with feedback.', tags: ['Creativity', 'People'], level: 'Beginner-friendly exploration' },
  { id: 'research', title: 'Research Assistant', category: 'Science & Research', description: 'Support investigations by collecting information, reviewing evidence, and documenting findings.', interests: ['Science & Investigation', 'Data & Research'], skills: ['Research methods', 'Clear writing', 'Data handling'], pathway: 'Explore a topic, learn how to evaluate sources, and document a small investigation.', tags: ['Investigation', 'Evidence'], level: 'Depends on field and institution' },
  { id: 'educator', title: 'Educator / Learning Designer', category: 'Education', description: 'Help people learn through teaching, explanations, activities, and learning resources.', interests: ['People & Communication', 'Creativity & Design'], skills: ['Communication', 'Planning', 'Feedback'], pathway: 'Explain a topic to someone, gather feedback, and explore relevant teaching pathways.', tags: ['Communication', 'Learning'], level: 'Varies by role and location' },
  { id: 'entrepreneur', title: 'Entrepreneurship', category: 'Business', description: 'Identify a problem, test an idea, and build a sustainable product or service.', interests: ['Business & Strategy', 'Creativity & Design'], skills: ['Customer discovery', 'Planning', 'Communication'], pathway: 'Interview potential users, test a small solution, and learn from evidence.', tags: ['Strategy', 'Building'], level: 'Exploration pathway' },
]

export const initialTasks = [
  { id: 1, title: 'Explore two careers that interest you', category: 'Explore', duration: '20 min', done: true },
  { id: 2, title: 'Complete an interest discovery challenge', category: 'Discover', duration: '10 min', done: false },
  { id: 3, title: 'Choose one beginner skill to practise', category: 'Learn', duration: '15 min', done: false },
  { id: 4, title: 'Write down one question to investigate', category: 'Reflect', duration: '5 min', done: false },
]
