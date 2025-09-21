// src/pages/RestaurantList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import './RestaurantList.css'; 

const RestaurantList = ({ searchTerm }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/restaurants/')
      .then(response => setRestaurants(response.data))
      .catch(error => console.error('Erro ao buscar restaurantes!', error));
  }, []);

  // Filtra os restaurantes de acordo com o termo digitado
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-content">
      <h1 className="page-title">Restaurantes</h1>
      <div className="restaurant-list-container">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))
        ) : (
          <p>Nenhum restaurante encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
