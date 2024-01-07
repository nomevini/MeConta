import { appendTransactionInformation, corrigirFusoHorario, deleteTransaction } from "./transaction.js"

document.getElementById('filter-transaction-form').addEventListener('submit', async function(e) {
    e.preventDefault()
    console.log('Filtrar')
})

document.getElementById('btn-filter-name').addEventListener('click', async function(){
    const descricao = document.getElementById('search-bar').value

    const token = sessionStorage.getItem('token')

    console.log(descricao)
    
    try {
        let response = await fetch(`http://localhost:3000/transacoes/filtrar-desc?descricao=${descricao}`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const error = await response.json()
            throw new Error(response.message);
        }

        const data = await response.json()
        loadTransaction(data)    

    } catch (error) {
        console.log(error)
    }
})

function loadTransaction(data){
    console.log(data)

    const tableContent = document.getElementById('transaction-content')

        tableContent.innerHTML = ''
        
        data.forEach(transaction => {
        const transactionTable = document.createElement('tr')
        
        appendTransactionInformation(transaction.descricao, transactionTable)
        appendTransactionInformation(transaction.valor, transactionTable)
        appendTransactionInformation(transaction.CategoriaTransacao.nome, transactionTable)
        appendTransactionInformation(transaction.MetodoPagamento.nome, transactionTable)
        appendTransactionInformation(transaction.qtdParcelas, transactionTable)
        appendTransactionInformation(corrigirFusoHorario(transaction.dataTransacao), transactionTable)
        if (transaction.status == "pendente") {
            appendTransactionInformation(transaction.status, transactionTable, 'red')
        }else {
            appendTransactionInformation(transaction.status, transactionTable, 'green')
        }
        
        transactionTable.id = transaction.id

        const btnImg = document.createElement('img')
        btnImg.src = './assets/excluir.png'
        btnImg.alt = 'Deletar categoria'

        const btnDeleteTransacao = document.createElement('button')
        btnDeleteTransacao.addEventListener('click', deleteTransaction)
        btnDeleteTransacao.id = 'btn-deletar-transacao'
        btnDeleteTransacao.appendChild(btnImg)

        const btn = document.createElement('th')
        btn.appendChild(btnDeleteTransacao)

        transactionTable.appendChild(btn)

        tableContent.appendChild(transactionTable)
    });

}