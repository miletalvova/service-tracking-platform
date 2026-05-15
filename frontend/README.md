# Service Tracking Platform — Frontend
 
The frontend for the Service Tracking Platform. Built with Next.js and TypeScript, it provides role-based dashboards for customers, staff, and technicians.
 
> **Status:** In progress.
 
---
 
## Tech Stack
 
- Next.js 15
- TypeScript
- Tailwind CSS
- JWT Authentication
---
 
## Planned Features
 
### Customer Dashboard

- Submit a service request using natural language
- View request status in real time
- View request history

### Staff Dashboard

- View all incoming service requests
- Assign technicians manually or via AI recommendation
- Monitor technician workload

### Technician Dashboard

- View assigned jobs
- Update job status
- View job details and location

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
NEXT_PUBLIC_API_URL=http://localhost:3000
```
 
4. Run in development mode

```bash
npm run dev
```
 
The frontend will be available at `http://localhost:3001`.
 
---
 
## Environment Variables
 
| Variable | Description |
|---|---|
| NEXT_PUBLIC_API_URL | URL of the backend API |
 
---
 
## Deployment
 
Frontend deployment via Vercel is planned.