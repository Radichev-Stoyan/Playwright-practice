import { test, expect } from '@playwright/test';

test("Calendar Validations", async ({ page }) => {
    const month = "8";
    const day = "12";
    const year = "2027";
    const expectedList = [month, day, year];

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.getByText(year).click();
    await page.locator(".react-calendar__tile").nth(Number(month) - 1).click();
    await page.locator(`//abbr[text()='${day}']`).click();

    const inputs = page.locator(".react-date-picker__inputGroup input:not([hidden])");

    for (let i = 0; i < expectedList.length; i++) {
        await expect(inputs.nth(i)).toHaveValue(expectedList[i]);
    }
});