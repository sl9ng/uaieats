import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh');
                if (!refreshToken) {
                    localStorage.removeItem('access');
                    window.location.href = '/';
                    return Promise.reject(error);
                }

                const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                localStorage.setItem('access', newAccessToken);

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.error("Não foi possível renovar o token. O usuário precisa logar novamente.", refreshError);
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

const handleRequest = async (request) => {
    try {
        const response = await request();
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        console.error("API Error:", errorMessage);
        return { data: null, error: errorMessage };
    }
};

// --------- Autenticação e Usuário ---------
export const loginUser = (credentials) => handleRequest(() => api.post("/login/", credentials));
export const registerUser = (userData) => handleRequest(() => api.post("/register/", userData));
export const verifyEmail = (verificationData) => handleRequest(() => api.post("/verify-email/", verificationData));
export const getProfile = () => handleRequest(() => api.get("/profile/"));
export const updateProfile = (profileData) => handleRequest(() => api.put("/profile/", profileData));
export const changePassword = (passwordData) => handleRequest(() => api.put("/change-password/", passwordData));

// --------- Gerenciamento de Usuários (Admin) ---------
// Garanta que estas linhas estejam no seu arquivo
export const getUsers = () => handleRequest(() => api.get("/users/"));
export const deleteUser = (userId) => handleRequest(() => api.delete(`/users/${userId}/`));
export const toggleUserActive = (userId) => handleRequest(() => api.post(`/users/${userId}/toggle-active/`));

// --------- Restaurantes ---------
export const getRestaurants = () => handleRequest(() => api.get("/restaurants/"));
export const addRestaurant = (data) => handleRequest(() => api.post("/restaurants/", data));
export const getRestaurantDetails = (id) => handleRequest(() => api.get(`/restaurants/${id}/`));
export const updateRestaurant = (id, data) => handleRequest(() => api.put(`/restaurants/${id}/`, data));
export const deleteRestaurantAPI = (id) => handleRequest(() => api.delete(`/restaurants/${id}/`));

// --------- Pratos (Dishes) ---------
export const getDishesForRestaurant = (restaurantId) => handleRequest(() => api.get(`/restaurants/${restaurantId}/dishes/`));
export const addDish = (restaurantId, data) => handleRequest(() => api.post(`/restaurants/${restaurantId}/dishes/`, data));
export const getDishDetails = (restaurantId, dishId) => handleRequest(() => api.get(`/restaurants/${restaurantId}/dishes/${dishId}/`));
export const updateDish = (restaurantId, dishId, data) => handleRequest(() => api.put(`/restaurants/${restaurantId}/dishes/${dishId}/`, data));
export const deleteDishAPI = (restaurantId, dishId) => handleRequest(() => api.delete(`/restaurants/${restaurantId}/dishes/${dishId}/`));

// --------- Pedidos (Orders) ---------
export const createOrder = (orderData) => handleRequest(() => api.post("/orders/", orderData));
export const getOrders = () => handleRequest(() => api.get("/orders/"));

// --------- Cartões (Cards) ---------
export const getCards = () => handleRequest(() => api.get("/cards/"));
export const addCard = (cardData) => handleRequest(() => api.post("/cards/", cardData));
export const deleteCard = (cardId) => handleRequest(() => api.delete(`/cards/${cardId}/`));

export default api;