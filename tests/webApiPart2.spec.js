import { test, expect } from '@playwright/test';
import { loginPayload } from './utils/credentials';

/** @type {import('@playwright/test').BrowserContext | undefined} */
let webContext;

test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/client");

    await page.locator("#userEmail").fill(loginPayload.userEmail);
    await page.locator("#userPassword").fill(loginPayload.userPassword);
    await page.locator("[value='Login']").click();

    await page.locator(".card-body b").first().waitFor();

    await context.storageState({ path: 'state.json' });

    webContext = await browser.newContext({ storageState: 'state.json' });

    await context.close();
});

test('Browser Context Declaration', async () => {
    if (!webContext) {
        throw new Error('Web context was not initialized');
    }

    const productName = 'ZARA COAT 3';
    const email = loginPayload.userEmail;

    const page = await webContext.newPage();

    await page.goto("https://rahulshettyacademy.com/client");

    const products = page.locator(".card-body");

    await page.locator(".card-body b").first().waitFor();

    const count = await products.count();

    for (let i = 0; i < count; i++) {
        const productTitle = (await products.nth(i).locator("b").textContent())?.trim();

        if (productTitle === productName) {
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();

    await page.locator("div li").first().waitFor();

    await expect(page.locator(`h3:has-text("${productName}")`)).toBeVisible();

    await page.locator("text=Checkout").click();

    await page.locator(".form__cc input.txt").nth(0).fill("4542 9931 9292 2293");
    await page.locator(".form__cc select.ddl").nth(0).selectOption("01");
    await page.locator(".form__cc select.ddl").nth(1).selectOption("16");
    await page.locator(".form__cc input.txt").nth(1).fill("123");
    await page.locator(".form__cc input.txt").nth(2).fill("Test User");
    await page.locator(".form__cc input[name='coupon']").fill("rahulshettyacademy");
    await page.locator(".form__cc button:has-text('Apply Coupon')").click();

    const country = page.locator("[placeholder*='Country']");

    await expect(country).toBeVisible();

    await country.click();

    await page.keyboard.type("bul", { delay: 300 });

    const options = page.locator(".ta-results");

    await options.waitFor();

    const optionsCount = await options.locator("button").count();

    for (let i = 0; i < optionsCount; i++) {
        const text = (await options.locator("button").nth(i).textContent())?.trim();

        if (text === "Bulgaria") {
            await options.locator("button").nth(i).click();
            break;
        }
    }

    await expect(page.locator(".user__name [type='text']").first()).toHaveValue(email);

    await page.locator(".action__submit").click();

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

    const orderId = (await page.locator(".em-spacer-1 .ng-star-inserted").textContent())?.trim();

    if (!orderId) {
        throw new Error("Order id is missing");
    }

    await page.locator("button[routerlink*='myorders']").click();

    await page.locator("tbody").waitFor();

    const rows = page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); i++) {
        const currId = (await rows.nth(i).locator("th").textContent())?.trim();

        if (currId && orderId.includes(currId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderIdDetails = (await page.locator(".col-text").textContent())?.trim();

    if (!orderIdDetails) {
        throw new Error("Order id details is missing");
    }

    expect(orderId).toContain(orderIdDetails);
});