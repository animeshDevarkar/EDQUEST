export const initialCourses = [
  {
    id: 'course-1',
    title: 'Modern React Architecture & Component Patterns',
    category: 'Frontend',
    instructor: 'Sarah Jenkins',
    difficulty: 'Intermediate',
    durationHours: 12,
    rating: 4.9,
    progress: 75,
    status: 'In Progress',
    isBookmarked: true,
    tags: ['React 19', 'Components', 'Props', 'Context API'],
    description: 'Master component composition, props contracts, unidirectional data flow, custom hooks, and state lifting techniques.',
    notes: 'Covered state lifting, props drilling avoidance, and compound component patterns.'
  },
  {
    id: 'course-2',
    title: 'TypeScript for Production Web Applications',
    category: 'Frontend',
    instructor: 'Alex Rivera',
    difficulty: 'Advanced',
    durationHours: 16,
    rating: 4.8,
    progress: 100,
    status: 'Completed',
    isBookmarked: true,
    tags: ['TypeScript', 'Generics', 'React JSX', 'Type Safety'],
    description: 'Comprehensive guide to building strongly typed React components with interface contracts and strict typing.',
    notes: 'Completed all generic prop interface exercises and utility types.'
  },
  {
    id: 'course-3',
    title: 'Full Stack Node.js & Express REST APIs',
    category: 'Backend',
    instructor: 'Michael Chen',
    difficulty: 'Intermediate',
    durationHours: 20,
    rating: 4.7,
    progress: 40,
    status: 'In Progress',
    isBookmarked: false,
    tags: ['Node.js', 'Express', 'REST API', 'Middleware'],
    description: 'Design robust RESTful APIs, custom middleware chains, authentication pipelines, and integration test suites.',
    notes: 'Currently building JWT auth middleware.'
  },
  {
    id: 'course-4',
    title: 'UI/UX Design Systems & Micro-Interactions',
    category: 'Design',
    instructor: 'Elena Rostova',
    difficulty: 'Beginner',
    durationHours: 10,
    rating: 4.9,
    progress: 0,
    status: 'Not Started',
    isBookmarked: false,
    tags: ['Figma', 'Design Systems', 'CSS Variables', 'Accessibility'],
    description: 'Learn component design tokens, accessibility guidelines, responsive layout math, and CSS animation principles.',
    notes: ''
  },
  {
    id: 'course-5',
    title: 'MongoDB Data Modeling & Aggregations',
    category: 'Data',
    instructor: 'David Kim',
    difficulty: 'Advanced',
    durationHours: 14,
    rating: 4.6,
    progress: 10,
    status: 'In Progress',
    isBookmarked: false,
    tags: ['MongoDB', 'Mongoose', 'Aggregations', 'Indexing'],
    description: 'Architect scalable NoSQL schema models, aggregation pipelines, performance indexing, and document relationships.',
    notes: 'Studied pipeline stage performance.'
  },
  {
    id: 'course-6',
    title: 'Automated Testing with Vitest & React Testing Library',
    category: 'Testing',
    instructor: 'Marcus Vance',
    difficulty: 'Intermediate',
    durationHours: 8,
    rating: 4.9,
    progress: 90,
    status: 'In Progress',
    isBookmarked: true,
    tags: ['Vitest', 'Testing Library', 'Unit Tests', 'DOM Testing'],
    description: 'Write effective unit and integration tests for React components, props validation, and user interaction flows.',
    notes: 'Practicing fireEvent and userEvent testing hooks.'
  }
];

export const CATEGORIES = ['All', 'Frontend', 'Backend', 'Design', 'Data', 'Testing'];
export const STATUSES = ['All', 'Not Started', 'In Progress', 'Completed'];
export const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];
