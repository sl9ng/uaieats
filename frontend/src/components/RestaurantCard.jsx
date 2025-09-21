// src/components/RestaurantCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
    return (
        <div className="restaurant-card">
            <Link to={`/restaurants/${restaurant.id}`} className="card-link">
                <div className="card-image-container">
                    <img src={restaurant.image} alt={restaurant.name} className="card-image" />
                </div>
                <div className="card-content">
                    <h3 className="card-name">{restaurant.name}</h3>
                    <p className="card-description">{restaurant.description}</p>
                    <div className="card-details">
                        <span className="card-delivery-time">
                            🕒 {restaurant.delivery_time} min
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default RestaurantCard;