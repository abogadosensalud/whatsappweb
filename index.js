const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- Este puede ayudar mucho en entornos con poca RAM
      '--disable-gpu'
    ],
  },
});

client.on('qr', (qr) => {
  console.log('🔒 Escaneá este QR con tu WhatsApp:\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ ¡Cliente de WhatsApp listo!');
});

client.on('message', (msg) => {
  if (msg.body.toLowerCase() === 'hola') {
    msg.reply('¡Hola! Soy tu bot 🧠');
  }
});

// Manejo de errores para evitar que el proceso muera
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});


client.initialize();
