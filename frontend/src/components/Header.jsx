import React, { useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/UaiEats_Logo.png'; 

const Header = ({ user, logout, toggleCart, cartItemCount, searchTerm, setSearchTerm }) => {
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleMouseEnter = () => setIsProfileMenuOpen(true);
    const handleMouseLeave = () => setIsProfileMenuOpen(false);

    const handleLogout = () => {
        logout(); 
        navigate('/'); 
    };

    return (
        <header className="main-header">
            <div className="header-top-bar">
                <Link to="/" className="logo-link">
                    <img src={logo} alt="Foody Logo" className="logo" />
                </Link>

                <div className="center-section">
                    <div className="search-bar-container">
                        <input 
                            type="text" 
                            placeholder="Comida, restaurantes, lojas, itens..." 
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="right-section">
                    <button className="cart-btn" onClick={toggleCart}>
                        {/* SUBSTITUÍDO: Imagem por SVG */}
                        <svg className="cart-icon-svg" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                        {cartItemCount > 0 && (
                            <span className="cart-count">{cartItemCount}</span>
                        )}
                    </button>

                    {user ? (
                        <div 
                            className="profile-menu-container"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <span className="welcome-msg">
                                Olá, {user.name || user.email}!
                            </span>
                            {isProfileMenuOpen && (
                                <div className="profile-dropdown-menu">
                                    <button onClick={() => { 
                                        navigate('/perfil');
                                        setIsProfileMenuOpen(false);
                                    }}>Minha Conta</button>
                                    
                                    <button onClick={() => {
                                        navigate('/minhas-compras'); 
                                        setIsProfileMenuOpen(false);
                                    }}>Minhas Compras</button>

                                    <button onClick={handleLogout}>Sair</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button className="login-btn" onClick={() => navigate("/login")}>
                                Entrar
                            </button>
                            <button className="cadastro-btn" onClick={() => navigate("/cadastro")}>
                                Cadastrar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;