import { test, expect } from '@playwright/test';

test('Browser Context Declaration', async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();
	// Blocking certain requests
	page.route("**/*.{jpg,png,jpeg}", route => route.abort());
	const userName = page.locator("#username");
	const signIn = page.locator("#signInBtn");
	const cardTitles = page.locator(".card-body a");
	page.on("request", request => console.log(request.url()));
	page.on("response", response => console.log(response.url(), response.status()));

	await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

	await userName.fill("rahulshettyacade");
	await page.locator("[type='password']").fill("Learning@830$3mK2");
	await signIn.click();

	console.log(await page.locator("[style*='block']").textContent());

	await expect(page.locator("[style*='block']")).toContainText("Incorrect");

	await userName.fill("");
	await userName.fill("rahulshettyacademy");
	await signIn.click();
});

test('UI Controls', async ({ page }) => {
	await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
	const userName = page.locator("#username");
	const signIn = page.locator("#signInBtn");
	const documentLink = page.locator(".float-right a");
	const dropDown = page.locator("select.form-control");
	await dropDown.selectOption("consult");

	await page.locator(".radiotextsty").last().click();
	await page.locator("#okayBtn").click();

	// assertions for checking if the radio button is actually selected
	await expect(page.locator(".radiotextsty").last()).toBeChecked();
	/* we can use row 48 to check in the console if we are getting the correct output boolean value
	console.log(await page.locator(".radiotextsty").last().isChecked());
	*/

	await page.locator("#terms").click();
	await expect(page.locator("#terms")).toBeChecked();
	await page.locator("#terms").uncheck();
	expect(await page.locator("#terms").isChecked()).toBeFalsy();

	await expect(documentLink.first()).toHaveAttribute("class", "blinkingText");
});

test('Child windows handling', async ({ browser }) => {
	const context = await browser.newContext();
	const page = await context.newPage();
	const userName = page.locator('#username');
	await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
	const documentLink = page.locator(".float-right a");
	// console.log(await documentLink.first().textContent());

	// context.waitForEvent('page'); // listen for new pages
	// await documentLink.first().click(); // new page is opened

	const [newPage] = await Promise.all([
		context.waitForEvent('page'),
		documentLink.first().click(),
	]);

	const text = await newPage.locator(".red").textContent();

	if (!text) {
		throw new Error("Text is invalid");
	}
	const arrayText = text.split("@");
	const domain = arrayText[1].split(" ")[0];
	console.log(domain);

	await page.locator("#username").fill(domain);
});