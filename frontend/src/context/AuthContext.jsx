import { createContext, useState, useContext, useEffect } from "react";
import { loginUser, getProfile } from "../api/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

   
    useEffect(() => {
        const loadUserFromStorage = async () => {
            const token = localStorage.getItem('access');
            const userRole = localStorage.getItem('role'); 
            
            if (token && userRole) {
                try {
                    
                    const { data } = await getProfile();
                    if (data && data.id) {
                        setUser(data);
                        setIsLoggedIn(true);
                        setIsAdmin(userRole === 'admin'); 
                    } else {
                        
                        localStorage.removeItem('access');
                        localStorage.removeItem('refresh');
                        localStorage.removeItem('role');
                    }
                } catch (error) {
                    
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    localStorage.removeItem('role');
                }
            }
            setIsLoading(false);
        };
        loadUserFromStorage();
    }, []);

    const login = async (credentials) => {
        const { data, error } = await loginUser(credentials);
        if (data) {
            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh);
            localStorage.setItem('role', data.role); 
            
            setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
            setIsLoggedIn(true);
            setIsAdmin(data.role === 'admin');
            return { success: true, role: data.role };
        } else {
            return { success: false, error };
        }
    };

    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('role'); 
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate('/');
    };

    const value = {
        user,
        isLoggedIn,
        isAdmin,
        login,
        logout,
        isLoading
    };

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);