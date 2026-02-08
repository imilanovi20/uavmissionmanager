import { expect, Page } from "@playwright/test";
import { getFutureDate } from "./date";
import { loginAsAdmin } from "./auth";

export async function addGeneralInfo(page: Page) {
    await expect(page).toHaveURL("/missions/new");
    await expect(page.getByText('New MissionQuitStep 1 of 8:')).toBeVisible();
    await page.getByRole('textbox', { name: 'Enter mission name' }).click();
    await page.getByRole('textbox', { name: 'Enter mission name' }).fill('Operation Skywatch');
    await page.locator('input[type="date"]').fill(getFutureDate(2));
    await page.getByRole('textbox', { name: 'Describe the mission' }).click();
    await page.getByRole('textbox', { name: 'Describe the mission' }).fill('A comprehensive aerial reconnaissance mission covering the northern sector perimeter. Primary objectives include terrain mapping, infrastructure assessment, and identifying potential security vulnerabilities across a 15km radius.');
}

export async function addUAVs(page: Page) {
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
}

export async function addInitialFormation(page: Page) {
    await expect(page.getByText('New MissionQuitStep 3 of 8:')).toBeVisible();
    await page.getByRole('button', { name: 'Line', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Auto-Arrange Line Formation' })).toBeVisible();
    await page.getByRole('button', { name: 'Auto-Arrange Line Formation' }).click();

    await page.getByRole('button', { name: 'Grid' }).click();
    await expect(page.getByRole('button', { name: 'Auto-Arrange Grid Formation' })).toBeVisible();
    await page.getByRole('button', { name: 'Auto-Arrange Grid Formation' }).click();

    await page.getByRole('button', { name: 'Circle' }).click();
    await expect(page.getByRole('button', { name: 'Auto-Arrange Circle Formation' })).toBeVisible();
    await page.getByRole('button', { name: 'Auto-Arrange Circle Formation' }).click();
}

export async function addResponsiblePersons(page: Page) {
    await expect(page.getByText('New MissionQuitStep 4 of 8:')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Add Responsible Persons' })).toBeVisible();
      await page.getByRole('button', { name: 'Add Responsible Persons' }).click();
      await page.locator('div').filter({ hasText: /^ilitre100ilitre100@gmail\.comRole: Admin$/ }).first().click();
      await page.locator('div').filter({ hasText: /^litrelukalitreluka@gmail\.comRole: User$/ }).first().click();
      await page.getByRole('button', { name: 'Confirm Selection' }).click();
      await expect(page.getByRole('main')).toContainText('ilitre100ilitre100@gmail.com');
      await expect(page.getByRole('main')).toContainText('litrelukalitreluka@gmail.com');
} 

export async function addWayointsForWaypoint_TaskConfiguration(page: Page) {
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

          //Waypoint 3
          await page.getByPlaceholder('Enter latitude...').click();
          await page.getByPlaceholder('Enter latitude...').fill('43.706373');
          await page.getByPlaceholder('Enter longitude...').click();
          await page.getByPlaceholder('Enter longitude...').fill('16.629951');
          await page.getByRole('button', { name: 'Add Waypoint' }).click();

          await expect(page.getByRole('main')).toContainText('Waypoint #143.706270, 16.630313TakeOffAUTOMoveToPositionAUTO+ Add Custom Task');
          await expect(page.getByRole('main')).toContainText('Waypoint #343.706373, 16.629951LandAUTO+ Add Custom Task');
}

export async function deleteMission(page: Page) {
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
}

export async function addAirportWaypoint(page: Page) {
    await page.getByPlaceholder('Enter latitude...').click();
    await page.getByPlaceholder('Enter latitude...').fill('45.755618');
    await page.getByPlaceholder('Enter longitude...').click();
    await page.getByPlaceholder('Enter longitude...').fill('16.089140');
    await page.getByRole('button', { name: 'Add Waypoint' }).click();
    await page.getByPlaceholder('Enter latitude...').click();
    await page.getByPlaceholder('Enter latitude...').fill('45.755913');
    await page.getByPlaceholder('Enter longitude...').click();
    await page.getByPlaceholder('Enter longitude...').fill('16.087085');
    await page.getByRole('button', { name: 'Add Waypoint' }).click();
}

export async function addDefaultWaypoints(page:Page){
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
}