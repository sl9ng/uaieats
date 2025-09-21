// frontend/src/pages/admin/AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanel from './AdminPanel';
import AdminRestaurantList from './AdminRestaurantList';
import AdminRestaurantForm from './AdminRestaurantForm';
import AdminDishList from './AdminDishList';
import AdminDishForm from './AdminDishForm';
import AdminUserList from './AdminUserList';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route index element={<AdminPanel />} />
            <Route path="restaurants" element={<AdminRestaurantList />} />
            <Route path="restaurants/add" element={<AdminRestaurantForm />} />
            <Route path="restaurants/edit/:id" element={<AdminRestaurantForm />} />
            <Route path="dishes" element={<AdminDishList />} />
            <Route path="users" element={<AdminUserList />} />
            <Route path="restaurants/:restaurantId/dishes" element={<AdminDishList />} />
            <Route path="restaurants/:restaurantId/dishes/add" element={<AdminDishForm />} />
            <Route path="restaurants/:restaurantId/dishes/edit/:dishId" element={<AdminDishForm />} />
        </Routes>
    );
};

export default AdminRoutes;