const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

require('./index'); // Lógica del bot

app.get('/', (req, res) => res.send('Bot de WhatsApp activo.'));
app.get('/ping', (req, res) => res.send('pong'));

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
