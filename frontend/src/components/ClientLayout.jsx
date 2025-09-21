// src/components/ClientLayout.jsx

import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import Cart from '../pages/Cart';

const ClientLayout = ({ cart, setCart, isCartOpen, setIsCartOpen, searchTerm, setSearchTerm, addToCart }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const updateQuantity = (dishId, amount) => {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.dish.id === dishId
                        ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };
    
    const removeItem = (dishId) => {
        setCart((prevCart) => prevCart.filter((item) => item.dish.id !== dishId));
    };

    const finalizeOrder = () => {
        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }
        navigate('/pagamento');
        setIsCartOpen(false);
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    
    return (
        <div className="App">
            <Header 
                user={user}
                logout={logout}
                toggleCart={toggleCart} 
                cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            
            {isCartOpen && (
                <Cart 
                    cart={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                    onFinalizeOrder={finalizeOrder}
                    onCloseCart={toggleCart}
                />
            )}

            <main>
                <Outlet /> 
            </main>
            
            <Footer />
        </div>
    );
};

export default ClientLayout;