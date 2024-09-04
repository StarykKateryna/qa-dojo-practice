import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) =>{
  await page.goto('https://coffee-cart.app/');

})

// ??? doesn`t close browser
// test.afterAll(async ({browser}) => {
//   await browser.close();
// })

test('TC-1 - all products should be visible', async ({ page }) => {
  // v1
  await expect(page
    .locator('li h4'))
    .toHaveText([
      "Espresso $10.00", 
      "Espresso Macchiato $12.00",
      "Cappuccino $19.00",
      "Mocha $8.00",
      "Flat White $18.00",
      "Americano $7.00",
      "Cafe Latte $16.00",
      "Espresso Con Panna $14.00",
      "Cafe Breve $15.00"]);

  // const coffeeTypes = [
  //   '[data-test = "Cappuccino"]',
  //   '[data-test = "Espresso_Macchiato"]',
  //   '[data-test = "Mocha"]',
  // ] ;

  // for (const cup of coffeeTypes) {
  //   const cupIng = page.locator(cup);
  //   const text = await page.locator(cup).innerText();
  //   const actualIng = text.split(/\n/);

  //   const expextedCappucinoIng = [
  //     "espresso",
  //     "steamed milk",
  //     "milk foam"
  //   ];
  //   const expextedEspressoMacchiato = [
  //     "espresso",
  //     "milk foam"
  //   ];
  //   const expextedMocha = [
  //     "espresso",
  //     "chocolate syrup",
  //     "steamed milk",
  //     "whipped cream"
  //   ];

  //   if(cup == '[data-test = "Cappuccino"]' ){
  //     expect(expextedCappucinoIng).toEqual(actualIng);
  //   } else if (cup == '[data-test = "Espresso_Macchiato"]' ){
  //     expect(expextedEspressoMacchiato).toEqual(actualIng);
  //   } else if (cup == '[data-test = "Mocha"]'){
  //     expect(expextedMocha).toEqual(actualIng);
  //   }
    
  // }

  const coffeeTypes = {
    'Cappuccino': [
      "espresso",
      "steamed milk",
      "milk foam"
    ],
    'Espresso_Macchiato': [
      "espresso",
      "milk foam"
    ],
    'Mocha': [
      "espresso",
      "chocolate syrup",
      "steamed milk",
      "whipped cream"
    ]
  };
  
  for (const [coffee, expectedIngredients] of Object.entries(coffeeTypes)) {
    const cupLocator = `[data-test="${coffee}"]`;
    const actualIngredients = (await page.locator(cupLocator).innerText()).split(/\n/);
    
    expect(expectedIngredients).toEqual(actualIngredients);
  }
});

test('TC-2 - added products are showing in the cart tab', async ({page}) => {
  await page.locator('[data-test="Espresso_Macchiato"]').click();
  await page.locator('[data-test="Cappuccino"]').click();
  await page.locator('[aria-label="Cart page"]').click();

  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $31.00');

  const actualTextCappucino =  
  (await page.locator('//*[contains(text(), "Cappuccino")]/parent::li')
  .innerText())
  .split(/\n/);
  const actualTextMacchiato =  
  (await page.locator('//*[contains(text(), "Espresso Macchiato")]/parent::li')
  .innerText())
  .split(/\n/);

  await expect(["Cappuccino","$19.00 x 1","+","-","$19.00","x"]).toEqual(actualTextCappucino);
  await expect(["Espresso Macchiato","$12.00 x 1","+","-","$12.00","x"]).toEqual(actualTextMacchiato);

})

test('TC-3 - buy product via button checkout on the main page', async ({page}) => {
  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Mocha"]').click();

  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $18.00');

  await page.locator('[data-test="checkout"]').click();
  await page.locator('#name').fill('Katya');
  await page.locator('#email').fill('katya.stary@gmail.com');
  await page.locator('#submit-payment').click();
// !
await expect(page.locator('[class="snackbar success"][style^="display"]')).not.toBeVisible();
await expect(page.locator('[class="snackbar success"]')).toContainText('Thanks for your purchase. Please check your email for payment.');
})

test('TC-4 - check promotion mesage', async({page}) => {
  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Mocha"]').click();
  await page.locator('[data-test="Cappuccino"]').click();

  await expect(page.locator('.promo')).toContainText("It's your lucky day! Get an extra cup of Mocha for $4.");
  await expect(page.locator('.promo .buttons')).toContainText('Yes, of course');
  await expect(page.locator('.promo .buttons')).toContainText("Nah, I'll skip.");
})

test('TC-5 delete product from cart',async({page}) => {
  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="Cappuccino"]').click();
  await page.locator('[aria-label="Cart page"]').click();
  await page.locator('.delete[aria-label="Remove all Cappuccino"]').click();

  await expect(page.locator('//div[contains(text(), "Espresso")]')).toBeVisible();
  await expect(page.locator('//div[contains(text(), "Cappuccino")]')).not.toBeVisible();
  await expect(page.getByText('Cappuccino')).not.toBeVisible();
})