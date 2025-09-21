// src/pages/HistoricoCompras.jsx
import React, { useState, useEffect } from 'react';
import { getOrders } from '../api/api'; 
import './HistoricoCompras.css'; 

const HistoricoCompras = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data, error } = await getOrders();
            if (data) {
                setOrders(data);
            } else {
                setError('Não foi possível carregar seu histórico de pedidos.');
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="historico-container">Carregando...</div>;
    if (error) return <div className="historico-container error">{error}</div>;

    return (
        <div className="historico-container">
            <h1>Histórico de Compras</h1>
            {orders.length === 0 ? (
                <p>Você ainda não fez nenhum pedido.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-item">
                            <h3>Pedido #{order.id}</h3>
                            <p>Data: {new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                            <p>Total: R$ {parseFloat(order.total).toFixed(2)}</p>
                            <div className="order-details">
                                <h4>Itens:</h4>
                                <ul>
                                    {order.order_items.map(item => (
                                        <li key={item.id}>{item.quantity}x {item.dish_name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoricoCompras;