module.exports.sendMsg = async (req, res) => {
  const config = require('../config/config.json');
  const https = require('https');

  const { name, phone } = req.body;
  const msg = `<b>Новая заявка — Энергия Юга</b>\n<b>Имя:</b> ${name}\n<b>Телефон:</b> ${phone}`;

  const chatIds = Array.isArray(config.telegram.chat)
    ? config.telegram.chat
    : [config.telegram.chat];

  let successCount = 0;
  let errorCount = 0;

  const sendToChat = chatId =>
    new Promise(resolve => {
      const postData = JSON.stringify({ chat_id: chatId, parse_mode: 'HTML', text: msg });
      const options = {
        hostname: 'api.telegram.org',
        path: `/bot${config.telegram.token}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };
      const request = https.request(options, response => {
        let data = '';
        response.on('data', chunk => { data += chunk; });
        response.on('end', () => {
          if (response.statusCode === 200) successCount++;
          else { errorCount++; console.error(`Error sending to ${chatId}:`, data); }
          resolve();
        });
      });
      request.on('error', e => { console.error('Request error:', e); errorCount++; resolve(); });
      request.write(postData);
      request.end();
    });

  for (const chatId of chatIds) await sendToChat(chatId);

  if (errorCount === 0) {
    res.status(200).json({ status: 'ok', message: 'Заявка отправлена!' });
  } else {
    res.status(207).json({ status: 'partial', message: `Доставлено: ${successCount}, ошибок: ${errorCount}` });
  }
};
