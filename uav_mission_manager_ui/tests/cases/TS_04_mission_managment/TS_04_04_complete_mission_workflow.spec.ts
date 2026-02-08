import test, { expect } from "@playwright/test";
import { addAirportWaypoint, addGeneralInfo, addInitialFormation, addResponsiblePersons, addUAVs, deleteMission} from "../helpers/wizard_data";
import { loginAsAdmin } from "../helpers/auth";

test.describe.serial('TS 04 Mission Management 04 Complete workflow', () => {
  const screenshotsPath = 'tests/screenshots/TS_04_mission_management/';

    test('TC 16 Create complete mission workflow', async ({ page }) => {
        test.setTimeout(60000);

        await test.step('Login as admin and navigate to missions page', async () => {
            await loginAsAdmin(page);
            await expect(page).toHaveURL("/missions");
            await expect(page.getByRole('button', { name: '+ New Mission' })).toBeVisible();
            await page.getByRole('button', { name: '+ New Mission' }).click();
        });

        await test.step('Fill in mission details', async () => {
            await addGeneralInfo(page);
            await page.screenshot({ path: screenshotsPath + 'TC_16/wizard_general_info.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });
    
        await test.step('Select UAVs', async () => {
            await addUAVs(page);
            
            await page.screenshot({ path: screenshotsPath + 'TC_16/wizard_uavs.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });
    
        await test.step('Set formation type', async () => {
            await addInitialFormation(page);
            
            await page.screenshot({ path: screenshotsPath + 'TC_16/wizard_formation.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Add responsible persons', async () => {
            await addResponsiblePersons(page);
            await page.screenshot({ path: screenshotsPath + 'TC_16/wizard_responsible_persons.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Add waypoints', async () => {
            await expect(page.getByText('New MissionQuitStep 5 of 8:')).toBeVisible();
            await addAirportWaypoint(page);
            await expect(page.getByRole('main')).toContainText('Waypoint #145.755618, 16.089140TakeOffAUTOMoveToPositionAUTO+ Add Custom Task');
            await expect(page.getByRole('main')).toContainText('Waypoint #245.755913, 16.087085LandAUTO+ Add Custom Task');

            await page.getByRole('button', { name: '+ Add Custom Task' }).first().click();
            await page.getByRole('button', { name: '🔄 Change Formation Modify' }).click();
            await page.getByRole('button', { name: 'Grid' }).click();
            await page.getByRole('button', { name: 'Auto-Arrange Grid Formation' }).click();
            await page.getByRole('button', { name: 'Save Task' }).click();

            await expect(page.getByRole('main')).toContainText('ChangeFormation');

            await page.getByRole('button', { name: '+ Add Custom Task' }).first().click();
            await page.getByRole('button', { name: '⚡ Execute Command Send' }).click();
            await page.getByText('Some Uav', { exact: true }).click();
            await page.locator('div').filter({ hasText: /^stringstring$/ }).first().click();
            await page.getByRole('textbox', { name: 'e.g., START_RECORDING,' }).click();
            await page.getByRole('textbox', { name: 'e.g., START_RECORDING,' }).fill('CAMERA: Start Recording');
            await page.getByRole('button', { name: 'Save Task' }).click();

            await page.getByRole('button', { name: '+ Add Custom Task' }).nth(1).click();
            await page.getByRole('button', { name: '⚡ Execute Command Send' }).click();
            await page.getByText('Some Uav', { exact: true }).click();
            await page.locator('div').filter({ hasText: /^stringstring$/ }).first().click();
            await page.getByRole('textbox', { name: 'e.g., START_RECORDING,' }).click();
            await page.getByRole('textbox', { name: 'e.g., START_RECORDING,' }).fill('CAMERA: Stop Recording');
            await page.getByRole('button', { name: 'Save Task' }).click();

            await expect(page.getByRole('main')).toContainText('ExecuteCommand');

            await page.screenshot({ path: screenshotsPath + 'TC_16/wizard_waypoints.png' });
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
            await page.screenshot({ path: screenshotsPath + 'TC_16/wizard_obstacles.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Verify mission details and status', async () => {
            await expect(page.getByText('New MissionQuitStep 7 of 8:')).toBeVisible();
            await expect(page.getByText('Loading weather and permits data...')).not.toBeVisible({ timeout: 30000 });
            await expect(page.getByRole('main')).toContainText('Airspace Violation');
            await expect(page.getByText('Battery UsagePROJECTED FLIGHT')).toBeVisible();
            await expect(page.getByRole('main')).toContainText('STATUSPermission Required');


            await expect(page.getByRole('heading', { name: 'Operation Category' })).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Weather Conditions' })).toBeVisible();
            await page.screenshot({ path: screenshotsPath + 'TC_16/wizard_permits.png' });

            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Create mission', async () => {
            await expect(page.getByText('New MissionQuitStep 8 of 8:')).toBeVisible();
            await expect(page.getByRole('main')).toContainText('Airspace Violation');
            await expect(page.getByRole('main')).toContainText('ChangeFormation');
            await page.getByRole('button').nth(2).click();
            await expect(page.getByRole('main')).toContainText('Grid');

            await expect(page.getByRole('main')).toContainText('ExecuteCommand');
            await expect(page.getByRole('main')).toContainText('Permission Required');

            await page.screenshot({ path: screenshotsPath + 'TC_16/wizard_final.png' });
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
            await expect(page.getByRole('main')).toContainText(/#1.*45\.7556.*16\.0891.*🛫Takeoff/);
            await expect(page.getByRole('main')).toContainText(/MoveToPosition.*45\.7559.*16\.0870/);
            await expect(page.getByRole('main')).toContainText(/#2.*45\.7559.*16\.0870.*🛬Land/);
            await expect(page.getByRole('main')).toContainText('ChangeFormation');
            await expect(page.getByRole('main')).toContainText('ExecuteCommand');
            await expect(page.getByRole('main')).toContainText('Permission Required');

            await page.screenshot({ path: screenshotsPath + 'TC_16/mission_overview.png' });
        });

        await test.step('Delete mission', async () => {
            await deleteMission(page);
        });

    });
});