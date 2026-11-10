import { chromium } from '@playwright/test';
import path from 'path';

async function main() {
    const artifactDir = '/Users/domingoimperatori/.gemini/antigravity/brain/76fb27e0-4622-4213-aa25-e0f6091d3754';
    const browser = await chromium.launch({ headless: true });
    
    // 1. Desktop 1280px
    const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await desktopPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    
    // Header screenshot at 1280px on home
    const headerElement = await desktopPage.$('header');
    if (headerElement) {
        await headerElement.screenshot({
            path: path.join(artifactDir, 'nav-desktop-1280.png'),
        });
    }

    // Footer screenshot at 1280px
    const footerElement = await desktopPage.$('footer');
    if (footerElement) {
        await footerElement.screenshot({
            path: path.join(artifactDir, 'nav-footer-1280.png'),
        });
    }

    // Active state on /defensa-puntos-carnet
    await desktopPage.goto('http://localhost:3000/defensa-puntos-carnet', { waitUntil: 'networkidle' });
    const headerElementActive = await desktopPage.$('header');
    if (headerElementActive) {
        await headerElementActive.screenshot({
            path: path.join(artifactDir, 'nav-desktop-1280-active.png'),
        });
    }
    await desktopPage.close();

    // 2. Mobile 375px
    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    // Accept cookies to clean up the screen
    const cookieBtn = await mobilePage.$('button:has-text("Aceptar todas"), button:has-text("Solo necesarias")');
    if (cookieBtn) {
        await cookieBtn.click();
        await mobilePage.waitForTimeout(300);
    }

    // Open hamburger
    await mobilePage.click('button[aria-label="Abrir menú de navegación"]');
    await mobilePage.waitForTimeout(300);

    // Screenshot closed penal accordion
    await mobilePage.screenshot({
        path: path.join(artifactDir, 'nav-mobile-375-menu-closed-penal.png'),
        fullPage: false,
    });

    // Click details summary to expand Defensa penal
    await mobilePage.click('details summary');
    await mobilePage.waitForTimeout(300);

    // Screenshot open penal accordion
    await mobilePage.screenshot({
        path: path.join(artifactDir, 'nav-mobile-375-menu-open-penal.png'),
        fullPage: false,
    });

    await mobilePage.close();
    await browser.close();
    console.log('Screenshots captured successfully!');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
