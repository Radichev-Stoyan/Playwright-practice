import dotenv from 'dotenv';

dotenv.config();

const url = "https://rahulshettyacademy.com/client";

const loginDetails = {
    userEmail: process.env.USER_EMAIL,
    userPassword: process.env.USER_PASSWORD
}

export async function login(page) {
    await page.goto(url);
    await page.locator("#userEmail").fill(loginDetails.userEmail);
    await page.locator("#userPassword").fill(loginDetails.userPassword);
    await page.locator("[value='Login']").click();
    await page.locator(".card-body b").first().waitFor();
}