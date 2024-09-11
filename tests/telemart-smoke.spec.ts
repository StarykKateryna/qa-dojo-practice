import { test, expect, Locator } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://telemart.ua/ua/");
});

test("Check slider", async ({ page }) => {
  const btnNext: Locator = page.locator(
    ".categories-slider .swiper-button-next"
  );
  const banners: Locator = page.locator(
    '.categories-slider [id^="swiper-wrapper"] [class^="swiper-slide"]'
  );
  const activeBanner: Locator = page.locator(
    '.categories-slider [id^="swiper-wrapper"] [class="swiper-slide swiper-slide-active"]'
  );

  await expect((await banners.all()).length).toBeGreaterThan(2);

  await btnNext.click();
  await btnNext.click();
  const urlOfActiveBanner = await activeBanner.getAttribute("href");
  await activeBanner.click();

  await expect(page.url()).toEqual(urlOfActiveBanner);
});
