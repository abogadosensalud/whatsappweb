const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
    headless: true,
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

client.initialize();
