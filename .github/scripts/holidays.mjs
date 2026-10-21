// Temporary: fetch the Bank of Thailand financial-institution holiday lists.
import { chromium } from 'playwright'
import fs from 'node:fs'
const OUT = 'reference/holidays'
fs.mkdirSync(OUT, { recursive: true })
for (const [name, url] of [
  ['bot-2569-0175.pdf', 'https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2569/EngPDF/25690175.pdf'],
  ['bot-2569-0116.pdf', 'https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2569/EngPDF/25690116.pdf'],
]) {
  try { const r = await fetch(url); console.log(name, r.status); if (r.ok) fs.writeFileSync(`${OUT}/${name}`, Buffer.from(await r.arrayBuffer())) } catch (e) { console.log(name, e.message) }
}
const browser = await chromium.launch()
for (const [name, url] of [
  ['bot-holidays-en', 'https://www.bot.or.th/en/financial-institutions-holiday.html'],
  ['bot-holidays-th', 'https://www.bot.or.th/th/financial-institutions-holiday.html'],
]) {
  const page = await browser.newPage()
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
    await page.waitForTimeout(3000)
    // Open any year tabs so both years render.
    for (const y of ['2026', '2027', '2569', '2570']) { const t = page.getByText(y, { exact: true }).first(); if (await t.count()) { try { await t.click({ timeout: 2000 }); await page.waitForTimeout(1500); fs.appendFileSync(`${OUT}/${name}.txt`, `\n===== ${y} =====\n` + (await page.innerText('body'))) } catch {} } }
    fs.appendFileSync(`${OUT}/${name}.txt`, '\n===== page =====\n' + (await page.innerText('body')))
    console.log(name, 'ok')
  } catch (e) { console.log(name, e.message) }
  await page.close()
}
await browser.close()
