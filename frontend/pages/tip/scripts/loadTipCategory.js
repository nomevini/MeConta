import { token, decodedToken } from "./authorization.js";

async function loadTipCategories(userId, accessToken) {

    try {
        let response = await fetch(`http://localhost:3000/categoria/${userId}`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            },
        });
 
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error);
        }

        // adicionar as categorias no select na interface
        const selectElement = document.getElementById('selectCategory');
        const categories = await response.json()

        categories.forEach(categoria => {
          const option = document.createElement('option');
          option.text = categoria.nome;
          selectElement.appendChild(option);
        });
         
    } catch (error) {
        console.error('Erro no cadastro de usuário:', error);
        toastError(error.message)
    }
}

loadTipCategories(decodedToken.userId, token)