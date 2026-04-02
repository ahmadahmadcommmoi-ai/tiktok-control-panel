const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.use(express.json());

app.post('/comment', async (req, res) => {
    const { text } = req.body;
    console.log("وصل أمر تعليق جديد:", text);

    // إضافة إعدادات متقدمة لـ Puppeteer لضمان العمل في بيئة Render المحدودة
    const browser = await puppeteer.launch({
        headless: "new", // استخدام النسخة الأحدث من وضع الخفاء
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // مهم جداً لتجنب امتلاء الذاكرة في Render
            '--single-process',
            '--no-zygote'
        ]
    });

    try {
        const page = await browser.newPage();
        
        // تعيين User-Agent ليبدو المتصفح كأنه مستخدم حقيقي وليس بوت
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');

        // ⚠️ ضع كود الجلسة (sessionid) الخاص بك هنا
        await page.setCookie({
            name: 'sessionid',
            value: 'اكتب_هنا_الكود_الطويل_جداً_الذي_نسخته', 
            domain: '.tiktok.com',
            path: '/',
            httpOnly: true,
            secure: true
        });

        // رابط البث المباشر (تأكد من استبدال @username بحسابك)
        await page.goto('https://www.tiktok.com/@اسم_حسابك/live', {
            waitUntil: 'networkidle2', // الانتظار حتى يستقر الاتصال
            timeout: 60000
        });

        // محاولة العثور على خانة الكتابة بذكاء أكبر
        const chatInput = '[contenteditable="true"]';
        await page.waitForSelector(chatInput, { timeout: 20000 });
        
        // النقر على الخانة أولاً للتأكد من تفعيلها
        await page.click(chatInput);
        await page.keyboard.type(text, { delay: 100 }); // تأخير بسيط بين الحروف لتقليد الكتابة البشرية
        
        await page.keyboard.press('Enter');

        console.log(`تم إرسال التعليق بنجاح: ${text}`);
        
        // إغلاق المتصفح بعد ثانية للتأكد من إرسال التعليق
        setTimeout(async () => {
            await browser.close();
        }, 1000);

        res.status(200).send({ success: true });
    } catch (e) {
        console.error("فشل البوت في إرسال التعليق:", e.message);
        await browser.close();
        res.status(500).send({ error: e.message });
    }
});

// استخدام المنفذ الذي يوفره Render تلقائياً أو 10000 كاحتياطي
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`المحرك يعمل الآن على المنفذ ${PORT}`);
});
