const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
    info: {
        version: '1.0.0',
        title: 'Service Tracking Platform API',
        description: `REST API for the Service Tracking Platform with AI powered service request classification and technician assignment.
        
        Features:
        - JWT-based authentication and authorization
        - AI Smart Request Creation
        - AI Technician Recommendation
        - Status Transition Management
        - Real-time Assignment Workflow
        `,
            contact: {
                name: 'Mileta Lvova',
                email: 'mileta279@gmail.com'
            }
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local development server'
        }
    ],
    components: {
        securitySchemes: {
            JWT: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: `JWT Authorization header using the Bearer scheme. 
                Enter ONLY your JWT token in the input below (without 'Bearer ' prefix).
                
                Example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
            }
        },
        schemas: {
            ApiError: {
                type: "object",
                properties: {
                    status: { type: "string", example: "error" },
                    statusCode: { type: "integer", example: 400 },
                    message: { type: "string", example: "Bad Request" },
                }
            },
            JobAssignment: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    serviceRequestId: { type: "integer", example: 101 },
                    technicianId: { type: "integer", example: 202 },
                    assignedAt : { type: "string",format: "date-time", nullable: true, example: "2024-06-01T12:00:00Z" },
                    unassignedAt : { type: "string",format: "date-time", nullable: true, example: null },
                    createdAt : { type: "string",format: "date-time", nullable: true, example: "2024-06-01T12:00:00Z" },
                    updatedAt : { type: "string",format: "date-time", nullable: true, example: "2024-06-01T12:00:00Z" },
                }
            },
            JobAssignmentInput: {
                type: "object",
                required: ['serviceRequestId', 'technicianId'],
                properties: {
                    serviceRequestId: { type: "integer", example: 101 },
                    technicianId: { type: "integer", example: 202 }
                }
            },
            JobAssignmentUpdateInput: {
                type: "object",
                properties: {
                    serviceRequestId: { type: "integer", example: 101 },
                    technicianId: { type: "integer", example: 202 }
                }
            },
            Location: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    address: { type: "string", example: "123 Main St" },
                    city: { type: "string", example: "New York" },
                    state: { type: "string", example: "NY" },
                    zipCode: { type: "string", example: "10001" },
                }
            },
            LocationInput: {
                type: "object",
                properties: {
                    address: { type: "string", example: "123 Main St" },
                    city: { type: "string", example: "New York" },
                    state: { type: "string", example: "NY" },
                    zipCode: { type: "string", example: "10001" },
                }
            },
            LocationUpdateInput: {
                type: "object",
                properties: {
                    address: { type: "string", example: "123 Main St" },
                    city: { type: "string", example: "New York" },
                    state: { type: "string", example: "NY" },
                    zipCode: { type: "string", example: "10001" },
                }
            },
            Service: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    specialization: { type: "string", example: "Plumbing" },
                    description: { type: "string", example: "All plumbing related services" },
                }
            },
            ServiceInput: {
                type: "object",
                properties: {
                    specialization: { type: "string", example: "Plumbing" },
                    description: { type: "string", example: "All plumbing related services" },
                }
            },
            ServiceUpdateInput: {
                type: "object",
                properties: {
                    specialization: { type: "string", example: "Plumbing" },
                    description: { type: "string", example: "All plumbing related services" },
                }
            },
            Technician: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    assignmentId: { type: "integer", example: 1 },
                    Assigned: { type: "string", example: "2026-05-29T12:30:00.000Z" },
                    Created: { type: "string", example: "2026-05-29T12:30:00.000Z" },
                    Updated: { type: "string", example: "2026-05-29T12:30:00.000Z" },
                    technicianId: { type: "integer", example: 1 },
                    FullName: { type: "string", example: "John Doe" },
                    Email: { type: "string", example: "johndoe@example.com" },
                    Customer: { type: "string", example: "Richard Miles" },
                    CustomerEmail: { type: "string", example: "richardmiles@example.com" },
                    Service: { type: "string", example: "Plumbing" },
                    Address: { type: "string", example: "123 Main St, New York, NY, 10001" },
                    Status: { type: "string", example: "Assigned" },
                }
            },
            StatusUpdateInput: {
                type: "object",
                required: ["statusId"],
                properties: {
                    statusId: { type: "integer", example: 3 },
                }
            },
            TechnicianUpdateInput: {
                type: "object",
                properties: {
                    skills: { type: "string", example: "Plumbing, Electrical"},
                    isAvailable: { type: "boolean", example: true },
                    currentLocationId: { type: "integer", example: 1 },
                    maxActiveJobs: { type: "integer", example: 3 },
                }
            },
            TechnicianProfile: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    userId: { type: "integer", example: 1 },
                    skills: { type: "string", example: "Plumbing, Electrical"},
                    isAvailable: { type: "boolean", example: true },
                    currentLocationId: { type: "integer", example: 1 },
                    maxActiveJobs: { type: "integer", example: 3 },
                }
            },
        },
        responses: {
            BadRequest: {
                description: "Bad Request",
                content: {
                    "application/json": {
                        schema: { $ref: '#/components/schemas/ApiError'}
                    }
                }
            },
            Unauthorized: {
                description: "Unauthorized - Authentication required",
                content: {
                    "application/json": {
                        schema: { $ref: '#/components/schemas/ApiError'}
                    }
                }
            },
            Forbidden: {
                description: "Forbidden - Insufficient permissions",
                content: {
                    "application/json": {
                        schema: { $ref: '#/components/schemas/ApiError'}
                    }
                }
            },
            NotFound: {
                description: "Not found",
                content: {
                    "application/json": {
                        schema: { $ref: '#/components/schemas/ApiError'}
                    }
                }
            },
            InternalServerError: {
                description: "Internal Server Error",
                content: {
                    "application/json": {
                        schema: { $ref: '#/components/schemas/ApiError'}
                    }
                }
            }
        }
    },
    security: [{ JWT: []}],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/app.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated successfully.');
}).catch((err) => {
    console.error('Error generating Swagger documentation:', err);
});