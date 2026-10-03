import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import {relianceFlow,iciciFlow,royalFlow,universalFlow,nationalFlow,shriramFlow,magmaFlow,futureGeneraliFlow} from './Insurer Flow.spec.js';

dotenv.config();

test('Comprehensive', async ({ page }) => {
    test.setTimeout(30000);
    let targetInsurer;
    let selectedQuote = null;

    await test.step('WebSite', async () => {

        await page.goto(process.env.BASE_URL, {waitUntil: 'domcontentloaded'});

    });


    await test.step('Login', async () => {

        // Login button
        await page.getByRole('button', { name: 'Login' }).first().click();

        // POS Login
        await page.getByRole('link', { name: 'POS Login' }).click();

        // Mobile
        await page.locator('#mat-input-0').fill(process.env.POS_MOBILE);

        // Password
        await page.locator('#mat-input-1').fill(process.env.POS_PASSWORD);

        // Login submit
        await page.locator('#main-content').getByRole('button', { name: 'Login' }).click();

        // Wait until POS dashboard is loaded
        const posFrame = page.frameLocator('#pos-iframe');

        await expect(posFrame.getByText('Policy Performance', { exact: true })).toBeVisible({timeout: 30000});

    });


    await test.step('Page to Vehicle Category', async () => {

        // Online Insurance
        const onlineInsurance = page.locator('span.horizontal-menu-title',{ hasText: 'Online Insurance' });

        await expect(onlineInsurance).toBeVisible({timeout: 30000});

        await onlineInsurance.click();

        console.log('Online Insurance is Clicked');


        // Motor Insurance
        const motorInsurance = page.locator('span.horizontal-menu-title',{ hasText: 'Motor Insurance' });

        await expect(motorInsurance).toBeVisible({timeout: 30000});

        await motorInsurance.click();

        // console.log('Motor Insurance is Clicked');


        // GCV
        const GCV = page.locator('div.card').filter({hasText: 'GOODS CARRYING VEHICLE'});

        await expect(GCV).toBeVisible({timeout: 30000});

        await GCV.click();

        // console.log('GOODS CARRYING VEHICLE is Clicked');


        // Comprehensive
        await page.getByText('COMPREHENSIVE', {exact: true}).click();

        // console.log('COMPREHENSIVE is Clicked');

    });


    await test.step('Comprehensive', async () => {

        // Registration Number
        const registration = page.getByLabel('Registration Number');

        await registration.fill(process.env.REGISTRATION_NUMBER);

        await registration.press('Enter');


        // Wait for Customer Type
        await expect(page.getByLabel('Customer Type')).toBeVisible({timeout: 30000});


        // Customer Type
        await page.getByLabel('Customer Type').click();

        await page.getByRole('option', {name: process.env.CUSTOMER_TYPE,exact: true}).click();


        // Sub Category
        await page.getByLabel('Sub Category').click();

        await page.getByRole('option', {name: process.env.SUB_CATEGORY,exact: true}).click();


        // Body Type
        await page.getByLabel('Body Type').click();

        await page.getByRole('option', {name: process.env.BODY_TYPE,exact: true}).click();


        // Customer details
        await page.getByLabel('Customer Name').fill(process.env.CUSTOMER_NAME);

        await page.getByLabel('Mobile No').fill(process.env.MOBILE);

        await page.getByLabel('Email').fill(process.env.MAIL_ID);


        // Previous Policy Type
        await page.getByLabel('Previous Policy Type').click();

        await page.getByRole('option', {name: process.env.PREVIOUS_POLICY_TYPE,exact: true}).click();


        // Previous Policy Expiry Date
        const policyexpiryDate =process.env.PREVIOUS_POLICY_EXPIRY_DATE === 'today'? new Date().toLocaleDateString('en-GB'): process.env.PREVIOUS_POLICY_EXPIRY_DATE;

        await page.getByLabel('Previous Policy Expiry Date').click();

        await page.keyboard.press('Control+KeyA');
        await page.keyboard.press('Backspace');

        await page.getByLabel('Previous Policy Expiry Date').fill(policyexpiryDate);

        // Previous NCB
        await page.getByLabel('Previous No Claim Bonus (NCB)').click();

        await page.getByRole('option', {name: process.env.PREVIOUS_NCB,exact: true}).click();

    });


    await test.step('Calculate Premium', async () => {

        const calculatePremium = page.getByRole('button', {name: 'Calculate Premium',exact: true});

        await expect(calculatePremium).toBeVisible({timeout: 30000});

        await calculatePremium.click();

            // console.log('Calculate Premium clicked');

            targetInsurer = process.env.TARGET_INSURER.trim().toUpperCase();
            const quotes = page.locator('div.plan-card-container.ng-star-inserted');

            await expect.poll(
                async () => {

                    const count = await quotes.count();

                    for (let i = 0; i < count; i++) {

                        const insurerName = (
                            await quotes.nth(i)
                                .locator('div.pcc-icon p')
                                .innerText()
                        ).trim().toUpperCase();

                        if (insurerName === targetInsurer) {
                            return true;
                        }
                    }

                    return false;

                },
                {
                    timeout: 10000,
                    intervals: [500, 1000]
                }
            ).toBe(true);

            const quotesCount = await quotes.count();

            console.log('Final Quotes Count:', quotesCount);
            console.log('Target Insurer:', targetInsurer);
            
            console.log('Current URL:', page.url());

            for (let i = 0; i < quotesCount; i++) {

                const quote = quotes.nth(i);

                const insurerName = (
                    await quote.locator('div.pcc-icon p').innerText()
                ).trim().toUpperCase();

                console.log('Insurer:', insurerName);

                if (insurerName === targetInsurer) {
                    selectedQuote = quote;
                    break;
                }
            }

            expect(
                selectedQuote,
                `${targetInsurer} insurer quote was not found`
            ).not.toBeNull();
            console.log(`Selected Insurer: ${targetInsurer}`);

            // ===============================
            // ERROR DETAILS
            // ===============================

            try {

                const images = page.locator('div.card-group.pcc-main table tr th img');

                const imageCount = await images.count();

                console.log('Error Images Count:', imageCount);

                if (imageCount >= 1) {

                    console.log('ERROR DETAILS');

                    const tooltip = page.locator('div.mat-tooltip.mat-tooltip-show');

                    for (let i = 0; i < imageCount; i++) {

                        const img = images.nth(i);

                        // Move mouse over image
                        await img.hover();

                        // Wait for tooltip to appear
                        await expect(tooltip).toBeVisible({timeout: 3000});

                        const src = (await img.getAttribute('src'))?.toUpperCase() || '';

                        console.log('Image:', src);

                        const errorText = (await tooltip.innerText()).trim();

                        console.log('ERROR FOUND:', errorText);

                    }
                }

            } catch (error) {

                console.log('Error while reading insurer error details:', error.message);
            }


        // await page.pause();

    });

    await test.step('Select Insurer', async () => {

        if (targetInsurer === 'RELIANCE') {

            await relianceFlow(page, selectedQuote);

        } else if (targetInsurer === 'ICICI') {

            await iciciFlow(page, selectedQuote);

        } else if (targetInsurer === 'ROYAL') {

            await royalFlow(page, selectedQuote);

        } else if (targetInsurer === 'UNIVERSAL') {

            await universalFlow(page, selectedQuote);

        } 
        else if (targetInsurer === 'NATIONAL') {

            await nationalFlow(page, selectedQuote);

        } else if (targetInsurer === 'SHRIRAM') {

            await shriramFlow(page, selectedQuote);

        } else if (targetInsurer === 'MAGMA') {

            await magmaFlow(page, selectedQuote);

        } else if (targetInsurer === 'FUTURE GENERALI') {

            await futureGeneraliFlow(page, selectedQuote);

        } else {

            throw new Error(
                `No flow implemented for insurer: ${targetInsurer}`
            );
        }

    });

});