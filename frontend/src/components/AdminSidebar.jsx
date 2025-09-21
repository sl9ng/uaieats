// src/components/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <h1 className="sidebar-logo">UaiEats</h1>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/admin" end className="sidebar-link">
                    <span className="icon">📊</span> Dashboard
                </NavLink>
                <NavLink to="/admin/restaurants" className="sidebar-link">
                    <span className="icon">🏠</span> Restaurantes
                </NavLink>
                <NavLink to="/admin/users" className="sidebar-link">
                    <span className="icon">👥</span> Usuários
                </NavLink>
            </nav>
        </aside>
    );
};

export default AdminSidebar;