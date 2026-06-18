import { test, expect, request } from '@playwright/test';
import APIUtils from './utils/APIUtils';
import dotenv from 'dotenv';

dotenv.config();

/** @type {{ token: string, orderId: string }} */
let response = {
    token: "",
    orderId: ""
};

const loginPayload = {
    userEmail: process.env.USER_EMAIL,
    userPassword: process.env.USER_PASSWORD
};

const orderPayload = {
    orders: [
        {
            country: "Bulgaria",
            productOrderedId: "6960eac0c941646b7a8b3e68"
        }
    ]
};

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);

    response = await apiUtils.createOrder(orderPayload);

    await apiContext.dispose();
});

test('Login via API and place order', async ({ page }) => {
    if (!response.token || !response.orderId) {
        throw new Error("Token or order id is missing");
    }

    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client");

    await page.locator(".card-body b").first().waitFor();

    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();

    const rows = page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); i++) {
        const currId = (await rows.nth(i).locator("th").textContent())?.trim();

        if (currId && response.orderId.includes(currId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderIdDetails = (await page.locator(".col-text").textContent())?.trim();

    if (!orderIdDetails) {
        throw new Error("Order id details is missing");
    }

    expect(response.orderId).toContain(orderIdDetails);
});