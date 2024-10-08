const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config()
const jwt = require('jsonwebtoken')
const generateToken = require('../utils/token')
const generateHtmlContent = require('../utils/htmlResetEmail');
const transporter = require('../utils/transporter')

const registerUser = async (req, res) => {
    try {
    const { nome, sobrenome, dataNascimento, email, senha, admin } = req.body;

    // Verifica se o e-mail já está cadastrado
    const usuarioExistente = await User.findOne({ where: { email } });
    
    if (usuarioExistente) {
        return res.status(400).json({ error: 'E-mail já cadastrado' });
    }
    // Hash da senha antes de armazenar no banco de dados
    const senhaHash = await bcrypt.hash(senha, 10);

    // Cria um novo usuário
    const novoUsuario = await User.create({
        nome,
        sobrenome,
        dataNascimento: new Date(dataNascimento),
        email,
        senha: senhaHash,
        admin: admin
    });

    res.status(201).json(
        { 
            id: novoUsuario.id, 
            nome: novoUsuario.nome, 
            sobrenome:novoUsuario.sobrenome, 
            dataNascimento: novoUsuario.dataNascimento, 
            email: novoUsuario.email,
            admin: novoUsuario.admin 
        });

    } catch (error) {
        console.error('Erro no cadastro de usuário:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { email } = req.body;

        const usuarioExistente = await User.findOne({ where: { email } });

        if (!usuarioExistente) {
            return res.status(404).json({ error: 'E-mail não cadastrado' });
        }

        await usuarioExistente.destroy()
        return res.status(204).json({message: "Usuário removido com sucesso"})
    } catch (error) {
        console.error('Erro no cadastro de usuário:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Encontrar o usuário com base no email
        const user = await User.findOne({ where: { email } });

        // Verificar se o usuário existe e se a senha está correta
        if (user && bcrypt.compareSync(senha, user.senha)) {

            // Gerar um token JWT
            const token = jwt.sign({ userId: user.id, admin: user.admin }, process.env.JWT_SECRET , { expiresIn: process.env.JWT_EXPIRES_IN });

            const {senha: _, ...authenticatedUser} = user.dataValues

            return res.json({user:authenticatedUser, token})
        } else {
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

const resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Encontrar o usuário com base no email
        const user = await User.findOne({ where: { email } });

        // gerar um token para recuperacao de senha
        const emailToken = generateToken()

        if (user) {
            // enviar email com o token
            const mailOptions = {
                from: 'sousav387@gmail.com', // Remetente
                to: `${email}`, // Destinatário
                subject: 'MeConta - Recuperacao de senha',
                html: generateHtmlContent(`${emailToken}`)
            };

            // inserir token no usuario
            await user.update({
                token: `${emailToken}`
            })
            
            // Enviar e-mail
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.status(500).json({ error: 'Erro interno no servidor' });
                } else {
                    res.status(200).json({message: 'Email enviado com sucesso'})
                }
            });
        }else {
            res.status(404).json({message: 'usuario não encontrado'})
        }
        
    
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}

const updatePassword = async (req, res) => {
    const token = req.params.token
    const {email, senha} = req.body

    console.log(token, senha, email)

    try {
        
        // buscar token
        const user = await User.findOne({ where: { email } });

        if(token){
            if (user.token === token) {
                // atualizar senha
                const senhaHash = await bcrypt.hash(senha, 10);

                await user.update({
                    senha: senhaHash,
                    token: null
                })

                return res.status(200).json({message: "Senha atualizada com sucesso"})
            }else {
                return res.status(401).json({error: 'Token inválido'})
            }
        } else {
            return res.status(401).json({error: 'Token inválido'})
        }
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
}


const getUser = async (req, res) => {
    try {
        const usuarioId = req.params.userId

        if (!usuarioId) {
            return res.status(404).json({message:"Campo obrigatório não fornecido"})
        }

        const user = await User.findByPk(usuarioId)

        if (!user) {
            return res.status(404).json({message: "Usuário não encontrado"})
        }

        const {nome, sobrenome, dataNascimento, sexo, imagemPerfil} = user.dataValues
        
        return res.status(200).json({
            nome,
            sobrenome,
            dataNascimento,
            sexo,
            imagemPerfil
        })

    } catch (error) {
        return res.status(500).json({message: "erro interno do servidor"})
    }
}

const updateUser = async (req, res) => {
    try {
        const {nome, sobrenome, dataNascimento, sexo} = req.body
        let {imagemPerfil} = req.body
        const usuarioId = req.params.userId


        if (!nome || !sobrenome || !dataNascimento) {
            return res.status(404).json({message:"Campos obrigatórios não fornecidos."})
        }

        if (!imagemPerfil) {
            imagemPerfil = ''
        }
        
        const user = User.findByPk(usuarioId)
        if (!user) {
            return res.status(404).json({message:"Usuário não encontrado"})
        }

        await User.update({
            nome,
            sobrenome,
            dataNascimento: new Date(dataNascimento),
            sexo,
            imagemPerfil
        },{
            where: {
                id: usuarioId
            }
        })

        return res.status(200).json({message: "Usuário atualizado com sucesso"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "erro interno do servidor"})
    }
}

module.exports = {
    registerUser,
    deleteUser,
    login,
    resetPassword,
    updatePassword,
    updateUser,
    getUser
}