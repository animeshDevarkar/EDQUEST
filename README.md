# EDQUEST Assignments & Projects Repository

Welcome to the central repository for **EDquest** development assignments and projects. This monorepo hosts full-stack applications, database designs, testing suites, and deployment workflows.

---

## 📂 Projects & Assignments

| # | Project Name | Tech Stack | Status | Documentation |
|---|---|---|---|---|
| **1** | [Node.js and Express Development Assignment](./Node.js%20and%20Express%20Development%20Assignment/) | Node.js, Express, MongoDB, Socket.io, Mocha & Chai | Completed | [README](./Node.js%20and%20Express%20Development%20Assignment/README.md) \| [Technical Docs](./Node.js%20and%20Express%20Development%20Assignment/DOCUMENTATION.md) |
| **2** | [Version Control, Testing & Deployment Assignment](./Version%20Control%2C%20Testing%20%26%20Deployment%20Assignment/) | Git, Jest/Mocha, CI/CD Workflows, Node.js | Completed | [Project Folder](./Version%20Control%2C%20Testing%20%26%20Deployment%20Assignment/) |
| **3** | [Mongoose Assignment](./mongoose-assignment/) | Node.js, MongoDB, Mongoose ODM | Completed | [Project Folder](./mongoose-assignment/) |
| **4** | [Interactive UI Development with React](./Interactive%20UI%20Development%20with%20React/) | React, Vite, Vitest, Lucide Icons, Modern CSS | Completed | [README](./Interactive%20UI%20Development%20with%20React/README.md) |

---

## 🛠️ Repository Organization

Each subfolder is an independent, self-contained project with its own `package.json`, source code, tests, and configuration:

```
EDQUEST/
├── Interactive UI Development with React/
│   ├── src/                 # React components, styles & test suite
│   ├── package.json         # React & Vitest dependencies
│   └── README.md            # React assignment documentation
├── Node.js and Express Development Assignment/
│   ├── src/                 # Express backend & Socket.io server
│   ├── public/              # Real-time chat web client (HTML/CSS/JS)
│   ├── test/                # Mocha & Chai automated test suite (16 tests)
│   ├── README.md            # Assignment setup & API reference
│   └── DOCUMENTATION.md     # In-depth architectural report
├── Version Control, Testing & Deployment Assignment/
│   └── ...                  # Testing, branching, and CI/CD assignment
├── mongoose-assignment/
│   └── ...                  # Schema modeling, queries, and research
├── .gitignore               # Global ignore rules for node_modules, envs
└── README.md                # Repository index & overview
```

---

## 🚀 Running Any Project Locally

Navigate into any project directory and follow its respective instructions:

```bash
# Example: Running the Node.js and Express Chat Application
cd "Node.js and Express Development Assignment"
npm install
npm test      # Run Mocha & Chai test suite
npm start     # Start the chat server on http://localhost:5000
```

---

## 👤 Author
**Animesh Devarkar**  
GitHub: [@animeshDevarkar](https://github.com/animeshDevarkar)
