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

    test('should start conversation, ask for name, and verify Phase 2 & Auto-focus', async ({ page }) => {
        // 1. Open the chat by clicking the bubble
        const chatButton = page.locator('button.bg-blue-600.rounded-full');
        await chatButton.click();

        // 2. Wait for input field to appear and save reference
        const inputField = page.getByPlaceholder(/Escribe tu consulta legal/i);
        await expect(inputField).toBeVisible();

        // 3. Send a greeting
        await inputField.fill('Hola, necesito ayuda');
        await page.keyboard.press('Enter');

        // 4. Wait for AI response (Phase 1: Ask for name)
        // "Antes de nada, para poder dirigirme a ti correctamente, ¿cómo te llamas?"
        const nameQuestion = page.getByText(/cómo te llamas/i).first();
        await expect(nameQuestion).toBeVisible({ timeout: 15000 });

        // 5. Verify Auto-focus (Step 1)
        // After the AI response, the input should be focused.
        await expect(inputField).toBeFocused();

        // 6. Answer with Name
        await inputField.fill('Me llamo TestUser');
        await page.keyboard.press('Enter');

        // 7. Wait for AI response (Phase 2: Explanation/What happened)
        // We wait for a new message from the model. 
        // Since we can't easily select "the last message", we'll wait for the text that indicates the next phase.
        // Relaxing the regex to match common variations or just the core keyword "Cuéntame" or "pasado"
        const explanationRequest = page.getByText(/Cuéntame|pasado/i).first();
        await expect(explanationRequest).toBeVisible({ timeout: 20000 });

        // 8. Verify Auto-focus (Step 2)
        await expect(inputField).toBeFocused();
    });

});
