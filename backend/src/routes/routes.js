const express = require('express')
const { registerUser, deleteUser, login, resetPassword, updatePassword } = require('../controllers/user')
const authentication = require('../middlewares/authentication')
const { createTip, getTip, updateTip, deleteTip } = require('../controllers/tip')
const { createCategory, getCategory } = require('../controllers/category')
const {createGoal, getGoals, deleteGoal, updateGoal} = require('../controllers/goals')
const { createTransaction } = require('../controllers/transaction')
const { createPaymentMethod, getPaymentMethods, deletePaymentMethod } = require('../controllers/paymentMethod')

const routes = express()

// rotas publicas

routes.post('/login', login) // realizar login
routes.post('/usuario', registerUser) // realizar cadastro
routes.post('/recuperar-senha', resetPassword) 
routes.put('/atualizar-senha/:token', updatePassword) 

// middlewares de autenticacao
routes.use(authentication)

// rotas privadas
routes.put('/usuario', ) // Editar usuario
routes.delete('/usuario', deleteUser) // Deletar usuario

routes.get('/balanco', ) // buscar despesa mensal, receita mensal e balanco
routes.get('/transacoes', ) // listar as despesas de um usuario
routes.post('/transacoes', createTransaction) // cadastrar uma despesa ou receita de um usuario
routes.put('/transacoes/:id', ) // editar uma despesa ou receita de um usuario
routes.delete('/transacoes/:id', ) // editar uma despesa ou receita de um usuario

routes.post('/categoria', createCategory) // cadastrar uma categoria
routes.get('/categoria/:userId', getCategory) // listar uma categoria

routes.post('/metodo-pagamento', createPaymentMethod) // cadastrar um metodo de pagamento
routes.get('/metodo-pagamento', getPaymentMethods) // listar os metodos de pagamento
routes.delete('/metodo-pagamento/:id', deletePaymentMethod) // deletar um metodo de pagamento

routes.get('/relatorio') // gerar relatorio de gastos mensais
routes.get('/transacoes/filtrar') // filtrar transacao

routes.post('/dica/:userId', createTip) // postar dica financeira
routes.get('/dicas', getTip) // listar dicas financeiras
routes.put('/dica/:id', updateTip) // editar dica financeira
routes.delete('/dica/:id', deleteTip) // deletar uma dica financeira

routes.post('/meta', createGoal) // criar meta financeira
routes.get('/metas', getGoals) // listar metas financeiras
routes.put('/meta/:metaId', updateGoal) // editar meta financeira
routes.delete('/meta/:metaId', deleteGoal) // editar meta financeira

module.exports = routes