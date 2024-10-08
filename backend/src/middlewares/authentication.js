require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Middleware para verificar a autenticação
const authentication = async (req, res, next) => {
    let token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {

        token = token.split(' ')[1]
        const {userId} = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({ where: { id:userId } });

        if (!user) {
            return res.status(401).json({mensagem: "Não autorizado"})
        }

        const {senha: _, ...usuario} = user.dataValues

        req.usuario = usuario
        next()
    } catch (error){
        console.error(error)
        return res.status(500).json({error: 'Erro interno do servidor'})
    }
}

module.exports = authentication