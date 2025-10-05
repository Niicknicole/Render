const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve o frontend

const RELATOS_FILE = path.join(__dirname, 'relatos.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Helper para ler JSON
function readJSON(file) {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf-8') || '[]');
}

// Helper para escrever JSON
function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}


// ============================
// ROTAS DE RELATOS
// ============================

app.post('/api/relatos', (req, res) => {
  const { estado, cidade, descricao, userEmail } = req.body;
  if (!estado || !cidade || !descricao)
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });

  // 🔹 Ler relatos existentes do arquivo
  const relatos = readJSON(RELATOS_FILE);

  // 🔹 Criar o novo relato
  const novoRelato = {
    id: Date.now(),
    estado,
    cidade,
    descricao,
    data: new Date().toISOString()
  };

  // 🔹 Adicionar e salvar
  relatos.push(novoRelato);
  writeJSON(RELATOS_FILE, relatos);

  // 🔹 Retornar resposta
  res.json({ message: 'Relato registrado!', relato: novoRelato });
});
// Listar todos os relatos
app.get('/api/relatos', (req, res) => {
  try {
    let relatos = [];

    if (fs.existsSync(RELATOS_FILE)) {
      relatos = readJSON(RELATOS_FILE);
    }

    // Caso o arquivo esteja vazio ou inválido
    if (!Array.isArray(relatos)) relatos = [];

    res.json(relatos);
  } catch (error) {
    console.error('Erro ao carregar relatos:', error);
    res.status(500).json({ error: 'Erro ao carregar relatos.' });
  }
});

// ============================
// INICIAR SERVIDOR
// ============================
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
