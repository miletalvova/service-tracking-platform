# Service Tracking Platform — Frontend
 
The frontend for the Service Tracking Platform. Built with React, Vite and TypeScript, it provides role-based dashboards for customers, staff, and technicians.
 
> **Status:** In progress
 
---

## About The Project

The Service Tracking Platform is a full-stack application designed to streamline service management workflows.

The frontend provides separate user experiences for different roles:

- Customers can submit and track service requests.
- Staff can manage requests and assign technicians.
- Technicians can view and update assigned jobs.

The application communicates with the backend API using JWT-based authentication and role-based authorization.

---
 
## Tech Stack

Core

- React 19
- Vite 8
- TypeScript

Styling

- Tailwind CSS

Authentication

- JWT Authentication

---
 
## Planned Features
 
### Customer Dashboard

- Submit a service request using natural language
- AI-powered request classification
- View request status in real time
- View request history
- View assigned technician information

### Staff Dashboard

- View all incoming service requests
- Assign technicians manually or via AI recommendation
- Monitor technician workload
- Manage service request lifecycle

### Technician Dashboard

- View assigned jobs
- Update job status
- View job details and location
- Mark jobs as completed

---
 
## Local Development Setup
 
### Requirements
 
- Node.js 22+
- Backend API running (see [backend/README.md](../backend/README.md))

### Steps
 
1. Navigate to the frontend folder

```bash
cd frontend
```
 
2. Install dependencies

```bash
npm install
```
 
3. Create `.env.local`

```
VITE_API_URL=http://localhost:3000
```
 
4. Run in development mode

```bash
npm run dev
```
 
The frontend will be available at `http://localhost:5173`.
 
---
 
## Environment Variables
 
| Variable | Description |
|---|---|
| VITE_API_URL | URL of the backend API |
 
---
 
## Deployment
 
Frontend deployment via Vercel is planned.
