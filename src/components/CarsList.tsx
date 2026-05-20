import {AddServiceForModel, Brand} from '../types';
import CarBrandItem from './CarBrandItem';
import {useApi} from "../hooks/useApi.ts";
import {api} from "../services/api.ts";
import {useEffect, useState} from "react";
import AddBrandModal from "./AddBrandModal.tsx";
import AddModelModal from "./AddModelModal.tsx";
import AddServiceModal from "./AddServiceModal.tsx";

interface CarListProps {
    onBack: () => void;
}

function CarsList({onBack}: CarListProps) {
    const { data: apiBrands, error: apiError } = useApi<Brand[]>(api.getBrands, "?status=");
    const [showAddBrandModal, setShowAddBrandModal] = useState<boolean>(false);
    const [showAddModelModal, setShowAddModelModal] = useState<boolean>(false);
    const [showAddServicesModal, setShowAddServicesModal] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [brands, setBrands] = useState<Brand[] | null>([]);

    useEffect(() => {
        setBrands(apiBrands);
    }, [apiBrands]);

    // Добавление новой марки
    const handleAddBrand = (brandName: string) => {

        const newBrand: Brand = {
            brandId: 0,
            brandName: brandName,
            status: 'BLOCK'
        };
        setBrands(prev => [...(prev ?? []), newBrand].sort((a, b) =>
            a.brandName.localeCompare(b.brandName)));
    };

    // Добавление новой модели
    const handleAddModel = (brandId: number, modelName: string, year: number) => {
        const newModel = {
            modelId: 0,
            name: modelName,
            year: year,
            status: 'BLOCK',
            brandId: brandId
        };

    };

    // Добавление услуг к модели
    const handleAddServices = (service: AddServiceForModel) => {

    };

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
                    existingBrands={brands}
                />

                <AddModelModal
                    isOpen={showAddModelModal}
                    onClose={() => setShowAddModelModal(false)}
                    onAdd={handleAddModel}
                    existingBrands={brands}
                />

                <AddServiceModal
                    isOpen={showAddServicesModal}
                    onClose={() => setShowAddServicesModal(false)}
                    onAdd={handleAddServices}
                    existingBrands={brands}
                />

            </div>
        </div>
    );
}

export default CarsList;