// src/pages/admin/AdminUserList.jsx

import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, toggleUserActive } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminUserList.css'; 

export default function AdminUserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user: adminUser } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error: apiError } = await getUsers();
            if (data) {
                setUsers(data);
            } else {
                setError("Não foi possível carregar os usuários.");
            }
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Tem certeza que deseja excluir o usuário "${userName}"?`)) {
            const { error: deleteError } = await deleteUser(userId);
            if (deleteError) {
                alert(`Erro ao excluir usuário: ${deleteError.error || 'Tente novamente.'}`);
            } else {
                setUsers(users.filter(user => user.id !== userId));
                alert('Usuário excluído com sucesso!');
            }
        }
    };

    const handleToggleActive = async (userId) => {
        const { data: updatedUser, error: toggleError } = await toggleUserActive(userId);
        if (updatedUser) {
            setUsers(users.map(user => user.id === userId ? updatedUser : user));
        } else {
            alert(`Erro ao alterar status: ${toggleError.error || 'Tente novamente.'}`);
        }
    };

    if (loading) return <div className="user-list-container"><p>Carregando usuários...</p></div>;
    if (error) return <div className="user-list-container"><p className="error-message">{error}</p></div>;

    return (
        <div className="user-list-container">
            <h1>Lista de Usuários</h1>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Membro Desde</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name || 'Não informado'}</td>
                            <td>{user.email}</td>
                            <td>
                                <span className={user.is_active ? 'status-active' : 'status-inactive'}>
                                    {user.is_active ? 'Ativo' : 'Inativo'}
                                </span>
                            </td>
                            <td>{new Date(user.date_joined).toLocaleDateString('pt-BR')}</td>
                            <td className="actions-cell">
                                <button
                                    className={user.is_active ? 'deactivate-button' : 'activate-button'}
                                    onClick={() => handleToggleActive(user.id)}
                                    disabled={user.id === adminUser.id}
                                >
                                    {user.is_active ? 'Desativar' : 'Ativar'}
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                                    disabled={user.id === adminUser.id}
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="back-button" onClick={() => navigate('/admin')}>
                Voltar ao Painel
            </button>
        </div>
    );
}