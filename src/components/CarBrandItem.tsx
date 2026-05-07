import { useState } from 'react';
import { CarBrand, ItemStatus } from '../types';

interface CarBrandItemProps {
    brand: CarBrand;
    onUpdateBrand: (brandId: number, updates: Partial<CarBrand>) => void;
    onUpdateModel: (brandId: number, modelId: number, updates: Partial<CarBrand['models'][0]>) => void;
    onUpdateService: (
        brandId: number,
        modelId: number,
        serviceId: number,
        updates: Partial<CarBrand['models'][0]['services'][0]>
    ) => void;
}

function CarBrandItem({ brand, onUpdateBrand, onUpdateModel, onUpdateService }: CarBrandItemProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showBrandStatusDropdown, setShowBrandStatusDropdown] = useState<boolean>(false);
    const [showModelStatusDropdown, setShowModelStatusDropdown] = useState<number | null>(null);
    const [showServiceStatusDropdown, setShowServiceStatusDropdown] = useState<number | null>(null);
    const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
    const [editServiceName, setEditServiceName] = useState<string>('');
    const [editServicePrice, setEditServicePrice] = useState<number>(0);
    const [editServiceStatus, setEditServiceStatus] = useState<ItemStatus>('active');

    const getStatusLabel = (status: ItemStatus) => {
        return status === 'active' ? '✅ Активно' : '🔒 Заблокировано';
    };

    const getStatusClass = (status: ItemStatus) => {
        return status === 'active' ? 'status-active' : 'status-blocked';
    };

    // Обработчики для статуса марки
    const handleBrandStatusChange = (newStatus: ItemStatus) => {
        onUpdateBrand(brand.id, { status: newStatus });
        setShowBrandStatusDropdown(false);
    };

    // Обработчики для статуса модели
    const handleModelStatusChange = (modelId: number, newStatus: ItemStatus) => {
        onUpdateModel(brand.id, modelId, { status: newStatus });
        setShowModelStatusDropdown(null);
    };

    // Обработчики для статуса услуги
    const handleServiceStatusChange = (serviceId: number, newStatus: ItemStatus) => {
        if (selectedModelId) {
            onUpdateService(brand.id, selectedModelId, serviceId, { status: newStatus });
            if (selectedServiceId === serviceId) {
                setEditServiceStatus(newStatus);
            }
        }
        setShowServiceStatusDropdown(null);
    };

    // Выбор модели
    const handleSelectModel = (modelId: number) => {
        setSelectedModelId(modelId);
        setSelectedServiceId(null);
    };

    // Выбор услуги
    const handleSelectService = (service: CarBrand['models'][0]['services'][0]) => {
        setSelectedServiceId(service.id);
        setEditServiceName(service.name);
        setEditServicePrice(service.price);
        setEditServiceStatus(service.status);
    };

    // Сохранение изменений услуги
    const handleSaveService = () => {
        if (selectedModelId && selectedServiceId) {
            onUpdateService(brand.id, selectedModelId, selectedServiceId, {
                name: editServiceName,
                price: editServicePrice,
                status: editServiceStatus,
            });
            alert('Услуга обновлена!');
        }
    };

    const selectedModel = brand.models.find(m => m.id === selectedModelId);
    const selectedService = selectedModel?.services.find(s => s.id === selectedServiceId);

    return (
        <div className={`car-brand-item ${isExpanded ? 'expanded' : ''}`}>
            <div className="car-brand-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="car-brand-info">
                    <span className="brand-name">{brand.name}</span>
                    <div
                        className={`brand-status ${getStatusClass(brand.status)} status-clickable`}
                        onMouseEnter={() => setShowBrandStatusDropdown(true)}
                        onMouseLeave={() => setShowBrandStatusDropdown(false)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {getStatusLabel(brand.status)}
                        {showBrandStatusDropdown && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => handleBrandStatusChange('active')}>
                                    ✅ Активно
                                </div>
                                <div className="dropdown-item" onClick={() => handleBrandStatusChange('blocked')}>
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
                            {brand.models.map((model) => (
                                <div
                                    key={model.id}
                                    className={`model-item ${selectedModelId === model.id ? 'selected' : ''}`}
                                    onClick={() => handleSelectModel(model.id)}
                                >
                                    <div className="model-name">{model.name}</div>
                                    <div
                                        className={`model-status ${getStatusClass(model.status)} status-clickable`}
                                        onMouseEnter={() => setShowModelStatusDropdown(model.id)}
                                        onMouseLeave={() => setShowModelStatusDropdown(null)}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {getStatusLabel(model.status)}
                                        {showModelStatusDropdown === model.id && (
                                            <div className="dropdown-menu">
                                                <div className="dropdown-item" onClick={() => handleModelStatusChange(model.id, 'active')}>
                                                    ✅ Активно
                                                </div>
                                                <div className="dropdown-item" onClick={() => handleModelStatusChange(model.id, 'blocked')}>
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
                                {selectedModel.services.map((service) => (
                                    <div
                                        key={service.id}
                                        className={`service-item ${selectedServiceId === service.id ? 'selected' : ''}`}
                                        onClick={() => handleSelectService(service)}
                                    >
                                        <div className="service-name">{service.name}</div>
                                        <div className="service-price">{service.price.toLocaleString()} ₽</div>
                                        <div
                                            className={`service-status ${getStatusClass(service.status)} status-clickable`}
                                            onMouseEnter={() => setShowServiceStatusDropdown(service.id)}
                                            onMouseLeave={() => setShowServiceStatusDropdown(null)}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {getStatusLabel(service.status)}
                                            {showServiceStatusDropdown === service.id && (
                                                <div className="dropdown-menu">
                                                    <div className="dropdown-item" onClick={() => handleServiceStatusChange(service.id, 'active')}>
                                                        ✅ Активно
                                                    </div>
                                                    <div className="dropdown-item" onClick={() => handleServiceStatusChange(service.id, 'blocked')}>
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
                        <div className="section-title">✏️ Редактирование услуги</div>
                        {!selectedService ? (
                            <div className="placeholder">Выберите услугу</div>
                        ) : (
                            <div className="edit-form">
                                <div className="edit-field">
                                    <label>Название услуги</label>
                                    <input
                                        type="text"
                                        value={editServiceName}
                                        onChange={(e) => setEditServiceName(e.target.value)}
                                    />
                                </div>
                                <div className="edit-field">
                                    <label>Цена (₽)</label>
                                    <input
                                        type="number"
                                        value={editServicePrice}
                                        onChange={(e) => setEditServicePrice(Number(e.target.value))}
                                    />
                                </div>

                                <button className="save-btn" onClick={handleSaveService}>
                                    Сохранить
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CarBrandItem;