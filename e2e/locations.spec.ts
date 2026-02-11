import { test, expect } from '@playwright/test';

test.describe('Locations and Courts Verification', () => {

    test('should redirect from Abrera to Martorell', async ({ page }) => {
        // We visit the slug that should redirect
        await page.goto('/alcoholemia/abrera');

        // Wait for the URL to change to the target
        await expect(page).toHaveURL(/\/alcoholemia\/martorell/);
    });

    test('should display court information in Martorell page', async ({ page }) => {
        await page.goto('/alcoholemia/martorell');

        // 1. Verify Court Heading
        const courtHeading = page.locator('h2', { hasText: /Información del Juzgados de Martorell/i });
        await expect(courtHeading).toBeVisible();

        // 2. Verify General Information
        const generalInfo = page.getByText(/Esto es un test de la informacion relacionada con el juzgado/i);
        await expect(generalInfo).toBeVisible();

        // 3. Verify Address
        const address = page.getByText(/Passatge del Sindicat, 8-10, 08760 Martorell/i);
        await expect(address).toBeVisible();

        // 4. Verify Phone
        const phone = page.getByText(/\+34 666 666 666/i);
        await expect(phone).toBeVisible();

        // 5. Verify Google Maps Link
        const mapsLink = page.locator('a', { hasText: /Ver en Google Maps/i });
        await expect(mapsLink).toBeVisible();
        const href = await mapsLink.getAttribute('href');
        expect(href).toContain('google.com/maps');
        expect(href).toContain('Martorell');
    });

    test('should display jurisdiction notice in Martorell page', async ({ page }) => {
        await page.goto('/alcoholemia/martorell');

        // Verify the blue box notice
        const notice = page.getByText(/Si la infracción se ha producido en Abrera/i);
        await expect(notice).toBeVisible();

        // Verify it contains Martorell as the corresponding court
        await expect(notice).toContainText(/el juzgado que le corresponde es el de Martorell/i);
    });

});
