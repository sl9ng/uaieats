// src/pages/admin/AdminDishForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { addDish, getDishDetails, updateDish } from '../../api/api';
import './AdminForm.css';

const AdminDishForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Outros',
        image: ''
    });
    const navigate = useNavigate();
    const { restaurantId, dishId } = useParams();
    const isEditing = Boolean(dishId);

    useEffect(() => {
        if (isEditing) {
            const fetchDish = async () => {
                const { data } = await getDishDetails(restaurantId, dishId);
                if (data) setFormData(data);
            };
            fetchDish();
        }
    }, [restaurantId, dishId, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
       
        let result;
        if (isEditing) {
            result = await updateDish(restaurantId, dishId, formData);
        } else {
            
            const dataToSend = {
                ...formData,
                restaurant: restaurantId 
            };
            result = await addDish(restaurantId, dataToSend);
        }

        if (result.error) {
            
            const errorMessage = result.error?.detail || "Ocorreu um erro ao salvar o prato.";
            alert(errorMessage);
        } else {
            navigate(`/admin/restaurants/${restaurantId}/dishes`); 
        }
    };

    return (
        <div className="admin-form-container">
            <h1>{isEditing ? 'Editar Prato' : 'Adicionar Novo Prato'}</h1>
            <Link to={`/admin/restaurants/${restaurantId}/dishes`}>&larr; Voltar para a Lista de Pratos</Link>
            
            <form onSubmit={handleSubmit} style={{marginTop: '20px'}}>
                <div className="form-group">
                    <label>Nome do Prato</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Descrição</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
                </div>
                <div className="form-group">
                    <label>Preço (ex: 25.50)</label>
                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Categoria</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>URL da Imagem</label>
                    <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://exemplo.com/imagem.png" />
                </div>
                <button type="submit" className="btn-submit">
                    {isEditing ? 'Salvar Alterações' : 'Adicionar Prato'}
                </button>
            </form>
        </div>
    );
};

export default AdminDishForm;