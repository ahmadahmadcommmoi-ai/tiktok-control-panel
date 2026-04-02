const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
app.use(express.json());

app.post('/comment', async (req, res) => {
    const { message } = req.body;
    
    // تشغيل المتصفح بإعدادات Render
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        
        // وضع الكوكيز (Session ID)
        await page.setCookie({
            name: 'sessionid',
            value: 'ضع_هنا_كود_الجلسة',
            domain: '.tiktok.com'
        });

        await page.goto('https://www.tiktok.com/@اسم_حسابك/live');
        
        // كود ضغط أزرار تيك توك والكتابة
        await page.waitForSelector('[contenteditable="true"]');
        await page.type('[contenteditable="true"]', message);
        await page.keyboard.press('Enter');

        await browser.close();
        res.status(200).send("Done");
    } catch (e) {
        await browser.close();
        res.status(500).send("Error");
    }
});

app.listen(10000); // المنفذ الافتراضي لـ Render
