import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('New Business Test', async ({ page }) => {
    test.setTimeout(30000);

    await test.step('WebSite', async () => {

        await page.goto(process.env.BASE_URL, {
            waitUntil: 'domcontentloaded'
        });

    });


    await test.step('Login', async () => {

        // Login button
        await page.getByRole('button', { name: 'Login' }).first().click();

        // POS Login
        await page.getByRole('link', { name: 'POS Login' }).click();

        // Mobile
        await page.locator('#mat-input-0').fill(
            process.env.POS_MOBILE
        );

        // Password
        await page.locator('#mat-input-1').fill(
            process.env.POS_PASSWORD
        );

        // Login submit
        await page.locator('#main-content')
            .getByRole('button', { name: 'Login' })
            .click();

        // Wait until POS dashboard is loaded
        const posFrame = page.frameLocator('#pos-iframe');

        await expect(
            posFrame.getByText('Policy Performance', { exact: true })
        ).toBeVisible({
            timeout: 30000
        });

    });


    await test.step('Page to Vehicle Category', async () => {

        // Online Insurance
        const onlineInsurance = page.locator(
            'span.horizontal-menu-title',
            { hasText: 'Online Insurance' }
        );

        await expect(onlineInsurance).toBeVisible({
            timeout: 30000
        });

        await onlineInsurance.click();

        console.log('Online Insurance is Clicked');


        // Motor Insurance
        const motorInsurance = page.locator(
            'span.horizontal-menu-title',
            { hasText: 'Motor Insurance' }
        );

        await expect(motorInsurance).toBeVisible({
            timeout: 30000
        });

        await motorInsurance.click();

        console.log('Motor Insurance is Clicked');

        console.log('Current URL:', page.url());


        // GCV
        const GCV = page.locator('div.card').filter({
            hasText: 'GOODS CARRYING VEHICLE'
        });

        await expect(GCV).toBeVisible({
            timeout: 30000
        });

        await GCV.click();

        console.log('GOODS CARRYING VEHICLE is Clicked');


        // Comprehensive
        await page.getByText('COMPREHENSIVE', {
            exact: true
        }).click();

        console.log('COMPREHENSIVE is Clicked');

    });


    await test.step('New Business (Comprehensive)', async () => {

        // Registration Number
        const registration = page.getByLabel('Registration Number');

        await registration.fill(
            process.env.REGISTRATION_NUMBER
        );

        await registration.press('Enter');


        // Wait for Customer Type
        await expect(
            page.getByLabel('Customer Type')
        ).toBeVisible({
            timeout: 30000
        });


        // Customer Type
        await page.getByLabel('Customer Type').click();

        await page.getByRole('option', {
            name: process.env.CUSTOMER_TYPE,
            exact: true
        }).click();


        // Sub Category
        await page.getByLabel('Sub Category').click();

        await page.getByRole('option', {
            name: process.env.SUB_CATEGORY,
            exact: true
        }).click();


        // Body Type
        await page.getByLabel('Body Type').click();

        await page.getByRole('option', {
            name: process.env.BODY_TYPE,
            exact: true
        }).click();


        // Customer details
        await page.getByLabel('Customer Name').fill(
            process.env.CUSTOMER_NAME
        );

        await page.getByLabel('Mobile No').fill(
            process.env.MOBILE
        );

        await page.getByLabel('Email').fill(
            process.env.MAIL_ID
        );


        // Previous Policy Type
        await page.getByLabel('Previous Policy Type').click();

        await page.getByRole('option', {
            name: process.env.PREVIOUS_POLICY_TYPE,
            exact: true
        }).click();


        // Previous Policy Expiry Date
        const policyexpiryDate =
            process.env.PREVIOUS_POLICY_EXPIRY_DATE === 'today'
                ? new Date().toLocaleDateString('en-GB')
                : process.env.PREVIOUS_POLICY_EXPIRY_DATE;

        await page.getByLabel(
            'Previous Policy Expiry Date'
        ).click();

        await page.keyboard.press('Control+KeyA');
        await page.keyboard.press('Backspace');

        await page.getByLabel(
            'Previous Policy Expiry Date'
        ).fill(policyexpiryDate);


        // Previous NCB
        await page.getByLabel(
            'Previous No Claim Bonus (NCB)'
        ).click();

        await page.getByRole('option', {
            name: process.env.PREVIOUS_NCB,
            exact: true
        }).click();

    });


    await test.step('Calculate Premium', async () => {

        const calculatePremium = page.getByRole('button', {
            name: 'Calculate Premium',
            exact: true
        });

        await expect(calculatePremium).toBeVisible({
            timeout: 30000
        });

        await calculatePremium.click();

        console.log('Calculate Premium clicked');

        await page.waitForTimeout(30000);

        const quotesPageUrl = page.url();

            let quoteNo = '';

            if (quotesPageUrl.includes('/')) {
                quoteNo = quotesPageUrl.substring(
                    quotesPageUrl.lastIndexOf('/') + 1
                );
            }

            console.log(quotesPageUrl);
            console.log('Quote No:', quoteNo);


            // Get all quote cards
            const quotes = page.locator(
                'div.plan-card-container.ng-star-inserted'
            );

            // await expect(quotes.first()).toBeVisible({
            //     timeout: 60000
            // });

            console.log('Quotes Count:', await quotes.count());


            if (await quotes.count() >= 1) {

                for (let i = 0; i < await quotes.count(); i++) {

                    const quote = quotes.nth(i);

                    // Get insurer name inside current quote
                    const insurers = quote.locator(
                        'div.pcc-icon p'
                    );

                    for (let j = 0; j < await insurers.count(); j++) {

                        const insurerName = (
                            await insurers.nth(j).innerText()
                        ).trim().toUpperCase();

                        console.log(insurerName);

                        // if (insurerName === 'UNIVERSAL') {
                        //     console.log('UNIVERSAL insurer found');
                        // }
                    }
                }
            }
            const errorSection = page.locator('div.card-group.pcc-main');

            const errorImages = errorSection.locator(
                'img[alt="Card image cap"]'
            );

            const errorTooltip = page.locator(
                'div.mat-tooltip.mat-tooltip-show'
            );

            const count = await errorImages.count();

            for (let i = 0; i < count; i++) {

                const src = await errorImages.nth(i).getAttribute('src');

                let insurerName = 'UNKNOWN';

                if (src?.includes('FUTURE_GENELI')) {
                    insurerName = 'GENERALI CENTRAL';
                } else if (src?.includes('magma_logo1')) {
                    insurerName = 'MAGMA HDI';
                }

                const errorMessage = (await errorTooltip.innerText()).trim();

                console.log(`Insurer: ${insurerName}`);
                console.log(`Error: ${errorMessage}`);
            }


        await page.pause();

    });

});