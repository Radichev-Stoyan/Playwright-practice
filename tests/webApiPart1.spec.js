import { test, expect, request } from '@playwright/test';
import APIUtils from './utils/APIUtils';
import dotenv from 'dotenv';

dotenv.config();

let response = {};
const loginPayload = {
    userEmail: process.env.USER_EMAIL,
    userPassword: process.env.USER_PASSWORD
}
const orderPayload = { orders: [{ country: "Bulgaria", productOrderedId: "6960eac0c941646b7a8b3e68" }] };

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
});

test('Login via API and place order', async ({ page }) => {
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client");

    // await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();

    const rows = page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); i++) {
        const currId = await rows.nth(i).locator("th").textContent();
        if (response.orderId.includes(currId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});