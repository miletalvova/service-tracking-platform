# Service Tracking Platform — Frontend
 
The frontend for the Service Tracking Platform. Built with React, Vite and TypeScript, it provides role-based dashboards for customers, staff, and technicians.
 
> **Status:** In progress
 
---

## About The Project

The Service Tracking Platform is a full-stack web application for managing maintenance and on-demand service requests.

The frontend provides separate user experiences for different roles:

- **Customers** create service requests, track progress, and view assigned technicians.
- **Staff** manage incoming requests, assign technicians, and monitor request wokflows.
- **Technicians** manage assigned jobs and update their progress.

The application communicates with the backend API using JWT-based authentication and Role-Based Access Control (RBAC).

---

## Features

### Authentication

- User registration
- Secure login with JWT authentication
- Authomatic logout when JWT expires
- Protected routes
- Role-based navigation
- Persistent login using Local Storage

---
 
### Customer Dashboard

- Create service request using natural language
- AI-powered request classification
- Smart address search using OpenStreetMap
- View active service requests
- Track request status
- View assigned technician
- View priority

---

### Staff Dashboard (In Progress)

- View all incoming service requests
- Assign technicians manually or via AI recommendation
- Monitor technician workloads
- Manage service request lifecycle
- View platform statistics

---

### Technician Dashboard (In Progress)

- View assigned jobs
- Update request status
- View customer information
- View service location

---

### Home Page

- Platform overview
- Workflow visualization
- Technology stack
- Platform statistics
- Feature highlights

---
 
## Tech Stack

### Core

- React 19
- Vite 8
- TypeScript

### Routing

- React Router

### HTTP Client

- Axios

### Authentication

- JWT Authentication
- Role-Based Access Control (RBAC)

### Maps

- OpenStreetMaps (Nominatim)

### UI

- CSS
- Material UI Icons

---
 
## Local Development
 
### Requirements
 
- Node.js 22+
- Backend API running (see [backend/README.md](../backend/README.md))

### Installation

1. Clone the repository

```bash
git clone https://github.com/miletalvova/service-tracking-platform
```
 
2. Navigate to the frontend folder

```bash
cd frontend
```
 
3. Install dependencies

```bash
npm install
```
 
4. Create `.env.local`

```
VITE_API_URL=http://localhost:3000
```
 
5. Start the development server

```bash
npm run dev
```
 
The frontend will be available at `http://localhost:5173`.
 
---
 
## Environment Variables
 
| Variable | Description |
|---|---|
| VITE_API_URL | URL of the backend API |

Example:

```env
VITE_API_URL=http://localhost:3000
```
 
---
 
## Deployment
 
The frontendis deployed on **Vercel**.

The production application communicates with:

- **Backend:** Render
- **Database:** Aiven MySQL

Deployment is fully automated thriugh GitHub.

---

## Related Projects

Backend repository:

```
backend/
```

Backend README contains:

- REST API documentation
- Docker setup
- Deployment
- Database configuration
- Swagger documentation