require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { query } = require('./db');
const setupSwagger = require('./swagger');
const autenticarToken = require('./auth');
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
        res.status(500).json({ error: error });
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
        res.status(500).json({ error: error });
    }
});




/**
 * @swagger
 * /oportunidadesDisponiveis:
 *   get:
 *     summary: Lista oportunidades de voluntariado disponíveis
 *     description: Retorna uma lista de oportunidades que ainda possuem vagas disponíveis e nas quais o usuário autenticado ainda não está inscrito.
 *     tags: [Oportunidades]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de oportunidades retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID da oportunidade.
 *                   titulo:
 *                     type: string
 *                     description: Título da oportunidade.
 *                   descricao:
 *                     type: string
 *                     description: Descrição detalhada da oportunidade.
 *                   endereco:
 *                     type: string
 *                     description: Endereço da oportunidade.
 *                   vagasRestantes:
 *                     type: integer
 *                     description: Número de vagas ainda disponíveis.
 *                   entidade:
 *                     type: string
 *                     description: Nome da entidade responsável pela oportunidade.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       500:
 *         description: Erro de servidor.
 */
app.get('/oportunidadesDisponiveis', autenticarToken, async (req, res) => {
    const usuarioId = req.usuario.id;
    try {
        const oportunidades = await query(`
            SELECT op.id, op.titulo, op.descricao, op.endereco, op.data,
                (op.max_voluntarios - COALESCE(u.total_inscritos, 0)) AS vagasRestantes,
                us.nome AS entidade,
                EXISTS (
                    SELECT 1 
                    FROM usuariosxoportunidades ux
                    WHERE ux.id_oportunidade = op.id 
                    AND ux.id_usuario = ?
                ) AS inscrito
            FROM oportunidades op
            INNER JOIN usuarios us ON op.entidade_id = us.id
            LEFT JOIN (
                SELECT id_oportunidade, COUNT(*) AS total_inscritos
                FROM usuariosxoportunidades
                GROUP BY id_oportunidade
            ) u ON op.id = u.id_oportunidade
            WHERE (op.max_voluntarios - COALESCE(u.total_inscritos, 0)) > 0;`, [usuarioId]);

        res.status(200).json(oportunidades);
    } catch (error) {
        res.status(500).json({ error: error });
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
 *               endereco:
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
    const { titulo, descricao, endereco, quantidadeMaximaVoluntarios, dataAcao} = req.body;
    const entidadeId = req.usuario.id;

    try {
        const entidade = await query('SELECT * FROM usuarios WHERE id = ? AND tipo = "entidade"', [entidadeId]);
        const entidade = await query('SELECT * FROM usuarios WHERE id = ? AND tipo = "entidade"', [entidadeId]);
        
        if (entidade.length === 0) {
            return res.status(403).json({ error: 'Apenas entidades podem criar oportunidades!' });
        }

        await query('INSERT INTO oportunidades (titulo, descricao, endereco, max_voluntarios, data, entidade_id) VALUES (?, ?, ?, ?, ?, ?)', 
            [titulo, descricao, endereco, quantidadeMaximaVoluntarios, dataAcao, entidadeId]);
        await query('INSERT INTO oportunidades (titulo, descricao, endereco, max_voluntarios, data, entidade_id) VALUES (?, ?, ?, ?, ?, ?)', 
            [titulo, descricao, endereco, quantidadeMaximaVoluntarios, dataAcao, entidadeId]);

        res.status(201).json({ message: 'Oportunidade criada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error });
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
        res.status(500).json({ error: error });
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
 *               - endereco
 *               - quantidadeMaximaVoluntarios
 *               - dataAcao
 *             properties:
 *               idOportunidade:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               endereco:
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
    const {idOportunidade, titulo, descricao, endereco, quantidadeMaximaVoluntarios, dataAcao} = req.body;
    const entidadeId = req.usuario.id;

    try {

        const existeOportunidade = await query('SELECT 1 FROM oportunidades WHERE id = ? AND entidade_id = ?', [idOportunidade, entidadeId]);

        if (existeOportunidade.length === 0) {
            res.status(404).json({ message: 'Oportunidade não encontrada!' });
        }

        await query('UPDATE oportunidades SET titulo = ?, descricao = ?, endereco = ?, max_voluntarios = ?, data = ? WHERE id = ? and entidade_id = ?', 
            [titulo, descricao, endereco, quantidadeMaximaVoluntarios, dataAcao, idOportunidade, entidadeId]);
        res.status(200).json({ message: 'Oportunidade atualizada com sucesso!' });


    } catch (error) {
        res.status(500).json({ error: error });
    }
});

/**
 * @swagger
 * /inscreveOportunidade:
 *   post:
 *     summary: Inscreve um voluntário em uma oportunidade de voluntariado
 *     description: Apenas voluntários podem se inscrever em oportunidades de voluntariado.
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
 *                 description: ID da oportunidade na qual o voluntário deseja se inscrever.
 *     responses:
 *       200:
 *         description: Inscrição concluída com sucesso.
 *       403:
 *         description: Apenas voluntários podem se inscrever em oportunidades.
 *       500:
 *         description: Erro de servidor.
 */
app.post('/inscreveOportunidade', autenticarToken, async (req, res) => {
    const {oportunidadeId} = req.body;
    const usuarioId = req.usuario.id;
    const usuarioTipo = req.usuario.tipo;

    try {
        if (usuarioTipo === 'entidade') {
            return res.status(403).json({ message: 'Apenas voluntários podem se inscrever em oportunidades!' });
        }
    
        await query('INSERT INTO usuariosxoportunidades (id_usuario, id_oportunidade) values (?, ?)', [usuarioId, oportunidadeId]);
        return res.status(200).json({ message: 'Inscrição concluída com sucesso!' });
    
    } catch (error) {
        console.error('Erro ao executar query:', error);
        return res.status(500).json({ error: error.message });
    }
    
});

/**
 * @swagger
 * /minhasOportunidades:
 *   get:
 *     summary: Lista oportunidades cadastradas pela entidade ou oportunidades em que o voluntário está inscrito.
 *     description: Retorna uma lista de oportunidades cadastradas pela entidade autenticada (se for do tipo entidade) ou uma lista de oportunidades em que o voluntário autenticado está inscrito.
 *     tags: [Oportunidades]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de oportunidades retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID da oportunidade.
 *                   titulo:
 *                     type: string
 *                     description: Título da oportunidade.
 *                   descricao:
 *                     type: string
 *                     description: Descrição detalhada da oportunidade.
 *                   endereco:
 *                     type: string
 *                     description: Endereço da oportunidade.
 *                   quantidadeMaximaVoluntarios:
 *                     type: integer
 *                     description: Quantidade máxima de voluntários permitidos na oportunidade (apenas para entidades).
 *                   vagasRestantes:
 *                     type: integer
 *                     description: Número de vagas ainda disponíveis para novos voluntários (apenas para entidades).
 *                   data:
 *                     type: string
 *                     format: date
 *                     description: Data da oportunidade (apenas para voluntários).
 *                   entidade:
 *                     type: string
 *                     description: Nome da entidade responsável pela oportunidade.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       500:
 *         description: Erro de servidor.
 */
app.get('/minhasOportunidades', autenticarToken, async (req, res) => {
    const usuarioId = req.usuario.id;
    const usuarioTipo = req.usuario.tipo;
    let oportunidades = [];
    try {
        if(usuarioTipo === 'entidade') {
            oportunidades = await query(`
                SELECT op.id, op.titulo, op.descricao, op.endereco, op.max_voluntarios as quantidadeMaximaVoluntarios,
                    (op.max_voluntarios - COALESCE(u.total_inscritos, 0)) AS vagasRestantes
                FROM oportunidades op
                INNER JOIN usuarios us ON op.entidade_id = us.id
                LEFT JOIN (
                    SELECT id_oportunidade, COUNT(*) AS total_inscritos
                    FROM usuariosxoportunidades
                    GROUP BY id_oportunidade
                ) u ON op.id = u.id_oportunidade
                WHERE op.entidade_id = ?;`,
                    [usuarioId]);
        } else {
            oportunidades = await query(`
                SELECT op.id, op.titulo, op.descricao, op.endereco, op.data, us.nome as entidade
                FROM oportunidades op
                INNER JOIN usuarios us ON op.entidade_id = us.id
                WHERE EXISTS (SELECT 1 
                                FROM usuariosxoportunidades ux
                                WHERE ux.id_oportunidade = op.id 
                                AND ux.id_usuario = ?);`,
                    [usuarioId]);
        }

        res.status(200).json(oportunidades);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// 🔹 Iniciar o Servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
