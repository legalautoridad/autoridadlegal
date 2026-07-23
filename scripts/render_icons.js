const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function renderIcons() {
    console.log("Launching headless browser to render SVG icons to high-res PNG...");
    const browser = await chromium.launch();
    const context = await browser.newContext({ deviceScaleFactor: 2 });
    const page = await context.newPage();

    const publicDir = path.join(__dirname, '../public');
    const imagesDir = path.join(publicDir, 'images');

    // 1. Render Favicon (512x512 PNG)
    const faviconSvg = fs.readFileSync(path.join(publicDir, 'favicon.svg'), 'utf-8');
    await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;">${faviconSvg}</body></html>`);
    await page.setViewportSize({ width: 512, height: 512 });
    await page.screenshot({ path: path.join(publicDir, 'icon.png'), omitBackground: true });
    await page.screenshot({ path: path.join(publicDir, 'apple-touch-icon.png') });

    // 2. Render Icon Only (transparent 512x512 PNG)
    const iconSvg = fs.readFileSync(path.join(imagesDir, 'logo-icon.svg'), 'utf-8');
    await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;">${iconSvg}</body></html>`);
    await page.screenshot({ path: path.join(imagesDir, 'logo-icon.png'), omitBackground: true });

    // 3. Render Full Logo Dark (1000x320 PNG)
    const logoDarkSvg = fs.readFileSync(path.join(imagesDir, 'logo-dark.svg'), 'utf-8');
    await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;">${logoDarkSvg}</body></html>`);
    await page.setViewportSize({ width: 1000, height: 320 });
    await page.screenshot({ path: path.join(imagesDir, 'logo-dark.png'), omitBackground: true });

    // 4. Render Full Logo Light (1000x320 PNG)
    const logoLightSvg = fs.readFileSync(path.join(imagesDir, 'logo-light.svg'), 'utf-8');
    await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;">${logoLightSvg}</body></html>`);
    await page.screenshot({ path: path.join(imagesDir, 'logo-light.png'), omitBackground: true });

    // 5. Render Full Logo Transparent (1000x320 PNG)
    const logoTransSvg = fs.readFileSync(path.join(imagesDir, 'logo-transparent.svg'), 'utf-8');
    await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;background:transparent;">${logoTransSvg}</body></html>`);
    await page.screenshot({ path: path.join(imagesDir, 'logo.png'), omitBackground: true });

    await browser.close();
    console.log("PNG icons successfully rendered!");
}

renderIcons().catch(err => {
    console.error("Error rendering icons:", err);
    process.exit(1);
});
