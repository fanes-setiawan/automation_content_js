const axios = require('axios');
require('dotenv').config();

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const logToDiscord = async (message, type = 'info') => {
  try {
    let color = 0x3498db;
    if (type === 'success') color = 0x2ecc71;
    if (type === 'error') color = 0xe74c3c;
    if (type === 'warning') color = 0xf1c40f;

    const payload = {
      embeds: [
        {
          title: `n8n Workflow - ${type.toUpperCase()}`,
          description: message,
          color: color,
          timestamp: new Date(),
        },
      ],
    };

    await axios.post(DISCORD_WEBHOOK_URL, payload);
  } catch (error) {
    console.error('Gagal mengirim log ke Discord:', error.message);
  }
};

module.exports = { logToDiscord };
