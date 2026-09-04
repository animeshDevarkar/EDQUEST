# E-Commerce Order & Discount Management System

> **Assignment:** Version Control, Software Testing, and Continuous Deployment Demonstration  
> **Author:** Animesh Devarkar  
> **Tech Stack:** Node.js, Jest, Git, GitHub Actions  

---

## 📖 Project Overview

This repository demonstrates modern software engineering workflows:
1. **Version Control Management:** Structured Git branching, atomic commits, GitFlow/GitHub Flow best practices, and clean merge operations.
2. **Automated Testing Suite:** Robust unit and integration test coverage using **Jest**, following the **Arrange-Act-Assert (AAA)** pattern, test doubles/spies, and boundary condition validation.
3. **CI/CD Automation:** Declarative multi-environment pipeline implemented via **GitHub Actions** (`.github/workflows/ci.yml`) triggering automated builds, matrix testing across Node.js LTS versions, code coverage artifact generation, and deployment stage gating.

---

## 📂 Project Architecture

```
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI/CD Pipeline
├── src/
│   ├── models/
│   │   └── Order.js             # Order domain model with item aggregation
│   ├── services/
│   │   ├── DiscountService.js   # Coupon and volume discount processing engine
│   │   ├── OrderService.js      # Core orchestrator for checkout workflows
│   │   ├── PaymentGateway.js    # External payment gateway interface & mock
│   │   └── TaxService.js        # Multi-region sales tax calculation engine
│   └── index.js                 # Sample execution script
├── tests/
│   ├── integration/
│   │   └── OrderService.test.js # End-to-end checkout & dependency mock tests
│   └── unit/
│       ├── DiscountService.test.js # Discount computation unit tests
│       ├── Order.test.js        # Order model validation & subtotal unit tests
│       ├── PaymentGateway.test.js # Payment processing & refund unit tests
│       └── TaxService.test.js   # Regional tax calculation unit tests
├── .gitignore                   # Version control ignore definitions
├── package.json                 # Project dependencies & npm scripts
└── README.md                    # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: v2.20.0 or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/animeshDevarkar/version-control-testing-deployment.git

# Navigate into project directory
cd version-control-testing-deployment

# Install dependencies
npm install
```

### Running Automated Tests
```bash
# Run all unit and integration tests with Jest
npm test

# Run tests with detailed code coverage report
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch
```

### Running Sample Application
```bash
npm start
```

---

## 🧪 Testing Strategy

The test suite is structured around the **Testing Pyramid**:
- **Unit Tests:** Validate isolated domain logic (Order validation, tax rate lookup, discount calculations).
- **Integration Tests:** Verify collaboration between `OrderService`, `TaxService`, `DiscountService`, and `PaymentGateway`.
- **Mocking & Test Doubles:** Uses `jest.spyOn()` to simulate third-party payment gateway failures and edge cases without relying on live external networks.

---

## 🔄 CI/CD Pipeline (`.github/workflows/ci.yml`)

The automated workflow triggers on any `push` or `pull_request` to `main` and `develop`:
1. **Matrix Build & Test:** Executes test suites simultaneously across Node 18, 20, and 22.
2. **Coverage Artifact:** Automatically captures and archives test coverage reports.
3. **Staging & Production Deployment Gates:** Executes automated zero-downtime deployment steps upon merge into corresponding branches.

---

## 📜 License
MIT License. Developed for Version Control, Testing & Deployment Coursework.
