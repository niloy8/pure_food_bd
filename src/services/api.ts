const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('purefood_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

const mapOrder = (o: any) => {
    if (!o) return o;
    return {
        ...o,
        id: o._id,
        customerName: o.customerDetails?.name || o.customerName,
        phone: o.customerDetails?.phone || o.phone,
        address: o.customerDetails?.address || o.address,
    };
};

export const api = {
    // Auth
    login: async (credentials: any) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();
        localStorage.setItem('purefood_token', data.token);
        return data;
    },

    logout: () => {
        localStorage.removeItem('purefood_token');
    },

    // Products
    getProducts: async () => {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        return data.map((p: any) => ({ ...p, id: p._id }));
    },

    getProductById: async (id: string) => {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        return { ...data, id: data._id };
    },

    addProduct: async (product: any) => {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(product)
        });
        const data = await res.json();
        return { ...data, id: data._id };
    },

    updateProduct: async (id: string, product: any) => {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(product)
        });
        const data = await res.json();
        return { ...data, id: data._id };
    },

    deleteProduct: async (id: string) => {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return res.json();
    },

    // Orders
    getOrders: async () => {
        const res = await fetch(`${API_URL}/orders`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        return data.map(mapOrder);
    },

    createOrder: async (order: any) => {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        const data = await res.json();
        return mapOrder(data);
    },

    updateOrderStatus: async (id: string, status: string) => {
        const res = await fetch(`${API_URL}/orders/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        const data = await res.json();
        return mapOrder(data);
    },

    getOrderById: async (id: string) => {
        const res = await fetch(`${API_URL}/orders/${id}`);
        const data = await res.json();
        return mapOrder(data);
    },

    deleteOrder: async (id: string) => {
        const res = await fetch(`${API_URL}/orders/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return res.json();
    },

    getSalesStats: async () => {
        const res = await fetch(`${API_URL}/orders/stats`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        return {
            ...data,
            recentOrders: data.recentOrders.map(mapOrder)
        };
    }
};
