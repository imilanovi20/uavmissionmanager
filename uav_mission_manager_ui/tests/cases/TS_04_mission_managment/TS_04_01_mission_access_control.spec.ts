import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsUser } from '../helpers/auth';
import { addGeneralInfo, addInitialFormation, addUAVs } from '../helpers/wizard_data';

test.describe.serial('TS 04 Mission Management', () => {
  const screenshotsPath = 'tests/screenshots/TS_04_mission_management/';

  test.afterEach(async ({ page }) => {
    await test.step('Delete mission', async () => {
      await loginAsAdmin(page);
      await page.getByRole('button', { name: 'All Missions' }).first().click();
      await page.getByRole('textbox', { name: 'Search missions by name,' }).click();
      await page.getByRole('textbox', { name: 'Search missions by name,' }).fill('Operation Skywatch');
      await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();

      page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept();
      });
      await page.getByRole('button').filter({ hasText: /^$/ }).click();
      await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).not.toBeVisible();
    });
  });

  test('TC 01 Admin creates mission - unassigned user cannot see it', async ({ page }) => {
    test.setTimeout(60000);
    await test.step('Login as admin and navigate to missions page', async () => {
      await loginAsAdmin(page);
      await expect(page).toHaveURL("/missions");
      await expect(page.getByRole('button', { name: '+ New Mission' })).toBeVisible();
      await page.getByRole('button', { name: '+ New Mission' }).click();
    });

    await test.step('Fill in mission details', async () => {
      await addGeneralInfo(page);
      await page.screenshot({ path: screenshotsPath + 'TC_01/wizard_general_info.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Select UAVs', async () => {
      await addUAVs(page);
      
      await page.screenshot({ path: screenshotsPath + 'TC_01/wizard_uavs.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Set formation type', async () => {
      await addInitialFormation(page);
      
      await page.screenshot({ path: screenshotsPath + 'TC_01/wizard_formation.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Add responsible persons', async () => {
      await expect(page.getByText('New MissionQuitStep 4 of 8:')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Add Responsible Persons' })).toBeVisible();
      await page.getByRole('button', { name: 'Add Responsible Persons' }).click();
      await page.locator('div').filter({ hasText: /^ilitre100ilitre100@gmail\.comRole: Admin$/ }).first().click();
      await page.getByRole('button', { name: 'Confirm Selection' }).click();
      await expect(page.getByRole('main')).toContainText('ilitre100ilitre100@gmail.com');
      
      await page.screenshot({ path: screenshotsPath + 'TC_01/wizard_responsible_persons.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Add waypoints', async () => {
      await expect(page.getByText('New MissionQuitStep 5 of 8:')).toBeVisible();

      // Waypoint 1
      await page.getByPlaceholder('Enter latitude...').click();
      await page.getByPlaceholder('Enter latitude...').fill('43.706270');
      await page.getByPlaceholder('Enter longitude...').click();
      await page.getByPlaceholder('Enter longitude...').fill('16.630313');
      await page.getByRole('button', { name: 'Add Waypoint' }).click();
      await expect(page.getByRole('main')).toContainText('43.706270, 16.630313');

      // Waypoint 2
      await page.getByPlaceholder('Enter latitude...').click();
      await page.getByPlaceholder('Enter latitude...').fill('43.706648');
      await page.getByPlaceholder('Enter longitude...').click();
      await page.getByPlaceholder('Enter longitude...').fill('16.630047');
      await page.getByRole('button', { name: 'Add Waypoint' }).click();
      await expect(page.getByText('Waypoint #2')).toBeVisible();
      await expect(page.getByRole('main')).toContainText('43.706648, 16.630047');

      await page.screenshot({ path: screenshotsPath + 'TC_01/wizard_waypoints.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Detect obstacles and generate optimal route', async () => {
      await expect(page.getByText('New MissionQuitStep 6 of 8:')).toBeVisible();
      /*
      await page.getByRole('checkbox', { name: '🏢 Buildings' }).check();
      await page.getByRole('button', { name: 'Detect Obstacles' }).click();
      await expect(page.getByRole('heading', { name: /Detected Obstacles \(\d+\)/ })).toBeVisible();
      await page.getByRole('button', { name: 'Generate Optimal Route' }).click();

      await page.waitForLoadState('networkidle', { timeout: 30000 });

      await expect(page.getByRole('main')).toContainText('Detected Obstacles');
      */
      
      await page.screenshot({ path: screenshotsPath + 'TC_01/wizard_obstacles.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Verify mission details and status', async () => {
      await expect(page.getByText('New MissionQuitStep 7 of 8:')).toBeVisible();
      await expect(page.getByText('Loading weather and permits data...')).not.toBeVisible({ timeout: 30000 });
      await expect(page.getByRole('main')).toContainText('STATUSClear Airspace');

      await expect(page.locator('div').filter({ hasText: /^STATUSNo Permission Needed$/ }).first()).toBeVisible();

      await expect(page.getByText('Battery UsagePROJECTED FLIGHT')).toBeVisible();

      await expect(page.getByRole('heading', { name: 'Operation Category' })).toBeVisible();

      await expect(page.getByRole('heading', { name: 'Weather Conditions' })).toBeVisible();

      await page.screenshot({ path: screenshotsPath + 'TC_01/wizard_permits.png' });

      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Create mission', async () => {
        await expect(page.getByText('New MissionQuitStep 8 of 8:')).toBeVisible();
        await page.screenshot({ path: screenshotsPath + 'TC_01/wizard_final.png' });
        
        await page.getByRole('button', { name: 'Create Mission' }).click();
        await expect(page).toHaveURL("/missions", { timeout: 30000 });
        await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
    });

    await test.step('Check that user connot see mission', async () => {
      await loginAsUser(page);
      await expect(page).toHaveURL("/missions", { timeout: 30000 });
      await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).not.toBeVisible();
    });
  });

  test('TC 02 Admin creates mission - assigned user can see it', async ({ page }) => {
    test.setTimeout(60000);
    await test.step('Login as admin and navigate to missions page', async () => {
      await loginAsAdmin(page);
      await expect(page).toHaveURL("/missions");
      await expect(page.getByRole('button', { name: '+ New Mission' })).toBeVisible();
      await page.getByRole('button', { name: '+ New Mission' }).click();
    });

    await test.step('Fill in mission details', async () => {
      await addGeneralInfo(page);
      await page.screenshot({ path: screenshotsPath + 'TC_02/wizard_general_info.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Select UAVs', async () => {
      await addUAVs(page);
      
      await page.screenshot({ path: screenshotsPath + 'TC_02/wizard_uavs.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Set formation type', async () => {
      await addInitialFormation(page);
      
      await page.screenshot({ path: screenshotsPath + 'TC_02/wizard_formation.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Add responsible persons', async () => {
      await expect(page.getByText('New MissionQuitStep 4 of 8:')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Add Responsible Persons' })).toBeVisible();
      await page.getByRole('button', { name: 'Add Responsible Persons' }).click();
      await page.locator('div').filter({ hasText: /^ilitre100ilitre100@gmail\.comRole: Admin$/ }).first().click();
      await page.locator('div').filter({ hasText: /^litrelukalitreluka@gmail\.comRole: User$/ }).first().click();
      await page.getByRole('button', { name: 'Confirm Selection' }).click();
      await expect(page.getByRole('main')).toContainText('ilitre100ilitre100@gmail.com');
      await expect(page.getByRole('main')).toContainText('litrelukalitreluka@gmail.com');
      
      await page.screenshot({ path: screenshotsPath + 'TC_02/wizard_responsible_persons.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Add waypoints', async () => {
      await expect(page.getByText('New MissionQuitStep 5 of 8:')).toBeVisible();

      // Waypoint 1
      await page.getByPlaceholder('Enter latitude...').click();
      await page.getByPlaceholder('Enter latitude...').fill('43.706270');
      await page.getByPlaceholder('Enter longitude...').click();
      await page.getByPlaceholder('Enter longitude...').fill('16.630313');
      await page.getByRole('button', { name: 'Add Waypoint' }).click();
      await expect(page.getByRole('main')).toContainText('43.706270, 16.630313');

      // Waypoint 2
      await page.getByPlaceholder('Enter latitude...').click();
      await page.getByPlaceholder('Enter latitude...').fill('43.706648');
      await page.getByPlaceholder('Enter longitude...').click();
      await page.getByPlaceholder('Enter longitude...').fill('16.630047');
      await page.getByRole('button', { name: 'Add Waypoint' }).click();
      await expect(page.getByText('Waypoint #2')).toBeVisible();
      await expect(page.getByRole('main')).toContainText('43.706648, 16.630047');

      await page.screenshot({ path: screenshotsPath + 'TC_02/wizard_waypoints.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Detect obstacles and generate optimal route', async () => {
      await expect(page.getByText('New MissionQuitStep 6 of 8:')).toBeVisible();
      /*
      await page.getByRole('checkbox', { name: '🏢 Buildings' }).check();
      await page.getByRole('button', { name: 'Detect Obstacles' }).click();
      await expect(page.getByRole('heading', { name: /Detected Obstacles \(\d+\)/ })).toBeVisible();
      await page.getByRole('button', { name: 'Generate Optimal Route' }).click();

      await page.waitForLoadState('networkidle', { timeout: 30000 });

      await expect(page.getByRole('main')).toContainText('Detected Obstacles');
      */
      
      await page.screenshot({ path: screenshotsPath + 'TC_02/wizard_obstacles.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Verify mission details and status', async () => {
      await expect(page.getByText('New MissionQuitStep 7 of 8:')).toBeVisible();
      await expect(page.getByText('Loading weather and permits data...')).not.toBeVisible({ timeout: 30000 });
      await expect(page.getByRole('main')).toContainText('STATUSClear Airspace');

      await expect(page.locator('div').filter({ hasText: /^STATUSNo Permission Needed$/ }).first()).toBeVisible();

      await expect(page.getByText('Battery UsagePROJECTED FLIGHT')).toBeVisible();

      await expect(page.getByRole('heading', { name: 'Operation Category' })).toBeVisible();

      await expect(page.getByRole('heading', { name: 'Weather Conditions' })).toBeVisible();

      await page.screenshot({ path: screenshotsPath + 'TC_02/wizard_permits.png' });

      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Create mission', async () => {
        await expect(page.getByText('New MissionQuitStep 8 of 8:')).toBeVisible();
        await page.screenshot({ path: screenshotsPath + 'TC_02/wizard_final.png' });
        
        await page.getByRole('button', { name: 'Create Mission' }).click();
        await expect(page).toHaveURL("/missions", { timeout: 30000 });
        await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
    });

    await test.step('Check that user can see mission', async () => {
      await loginAsUser(page);
      await expect(page).toHaveURL("/missions", { timeout: 30000 });
      await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
    });
  });

    test('TC 03 User creates mission - assigned admin can see it', async ({ page }) => {
    test.setTimeout(60000);
    await test.step('Login as user and navigate to missions page', async () => {
      await loginAsUser(page);
      await expect(page).toHaveURL("/missions");
      await expect(page.getByRole('button', { name: '+ New Mission' })).toBeVisible();
      await page.getByRole('button', { name: '+ New Mission' }).click();
    });

    await test.step('Fill in mission details', async () => {
      await addGeneralInfo(page);
      await page.screenshot({ path: screenshotsPath + 'TC_03/wizard_general_info.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Select UAVs', async () => {
      await addUAVs(page);
      
      await page.screenshot({ path: screenshotsPath + 'TC_03/wizard_uavs.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Set formation type', async () => {
      await addInitialFormation(page);
      
      await page.screenshot({ path: screenshotsPath + 'TC_03/wizard_formation.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Add responsible persons', async () => {
      await expect(page.getByText('New MissionQuitStep 4 of 8:')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Add Responsible Persons' })).toBeVisible();
      await page.getByRole('button', { name: 'Add Responsible Persons' }).click();
      await page.locator('div').filter({ hasText: /^ilitre100ilitre100@gmail\.comRole: Admin$/ }).first().click();
      await page.locator('div').filter({ hasText: /^litrelukalitreluka@gmail\.comRole: User$/ }).first().click();
      await page.getByRole('button', { name: 'Confirm Selection' }).click();
      await expect(page.getByRole('main')).toContainText('ilitre100ilitre100@gmail.com');
      await expect(page.getByRole('main')).toContainText('litrelukalitreluka@gmail.com');
      
      await page.screenshot({ path: screenshotsPath + 'TC_03/wizard_responsible_persons.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Add waypoints', async () => {
      await expect(page.getByText('New MissionQuitStep 5 of 8:')).toBeVisible();

      // Waypoint 1
      await page.getByPlaceholder('Enter latitude...').click();
      await page.getByPlaceholder('Enter latitude...').fill('43.706270');
      await page.getByPlaceholder('Enter longitude...').click();
      await page.getByPlaceholder('Enter longitude...').fill('16.630313');
      await page.getByRole('button', { name: 'Add Waypoint' }).click();
      await expect(page.getByRole('main')).toContainText('43.706270, 16.630313');

      // Waypoint 2
      await page.getByPlaceholder('Enter latitude...').click();
      await page.getByPlaceholder('Enter latitude...').fill('43.706648');
      await page.getByPlaceholder('Enter longitude...').click();
      await page.getByPlaceholder('Enter longitude...').fill('16.630047');
      await page.getByRole('button', { name: 'Add Waypoint' }).click();
      await expect(page.getByText('Waypoint #2')).toBeVisible();
      await expect(page.getByRole('main')).toContainText('43.706648, 16.630047');

      await page.screenshot({ path: screenshotsPath + 'TC_03/wizard_waypoints.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Detect obstacles and generate optimal route', async () => {
      await expect(page.getByText('New MissionQuitStep 6 of 8:')).toBeVisible();
      /*
      await page.getByRole('checkbox', { name: '🏢 Buildings' }).check();
      await page.getByRole('button', { name: 'Detect Obstacles' }).click();
      await expect(page.getByRole('heading', { name: /Detected Obstacles \(\d+\)/ })).toBeVisible();
      await page.getByRole('button', { name: 'Generate Optimal Route' }).click();

      await page.waitForLoadState('networkidle', { timeout: 30000 });

      await expect(page.getByRole('main')).toContainText('Detected Obstacles');
      */
      
      await page.screenshot({ path: screenshotsPath + 'TC_03/wizard_obstacles.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Verify mission details and status', async () => {
      await expect(page.getByText('New MissionQuitStep 7 of 8:')).toBeVisible();
      await expect(page.getByText('Loading weather and permits data...')).not.toBeVisible({ timeout: 30000 });
      await expect(page.getByRole('main')).toContainText('STATUSClear Airspace');

      await expect(page.locator('div').filter({ hasText: /^STATUSNo Permission Needed$/ }).first()).toBeVisible();

      await expect(page.getByText('Battery UsagePROJECTED FLIGHT')).toBeVisible();

      await expect(page.getByRole('heading', { name: 'Operation Category' })).toBeVisible();

      await expect(page.getByRole('heading', { name: 'Weather Conditions' })).toBeVisible();

      await page.screenshot({ path: screenshotsPath + 'TC_03/wizard_permits.png' });

      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Create mission', async () => {
        await expect(page.getByText('New MissionQuitStep 8 of 8:')).toBeVisible();
        await page.screenshot({ path: screenshotsPath + 'TC_03/wizard_final.png' });
        
        await page.getByRole('button', { name: 'Create Mission' }).click();
        await expect(page).toHaveURL("/missions", { timeout: 30000 });
        await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
    });

    await test.step('Check that admin can see mission', async () => {
      await loginAsAdmin(page);
      await expect(page).toHaveURL("/missions", { timeout: 30000 });
      await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
      await page.getByRole('button', { name: 'All Missions' }).first().click();
      await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
    });
  });

  test('TC 04 User creates mission - unassigned admin sees it only in All Missions, not in My Missions', async ({ page }) => {
    test.setTimeout(60000);
    await test.step('Login as user and navigate to missions page', async () => {
      await loginAsUser(page);
      await expect(page).toHaveURL("/missions");
      await expect(page.getByRole('button', { name: '+ New Mission' })).toBeVisible();
      await page.getByRole('button', { name: '+ New Mission' }).click();
    });

    await test.step('Fill in mission details', async () => {
      await addGeneralInfo(page);
      await page.screenshot({ path: screenshotsPath + 'TC_04/wizard_general_info.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Select UAVs', async () => {
      await addUAVs(page);
      
      await page.screenshot({ path: screenshotsPath + 'TC_04/wizard_uavs.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Set formation type', async () => {
      await addInitialFormation(page);
      
      await page.screenshot({ path: screenshotsPath + 'TC_04/wizard_formation.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Add responsible persons', async () => {
      await expect(page.getByText('New MissionQuitStep 4 of 8:')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Add Responsible Persons' })).toBeVisible();
      await page.getByRole('button', { name: 'Add Responsible Persons' }).click();
      await page.locator('div').filter({ hasText: /^litrelukalitreluka@gmail\.comRole: User$/ }).first().click();
      await page.getByRole('button', { name: 'Confirm Selection' }).click();
      await expect(page.getByRole('main')).toContainText('litrelukalitreluka@gmail.com');
      
      await page.screenshot({ path: screenshotsPath + 'TC_04/wizard_responsible_persons.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Add waypoints', async () => {
      await expect(page.getByText('New MissionQuitStep 5 of 8:')).toBeVisible();

      // Waypoint 1
      await page.getByPlaceholder('Enter latitude...').click();
      await page.getByPlaceholder('Enter latitude...').fill('43.706270');
      await page.getByPlaceholder('Enter longitude...').click();
      await page.getByPlaceholder('Enter longitude...').fill('16.630313');
      await page.getByRole('button', { name: 'Add Waypoint' }).click();
      await expect(page.getByRole('main')).toContainText('43.706270, 16.630313');

      // Waypoint 2
      await page.getByPlaceholder('Enter latitude...').click();
      await page.getByPlaceholder('Enter latitude...').fill('43.706648');
      await page.getByPlaceholder('Enter longitude...').click();
      await page.getByPlaceholder('Enter longitude...').fill('16.630047');
      await page.getByRole('button', { name: 'Add Waypoint' }).click();
      await expect(page.getByText('Waypoint #2')).toBeVisible();
      await expect(page.getByRole('main')).toContainText('43.706648, 16.630047');

      await page.screenshot({ path: screenshotsPath + 'TC_04/wizard_waypoints.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Detect obstacles and generate optimal route', async () => {
      await expect(page.getByText('New MissionQuitStep 6 of 8:')).toBeVisible();
      /*
      await page.getByRole('checkbox', { name: '🏢 Buildings' }).check();
      await page.getByRole('button', { name: 'Detect Obstacles' }).click();
      await expect(page.getByRole('heading', { name: /Detected Obstacles \(\d+\)/ })).toBeVisible();
      await page.getByRole('button', { name: 'Generate Optimal Route' }).click();

      await page.waitForLoadState('networkidle', { timeout: 30000 });

      await expect(page.getByRole('main')).toContainText('Detected Obstacles');
      */
      
      await page.screenshot({ path: screenshotsPath + 'TC_04/wizard_obstacles.png' });
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Verify mission details and status', async () => {
      await expect(page.getByText('New MissionQuitStep 7 of 8:')).toBeVisible();
      await expect(page.getByText('Loading weather and permits data...')).not.toBeVisible({ timeout: 30000 });
      await expect(page.getByRole('main')).toContainText('STATUSClear Airspace');

      await expect(page.locator('div').filter({ hasText: /^STATUSNo Permission Needed$/ }).first()).toBeVisible();

      await expect(page.getByText('Battery UsagePROJECTED FLIGHT')).toBeVisible();

      await expect(page.getByRole('heading', { name: 'Operation Category' })).toBeVisible();

      await expect(page.getByRole('heading', { name: 'Weather Conditions' })).toBeVisible();

      await page.screenshot({ path: screenshotsPath + 'TC_04/wizard_permits.png' });

      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Create mission', async () => {
        await expect(page.getByText('New MissionQuitStep 8 of 8:')).toBeVisible();
        await page.screenshot({ path: screenshotsPath + 'TC_04/wizard_final.png' });
        
        await page.getByRole('button', { name: 'Create Mission' }).click();
        await expect(page).toHaveURL("/missions", { timeout: 30000 });
        await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
    });

    await test.step('Check that admin can see mission', async () => {
      await loginAsAdmin(page);
      await expect(page).toHaveURL("/missions", { timeout: 30000 });
      await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).not.toBeVisible();
      await page.getByRole('button', { name: 'All Missions' }).first().click();
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
    });
  });
});
/*
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:61117/login');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('ilitre100');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('oao2t y@aM');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('button', { name: '+ New Mission' })).toBeVisible();
  await page.getByRole('button', { name: '+ New Mission' }).click();
  await expect(page.getByText('New MissionQuitStep 1 of 8:')).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter mission name' }).click();
  await page.getByRole('textbox', { name: 'Enter mission name' }).fill('Operation Skywatch');
  await page.locator('input[type="date"]').fill('2026-02-08');
  await page.getByRole('textbox', { name: 'Describe the mission' }).click();
  await page.getByRole('textbox', { name: 'Describe the mission' }).fill('A comprehensive aerial reconnaissance mission covering the northern sector perimeter. Primary objectives include terrain mapping, infrastructure assessment, and identifying potential security vulnerabilities across a 15km radius.');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('New MissionQuitStep 2 of 8:')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add UAVs' })).toBeVisible();
  await page.getByRole('button', { name: 'Add UAVs' }).click();
  await expect(page.locator('.sc-dMmcxd')).toBeVisible();
  await page.locator('div').filter({ hasText: /^UAVSome UavMax Speed: 21 km\/h$/ }).first().click();
  await page.locator('div').filter({ hasText: /^DJI Mavic 3QuadcopterMax Speed: 45 km\/h$/ }).first().click();
  await page.locator('div').filter({ hasText: /^UAV 2Some Uav 2Max Speed: 22 km\/h$/ }).nth(2).click();
  await page.getByRole('button', { name: 'Confirm Selection' }).click();
  await expect(page.getByRole('main')).toContainText('UAVSome Uav21 km/h');
  await expect(page.getByRole('main')).toContainText('UAV 2Some Uav 222 km/h');
  await expect(page.getByRole('main')).toContainText('DJI Mavic 3Quadcopter45 km/h');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('New MissionQuitStep 3 of 8:')).toBeVisible();
  await page.getByRole('button', { name: 'Line', exact: true }).click();
  await page.getByRole('button', { name: 'Auto-Arrange Line Formation' }).click();
  await page.getByRole('button', { name: 'Grid' }).click();
  await page.getByRole('button', { name: 'Auto-Arrange Grid Formation' }).click();
  await page.getByRole('button', { name: 'Custom' }).click();
  await page.locator('.sc-fSwKIM > .lucide').first().click();
  await page.getByRole('button').filter({ hasText: /^$/ }).first().click();
  await page.locator('div').filter({ hasText: /^UAVSome Uav$/ }).first().click();
  await page.getByText('Some Uav', { exact: true }).click();
  await page.locator('div').filter({ hasText: /^UAVSome Uav$/ }).first().click();
  await page.getByRole('button', { name: 'Circle' }).click();
  await page.getByRole('button', { name: 'Auto-Arrange Circle Formation' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('New MissionQuitStep 4 of 8:')).toBeVisible();
  await page.getByRole('button', { name: 'Add Responsible Persons' }).click();
  await page.locator('div').filter({ hasText: /^litrelukalitreluka@gmail\.comRole: User$/ }).first().click();
  await page.locator('div').filter({ hasText: /^sbicak34sbicak20@student\.foi\.hrRole: User$/ }).first().click();
  await page.getByRole('button', { name: 'Confirm Selection' }).click();
  await expect(page.getByRole('main')).toContainText('litrelukalitreluka@gmail.com');
  await expect(page.locator('div').filter({ hasText: /^sbicak34sbicak20@student\.foi\.hr$/ }).first()).toBeVisible();
  await expect(page.getByRole('main')).toContainText('sbicak34sbicak20@student.foi.hr');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('div').filter({ hasText: /^\+− Leaflet \| © OpenStreetMap contributors$/ }).nth(1).click();
  await page.locator('div').filter({ hasText: /^\+− Leaflet \| © OpenStreetMap contributors$/ }).nth(1).click();
  await page.locator('div').filter({ hasText: /^\+− Leaflet \| © OpenStreetMap contributors$/ }).nth(1).click();
  await page.locator('div').filter({ hasText: /^\+− Leaflet \| © OpenStreetMap contributors$/ }).nth(1).click();
  await page.locator('div').filter({ hasText: /^\+− Leaflet \| © OpenStreetMap contributors$/ }).nth(1).click();
  await page.getByText('1 +− Leaflet | ©').click();
  await page.getByText('1 +− Leaflet | ©').click();
  await page.getByText('1 +− Leaflet | ©').click();
  await page.getByText('1 +− Leaflet | ©').click();
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByText('1 2 +− Leaflet | ©').click();
  await page.getByText('1 2 +− Leaflet | ©').click();
  await page.getByText('1 2 +− Leaflet | ©').click();
  await page.getByText('1 2 +− Leaflet | ©').click();
  await page.getByText('1 2 +− Leaflet | ©').click();
  await page.getByText('1 2 +− Leaflet | ©').click();
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByRole('button', { name: '+ Add Custom Task' }).first().click();
  await page.getByRole('button', { name: '🔄 Change Formation Modify' }).click();
  await page.getByRole('button', { name: 'V-Formation' }).click();
  await page.getByRole('button', { name: 'Auto-Arrange V-Formation' }).click();
  await page.getByRole('button', { name: 'Save Task' }).click();
  await page.getByRole('button', { name: '+ Add Custom Task' }).nth(1).click();
  await page.getByRole('button', { name: '⚡ Execute Command Send' }).click();
  await page.locator('.sc-fFrLqr').click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('New MissionQuitStep 6 of 8:')).toBeVisible();
  await page.getByRole('checkbox', { name: '🏢 Buildings' }).check();
  await expect(page.getByText('Obstacle Detection🏢Buildings')).toBeVisible();
  await page.getByRole('button', { name: 'Detect Obstacles' }).click();
  await expect(page.getByText('📍hangar • 5 points')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Generate Optimal Route' })).toBeVisible();
  await page.getByRole('button', { name: 'Generate Optimal Route' }).click();
  await expect(page.getByText('Route Statistics:Distance:')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('New MissionQuitStep 7 of 8:')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: 'Reviewing weather conditions' }).nth(4)).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('div').filter({ hasText: 'Mission OverviewOperation' }).nth(3)).toBeVisible();
  await page.getByRole('button', { name: 'Create Mission' }).click();
  await expect(page.getByText('Operation Convoy WatchThursday, February 12, 2026UpcomingReal-time surveillance')).toBeVisible();
  await page.getByText('Operation Convoy WatchThursday, February 12, 2026UpcomingReal-time surveillance').click();
  await page.getByText('Back to MissionsOperation Convoy WatchMission DetailsMission OverviewOperation').click();
  await expect(page.getByText('Back to MissionsOperation Convoy WatchMission DetailsMission OverviewOperation')).toBeVisible();
  await page.getByRole('button', { name: 'Back to Missions' }).click();
  await page.getByRole('img', { name: 'User Avatar' }).click();
  await page.getByText('Logout').click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('litreluka');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('4%YeiyXziH');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Operation SkywatchSunday, February 8, 2026UpcomingA comprehensive aerial')).toBeVisible();
  await expect(page.getByRole('button', { name: '+ New Mission' })).toBeVisible();
  await page.getByRole('button', { name: '+ New Mission' }).click();
  await page.getByRole('textbox', { name: 'Enter mission name' }).click();
  await page.getByRole('textbox', { name: 'Enter mission name' }).fill('Eagle Eye Patrol');
  await page.locator('input[type="date"]').fill('2026-02-08');
  await page.getByRole('textbox', { name: 'Describe the mission' }).click();
  await page.getByRole('textbox', { name: 'Describe the mission' }).click();
  await page.getByRole('textbox', { name: 'Describe the mission' }).fill('\nRoutine surveillance operation monitoring critical supply routes and border checkpoints. Mission focuses on real-time threat detection and maintaining continuous visual coverage of designated high-priority zones.');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Add UAVs' }).click();
  await page.locator('div').filter({ hasText: /^UAVSome UavMax Speed: 21 km\/h$/ }).first().click();
  await page.locator('div').filter({ hasText: /^DJI Mavic 3QuadcopterMax Speed: 45 km\/h$/ }).first().click();
  await page.getByRole('button', { name: 'Confirm Selection' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Auto-Arrange Line Formation' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Add Responsible Persons' }).click();
  await page.locator('div').filter({ hasText: /^ilitre100ilitre100@gmail\.comRole: Admin$/ }).first().click();
  await page.locator('div').filter({ hasText: /^litrelukalitreluka@gmail\.comRole: User$/ }).first().click();
  await page.getByRole('button', { name: 'Confirm Selection' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('div').filter({ hasText: /^\+− Leaflet \| © OpenStreetMap contributors$/ }).nth(1).click();
  await page.locator('div').filter({ hasText: /^\+− Leaflet \| © OpenStreetMap contributors$/ }).nth(1).click();
  await page.locator('div').filter({ hasText: /^\+− Leaflet \| © OpenStreetMap contributors$/ }).nth(1).click();
  await page.locator('.sc-jCfmij').click();
  await page.locator('.sc-jCfmij').click();
  await page.locator('.sc-jCfmij').click();
  await page.locator('.sc-jCfmij').click();
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByText('1 +− Leaflet | ©').click();
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByRole('button', { name: '+ Add Custom Task' }).first().click();
  await page.getByRole('button', { name: '⚡ Execute Command Send' }).click();
  await page.locator('div').filter({ hasText: /^DJI Mavic 3Quadcopter$/ }).first().click();
  await page.getByRole('button', { name: 'Back' }).first().click();
  await page.locator('div').filter({ hasText: /^UAVSome Uav$/ }).first().click();
  await page.locator('div').filter({ hasText: /^DJI Zenmuse X7Camera$/ }).first().click();
  await page.getByRole('textbox', { name: 'e.g., START_RECORDING,' }).click();
  await page.getByRole('textbox', { name: 'e.g., START_RECORDING,' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'e.g., START_RECORDING,' }).fill('C');
  await page.getByRole('textbox', { name: 'e.g., START_RECORDING,' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'e.g., START_RECORDING,' }).fill('Camera start');
  await page.getByRole('button', { name: 'Save Task' }).click();
  await page.getByRole('button', { name: '+ Add Custom Task' }).nth(1).click();
  await page.getByRole('button', { name: '⚡ Execute Command Send' }).click();
  await page.locator('div').filter({ hasText: /^UAVSome Uav$/ }).first().click();
  await page.locator('div').filter({ hasText: /^DJI Zenmuse X7Camera$/ }).first().click();
  await page.getByRole('textbox', { name: 'e.g., START_RECORDING,' }).click();
  await page.getByRole('textbox', { name: 'e.g., START_RECORDING,' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'e.g., START_RECORDING,' }).fill('C');
  await page.getByRole('textbox', { name: 'e.g., START_RECORDING,' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'e.g., START_RECORDING,' }).fill('Camera stop');
  await page.getByRole('button', { name: 'Save Task' }).click();
  await expect(page.getByText('Waypoint #143.701342, 16.')).toBeVisible();
  await expect(page.getByText('TakeOffAUTO')).toBeVisible();
  await expect(page.getByText('MoveToPositionAUTO')).toBeVisible();
  await expect(page.getByText('LandAUTO')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^ExecuteCommand$/ }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('div').filter({ hasText: /^🏢Buildings$/ }).click();
  await page.getByRole('checkbox', { name: '🏢 Buildings' }).check();
  await page.getByRole('button', { name: 'Detect Obstacles' }).click();
  await page.getByRole('button', { name: 'Generate Optimal Route' }).click();
  await expect(page.getByText('Route Statistics:Distance:')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('New MissionQuitStep 7 of 8:')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^STATUSPermission Required$/ }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('UAVDJI Mavic')).toBeVisible();
  await page.getByRole('button', { name: 'Create Mission' }).click();
  await expect(page.getByText('Eagle Eye PatrolSunday, February 8, 2026Upcoming Routine surveillance operation')).toBeVisible();
  await page.getByRole('img', { name: 'User Avatar' }).click();
  await page.getByText('Logout').click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('ilitre100');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('oao2t y@aM');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Operation Convoy WatchThursday, February 12, 2026UpcomingReal-time surveillance')).toBeVisible();
  await page.getByRole('button', { name: '+ New Mission' }).click();
  await page.getByRole('textbox', { name: 'Enter mission name' }).click();
  await page.getByRole('textbox', { name: 'Enter mission name' }).fill('Phantom Recon Alpha');
  await page.locator('input[type="date"]').fill('2026-02-08');
  await page.getByRole('textbox', { name: 'Describe the mission' }).click();
  await page.getByRole('textbox', { name: 'Describe the mission' }).click();
  await page.getByRole('textbox', { name: 'Describe the mission' }).fill('Covert nighttime intelligence gathering mission over industrial zones. Utilizes thermal imaging and low-altitude flight patterns to document facility layouts and movement patterns while maintaining operational stealth.');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Add UAVs' }).click();
  await page.locator('div').filter({ hasText: /^UAVSome UavMax Speed: 21 km\/h$/ }).first().click();
  await page.getByText('UAVSome UavMax Speed: 21 km/hUAV 2Some Uav 2Max Speed: 22 km/hUAV 2Some Uav').click();
  await page.locator('div').filter({ hasText: /^DJI Mavic 3QuadcopterMax Speed: 45 km\/h$/ }).first().click();
  await page.locator('div').filter({ hasText: /^UAV 2Some Uav 2Max Speed: 22 km\/h$/ }).nth(2).click();
  await page.getByRole('button', { name: 'Confirm Selection' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Auto-Arrange Line Formation' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Add Responsible Persons' }).click();
  await page.locator('div').filter({ hasText: /^dleko20dleko20@student\.foi\.hrRole: User$/ }).first().click();
  await page.locator('div').filter({ hasText: /^litrelukalitreluka@gmail\.comRole: User$/ }).first().click();
  await page.locator('div').filter({ hasText: /^litrelukalitreluka@gmail\.comRole: User$/ }).first().click();
  await page.getByRole('button', { name: 'Confirm Selection' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Change Person Selection' }).click();
  await page.locator('div').filter({ hasText: /^ilitre100ilitre100@gmail\.comRole: Admin$/ }).first().click();
  await page.locator('div').filter({ hasText: /^litrelukalitreluka@gmail\.comRole: User$/ }).first().click();
  await page.getByRole('button', { name: 'Confirm Selection' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('div').filter({ hasText: /^\+− Leaflet \| © OpenStreetMap contributors$/ }).nth(1).click();
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByRole('button', { name: 'Delete waypoint' }).click();
  await page.locator('div').filter({ hasText: /^\+− Leaflet \| © OpenStreetMap contributors$/ }).nth(1).click();
  await page.locator('.sc-jCfmij').click();
  await page.locator('.sc-jCfmij').click();
  await page.locator('.sc-jCfmij').click();
  await page.locator('.sc-jCfmij').click();
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByText('1 +− Leaflet | ©').click();
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByRole('button', { name: '3' }).click();
  await page.getByRole('button', { name: '3' }).click();
  await page.getByRole('button', { name: 'Delete waypoint' }).nth(2).click();
  await page.getByText('1 2 +− Leaflet | ©').click();
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByText('1 2 3 +− Leaflet | ©').click();
  await page.getByText('1 2 3 +− Leaflet | ©').click();
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('checkbox', { name: '✈️ Aerodromes & Airports' }).check();
  await page.getByRole('button', { name: 'Detect Obstacles' }).click();
  await page.getByRole('button', { name: 'Generate Optimal Route' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('div').filter({ hasText: /^STATUSClear Airspace$/ }).first()).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^STATUSNo Permission Needed$/ }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Create Mission' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button').filter({ hasText: /^$/ }).first().click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(1).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(1).click();
  await page.getByRole('button', { name: '+ New Mission' }).click();
  await page.locator('div').filter({ hasText: /^\+− Leaflet \| © OpenStreetMap contributors$/ }).nth(1).click();
  await page.locator('div').filter({ hasText: /^\+− Leaflet \| © OpenStreetMap contributors$/ }).nth(1).click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').dblclick();
  await page.getByPlaceholder('Enter latitude...').dblclick();
  await page.getByPlaceholder('Enter latitude...').dblclick();
  await page.getByPlaceholder('Enter latitude...').dblclick();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('45.703486');
  await page.locator('div').filter({ hasText: 'New MissionQuitStep 5 of 8:' }).nth(1).click();
  await page.locator('.sc-jCfmij').click();
  await page.locator('.sc-jCfmij').click();
  await page.locator('.sc-jCfmij').click();
  await page.getByPlaceholder('Enter latitude...').dblclick();
  await page.getByPlaceholder('Enter latitude...').dblclick();
  await page.getByPlaceholder('Enter latitude...').dblclick();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('43.703369');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('43.703968');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.620448');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('checkbox', { name: '🏢 Buildings' }).check();
  await page.getByRole('button', { name: 'Detect Obstacles' }).click();
  await expect(page.getByText('📍yes • 5 points')).toBeVisible();
  await page.getByRole('button', { name: 'Generate Optimal Route' }).click();
  await expect(page.getByText('Route Statistics:Distance: 89')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('main')).toContainText('STATUSClear Airspace');
  await expect(page.locator('div').filter({ hasText: /^STATUSNo Permission Needed$/ }).first()).toBeVisible();
  await expect(page.getByText('Battery UsagePROJECTED FLIGHT')).toBeVisible();
  await expect(page.getByText('Operation CategoryCATEGORYAHEAVIEST UAVUAV (23 kg)UAV CLASSClass5ZONE')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Weather Conditions' })).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('Waypoint #143.703369, 16.')).toBeVisible();
  await expect(page.getByText('Waypoint #243.703968, 16.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
  await page.getByRole('button', { name: 'All Missions' }).first().click();
  await page.getByRole('heading', { name: 'Operation Skywatch' }).click();
  await page.getByRole('button', { name: 'All Missions' }).first().click();
  await page.getByRole('textbox', { name: 'Search missions by name,' }).click();
  await page.getByRole('textbox', { name: 'Search missions by name,' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Search missions by name,' }).fill('O');
  await page.getByRole('textbox', { name: 'Search missions by name,' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Search missions by name,' }).fill('Operation');
  await page.getByRole('textbox', { name: 'Search missions by name,' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Search missions by name,' }).fill('OperationS');
  await page.getByRole('textbox', { name: 'Search missions by name,' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Search missions by name,' }).fill('Operation ');
  await page.getByRole('textbox', { name: 'Search missions by name,' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Search missions by name,' }).fill('Operation S');
  await page.getByRole('textbox', { name: 'Search missions by name,' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Search missions by name,' }).fill('Operation Skywatch');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
});
});
*/