import type {
    Brand,
    CarDetails,
    Service
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

    // Получить конкретную марку по ID
    getBrandById: async (id: number): Promise<Brand> => {
        const response = await fetch(`${API_BASE_URL}/brands/${id}`);
        return handleResponse<Brand>(response);
    },

    // Получить модели марки
    getModelsByBrand: async (brandId: number, params: string): Promise<Response> => {
        console.log(`${API_BASE_URL}/models/${brandId}${params}`);
        return await fetch(`${API_BASE_URL}/models/${brandId}${params}`);
    },

    // Получить все услуги
    getServices: async (): Promise<Service[]> => {
        const response = await fetch(`${API_BASE_URL}/services`);
        return handleResponse<Service[]>(response);
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

};