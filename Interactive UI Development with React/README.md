# Interactive UI Development with React - To-Do List Application

An interactive, responsive, feature-rich To-Do List application built with **React**, **Vite**, and **Lucide Icons**. This project serves as a comprehensive assignment submission demonstrating modern React fundamentals, state management techniques, component composition, and unidirectional props data passing.

---

## 🌟 Key Features

- 📝 **Task Management**: Create, edit, toggle completion, and delete tasks seamlessly.
- 🏷️ **Categorization & Priorities**: Group tasks by category (*Work, Personal, Urgent, Learning*) and priority (*Low, Medium, High*).
- 📅 **Due Dates & Overdue Alerts**: Attach due dates to tasks with automated overdue status detection.
- 📊 **Dynamic Statistics Dashboard**: Live completion progress bar and counters for Total, Completed, In Progress, and High Priority tasks.
- 🔍 **Real-Time Search & Filtering**: Instant search by keyword alongside status (*All, Active, Completed*) and priority filtering.
- ⚡ **Bulk Actions**: Batch mark all active tasks as complete or clear all finished tasks in one click.
- 💾 **LocalStorage Persistence**: Local storage sync ensuring task data and theme preferences persist across reloads.
- 🌓 **Dark / Light Theme Support**: Custom styled dark and light modes with smooth transitions.
- 🧪 **Automated Testing Suite**: Unit tests using **Vitest** and **React Testing Library** verifying state changes and component interactions.

---

## 🛠️ React Architecture & State Management

### 1. Component Hierarchy & Props Flow
The application follows standard React unidirectional data flow, where top-level state is maintained in `App.jsx` and passed down to child presentation components via props:

```
App.jsx (Holds State: todos, filter, priorityFilter, searchQuery, editingTodo, darkMode)
 ├── Header.jsx (Props: darkMode, toggleDarkMode, activeCount)
 ├── TodoStats.jsx (Props: todos)
 ├── TodoForm.jsx (Props: onAddTodo callback)
 ├── TodoFilter.jsx (Props: filter, priorityFilter, searchQuery, handlers...)
 ├── TodoList.jsx (Props: todos, onToggle, onDelete, onEdit, totalCount)
 │    └── TodoItem.jsx (Props: todo item, onToggle, onDelete, onEdit)
 └── TodoEditModal.jsx (Props: todo item, onSave, onClose)
```

### 2. Core React Concepts Demonstrated
- **Component State (`useState`)**:
  - Managing list array state (`todos`).
  - Controlled inputs for form creation and live filtering (`title`, `category`, `priority`, `dueDate`, `searchQuery`).
  - UI state management (`darkMode`, modal open/close states).
- **Side Effects & Lifecycle (`useEffect`)**:
  - Automatically persisting `todos` and theme settings to `localStorage` on state mutations.
  - Toggling class names on `document.documentElement` for application-wide theme switching.
- **Derived State (`useMemo`)**:
  - Optimizing task filtering based on active status, priority filters, and search queries without unnecessary state duplication.
- **Props & Event Handlers**:
  - Passing callback functions (`onAddTodo`, `onToggle`, `onDelete`, `onSaveEdit`) down to child components to maintain clean separation of concerns.

---

## 📁 Directory Structure

```
Interactive UI Development with React/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Application branding & theme toggle
│   │   ├── TodoStats.jsx        # Dynamic analytics dashboard & progress bar
│   │   ├── TodoForm.jsx         # Controlled form for task creation
│   │   ├── TodoFilter.jsx       # Search input & filter tab bar
│   │   ├── TodoList.jsx         # Container mapping filtered tasks
│   │   ├── TodoItem.jsx         # Task item card with actions & badges
│   │   └── TodoEditModal.jsx    # Modal dialog for task editing
│   ├── test/
│   │   ├── setup.js             # Vitest & Jest DOM setup configuration
│   │   └── App.test.jsx         # Automated component & state unit tests
│   ├── App.jsx                  # Main application state & handler hub
│   ├── App.css                  # Comprehensive CSS design & theme variables
│   └── main.jsx                 # React root entry point
├── package.json                 # Dependencies & project scripts
├── vite.config.js               # Vite & Vitest configuration
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation & Local Run

1. Navigate to the project directory:
   ```bash
   cd "Interactive UI Development with React"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser to view the application.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🧪 Running Automated Tests

Run the Vitest test suite to verify component state, props handling, adding, toggling, deleting, and filtering tasks:

```bash
npm test
```

Sample test output:
```
 ✓ src/test/App.test.jsx (6 tests)
   ✓ renders initial todo items and dashboard statistics
   ✓ allows user to add a new task (state modification)
   ✓ allows user to toggle completion state of a todo item
   ✓ allows user to delete a task
   ✓ filters tasks by status (Active / Completed)
   ✓ searches tasks by title query

 Test Files  1 passed (1)
      Tests  6 passed (6)
```

---

## 👤 Author
**Animesh Devarkar**  
GitHub: [@animeshDevarkar](https://github.com/animeshDevarkar)
