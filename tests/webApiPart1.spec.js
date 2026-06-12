import { test, expect, request } from '@playwright/test';
const loginPayload = { userEmail: "sradichev420@gmail.com", userPassword: "bsA$Z5XWL55Hg4J" };
const orderPayload = { orders: [{ country: "Bulgaria", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
let token = "";
let purchaseId = "";

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        { data: loginPayload }
    );

    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;

    const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
        data: orderPayload,
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
    })

    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);
    purchaseId = orderResponseJson.orders[0]
});

test('Login via API and place order', async ({ page }) => {
    const products = page.locator(".card-body");

    // Web API implementation
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    await page.goto("https://rahulshettyacademy.com/client");

    // await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    // console.log(orderId);

    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();

    const rows = page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); i++) {
        const currId = await rows.nth(i).locator("th").textContent();
        if (orderId.includes(currId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderIdDetails = await page.locator(".col-text").textContent();
    await expect(orderId.includes(orderIdDetails)).toBeTruthy();
});