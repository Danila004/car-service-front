import {useState} from 'react';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
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
    const [error, setError] = useState<string>("");

    const { data: brands, error: apiError } = useApi<Brand[]>(api.getBrands, "ACTIVE");

    const handleBrandClick = (brand: Brand) => {
        setSelectedBrand(brand);
        api.getModelsByBrand(brand.brandId, "ACTIVE").then(async response => {
            if(!response.ok) {
                const error = await response.json().catch(() => ({}));
                setError(error);
            }
            else {
                const brandModels : Model[] = await response.json();
                setModels(Array.from(brandModels));
            }
        });
    };

    const handleModelClick = async (model: Model) => {
        if (!selectedBrand) return;
        onModelSelect(model);
        api.getServicesForModel(model.modelId, "ACTIVE").then(async response => {
            if(!response.ok) {
                const error = await response.json().catch(() => ({}));
                setError(error);
            }
            else {
                const modelServices : ServiceWithPrice[] = await response.json();
                setServices(Array.from(modelServices));
            }
        });
    };

    if (apiError || error) {
        return (
            <div className="brand-panel error-panel">
                <div className="panel-header">
                    <span>⚠️ Ошибка загрузки данных: {apiError === null ? error : apiError}</span>
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