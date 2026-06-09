import { test, expect } from '@playwright/test';

test("Calendar Validations", async ({ page }) => {
    const month = "6";
    const day = "15";
    const year = "2026";

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.getByText(year).click();
    await page.locator(".react-calendar__tile").nth(Number(month) - 1).click();
    await page.locator(`//abbr[text()='${day}']`).click();
});