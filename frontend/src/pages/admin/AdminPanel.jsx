// src/pages/admin/AdminPanel.jsx
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css"; 

export default function AdminPanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.removeItem("authToken");
    navigate("/login"); 
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Sair
        </button>
      </div>

      <p>Bem-vindo ao painel de administração. Selecione uma opção no menu ao lado para começar.</p>
      
      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => navigate("/admin/restaurants")}>
          <h2>Gerenciar Restaurantes</h2>
          <p>Adicione, edite ou remova restaurantes da plataforma.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate("/admin/users")}>
          <h2>Gerenciar Usuários</h2>
          <p>Visualize e gerencie os clientes cadastrados.</p>
        </div>
      </div>
    </div>
  );
}
