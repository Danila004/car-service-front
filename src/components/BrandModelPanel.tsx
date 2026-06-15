import {useState} from 'react';
import { api } from '../services/api';
import {Brand, Model, ServiceWithPrice} from '../types';

interface BrandModelPanelProps {
    onModelSelect: (model: Model) => void;
    selectedBrand: Brand | null;
    setSelectedBrand: (brand: Brand | null) => void;
    setServices: (services: ServiceWithPrice[]) => void;
}

function BrandModelPanel({ onModelSelect, selectedBrand, setSelectedBrand, setServices }: BrandModelPanelProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [models, setModels] = useState<Model[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [error, setError] = useState<string>("");

    const handlePanelClick = async () => {
        const response = await api.getSimpleBrands( "?status=ACTIVE");
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const brands : Brand[] = await response.json();
        setBrands(brands);
        setIsOpen(!isOpen);
    };

    const handleBrandClick = async (brand: Brand) => {
        setSelectedBrand(brand);
        const response = await api.getModelsByBrand(brand.brandId, "?status=ACTIVE");
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
        }
        const brandModels : Model[] = await response.json();
        setModels(brandModels);
    };

    const handleModelClick = async (model: Model) => {
        if (!selectedBrand) return;
        onModelSelect(model);
        const response = await api.getServicesForModel(model.modelId, "?status=ACTIVE");
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
        }
        const modelServices : ServiceWithPrice[] = await response.json();
        setServices(modelServices);
    };

    if (error) {
        return (
            <div className="brand-panel error-panel">
                <div className="panel-header">
                    <span>⚠️ Ошибка загрузки данных: {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="brand-panel">
            <div className="panel-header" onClick={() => handlePanelClick()}>
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
                                    key={brand.brandId}
                                    className={`brand-item ${selectedBrand?.brandId === brand.brandId ? 'active' : ''}`}
                                    onClick={() => handleBrandClick(brand)}
                                >
                                    {brand.brandName}
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
                                {models?.map((model) => (
                                    <li
                                        key={model.modelId}
                                        className="model-item"
                                        onClick={() => handleModelClick(model)}
                                    >
                                        <div className="model-info">
                                            <span className="model-name">{model.modelName}</span>
                                        </div>
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