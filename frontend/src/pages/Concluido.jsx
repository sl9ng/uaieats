// src/pages/Concluido.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Concluido.css'; 

const Concluido = () => {
  const navigate = useNavigate();

  return (
    <div className="concluido-container">
      <div className="concluido-card">
        <h1>✅ Pedido Concluído com Sucesso!</h1>
        <p>Agradecemos a sua compra. Seu pedido foi processado e está a caminho!</p>
        <p>Você receberá um email de confirmação em breve.</p>
        
        <div className="concluido-actions">
          <button onClick={() => navigate('/')} className="btn-home">Voltar para o Início</button>
          <button onClick={() => navigate('/minhas-compras')} className="btn-perfil">Ver Meus Pedidos</button>
        </div>
      </div>
    </div>
  );
};

export default Concluido;