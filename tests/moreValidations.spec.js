import { test, expect } from '@playwright/test';

test("Validating visibility of elements", async ({ page }) => {
    const testInput = page.locator("#displayed-text");

    await page.goto("https://rahulshettyacademy.com/AutomationPractice");
    // Checking if the input field is visible
    await expect(testInput).toBeVisible();
    // Hiding the input field and validating if it's hidden
    await page.locator("#hide-textbox").click();
    await expect(testInput).toBeHidden();
});

test.only("Popup validations", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice");


    page.on("dialog", async dialog => {
        // console.log(dialog.message());
        await dialog.accept();
    });

    await page.locator("#confirmbtn").click();
});