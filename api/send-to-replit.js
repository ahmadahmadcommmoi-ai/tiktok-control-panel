export default async function handler(req, res) {
    // السماح بالطلبات من أي مكان (CORS) لكي يعمل الكود من صفحة الـ HTML
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    try {
        // سنقوم بتغيير هذا الرابط بعد أن ننشئ مشروع Replit
        const replitUrl = 'https://YOUR_REPLIT_URL_HERE/comment';
        
        await fetch(replitUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: message })
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: 'Replit Connection Failed' });
    }
}
