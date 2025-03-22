const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado.' });
    }

    jwt.verify(token, JWT_SECRET, (err, usuario) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido ou expirado.' });
        }
        req.usuario = usuario;
        next();
    });
};

module.exports = autenticarToken;
