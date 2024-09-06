import { test, expect, APIResponse, request } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("Smoke test", () => {
  const email = faker.internet.email();
  const userName = faker.person.firstName().toLowerCase();
  const password = faker.internet.password();
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    await page.goto("https://demo.learnwebdriverio.com/");

    await page.locator('//a[@href="/register"]').click();

    await page.locator('//input[@placeholder="Username"]').fill(userName);
    await page.locator('//input[@placeholder="Email"]').fill(email);
    await page.locator('//input[@placeholder="Password"]').fill(password);
    await page.locator('//button[contains(text(), "Sign up")]').click();

    await expect(page.locator(`//*[@data-qa-id="site-nav"]`)).toContainText(
      userName
    );
  });

  test.skip("Check error message on Log in", async () => {
    await page.locator('//a[@href="/login"]').click();

    await page.locator('//input[@type="email"]').fill("fkdjfkdj@kdjf.com");
    await page.locator('//input[@type="password"]').fill("123");
    await page.locator('//button[contains(text(), "Sign in")]').click();

    await expect(page.locator('//ul[@class = "error-messages"]')).toHaveText(
      "email or password is invalid"
    );
  });

  test("Add article", async () => {
    const title = "Some Title";
    const description = "Some description";
    const text = "Some text in the text area";
    const tags = "tag1";

    await page.locator('//a[@href="/editor"]').click();
    await page.locator('//input[@data-qa-id="editor-title"]').fill(title);
    await page
      .locator('//input[@data-qa-id="editor-description"]')
      .fill(description);
    await page
      .locator('//*[contains(@class, "auto-textarea-wrapper")]')
      .click();
    await page.keyboard.type(text);

    await expect(
      page.locator(
        `//*[@class="v-note-panel"]//div[contains(@class, "v-show-content-html")]`
      )
    ).toContainText(text);

    const tagsInput = page.locator('//input[@data-qa-id="editor-tags"]');
    await tagsInput.fill(tags);
    await page.keyboard.press("Enter");

    await page.locator('//button[@data-qa-id="editor-publish"]').click();

    await expect(
      page.locator('//h1[@data-qa-id="article-title"]')
    ).toContainText(title);
    await expect(page.locator('//*[@data-qa-id="article-body"]')).toContainText(
      text
    );
    await expect(
      page.locator('//*[@data-qa-type="article-tag"]')
    ).toContainText(tags);
  });
  
});
