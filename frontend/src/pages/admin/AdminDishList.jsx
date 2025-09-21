// src/pages/admin/AdminDishList.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getDishesForRestaurant, deleteDishAPI } from '../../api/api';
import './AdminList.css';

const AdminDishList = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { restaurantId } = useParams(); 

    const fetchDishes = useCallback(async () => {
        const { data } = await getDishesForRestaurant(restaurantId);
        if (data) setDishes(data);
        setLoading(false);
    }, [restaurantId]);

    useEffect(() => {
        fetchDishes();
    }, [fetchDishes]);

    const handleDelete = async (dishId, dishName) => {
        if (window.confirm(`Tem certeza que deseja excluir o prato "${dishName}"?`)) {
            const { error } = await deleteDishAPI(restaurantId, dishId);
            if (error) {
                alert("Não foi possível excluir o prato.");
            } else {
                fetchDishes();
            }
        }
    };

    if (loading) return <div>Carregando pratos...</div>;

    return (
        <div className="admin-list-container">
            <div className="admin-list-header">
                <h1>Gerenciar Pratos</h1>
                <button onClick={() => navigate(`/admin/restaurants/${restaurantId}/dishes/add`)} className="btn-add">
                    + Adicionar Novo Prato
                </button>
            </div>
            <Link to="/admin/restaurants">&larr; Voltar para Restaurantes</Link>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Nome do Prato</th>
                        <th>Preço</th>
                        <th>Categoria</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {dishes.map(dish => (
                        <tr key={dish.id}>
                            <td>{dish.name}</td>
                            <td>R$ {dish.price}</td>
                            <td>{dish.category}</td>
                            <td className="actions-cell">
                                <button onClick={() => navigate(`/admin/restaurants/${restaurantId}/dishes/edit/${dish.id}`)} className="btn-edit">
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(dish.id, dish.name)} className="btn-delete">
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDishList;