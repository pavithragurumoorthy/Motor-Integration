import { test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('Private Car - New Business', async ({ page }) => {
    await test.step('Vizza Insurance POS Login', async () => {

        // Open website
        await page.goto(process.env.BASE_URL, {
            waitUntil: 'domcontentloaded'
        });

        console.log("Website opened");

        // Login button
        await page.getByRole('button', { name: 'Login' }).first().click();
        console.log("Login button clicked");

        // POS Login
        await page.getByRole('link', { name: 'POS Login' }).click();
        console.log("POS clicked");

        // Mobile
        await page.locator('#mat-input-0').fill(process.env.POS_MOBILE);
        console.log("Mobile number entered");

        // Password
        await page.locator('#mat-input-1').fill(process.env.POS_PASSWORD);
        console.log("Password entered");

        // Login submit button
        await page.locator('#main-content')
            .getByRole('button', { name: 'Login' })
            .click();

        console.log("Login completed");
    });
    await test.step('Page to Vehicle Category', async () => {

        // Wait until page navigation/loading is completed
        await page.waitForLoadState('domcontentloaded');

        await page.locator('span.horizontal-menu-title', { hasText: 'Online Insurance'}).click();
        console.log("Online Insurance is Clicked");

        await page.locator('span.horizontal-menu-title', { hasText: 'Motor Insurance'}).click();
        console.log("Motor Insurance is Clicked");
        await page.waitForLoadState('domcontentloaded');
        // await page.pause();
        
        //Private car
        const privateCar = page.locator('div.card').filter({
        hasText: 'NEW INDIA & SHRIRAM PRIVATE CAR'
        });

        await privateCar.waitFor({ state: 'visible' });
        await privateCar.click();

        console.log("Private car is Clicked");

    });

    await test.step('New Business - Quotation', async () => {
        // await page.waitForLoadState('domcontentloaded');
        await page.locator('a.brand-new-link',{hasText: ' Brand new PrivateCar? '}).click();
        console.log("Brand new PrivateCar link is clicked");

        //Form

        await page.getByPlaceholder('Search...').fill(process.env.RTO_CODE);
        const rto = page.getByRole('listitem').filter({hasText: process.env.RTO_CODE});
        await rto.waitFor({ state: 'visible', timeout: 15000 });
        await rto.click();
        console.log("RTO selected");

        await page.getByPlaceholder('Search...').fill(process.env.MAKE);
        const make = page.getByRole('listitem').filter({name: process.env.MAKE,exact: true});
        // await make.waitFor({ state: 'visible', timeout: 15000 });
        await make.click();
        console.log("Make selected");

        await page.getByPlaceholder('Search...').fill(process.env.MODEL);
        const model = page.getByText(process.env.MODEL, { exact: true });
        // await model.waitFor({ state: 'visible', timeout: 15000 });
        await model.click();
        console.log("Model selected");

        await page.getByPlaceholder('Search...').fill(process.env.VARIANT);
        const variant = page.getByText(process.env.VARIANT, { exact: true });
        // await variant.waitFor({ state: 'visible', timeout: 15000 });
        await variant.click();
        console.log("Variant selected");


        await page.locator('select.customerType').selectOption({label: 'Individual'});
        await page.pause();

    });

});