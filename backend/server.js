const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas de relatos (API)
const RELATOS_FILE = path.join(__dirname, 'relatos.json');

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf-8') || '[]');
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

app.post('/api/relatos', (req, res) => {
  const { estado, cidade, descricao } = req.body;
  if (!estado || !cidade || !descricao)
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });

  const relatos = readJSON(RELATOS_FILE);

  const novoRelato = {
    id: Date.now(),
    estado,
    cidade,
    descricao,
    data: new Date().toISOString()
  };

  relatos.push(novoRelato);
  writeJSON(RELATOS_FILE, relatos);

  res.json({ message: 'Relato registrado!', relato: novoRelato });
});

app.get('/api/relatos', (req, res) => {
  const relatos = readJSON(RELATOS_FILE);
  res.json(relatos);
});

// Rota fallback para frontend (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
