const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './.wwebjs_auth'
  }),
  puppeteer: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ],
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
  },
});

client.on('qr', (qr) => {
  console.log('🔒 Escaneá este QR con tu WhatsApp:\n');
  qrcode.generate(qr, { small: true });
  console.log('\n⚠️  El QR expira en 60 segundos. Escanealo rápido!');
});

client.on('authenticated', () => {
  console.log('✅ Autenticación exitosa');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Error de autenticación:', msg);
});

client.on('ready', () => {
  console.log('✅ ¡Cliente de WhatsApp listo!');
  console.log('📱 Bot conectado y funcionando');
});

client.on('disconnected', (reason) => {
  console.log('⚠️  Cliente desconectado:', reason);
  console.log('🔄 Intentando reconectar...');
});

client.on('message', async (msg) => {
  console.log(`📩 Mensaje recibido: ${msg.body}`);
  
  if (msg.body.toLowerCase() === 'hola') {
    await msg.reply('¡Hola! Soy tu bot 🧠');
  }
  
  if (msg.body.toLowerCase() === 'ping') {
    await msg.reply('🏓 Pong!');
  }
  
  if (msg.body.toLowerCase() === 'estado') {
    await msg.reply('✅ Bot activo y funcionando correctamente');
  }
});

// Manejo de errores
client.on('error', (error) => {
  console.error('❌ Error del cliente:', error);
});

process.on('SIGINT', async () => {
  console.log('🛑 Cerrando bot...');
  await client.destroy();
  process.exit(0);
});

// Inicializar
console.log('🚀 Iniciando bot de WhatsApp...');
client.initialize();

// Exportar para usar en server.js
module.exports = client;
