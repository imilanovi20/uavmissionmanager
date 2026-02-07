import { expect, Page } from "@playwright/test";
import { getFutureDate } from "./date";

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