// src/pages/admin/AdminRestaurantList.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getRestaurants, deleteRestaurantAPI } from '../../api/api';
import './AdminList.css'; 

const AdminRestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Função para buscar os restaurantes na API
    const fetchRestaurants = useCallback(async () => {
        setLoading(true);
        const { data } = await getRestaurants();
        if (data) {
            setRestaurants(data);
        }
        setLoading(false);
    }, []);

    // Roda a busca de restaurantes quando o componente é montado
    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    // Função para deletar um restaurante
    const handleDelete = async (id, name) => {
        
        if (window.confirm(`Tem certeza que deseja excluir o restaurante "${name}"? Esta ação não pode ser desfeita.`)) {
            const { error } = await deleteRestaurantAPI(id);
            if (error) {
                alert("Não foi possível excluir o restaurante.");
            } else {
                
                fetchRestaurants();
            }
        }
    };

    if (loading) {
        return <div>Carregando restaurantes...</div>;
    }

    return (
        <div className="admin-list-container">
            <div className="admin-list-header">
                <h1>Gerenciar Restaurantes</h1>
                <button onClick={() => navigate('/admin/restaurants/add')} className="btn-add">
                    + Adicionar Restaurante
                </button>
            </div>

            <Link to="/admin" className="admin-back-link">&larr; Voltar para o Dashboard</Link>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Endereço</th>
                        <th>Ações</th>
                        <th>Pratos</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants.length > 0 ? (
                        restaurants.map(restaurant => (
                            <tr key={restaurant.id}>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.address || 'Não informado'}</td>
                                <td className="actions-cell">
                                    <button onClick={() => navigate(`/admin/restaurants/edit/${restaurant.id}`)} className="btn-edit">
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(restaurant.id, restaurant.name)} className="btn-delete">
                                        Excluir
                                    </button>
                                </td>
                                <td className="actions-cell">
                                    <button onClick={() => navigate(`/admin/restaurants/${restaurant.id}/dishes`)} className="btn-view">
                                        Ver Pratos
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>Nenhum restaurante encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminRestaurantList;