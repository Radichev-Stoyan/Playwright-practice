export default class LoginPage {
    constructor(page) {
        this.page = page;
        this.signInButton = page.locator("[value='Login']");
        this.userName = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
    }

    async goTo() {
        await this.page.goto("https://rahulshettyacademy.com/client");
    }

    async validLogin(email, password) {
        await this.userName.fill(email);
        await this.password.fill(password);
        await this.signInButton.click();

        await this.page.locator(".card-body").first().waitFor();
    }
}