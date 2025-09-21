// src/pages/VerificarEmail.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cadastro.css'; 

const VerificarEmail = () => {
    const [code, setCode] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/cadastro');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem('');
        setErro('');

        if (code.length !== 6) {
            setErro('O código deve ter 6 dígitos.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/verify-email/', {
                email: email,
                code: code,
            });

            if (response.status === 200) {
                setMensagem('E-mail verificado com sucesso! Redirecionando para o login...');
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Erro ao verificar o código. Tente novamente.';
            setErro(errorMsg);
        }
    };

    return (
        <div className="cadastro-container">
            <h2>Verifique seu E-mail</h2>
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>
                Enviamos um código de 6 dígitos para <strong>{email}</strong>. Por favor, insira-o abaixo.
            </p>
            <form onSubmit={handleSubmit} className="cadastro-form">
                <div className="form-group">
                    <label>Código de Verificação:</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                        required
                        maxLength="6"
                        className="form-input"
                        autoComplete="one-time-code"
                        inputMode="numeric"
                    />
                </div>
                <button type="submit" className="submit-btn">
                    Verificar Conta
                </button>
            </form>
            {mensagem && <p className="success-msg">{mensagem}</p>}
            {erro && <p className="error-msg">{erro}</p>}
        </div>
    );
};

export default VerificarEmail;