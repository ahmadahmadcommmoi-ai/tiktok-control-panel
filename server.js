const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.use(express.json());

app.post('/comment', async (req, res) => {
    const { text } = req.body;
    console.log("وصل أمر تعليق جديد:", text);

    // إعدادات خاصة لـ Render لضمان تشغيل المتصفح
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
            '--no-zygote'
        ]
    });

    try {
        const page = await browser.newPage();
        
        // محاكاة متصفح حقيقي
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');

        // --- ⚠️ الجزء المطلوب منك تعديله ---
        await page.setCookie({
            name: 'sessionid',
            value: 'ضع_هنا_كود_الـ_SESSIONID_الخاص_بك', 
            domain: '.tiktok.com',
            path: '/',
            httpOnly: true,
            secure: true
        });

        // --- ⚠️ ضع رابط حسابك هنا ---
        await page.goto('https://www.tiktok.com/@اسم_حسابك/live', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // البحث عن خانة التعليق
        const chatInput = '[contenteditable="true"]';
        await page.waitForSelector(chatInput, { timeout: 20000 });
        
        await page.click(chatInput);
        await page.keyboard.type(text, { delay: 100 }); 
        await page.keyboard.press('Enter');

        console.log(`✅ تم الإرسال: ${text}`);
        
        // إغلاق نظيف للمتصفح
        setTimeout(async () => { await browser.close(); }, 2000);

        res.status(200).send({ success: true });
    } catch (e) {
        console.error("❌ فشل الإرسال:", e.message);
        if (browser) await browser.close();
        res.status(500).send({ error: e.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 المحرك يعمل على المنفذ ${PORT}`));
