import test, { expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";
import { addGeneralInfo, addUAVs, addInitialFormation, addWayointsForWaypoint_TaskConfiguration, addResponsiblePersons, deleteMission, addAirportWaypoint, addDefaultWaypoints } from "../helpers/wizard_data";

test.describe.serial('TS 04 Mission Management 03 Mission Route Planning', () => {
  const screenshotsPath = 'tests/screenshots/TS_04_mission_management/';

  test.beforeEach(async ({ page }) => {
      await test.step('Login as admin and navigate to missions page', async () => {
        await loginAsAdmin(page);
        await expect(page).toHaveURL("/missions");
        await expect(page.getByRole('button', { name: '+ New Mission' })).toBeVisible();
        await page.getByRole('button', { name: '+ New Mission' }).click();
    });

    await test.step('Fill in mission details', async () => {
      await addGeneralInfo(page);
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Select UAVs', async () => {
      await addUAVs(page);
      await page.getByRole('button', { name: 'Next' }).click();
    });

    await test.step('Set formation type', async () => {
      await addInitialFormation(page);
      await page.getByRole('button', { name: 'Next' }).click();
    });
    
    await test.step('Add responsible persons', async () => {
      await addResponsiblePersons(page);
      await page.getByRole('button', { name: 'Next' }).click();
    });
  });


  test.afterEach(async ({ page }) => {
    await test.step('Delete mission', async () => {
      await deleteMission(page);
    });
  });


    test('TC 10 Create mission in rural area - few buildings', async ({ page }) => {
        test.setTimeout(60000);
        await test.step('Add waypoints', async () => {
            await expect(page.getByText('New MissionQuitStep 5 of 8:')).toBeVisible();

            await page.getByPlaceholder('Enter latitude...').click();
            await page.getByPlaceholder('Enter latitude...').fill('43.680336');
            await page.getByPlaceholder('Enter longitude...').click();
            await page.getByPlaceholder('Enter longitude...').fill('16.756473');
            await page.getByRole('button', { name: 'Add Waypoint' }).click();
            await page.getByPlaceholder('Enter latitude...').click();
            await page.getByPlaceholder('Enter latitude...').fill('43.679926');
            await page.getByPlaceholder('Enter longitude...').click();
            await page.getByPlaceholder('Enter longitude...').fill('16.754606');
            await page.getByRole('button', { name: 'Add Waypoint' }).click();
            await page.getByPlaceholder('Enter latitude...').click();
            await page.getByPlaceholder('Enter latitude...').fill('43.680991');
            await page.getByPlaceholder('Enter longitude...').click();
            await page.getByPlaceholder('Enter longitude...').fill('16.755314');
            await page.getByRole('button', { name: 'Add Waypoint' }).click();

            await page.screenshot({ path: screenshotsPath + 'TC_10/wizard_waypoints.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Detect obstacles and generate optimal route', async () => {
          await expect(page.getByText('New MissionQuitStep 6 of 8:')).toBeVisible();

          await page.getByRole('checkbox', { name: '🏢 Buildings' }).check();
          await page.getByRole('button', { name: 'Detect Obstacles' }).click();
          await expect(page.getByRole('heading', { name: /Detected Obstacles \(\d+\)/ })).toBeVisible({ timeout: 30000 })
          await page.getByRole('button', { name: 'Generate Optimal Route' }).click();

          await page.waitForLoadState('networkidle', { timeout: 30000 });

            await expect(page.getByText('Generating...')).not.toBeVisible({ timeout: 30000 });
            await expect(page.getByRole('main')).toContainText('Detected Obstacles');
            await expect(page.getByRole('main')).toContainText('Route Statistics:');
          
          await page.screenshot({ path: screenshotsPath + 'TC_10/wizard_obstacles.png' });
          await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Verify mission details and status', async () => {
            await expect(page.getByText('New MissionQuitStep 7 of 8:')).toBeVisible();
            await expect(page.getByText('Loading weather and permits data...')).not.toBeVisible({ timeout: 30000 });
            await expect(page.getByRole('main')).toContainText('STATUSClear Airspace');

            await expect(page.locator('div').filter({ hasText: /^STATUSNo Permission Needed$/ }).first()).toBeVisible();

            await expect(page.getByText('Battery UsagePROJECTED FLIGHT')).toBeVisible();

            await expect(page.getByRole('heading', { name: 'Operation Category' })).toBeVisible();
            await expect(page.getByRole('main')).toContainText('B');
            await expect(page.getByRole('main')).toContainText('UAV (23 kg)');
            await expect(page.getByRole('main')).toContainText('Class5');
            await expect(page.getByRole('main')).toContainText('ClassIII');

            await expect(page.getByRole('heading', { name: 'Weather Conditions' })).toBeVisible();
            await page.screenshot({ path: screenshotsPath + 'TC_10/wizard_permits.png' });

          await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Create mission', async () => {
            await expect(page.getByText('New MissionQuitStep 8 of 8:')).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Operation Category' })).toBeVisible();
            await expect(page.getByRole('main')).toContainText('B');
            await expect(page.getByRole('main')).toContainText('Class5');
            await expect(page.getByRole('main')).toContainText('ClassIII');

            await page.screenshot({ path: screenshotsPath + 'TC_10/wizard_final.png' });
            await page.getByRole('button', { name: 'Create Mission' }).click();
        });

        await test.step('Access mission overview ', async () => {
            await expect(page).toHaveURL("/missions", { timeout: 30000 });
            await page.getByRole('button', { name: 'All Missions' }).first().click();
            await page.getByRole('textbox', { name: 'Search missions by name,' }).fill('Operation Skywatch');
            await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
            await page.getByText('Operation Skywatch').first().click();
        });

        await test.step('Verify mission waypoints and tasks in overview', async () => {
            await expect(page.getByRole('main')).toContainText('B');
            await expect(page.getByRole('main')).toContainText('Class5');
            await expect(page.getByRole('main')).toContainText('ClassIII');
            await page.screenshot({ path: screenshotsPath + 'TC_10/mission_overview.png' });
      });
    });

    test('TC 11 Create mission in city center - with buildings', async ({ page }) => {
        test.setTimeout(60000);
        await test.step('Add waypoints', async () => {
            await expect(page.getByText('New MissionQuitStep 5 of 8:')).toBeVisible();

            await page.getByPlaceholder('Enter latitude...').click();
            await page.getByPlaceholder('Enter latitude...').fill('43.704593');
            await page.getByPlaceholder('Enter longitude...').click();
            await page.getByPlaceholder('Enter longitude...').fill('16.637748');
            await page.getByRole('button', { name: 'Add Waypoint' }).click();
            await page.getByPlaceholder('Enter latitude...').click();
            await page.getByPlaceholder('Enter latitude...').fill('43.705111');
            await page.getByPlaceholder('Enter longitude...').click();
            await page.getByPlaceholder('Enter longitude...').fill('16.635822');
            await page.getByRole('button', { name: 'Add Waypoint' }).click();
            await page.getByPlaceholder('Enter latitude...').click();
            await page.getByPlaceholder('Enter latitude...').fill('43.703701');
            await page.getByPlaceholder('Enter longitude...').click();
            await page.getByPlaceholder('Enter longitude...').fill('16.638236');
            await page.getByRole('button', { name: 'Add Waypoint' }).click();
            await page.getByPlaceholder('Enter latitude...').click();
            await page.getByPlaceholder('Enter latitude...').fill('43.704406');
            await page.getByPlaceholder('Enter longitude...').click();
            await page.getByPlaceholder('Enter longitude...').fill('16.635404');
            await page.getByRole('button', { name: 'Add Waypoint' }).click();
            await page.getByPlaceholder('Enter latitude...').click();
            await page.getByPlaceholder('Enter latitude...').fill('43.705599');
            await page.getByPlaceholder('Enter longitude...').click();
            await page.getByPlaceholder('Enter longitude...').fill('16.634738');
            await page.getByRole('button', { name: 'Add Waypoint' }).click();

            await page.screenshot({ path: screenshotsPath + 'TC_11/wizard_waypoints.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Detect obstacles and generate optimal route', async () => {
          await expect(page.getByText('New MissionQuitStep 6 of 8:')).toBeVisible();

          await page.getByRole('checkbox', { name: '🏢 Buildings' }).check();
          await page.getByRole('button', { name: 'Detect Obstacles' }).click();

          await expect(page.getByRole('heading', { name: /Detected Obstacles \(\d+\)/ })).toBeVisible({ timeout: 30000 })
          await page.getByRole('button', { name: 'Generate Optimal Route' }).click();

          await page.waitForLoadState('networkidle', { timeout: 30000 });

            await expect(page.getByText('Generating...')).not.toBeVisible({ timeout: 30000 });
            await expect(page.getByRole('main')).toContainText('Detected Obstacles');
            await expect(page.getByRole('main')).toContainText('Route Statistics:');
        
          await page.screenshot({ path: screenshotsPath + 'TC_11/wizard_obstacles.png' });
          await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Verify mission details and status', async () => {
            await expect(page.getByText('New MissionQuitStep 7 of 8:')).toBeVisible();
            await expect(page.getByText('Loading weather and permits data...')).not.toBeVisible({ timeout: 30000 });
            await expect(page.getByRole('main')).toContainText('STATUSClear Airspace');

            await expect(page.locator('div').filter({ hasText: /^STATUSNo Permission Needed$/ }).first()).toBeVisible();

            await expect(page.getByText('Battery UsagePROJECTED FLIGHT')).toBeVisible();

            await expect(page.getByRole('heading', { name: 'Operation Category' })).toBeVisible();
            await expect(page.getByRole('main')).toContainText('C');
            await expect(page.getByRole('main')).toContainText('UAV (23 kg)');
            await expect(page.getByRole('main')).toContainText('Class5');
            await expect(page.getByRole('main')).toContainText('ClassIV');

            await expect(page.getByRole('heading', { name: 'Weather Conditions' })).toBeVisible();
            await page.screenshot({ path: screenshotsPath + 'TC_11/wizard_permits.png' });

          await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Create mission', async () => {
            await expect(page.getByText('New MissionQuitStep 8 of 8:')).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Operation Category' })).toBeVisible();
            await expect(page.getByRole('main')).toContainText('C');
            await expect(page.getByRole('main')).toContainText('Class5');
            await expect(page.getByRole('main')).toContainText('ClassIV');

            await page.screenshot({ path: screenshotsPath + 'TC_11/wizard_final.png' });
            await page.getByRole('button', { name: 'Create Mission' }).click();
        });

        await test.step('Access mission overview ', async () => {
            await expect(page).toHaveURL("/missions", { timeout: 30000 });
            await page.getByRole('button', { name: 'All Missions' }).first().click();
            await page.getByRole('textbox', { name: 'Search missions by name,' }).fill('Operation Skywatch');
            await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
            await page.getByText('Operation Skywatch').first().click();
        });

        await test.step('Verify mission waypoints and tasks in overview', async () => {
            await expect(page.getByRole('main')).toContainText('C');
            await expect(page.getByRole('main')).toContainText('Class5');
            await expect(page.getByRole('main')).toContainText('ClassIV');
            await page.screenshot({ path: screenshotsPath + 'TC_11/mission_overview.png' });
      });
    });

    test('TC 12 Create mission near airport - without avoidance', async ({ page }) => {
        test.setTimeout(60000);
        await test.step('Add waypoints', async () => {
            await expect(page.getByText('New MissionQuitStep 5 of 8:')).toBeVisible();
            await addAirportWaypoint(page);

            await page.screenshot({ path: screenshotsPath + 'TC_12/wizard_waypoints.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Detect obstacles and generate optimal route', async () => {
            await expect(page.getByText('New MissionQuitStep 6 of 8:')).toBeVisible();
            await page.getByRole('checkbox', { name: '🏢 Buildings' }).check();
            await page.getByRole('button', { name: 'Detect Obstacles' }).click();
            await expect(page.getByRole('heading', { name: /Detected Obstacles \(\d+\)/ })).toBeVisible({ timeout: 30000 })
            await page.getByRole('button', { name: 'Generate Optimal Route' }).click();
            await page.waitForLoadState('networkidle', { timeout: 30000 });

            await expect(page.getByText('Generating...')).not.toBeVisible({ timeout: 30000 });
            await expect(page.getByRole('main')).toContainText('Detected Obstacles');
            await expect(page.getByRole('main')).toContainText('Route Statistics:');
            await page.screenshot({ path: screenshotsPath + 'TC_12/wizard_obstacles.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Verify mission details and status', async () => {
            await expect(page.getByText('New MissionQuitStep 7 of 8:')).toBeVisible();
            await expect(page.getByText('Loading weather and permits data...')).not.toBeVisible({ timeout: 30000 });
            await expect(page.getByRole('main')).toContainText('Airspace Violation');
            await expect(page.getByText('Battery UsagePROJECTED FLIGHT')).toBeVisible();

            await expect(page.getByRole('heading', { name: 'Operation Category' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Weather Conditions' })).toBeVisible();
            await page.screenshot({ path: screenshotsPath + 'TC_12/wizard_permits.png' });

          await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Create mission', async () => {
            await expect(page.getByText('New MissionQuitStep 8 of 8:')).toBeVisible();
            await expect(page.getByRole('main')).toContainText('Airspace Violation');
            await page.screenshot({ path: screenshotsPath + 'TC_12/wizard_final.png' });

            await page.getByRole('button', { name: 'Create Mission' }).click();
        });

        await test.step('Access mission overview ', async () => {
            await expect(page).toHaveURL("/missions", { timeout: 30000 });
            await page.getByRole('button', { name: 'All Missions' }).first().click();
            await page.getByRole('textbox', { name: 'Search missions by name,' }).fill('Operation Skywatch');
            await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
            await page.getByText('Operation Skywatch').first().click();
        });

        await test.step('Verify mission waypoints and tasks in overview', async () => {
            await expect(page.getByRole('main')).toContainText('Airspace Violation');
            await page.screenshot({ path: screenshotsPath + 'TC_12/mission_overview.png' });
      });
    });

    test('TC 13 Create mission near airport - with avoidance', async ({ page }) => {
        test.setTimeout(60000);
        await test.step('Add waypoints', async () => {
            await expect(page.getByText('New MissionQuitStep 5 of 8:')).toBeVisible();
            await addAirportWaypoint(page);

            await page.screenshot({ path: screenshotsPath + 'TC_13/wizard_waypoints.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Detect obstacles and generate optimal route', async () => {
            await expect(page.getByText('New MissionQuitStep 6 of 8:')).toBeVisible();
            await page.getByRole('checkbox', { name: '🏢 Buildings' }).check();
            await page.getByRole('checkbox', { name: '✈️ Aerodromes & Airports' }).check();
            await page.getByRole('button', { name: 'Detect Obstacles' }).click();
            await expect(page.getByRole('heading', { name: /Detected Obstacles \(\d+\)/ })).toBeVisible({ timeout: 30000 })
            await page.getByRole('button', { name: 'Generate Optimal Route' }).click();
            await page.waitForLoadState('networkidle', { timeout: 30000 });

            await expect(page.getByText('Generating...')).not.toBeVisible({ timeout: 30000 });
            await expect(page.getByRole('main')).toContainText('Detected Obstacles');
            await expect(page.getByRole('main')).toContainText('Route Statistics:');
            await page.screenshot({ path: screenshotsPath + 'TC_13/wizard_obstacles.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Verify mission details and status', async () => {
            await expect(page.getByText('New MissionQuitStep 7 of 8:')).toBeVisible();
            await expect(page.getByText('Loading weather and permits data...')).not.toBeVisible({ timeout: 30000 });
            await expect(page.getByRole('main')).toContainText('Clear Airspace');
            await expect(page.getByText('Battery UsagePROJECTED FLIGHT')).toBeVisible();

            await expect(page.getByRole('heading', { name: 'Operation Category' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Weather Conditions' })).toBeVisible();
            await page.screenshot({ path: screenshotsPath + 'TC_13/wizard_permits.png' });

          await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Create mission', async () => {
            await expect(page.getByText('New MissionQuitStep 8 of 8:')).toBeVisible();
            await expect(page.getByRole('main')).toContainText('Airspace CheckClear');
            await page.screenshot({ path: screenshotsPath + 'TC_13/wizard_final.png' });

            await page.getByRole('button', { name: 'Create Mission' }).click();
        });

        await test.step('Access mission overview ', async () => {
            await expect(page).toHaveURL("/missions", { timeout: 30000 });
            await page.getByRole('button', { name: 'All Missions' }).first().click();
            await page.getByRole('textbox', { name: 'Search missions by name,' }).fill('Operation Skywatch');
            await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
            await page.getByText('Operation Skywatch').first().click();
        });

        await test.step('Verify mission waypoints and tasks in overview', async () => {
            await expect(page.getByRole('main')).toContainText('Airspace CheckClear');
            await page.screenshot({ path: screenshotsPath + 'TC_13/mission_overview.png' });
      });
    });

    test('TC 14 Create mission with short distance route', async ({ page }) => {
        test.setTimeout(60000);
        await test.step('Add waypoints', async () => {
            await expect(page.getByText('New MissionQuitStep 5 of 8:')).toBeVisible();
            await addDefaultWaypoints(page);

            await page.screenshot({ path: screenshotsPath + 'TC_14/wizard_waypoints.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Detect obstacles and generate optimal route', async () => {
            await expect(page.getByText('New MissionQuitStep 6 of 8:')).toBeVisible();
            await page.getByRole('checkbox', { name: '🏢 Buildings' }).check();
            await page.getByRole('button', { name: 'Detect Obstacles' }).click();
            await expect(page.getByRole('heading', { name: /Detected Obstacles \(\d+\)/ })).toBeVisible({ timeout: 30000 })
            await page.getByRole('button', { name: 'Generate Optimal Route' }).click();
            await page.waitForLoadState('networkidle', { timeout: 30000 });

            await expect(page.getByText('Generating...')).not.toBeVisible({ timeout: 30000 });
            await expect(page.getByRole('main')).toContainText('Detected Obstacles');
            await expect(page.getByRole('main')).toContainText('Route Statistics:');
            await page.screenshot({ path: screenshotsPath + 'TC_14/wizard_obstacles.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Verify mission details and status', async () => {
            await expect(page.getByText('New MissionQuitStep 7 of 8:')).toBeVisible();
            await expect(page.getByText('Loading weather and permits data...')).not.toBeVisible({ timeout: 30000 });
            await expect(page.getByText('Battery UsagePROJECTED FLIGHT')).toBeVisible();

            await expect(page.getByRole('heading', { name: 'Operation Category' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Weather Conditions' })).toBeVisible();
            await page.screenshot({ path: screenshotsPath + 'TC_14/wizard_permits.png' });

          await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Create mission', async () => {
            await expect(page.getByText('New MissionQuitStep 8 of 8:')).toBeVisible();
            await expect(page.getByRole('main')).toContainText('Projected Flight Time');
            await page.screenshot({ path: screenshotsPath + 'TC_14/wizard_final.png' });

            await page.getByRole('button', { name: 'Create Mission' }).click();
        });

        await test.step('Access mission overview ', async () => {
            await expect(page).toHaveURL("/missions", { timeout: 30000 });
            await page.getByRole('button', { name: 'All Missions' }).first().click();
            await page.getByRole('textbox', { name: 'Search missions by name,' }).fill('Operation Skywatch');
            await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
            await page.getByText('Operation Skywatch').first().click();
        });

        await test.step('Verify mission waypoints and tasks in overview', async () => {
            await expect(page.getByRole('main')).toContainText('Projected Flight Time');
            await page.screenshot({ path: screenshotsPath + 'TC_14/mission_overview.png' });
      });
    });

    test('TC 15 Create mission with long distance route', async ({ page }) => {
        test.setTimeout(60000);
        await test.step('Add waypoints', async () => {
            await expect(page.getByText('New MissionQuitStep 5 of 8:')).toBeVisible();

            await page.getByPlaceholder('Enter latitude...').click();
            await page.getByPlaceholder('Enter latitude...').fill('45.798386');
            await page.getByPlaceholder('Enter longitude...').click();
            await page.getByPlaceholder('Enter longitude...').fill('16.036212');
            await page.getByRole('button', { name: 'Add Waypoint' }).click();
            await page.getByPlaceholder('Enter latitude...').click();
            await page.getByPlaceholder('Enter latitude...').fill('45.797305');
            await page.getByPlaceholder('Enter longitude...').click();
            await page.getByPlaceholder('Enter longitude...').fill('15.934427');
            await page.getByRole('button', { name: 'Add Waypoint' }).click();

            await page.screenshot({ path: screenshotsPath + 'TC_15/wizard_waypoints.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Detect obstacles and generate optimal route', async () => {
            await expect(page.getByText('New MissionQuitStep 6 of 8:')).toBeVisible();

            await page.screenshot({ path: screenshotsPath + 'TC_15/wizard_obstacles.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Verify mission details and status', async () => {
            await expect(page.getByText('New MissionQuitStep 7 of 8:')).toBeVisible();
            await expect(page.getByText('Loading weather and permits data...')).not.toBeVisible({ timeout: 30000 });
            await expect(page.getByText('Battery UsagePROJECTED FLIGHT')).toBeVisible();
            await expect(page.getByRole('main')).toContainText('100.0%');
            await expect(page.getByRole('main')).toContainText('⚠️ Insufficient');

            await expect(page.getByRole('heading', { name: 'Operation Category' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Weather Conditions' })).toBeVisible();
            await page.screenshot({ path: screenshotsPath + 'TC_15/wizard_permits.png' });

          await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Create mission', async () => {
            await expect(page.getByText('New MissionQuitStep 8 of 8:')).toBeVisible();
            await expect(page.getByRole('main')).toContainText('Projected Flight Time');
            await page.screenshot({ path: screenshotsPath + 'TC_15/wizard_final.png' });

            await page.getByRole('button', { name: 'Create Mission' }).click();
        });

        await test.step('Access mission overview ', async () => {
            await expect(page).toHaveURL("/missions", { timeout: 30000 });
            await page.getByRole('button', { name: 'All Missions' }).first().click();
            await page.getByRole('textbox', { name: 'Search missions by name,' }).fill('Operation Skywatch');
            await expect(page.getByRole('heading', { name: 'Operation Skywatch' })).toBeVisible();
            await page.getByText('Operation Skywatch').first().click();
        });

        await test.step('Verify mission waypoints and tasks in overview', async () => {
            await expect(page.getByRole('main')).toContainText('Projected Flight Time');
            await page.screenshot({ path: screenshotsPath + 'TC_15/mission_overview.png' });
      });
    });
    
});

/*
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:61117/login');
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('43.680336');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.756473');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('43.679926');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.754606');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('43.680991');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.755314');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('checkbox', { name: '🏢 Buildings' }).check();
  await page.getByRole('button', { name: 'Detect Obstacles' }).click();
  await expect(page.getByRole('main')).toContainText('Detected Obstacles');
  await page.getByRole('button', { name: 'Generate Optimal Route' }).click();
  await expect(page.getByRole('main')).toContainText('Route Statistics:');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('main')).toContainText('B');
  await expect(page.getByRole('main')).toContainText('UAV (23 kg)');
  await expect(page.getByRole('main')).toContainText('Class5');
  await expect(page.getByRole('main')).toContainText('ClassIII');
  await expect(page.locator('div').filter({ hasText: /^STATUSClear Airspace$/ }).first()).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Clear Airspace');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('main')).toContainText('Clear');
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('43.704593');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.637748');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('43.705111');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.635822');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByText('1 2 +− Leaflet | ©').click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('43.703701');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.638236');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('43.704406');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.635404');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Detect Obstacles' }).click();
  await page.getByRole('button', { name: 'Generate Optimal Route' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Back' }).click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('43.705599');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.634738');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Detect Obstacles' }).click();
  await page.getByRole('button', { name: 'Generate Optimal Route' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('main')).toContainText('C');
  await expect(page.getByRole('main')).toContainText('Class5');
  await expect(page.getByRole('main')).toContainText('ClassIV');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Back' }).click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('43.698931');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.672590');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('43.702671');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.674886');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Detect Obstacles' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('43.539753');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.303668');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('43.542238');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.302488');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Detect Obstacles' }).click();
  await page.getByRole('button', { name: 'Generate Optimal Route' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Detect Obstacles' }).click();
  await page.getByRole('button', { name: '2' }).click();
  await page.getByRole('button', { name: 'Back' }).click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('45.729497');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.060510');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByPlaceholder('Enter latitude...').click();
  await page.getByPlaceholder('Enter latitude...').fill('45.733651');
  await page.getByPlaceholder('Enter longitude...').click();
  await page.getByPlaceholder('Enter longitude...').fill('16.048107');
  await page.getByRole('button', { name: 'Add Waypoint' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Detect Obstacles' }).click();
  await page.getByRole('button', { name: 'Generate Optimal Route' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('main')).toContainText('Airspace Violation');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('html').click();
});
*/