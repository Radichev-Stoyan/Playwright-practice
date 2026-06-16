import { test, expect } from "@playwright/test";
import { login } from "./utils/loginHelper";

const url = "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*";

test('Security test request intercept', async ({ page }) => {
    await login(page);
    await page.locator("button[routerlink*='myorders']").click();
    await page.route(url, route => route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6",
    }))
    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator(".blink_me")).toHaveText("You are not authorize to view this order");
});