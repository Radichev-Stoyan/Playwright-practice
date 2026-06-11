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

test("Popup validations", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice");


    page.on("dialog", async dialog => {
        // console.log(dialog.message());
        await dialog.accept();
    });

    await page.locator("#confirmbtn").click();
});

test("Mouse Hovering", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice");

    await page.locator("#mousehover").hover();
    await page.locator(".mouse-hover a").first().click();
    await page.locator("#mousehover").hover();
    await page.locator(".mouse-hover a").last().click();
});

test.only("iFrame practice", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice");
    const framesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const txtContent = framesPage.locator(".text span").textContent();
    console.log(await txtContent);
});