import type {
    Brand,
    Service,
    ServiceWithPrice,
    CarDetails,
    CarWithServicePrice,
    AvailableCar,
    CarModel,
    BrandToHomepage, ModelToHomepage, Model
} from '../types';

// Базовый URL API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Вспомогательная функция для обработки ошибок
const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// API объект с методами
export const api = {
    // Получить все марки с моделями
    getBrands: async (): Promise<BrandToHomepage[]> => {
        const response = await fetch(`${API_BASE_URL}/brands`);
        return handleResponse<BrandToHomepage[]>(response);
    },

    // Получить конкретную марку по ID
    getBrandById: async (id: number): Promise<Brand> => {
        const response = await fetch(`${API_BASE_URL}/brands/${id}`);
        return handleResponse<Brand>(response);
    },

    // Получить модели марки
    getModelsByBrand: async (brandId: number): Promise<Model[]> => {
        const response = await fetch(`${API_BASE_URL}/models/${brandId}`);
        return handleResponse<ModelToHomepage[]>(response);
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
    getServicesForModel: async (brandId: number, modelId: number): Promise<ServiceWithPrice[]> => {
        const allServices = await api.getServices();

        const servicesWithPrices: ServiceWithPrice[] = [];

        for (const service of allServices) {
            const carService = service.availableCars.find(
                (car: AvailableCar) => car.brandId === brandId && car.modelId === modelId
            );
            if (carService) {
                servicesWithPrices.push({
                    id: service.id,
                    name: service.name,
                    icon: service.icon,
                    price: carService.price
                });
            }
        }

        return servicesWithPrices;
    },

    // Получить детали автомобилей для услуги
    getCarsForService: async (availableCars: AvailableCar[]): Promise<CarWithServicePrice[]> => {
        const carPromises = availableCars.map(async (car) => {
            const carDetails = await api.getCarDetails(car.brandId, car.modelId);
            return {
                ...carDetails,
                servicePrice: car.price
            };
        });

        return Promise.all(carPromises);
    }
};