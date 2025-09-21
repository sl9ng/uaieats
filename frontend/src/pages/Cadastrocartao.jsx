// src/pages/Cadastrocartao.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { addCard } from '../api/api'; 
import './Cadastrocartao.css';

const Cadastrocartao = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '', 
        cvv: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    
    const luhnCheck = (num) => {
        let sum = 0;
        let alternate = false;
        for (let i = num.length - 1; i >= 0; i--) {
            let digit = parseInt(num.charAt(i), 10);
            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit = (digit % 10) + 1;
                }
            }
            sum += digit;
            alternate = !alternate;
        }
        return (sum % 10 === 0);
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        const currentYear = today.getFullYear() % 100;
        const currentMonth = today.getMonth() + 1;

        const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
        if (!cardNumberClean) {
            newErrors.cardNumber = "O número do cartão é obrigatório.";
        } else if (!/^\d{13,19}$/.test(cardNumberClean)) {
            newErrors.cardNumber = "O número do cartão deve ter entre 13 e 19 dígitos.";
        } else if (!luhnCheck(cardNumberClean)) {
            newErrors.cardNumber = "Número de cartão inválido.";
        }

        if (!formData.cardHolderName) {
            newErrors.cardHolderName = "O nome impresso no cartão é obrigatório.";
        } else if (!/^[A-Za-z\s]{3,}$/.test(formData.cardHolderName)) {
            newErrors.cardHolderName = "O nome deve conter apenas letras e espaços.";
        }

        if (!formData.expiryDate) {
            newErrors.expiryDate = "A data de validade é obrigatória.";
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
            newErrors.expiryDate = "Formato de data inválido (MM/AA).";
        } else {
            const [month, year] = formData.expiryDate.split('/').map(Number);
            if (year < currentYear || (year === currentYear && month < currentMonth)) {
                newErrors.expiryDate = "Cartão expirado.";
            }
        }

        if (!formData.cvv) {
            newErrors.cvv = "O CVV é obrigatório.";
        } else if (!/^\d{3,4}$/.test(formData.cvv)) {
            newErrors.cvv = "O CVV deve ter 3 ou 4 dígitos numéricos.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "cardNumber") {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
        } else if (name === "expiryDate") {
            formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length > 2) {
                formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
            }
        } else if (name === "cvv") {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setFormData(prevData => ({ ...prevData, [name]: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitSuccess(false);
        setSubmitError(null);

        if (!validateForm()) {
            setSubmitError("Por favor, corrija os erros no formulário.");
            return;
        }

        setLoading(true);
        const cardData = {
            card_number: formData.cardNumber.replace(/\s/g, ''),
            card_holder_name: formData.cardHolderName,
            expiry_date: formData.expiryDate,
            cvv: formData.cvv,
        };

     
        const { data, error } = await addCard(cardData);

        if (data) {
            setSubmitSuccess(true);
            setFormData({ cardNumber: '', cardHolderName: '', expiryDate: '', cvv: '' });
            setErrors({});
            
            setTimeout(() => navigate('/pagamento'), 2000); 
        } else {
            
            if (error && typeof error === 'object') {
                let backendErrorMessages = [];
                for (const key in error) {
                    const message = Array.isArray(error[key]) ? error[key].join(', ') : error[key];
                    backendErrorMessages.push(`${message}`); 
                }
                setSubmitError(`Erro do servidor: ${backendErrorMessages.join('; ')}`);
            } else {
                setSubmitError("Não foi possível cadastrar o cartão. Tente novamente.");
            }
        }
        setLoading(false);
    };

    if (!user) {
        return (
            <div className="cadastro-cartao-container">
                <p>Você precisa estar logado para cadastrar um cartão.</p>
                <button onClick={() => navigate('/login')}>Fazer Login</button>
            </div>
        );
    }

    return (
        <div className="cadastro-cartao-container">
            <div className="cadastro-cartao-card">
                <h1>Cadastrar Novo Cartão</h1>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="cardNumber">Número do Cartão</label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            maxLength="23"
                            placeholder="XXXX XXXX XXXX XXXX"
                            required
                        />
                        {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="cardHolderName">Nome Impresso no Cartão</label>
                        <input
                            type="text"
                            id="cardHolderName"
                            name="cardHolderName"
                            value={formData.cardHolderName}
                            onChange={handleChange}
                            placeholder="NOME COMPLETO"
                            required
                        />
                        {errors.cardHolderName && <p className="error-message">{errors.cardHolderName}</p>}
                    </div>
                    <div className="form-row">
                        <div className="form-group half-width">
                            <label htmlFor="expiryDate">Data de Validade (MM/AA)</label>
                            <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                maxLength="5"
                                placeholder="MM/AA"
                                required
                            />
                            {errors.expiryDate && <p className="error-message">{errors.expiryDate}</p>}
                        </div>
                        <div className="form-group half-width">
                            <label htmlFor="cvv">CVV</label>
                            <input
                                type="password"
                                id="cvv"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleChange}
                                maxLength="4"
                                placeholder="XXX"
                                required
                            />
                            {errors.cvv && <p className="error-message">{errors.cvv}</p>}
                        </div>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar Cartão'}
                    </button>
                    {submitSuccess && <p className="success-message">Cartão cadastrado com sucesso! Redirecionando...</p>}
                    {submitError && <p className="error-message">{submitError}</p>}
                </form>
            </div>
        </div>
    );
};

export default Cadastrocartao;