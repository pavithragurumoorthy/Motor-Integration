import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('New Business Test', async ({ page }) => {

    await test.step('WebSite', async () => {
        await page.goto(process.env.BASE_URL, {
            waitUntil: 'domcontentloaded'
        });
        // await page.evaluate(() => {
        //     document.body.style.zoom = '50%';
        // });
 
        console.log("Website opened");
    });

    await test.step('Login', async () => {

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
        await page.locator('#main-content').getByRole('button', { name: 'Login' }).click();
        console.log("Login completed");

        // Wait until POS dashboard is loaded
        const posFrame = page.frameLocator('#pos-iframe');

        await expect(posFrame.getByText('Policy Performance', { exact: true })).toBeVisible({ timeout: 50000 });

        console.log("POS Dashboard loaded");

        // await page.pause();

        // Wait until page navigation/loading is completed
        // await page.waitForLoadState('domcontentloaded');
        // console.log("Current URL:", page.url());
    });

    await test.step('Page to Vehicle Category', async () => {

        console.log("POS URL loaded:", page.url());

        const onlineInsurance = page.locator('span.horizontal-menu-title',{ hasText: 'Online Insurance' });

        await expect(onlineInsurance).toBeVisible({ timeout: 30000 });
        await onlineInsurance.click();

        console.log("Online Insurance is Clicked");

        const motorInsurance = page.locator('span.horizontal-menu-title',{ hasText: 'Motor Insurance' });

        await expect(motorInsurance).toBeVisible({ timeout: 30000 });
        await motorInsurance.click();

        console.log("Motor Insurance is Clicked");

        const GCV = page.locator('div.card').filter({hasText: 'GOODS CARRYING VEHICLE'});

        await expect(GCV).toBeVisible({ timeout: 30000 });
        await GCV.click();

        console.log("GOODS CARRYING VEHICLE is Clicked");

        await page.getByText('New Business (Comprehensive)').click();

        console.log("NEW BUSINESS (COMPREHENSIVE) is Clicked");
    });


    await test.step('Customer Details', async () => {

        await page.getByLabel('Customer Type').selectOption('Individual');
        await page.getByLabel('RTO Code').fill(process.env.RTO_CODE);
        await page.getByLabel('Sub Category').selectOption(process.env.SUB_CATEGORY);
        await page.getByLabel('Customer Name').fill(process.env.CUSTOMER_NAME);
        await page.getByLabel('Mobile No').fill(process.env.MOBILE);
        await page.getByLabel('Email').fill(process.env.MAIL_ID);
        await page.getByLabel('Manufacturing Year').fill(process.env.MANUFACTURING_YEAR);
        await page.getByLabel('Make').selectOption(process.env.MAKE);
        await page.getByLabel('Model').selectOption(process.env.MODEL);
        await page.getByLabel('Sub Model').selectOption(process.env.SUB_MODEL);
    });

});