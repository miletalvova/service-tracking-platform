import { Location } from '../models/location.js';

export async function seedLocations() {
    const locations = [
        {
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
        },
        {
            address: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90001',
        },
        {
            address: '789 Pine Rd',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
        },
    ];
    for (const locationData of locations) {
        await Location.findOrCreate({
            where: {
                address: locationData.address,
                city: locationData.city,
                state: locationData.state,
                zipCode: locationData.zipCode,
            },
        });
    }
    console.log('Locations seeded successfully.');
}
