import { test, expect } from '@playwright/test';
import PageObjectManager from '../pageObjects/pageObjectManager';

test('Browser Context Declaration', async ({ page }) => {
    const poManager = new PageObjectManager(page);

    const productName = 'ZARA COAT 3';

    const email = "sradichev420@gmail.com";
    const password = "bsA$Z5XWL55Hg4J";

    const loginPage = poManager.getLoginPage();

    await loginPage.goTo();

    await loginPage.validLogin(email, password);

    const dashboardPage = poManager.getDashboardPage();

    await dashboardPage.searchProduct(productName);

    await dashboardPage.navigateToCart();


    const cartProduct = page.locator(".cartSection h3").filter({ hasText: productName });

    await expect(cartProduct).toBeVisible();

    // Proceeding with checkout
    await page.locator("text=Checkout").click();

    await page.locator(".form__cc input.txt").nth(0).fill("4542 9931 9292 2293");
    await page.locator(".form__cc select.ddl").nth(0).selectOption("01");
    await page.locator(".form__cc select.ddl").nth(1).selectOption("16");
    await page.locator(".form__cc input.txt").nth(1).fill("123");
    await page.locator(".form__cc input.txt").nth(2).fill("Test User");
    await page.locator(".form__cc input[name='coupon']").fill("rahulshettyacademy");
    await page.locator(".form__cc button:has-text('Apply Coupon')").click();

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

    await expect(page.locator(".ta-results")).toBeHidden();
    await expect(page.locator(".ta-backdrop")).toBeHidden();

    // Validating email in checkout page
    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator(".action__submit").click();

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

    const rawOrderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();

    if (!rawOrderId) {
        throw new Error("There is no order id");
    }

    const orderId = rawOrderId.replaceAll("|", "").trim();

    await page.locator("button[routerlink*='myorders']").click();
    await expect(page.locator("tbody")).toBeVisible();

    const rows = page.locator("tbody tr");
    let orderFound = false;

    for (let i = 0; i < await rows.count(); i++) {
        const currId = (await rows.nth(i).locator("th").textContent())?.trim();

        if (currId === orderId) {
            await rows.nth(i).locator("button").first().click();
            orderFound = true;
            break;
        }
    }

    expect(orderFound).toBeTruthy();

    await expect(page.locator(".col-text")).toBeVisible();

    const orderIdDetails = (await page.locator(".col-text").textContent())?.trim();

    expect(orderIdDetails).toBeTruthy();
    expect(orderIdDetails).toBe(orderId);

    await page.locator("button[routerlink*='myorders']").click();
    await expect(page.locator("tbody")).toBeVisible();

    await page.locator('.btn-danger').click();

    await expect(page.getByText(' You have No Orders to show at this time.')).toBeVisible();
});