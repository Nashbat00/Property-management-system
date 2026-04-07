# HomeLink - Property Management System

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-Academic-blue)
![Course](https://img.shields.io/badge/Course-SWE332-orange)

> A modern, real-time property management platform connecting building managers and residents through a seamless digital experience.

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Team Members](#team-members)
- [Technology Stack](#technology-stack)
- [Architecture Documentation](#architecture-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Git Workflow](#git-workflow)
- [Course Information](#course-information)

## Project Overview

HomeLink is a modern, web-based property management platform designed to streamline communication and administrative tasks between building managers and residents. The system provides a centralized digital solution for managing monthly dues, tracking payments, handling maintenance requests, and broadcasting announcements within a residential building.

The application follows a **client-server architecture** built with **React 18** as the frontend single-page application (SPA), **Supabase** as the backend-as-a-service (BaaS) providing a PostgreSQL database, authentication, and real-time capabilities, **Tailwind CSS** for responsive utility-first styling, and **Vercel** for production deployment with CI/CD integration. Communication between the client and server is handled through **REST API** calls and **WebSocket** real-time subscriptions.

## Problem Statement

Traditional building management relies on paper-based records, group chats, and informal communication channels, leading to several critical problems:

| Problem | Impact |
|---------|--------|
| **Opaque financial records** | Residents cannot verify dues calculations or payment history |
| **Scattered communication** | Announcements get lost in group chats, reducing resident engagement |
| **Manual payment tracking** | Managers spend hours reconciling payments manually, leading to errors |
| **Unstructured maintenance requests** | Requests are forgotten, delayed, or ignored without a formal tracking system |
| **No audit trail** | Disputes over payments and requests cannot be resolved objectively |

**HomeLink solves these problems** by providing a centralized, real-time digital platform with role-based access, automated balance calculations, and a complete audit trail for all operations.

## Key Features

### Manager Features
- **User Management:** Register and manage resident accounts with role-based access control
- **Dues Management:** Create and assign monthly dues to all building units
- **Payment Confirmation:** Review and confirm or reject resident payment notifications
- **Announcements:** Post building-wide announcements visible to all residents
- **Unit Overview:** View all units with their current balances and payment statuses

### Resident Features
- **Dashboard:** View personal unit balance, outstanding dues, and payment history
- **Dues Tracking:** See assigned monthly dues and current outstanding balance
- **Payment Notification:** Notify manager after making a payment for confirmation
- **Maintenance Requests:** Submit maintenance requests with description and track their status (pending, in progress, resolved)
- **Announcements:** View all announcements posted by the building manager

### System Features
- **Real-time Updates:** Instant data synchronization across all connected clients via Supabase Realtime WebSocket
- **Role-based Access Control:** Strict separation between Manager and Resident roles at both UI and database level
- **Responsive Design:** Fully responsive interface optimized for desktop, tablet, and mobile devices
- **Secure Authentication:** Email/password authentication with JWT tokens and automatic session management

## Team Members

| Name | Student ID | Role | Branch |
|------|-----------|------|--------|
| Bager Diren Karakoyun | 210513250 | Project Lead + Scenarios (+1 View) | `feature/readme-scenarios` |
| Abdalrahman Mazen Ahmad Nashbat | 230513079 | Logical Architecture (Class Diagram) | `feature/logical-view` |
| Deo Gratias Kipioka Mutipula | 220513571 | Process Architecture (Sequence + Activity Diagrams) | `feature/process-view` |
| Maryama Said Mohamoud | 210513248 | Physical + Development Architecture | `feature/physical-dev-view` |
| Alawi Khaled Alhamed | 230513621 | Goals & Constraints + Size/Performance + Quality | `feature/goals-quality` |

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | React 18 | Component-based UI development |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Backend / Database | Supabase (PostgreSQL) | Data storage + auto-generated REST API |
| Authentication | Supabase Auth | User registration, login, session management |
| Real-time | Supabase Realtime | WebSocket-based live data updates |
| Hosting | Vercel | Static site hosting with CI/CD |
| Version Control | GitHub | Source code management + Git history |
| Language | JavaScript (ES6+) | Core programming language |

## Architecture Documentation

The software architecture of HomeLink is documented following the **4+1 View Model** by Philippe Kruchten (1995). The full architecture document covers the following views:

| Section | View | Responsible |
|---------|------|-------------|
| Section 1-3 | Scope, References, Architecture Overview | Bager Diren Karakoyun |
| Section 4 | Architectural Goals & Constraints | Alawi Khaled Alhamed |
| Section 5 | Logical View (Class Diagram) | Abdalrahman Mazen Ahmad Nashbat |
| Section 6 | Process View (Sequence & Activity Diagrams) | Deo Gratias Kipioka Mutipula |
| Section 7 | Development View (Component & Package Diagrams) | Maryama Said Mohamoud |
| Section 8 | Physical View (Deployment Diagram) | Maryama Said Mohamoud |
| Section 9 | Scenarios (+1 View - Use Cases) | Bager Diren Karakoyun |
| Section 10-11 | Size/Performance & Quality | Alawi Khaled Alhamed |

For the complete documentation, please refer to [ARCHITECTURE.md](ARCHITECTURE.md).

## Project Structure

```
homelink/
├── src/
│   ├── components/
│   │   ├── auth/              # Login, SignUp, ProtectedRoute
│   │   ├── dashboard/         # Manager & Resident Dashboards
│   │   ├── dues/              # Dues creation and listing
│   │   ├── payments/          # Payment history and confirmation
│   │   ├── maintenance/       # Maintenance request form and list
│   │   └── announcements/     # Announcement form and list
│   ├── hooks/                 # useAuth, useRealtime custom hooks
│   ├── lib/                   # Supabase client configuration
│   ├── pages/                 # Login, Signup, Dashboard, NotFound
│   ├── utils/                 # Utility functions (calculations)
│   ├── App.jsx                # Root component with routing
│   └── main.jsx               # Application entry point
├── supabase/                  # Database migrations and seed data
├── .env.example               # Environment variable template
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite build configuration
├── vercel.json                # Vercel deployment configuration
├── ARCHITECTURE.md            # Software Architecture Document
└── README.md                  # This file
```

## Database Schema

The system uses 6 PostgreSQL tables managed by Supabase:

| Table | Description |
|-------|-------------|
| `users` | Stores user accounts with role (manager/resident), email, and profile info |
| `units` | Building units with unit number, floor, and current balance |
| `dues` | Monthly dues records with amount, month, and creation date |
| `payments` | Payment records with amount, date, status (pending/confirmed/rejected) |
| `maintenance_requests` | Maintenance requests with description, status, and timestamps |
| `announcements` | Building announcements with title, content, and creation date |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Nashbat00/Property-management-system.git

# Navigate to project directory
cd Property-management-system

# Install dependencies
npm install

# Set up environment variables (copy and fill in your Supabase credentials)
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Git Workflow

This project follows a **feature-branch workflow**:

1. Each team member works on their own feature branch
2. Changes are committed with meaningful, conventional commit messages
3. A Pull Request is opened when the work is complete
4. The Project Lead (Bager) reviews and merges all PRs into `main`

## Course Information

| | |
|---|---|
| **Course** | SWE332 - Software Architecture |
| **Semester** | Spring 2026 |
| **Assignment** | Part 2 - Architecture Documentation using 4+1 View Model |
| **Team Size** | 5 Students |
| **Pull Request Deadline** | April 7-8, 2026 |
| **Final Submission** | April 10, 2026 - 17:00 |

## Acknowledgments

This project was developed as part of the SWE332 Software Architecture course. The architecture documentation follows the **4+1 View Model** proposed by Philippe Kruchten (1995), a widely adopted methodology for describing software architecture from multiple concurrent perspectives.

## License

This project is developed for academic purposes as part of the SWE332 course at the university. All rights reserved by the team members.

---

**Project Repository:** [https://github.com/Nashbat00/Property-management-system](https://github.com/Nashbat00/Property-management-system)
