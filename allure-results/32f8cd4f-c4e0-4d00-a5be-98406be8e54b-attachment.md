# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: clientAppPo.spec.js >> Browser Context Declaration
- Location: tests\clientAppPo.spec.js:4:5

# Error details

```
Error: locator.click: Error: strict mode violation: locator('.btn-danger') resolved to 3 elements:
    1) <button _ngcontent-kcu-c38="" class="btn btn-danger">Delete</button> aka getByRole('button', { name: 'Delete' }).first()
    2) <button _ngcontent-kcu-c38="" class="btn btn-danger">Delete</button> aka getByRole('button', { name: 'Delete' }).nth(1)
    3) <button _ngcontent-kcu-c38="" class="btn btn-danger">Delete</button> aka getByRole('button', { name: 'Delete' }).nth(2)

Call log:
  - waiting for locator('.btn-danger')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e5]:
    - generic [ref=e7]:
      - link "Automation Automation Practice":
        - /url: ""
        - generic [ref=e8] [cursor=pointer]:
          - heading "Automation" [level=3] [ref=e9]
          - paragraph [ref=e10]: Automation Practice
    - text: 
    - link "Get Shortlisted by Recruiters - Take QA Skill Assessments on TechSmartHire" [ref=e11] [cursor=pointer]:
      - /url: https://techsmarthire.com/
    - list [ref=e12]:
      - listitem [ref=e13] [cursor=pointer]:
        - button " HOME" [ref=e14]:
          - generic [ref=e15]: 
          - text: HOME
      - listitem
      - listitem [ref=e16] [cursor=pointer]:
        - button " ORDERS" [ref=e17]:
          - generic [ref=e18]: 
          - text: ORDERS
      - listitem [ref=e19] [cursor=pointer]:
        - button " Cart" [ref=e20]:
          - generic [ref=e21]: 
          - text: Cart
      - listitem [ref=e22] [cursor=pointer]:
        - button "Sign Out" [ref=e23]:
          - generic [ref=e24]: 
          - text: Sign Out
  - generic [ref=e25]:
    - heading "Your Orders" [level=1] [ref=e26]
    - table [ref=e27]:
      - rowgroup [ref=e28]:
        - row "Order Id Product Image Name Price Ordered Date View Delete" [ref=e29]:
          - columnheader "Order Id" [ref=e30]
          - columnheader "Product Image" [ref=e31]
          - columnheader "Name" [ref=e32]
          - columnheader "Price" [ref=e33]
          - columnheader "Ordered Date" [ref=e34]
          - columnheader "View" [ref=e35]
          - columnheader "Delete" [ref=e36]
      - rowgroup [ref=e37]:
        - row "6a3e24c6378febeacdcfa07a ZARA COAT 3 $ 11500 Fri Jun 26 View Delete" [ref=e38]:
          - rowheader "6a3e24c6378febeacdcfa07a" [ref=e39]
          - cell [ref=e40]:
            - img [ref=e41]
          - cell "ZARA COAT 3" [ref=e42]
          - cell "$ 11500" [ref=e43]
          - cell "Fri Jun 26" [ref=e44]
          - cell "View" [ref=e45]:
            - button "View" [ref=e46] [cursor=pointer]
          - cell "Delete" [ref=e47]:
            - button "Delete" [ref=e48] [cursor=pointer]
        - row "6a3e24c6378febeacdcfa084 ZARA COAT 3 $ 11500 Fri Jun 26 View Delete" [ref=e49]:
          - rowheader "6a3e24c6378febeacdcfa084" [ref=e50]
          - cell [ref=e51]:
            - img [ref=e52]
          - cell "ZARA COAT 3" [ref=e53]
          - cell "$ 11500" [ref=e54]
          - cell "Fri Jun 26" [ref=e55]
          - cell "View" [ref=e56]:
            - button "View" [ref=e57] [cursor=pointer]
          - cell "Delete" [ref=e58]:
            - button "Delete" [ref=e59] [cursor=pointer]
        - row "6a3e24c7378febeacdcfa089 ZARA COAT 3 $ 11500 Fri Jun 26 View Delete" [ref=e60]:
          - rowheader "6a3e24c7378febeacdcfa089" [ref=e61]
          - cell [ref=e62]:
            - img [ref=e63]
          - cell "ZARA COAT 3" [ref=e64]
          - cell "$ 11500" [ref=e65]
          - cell "Fri Jun 26" [ref=e66]
          - cell "View" [ref=e67]:
            - button "View" [ref=e68] [cursor=pointer]
          - cell "Delete" [ref=e69]:
            - button "Delete" [ref=e70] [cursor=pointer]
    - generic [ref=e71]: "* If orders Will be more than 7 your last order will get deleted"
  - generic [ref=e73]:
    - button "Go Back to Shop" [ref=e74] [cursor=pointer]
    - button "Go Back to Cart" [ref=e75] [cursor=pointer]
```

# Test source

```ts
  3   | 
  4   | test('Browser Context Declaration', async ({ page }) => {
  5   |     const poManager = new PageObjectManager(page);
  6   | 
  7   |     const productName = 'ZARA COAT 3';
  8   | 
  9   |     const email = "sradichev420@gmail.com";
  10  |     const password = "bsA$Z5XWL55Hg4J";
  11  | 
  12  |     const loginPage = poManager.getLoginPage();
  13  | 
  14  |     await loginPage.goTo();
  15  | 
  16  |     await loginPage.validLogin(email, password);
  17  | 
  18  |     const dashboardPage = poManager.getDashboardPage();
  19  | 
  20  |     await dashboardPage.searchProduct(productName);
  21  | 
  22  |     await dashboardPage.navigateToCart();
  23  | 
  24  | 
  25  |     const cartProduct = page.locator(".cartSection h3").filter({ hasText: productName });
  26  | 
  27  |     await expect(cartProduct).toBeVisible();
  28  | 
  29  |     // Proceeding with checkout
  30  |     await page.locator("text=Checkout").click();
  31  | 
  32  |     await page.locator(".form__cc input.txt").nth(0).fill("4542 9931 9292 2293");
  33  |     await page.locator(".form__cc select.ddl").nth(0).selectOption("01");
  34  |     await page.locator(".form__cc select.ddl").nth(1).selectOption("16");
  35  |     await page.locator(".form__cc input.txt").nth(1).fill("123");
  36  |     await page.locator(".form__cc input.txt").nth(2).fill("Test User");
  37  |     await page.locator(".form__cc input[name='coupon']").fill("rahulshettyacademy");
  38  |     await page.locator(".form__cc button:has-text('Apply Coupon')").click();
  39  | 
  40  |     // Validating dropdown with auto-suggestion
  41  |     const country = page.locator("[placeholder*='Country']");
  42  | 
  43  |     await expect(country).toBeVisible();
  44  |     await country.click();
  45  |     await page.keyboard.type("bul", { delay: 300 });
  46  | 
  47  |     const options = page.locator(".ta-results");
  48  |     await options.waitFor();
  49  |     const optionsCount = await options.locator("button").count();
  50  |     for (let i = 0; i < optionsCount; i++) {
  51  |         const text = await options.locator("button").nth(i).textContent();
  52  |         if (text === " Bulgaria") {
  53  |             await options.locator("button").nth(i).click();
  54  |             break;
  55  |         }
  56  |     }
  57  | 
  58  |     await expect(page.locator(".ta-results")).toBeHidden();
  59  |     await expect(page.locator(".ta-backdrop")).toBeHidden();
  60  | 
  61  |     // Validating email in checkout page
  62  |     await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
  63  |     await page.locator(".action__submit").click();
  64  | 
  65  |     await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
  66  | 
  67  |     const rawOrderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
  68  | 
  69  |     if (!rawOrderId) {
  70  |         throw new Error("There is no order id");
  71  |     }
  72  | 
  73  |     const orderId = rawOrderId.replaceAll("|", "").trim();
  74  | 
  75  |     await page.locator("button[routerlink*='myorders']").click();
  76  |     await expect(page.locator("tbody")).toBeVisible();
  77  | 
  78  |     const rows = page.locator("tbody tr");
  79  |     let orderFound = false;
  80  | 
  81  |     for (let i = 0; i < await rows.count(); i++) {
  82  |         const currId = (await rows.nth(i).locator("th").textContent())?.trim();
  83  | 
  84  |         if (currId === orderId) {
  85  |             await rows.nth(i).locator("button").first().click();
  86  |             orderFound = true;
  87  |             break;
  88  |         }
  89  |     }
  90  | 
  91  |     expect(orderFound).toBeTruthy();
  92  | 
  93  |     await expect(page.locator(".col-text")).toBeVisible();
  94  | 
  95  |     const orderIdDetails = (await page.locator(".col-text").textContent())?.trim();
  96  | 
  97  |     expect(orderIdDetails).toBeTruthy();
  98  |     expect(orderIdDetails).toBe(orderId);
  99  | 
  100 |     await page.locator("button[routerlink*='myorders']").click();
  101 |     await expect(page.locator("tbody")).toBeVisible();
  102 | 
> 103 |     await page.locator('.btn-danger').click();
      |                                       ^ Error: locator.click: Error: strict mode violation: locator('.btn-danger') resolved to 3 elements:
  104 | 
  105 |     await expect(page.getByText(' You have No Orders to show at this time.')).toBeVisible();
  106 | });
```