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
const fakePayLoadOrders = { data: [], message: "No Orders" };

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
});

test('API response intercepting and replacing', async ({ page }) => {
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*", async route => {
        const orderResponse = await page.request.fetch(route.request());
        await route.fulfill({
            orderResponse,
            body: JSON.stringify(fakePayLoadOrders)
        })
    });

    await page.locator("button[routerlink*='myorders']").click();
    // Avoiding errors due to slow or delayed response
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    console.log(await page.locator(".mt-4").textContent());
});