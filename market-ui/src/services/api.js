import axios from 'axios';

// Tüm istekler bu base URL'e gidecek
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5228/api',
});

// Her istekte otomatik token ekle
// Interceptor: istek gitmeden önce araya girer
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 gelirse otomatik logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── AUTH ────────────────────────────────────────────────────
export const authService = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
};

// ── PRODUCTS ────────────────────────────────────────────────
export const productService = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  getByBarcode: (barcode) => API.get(`/products/barcode/${barcode}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
};

// ── CATEGORIES ──────────────────────────────────────────────
export const categoryService = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

// ── STOCK ───────────────────────────────────────────────────
export const stockService = {
  stockIn: (data) => API.post('/stock/in', data),
  stockOut: (data) => API.post('/stock/out', data),
  getMovements: (params) => API.get('/stock/movements', { params }),
  getLowStock: () => API.get('/stock/low'),
};

// ── CART ────────────────────────────────────────────────────
export const cartService = {
  getCart: () => API.get('/cart'),
  addToCart: (data) => API.post('/cart/add', data),
  checkout: () => API.post('/cart/checkout'),
};

export default API;