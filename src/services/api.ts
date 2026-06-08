import type {
    Brand,
    CarDetails, Model, Price,
    Service, ServiceWithPrice, User, UserStatistics
} from '../types';

// Базовый URL API
const API_BASE_URL = 'http://localhost:8080';

// Вспомогательная функция для обработки ошибок
const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json().then(data => data.content ?? data);
};

// API объект с методами
export const api = {
    getBrands: async (params: string): Promise<Brand[]> => {
        const response = await fetch(`${API_BASE_URL}/brands${params}`);
        return handleResponse<Brand[]>(response);
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

    // Получить конкретную марку по ID
    getBrandById: async (id: number): Promise<Brand> => {
        const response = await fetch(`${API_BASE_URL}/brands/${id}`);
        return handleResponse<Brand>(response);
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
    getServices: async (params: string): Promise<Service[]> => {
        const response = await fetch(`${API_BASE_URL}/services${params}`);
        return handleResponse<Service[]>(response);
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

    // Получить конкретную услугу по ID
    getServiceById: async (id: number): Promise<Service> => {
        const response = await fetch(`${API_BASE_URL}/services/${id}`);
        return handleResponse<Service>(response);
    },

    // Получить детальную информацию об автомобиле по brandId и modelId
    getCarDetails: async (brandId: number, modelId: number): Promise<CarDetails> => {
        const brand = await api.getBrandById(brandId);
        const model = brand.models.find(m => m.id === modelId);

        if (!model) {
            throw new Error(`Model with id ${modelId} not found in brand ${brandId}`);
        }

        return {
            brand: brand.name,
            brandId: brand.id,
            model: model.name,
            modelId: model.id,
            year: model.year,
            basePrice: model.price
        };
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

    getUsers: async (params: string): Promise<User[]> => {
        const response = await fetch(`${API_BASE_URL}/users${params}`);
        return handleResponse<User[]>(response);
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
};