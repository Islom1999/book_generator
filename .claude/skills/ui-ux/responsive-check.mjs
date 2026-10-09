#!/usr/bin/env node
// Screenshots pages at phone / tablet / desktop sizes and reports layout problems:
// horizontal overflow, elements wider than the viewport, small tap targets (mobile),
// console errors and failed requests.
//
// Usage:
//   node .claude/skills/ui-ux/responsive-check.mjs --base http://localhost:4300 \
//     --paths /reference/regions,/users/customers --login admin --out /tmp/ui-check
// --login admin signs in through /sign-in with ADMIN_EMAIL / ADMIN_PASSWORD
// (defaults from backend/.env.example).
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1]?.startsWith('--') ? 'true' : all[i + 1]]);
    return acc;
  }, []),
);
const base = args.base ?? 'http://localhost:4300';
const paths = (args.paths ?? '/').split(',');
const out = args.out ?? '/tmp/ui-check';
const viewports = [
  { name: 'phone', width: 375, height: 812, mobile: true },
  { name: 'tablet', width: 768, height: 1024, mobile: true },
  { name: 'desktop', width: 1440, height: 900, mobile: false },
];
const IGNORED_CONSOLE = [/NG0100/];

let playwright;
try {
  playwright = await import('playwright');
} catch {
  playwright = await import('/opt/node-tools/node_modules/playwright/index.mjs');
}
mkdirSync(out, { recursive: true });
const browser = await playwright.chromium.launch();
let problems = 0;

// Sign in once and reuse the session: the sign-in endpoint is rate-limited (5/min).
let storageState;
if (args.login === 'admin') {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${base}/sign-in`);
  await page.fill('#email', process.env.ADMIN_EMAIL ?? 'admin@ertaklar.uz');
  await page.fill('#password', process.env.ADMIN_PASSWORD ?? 'admin12345');
  await page.press('#password', 'Enter');
  await page.waitForURL((u) => !u.pathname.includes('sign-in'), { timeout: 15000 });
  storageState = await context.storageState();
  await context.close();
}

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    locale: args.locale ?? 'uz-UZ',
    storageState,
  });
  const page = await context.newPage();
  const issues = [];
  page.on('console', (m) => {
    if (m.type() === 'error' && !IGNORED_CONSOLE.some((r) => r.test(m.text()))) issues.push(`console: ${m.text().slice(0, 200)}`);
  });
  page.on('requestfailed', (r) => issues.push(`request failed: ${r.url()}`));
  page.on('response', (r) => {
    if (r.status() >= 400) issues.push(`HTTP ${r.status()}: ${r.url()}`);
  });


  for (const p of paths) {
    issues.length = 0;
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const layout = await page.evaluate(({ mobile }) => {
      const vw = window.innerWidth;
      const found = [];
      if (document.documentElement.scrollWidth > vw + 1) {
        found.push(`page scrolls horizontally: ${document.documentElement.scrollWidth}px > ${vw}px`);
      }
      const describe = (el) =>
        el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') +
        (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
      const insideScroller = (el) => {
        for (let n = el.parentElement; n; n = n.parentElement) {
          const o = getComputedStyle(n).overflowX;
          if (o === 'auto' || o === 'scroll' || o === 'hidden') return true;
        }
        return false;
      };
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        // Off-canvas drawers/panels sit entirely outside the viewport on purpose.
        if (r.left >= vw - 1 || getComputedStyle(el).visibility === 'hidden') continue;
        if (r.right > vw + 1 && !insideScroller(el)) found.push(`overflows viewport: ${describe(el)} (right=${Math.round(r.right)})`);
        if (mobile && el.matches('button, a, [role=button], input, select, textarea') && (r.height < 32 || r.width < 32)) {
          found.push(`small tap target ${Math.round(r.width)}x${Math.round(r.height)}: ${describe(el)}`);
        }
      }
      return [...new Set(found)].slice(0, 25);
    }, { mobile: vp.mobile });
    const file = join(out, `${vp.name}${p.replace(/[^a-z0-9]+/gi, '_')}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const all = [...layout, ...issues];
    problems += all.length;
    console.log(`\n[${vp.name} ${vp.width}x${vp.height}] ${p} -> ${file}`);
    for (const i of all) console.log(`  - ${i}`);
    if (!all.length) console.log('  ok');
  }
  await context.close();
}
await browser.close();
console.log(`\n${problems} issue(s). Open the screenshots and review them visually too.`);
process.exitCode = problems ? 1 : 0;
