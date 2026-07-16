import dotenv from 'dotenv';

const env = process.env.NODE_ENV;
console.log('NODE_ENV:', env);

if (env === 'local') {
    dotenv.config({ path: '.env.local' });
}
