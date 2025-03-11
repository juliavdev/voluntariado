require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { query } = require('./db');
const setupSwagger = require('./swagger');
const autenticarToken = require('./auth');

const app = express();
app.use(express.json());
app.use(cors());

setupSwagger(app); // 🔹 Configura Swagger

const JWT_SECRET = process.env.JWT_SECRET;


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Usuários
 *     description: Gerenciamento de usuários
 *   - name: Oportunidades
 *     description: Gerenciamento das açoes voluntárias
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica um usuário e retorna um token
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro de servidor 
 */
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
        res.status(500).json({ error: 'Erro de servidor' });
    }
});


/**
 * @swagger
 * /criaUsuario:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               documento:
 *                 type: string
 *               senha:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [entidade, voluntario]
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       500:
 *         description: Erro de servidor 
 */
app.post('/criaUsuario', async (req, res) => {
    const { nome, email, documento, senha, tipo } = req.body;

    if (!nome || !email || !documento || !senha || !tipo) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        await query('INSERT INTO usuarios (nome, email, cpf_cnpj, senha, tipo) VALUES (?, ?, ?, ?, ?)', 
            [nome, email, documento, hashedPassword, tipo]);

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro de servidor' });
    }
});




/**
 * @swagger
 * /oportunidades:
 *   get:
 *     summary: Retorna a lista de oportunidades
 *     tags: [Oportunidades]
 *     responses:
 *       200:
 *         description: Lista de oportunidades retornada com sucesso
 *       500:
 *         description: Erro de servidor 
 */
app.get('/oportunidades', async (req, res) => {
    try {
        const oportunidades = await query(`
            SELECT op.id, op.titulo, op.descricao, 
                   us.nome AS entidade 
            FROM oportunidades op
            INNER JOIN usuarios us ON oportunidades.entidade_id = usuarios.id`);
        
        res.json(oportunidades);
    } catch (error) {
        res.status(500).json({ error: 'Erro de servidor' });
    }
});

/**
 * @swagger
 * /criaOportunidade:
 *   post:
 *     summary: Cria uma nova oportunidade de voluntariado (somente para entidades)
 *     tags: [Oportunidades]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               quantidadeMaximaVoluntarios:
 *                 type: integer
 *               dataAcao:
 *                 type: string
 *                 format: date
 *                 example: "YYYY-MM-DD"
 *     responses:
 *       201:
 *         description: Oportunidade criada com sucesso
 *       403:
 *         description: Apenas entidades podem criar oportunidades
 *       500:
 *         description: Erro de servidor 
 */
app.post('/criaOportunidade', autenticarToken, async (req, res) => {
    const { titulo, descricao, quantidadeMaximaVoluntarios, dataAcao} = req.body;
    const entidadeId = req.usuario.id;

    try {
        const entidade = await query('SELECT * FROM usuarios WHERE id = ? AND tipo = "entidade"', [entidadeId]);
        
        if (entidade.length === 0) {
            return res.status(403).json({ error: 'Apenas entidades podem criar oportunidades!' });
        }

        await query('INSERT INTO oportunidades (titulo, descricao, max_voluntarios, data, entidade_id) VALUES (?, ?, ?, ?, ?)', 
            [titulo, descricao, quantidadeMaximaVoluntarios, dataAcao, entidadeId]);

        res.status(201).json({ message: 'Oportunidade criada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro de servidor' });
    }
});

/**
 * @swagger
 * /deletaOportunidade:
 *   post:
 *     summary: Deleta uma oportunidade de voluntariado (somente para entidades)
 *     description: Remove uma oportunidade criada pela entidade autenticada.
 *     tags: [Oportunidades]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idOportunidade
 *             properties:
 *               idOportunidade:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Oportunidade deletada com sucesso
 *       401:
 *         description: Acesso negado
 *       403:
 *         description: Token inválido ou expirado
 *       404:
 *         description: Oportunidade não encontrada
 *       500:
 *         description: Erro de servidor
 */
app.post('/deletaOportunidade', autenticarToken, async (req, res) => {
    const {idOportunidade} = req.body;
    const entidadeId = req.usuario.id;

    try {

        const existeOportunidade = await query('SELECT 1 FROM oportunidades WHERE id = ? AND entidade_id = ?', [idOportunidade, entidadeId]);

        if (existeOportunidade.length === 0) {
            res.status(404).json({ message: 'Oportunidade não encontrada!' });
        }

        await query('DELETE FROM oportunidades WHERE id = ? and entidade_id = ?', 
            [idOportunidade, entidadeId]);
        res.status(200).json({ message: 'Oportunidade deletada com sucesso!' });


    } catch (error) {
        res.status(500).json({ error: 'Erro de servidor' });
    }
});


/**
 * @swagger
 * /atualizaOportunidade:
 *   post:
 *     summary: Atualiza uma oportunidade de voluntariado (somente para entidades)
 *     description: Atualiza uma oportunidade criada pela entidade autenticada.
 *     tags: [Oportunidades]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
  *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idOportunidade
 *               - titulo
 *               - descricao
 *               - quantidadeMaximaVoluntarios
 *               - dataAcao
 *             properties:
 *               idOportunidade:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               quantidadeMaximaVoluntarios:
 *                 type: integer
 *               dataAcao:
 *                 type: string
 *                 format: date
 *                 example: "YYYY-MM-DD"
 *     responses:
 *       200:
 *         description: Oportunidade atualizada com sucesso
 *       401:
 *         description: Acesso negado
 *       403:
 *         description: Token inválido ou expirado
 *       404:
 *         description: Oportunidade não encontrada
 *       500:
 *         description: Erro de servidor
 */
app.post('/atualizaOportunidade', autenticarToken, async (req, res) => {
    const {idOportunidade, titulo, descricao, quantidadeMaximaVoluntarios, dataAcao} = req.body;
    const entidadeId = req.usuario.id;

    try {

        const existeOportunidade = await query('SELECT 1 FROM oportunidades WHERE id = ? AND entidade_id = ?', [idOportunidade, entidadeId]);

        if (existeOportunidade.length === 0) {
            res.status(404).json({ message: 'Oportunidade não encontrada!' });
        }

        await query('UPDATE oportunidades SET titulo = ?, descricao = ?, max_voluntarios = ?, data = ? WHERE id = ? and entidade_id = ?', 
            [titulo, descricao, quantidadeMaximaVoluntarios, dataAcao, idOportunidade, entidadeId]);
        res.status(200).json({ message: 'Oportunidade atualizada com sucesso!' });


    } catch (error) {
        res.status(500).json({ error: 'Erro de servidor' });
    }
});



// 🔹 Iniciar o Servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
