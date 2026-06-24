import type {
    Brand, CreateOrder, LoginData,
    Model, Price, RegisterData,
    Service, ServiceWithPrice
} from '../types';

// Базовый URL API
const API_BASE_URL = 'http://localhost:8080';

// API объект с методами
export const api = {
    getBrands: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/brands${params}`, {
            credentials: "include"
        });
    },

    getSimpleBrands: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/brands${params}`, {
            credentials: "include"
        });
    },

    addBrand: async (brand: Brand): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/brands`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(brand)});
    },

    setBrandStatus: async (brand: Brand): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/brands`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(brand)});
    },

    // Получить модели марки
    getModelsByBrand: async (brandId: number, params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/models/${brandId}${params}`, {
            credentials: "include"
        });
    },

    addModel: async (model: Model): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/models`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(model)});
    },

    setModel: async (model: Model): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/models`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(model)});
    },

    // Получить все услуги
    getServices: async (params: string): Promise<Response> => {
        return  await fetch(`${API_BASE_URL}/services${params}`, {
            credentials: "include"
        });
    },

    getSimpleServices: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/services${params}`, {
            credentials: "include"
        });
    },

    addService: async (service: Service): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(service)});
    },

    setService: async (service: Service): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/services`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(service)});
    },

    setPrice: async (price: Price): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/prices`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(price)});
    },

    // Получить услуги для конкретной модели
    getServicesForModel: async (modelId: number, params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/services/${modelId}${params}`, {
            credentials: "include"
        });
    },

    addPrices: async (prices: ServiceWithPrice[]): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/prices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(prices)});
    },

    getUsers: async (params: string): Promise<Response> => {
        return  await fetch(`${API_BASE_URL}/users${params}`, {
            credentials: "include"
        });
    },

    getSimpleUsers: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users${params}`, {
            credentials: "include"
        });
    },

    getUserStatistics: async (userId: number): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users/${userId}/statistics`, {
            credentials: "include"
        });
    },

    findUserByPhone: async (phoneNumber: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users/find${phoneNumber}`, {
            credentials: "include"
        });
    },

    setUserType: async (userId: number, newUserType: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users/${userId}/setUserType`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(newUserType)});
    },

    setWorkStatus: async (userId: number, newWorkStatus: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users/${userId}/setWorkStatus`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(newWorkStatus)});
    },

    getOrders: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/orders${params}`, {
            credentials: "include"
        });
    },

    getOrdersForUser: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users${params}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        });
    },

    getOrdersForMaster: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users${params}`, {
            credentials: "include"
        });
    },

    getSimpleOrdersForMaster: async (masterId: number, params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users/${masterId}/ordersToWork${params}`, {
            credentials: "include"
        });
    },

    getSimpleOrders: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/orders${params}`, {
            credentials: "include"
        });
    },

    getSimpleOrdersForUser: async (userId: number, params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/users/${userId}/orders${params}`, {
            credentials: "include"
        });
    },

    deleteOrder: async (orderId: number): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/orders/${orderId}`,
            {
                method: 'DELETE',
                credentials: "include"
            });
    },

    getOrderDetailsForUserOrMaster: async (orderId: number): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/orders/${orderId}/simpleDetails`, {
            credentials: "include"
        });
    },

    getOrderDetailsForAdmin: async (orderId: number): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/orders/${orderId}/fullDetails`, {
            credentials: "include"
        });
    },

    setOrderStatus: async (orderId: number, newOrderStatus: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(newOrderStatus)});
    },

    createOrder: async (newOrder: CreateOrder, services: number[]): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({newOrder, services})});
    },

    getDateSlots: async (params: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/dateSlots${params}`, {
            credentials: "include"
        })
    },

    setDateSlotsStatus: async (dateSlotId: number, newStatus: string): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/dateSlots/${dateSlotId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(newStatus)});
    },

    registration: async (data: RegisterData): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(data)});
    },

    login: async (data: LoginData): Promise<Response> => {
        return await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(data)});
    }
};