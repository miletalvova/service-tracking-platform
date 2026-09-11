const path = require('path');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: '.env.local'})
}

module.exports = {
    development: {
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT
            ? Number(process.env.DATABASE_PORT)
            : undefined,
        dialect: process.env.DIALECT || 'mysql',
    },

    production: {
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT
            ? Number(process.env.DATABASE_PORT)
            : undefined,
        dialect: process.env.DIALECT || 'mysql',
    },
};
