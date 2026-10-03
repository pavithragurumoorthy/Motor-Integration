import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();


export async function relianceFlow(page, selectedQuote) {

    console.log('Starting RELIANCE flow');

    await selectedQuote
        .getByRole('button', { name: /₹/ })
        .click();

    await test.step('KYC Details', async () => {

    // KYC dialog
    await expect(
        page.getByRole('heading', {
            name: 'Know Your Customer (KYC)'
        })
    ).toBeVisible();

    // Select ID Type
    await page
        .getByRole('combobox', { name: /Id Type/ })
        .click();

    await page
        .getByRole('option', {
            name: process.env.ID_TYPE,
            exact: true
        })
        .click();

    // Re-locate dialog AFTER ID type selection
    const kyc = page.getByRole('dialog');

    // PAN Number
    const panLabel = page.locator(
        '//mat-dialog-container[@id="mat-dialog-1"]/descendant::span[text()="Pan Number"]'
    );

    await expect(panLabel).toBeVisible();
    await panLabel.click();

    // await expect(panNumber).toBeVisible({ timeout: 10000 });
    await panNumber.fill(process.env.ID_NUMBER);

    // Full Name
    await kyc
        .getByPlaceholder('Full Name')
        .fill(process.env.CUSTOMER_NAME);

    // Gender
    await kyc
        .getByRole('combobox', { name: 'Gender Gender' })
        .click();

    await page
        .getByRole('option', {
            name: process.env.GENDER,
            exact: true
        })
        .click();

    // DOB
    await kyc
        .getByPlaceholder('DOB (DD/MM/YYYY)')
        .fill(process.env.DOB);

    // Save
    await kyc
        .getByRole('button', { name: 'Save' })
        .click();
});

    console.log('RELIANCE flow completed');
}

export async function iciciFlow(page, selectedQuote) {

    console.log('Starting ICICI flow');

    await selectedQuote
        .getByRole('button', { name: /₹/ })
        .click();

    // ICICI-specific flow

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