import { useState } from 'react';
import {Brand, Model, ServiceWithPrice} from '../types';
import {api} from "../services/api.ts";

interface CarBrandItemProps {
    brand: Brand;
    onUpdateBrand: (brand: Brand, newStatus: string) => void;
}

function CarBrandItem({ brand, onUpdateBrand}: CarBrandItemProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showBrandStatusDropdown, setShowBrandStatusDropdown] = useState<boolean>(false);
    const [showModelStatusDropdown, setShowModelStatusDropdown] = useState<number | null>(null);
    const [showServiceStatusDropdown, setShowServiceStatusDropdown] = useState<number | null>(null);
    const [editModelYear, setEditModelYear] = useState<number>(new Date().getFullYear());
    const [editServicePrice, setEditServicePrice] = useState<number>(0);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [selectedService, setSelectedService] = useState<ServiceWithPrice | null>(null);
    const [models, setModels] = useState<Model[]>([]);
    const [services, setServices] = useState<ServiceWithPrice[]>([]);
    const [error, setError] = useState<string>("");

    const getStatusLabel = (status: string) => {
        return status === 'ACTIVE' ? '✅ Активно' : '🔒 Заблокировано';
    };

    const getStatusClass = (status: string) => {
        return status === 'ACTIVE' ? 'status-active' : 'status-blocked';
    };

    // Обработчики для статуса марки
    const handleBrandStatusChange = (newStatus: string) => {
        onUpdateBrand({brandId: brand.brandId, brandName: brand.brandName, status: newStatus}, newStatus);
        setShowBrandStatusDropdown(false);
    };

    // Обработчики для статуса модели
    const handleModelStatusChange = async (model: Model, newStatus: string) => {
        const response = await api.setModel({
            modelId: model.modelId,
            modelName: model.modelName,
            brandId: model.brandId,
            modelYear: model.modelYear,
            status: newStatus
        });
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        models?.map((m) => {
            if(m.modelId === model.modelId) {
                m.status = newStatus;
            }
        })
        setShowModelStatusDropdown(null);
    };

    // Обработчики для статуса услуги
    const handleServiceStatusChange = async (price: ServiceWithPrice, newStatus: string) => {
        const response = await api.setPrice({
            priceId: price.priceId,
            serviceId: price.serviceId,
            modelId: price.modelId,
            price: price.price,
            status: newStatus
        });
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        services?.map((s) => {
            if(s.serviceId === price.serviceId) {
                s.status = newStatus;
            }
        })
        setShowServiceStatusDropdown(null);
    };

    const handleModelClick = async (model: Model) => {
        if (!selectedBrand) return;
        setSelectedModel(model);
        api.getServicesForModel(model.modelId, "").then(async response => {
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

    // Сохранение изменений услуги
    const handleSaveService = async (price: ServiceWithPrice) => {
        const response = await api.setPrice({
            priceId: price.priceId,
            serviceId: price.serviceId,
            modelId: price.modelId,
            price: editServicePrice,
            status: price.status
        });
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const updatedServices = services.map((service) =>
            service.serviceId === selectedService?.serviceId
                ? { ...service, price: editServicePrice }
                : service
        );
        setServices(updatedServices);
        setEditServicePrice(0);
        setSelectedService(null);
    };

    const handleSaveModel = async (model: Model) => {
        const response = await api.setModel({
            modelId: model.modelId,
            modelName: model.modelName,
            modelYear: editModelYear,
            brandId: selectedBrand.brandId,
            status: model.status
        });
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const updatedModels = models.map((model) =>
            model.modelId === selectedModel?.modelId
                ? { ...model, modelYear: editModelYear }
                : model
        );
        setModels(updatedModels);
        setEditModelYear(new Date().getFullYear());
        setSelectedModel(null);
    };

    const handleBrandClick = (brand: Brand) => {
        setIsExpanded(!isExpanded)
        setSelectedBrand(brand);
        api.getModelsByBrand(brand.brandId, "").then(async response => {
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

    const handleServiceClick = (service: ServiceWithPrice) => {
        setSelectedService(service);
    }

    if (error) {
        return (
            <div className="brand-panel error-panel">
                <div className="panel-header">
                    <span>⚠️ Ошибка загрузки данных: error</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`car-brand-item ${isExpanded ? 'expanded' : ''}`}>
            <div className="car-brand-header" onClick={() => handleBrandClick(brand)}>
                <div className="car-brand-info">
                    <span className="brand-name">{brand.brandName}</span>
                    <div
                        className={`brand-status ${getStatusClass(brand.status)} status-clickable`}
                        onMouseEnter={() => setShowBrandStatusDropdown(true)}
                        onMouseLeave={() => setShowBrandStatusDropdown(false)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {getStatusLabel(brand.status)}
                        {showBrandStatusDropdown && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => handleBrandStatusChange('ACTIVE')}>
                                    ✅ Активно
                                </div>
                                <div className="dropdown-item" onClick={() => handleBrandStatusChange('BLOCK')}>
                                    🔒 Заблокировано
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="expand-icon">{isExpanded ? '▲' : '▼'}</div>
            </div>

            {isExpanded && (
                <div className="car-brand-expanded">
                    {/* Левая область - список моделей */}
                    <div className="models-section">
                        <div className="section-title">📋 Модели</div>
                        <div className="models-list">
                            {models?.map((model) => (
                                <div
                                    key={model.modelId}
                                    className={`model-item ${selectedModel?.modelId === model.modelId ? 'selected' : ''}`}
                                    onClick={() => handleModelClick(model)}
                                >
                                    <div className="model-name">{model.modelName} ({model.modelYear})</div>
                                    <div
                                        className={`model-status ${getStatusClass(model.status)} status-clickable`}
                                        onMouseEnter={() => setShowModelStatusDropdown(model.modelId)}
                                        onMouseLeave={() => setShowModelStatusDropdown(null)}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {getStatusLabel(model.status)}
                                        {showModelStatusDropdown === model.modelId && (
                                            <div className="dropdown-menu">
                                                <div className="dropdown-item" onClick={() => handleModelStatusChange(model, 'ACTIVE')}>
                                                    ✅ Активно
                                                </div>
                                                <div className="dropdown-item" onClick={() => handleModelStatusChange(model, 'BLOCK')}>
                                                    🔒 Заблокировано
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Центральная область - список услуг */}
                    <div className="services-section">
                        <div className="section-title">🔧 Услуги</div>
                        {!selectedModel ? (
                            <div className="placeholder">Выберите модель</div>
                        ) : (
                            <div className="services-list">
                                {services?.map((service) => (
                                    <div
                                        key={service.serviceId}
                                        className={`service-item ${selectedService?.serviceId === service.serviceId ? 'selected' : ''}`}
                                        onClick={() => handleServiceClick(service)}
                                    >
                                        <div className="service-name">{service.serviceName}</div>
                                        <div className="service-price">{service.price.toLocaleString()} ₽</div>
                                        <div
                                            className={`service-status ${getStatusClass(service.status)} status-clickable`}
                                            onMouseEnter={() => setShowServiceStatusDropdown(service.serviceId)}
                                            onMouseLeave={() => setShowServiceStatusDropdown(null)}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {getStatusLabel(service.status)}
                                            {showServiceStatusDropdown === service.serviceId && (
                                                <div className="dropdown-menu">
                                                    <div className="dropdown-item" onClick={() => handleServiceStatusChange(service, 'ACTIVE')}>
                                                        ✅ Активно
                                                    </div>
                                                    <div className="dropdown-item" onClick={() => handleServiceStatusChange(service, 'BLOCK')}>
                                                        🔒 Заблокировано
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Правая область - редактирование услуги */}
                    <div className="edit-section">
                        <div className="section-title">✏️ Редактирование услуги и модели</div>
                        {!selectedService && !selectedModel? (
                            <div className="placeholder">Выберите услугу или модель</div>
                        ) : (
                            <div className="edit-form">
                                {selectedModel && (
                                    <>
                                        <div className="edit-field">
                                            <label>Год модели</label>
                                            <input
                                                type="number"
                                                value={editModelYear}
                                                onChange={(e) => setEditModelYear(Number(e.target.value))}/>
                                        </div>
                                        <button className="save-btn" onClick={() => handleSaveModel(selectedModel)}>
                                            Сохранить
                                        </button>
                                    </>
                                )}

                                {selectedService && (
                                    <>
                                        <div className="edit-field">
                                            <label>Цена (₽)</label>
                                            <input
                                                type="number"
                                                value={editServicePrice}
                                                onChange={(e) => setEditServicePrice(Number(e.target.value))}/>
                                        </div>
                                        <button className="save-btn" onClick={() => handleSaveService(selectedService)}>
                                            Сохранить
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CarBrandItem;