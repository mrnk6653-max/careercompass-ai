const careers = [
  {
    id: 1,
    title: "Software Developer",
    category: "Technology",
    description:
      "Designs, builds, tests, and maintains software applications and systems.",
    interests: [
      "Technology",
      "Problem solving",
      "Building digital products",
      "Logical thinking",
    ],
    skills: [
      "Programming",
      "Data Structures and Algorithms",
      "Git",
      "Debugging",
      "Problem Solving",
    ],
    tags: [
      "Coding",
      "Software",
      "Web Development",
      "Applications",
    ],
    pathway:
      "Start with programming fundamentals, practise data structures and algorithms, learn Git, and build small projects. Explore web, mobile, or systems development to discover your preferred area.",
    activities: [
      "Build a to-do application",
      "Solve programming problems",
      "Create a small website",
    ],
    education: [
      "Computer Science or a related degree",
      "Other relevant degrees or alternative learning pathways",
    ],
    workStyles: [
      "Analytical thinking",
      "Independent problem solving",
      "Team collaboration",
    ],
  },

  {
    id: 2,
    title: "Data Scientist",
    category: "Data and AI",
    description:
      "Uses data, statistics, programming, and analytical methods to investigate questions and support decisions.",
    interests: [
      "Mathematics",
      "Finding patterns",
      "Research",
      "Working with data",
    ],
    skills: [
      "Python",
      "Statistics",
      "Data Analysis",
      "SQL",
      "Data Visualization",
      "Machine Learning",
    ],
    tags: [
      "Data",
      "Statistics",
      "Python",
      "Analytics",
      "Machine Learning",
    ],
    pathway:
      "Learn Python and basic statistics, practise analysing datasets, learn SQL and data visualization, and then explore machine learning through small projects.",
    activities: [
      "Analyse a public dataset",
      "Create a data visualization",
      "Build a simple prediction model",
    ],
    education: [
      "Computer Science, Statistics, Mathematics, Data Science, or a related field",
      "Alternative learning routes with appropriate mathematical and technical preparation",
    ],
    workStyles: [
      "Evidence-based reasoning",
      "Experimentation",
      "Analytical problem solving",
    ],
  },

  {
    id: 3,
    title: "AI Engineer",
    category: "Artificial Intelligence",
    description:
      "Develops software systems that use machine learning models and AI services to solve practical problems.",
    interests: [
      "Artificial intelligence",
      "Programming",
      "Mathematics",
      "Experimentation",
    ],
    skills: [
      "Python",
      "Programming",
      "Machine Learning",
      "Model Evaluation",
      "APIs",
      "Software Engineering",
    ],
    tags: [
      "AI",
      "Machine Learning",
      "Automation",
      "Python",
      "Intelligent Systems",
    ],
    pathway:
      "Build programming fundamentals, learn the mathematics needed for machine learning, study model training and evaluation, and create applications that integrate AI models.",
    activities: [
      "Build a simple text classifier",
      "Create an application using an AI API",
      "Compare the results of two models",
    ],
    education: [
      "Computer Science, AI, Mathematics, Data Science, or a related technical field",
      "Alternative learning routes supported by strong programming and mathematical skills",
    ],
    workStyles: [
      "Experimentation",
      "Technical problem solving",
      "Iterative development",
    ],
  },

  {
    id: 4,
    title: "Cybersecurity Analyst",
    category: "Cybersecurity",
    description:
      "Helps organizations identify security risks, investigate suspicious activity, and improve the protection of systems and data.",
    interests: [
      "Computer systems",
      "Security",
      "Investigating problems",
      "Networking",
    ],
    skills: [
      "Networking Fundamentals",
      "Linux",
      "Operating Systems",
      "Security Fundamentals",
      "Log Analysis",
      "Scripting",
    ],
    tags: [
      "Cybersecurity",
      "Networks",
      "Security",
      "Linux",
      "Risk Analysis",
    ],
    pathway:
      "Learn networking and operating-system fundamentals, practise Linux, study security principles, and use authorized cybersecurity labs to develop practical skills.",
    activities: [
      "Explore network traffic in a lab",
      "Review sample security logs",
      "Complete a beginner security challenge in an authorized environment",
    ],
    education: [
      "Computer Science, Cybersecurity, Information Technology, or a related field",
      "Relevant practical training and certifications may complement formal education",
    ],
    workStyles: [
      "Investigation",
      "Attention to detail",
      "Risk assessment",
    ],
  },

  {
    id: 5,
    title: "UI/UX Designer",
    category: "Design and Creativity",
    description:
      "Researches user needs and designs digital experiences that are understandable, useful, and accessible.",
    interests: [
      "Creativity",
      "Human behaviour",
      "Visual design",
      "Solving user problems",
    ],
    skills: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Visual Design",
      "Usability Testing",
      "Communication",
    ],
    tags: [
      "UI",
      "UX",
      "Design",
      "Prototyping",
      "User Experience",
    ],
    pathway:
      "Study design fundamentals, practise wireframing and prototyping, examine existing interfaces, and build a portfolio that explains your design decisions.",
    activities: [
      "Redesign a confusing interface",
      "Create a wireframe for a student app",
      "Test a prototype with users",
    ],
    education: [
      "Design, Human-Computer Interaction, Computer Science, or related fields",
      "Portfolio-based and alternative learning pathways may also be relevant",
    ],
    workStyles: [
      "Creative exploration",
      "User-focused problem solving",
      "Collaboration",
    ],
  },

  {
    id: 6,
    title: "Robotics Engineer",
    category: "Engineering and Research",
    description:
      "Designs, develops, integrates, or tests robotic systems that combine mechanical components, electronics, sensing, and software.",
    interests: [
      "Robotics",
      "Electronics",
      "Mathematics",
      "Building physical systems",
    ],
    skills: [
      "Programming",
      "Electronics",
      "Control Systems",
      "Mathematics",
      "Sensors",
      "Mechanical Fundamentals",
    ],
    tags: [
      "Robotics",
      "Automation",
      "Embedded Systems",
      "Engineering",
    ],
    pathway:
      "Build foundations in mathematics, programming, and electronics. Experiment with sensors and microcontrollers, then explore control systems and robotics projects.",
    activities: [
      "Simulate a simple robot",
      "Build a sensor-based project",
      "Program a small robotic movement",
    ],
    education: [
      "Robotics, Mechanical Engineering, Electrical Engineering, Electronics, or Computer Engineering",
      "The most relevant preparation depends on the robotics specialization",
    ],
    workStyles: [
      "Hands-on experimentation",
      "Systems thinking",
      "Interdisciplinary teamwork",
    ],
  },

  {
    id: 7,
    title: "Product Manager",
    category: "Business and Product",
    description:
      "Helps teams identify user problems, prioritize product improvements, and coordinate work toward product goals.",
    interests: [
      "Understanding people",
      "Planning",
      "Technology",
      "Decision making",
    ],
    skills: [
      "Communication",
      "Problem Definition",
      "Prioritization",
      "Data Interpretation",
      "Product Strategy",
      "Collaboration",
    ],
    tags: [
      "Product",
      "Planning",
      "Business",
      "Technology",
      "Strategy",
    ],
    pathway:
      "Learn how products are researched and developed, practise identifying user problems, study basic analytics, and create a product proposal supported by evidence.",
    activities: [
      "Interview users about a problem",
      "Write a simple product requirements document",
      "Prioritize features for a student application",
    ],
    education: [
      "Business, Engineering, Design, Computer Science, or other relevant backgrounds",
      "Product experience and demonstrated skills can be important",
    ],
    workStyles: [
      "Communication",
      "Cross-functional collaboration",
      "Decision making under uncertainty",
    ],
  },

  {
    id: 8,
    title: "Research Scientist",
    category: "Engineering and Research",
    description:
      "Investigates questions systematically by developing hypotheses, designing studies or experiments, analysing evidence, and communicating findings.",
    interests: [
      "Scientific questions",
      "Research",
      "Mathematics",
      "Experimentation",
    ],
    skills: [
      "Research Methods",
      "Critical Thinking",
      "Data Analysis",
      "Scientific Writing",
      "Subject Knowledge",
    ],
    tags: [
      "Research",
      "Science",
      "Experimentation",
      "Analysis",
    ],
    pathway:
      "Build strong foundations in a subject, learn research methods and data analysis, practise reading scientific papers, and conduct small supervised investigations.",
    activities: [
      "Reproduce a simple published experiment",
      "Compare two methods using data",
      "Write a short research report",
    ],
    education: [
      "Requirements depend strongly on the research field",
      "Many independent research positions require postgraduate study or a doctorate",
    ],
    workStyles: [
      "Curiosity",
      "Careful experimentation",
      "Evidence-based reasoning",
    ],
  },

  {
    id: 9,
    title: "Cloud Engineer",
    category: "Technology",
    description:
      "Builds and maintains computing infrastructure and services used to run applications reliably.",
    interests: [
      "Computer systems",
      "Networking",
      "Automation",
      "Infrastructure",
    ],
    skills: [
      "Linux",
      "Networking",
      "Scripting",
      "Cloud Fundamentals",
      "Security",
      "Monitoring",
    ],
    tags: [
      "Cloud",
      "Infrastructure",
      "DevOps",
      "Networking",
      "Automation",
    ],
    pathway:
      "Learn operating systems, networking, and scripting, then practise deploying applications and understanding cloud infrastructure, monitoring, and security.",
    activities: [
      "Deploy a small web application",
      "Practise basic Linux commands",
      "Create a simple deployment workflow",
    ],
    education: [
      "Computer Science, Information Technology, or related technical fields",
      "Practical experience and relevant certifications may also help",
    ],
    workStyles: [
      "Systems thinking",
      "Automation",
      "Reliability-focused problem solving",
    ],
  },

  {
    id: 10,
    title: "Game Developer",
    category: "Design and Creativity",
    description:
      "Creates interactive games by combining programming, game mechanics, design, testing, and player experience.",
    interests: [
      "Games",
      "Programming",
      "Interactive storytelling",
      "Creative problem solving",
    ],
    skills: [
      "Programming",
      "Game Engines",
      "Mathematics",
      "Game Design",
      "Debugging",
      "Teamwork",
    ],
    tags: [
      "Gaming",
      "Game Development",
      "Interactive Media",
      "Programming",
    ],
    pathway:
      "Learn programming fundamentals, build a very small game, study game mechanics, and explore a suitable game engine through increasingly complex projects.",
    activities: [
      "Build a basic 2D game",
      "Implement a scoring system",
      "Create a playable prototype",
    ],
    education: [
      "Computer Science, Game Development, Software Engineering, or related study",
      "A portfolio of completed games can demonstrate practical skills",
    ],
    workStyles: [
      "Creative problem solving",
      "Iterative testing",
      "Collaboration",
    ],
  },
];

module.exports = careers;