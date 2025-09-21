// src/components/MenuContent.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';    
import './MenuContent.css';

const MenuContent = ({ dishesByCategory, addToCart }) => {
    const { user } = useAuth();       
    const navigate = useNavigate(); 

    const handleAddToCart = (dish) => {
        if (user) {
            addToCart(dish);
        } else {
            alert("Você precisa estar logado para adicionar itens ao carrinho."); 
            navigate('/login');
        }
    };

    return (
        <main className="menu-content">
            {Object.entries(dishesByCategory).map(([category, dishes]) => (
                <section key={category} id={category} className="menu-section">
                    <h2>{category}</h2>
                    <div className="menu-grid">
                        {dishes.map(dish => (
                            <div key={dish.id} className="menu-item-card">
                                <img src={dish.image} alt={dish.name} className="item-image" />
                                <h3 className="item-name">{dish.name}</h3>
                                <p className="item-price">R$ {dish.price}</p>
                                <button className="add-to-cart-btn" onClick={() => handleAddToCart(dish)}>
                                    <svg className="cart-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                    </svg>
                                    Adicionar ao Carrinho
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </main>
    );
};

export default MenuContent;