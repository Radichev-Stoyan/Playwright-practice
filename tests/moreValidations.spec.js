import { test, expect } from '@playwright/test';
const url = "https://rahulshettyacademy.com/AutomationPractice";

test("Validating visibility of elements", async ({ page }) => {
    const testInput = page.locator("#displayed-text");

    await page.goto(url);
    // Checking if the input field is visible
    await expect(testInput).toBeVisible();
    // Hiding the input field and validating if it's hidden
    await page.locator("#hide-textbox").click();
    await expect(testInput).toBeHidden();
});

test("Popup validations", async ({ page }) => {
    await page.goto(url);


    page.on("dialog", async dialog => {
        // console.log(dialog.message());
        await dialog.accept();
    });

    await page.locator("#confirmbtn").click();
});

test("Mouse Hovering", async ({ page }) => {
    await page.goto(url);

    await page.locator("#mousehover").hover();
    await page.locator(".mouse-hover a").first().click();
    await page.locator("#mousehover").hover();
    await page.locator(".mouse-hover a").last().click();
});

test("iFrame practice", async ({ page }) => {
    await page.goto(url);
    const framesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const txtContent = framesPage.locator(".text span").textContent();
    console.log(await txtContent);
});

test("Screenshot and visual comparison", async ({ page }) => {
    const testInput = page.locator("#displayed-text");
    await page.goto(url);
    await expect(testInput).toBeVisible();
    await testInput.screenshot({ path: 'partialScreenshot.png' });
    await page.locator("#hide-textbox").click();
    await page.screenshot({ path: 'screenshot.png' });
    await expect(testInput).toBeHidden();
});

test.only("Visual", async ({ page }) => {
    await page.goto("https://www.google.com/");
    expect(await page.screenshot()).toMatchSnapshot("landing.png");
});