require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { query } = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'minha_chave_secreta';

// 🔹 Cadastro de Usuário
app.post('/criaUsuario', async (req, res) => {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        await query('INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)', 
            [nome, email, hashedPassword, tipo]);

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
});

// 🔹 Login de Usuário
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const results = await query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const usuario = results[0];
        const isMatch = await bcrypt.compare(senha, usuario.senha);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, tipo: usuario.tipo });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar login' });
    }
});

// 🔹 Listar Oportunidades
app.get('/oportunidades', async (req, res) => {
    try {
        const oportunidades = await query(`
            SELECT oportunidades.id, oportunidades.titulo, oportunidades.descricao, 
                   usuarios.nome AS entidade 
            FROM oportunidades 
            INNER JOIN usuarios ON oportunidades.entidade_id = usuarios.id`);
        
        res.json(oportunidades);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar oportunidades' });
    }
});

// 🔹 Criar Oportunidade (Somente para Entidades)
app.post('/criaOportunidades', async (req, res) => {
    const { titulo, descricao, entidade_id } = req.body;

    try {
        const entidade = await query('SELECT * FROM usuarios WHERE id = ? AND tipo = "entidade"', [entidade_id]);
        
        if (entidade.length === 0) {
            return res.status(403).json({ error: 'Apenas entidades podem criar oportunidades!' });
        }

        await query('INSERT INTO oportunidades (titulo, descricao, entidade_id) VALUES (?, ?, ?)', 
            [titulo, descricao, entidade_id]);

        res.status(201).json({ message: 'Oportunidade criada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar oportunidade' });
    }
});

// 🔹 Iniciar o Servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
