import {Brand} from '../types';
import CarBrandItem from './CarBrandItem';
import {useApi} from "../hooks/useApi.ts";
import {api} from "../services/api.ts";
import {useState} from "react";
import AddBrandModal from "./AddBrandModal.tsx";
import AddModelModal from "./AddModelModal.tsx";
import AddServiceModal from "./AddServiceModal.tsx";

interface CarListProps {
    onBack: () => void;
}

function CarsList({onBack}: CarListProps) {
    const { data: brands, error: apiError } = useApi<Brand[]>(api.getBrands, "");
    const [showAddBrandModal, setShowAddBrandModal] = useState<boolean>(false);
    const [showAddModelModal, setShowAddModelModal] = useState<boolean>(false);
    const [showAddServicesModal, setShowAddServicesModal] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    /*
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
    };*/

    const handleUpdateBrand = (brandToChange: Brand, newStatus: string) => {
        brands?.map((brand) => {
            if(brand.brandId === brandToChange.brandId)
                brand.status = newStatus;
        })
    }

    if (apiError) {
        return (
            <div className="brand-panel error-panel">
                <div className="panel-header">
                    <span>⚠️ Ошибка загрузки данных: {apiError}</span>
                </div>
            </div>
        );
    }

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

                <div className="cars-list-container">
                    <div className="cars-list-title">🚗 Автомобили</div>
                    <div className="cars-list">
                        {brands?.map((brand) => (
                            <CarBrandItem
                                key={brand.brandId}
                                brand={brand}
                                onUpdateBrand={handleUpdateBrand}
                            />
                        ))}
                    </div>
                </div>

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

export default CarsList;