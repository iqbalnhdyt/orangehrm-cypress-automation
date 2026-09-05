# OrangeHRM Cypress Automation

UI automation testing portfolio project for the **OrangeHRM Open Source Demo** using Cypress and JavaScript.

> **Portfolio context:** This repository is a cleaned portfolio version of a QA Bootcamp final project. The original learning repository is preserved separately as a bootcamp archive. Because OrangeHRM is a public demo, shared data and application behavior can change between runs.

## Application Under Test

- **Application:** OrangeHRM Open Source Demo
- **Base URL:** https://opensource-demo.orangehrmlive.com
- **Focus:** Login, Directory, and Recruitment

## Tech Stack

- Cypress 15.20.1
- JavaScript
- Node.js
- Page Object Model (POM)
- JSON Fixtures
- `cy.intercept()` for network validation
- Git / GitHub

## Test Coverage

The repository contains **24 automated test cases** across three specs:

| Feature | Automated Tests | Main Coverage |
| --- | ---: | --- |
| Login | 8 | Page access, form input, valid login, invalid credentials, required fields |
| Directory | 8 | Page access, employee input, search, reset, no-result search, dropdown access |
| Recruitment | 8 | Module access, Candidates/Vacancies tabs, Add Candidate form, validation, input, cancel/save controls |
| **Total** | **24** | UI + network assertions |

## Project Structure

```text
orangehrm-cypress-automation/
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.js
│   │   ├── directory.cy.js
│   │   └── recruitment.cy.js
│   ├── fixtures/
│   │   ├── loginData.json
│   │   ├── directoryData.json
│   │   └── recruitmentData.json
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── DirectoryPage.js
│   │   └── RecruitmentPage.js
│   └── support/
│       └── e2e.js
├── scripts/
│   └── validate-portfolio.js
├── .gitignore
├── cypress.config.js
├── package.json
├── package-lock.json
└── README.md
```

## Test Architecture

**Page Object Model** keeps selectors and page actions outside the specs. **Fixtures** separate reusable test data from test logic. **Intercepts** validate important OrangeHRM API/auth requests alongside visible UI behavior.

Known OrangeHRM demo-side JavaScript exceptions are filtered narrowly in `cypress/support/e2e.js`; unexpected exceptions are not globally ignored.

## Installation

Requirements:

- Node.js 20.1+ (or another version supported by Cypress 15.20.1)
- npm

```bash
npm install
```

## Run Tests

Open Cypress interactively:

```bash
npm run cy:open
```

Run all specs headlessly:

```bash
npm run cy:run
```

The standard test command is equivalent:

```bash
npm test
```

Validate portfolio structure and hygiene:

```bash
npm run validate
```

## Public Demo Limitations

OrangeHRM Open Source Demo is shared publicly. Test data, available employees, response timing, and occasional demo-side JavaScript errors can change without notice. A failure caused by changed public demo data should be investigated and the fixture/test data updated rather than hidden with broad exception suppression.

The Directory suite intentionally uses a clearly invalid employee name for the no-result scenario. Tests that depend on available shared records may need fixture adjustment if the demo dataset changes.

## Portfolio Notes

This repository demonstrates:

- Cypress UI automation
- Positive and negative scenarios
- Page Object Model implementation
- Fixture-based test data
- Network request interception and validation
- UI assertions
- Test-suite organization and repository hygiene

Bootcamp learning archive: https://github.com/iqbalnhdyt/Sanbercode-Quality-Assurance

Portfolio repository: https://github.com/iqbalnhdyt/orangehrm-cypress-automation
