import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

// 首页
await page.goto('http://localhost:5173');
await page.waitForTimeout(2000);
await page.screenshot({ path: 'screenshot-home.png' });

// 对战页
await page.goto('http://localhost:5173/battle');
await page.waitForTimeout(2000);
await page.screenshot({ path: 'screenshot-battle.png' });

// 角色详情
await page.goto('http://localhost:5173/characters/goku');
await page.waitForTimeout(2000);
await page.screenshot({ path: 'screenshot-detail.png' });

await browser.close();
console.log('done');
