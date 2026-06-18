import dotenv from 'dotenv';

dotenv.config();

const userEmail = process.env.USER_EMAIL;
const userPassword = process.env.USER_PASSWORD;

if (!userEmail || !userPassword) {
    throw new Error('Missing USER_EMAIL or USER_PASSWORD environment variables');
}

export const loginPayload = {
    userEmail,
    userPassword
};