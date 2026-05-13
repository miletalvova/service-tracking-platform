# Service Tracking Platform

A full-stack, AI-powered platform for managing property maintenance and on-demand services such as plumbing, electrical work, IT support, and cleaning.
 
Customers submit service requests using natural language. The AI classifies the request, detects urgency, and recommends the best available technician automatically. Staff manage and monitor all requests. Technicians receive assignments and update job status in real time.
 
**GitHub:** [github.com/miletalvova/service-tracking-platform](https://github.com/miletalvova/service-tracking-platform)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js, TypeScript |
| Database | MySQL, Sequelize ORM |
| Authentication | JWT, Role-Based Access Control |
| AI | Anthropic Claude API |
| Frontend | Next.js (in progress) |
| Real-Time | WebSockets (planned) |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| API Docs | Swagger |

---

## System Roles
 
| Role | Capabilities |
|---|---|
| Customer | Create and track service requests |
| Staff | Manage requests, assign technicians, monitor workload |
| Technician | View assigned jobs, update job status |
 
---
 
## AI Features
 
### Smart Request Creation

Customers describe their issue in plain language. Claude classifies the service type, cleans the description, detects urgency, and sets priority automatically.
 
### AI Technician Recommendation

Claude analyzes available technicians and recommends the best match based on skills, current workload, and availability.
 
---
 
## Project Structure
 
```
service-tracking-platform/
├── backend/          # Node.js + Express REST API
├── frontend/         # Next.js frontend (in progress)
├── .github/
│   └── workflows/    # GitHub Actions CI/CD
└── README.md
```
 
---
 
## Quick Start
 
### Run with Docker Compose (recommended)
 
```bash
git clone https://github.com/miletalvova/service-tracking-platform.git
cd service-tracking-platform
```
 
Create `backend/.env.docker`:
 
```
ADMIN_USERNAME=root
ADMIN_PASSWORD=yourpassword
DATABASE_NAME=service_tracking_db
DIALECT=mysql
PORT=3000
HOST=db
JWT_SECRET=your_secret
ANTHROPIC_API_KEY=your_api_key
```
 
Then run:
 
```bash
docker compose up --build
```
 
| Service | URL |
|---|---|
| Backend API | http://localhost:3000 |
| MySQL | localhost:3307 |
| API Docs | http://localhost:3000/doc |
 
---
 
## Local Development
 
See [backend/README.md](backend/README.md) for backend setup instructions.
 
See [frontend/README.md](frontend/README.md) for frontend setup instructions.
 
---
 
## CI/CD
 
The project uses GitHub Actions to automatically build and push a Docker image to Docker Hub on every push to `main`.
 
Docker Hub: [hub.docker.com/r/leta373/service-tracking-backend](https://hub.docker.com/repository/docker/leta373/service-tracking-backend/general)
 
---
 
## Deployment
 
The backend is containerized and ready to deploy to any container-friendly platform such as Render, Railway, or a VPS. Frontend deployment via Vercel is planned.
 
---
 
## Status
 
| Component | Status |
|---|---|
| Backend API | Complete |
| AI Features | Complete |
| Docker Setup | Complete |
| CI/CD | Complete |
| Frontend | In Progress |
| WebSockets | Planned |
| Tests | Planned |