const createTransaction = async (req, res) => {
    try {
        const {descricao, categoria, metodoPagamento, valor, status, qtdParcelas, dataTransacao, metaId, usuarioId} = req.body
        // verificar informacoes

        if (!descricao || !categoria || !metodoPagamento || !valor || !status || !qtdParcelas || !dataTransacao || !usuarioId) {
            return res.status(400).json({ error: 'Campos obrigatórios não fornecidos.'})  
        }


        return res.status(201).json({message:"Criado com sucesso"})
    } catch (error) {
        return res.status(500).json({message: "Erro interno do servidor"})
    }
}

module.exports = {
    createTransaction
}