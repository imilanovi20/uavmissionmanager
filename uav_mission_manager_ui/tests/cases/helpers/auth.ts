// tests/helpers/auth.ts
import { Page, expect } from '@playwright/test';

export async function loginAsAdmin(page: Page) {
    await page.goto('http://localhost:61117/login');
    await expect(page.getByText('UAV Mission ManagerUsernamePasswordLogin')).toBeVisible();
    
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('ilitre100');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('oao2t y@aM');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/missions/);
    await expect(page.getByRole('img', { name: 'User Avatar' })).toBeVisible();
}

export async function loginAsUser(page: Page) {
    await page.goto('http://localhost:61117/login');
    await expect(page.getByText('UAV Mission ManagerUsernamePasswordLogin')).toBeVisible();

    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('litreluka');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('4%YeiyXziH');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/missions/);
    await expect(page.getByRole('img', { name: 'User Avatar' })).toBeVisible();
}