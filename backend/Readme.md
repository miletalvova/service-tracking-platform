# Service Tracking Platform Backend

## About The Project

The backend for the Service Tracking Platform. A REST API built with Node.js, Express.js, and TypeScript, backed by MySQL via Sequelize ORM. Includes JWT authentication, role-based access control, AI-powered workflows, and a controlled status transition engine.

For demonstration purposes, the backend includes automatic seed data for:

- Roles
- Statuses
- Services
- Locations

If you don't want to use the seed data, comment out the seed functions in your startup/bootstrap logic before running the application.

Example:

```
await seedRoles();
await seedStatuses();
await seedServices();
await seedLocations();

```

---


## AI Features

### AI Smart Request Creation

Customers describe their issue in plain language. Claude automatically classifies the request:
 
- Detects service type (Plumbing, Electrical, IT Support, Cleaning, etc.)
- Cleans and normalizes the description
- Detects urgency using tool use
- Sets request priority (Low / Medium / High)

Example input:

```
"My internet connection stopped working and the router is blinking red."

```

Claude returns structured data that is saved directly to the database.

### AI Technician Recommendation

The platform can automatically recommend the best technician for a service request based on:

- Skill match with the service type
- Current workload (active job count)
- Availability status
- Maximum active jobs capacity


Claude receives a filtered list of available technicians and returns the best match with a reason.


---

## Tech Stack

- Node.js 22
- Express.js 5
- TypeScript
- Sequelize ORM
- MySQL 8
- Docker + Docker Compose
- Anthropic Claude API
- JWT Authentication

---


## System Roles
 
| Role | Description |
|---|---|
| Customer | Creates and tracks service requests |
| Staff | Manages requests and assigns technicians |
| Technician | Views assigned jobs and updates status |


---

## Database Schema
 
Core tables:
 
| Table | Description |
|---|---|
| Users | All users with role reference |
| Roles | Customer, Staff, Technician |
| ServiceRequests | Customer requests with AI-classified data |
| Services | Service categories (Plumbing, Electrical, etc.) |
| JobAssignments | Technician assignments per request |
| StatusHistory | Full audit trail of status changes |
| Locations | Address data for requests and technicians |
| Statuses | Created, Assigned, InProgress, Completed, Cancelled |
| TechnicianProfiles | Skills, availability, workload capacity per technician |
 
All relationships are defined via Sequelize associations and follow 3NF.
 
---
 
## Authentication Flow
 
1. User registers via `POST /api/auth/register`
2. Password is hashed with bcrypt before storage
3. User logs in via `POST /api/auth/login`
4. Server returns a signed JWT token
5. Client sends token in the `Authorization: Bearer <token>` header
6. Middleware validates token and attaches user + role to the request


---

## API Endpoints
 
Full documentation is available at `/doc` (Swagger) when the server is running.
 
### Auth
 
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT token |
 
### Service Requests
 
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/requests | Get all service requests |
| GET | /api/requests/:id | Get request by ID |
| POST | /api/requests | Create request (AI-powered) |
| POST | /api/requests/smart | Create request using AI — classifies service type, detects urgency, sets priority automatically
| PUT | /api/requests/:id | Update request |
| DELETE | /api/requests/:id | Delete request (Staff only) |
| PATCH | /api/requests/:id/status | Update request status |

### POST /api/requests
Creates a service request manually. Requires `serviceId` to be provided by the client.

### POST /api/requests/smart
Creates an AI-powered service request. Only requires a plain text `description` and `locationId`.
Claude automatically classifies the service type, cleans the description, detects urgency, and sets priority.

Sample request:
{
  "description": "The router is blinking red and internet is down",
  "locationId": 1
}
 
### Job Assignments
 
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/assignments | Get all assignments |
| GET | /api/assignments/:id | Get assignment by ID |
| GET | /api/assignments/recommend/:serviceRequestId | AI technician recommendation |
| POST | /api/assignments | Create manual assignment |
| PUT | /api/assignments/:id | Update assignment (Staff only) |
| DELETE | /api/assignments/:id | Delete assignment (Staff only) |
 
### Technicians
 
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/technicians/assigned-requests | Get assigned jobs (Technician only) |
| PATCH | /api/technicians/:id/status | Update job status (Technician only) |
| PATCH | /api/technicians/location | Update current location (Technician only) |
 
### Services and Locations
 
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/services | Get all services |
| GET | /api/locations | Get all locations |
 
---


## Local Development Setup

### Requirements
 
- Node.js 22+
- MySQL 8
- Anthropic API 

### Steps

1. Clone the repository

```bash
git clone https://github.com/leta373/service-tracking-platform.git
cd service-tracjing-platform/backend
```

2. Install dependencies

```bash
npm install
```

3. Create .env.local

Example:

```
ADMIN_USERNAME=root
ADMIN_PASSWORD=YOURPASSWORD
DATABASE_NAME=service_tracking_db
DIALECT=mysql
PORT=3000
HOST=localhost
JWT_SECRET=YOUR_SECRET
ANTHROPIC_API_KEY=YOUR_API_KEY
```

> [!WARNING]
> Replace all placeholder values with your actual credentials. Never commit .env.local to version control.


The API will be available at `http://localhost:3000`.

---


## Docker Setup

### Run with Docker Compose

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Backend API | http://localhost:3000 |
| MySQL | localhost:3307 |


### Create `.env.docker`

Example:

```
ADMIN_USERNAME=root
ADMIN_PASSWORD=YOURPASSWORD
DATABASE_NAME=service_tracking_db
DIALECT=mysql
PORT=3000
HOST=db
JWT_SECRET=YOUR_SECRET
ANTHROPIC_API_KEY=YOUR_API_KEY
```

> [!NOTE]
> `HOST=db` refers to the MySQL container name in Docker Compose, not localhsot.

### Useful Docker Commands

```bash
# Start all services
docker compose up

# Rebuild and start
docker compose up --build

# Stop all servcies
docker compose down

# Stop and remove database volumes
docker compose down -v

# Build backend image only
docker build -t service-tracking-backend .

# Run backend container only
docker run -p 3000:3000 --env-file .env.docker service-tracking-backend
```

### Connect to MySQL inside Docker

```bash
docker exec -it backend-db-1 mysql -u root -p
```

```sql
SHOW DATABASES;
USE service_tracking_db;
SHOW TABLES;
SELECT * FROM ServiceRequests;
```

External connection settings:
 
```
Host: localhost
Port: 3307
Username: root
Password: yourpassword
```

---

## Seed Data
 
On startup, the application automatically seeds:
 
- Roles (Customer, Staff, Technician)
- Statuses (Created, Assigned, InProgress, Completed, Cancelled)
- Services (Plumbing, Electrical, IT Support, Cleaning, etc.)
- Locations (sample addresses)

To disable seeding, comment out the seed calls:
 
```typescript
// await seedRoles();
// await seedStatuses();
// await seedServices();
// await seedLocations();
```
 
---
 
## Security
 
- JWT authentication on all protected routes
- Role-based middleware (isAuth, isStaff, isTechnician)
- Password hashing with bcrypt
- Input validation on all request bodies
- Transaction support for all multi-step database operations
- Controlled status transition engine — invalid transitions are rejected
---
 
## Docker Hub
 
Pre-built image available at:
 
[hub.docker.com/r/leta373/service-tracking-backend](https://hub.docker.com/repository/docker/leta373/service-tracking-backend/general)