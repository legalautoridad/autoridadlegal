import { test, expect } from '@playwright/test';

test.describe('Locations and Courts Verification', () => {

    test('should render dedicated page for Abrera without redirecting', async ({ page }) => {
        // We visit the Abrera location page
        await page.goto('/alcoholemia/abrera');

        // URL should stay at /alcoholemia/abrera
        await expect(page).toHaveURL(/\/alcoholemia\/abrera/);

        // Heading should include Abrera
        const heading = page.locator('h1');
        await expect(heading).toContainText(/Abrera/i);
    });

    test('should display court information in Martorell page', async ({ page }) => {
        await page.goto('/alcoholemia/martorell');

        // Verify Court Heading
        const courtHeading = page.locator('h3', { hasText: /Juzgado competente para Martorell/i });
        await expect(courtHeading).toBeVisible();
    });

    test('should display competent court information in Abrera page', async ({ page }) => {
        await page.goto('/alcoholemia/abrera');

        // Verify Court Heading for Abrera
        const courtHeading = page.locator('h3', { hasText: /Juzgado competente para Abrera/i });
        await expect(courtHeading).toBeVisible();
    });

});
