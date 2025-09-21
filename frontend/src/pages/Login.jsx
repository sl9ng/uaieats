import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        const result = await login({ email, password: senha });

        if (result.success) {
            if (result.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            setErro('Login failed: ' + (result.error?.error || 'Please try again.'));
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Senha:</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Entrar</button>
                {erro && <p className="error-msg">{erro}</p>}
            </form>

            
            <p className="redirect-msg">
                Não tem conta?{" "}
                <button 
                    type="button" 
                    className="link-btn" 
                    onClick={() => navigate('/cadastro')}
                >
                    Cadastre-se
                </button>
            </p>
        </div>
    );
};

export default Login;
