import { test, expect } from '@playwright/test';
import { fillIfEmpty } from './Insurer Flow.spec.js';
import dotenv from 'dotenv';

dotenv.config();


export async function relianceFlow(page, selectedQuote) {

    console.log('Starting RELIANCE flow');

    await selectedQuote.getByRole('button', { name: /₹/ }).click();

    await test.step('KYC Details', async () => {

        // KYC dialog
        await expect(
            page.getByRole('heading', {name: 'Know Your Customer (KYC)'})).toBeVisible();

        // Select ID Type
        const idTypeDropdown = page.getByRole('combobox', { name: /Id Type/ });
        expect(idTypeDropdown).toBeVisible();
        await idTypeDropdown.click();

        await page.getByRole('option', {name: process.env.ID_TYPE,exact: true}).click();

        // Re-locate dialog AFTER ID type selection
        const kyc = page.getByRole('dialog');

        // PAN Number
        const panNumber = kyc.getByRole('textbox', { name: 'Pan Number' });

        await expect(panNumber).toBeVisible();
        await panNumber.fill(process.env.ID_NUMBER);

        // Full Name
        const fullName = kyc.getByRole('textbox', { name: 'Full Name' });
        await expect(fullName).toBeVisible();
        await fullName.fill(process.env.CUSTOMER_NAME);

        // Gender
        await kyc.getByRole('combobox', { name: 'Gender Gender' }).click();

        await page.getByRole('option', {name: process.env.GENDER,exact: true}).click();
            
        // DOB
        const dob = kyc.getByRole('textbox', { name: 'DOB (DD/MM/YYYY)' });
        await expect(dob).toBeVisible();
        await dob.fill(process.env.DOB);

        // Save
        await kyc .getByRole('button', { name: 'Save' }).click();
    });

    // await page.pause();

    await test.step('OVD Flow', async () => {

        const expectedUrl = `https://${process.env.TP_HOST_NAME}${process.env.TP_PATH_NAME}`;

        // console.log('Waiting for OVD URL:', expectedUrl);

        await page.waitForURL(
            `**${process.env.TP_HOST_NAME}${process.env.TP_PATH_NAME}**`,
            {
                timeout: 120000
            }
        );

        // console.log('OVD URL reached:', page.url());

        await page.locator('#pan_no').fill(process.env.ID_NUMBER); //CSS locator
        await page.locator('#pan_dob').fill(process.env.KYC_DOB); //CSS Locator
        await page.getByRole('button', { name: 'Submit' }).click();
        

        const fileChooserPromise = page.waitForEvent('filechooser');

        await page.getByRole('link', { name: 'Click to browse files' }).click();


        // await page.getByRole('button', { name: 'Upload Document' }).click();

        const fileChooser = await fileChooserPromise;

        await fileChooser.setFiles(process.env.AADHAR_LOCATION);

        await page.getByRole('button', { name: 'Upload' }, { exact: true }).click();

        await page.getByRole('button', { name: 'PROCEED' },{exact: true}).click();

        await page.waitForURL(
            `**${process.env.HOST_NAME}${process.env.PROPOSAL}**`,
            {
                timeout: 120000
            }
        );

        // await page.pause();
    });

    await test.step('Proposer Details', async () => {

        // Title
        const titleDropdown = page.getByRole('combobox', { name: /Title/ });

        if (await titleDropdown.getAttribute('aria-label') !== process.env.TITLE) {
            await titleDropdown.click();

            await page.getByRole('option', {
                name: process.env.TITLE,
                exact: true
            }).click();
        }
        // Wait until "loading..." appears
        const loadingText = page.getByText('loading...', { exact: true });

        await loadingText.waitFor({
            state: 'visible',
            timeout: 10000
        });

        // Wait until "loading..." disappears
        await loadingText.waitFor({
            state: 'hidden',
            timeout: 60000
        });

        // First Name
        await fillIfEmpty(page.getByRole('textbox', { name: 'First Name' }),process.env.CUSTOMER_NAME,'CUSTOMER_NAME');

        // Last Name
        await fillIfEmpty(
            page.getByRole('textbox', { name: 'Last Name' }),
            process.env.LAST_NAME,'LAST_NAME'
        );

        // Gender
        const gender = page.getByRole('combobox', { name: /Gender/ });

        if ((await gender.innerText()).trim() !== process.env.GENDER) {
            await gender.click();

            await page.getByRole('option', {
                name: process.env.GENDER,
                exact: true
            }).click();
        }

        // DOB
        await fillIfEmpty(
            page.getByRole('textbox', { name: 'DOB (DD/MM/YYYY)',exact: true }),
            process.env.DOB,'DOB'
        );

        // PAN
        await fillIfEmpty(
            page.getByRole('textbox', { name: 'PAN Number' }),
            process.env.ID_NUMBER,'ID_NUMBER'
        );

        // Email
        await fillIfEmpty(
            page.getByRole('textbox', { name: 'Email ID' }),
            process.env.MAIL_ID,'MAIL_ID'
        );

        // Mobile
        await fillIfEmpty(
            page.getByRole('textbox', { name: 'Mobile Number' }),
            process.env.MOBILE,'MOBILE'
        );

        const occupation = page.getByRole('combobox', { name: /Occupation/ });

        if ((await occupation.innerText()).trim() !== process.env.OCCUPATION) {
            await occupation.click();

            await page.getByRole('option', {
                name: process.env.OCCUPATION,
                exact: true
            }).click();
        }

        const sameAddressLabel = page.getByText('Same as Communication Address',{ exact: true });

        await sameAddressLabel.click();

        // if (await titleDropdown.getAttribute('aria-label') !== process.env.TITLE) {
        await titleDropdown.click();
        await page.getByRole('option', {name: process.env.TITLE,exact: true}).click();
        // }
        const proposerSection = page.getByRole('region', {name: 'PROPOSER DETAILS'});

        await proposerSection.getByRole('button', {name: 'Next',exact: true}).click();
    });


    await test.step('Vehicle Details', async () => {

        const vehicleSection = page.getByRole('region', {name: 'VEHICLE DETAILS'});
        await vehicleSection.getByRole('button', {name: 'Next',exact: true}).click();
    });

    await test.step('Nominee Details', async () => {

        const NomineeSection = page.getByRole('region', {name: 'NOMINEE DETAILS'});
        

        await fillIfEmpty(page.getByRole('textbox', { name: 'Nominee Name' }),process.env.NOMINEE_NAME,'NOMINEE_NAME');
        await fillIfEmpty(page.getByRole('textbox', { name: 'Nomine DOB (DD/MM/YYYY)' }),process.env.NOMINEE_DOB,'NOMINEE_DOB');
        const nominee = page.getByRole('combobox', { name: /Nominee Relationship/ });

        if ((await nominee.innerText()).trim() !== process.env.NOMINEE_RELATIONSHIP) {
            await nominee.click();

            await page.getByRole('option', {
                name: process.env.NOMINEE_RELATIONSHIP,
                exact: true
            }).click();
        }

        await NomineeSection.getByRole('button', {name: 'Next',exact: true}).click();

        await loadingText.waitFor({
            state: 'visible',
            timeout: 10000
        });

        // Wait until "loading..." disappears
        await loadingText.waitFor({
            state: 'hidden',
            timeout: 60000
        });
    });

    await test.step('summary', async () => {

        const fileInputs = page.locator('input[type="file"]');

        await fileInputs.nth(0).setInputFiles('D:/POLICY COPY.pdf'); // Previous Policy Copy
        await fileInputs.nth(1).setInputFiles('D:/POLICY COPY.pdf'); // RC Book

        const declaration1 = page.getByText('I Confirm That The Uploaded Vehicle Documents');
        await declaration1.click();
        const Summary = page.getByRole('region', {name: 'File Upload'});
        await Summary.getByRole('button', {name: 'Next',exact: true}).click();
    });

    await test.step('Payment', async () => {

        const declaration2 = page.getByText('I HERE BY DECLARE ALL THE DETAILS PROVIDED');
        await declaration2.click();

        await page.getByRole('button', {name: 'Pay Now',exact: true}).click();

        const paymentlink = page.getURL();

        console.log('Payment link:', paymentlink);


        // await page.pause();
    });
    console.log('RELIANCE flow completed');
};