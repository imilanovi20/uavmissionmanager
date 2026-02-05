import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test.describe('TS 03 User Registration', () => {
  const screenshotsPath = 'tests/screenshots/TS_03_user_registration/';

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('http://localhost:61117/users');
    await expect(page.getByRole('button', { name: '+ Add User' })).toBeVisible();
  });

    test('TC 01 Valid user registration', async ({ page }) => {
        await page.getByRole('button', { name: '+ Add User' }).click();
        await expect(page).toHaveURL("/users/add");
        await expect(page.getByText('Add New UserUsername *First')).toBeVisible();

        const randomUsername = 'user' + Math.random().toString(36).substring(2, 9);
        await page.getByRole('textbox', { name: 'Username *' }).click();
        await page.getByRole('textbox', { name: 'Username *' }).fill(randomUsername);
        await page.getByRole('textbox', { name: 'First Name *' }).click();
        await page.getByRole('textbox', { name: 'First Name *' }).fill("FirstName" + randomUsername);
        await page.getByRole('textbox', { name: 'First Name *' }).press('Tab');
        await page.getByRole('textbox', { name: 'Last Name *' }).click();
        await page.getByRole('textbox', { name: 'Last Name *' }).fill('LastName' + randomUsername);
        await page.getByRole('textbox', { name: 'Email *' }).click();
        await page.getByRole('textbox', { name: 'Email *' }).fill('aa@student.foi.hr');

        await page.getByRole('button', { name: '▼' }).click();
        await page.getByText('User', { exact: true }).click();

        await page.getByText('📷Choose picture or drag').click();
        await page.locator('input[type="file"]').setInputFiles('./tests/testData/pictures/osoba.jpg');
        await expect(page.locator('form')).toContainText('File selected');
        await expect(page.locator('form')).toContainText('osoba.jpg');
        await page.getByRole('button', { name: 'Add User' }).click();

        await page.screenshot({ path: screenshotsPath + 'TC_01_valid_user/form.png' });

        await expect(page).toHaveURL("/users");
        await page.screenshot({ path: screenshotsPath + 'TC_01_valid_user/valid_user.png' });

    });

    test('TC 02 Invalid mail', async ({ page }) => {
        await page.getByRole('button', { name: '+ Add User' }).click();
        await expect(page).toHaveURL("/users/add");
        await expect(page.getByText('Add New UserUsername *First')).toBeVisible();

        await page.getByRole('textbox', { name: 'Username *' }).click();
        await page.getByRole('textbox', { name: 'Username *' }).fill('pero');
        await page.getByRole('textbox', { name: 'First Name *' }).click();
        await page.getByRole('textbox', { name: 'First Name *' }).press('CapsLock');
        await page.getByRole('textbox', { name: 'First Name *' }).fill('P');
        await page.getByRole('textbox', { name: 'First Name *' }).press('CapsLock');
        await page.getByRole('textbox', { name: 'First Name *' }).fill('Pero');
        await page.getByRole('textbox', { name: 'Last Name *' }).click();
        await page.getByRole('textbox', { name: 'Last Name *' }).press('CapsLock');
        await page.getByRole('textbox', { name: 'Last Name *' }).fill('P');
        await page.getByRole('textbox', { name: 'Last Name *' }).press('CapsLock');
        await page.getByRole('textbox', { name: 'Last Name *' }).fill('Peric');
        await page.getByRole('textbox', { name: 'Email *' }).click();
        await page.getByRole('textbox', { name: 'Email *' }).fill('pero');

        await page.getByRole('button', { name: '▼' }).click();
        await page.getByText('User', { exact: true }).click();

        await page.getByRole('button', { name: 'Add User' }).click();
        await expect(page.getByRole('alert')).toContainText('Please enter a valid email address');
        await page.screenshot({ path: screenshotsPath + 'TC_02_invalid_email/error_message.png' });
        

       
    });

});
/*
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:61117/login');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await expect(page.getByRole('button', { name: '+ Add User' })).toBeVisible();
  await page.getByRole('button', { name: '+ Add User' }).click();
  await expect(page.getByText('Add New UserUsername *First')).toBeVisible();
  await page.getByRole('textbox', { name: 'Username *' }).click();
  await page.getByRole('textbox', { name: 'Username *' }).fill('dleko20');
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'First Name *' }).fill('D');
  await page.getByRole('textbox', { name: 'First Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'First Name *' }).fill('Danijela');
  await page.getByRole('textbox', { name: 'First Name *' }).press('Tab');
  await page.getByRole('textbox', { name: 'Last Name *' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('L');
  await page.getByRole('textbox', { name: 'Last Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('Leko');
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill('dleko20@student.foi.hr');
  await page.getByRole('button', { name: '▼' }).click();
  await page.getByText('User', { exact: true }).click();
  await page.getByText('📷Choose picture or drag').click();
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles('os-z.jpg');
  await expect(page.locator('form')).toContainText('File selected');
  await page.getByText('os-z.jpg').click();
  await expect(page.locator('form')).toContainText('os-z.jpg');
  await page.getByRole('button', { name: 'Add User' }).click();
  await expect(page.getByText('UsersSystem users and administrators+ Add Userdleko20Userdleko20@student.foi.')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('dleko20Userdleko20@student.foi.hr');
  await page.getByRole('button', { name: '+ Add User' }).click();
  await page.getByRole('textbox', { name: 'Username *' }).click();
  await page.getByRole('textbox', { name: 'Username *' }).fill('pero');
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'First Name *' }).fill('P');
  await page.getByRole('textbox', { name: 'First Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'First Name *' }).fill('Pero');
  await page.getByRole('textbox', { name: 'Last Name *' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('P');
  await page.getByRole('textbox', { name: 'Last Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('Peric');
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill('pero');
  await page.getByRole('button', { name: '▼' }).click();
  await page.getByText('User', { exact: true }).click();
  await page.getByRole('button', { name: 'Add User' }).click();
  await expect(page.getByRole('alert')).toContainText('Please enter a valid email address');
  await page.getByRole('link', { name: 'Users' }).click();
  await page.getByRole('button', { name: '+ Add User' }).click();
  await page.getByRole('textbox', { name: 'Username *' }).click();
  await page.getByRole('textbox', { name: 'Username *' }).fill('ilitre100');
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'First Name *' }).fill('I');
  await page.getByRole('textbox', { name: 'First Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'First Name *' }).fill('Ivan');
  await page.getByRole('textbox', { name: 'First Name *' }).press('Tab');
  await page.getByRole('textbox', { name: 'Last Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('M');
  await page.getByRole('textbox', { name: 'Last Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('Milanović-');
  await page.getByRole('textbox', { name: 'Last Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('Milanović-L');
  await page.getByRole('textbox', { name: 'Last Name *' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('Milanović-Litre');
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill('ilitre100@gmail.com');
  await page.getByRole('button', { name: '▼' }).click();
  await page.getByText('Administrator').click();
  await page.getByRole('button', { name: 'Add User' }).click();
  await expect(page.getByRole('alert')).toContainText('Request failed with status code 400');
});
*/