const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const client = require('./index'); // Bot de WhatsApp

let botReady = false;

// Escuchar cuando el bot esté listo
client.on('ready', () => {
  botReady = true;
});

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    botReady: botReady,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/ping', (req, res) => {
  console.log('🏓 Ping recibido:', new Date().toISOString());
  res.json({ 
    status: 'pong', 
    botStatus: botReady ? 'connected' : 'connecting'
  });
});

app.get('/status', (req, res) => {
  res.json({
    bot: botReady ? '✅ Conectado' : '⏳ Conectando...',
    server: '✅ Activo',
    uptime: `${Math.floor(process.uptime())} segundos`
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor Express en http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/status`);
});
