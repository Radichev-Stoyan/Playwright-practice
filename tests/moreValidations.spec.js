import { test, expect } from '@playwright/test';

test("Popup validations", async ({ page }) => {
    const testInput = page.locator("#displayed-text");

    await page.goto("https://rahulshettyacademy.com/AutomationPractice");
    await expect(testInput).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(testInput).toBeHidden();
});