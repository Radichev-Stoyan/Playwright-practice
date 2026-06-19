import { test, expect } from '@playwright/test';

test('Browser Context Declaration', async ({ page }) => {
    const productName = 'ZARA COAT 3';
    const email = "sradichev420@gmail.com";

    await page.goto("https://rahulshettyacademy.com/client");
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill("bsA$Z5XWL55Hg4J");
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForLoadState('networkidle');

    // alternative to waitForLoadState('networkidle') since it may behave a little flaky
    await page.locator(".card-body b").first().waitFor();

    // Selecting Zara Coat 3 and adding it to the cart
    await page
        .locator(".card-body")
        .filter({ hasText: productName })
        .getByRole("button", { name: " Add To Cart" })
        .click();

    // Accessing the cart
    await page.getByRole("listitem").getByRole('button', { name: 'Cart' }).click();

    await page.locator("div li").first().waitFor();
    await expect(page.getByText("ZARA COAT 3")).toBeVisible();

    // Proceeding with checkout
    await page.getByRole("button", { name: "Checkout" }).click();

    await page.locator(".form__cc input.txt").nth(0).fill("4542 9931 9292 2293");
    await page.locator(".form__cc select.ddl").nth(0).selectOption("01");
    await page.locator(".form__cc select.ddl").nth(1).selectOption("16");
    await page.locator(".form__cc input.txt").nth(1).fill("123");
    await page.locator(".form__cc input.txt").nth(2).fill("Test User");
    await page.locator(".form__cc input[name='coupon']").fill("rahulshettyacademy");
    await page.locator(".form__cc button:has-text('Apply Coupon')").click();

    // Validating dropdown with auto-suggestion
    const country = page.getByPlaceholder("Select Country");

    await expect(country).toBeVisible();
    await country.click();
    await page.keyboard.type("bul", { delay: 300 });

    await page.getByRole("button", { name: "Bulgaria" }).click();

    await page.getByText("Place Order ").click();

    await expect(page.getByText(" Thankyou for the order. ")).toBeVisible();
});