// Моковые данные вместо API
// Марки и модели
export const brandsData = [
    {
        id: 1,
        name: "Toyota",
        models: [
            { id: 101, name: "Camry", year: 2020, price: 5000 },
            { id: 102, name: "Corolla", year: 2021, price: 4500 },
            { id: 103, name: "RAV4", year: 2022, price: 5500 },
            { id: 104, name: "Land Cruiser", year: 2019, price: 8000 }
        ]
    },
    {
        id: 2,
        name: "BMW",
        models: [
            { id: 201, name: "X5", year: 2021, price: 7000 },
            { id: 202, name: "X3", year: 2020, price: 6000 },
            { id: 203, name: "M3", year: 2022, price: 7500 },
            { id: 204, name: "M5", year: 2021, price: 8500 }
        ]
    },
    {
        id: 3,
        name: "Mercedes-Benz",
        models: [
            { id: 301, name: "E-Class", year: 2020, price: 6500 },
            { id: 302, name: "S-Class", year: 2021, price: 9000 },
            { id: 303, name: "C-Class", year: 2022, price: 5500 },
            { id: 304, name: "GLE", year: 2021, price: 7200 }
        ]
    },
    {
        id: 4,
        name: "Audi",
        models: [
            { id: 401, name: "A4", year: 2020, price: 5200 },
            { id: 402, name: "A6", year: 2021, price: 6200 },
            { id: 403, name: "Q5", year: 2022, price: 5800 },
            { id: 404, name: "Q7", year: 2021, price: 7000 }
        ]
    },
    {
        id: 5,
        name: "Hyundai",
        models: [
            { id: 501, name: "Sonata", year: 2020, price: 4200 },
            { id: 502, name: "Tucson", year: 2021, price: 4800 },
            { id: 503, name: "Santa Fe", year: 2022, price: 5200 },
            { id: 504, name: "Elantra", year: 2021, price: 4000 }
        ]
    }
];

// Услуги и доступные автомобили
export const servicesData = [
    {
        id: 1,
        name: "Замена масла",
        icon: "🔧",
        availableCars: [
            { brandId: 1, modelId: 101, price: 3000 },
            { brandId: 1, modelId: 102, price: 2800 },
            { brandId: 2, modelId: 201, price: 4500 },
            { brandId: 3, modelId: 301, price: 4200 },
            { brandId: 4, modelId: 401, price: 3800 }
        ]
    },
    {
        id: 2,
        name: "Диагностика",
        icon: "⚙️",
        availableCars: [
            { brandId: 1, modelId: 103, price: 2000 },
            { brandId: 2, modelId: 202, price: 3500 },
            { brandId: 3, modelId: 303, price: 3000 },
            { brandId: 4, modelId: 403, price: 3200 },
            { brandId: 5, modelId: 502, price: 2500 }
        ]
    },
    {
        id: 3,
        name: "Шиномонтаж",
        icon: "🛞",
        availableCars: [
            { brandId: 1, modelId: 101, price: 2500 },
            { brandId: 1, modelId: 102, price: 2300 },
            { brandId: 2, modelId: 201, price: 4000 },
            { brandId: 3, modelId: 304, price: 4200 },
            { brandId: 4, modelId: 404, price: 3900 }
        ]
    },
    {
        id: 4,
        name: "Ремонт подвески",
        icon: "🔩",
        availableCars: [
            { brandId: 2, modelId: 203, price: 8000 },
            { brandId: 3, modelId: 302, price: 10000 },
            { brandId: 4, modelId: 402, price: 7500 },
            { brandId: 1, modelId: 104, price: 9000 }
        ]
    },
    {
        id: 5,
        name: "Покраска",
        icon: "🎨",
        availableCars: [
            { brandId: 2, modelId: 204, price: 15000 },
            { brandId: 3, modelId: 302, price: 18000 },
            { brandId: 4, modelId: 402, price: 12000 }
        ]
    }
];

// Вспомогательные функции для получения данных
export const getModelsByBrand = (brandId: number) => {
    const brand = brandsData.find(b => b.id === brandId);
    return brand?.models || [];
};

export const getServicesForModel = (brandId: number, modelId: number) => {
    const services: { id: number; name: string; icon: string; price: number }[] = [];

    for (const service of servicesData) {
        const carService = service.availableCars.find(
            car => car.brandId === brandId && car.modelId === modelId
        );
        if (carService) {
            services.push({
                id: service.id,
                name: service.name,
                icon: service.icon,
                price: carService.price
            });
        }
    }

    return services;
};

export const getCarsForService = (availableCars: { brandId: number; modelId: number; price: number }[]) => {
    const carsWithDetails = [];

    for (const car of availableCars) {
        const brand = brandsData.find(b => b.id === car.brandId);
        const model = brand?.models.find(m => m.id === car.modelId);

        if (brand && model) {
            carsWithDetails.push({
                brand: brand.name,
                brandId: car.brandId,
                model: model.name,
                modelId: car.modelId,
                year: model.year,
                basePrice: model.price,
                servicePrice: car.price
            });
        }
    }

    return carsWithDetails;
};