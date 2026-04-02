export default async function handler(req, res) {
    // السماح بالطلبات من أي مكان (CORS) لكي يعمل الكود من صفحة الـ HTML
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // التعامل مع طلبات Preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    try {
        // الرابط الجديد الخاص بخدمة Render التي أنشأتها
        const renderUrl = 'https://tiktok-control-panel.onrender.com/comment';
        
        const response = await fetch(renderUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // نرسل النص تحت مفتاح 'text' ليتوافق مع كود الخادم
            body: JSON.stringify({ text: message })
        });

        if (!response.ok) {
            throw new Error('Render Server responded with error');
        }

        return res.status(200).json({ success: true, info: 'Sent to Render' });
    } catch (error) {
        console.error('Error connecting to Render:', error);
        return res.status(500).json({ error: 'Render Connection Failed', details: error.message });
    }
}
