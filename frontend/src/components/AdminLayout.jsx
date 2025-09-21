import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="admin-container">
            <AdminSidebar onLogout={logout} onNavigate={navigate} />
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;