import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';

test.describe.serial('TS 02 UAV Management', () => {
  const screenshotsPath = 'tests/screenshots/TS_02_uav_management/';

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('http://localhost:61117/uavs');
    await expect(page.getByRole('button', { name: '+ Add UAV' })).toBeVisible();
  });

  test('TC 01 Add new UAV - All valid data', async ({ page }) => {
    await test.step('Step description', async () => {
        await page.getByRole('button', { name: '+ Add UAV' }).click();
        await expect(page).toHaveURL("/uavs/add");
        await expect(page.getByText('Add New UAVName *Type *Max')).toBeVisible();
    });

    await test.step('Step description', async () => {
        await page.getByRole('textbox', { name: 'Name *' }).click();
        await page.getByRole('textbox', { name: 'Name *' }).fill('DJI Mavic 3 Pro');
        await page.getByRole('textbox', { name: 'Type *' }).click();
        await page.getByRole('textbox', { name: 'Type *' }).fill('Quadcopter');
        await page.getByRole('spinbutton', { name: 'Max Speed (km/h) *' }).click();
        await page.getByRole('spinbutton', { name: 'Max Speed (km/h) *' }).fill('34');
        await page.getByRole('textbox', { name: 'Flight Time *' }).click();
        await page.getByRole('textbox', { name: 'Flight Time *' }).fill('00:35:30');
        await page.getByRole('spinbutton', { name: 'Weight (kg) *' }).click();
        await page.getByRole('spinbutton', { name: 'Weight (kg) *' }).fill('4');
    });

    await test.step('Step description', async () => {
        await page.getByRole('button', { name: '▼' }).click();
        await page.locator('.sc-eQaGpr').first().click();
        await page.locator('#root div').filter({ hasText: 'Add New UAVName *Type *Max' }).click();
        await expect(page.locator('form')).toContainText('DJI Zenmuse X7×');
    });

    await test.step('Step description', async () => {
        await page.getByText('📷Choose picture or drag').click();
        await page.locator('input[type="file"]').setInputFiles('./tests/testData/pictures/Drone_ATOM_SE_4K.webp');
        await expect(page.locator('form')).toContainText('File selected');
        await expect(page.locator('form')).toContainText('Drone_ATOM_SE_4K.webp');

        await page.screenshot({ path: screenshotsPath + 'TC_01_Add_new_UAV_All_valid/form.png' });
    });

    await test.step('Step description', async () => {
        await page.getByRole('button', { name: 'Add UAV' }).click();
        await expect(page).toHaveURL("/uavs/add");
    });

   await test.step('Step description', async () => {
     await page.getByRole('button', { name: '3' }).click();
     await expect(page.getByRole('main')).toContainText('DJI Mavic 3 ProQuadcopter34 km/h');

     await page.screenshot({ path: screenshotsPath + 'TC_01_Add_new_UAV_All_valid/created_uav.png' });
   });
    
  });

    test('TC 02 Add new UAV - Missing required fields', async ({ page }) => {
    await test.step('Step description', async () => {
        await page.getByRole('button', { name: '+ Add UAV' }).click();
        await expect(page).toHaveURL("/uavs/add");
        await expect(page.getByText('Add New UAVName *Type *Max')).toBeVisible();
    });

    await test.step('Step description', async () => {
        await page.getByRole('textbox', { name: 'Name *' }).click();
        await page.getByRole('textbox', { name: 'Name *' }).fill('Reaper MQ-9');
        await page.getByRole('textbox', { name: 'Type *' }).click();
        await page.getByRole('textbox', { name: 'Type *' }).fill('Fixed-wing');
        await page.getByRole('spinbutton', { name: 'Max Speed (km/h) *' }).click();
        await page.getByRole('spinbutton', { name: 'Max Speed (km/h) *' }).fill('2');

        await page.screenshot({ path: screenshotsPath + 'TC_02_Add_new_UAV_Missing_required_fields/form_with_missing_data.png' });
    });

    await test.step('Step description', async () => {
        await page.getByRole('button', { name: 'Add UAV' }).click();
        await expect(page).toHaveURL("/uavs/add?");
        await page.screenshot({ path: screenshotsPath + 'TC_02_Add_new_UAV_Missing_required_fields/form_validation_failed.png' });
    });
  });

    test('TC 03 Delete existing UAV', async ({ page }) => {
        await test.step('Step description', async () => {
            await page.getByRole('button', { name: '3' }).click();
            await expect(page.locator('div').filter({ hasText: 'DJI Mavic 3 ProQuadcopter34' }).nth(3)).toBeVisible();
            page.once('dialog', dialog => {
                console.log(`Dialog message: ${dialog.message()}`);
                dialog.accept(); 
            });
            await page.getByRole('button').nth(4).click();
        });
  });

});

/*
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:61117/login');
  await expect(page.getByRole('button', { name: '+ Add UAV' })).toBeVisible();
  await page.getByRole('button', { name: '+ Add UAV' }).click();
  await expect(page.getByText('Add New UAVName *Type *Max')).toBeVisible();
  await page.getByRole('textbox', { name: 'Name *' }).click();
  await page.getByRole('textbox', { name: 'Name *' }).click();
  await page.getByRole('textbox', { name: 'Name *' }).fill('DJI Mavic 3 Pro');
  await page.getByRole('textbox', { name: 'Type *' }).click();
  await page.getByRole('textbox', { name: 'Type *' }).fill('Quadcopter');
  await page.getByRole('spinbutton', { name: 'Max Speed (km/h) *' }).click();
  await page.getByRole('spinbutton', { name: 'Max Speed (km/h) *' }).fill('34');
  await page.getByRole('textbox', { name: 'Flight Time *' }).click();
  await page.getByRole('textbox', { name: 'Flight Time *' }).fill('00:35:30');
  await page.getByRole('spinbutton', { name: 'Weight (kg) *' }).click();
  await page.getByRole('spinbutton', { name: 'Weight (kg) *' }).fill('4');
  await page.getByRole('button', { name: '▼' }).click();
  await page.getByRole('button', { name: '▼' }).click();
  await page.getByRole('button', { name: '▼' }).click();
  await page.locator('.sc-eQaGpr').first().click();
  await page.locator('#root div').filter({ hasText: 'Add New UAVName *Type *Max' }).click();
  await page.getByText('📷').click();
  await page.getByText('📷Choose picture or drag').click();
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles('Drone_ATOM_SE_4K.webp');
  await page.getByRole('button', { name: 'Add UAV' }).click();
  await page.getByRole('button', { name: '3' }).click();
  await expect(page.getByText('DJI Mavic Air 2Quadcopter34 km/hDJI Mavic 3Quadcopter68 km/hDJI Mavic 3')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('DJI Mavic 3 ProQuadcopter34 km/h');
  await page.getByRole('button', { name: '+ Add UAV' }).click();
  await page.getByRole('textbox', { name: 'Name *' }).click();
  await page.getByRole('textbox', { name: 'Name *' }).fill('Reaper MQ-9');
  await page.getByRole('textbox', { name: 'Type *' }).click();
  await page.getByRole('textbox', { name: 'Type *' }).fill('Fixed-wing');
  await page.getByRole('spinbutton', { name: 'Max Speed (km/h) *' }).click();
  await page.getByRole('spinbutton', { name: 'Max Speed (km/h) *' }).fill('2');
  await page.getByRole('button', { name: 'Add UAV' }).click();
  await page.getByRole('button', { name: '▼' }).click();
  await page.locator('.sc-eQaGpr').first().click();
  await page.locator('#root div').filter({ hasText: 'Add New UAVName *Type *Max' }).click();
  await expect(page.locator('form')).toContainText('DJI Zenmuse X7×');
  await page.getByText('📷Choose picture or drag').click();
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles('Drone_ATOM_SE_4K.webp');
  await expect(page.locator('form')).toContainText('File selected');
  await expect(page.locator('form')).toContainText('Drone_ATOM_SE_4K.webp');
    await page.getByRole('button', { name: '3' }).click();
  await expect(page.locator('div').filter({ hasText: 'DJI Mavic 3 ProQuadcopter34' }).nth(3)).toBeVisible();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button').nth(4).click();
});
*/
