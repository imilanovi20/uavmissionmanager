import { test, expect } from '@playwright/test';

test.describe('TS 01 Login and authentication', () => {
  const screenshotsPath = 'tests/screenshots/TS_01_login/';
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:61117/login');
    await expect(page.getByText('UAV Mission ManagerUsernamePasswordLogin')).toBeVisible();
  });

  test('TC 01 Admin login test', async ({ page }) => {
    
    await test.step('Fill admin credentials and login', async () => {
      await page.getByRole('textbox', { name: 'Username' }).click();
      await page.getByRole('textbox', { name: 'Username' }).fill('ilitre100');
      await page.getByRole('textbox', { name: 'Password' }).click();
      await page.getByRole('textbox', { name: 'Password' }).fill('oao2t y@aM');
      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page).toHaveURL(/missions/);
      await expect(page.getByRole('img', { name: 'User Avatar' })).toBeVisible();
    });

    await test.step('Verify username and role in dropdown menu', async () => {
      await page.getByRole('img', { name: 'User Avatar' }).click();
      await expect(page.getByText('ilitre100')).toBeVisible();
      await expect(page.getByText('Admin')).toBeVisible();
      await page.screenshot({ path: screenshotsPath + 'TC1_01_admin/main_page.png' });
      await page.keyboard.press('Escape');
    });

    await test.step('Navigate to Users page and verify admin functionality', async () => {
      await page.getByRole('link', { name: 'Users' }).click();
      await expect(page).toHaveURL(/users/);
      await expect(page.getByRole('button', { name: '+ Add User' })).toBeVisible();
    });

    await test.step('Navigate to UAVs page and verify admin functionality', async () => {
      await page.getByRole('link', { name: 'UAVs' }).click();
      await expect(page).toHaveURL(/uavs/);
      await expect(page.getByRole('button', { name: '+ Add UAV' })).toBeVisible();
    });
  });

  test('TC 02 User login test', async ({ page }) => {
    
    await test.step('Fill user credentials and login', async () => {
      await page.getByRole('textbox', { name: 'Username' }).click();
      await page.getByRole('textbox', { name: 'Username' }).fill('litreluka');
      await page.getByRole('textbox', { name: 'Password' }).click();
      await page.getByRole('textbox', { name: 'Password' }).fill('4%YeiyXziH');
      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page).toHaveURL(/missions/);
      await expect(page.getByRole('img', { name: 'User Avatar' })).toBeVisible();
    });

    await test.step('Verify username and role in dropdown menu', async () => {
      await page.getByRole('img', { name: 'User Avatar' }).click();
      await expect(page.getByText('litreluka')).toBeVisible();
      await expect(page.getByText('User', { exact: true })).toBeVisible();
      await page.screenshot({ path: screenshotsPath + 'TC1_02_user/main_page.png' });
      await page.keyboard.press('Escape');
    });

    await test.step('Navigate to Users page', async () => {
      await page.getByRole('link', { name: 'Users' }).click();
      await expect(page).toHaveURL(/users/);
    });

    await test.step('Navigate to UAVs page', async () => {
      await page.getByRole('link', { name: 'UAVs' }).click();
      await expect(page).toHaveURL(/uavs/);
    });
  });

  test('TC 03 Invalid credentials', async ({ page }) => {
    
    await test.step('Fill invalid credentials and verify error message', async () => {
      await page.getByRole('textbox', { name: 'Username' }).click();
      await page.getByRole('textbox', { name: 'Username' }).fill('ivoivic');
      await page.getByRole('textbox', { name: 'Password' }).click();
      await page.getByRole('textbox', { name: 'Password' }).fill('1v0nep0st0j1');
      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page.getByRole('alert')).toContainText('Invalid login credentials.');
      await expect(page.getByText('Invalid login credentials.')).toBeVisible();

      await page.screenshot({ path: screenshotsPath + 'TC1_03_invalid_credentials/error_message.png' });
    });
  });
});

/*
test('test', async ({ page }) => {
  await page.goto('http://localhost:61117/login');
  await expect(page.getByText('UAV Mission ManagerUsernamePasswordLogin')).toBeVisible();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('ilitre100');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('oao2t y@aM');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('img', { name: 'User Avatar' }).click();
  await page.getByRole('link', { name: 'Users' }).click();
  await expect(page.getByRole('button', { name: '+ Add User' })).toBeVisible();
  await page.getByRole('link', { name: 'UAVs' }).click();
  await page.getByRole('button', { name: '+ Add UAV' }).click();
  await expect(page.getByRole('button', { name: '+ Add UAV' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('litreluka');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('4%YeiyXziH');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('img', { name: 'User Avatar' }).click();
  await expect(page.getByText('MissionsPlan and manage UAV missions+ New MissionAll')).toBeVisible();
  await page.getByRole('link', { name: 'Users' }).click();
  await page.getByRole('link', { name: 'UAVs' }).click();
  await page.getByRole('img', { name: 'User Avatar' }).click();
  await page.getByText('Logout').click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('ivoivic');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('1v0nep0st0j1');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('alert')).toContainText('Invalid login credentials.');
  await expect(page.getByText('Invalid login credentials.')).toBeVisible();
});
*/