const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
app.use(express.json());

app.post('/comment', async (req, res) => {
    const { text } = req.body; // البيانات القادمة من Vercel
    console.log("وصل أمر تعليق جديد:", text);

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        
        // ⚠️ ضع كود الجلسة الخاص بحسابك هنا
        await page.setCookie({
            name: 'sessionid',
            value: 'اكتب_هنا_الكود_الطويل_جداً_الذي_نسخته', 
            domain: '.tiktok.com'
        });

        // رابط البث المباشر (استبدله برابطك)
        await page.goto('https://www.tiktok.com/@اسم_حسابك/live');

        // الانتظار حتى تظهر خانة الكتابة
        await page.waitForSelector('[contenteditable="true"]', { timeout: 15000 });
        await page.type('[contenteditable="true"]', text);
        await page.keyboard.press('Enter');

        console.log("تم إرسال التعليق بنجاح!");
        await browser.close();
        res.status(200).send({ success: true });
    } catch (e) {
        console.error("فشل البوت:", e.message);
        await browser.close();
        res.status(500).send({ error: e.message });
    }
});

app.listen(10000);
