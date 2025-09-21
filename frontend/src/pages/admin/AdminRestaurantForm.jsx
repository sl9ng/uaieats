// src/pages/admin/AdminRestaurantForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addRestaurant, getRestaurantDetails, updateRestaurant } from '../../api/api';
import './AdminForm.css'; 

const AdminRestaurantForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        delivery_time: 30,
        image: ''
    });
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            const fetchRestaurant = async () => {
                const { data } = await getRestaurantDetails(id);
                if (data) setFormData(data);
            };
            fetchRestaurant();
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = isEditing ? await updateRestaurant(id, formData) : await addRestaurant(formData);

        if (result.error) {
            alert("Ocorreu um erro ao salvar o restaurante.");
        } else {
            navigate('/admin/restaurants');
        }
    };

    return (
        <div className="admin-form-container">
            <h1>{isEditing ? 'Editar Restaurante' : 'Adicionar Novo Restaurante'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nome</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Descrição</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
                </div>
                <div className="form-group">
                    <label>Endereço</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Tempo de Entrega (minutos)</label>
                    <input type="number" name="delivery_time" value={formData.delivery_time} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>URL da Imagem</label>
                    <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://exemplo.com/imagem.png" />
                </div>
                <button type="submit" className="btn-submit">
                    {isEditing ? 'Salvar Alterações' : 'Adicionar Restaurante'}
                </button>
            </form>
        </div>
    );
};

export default AdminRestaurantForm;