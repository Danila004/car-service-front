import { useState } from 'react';
import CarsList from './CarsList';
import AddBrandModal from './AddBrandModal';
import AddModelModal from './AddModelModal';
import AddServiceModal from './AddServiceModal';
import { carsData as initialCarsData } from '../data/carsData';
import { CarBrand } from '../types';

interface CarsPageProps {
    onBack: () => void;
    onAddBrand?: () => void;
    onAddModel?: () => void;
}

function CarsPage({ onBack }: CarsPageProps) {
    const [carsData, setCarsData] = useState<CarBrand[]>(initialCarsData);
    const [showAddBrandModal, setShowAddBrandModal] = useState<boolean>(false);
    const [showAddModelModal, setShowAddModelModal] = useState<boolean>(false);
    const [showAddServicesModal, setShowAddServicesModal] = useState<boolean>(false);

    const handleUpdateBrand = (brandId: number, updates: Partial<CarBrand>) => {
        setCarsData(prev =>
            prev.map(brand =>
                brand.id === brandId ? { ...brand, ...updates } : brand
            )
        );
    };

    const handleUpdateModel = (brandId: number, modelId: number, updates: Partial<CarBrand['models'][0]>) => {
        setCarsData(prev =>
            prev.map(brand =>
                brand.id === brandId
                    ? {
                        ...brand,
                        models: brand.models.map(model =>
                            model.id === modelId ? { ...model, ...updates } : model
                        ),
                    }
                    : brand
            )
        );
    };

    const handleUpdateService = (
        brandId: number,
        modelId: number,
        serviceId: number,
        updates: Partial<CarBrand['models'][0]['services'][0]>
    ) => {
        setCarsData(prev =>
            prev.map(brand =>
                brand.id === brandId
                    ? {
                        ...brand,
                        models: brand.models.map(model =>
                            model.id === modelId
                                ? {
                                    ...model,
                                    services: model.services.map(service =>
                                        service.id === serviceId ? { ...service, ...updates } : service
                                    ),
                                }
                                : model
                        ),
                    }
                    : brand
            )
        );
    };

    // Добавление новой марки
    const handleAddBrand = (brandName: string) => {
        const newBrandId = Math.max(...carsData.map(b => b.id), 0) + 1;
        const newBrand: CarBrand = {
            id: newBrandId,
            name: brandName,
            status: 'active',
            models: [],
        };
        setCarsData(prev => [...prev, newBrand]);
    };

    // Добавление новой модели
    const handleAddModel = (brandId: number, modelName: string, year: number) => {
        const brand = carsData.find(b => b.id === brandId);
        if (!brand) return;

        const newModelId = Math.max(...brand.models.map(m => m.id), 0) + 1;
        const newModel = {
            id: newModelId,
            name: modelName,
            year: year,
            status: 'active' as const,
            services: [],
        };

        setCarsData(prev =>
            prev.map(b =>
                b.id === brandId
                    ? { ...b, models: [...b.models, newModel] }
                    : b
            )
        );
    };

    // Добавление услуг к модели
    const handleAddServices = (
        brandId: number,
        modelId: number,
        services: { id: number; name: string; price: number }[]
    ) => {
        const brand = carsData.find(b => b.id === brandId);
        const model = brand?.models.find(m => m.id === modelId);
        if (!model) return;

        const newServices = services.map((service, index) => ({
            id: Math.max(...model.services.map(s => s.id), 0) + index + 1,
            name: service.name,
            price: service.price,
            status: 'active' as const,
        }));

        setCarsData(prev =>
            prev.map(b =>
                b.id === brandId
                    ? {
                        ...b,
                        models: b.models.map(m =>
                            m.id === modelId
                                ? { ...m, services: [...m.services, ...newServices] }
                                : m
                        ),
                    }
                    : b
            )
        );
        alert(`Добавлено ${services.length} услуг(а) для ${brand?.name} ${model.name}!`);
    };

    return (
        <div className="cars-page">
            <div className="cars-container">
                {/* Кнопка возврата */}
                <div className="cars-back-button" onClick={onBack}>
                    <span className="back-arrow">←</span>
                    <span className="back-text">Вернуться в личный кабинет</span>
                </div>

                {/* Верхние панели для добавления */}
                <div className="cabinet-header-panels">
                    <div className="cabinet-square-panel" onClick={() => setShowAddBrandModal(true)}>
                        <div className="square-content">
                            <span className="square-icon">🚗</span>
                            <span className="square-text">Добавить марку</span>
                        </div>
                    </div>

                    <div className="cabinet-square-panel" onClick={() => setShowAddModelModal(true)}>
                        <div className="square-content">
                            <span className="square-icon">🚗</span>
                            <span className="square-text">Добавить модель</span>
                        </div>
                    </div>

                    <div className="cabinet-square-panel" onClick={() => setShowAddServicesModal(true)}>
                        <div className="square-content">
                            <span className="square-icon">🔧</span>
                            <span className="square-text">Добавить услуги</span>
                        </div>
                    </div>
                </div>

                {/* Список автомобилей */}
                <CarsList
                    carsData={carsData}
                    onUpdateBrand={handleUpdateBrand}
                    onUpdateModel={handleUpdateModel}
                    onUpdateService={handleUpdateService}
                />

                {/* Модальные окна */}
                <AddBrandModal
                    isOpen={showAddBrandModal}
                    onClose={() => setShowAddBrandModal(false)}
                    onAdd={handleAddBrand}
                    existingBrands={carsData}
                />

                <AddModelModal
                    isOpen={showAddModelModal}
                    onClose={() => setShowAddModelModal(false)}
                    onAdd={handleAddModel}
                    brands={carsData}
                />

                <AddServiceModal
                    isOpen={showAddServicesModal}
                    onClose={() => setShowAddServicesModal(false)}
                    onAdd={handleAddServices}
                    brands={carsData}
                />
            </div>
        </div>
    );
}

export default CarsPage;