import dotenv from 'dotenv';

dotenv.config();

export const loginPayload = {
    userEmail: process.env.USER_EMAIL,
    userPassword: process.env.USER_PASSWORD
};

if (!loginPayload.userEmail || !loginPayload.userPassword) {
    throw new Error('Missing USER_EMAIL or USER_PASSWORD environment variables');
}