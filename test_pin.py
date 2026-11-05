import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto('https://www.pinterest.com/zakbinayew/my-ui-animations/', wait_until='domcontentloaded')
        await page.wait_for_timeout(4000)
        pins = await page.eval_on_selector_all('a[href*="/pin/"]', 'elements => elements.map(e => ({ href: e.href, text: e.innerText }))')
        print(f"Found {len(pins)} pin links")
        await page.evaluate('window.scrollBy(0, 800)')
        await page.wait_for_timeout(2000)
        await page.screenshot(path='pinterest_board_2.png', full_page=False)
        await browser.close()

asyncio.run(main())
