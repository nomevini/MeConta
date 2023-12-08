import { token, decodedToken } from "./authorization.js";

document.getElementById('form-create-tip').addEventListener('submit', async function (e) {
    console.log('olá')
    e.preventDefault()

    try {
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
