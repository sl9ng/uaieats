// src/pages/Cadastro.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './Cadastro.css';

const Cadastro = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [emailError, setEmailError] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (validateEmail(newEmail) || newEmail === '') {
            setEmailError('');
        } else {
            setEmailError('Por favor, insira um formato de e-mail válido.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem('');
        setErro('');

        if (!validateEmail(email)) {
            setErro('O formato do e-mail é inválido.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/register/', { 
                name: nome,
                email: email,
                password: senha,
            });

            if (response.status === 201) {
                setMensagem('Cadastro realizado! Redirecionando para a página de verificação...');
                // Redireciona para a verificação, passando o e-mail
                setTimeout(() => navigate('/verificar-email', { state: { email: email } }), 2000);
            }
        } catch (error) {
            let errorMsg = 'Erro ao cadastrar. ';
            if (error.response?.data?.email) {
                errorMsg = Array.isArray(error.response.data.email) ? error.response.data.email[0] : error.response.data.email;
            } else if (error.response?.data?.error) {
                errorMsg = error.response.data.error;
            } else {
                errorMsg += 'Tente novamente.';
            }
            setErro(errorMsg);
        }
    };

    return (
        <div className="cadastro-container">
            <h2>Cadastro</h2>
            <form onSubmit={handleSubmit} className="cadastro-form" noValidate>
                <div className="form-group">
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        className={`form-input ${emailError ? 'input-error' : ''}`}
                    />
                    {emailError && <p className="field-error-msg">{emailError}</p>}
                </div>
                <div className="form-group">
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <button type="submit" className="submit-btn">
                    Cadastrar
                </button>
            </form>
            {mensagem && <p className="success-msg">{mensagem}</p>}
            {erro && <p className="error-msg">{erro}</p>}
            <p>Já tem conta? <a href="/login">Entrar</a></p>
        </div>
    );
};

export default Cadastro;