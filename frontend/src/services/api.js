import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add token to requests if available
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("adminToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Product APIs
export const productAPI = {
	getProducts: (params) => api.get("/products/customer", { params }),
	getProduct: (id) => api.get(`/products/customer/${id}`),
	getCategories: () => api.get("/products/categories"),
	// Admin
	getAdminProducts: (params) => api.get("/products/admin", { params }),
	getAdminProduct: (id) => api.get(`/products/admin/${id}`),
	createProduct: (formData) =>
		api.post("/products/admin", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
	updateProduct: (id, formData) =>
		api.put(`/products/admin/${id}`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		}),
	deleteProduct: (id) => api.delete(`/products/admin/${id}`),
	updateProductStatus: (id, status) =>
		api.patch(`/products/admin/${id}/status`, { status }),
};

// Order APIs
export const orderAPI = {
	createOrder: (data) => api.post("/orders/customer", data),
	getOrder: (id) => api.get(`/orders/customer/${id}`),
	// Admin
	getAdminOrders: (params) => api.get("/orders/admin", { params }),
	getAdminOrder: (id) => api.get(`/orders/admin/${id}`),
	updateOrderStatus: (id, status) =>
		api.patch(`/orders/admin/${id}/status`, { status }),
};

// Auth APIs
export const authAPI = {
	login: (credentials) => api.post("/auth/login", credentials),
	logout: () => api.post("/auth/logout"),
	getMe: () => api.get("/auth/me"),
};

// Dashboard API
export const dashboardAPI = {
	getStats: () => api.get("/dashboard"),
};

//order tracking API for customers
export const trackOrderAPI = {
	track: (orderId, contactNumber) =>
		api.get(`/orders/track?orderId=${orderId}&contactNumber=${contactNumber}`),
};

export default api;
