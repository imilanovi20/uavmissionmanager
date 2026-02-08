import test, { expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";
import { getFutureDate } from "../helpers/date";
import { addGeneralInfo, addInitialFormation, addResponsiblePersons, addUAVs } from "../helpers/wizard_data";

test.describe.serial('TS 04 Mission Management 05 Input Validation', () => {
  const screenshotsPath = 'tests/screenshots/TS_04_mission_management/';

    test.beforeEach(async ({ page }) => {
    await test.step('Login and navigate to new mission', async () => {
        await loginAsAdmin(page);
        await expect(page).toHaveURL("/missions");
        await page.getByRole('button', { name: '+ New Mission' }).click();
        await expect(page).toHaveURL("/missions/new");
    });
  });

    test('TC 17 Create mission without name (should be blocked)', async ({ page }) => {
        await expect(page.getByText('New MissionQuitStep 1 of 8:')).toBeVisible();
        
        await page.locator('input[type="date"]').fill(getFutureDate(2));
        await page.getByRole('textbox', { name: 'Describe the mission' }).click();
        await page.getByRole('textbox', { name: 'Describe the mission' }).fill('Test description');
        
        await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
        
        await page.screenshot({ path: screenshotsPath + 'TC_17/validation_name_required.png' });
    });

    test('TC 18 Create mission without date (should be blocked)', async ({ page }) => {
        await expect(page.getByText('New MissionQuitStep 1 of 8:')).toBeVisible();
        
        await page.getByRole('textbox', { name: 'Enter mission name' }).click();
        await page.getByRole('textbox', { name: 'Enter mission name' }).fill('Test Mission');
        await page.getByRole('textbox', { name: 'Describe the mission' }).click();
        await page.getByRole('textbox', { name: 'Describe the mission' }).fill('Test description');
        
        await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
        
        await page.screenshot({ path: screenshotsPath + 'TC_18/validation_date_required.png' });
    });

    test('TC 19 Create mission without description (should be blocked)', async ({ page }) => {
        await expect(page.getByText('New MissionQuitStep 1 of 8:')).toBeVisible();
        
        await page.getByRole('textbox', { name: 'Enter mission name' }).click();
        await page.getByRole('textbox', { name: 'Enter mission name' }).fill('Test Mission');
        await page.locator('input[type="date"]').fill(getFutureDate(2));
        
        await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
        
        await page.screenshot({ path: screenshotsPath + 'TC_19/validation_description_required.png' });
    });

    test('TC 20 Create mission without selecting UAVs (should be blocked)', async ({ page }) => {
        await test.step('Fill in mission details', async () => {
            await addGeneralInfo(page);
            await page.screenshot({ path: screenshotsPath + 'TC_20/wizard_general_info.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Verify cannot proceed without UAVs', async () => {
            await expect(page.getByText('New MissionQuitStep 2 of 8:')).toBeVisible();
            
            await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
            
            await page.screenshot({ path: screenshotsPath + 'TC_20/validation_uav_required.png' });
        });
    });

    test('TC 21 Create mission without selecting responsible persons (should be blocked)', async ({ page }) => {
        await test.step('Fill in mission details', async () => {
            await addGeneralInfo(page);
            await page.screenshot({ path: screenshotsPath + 'TC_21/wizard_general_info.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });
        
        await test.step('Select UAVs', async () => {
            await addUAVs(page);
            await page.screenshot({ path: screenshotsPath + 'TC_21/wizard_uavs.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Set formation type', async () => {
            await addInitialFormation(page);
            await page.screenshot({ path: screenshotsPath + 'TC_21/wizard_formation.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Verify cannot proceed without responsible persons', async () => {
            await expect(page.getByText('New MissionQuitStep 4 of 8:')).toBeVisible();
            
            await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
            
            await page.screenshot({ path: screenshotsPath + 'TC_21/validation_responsible_person_required.png' });
        });
    });

    test('TC 22 Create mission without waypoints (should be blocked)', async ({ page }) => {
        await test.step('Fill in mission details', async () => {
            await addGeneralInfo(page);
            await page.screenshot({ path: screenshotsPath + 'TC_22/wizard_general_info.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });
    
        await test.step('Select UAVs', async () => {
            await addUAVs(page);
            await page.screenshot({ path: screenshotsPath + 'TC_22/wizard_uavs.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });
    
        await test.step('Set formation type', async () => {
            await addInitialFormation(page);
            await page.screenshot({ path: screenshotsPath + 'TC_22/wizard_formation.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Add responsible persons', async () => {
            await addResponsiblePersons(page);
            await page.screenshot({ path: screenshotsPath + 'TC_22/wizard_responsible_persons.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Verify cannot proceed without waypoints', async () => {
            await expect(page.getByText('New MissionQuitStep 5 of 8:')).toBeVisible();
            
            await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
            
            await page.screenshot({ path: screenshotsPath + 'TC_22/validation_no_waypoints.png' });
        });
    });

    test('TC 23 Create mission with only one waypoint (should be blocked)', async ({ page }) => {
        await test.step('Fill in mission details', async () => {
            await addGeneralInfo(page);
            await page.screenshot({ path: screenshotsPath + 'TC_23/wizard_general_info.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });
    
        await test.step('Select UAVs', async () => {
            await addUAVs(page);
            await page.screenshot({ path: screenshotsPath + 'TC_23/wizard_uavs.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });
    
        await test.step('Set formation type', async () => {
            await addInitialFormation(page);
            await page.screenshot({ path: screenshotsPath + 'TC_23/wizard_formation.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Add responsible persons', async () => {
            await addResponsiblePersons(page);
            await page.screenshot({ path: screenshotsPath + 'TC_23/wizard_responsible_persons.png' });
            await page.getByRole('button', { name: 'Next' }).click();
        });

        await test.step('Verify cannot proceed with only one waypoint', async () => {
            await expect(page.getByText('New MissionQuitStep 5 of 8:')).toBeVisible();
            
            await page.getByPlaceholder('Enter latitude...').click();
            await page.getByPlaceholder('Enter latitude...').fill('45.755618');
            await page.getByPlaceholder('Enter longitude...').click();
            await page.getByPlaceholder('Enter longitude...').fill('16.089140');
            await page.getByRole('button', { name: 'Add Waypoint' }).click();
            
            await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
            
            await page.screenshot({ path: screenshotsPath + 'TC_23/validation_one_waypoint.png' });
        });
    });
});