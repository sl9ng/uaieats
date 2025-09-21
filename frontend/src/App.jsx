import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// --- LAYOUTS ---
import AdminLayout from './components/AdminLayout';
import ClientLayout from './components/ClientLayout';

// --- PÁGINAS DE CLIENTE ---
import RestaurantList from './pages/RestaurantList';
import RestaurantMenu from './pages/RestaurantMenu';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Pagamento from './pages/Pagamento';
import Perfil from './pages/Perfil';
import Cadastrocartao from './pages/Cadastrocartao';
import Concluido from './pages/Concluido';
import HistoricoCompras from './pages/HistoricoCompras';
import VerificarEmail from './pages/VerificarEmail';

// --- PÁGINAS DE ADMIN ---
import AdminPanel from './pages/admin/AdminPanel';
import AdminRestaurantList from "./pages/admin/AdminRestaurantList";
import AdminRestaurantForm from './pages/admin/AdminRestaurantForm';
import AdminDishList from './pages/admin/AdminDishList';
import AdminDishForm from './pages/admin/AdminDishForm';
import AdminUserList from './pages/admin/AdminUserList';

// --- COMPONENTES DE ROTA ---
import PrivateRoute from './components/PrivateRoute';
import './App.css';

// Componente para proteger rotas de admin
const AdminRoute = ({ children }) => {
    const { isAdmin, isLoading } = useAuth();
    if (isLoading) {
        return <div>Carregando...</div>;
    }
    return isAdmin ? children : <Navigate to="/" />;
};

// Componente principal
function App() {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const addToCart = (dish) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.dish.id === dish.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { dish, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Rotas Públicas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                     <Route path="/verificar-email" element={<VerificarEmail />} />

                    {/* Rotas para Admin */}
                    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                        <Route index element={<AdminPanel />} />
                        <Route path="restaurants" element={<AdminRestaurantList />} />
                        <Route path="restaurants/add" element={<AdminRestaurantForm />} />
                        <Route path="restaurants/edit/:id" element={<AdminRestaurantForm />} />
                        <Route path="dishes" element={<AdminDishList />} />
                        <Route path="users" element={<AdminUserList />} />
                        <Route path="restaurants/:restaurantId/dishes" element={<AdminDishList />} />
                        <Route path="restaurants/:restaurantId/dishes/add" element={<AdminDishForm />} />
                        <Route path="restaurants/:restaurantId/dishes/edit/:dishId" element={<AdminDishForm />} />
                    </Route>

                    {/* Rotas para o Cliente */}
                    <Route path="/" element={
                        <ClientLayout
                            cart={cart}
                            setCart={setCart}
                            isCartOpen={isCartOpen}
                            setIsCartOpen={setIsCartOpen}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            addToCart={addToCart}
                        />
                    }>
                        <Route index element={<RestaurantList searchTerm={searchTerm} />} />
                        <Route path="/restaurants/:id" element={<RestaurantMenu addToCart={addToCart} />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/pagamento" element={<Pagamento cart={cart} onClearCart={clearCart} />} />
                            <Route path="/perfil" element={<Perfil />} />
                            <Route path="/cadastro-cartao" element={<Cadastrocartao />} />
                            <Route path="/pedido-concluido" element={<Concluido />} />
                            <Route path="/minhas-compras" element={<HistoricoCompras />} />
                        </Route>
                    </Route>
                    
                    {/* Página 404 */}
                    <Route path="*" element={<h1>Página não encontrada</h1>} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;