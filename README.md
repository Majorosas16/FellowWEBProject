![alt text](/src/assets/Inicio.png)

# Fellow Web Project

Fellow is a digital platform designed to simplify pet care by centralizing your pet’s health history, vaccinations, medications, and vet visits. With a warm and trustworthy interface, Fellow helps pet owners stay organized and connected to their pets’ well-being.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Deployment](#deployment)
- [Dependencies](#dependencies)
- [Development Scripts](#development-scripts)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

## Features

- **Firebase Authentication:** Login and registration implemented using Firebase Auth.
- **Firestore Integration:** All user and content data stored and updated in real time.
- **Global State Management:** Powered by Redux Toolkit and React Redux.
- **Core Functionalities:** Three main features completed and interactive.
- **Pixel-Perfect Design:** Matches and fixed design concepts.
- **Full Responsiveness:** Works flawlessly across devices.
- **Protected Routes:** Route security using Redux and Firebase Auth.
- **Navigation:** Implemented with React Router.
- **Performance Optimized:** Efficient rendering and minimal loading times.
- **Clean Code:** Semantic naming, clear algorithms, modular architecture.
- **CRUD:** Create, Read, Update and delete actions.

## Technology Stack

- **Frontend:** React 19.x (TypeScript)
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **State Management:** Redux Toolkit, React Redux
- **Authentication & Database:** Firebase Auth + Firestore
- **Date Management:** date-fns
- **Linter & Quality:** ESLint, TypeScript
- **Styling:** Custom CSS (`App.css`, `index.css`)

## Project Structure

undefined

FELLOWWEBPROJECT/
├── node_modules/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ ├── hook/
│ ├── pages/
│ ├── redux/
│ ├── services/
│ ├── types/
│ ├── App.css
│ ├── App.tsx
│ ├── index.css
│ ├── main.tsx
│ ├── vite-env.d.ts
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts

undefined

All logic is organized into modules for maintainability. API interaction and business logic are located in `redux/` and `services/`.

## Installation

1. Make sure you have Node.js >= 16 and npm installed.
2. Clone this repository:

git clone https://<https://github.com/Majorosas16/FellowWEBProject.git>
cd FELLOWWEBPROJECT

3. **Install dependencies:**

npm install

4. **Environment Variables:**  
Create a `.env` file with your Firebase credentials.
5. **Run Development Server:**

npm run dev


## Deployment

1. **Build for production:**

npm run build

2. **Preview production build:**

npm run preview

3. **Host build output** on services like Vercel, Netlify, or Firebase Hosting.

## Usage

- Register or login with your credentials.
- Manage and view your pet’s health data, vaccinations, and vet visits.
- Navigate across app sections seamlessly.
- Protected routes and state logic ensure data privacy and reliability.

---

## Dependencies

| Dependency                | Version     | Purpose                     |
|---------------------------|------------|-----------------------------|
| @reduxjs/toolkit          | ^2.10.0    | State management            |
| firebase                  | ^12.5.0    | Auth & database             |
| react, react-dom          | ^19.1.1    | UI rendering                |
| react-redux               | ^9.2.0     | Redux bindings              |
| react-router, dom         | ^7.9.5     | SPA routing                 |
| date-fns                  | ^4.1.0     | Date management             |
| @types/…                  | Various    | TypeScript type support     |
| eslint, plugins           | Various    | Linting                     |
| typescript                | ~5.8.3     | Language support            |
| @vitejs/plugin-react      | ^5.0.2     | React + Vite integration    |

---

**Dev dependencies:**  
Includes ESLint, TypeScript, and relevant plugins for code consistency and quality.

## Development Scripts

| Script      | Function                              |
|-------------|---------------------------------------|
| `dev`       | Start development server (Vite)       |
| `build`     | Production build (TypeScript, Vite)   |
| `lint`      | Lint with ESLint                      |
| `preview`   | Preview production build locally      |

## Contribution Guidelines

- All code and documentation must be in English.
- Follow best practices for naming and componentization.
- Ensure UI changes align with original designs.
- Run `npm run lint` before pushing changes.
- Modularize logic and keep components reusable.
- Submit pull requests with descriptive messages.

---

## License

Distributed under the Fellow License. See `LICENSE` for details.

---

This README provides technical documentation for deploying, maintaining, and contributing to the Fellow Web Project.
