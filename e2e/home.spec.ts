import { test, expect } from '@playwright/test';

test.describe('Autoridad Legal Chatbot', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load the homepage', async ({ page }) => {
        await expect(page).toHaveTitle(/Autoridad Legal/);
    });

    test('should display the chatbot widget', async ({ page }) => {
        // Check for the main floating button container
        const chatButton = page.locator('button.bg-blue-600.rounded-full');
        await expect(chatButton).toBeVisible();
    });

    test('should start conversation and ask for name (Phase 1)', async ({ page }) => {
        // 1. Open the chat by clicking the bubble
        const chatButton = page.locator('button.bg-blue-600.rounded-full');
        await chatButton.click();

        // 2. Wait for input field to appear
        const inputField = page.getByPlaceholder(/Escribe tu consulta legal/i);
        await expect(inputField).toBeVisible();

        // 3. Send a greeting
        await inputField.fill('Hola, necesito ayuda');
        await page.keyboard.press('Enter');

        // 4. Wait for AI response
        // The response should contain the question about the name.
        // "Antes de nada, para poder dirigirme a ti correctamente, ¿cómo te llamas?"

        // We look for a message bubble containing part of the phrase.
        // Using a more flexible text locator
        const response = page.getByText(/cómo te llamas/i).first();
        await expect(response).toBeVisible({ timeout: 15000 });
    });

});
