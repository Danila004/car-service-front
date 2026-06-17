import type {
    Brand, CreateOrder,
    Model, Order, Price,
    Service, ServiceWithPrice
} from '../types';

// Базовый URL API
const API_BASE_URL = 'http://localhost:8080';

// API объект с методами
export const api = {
    getBrands: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/brands${params}`);
    },

    getSimpleBrands: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/brands${params}`);
    },

    addBrand: async (brand: Brand): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/brands`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(brand)});
    },

    setBrandStatus: async (brand: Brand): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/brands`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(brand)});
    },

    // Получить модели марки
    getModelsByBrand: async (brandId: number, params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/models/${brandId}${params}`);
    },

    addModel: async (model: Model): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/models`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(model)});
    },

    setModel: async (model: Model): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/models`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(model)});
    },

    // Получить все услуги
    getServices: async (params: string): Promise<Response> => {
        return  await fetch(`${API_BASE_URL}/services${params}`);
    },

    getSimpleServices: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/services${params}`);
    },

    addService: async (service: Service): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(service)});
    },

    setService: async (service: Service): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/services`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(service)});
    },

    setPrice: async (price: Price): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/prices`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(price)});
    },

    // Получить услуги для конкретной модели
    getServicesForModel: async (modelId: number, params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/services/${modelId}${params}`);
    },

    addPrices: async (prices: ServiceWithPrice[]): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/prices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prices)});
    },

    getUsers: async (params: string): Promise<Response> => {
        return  await fetch(`${API_BASE_URL}/users${params}`);
    },

    getSimpleUsers: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users${params}`);
    },

    getUserStatistics: async (userId: number): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users/${userId}/statistics`);
    },

    findUserByPhone: async (phoneNumber: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users/find${phoneNumber}`);
    },

    setUserType: async (userId: number, newUserType: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users/${userId}/setUserType`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUserType)});
    },

    setWorkStatus: async (userId: number, newWorkStatus: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users/${userId}/setWorkStatus`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newWorkStatus)});
    },

    getOrders: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/orders${params}`);
    },

    getOrdersForUser: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users${params}`);
    },

    getOrdersForMaster: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users${params}`);
    },

    getSimpleOrdersForMaster: async (masterId: number, params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users/${masterId}/ordersToWork${params}`);
    },

    getSimpleOrders: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/orders${params}`);
    },

    getSimpleOrdersForUser: async (userId: number, params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users/${userId}/orders${params}`);
    },

    deleteOrder: async (orderId: number): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/orders/${orderId}`,
            {
                method: 'DELETE',
            });
    },

    getOrderDetailsForUserOrMaster: async (orderId: number): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/orders/${orderId}/simpleDetails`);
    },

    getOrderDetailsForAdmin: async (orderId: number): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/orders/${orderId}/fullDetails`);
    },

    setOrderStatus: async (orderId: number, newOrderStatus: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrderStatus)});
    },

    createOrder: async (newOrder: CreateOrder, services: number[]): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newOrder, services})});
    },

    getDateSlots: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/dateSlots${params}`)
    },

    setDateSlotsStatus: async (dateSlotId: number, newStatus: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/dateSlots/${dateSlotId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newStatus)});
    },
};