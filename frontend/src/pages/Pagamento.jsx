// src/pages/Pagamento.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCards, createOrder } from "../api/api"; 
import "./Pagamento.css";


export default function Pagamento({ cart, onClearCart }) {
    const location = useLocation();
    const navigate = useNavigate();

   
    const [amount, setAmount] = useState(
        location.state?.amount || (cart?.reduce((sum, item) => sum + item.dish.price * item.quantity, 0) || 0)
    );
    
    const [paymentMethod, setPaymentMethod] = useState('cash'); 
    const [cards, setCards] = useState([]);
    const [loadingCards, setLoadingCards] = useState(true);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Efeito para buscar os cartões do usuário
    useEffect(() => {
        const fetchCards = async () => {
            setLoadingCards(true);
            const { data, error: apiError } = await getCards();
            if (data) {
                setCards(data);
            } else {
                setError("Não foi possível carregar seus cartões.");
                console.error(apiError);
            }
            setLoadingCards(false);
        };
        fetchCards();
    }, []);

    
    const handleFinalizeOrder = async (method) => {
        if (!cart || cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }
        if (method === 'card' && !selectedCardId) {
            alert("Por favor, selecione um cartão salvo.");
            return;
        }

        setIsProcessing(true);
        const orderData = {
            items: cart.map(item => ({ dish: item.dish.id, quantity: item.quantity })),
            payment_method: method,
        };

        const { data, error: apiError } = await createOrder(orderData);
        
        if (data) {
            if (onClearCart) onClearCart(); 
            navigate('/pedido-concluido');
        } else {
            alert("Não foi possível registrar seu pedido. Tente novamente.");
            console.error("Erro ao criar pedido:", apiError);
            setIsProcessing(false);
        }
    };
    
    return (
        <div className="pagamento-container">
            <div className="pagamento-card">
                <h1>Finalizar compra</h1>
                <label>Valor Total (R$)</label>
                <input type="number" value={amount.toFixed(2)} readOnly />
                
                <div className="payment-options-selector">
                    <h3>Forma de Pagamento</h3>
                    <label>
                        <input type="radio" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                        Dinheiro (Pagar na Entrega)
                    </label>
                    <label>
                        <input type="radio" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                        Cartão Salvo
                    </label>
                </div>

                {/* Seção para pagamento em Dinheiro */}
                {paymentMethod === 'cash' && (
                    <div className="payment-section">
                        <p>Você pagará R$ {amount.toFixed(2)} na entrega.</p>
                        <button onClick={() => handleFinalizeOrder('cash')} className="checkout-btn" disabled={isProcessing}>
                            {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
                        </button>
                    </div>
                )}

                {/* Seção para pagamento com Cartão */}
                {paymentMethod === 'card' && (
                    <div className="payment-section">
                        {loadingCards ? (
                            <p>Carregando seus cartões...</p>
                        ) : error ? (
                             <p className="error-message">{error}</p>
                        ) : cards.length > 0 ? (
                            <div className="card-selection-container">
                                <p>Selecione um cartão salvo:</p>
                                <div className="card-list">
                                    {cards.map(card => (
                                        <div 
                                            key={card.id} 
                                            className={`card-item ${selectedCardId === card.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedCardId(card.id)}
                                        >
                                            <span>💳 {card.card_brand || 'Cartão'} **** {card.card_number.slice(-4)}</span>
                                            <span>{card.expiry_date}</span>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    className="checkout-btn" 
                                    onClick={() => handleFinalizeOrder('card')}
                                    disabled={!selectedCardId || isProcessing}
                                >
                                    {isProcessing ? 'Processando...' : `Pagar R$ ${amount.toFixed(2)} com Cartão`}
                                </button>
                            </div>
                        ) : (
                            <p>Você não tem cartões cadastrados.</p>
                        )}
                        <button className="btn-add-new-card" onClick={() => navigate('/cadastro-cartao')}>
                            Cadastrar Novo Cartão
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}