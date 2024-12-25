# ScheduloFrontend

ScheduloFrontend is the Angular-based frontend application for the Schedulo project, a calendar scheduling platform similar to Calendly. The frontend interacts with the backend services to provide users with a seamless scheduling experience.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Folder Structure](#folder-structure)
- [Environment Configuration](#environment-configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication**: Supports OAuth login with Google and GitHub, and standard email registration/login.
- **Real-time Scheduling**: Integrates with Google Calendar API for syncing calendar events.
- **Role-based Access Control**: Implements roles (ADMIN and CLIENT) with role-specific permissions.
- **Dynamic Event Management**: Users can create, update, and manage events.
- **Responsive Design**: Fully responsive UI for optimal user experience across devices.

---

## Technologies Used

- **Framework**: Angular 17+ with standalone components (no NgModules).
- **Styling**: SCSS for modular and maintainable styles.
- **State Management**: RxJS for managing asynchronous data streams.
- **Calendar API Integration**: Google Calendar API.
- **Build Tooling**: Angular CLI for scaffolding and building the application.

---

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Angular CLI (v17 or later)
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/KingsleyAmankwah/schedulo-frontend
   ```

2. Navigate to the project directory:

   ```bash
   cd schedulo-frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:

   ```bash
   ng serve -o
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:4200
   ```

---

## Folder Structure

```plaintext
ScheduloFrontend/
├── src/
│   ├── app/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── services/        # Business logic and API calls
│   │   ├── models/          # Data models and interfaces
│   │   ├── directives/      # Custom directives
│   │   └── pipes/           # Custom pipes
│   ├── assets/              # Static assets (images, fonts, etc.)
│   ├── environments/        # Environment-specific configuration
│   └── styles/              # Global and theme styles
└── angular.json             # Angular CLI configuration
```

---

## Environment Configuration

Environment variables are managed in the `src/environments/` folder. Ensure you create the appropriate files for each environment:

- `environment.ts`: For development.

Example:

```typescript
export const environment = {
  production: false,
  BASE_URL: "http://localhost:8080/api/v1",
};
```

---

## Usage

1. **Authentication**: Users can log in or sign up using OAuth or standard email registration.
2. **Event Scheduling**: Use the dashboard to create and manage events.
3. **Role Management**: Admins have access to role-specific features like user management.

---

Happy coding!
