const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// Crear directorio de sesión si no existe
const sessionPath = path.join(__dirname, '.wwebjs_auth');
if (!fs.existsSync(sessionPath)) {
  fs.mkdirSync(sessionPath, { recursive: true });
}

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: sessionPath
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium'
  },
  // IMPORTANTE: deshabilitar webCache que está causando el error
  webVersionCache: {
    type: 'none'
  }
});

client.on('qr', (qr) => {
  console.log('\n🔒 Escaneá este QR con tu WhatsApp:\n');
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
  console.log(`📩 Mensaje recibido de ${msg.from}: ${msg.body}`);
  
  try {
    if (msg.body.toLowerCase() === 'hola') {
      await msg.reply('¡Hola! Soy tu bot 🧠\n\nComandos:\n- ping\n- estado\n- ayuda');
    }
    
    if (msg.body.toLowerCase() === 'ping') {
      await msg.reply('🏓 Pong!');
    }
    
    if (msg.body.toLowerCase() === 'estado') {
      await msg.reply('✅ Bot activo y funcionando correctamente');
    }

    if (msg.body.toLowerCase() === 'ayuda') {
      await msg.reply('🤖 Comandos disponibles:\n• hola\n• ping\n• estado\n• ayuda');
    }
  } catch (error) {
    console.error('Error al responder mensaje:', error);
  }
});

// Manejo de errores
client.on('error', (error) => {
  console.error('❌ Error del cliente:', error);
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando bot...');
  await client.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Señal SIGTERM recibida, cerrando...');
  await client.destroy();
  process.exit(0);
});

// Inicializar con reintentos
let initAttempts = 0;
const maxAttempts = 3;

async function initializeClient() {
  try {
    console.log('🚀 Iniciando bot de WhatsApp...');
    await client.initialize();
  } catch (error) {
    initAttempts++;
    console.error(`❌ Error al inicializar (intento ${initAttempts}/${maxAttempts}):`, error.message);
    
    if (initAttempts < maxAttempts) {
      console.log('🔄 Reintentando en 5 segundos...');
      setTimeout(initializeClient, 5000);
    } else {
      console.error('💥 Máximo de intentos alcanzado. Saliendo...');
      process.exit(1);
    }
  }
}

initializeClient();

// Exportar para usar en server.js
module.exports = client;
