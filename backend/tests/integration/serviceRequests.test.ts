import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';

describe('Service Requests API', () => {
    let customerToken: string;
    let serviceRequestId: number | undefined;
    let staffToken: string;

    beforeAll(async () => {
        const customerResponse = { email: 'customer@gmail.com', password: 'customer' };
        const response = await request(app).post('/api/auth/login').send(customerResponse);
        expect(response.body.statusCode).toBe(200);
        customerToken = response.body.token;

        const staffResponse = { email: 'staff@gmail.com', password: 'staff' };
        const staffLoginResponse = await request(app).post('/api/auth/login').send(staffResponse);
        expect(staffLoginResponse.body.statusCode).toBe(200);
        staffToken = staffLoginResponse.body.token;
    });
    test('POST /service-requests should create a new service request', async () => {
        const newServiceRequest = {
            customerId: 2,
            location: {
                display_name: '123 Main St, New York, NY 10001',
                address: {
                    city: 'New York',
                    state: 'NY',
                    postcode: '10001',
                },
            },
            description: 'This is a very urgent request to save a lion from a jungle.',
        };
        const response = await request(app)
            .post('/api/requests/smart')
            .set('Authorization', `Bearer ${customerToken}`)
            .send(newServiceRequest);
        expect(response.body.statusCode).toBe(201);

        expect(response.body.data.priority).toBe('High');
        serviceRequestId = response.body.data.id;
    });
    /* test('POST /service-requests should return 400 for missing fields', async () => {
        const incompleteServiceRequest = {
            customerId: 2,
            description: 'This is a very urgent request to save a lion from a jungle.',
        };
        const response = await request(app)
            .post('/api/requests/smart')
            .set('Authorization', `Bearer ${customerToken}`)
            .send(incompleteServiceRequest);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toContain('Missing required fields');
        console.log('Response body:', response.body);
    }); */

    afterAll(async () => {
        if (serviceRequestId && staffToken) {
            const response = await request(app)
                .delete(`/api/requests/${serviceRequestId}`)
                .set('Authorization', `Bearer ${staffToken}`);

            expect(response.body.statusCode).toBe(200);
            console.log('Delete response body:', response.body);
        }
    });
});
