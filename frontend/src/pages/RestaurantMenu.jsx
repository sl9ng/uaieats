// src/pages/RestaurantMenu.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MenuSidebar from '../components/MenuSidebar';
import MenuContent from '../components/MenuContent';
import './RestaurantMenu.css';


const RestaurantMenu = ({ addToCart }) => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/restaurants/${id}/`)
      .then(response => {
        setRestaurant(response.data);
      })
      .catch(error => console.error('There was an error!', error));
  }, [id]);

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  const dishesByCategory = restaurant.dishes.reduce((acc, dish) => {
    (acc[dish.category] = acc[dish.category] || []).push(dish);
    return acc;
  }, {});

  return (
    <div className="restaurant-page-container">
      <MenuSidebar restaurant={restaurant} dishesByCategory={dishesByCategory} />
      <MenuContent dishesByCategory={dishesByCategory} addToCart={addToCart} />
    </div>
  );
};

export default RestaurantMenu;