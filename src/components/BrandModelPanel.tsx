import { useState } from 'react';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import {BrandToHomepage, Model, ServiceWithPrice} from '../types';

interface BrandModelPanelProps {
    onModelSelect: (model: Model, brand: BrandToHomepage, services: ServiceWithPrice[]) => void;
    selectedBrand: BrandToHomepage | null;
    setSelectedBrand: (brand: BrandToHomepage | null) => void;
}

function BrandModelPanel({ onModelSelect, selectedBrand, setSelectedBrand }: BrandModelPanelProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    //const [selectedBrand, setSelectedBrand] = useState<BrandToHomepage | null>(null);
    const [models, setModels] = useState<Model[]>([]);

    const { data: brands, error: brandsError } = useApi<BrandToHomepage[]>(api.getBrands);

    const handleBrandClick = (brand: BrandToHomepage) => {
        setSelectedBrand(brand);
        api.getModelsByBrand(brand.id).then(setModels);
    };

    const handleModelClick = async (model: Model) => {
        if (!selectedBrand) return;

        const services: ServiceWithPrice[] = await api.getServicesForModel(selectedBrand.id, model.id);

        onModelSelect(model, selectedBrand, services);

        setIsOpen(false);
        setSelectedBrand(null);
    };

    if (brandsError) {
        return (
            <div className="brand-panel error-panel">
                <div className="panel-header">
                    <span>⚠️ Ошибка загрузки данных: {brandsError}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="brand-panel">
            <div className="panel-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="header-content">
                    <span className="panel-icon">🚗</span>
                    <span className="panel-title">Выбор автомобиля</span>
                </div>
                <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </div>

            {isOpen && (
                <div className="panel-body split">
                    <div className="left-section">
                        <h4>Марки</h4>
                        <ul className="brands-list">
                            {brands?.map((brand) => (
                                <li
                                    key={brand.id}
                                    className={`brand-item ${selectedBrand?.id === brand.id ? 'active' : ''}`}
                                    onClick={() => handleBrandClick(brand)}
                                >
                                    {brand.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="right-section">
                        <h4>Модели</h4>
                        {!selectedBrand ? (
                            <div className="placeholder">Выберите марку</div>
                        ) : models.length === 0 ? (
                            <div className="placeholder">Нет моделей для этой марки</div>
                        ) : (
                            <ul className="models-list">
                                {models.map((model) => (
                                    <li
                                        key={model.id}
                                        className="model-item"
                                        onClick={() => handleModelClick(model)}
                                    >
                                        <div className="model-info">
                                            <span className="model-name">{model.name}</span>
                                            <span className="model-year">{model.year}</span>
                                        </div>
                                        <div className="model-price">{model.price.toLocaleString()} ₽</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BrandModelPanel;