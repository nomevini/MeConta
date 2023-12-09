import { parseJwt } from "./authorization.js";

document.getElementById('form-create-tip').addEventListener('submit', async function (e) {

    try {

        const token = sessionStorage.getItem('token')
        const decodedToken = parseJwt(token);

        const tip = {
            titulo: document.getElementById('title').value,
            categoria: document.getElementById('selectCategory').value,
            descricao: document.getElementById('description').value
        }
    
        let response = await fetch(`http://localhost:3000/dica/${decodedToken.userId}`, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(tip)
        });

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error);
        }

        console.log("Dica cadastrada com sucesso")
            
    } catch (error) {
        console.error('Erro no cadastro de usuário:', error);
        toastError(error.message)
    }
})

document.querySelector('.save-tip').addEventListener('click', async function(e) {
    const tipId = document.getElementById('modal-titulo').getAttribute('data-id')
    const description = document.getElementById('complete-description').value;

    try {

        const token = sessionStorage.getItem('token')

        let response = await fetch(`http://localhost:3000/dica/${tipId}`, {
            method: 'PUT',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({descricao:description})
        });

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error);
        }

        const data = await response.json()
        
        location.reload()

    } catch (error) {
        
    }
})