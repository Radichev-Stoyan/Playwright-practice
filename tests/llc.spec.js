import { test, expect } from '@playwright/test';

test('Playwright Special Locators', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Male");

    await page.getByPlaceholder("Password").fill("bsA$Z5XWL55Hg4J");

    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible();

    await page.getByRole("link", { name: "Shop" }).click();

    await page.locator("app-card").filter({ hasText: 'Nokia Edge' }).getByRole("button").click();
});