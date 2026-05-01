import { useState } from 'react';
import { brandsData, getModelsByBrand, getServicesForModel } from '../data/mockData';
import { Brand, CarModel, SelectedModel, ServiceWithPrice } from '../types';

interface BrandModelPanelProps {
    onModelSelect: (model: SelectedModel) => void;
}

function BrandModelPanel({ onModelSelect }: BrandModelPanelProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [models, setModels] = useState<CarModel[]>([]);

    const handleBrandClick = (brand: Brand) => {
        setSelectedBrand(brand);
        const brandModels = getModelsByBrand(brand.id);
        setModels(brandModels);
    };

    const handleModelClick = async (model: CarModel) => {
        if (!selectedBrand) return;

        const services: ServiceWithPrice[] = getServicesForModel(selectedBrand.id, model.id);

        onModelSelect({
            brand: selectedBrand.name,
            brandId: selectedBrand.id,
            model: model.name,
            modelId: model.id,
            year: model.year,
            basePrice: model.price,
            services: services
        });

        setIsOpen(false);
        setSelectedBrand(null);
    };

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
                            {brandsData.map((brand) => (
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