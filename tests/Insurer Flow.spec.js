import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();


export async function fillIfEmpty(locator, value, envName) {
    if (!value?.trim()) {
        throw new Error(
            `Missing or empty environment variable: ${envName}`
        );
    }

    await expect(locator).toBeVisible();

    const currentValue = await locator.inputValue();

    if (!currentValue.trim()) {
        await locator.fill(value);
    }
}



export async function iciciFlow(page, selectedQuote) {

    console.log('Starting ICICI flow');

    await selectedQuote.getByRole('button', { name: /₹/ }).click();
    await test.step('KYC Details', async () => {

        // KYC dialog
        await expect(page.getByRole('heading', {name: 'Know Your Customer (KYC)'})).toBeVisible();

        // Select ID Type
        const idTypeDropdown = page.getByRole('combobox', { name: /Id Type/ });
        await expect(idTypeDropdown).toBeVisible();
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

    // OVD Flow
    await test.step('OVD Flow', async () => {
        const aadhar = page.getByText('AadharCard *');

        await expect(aadhar).toBeVisible();

        const fileChooserPromise = page.waitForEvent('filechooser');
        await aadhar.click();

        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(process.env.AADHAR_LOCATION);

        const panCard = page.getByText('PanCard *');

        await expect(panCard).toBeVisible();

        const panFilechooserPromise = page.waitForEvent('filechooser');
        await panCard.click();

        const panFilechooser = await panFilechooserPromise;
        await panFilechooser.setFiles(process.env.PAN_LOCATION);


    });

    console.log('ICICI flow completed');
}


export async function royalFlow(page, selectedQuote) {

    console.log('Starting ROYAL flow');

    await selectedQuote
        .getByRole('button', { name: /₹/ })
        .click();

    // Royal-specific flow

    console.log('ROYAL flow completed');
}


export async function universalFlow(page, selectedQuote) {

    console.log('Starting UNIVERSAL flow');

    await selectedQuote
        .getByRole('button', { name: /₹/ })
        .click();

    // Universal-specific flow

    console.log('UNIVERSAL flow completed');
}

export async function nationalFlow(page, selectedQuote) {

    console.log('Starting NATIONAL flow');

    await selectedQuote
        .getByRole('button', { name: /₹/ })
        .click();

    // National-specific flow

    console.log('NATIONAL flow completed');
}

export async function shriramFlow(page, selectedQuote) {

    console.log('Starting SHRIRAM flow');

    await selectedQuote
        .getByRole('button', { name: /₹/ })
        .click();

    // Shriram-specific flow

    console.log('SHRIRAM flow completed');
}

export async function magmaFlow(page, selectedQuote) {

    console.log('Starting MAGMA flow');

    await selectedQuote
        .getByRole('button', { name: /₹/ })
        .click();

    // Magma-specific flow

    console.log('MAGMA flow completed');
}

export async function futureGeneraliFlow(page, selectedQuote) {

    console.log('Starting FUTURE GENERALI flow');

    await selectedQuote
        .getByRole('button', { name: /₹/ })
        .click();

    // Future Generali-specific flow

    console.log('FUTURE GENERALI flow completed');
}