const Categoria = require('../models/transactionCategory')
const Dica = require('../models/financialTip')

const createTip = async (req, res) => {
    const {titulo, categoria, descricao} = req.body
    const {userId} = req.params

    
    try {
        
        if (!titulo || !categoria || !descricao) {
            return res.status(400).json({ error: 'Campos obrigatórios não fornecidos.'})
        }
        
        // buscar o id da categoria
        const categoryData = await Categoria.findOne({
            where: {
                nome: categoria,
            },
        });
        
        if (!categoryData) {
            return res.status(404).json({message: "Categoria não encontrada"})
        }
        
        const categoryId = categoryData.dataValues.id
        
        // Gerar um timestamp
        const dataPublicacao = Date.now()
  
        const newTip = await Dica.create({
            titulo,
            dataPublicacao,
            descricao,
            categoriaId: categoryId,
            idAdmin:userId
        })

        return res.status(200).json({message: "Nova dica criada", dica: newTip})

    } catch (error) {
        
    }
}

module.exports = {
    createTip
}