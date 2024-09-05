const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const urlSanitizer = require('./utils/sanitizerUrl')

const dir = path.join(__dirname, 'relatorios')
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
}

const urls = ['https://pagespeed.web.dev/', 'https://google.com'];


(async () => {
    const browser = await puppeteer.launch({
        headless: true,

    });

    const page = await browser.newPage();

    let firstURL = true
    for (site of urls) {
        console.log(`Monitorando: ${site}`)
        await page.goto('https://pagespeed.web.dev/')

        // Aceitando Cookies
        if (firstURL) {
            await page.waitForSelector('xpath///span[contains(text(), "Ok, Got it.")]')
            await page.$('xpath///span[contains(text(), "Ok, Got it.")]').then(b => b.click())

            firstURL = false
        }


        // Pesquisando a URL
        await page.waitForSelector('input[placeholder="Enter a web page URL"]')
        await page.waitForSelector('button[jsaction]')
        await page.type('input[placeholder="Enter a web page URL"]', site, { delay: 100 })
        await page.$('form button[jsaction]').then(b => b.click())

        // Alterando o tempo de espera para 
        // pagina carregar completamente
        await page.setDefaultTimeout(0)
        await page.setDefaultNavigationTimeout(0)
        await page.waitForSelector('circle.lh-exp-gauge__arc')

        console.log(dir)
        // Capturando a pagina
        await page.screenshot({
            path: urlSanitizer(site),
            fullPage: true
        })
    }

    await browser.close();
})();
