# Service Tracking Platform Backend

## About The Project

This backend application is a part of an AI-Powered Service Tracking Platform.
It provides RESTful API endpoints for managing customers, technicians, service requests, job assignments, locations, services, statuses, and AI-powered workflow automation.

The system allows customers to create service requests manually or through AI-assisted request classification.
Technicians can be automatically recommended and assigned to requests using AI-based matching.

The backend also includes:

- AI-powered service request classification
- AI urgency detection
- AI technician recommendation
- Status transition workflow engine
- Technician assignment tracking
- Location autocomplete integration (in progress)
- Dockerized backend and database setup
- JWT authentication and role-based authorization

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

# AI Features

## AI Smart Request Creation

Customers can create service requests using natural language descriptions.

Example:

```
"My internet connection stopped working and the router is blinking red."

```

The AI automatically:

- Classifies the service type
- Cleans and normalizes the request description
- Detects urgency
- Assigns request priority

## AI Technician Recommendation

The platform can automatically recommend the best technician for a request based on:

- Service specialization
- Technician role
- Request type
- Availability

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Sequelize ORM
- MySQL
- Docker
- Claude AI API
- JWT Authentication

## How To Run The Application

> [!NOTE]
> During development, the backend runs on http://localhost:3000.

## Local Development Setup

1. Clone the repository

```

git clone https://github.com/leta373/service-tracking-platform.git

```


2. Navigate to backend folder

```
cd backend

```


3. Install dependencies

```

npm install

```

4. Configure environment variables

Create .env.local

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
> Replace all placeholder values with your actual credentials.


53. Install dependencies

```
npm run dev

```

The backend will run on:

```
http://localhost:3000

```

# Docker Setup

The application includes a production-ready Docker setup.

## Run with Docker Compose

```
docker compose up --build

```

The backend will run on:

```
http://localhost:3000

```

The MySQL container will run on:

```
localhost:3307

```

## Docker Environment Configuration

Create .env.docker

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

## Docker Commands

### Build backend image

```
docker build -t service-tracking-backend .

```

### Run backend container

```
docker run -p 3000:3000 --env-file .env.docker service-tracking-backend

```

### Start all services

```
docker compose up

```

### Rebuild containers

```
docker compose up --build

```

### Stop containers

```
docker compose down

```

### Remove containers and database volumes

```
docker compose down -v

```

## Connecting To Docker MySQL

The Docker MySQL container is exposed on:

```
localhost:3307

```

You can connect using:

- MySQL Workbench
- DBeaver
- TablePlus
- CLI

Connection settings:

```
Host: localhost
Port: 3307
Username: root
Password: YOURPASSWORD

```

## Using MySQL Inside Docker Terminal

Open MySQL shell inside container:

```
docker exec -it backend-db-1 mysql -u root -p

```

Then:

```
SHOW DATABASES;
USE service_tracking_db;
SHOW TABLES;
SELECT * FROM ServiceRequests;

```

### Requirements
- Node.js 22+
- Docker Desktop
- MySQL 8
- TypeScript
- Claude API Key


## API Documentation

### Authentication

JWT authentication is required for protected routes.

Authorization header:

```
Authorization: Bearer YOUR_TOKEN

```

# Main Endpoints

## Authentication

### POST /auth/register

Registers a new user.

### POST /auth/login

Authenticates a user and returns JWT token.

## Service Requests
### GET /serviceRequests

Returns all service requests.

### GET /serviceRequests/{id}

Returns a service request by ID.

### POST /serviceRequests

Creates a standard service request manually.

Sample Request

```
{
  "customerId": 1,
  "serviceId": 2,
  "locationId": 1,
  "description": "Internet connection issue"
}

```

### POST /serviceRequests/smart

Creates an AI-powered service request.

The AI automatically:

- Detects service type
- Detects urgency
- Sets priority
- Cleans description

Sample Request

```
{
  "description": "The router is blinking red and internet is down",
  "locationId": 1
}

```

Sample Response

```
{
  "id": 1,
  "serviceId": 3,
  "priority": "High",
  "description": "Internet connection issue with router blinking red"
}

```

### PUT /serviceRequests/{id}

Updates a service request.

### DELETE /serviceRequests/{id}

Deletes a service request.

## Job Assignments

### POST /jobAssignments

Assigns a technician to a service request.

Only one active technician assignment is allowed per request.

### GET /jobAssignments/recommend/{serviceRequestId}

Uses AI to recommend the best technician for a request.

## Locations

### GET /locations

Returns all locations.

### GET /locations/autocomplete?q=value

Returns AI-powered address suggestions using external geolocation APIs.

Example:

```
/locations/autocomplete?q=Oslo

```

## Status Workflow

The platform includes a controlled status transition system.

Valid transitions:

```
Created → Assigned
Assigned → InProgress
InProgress → Completed
Any → Cancelled

```

Invalid transitions are automatically rejected.

## Database Relationships

Main relationships:

- User → ServiceRequests
- ServiceRequest → JobAssignments
- ServiceRequest → StatusHistory
- ServiceRequest → Location
- ServiceRequest → Service
- Technician → Assignments

## Security Features

- JWT authentication
- Role-based authorization
- Protected routes
- Input validation
- Transaction support
- Controlled workflow transitions

## Deployment

The backend is containerized and ready for deployment using:

- Docker
- Docker Compose
- Railway
- Render
- VPS deployments
- Cloud container services

Docker Hub repository:

[https://hub.docker.com/r/leta373/service-tracking-backend?utm_source=chatgpt.com](#service-tracking-backend Docker Hub Image)

## Future Improvements

Planned features:

- Real-time notifications
- WebSocket updates
- AI predictive maintenance
- Technician workload balancing
- AI analytics dashboard
- Frontend integration
- Kubernetes deployment
- CI/CD pipeline