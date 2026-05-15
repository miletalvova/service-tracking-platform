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
    host: 'localhost:3000',
    basePath: '/',
    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: `JWT Authorization header using the Bearer scheme. 
            Enter ONLY your JWT token in the input below (without 'Bearer ' prefix).
            
            Example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ],
    schemas: ['http']
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/app.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated successfully.');
}).catch((err) => {
    console.error('Error generating Swagger documentation:', err);
});