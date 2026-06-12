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
    const productName = 'ZARA COAT 3';
    const products = page.locator(".card-body");

    // Web API implementation
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    await page.goto("https://rahulshettyacademy.com/client");

    // await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    const titles = await page.locator(".card-body b").allTextContents();

    // Selecting Zara Coat 3 and adding it to the cart
    const count = await products.count();
    for (let i = 0; i < count; i++) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    };

    // Accessing the cart
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator(`h3:has-text("${productName}")`).isVisible();
    await expect(bool).toBeTruthy();

    // Proceeding with checkout
    await page.locator("text=Checkout").click();

    await page.locator(".form__cc input.txt").nth(0).fill("4542 9931 9292 2293");
    await page.locator(".form__cc select.ddl").nth(0).selectOption("01");
    await page.locator(".form__cc select.ddl").nth(1).selectOption("16");
    await page.locator(".form__cc input.txt").nth(1).fill("123");
    await page.locator(".form__cc input.txt").nth(2).fill("Test User");
    await page.locator(".form__cc input[name='coupon']").fill("rahulshettyacademy");
    await page.locator(".form__cc button:has-text('Apply Coupon')").click();

    // await page.locator("[placeholder*='Country']").pressSequentially('bul', { delay: 300 });
    // await page.locator("[placeholder*='Country']").fill('bul');

    // Validating dropdown with auto-suggestion
    const country = page.locator("[placeholder*='Country']");

    await expect(country).toBeVisible();
    await country.click();
    await page.keyboard.type("bul", { delay: 300 });

    const options = page.locator(".ta-results");
    await options.waitFor();
    const optionsCount = await options.locator("button").count();
    for (let i = 0; i < optionsCount; i++) {
        const text = await options.locator("button").nth(i).textContent();
        if (text === " Bulgaria") {
            await options.locator("button").nth(i).click();
            break;
        }
    }

    // Validating email in checkout page
    await expect(page.locator(".user__name [type='text']").first()).toHaveText(loginPayload.userEmail);
    await page.locator(".action__submit").click();

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

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