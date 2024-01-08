document.getElementById('btn-relatorio').addEventListener('click', async function() {
    try {

        const token = sessionStorage.getItem('token')

        let response = await fetch(`http://localhost:3000/balanco`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            }
        });

        const data = await response.json()

        console.log(data)
        
        const balance = document.getElementById('valor-balanco')
        balance.innerHTML = `R$${data.balancoMensal.balanco}`

        if (data.balancoMensal.balanco < 0) {
            balance.style.color = 'red';
        } else {
            balance.style.color = 'green';
        }

        const receita = document.getElementById('valor-receita-balanco')
        receita.innerHTML = `R$${data.balancoMensal.totalReceitas}`
        receita.style.color = 'green'

        const despesa = document.getElementById('valor-despesa-balanco')
        despesa.innerHTML = `R$${data.balancoMensal.totalDespesas}`
        despesa.style.color = 'red'

        // despesas
        Object.entries(data.transacoesPorCategoria.despesas).forEach(([chave, valor]) => {
            const container = document.querySelector('.despesas')

            const despesa = document.createElement('div')
            despesa.className = 'despesa'

            const nomeDespesa = document.createElement('p')
            nomeDespesa.innerHTML = chave

            const valorDespesa = document.createElement('p')
            valorDespesa.id = 'valor-despesa'
            valorDespesa.innerHTML = valor

            despesa.appendChild(nomeDespesa)
            despesa.appendChild(valorDespesa)
            container.appendChild(despesa)
        });

        // receitas
        Object.entries(data.transacoesPorCategoria.receitas).forEach(([chave, valor]) => {
            const container = document.querySelector('.receitas')

            const receita = document.createElement('div')
            receita.className = 'receita'

            const nomeReceita = document.createElement('p')
            nomeReceita.innerHTML = chave

            const valorReceita = document.createElement('p')
            valorReceita.id = 'valor-receita'
            valorReceita.innerHTML = valor

            receita.appendChild(nomeReceita)
            receita.appendChild(valorReceita)
            container.appendChild(receita)
        });    
    

    } catch (error) {
        
    }
})