// src/components/MenuSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './MenuSidebar.css';

const MenuSidebar = ({ restaurant, dishesByCategory }) => {
    const categories = Object.keys(dishesByCategory);

    return (
        <aside className="menu-sidebar">
            <Link to="/" className="back-btn">← Voltar</Link>
            <div className="restaurant-info">
                <img src={restaurant.image} alt={restaurant.name} className="restaurant-logo" />
                <h2>{restaurant.name}</h2>
                <p className="restaurant-location">{restaurant.address || 'Endereço não disponível'}</p>
                <div className="delivery-info">
                    <p>Delivery: <span>{restaurant.delivery_time} min</span></p>
                    <p>Frete: <span>Grátis</span></p>
                </div>
            </div>
            <nav className="menu-categories">
                <ul>
                    {categories.map(category => (
                        <li key={category}>
                            <a href={`#${category}`}>{category}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default MenuSidebar;