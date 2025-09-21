import React, { useState, useEffect } from 'react';
import { getProfile, getCards, updateProfile, changePassword } from '../api/api'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Perfil.css';

// --- Componente do Modal de Senha ---
const PasswordChangeModal = ({ onClose, onPasswordChanged }) => {
    const [passwords, setPasswords] = useState({
        old_password: '',
        new_password: '',
        confirm_new_password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (passwords.new_password !== passwords.confirm_new_password) {
            setError('A nova senha e a confirmação não correspondem.');
            return;
        }
        setLoading(true);
        const { data, error: apiError } = await changePassword(passwords);
        setLoading(false);
        if (data) {
            onPasswordChanged();
        } else {
            const errorMessage = apiError?.old_password || apiError?.new_password || 'Ocorreu um erro ao alterar a senha.';
            setError(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
        }
    };

    return (
        <div className="password-modal-overlay">
            <div className="password-modal-content">
                <h2>Alterar Senha</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Senha Atual</label>
                        <input type="password" name="old_password" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Nova Senha</label>
                        <input type="password" name="new_password" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Confirmar Nova Senha</label>
                        <input type="password" name="confirm_new_password" onChange={handleChange} required />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancelar</button>
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Senha'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Componente Principal do Perfil ---
const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [profileResult, cardsResult] = await Promise.all([ getProfile(), getCards() ]);

      if (profileResult.error) {
        setError('Sessão expirada ou não autorizado. Faça login novamente.');
        setTimeout(() => logout(), 3000); 
        setLoading(false);
        return;
      }
      
      setProfileData(profileResult.data);
      setFormData(profileResult.data);
      setCards(cardsResult.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error: saveError } = await updateProfile(formData);
    setLoading(false);
    if (data) {
      setProfileData(data);
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    } else {
      console.error("Erro ao salvar perfil:", saveError);
      setError('Falha ao salvar o perfil. Verifique os dados e tente novamente.');
    }
  };

  const handleGoToCardRegister = () => navigate('/cadastro-cartao');

  if (loading) return <div className="perfil-container"><p>Carregando perfil...</p></div>;
  if (error) return <div className="perfil-container"><p style={{ color: 'red' }}>{error}</p></div>;
  if (!profileData) return null;

  return (
    <div className="perfil-container">
      {showPasswordModal && (
        <PasswordChangeModal 
            onClose={() => setShowPasswordModal(false)} 
            onPasswordChanged={() => {
                setShowPasswordModal(false);
                alert('Senha alterada com sucesso!');
            }}
        />
      )}

      {isEditing ? (
        <form className="perfil-card" onSubmit={handleSave}>
          <h1>Editar Perfil</h1>
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email || ''} readOnly disabled title="Para alterar o e-mail, use a opção específica em Configurações." />
          </div>
          <div className="form-group">
            <label htmlFor="phone_number">Telefone</label>
            <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number || ''} onChange={handleInputChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">Salvar Alterações</button>
            <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="perfil-card">
          <h1>Perfil de {profileData.name || user?.name}</h1>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Telefone:</strong> {profileData.phone_number || 'Não informado'}</p>
          
          <div className="perfil-section">
            <h2>Meus Cartões</h2>
            <div className="card-list">
              {cards.length > 0 ? (
                cards.map(card => (
                  <div key={card.id} className="card-list-item">
                    <span>💳 {card.card_brand || 'Cartão'} final {card.card_number.slice(-4)}</span>
                    <span>Validade: {card.expiry_date}</span>
                  </div>
                ))
              ) : (
                <p>Nenhum cartão cadastrado.</p>
              )}
            </div>
            <button onClick={handleGoToCardRegister} className="btn-cartao">Adicionar Novo Cartão</button>
          </div>

          <div className="perfil-section">
            <h2>Minhas Compras</h2>
            <button onClick={() => navigate('/minhas-compras')} className="btn-compras">Ver Histórico de Compras</button>
          </div>
          
          <div className="perfil-section">
            <h2>Configurações da Conta</h2>
            <div className="form-actions">
                <button onClick={() => setIsEditing(true)}>Editar Perfil</button>
                <button onClick={() => setShowPasswordModal(true)}>Alterar Senha</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;