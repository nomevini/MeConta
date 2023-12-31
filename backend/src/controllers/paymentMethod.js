const MetodoPagamento = require("../models/paymentMethod")
const Usuario = require("../models/user")

const createPaymentMethod = async (req, res) => {
    try {

        const {nome, renovarSaldo, valorAdicionado, dataRenovacao, usuarioId} = req.body

        if (!nome || !renovarSaldo || !valorAdicionado || !dataRenovacao | !usuarioId) {
            return res.status(400).json({message: "Campos obrigatórios não fornecidos"})
        }

        // verificar se o usuario existe
        const user = await Usuario.findOne({
            where: {
                id: usuarioId
            }
        })

        if (!user) {
            return res.status(404).json({message: "Usuário não encontrado"})
        }

        // verificar se o usuario já criou o metodo
        const methodExist = await MetodoPagamento.findOne({
            where: {
                nome: nome,
                usuarioId: usuarioId
            }
        })

        if (methodExist) {
            return res.status(409).json({message:"Usuario já criou esse método"})
        }

        const payementMethod = await MetodoPagamento.create({
            nome,
            renovarSaldo,
            valorAdicionado,
            dataRenovacao,
            usuarioId
        })

        return res.status(201).json({message: "Método criado", metodoPagamento: payementMethod})
    
    } catch (error) {
        return res.status(500).json({message:"Erro interno do servidor"})
    }
}

const getPaymentMethods = async (req, res) => {
    try {
        const userId = req.usuario.id

        // verificar se o usuario existe
        const user = await Usuario.findOne({
            where: {
                id: userId
            }
        })

        if (!user) {
            return res.status(404).json({message: "Usuário não encontrado"})
        }

        const methods = await MetodoPagamento.findAll({
            where: {
                usuarioId: userId
            }
        })

        return res.status(200).json(methods)
    } catch (error) {
        return res.status(500).json({message:"Erro interno do servidor"})
    }
}

module.exports = {
    createPaymentMethod,
    getPaymentMethods
}