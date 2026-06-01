import React, { useState } from 'react';
import {Brand, Model, Service, ServiceWithPrice} from '../types';
import {api} from "../services/api.ts";

interface AddServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (services: ServiceWithPrice[]) => void;
    existingBrands: Brand[] | null;
}

function AddServiceModal({ isOpen, onClose, onAdd, existingBrands }: AddServiceModalProps) {
    const [selectedBrandId, setSelectedBrandId] = useState<number>(0);
    const [selectedModelId, setSelectedModelId] = useState<number>(0);
    const [selectedServices, setSelectedServices] = useState<ServiceWithPrice[]>([]);
    const [error, setError] = useState<string>('');
    const [models, setModels] = useState<Model[]>([]);
    const [existingServices, setExistingServices] = useState<Service[]>([]);
    const [availableServices, setAvailableServices] = useState<ServiceWithPrice[]>([]);

    // Сброс состояния при открытии
    React.useEffect(() => {
        setSelectedBrandId(0);
        setSelectedModelId(0);
        setSelectedServices([]);
        setError('');
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBrandId) {
            setError('Выберите марку');
            return;
        }

        if (!selectedModelId) {
            setError('Выберите модель');
            return;
        }

        if (selectedServices.length === 0) {
            setError('Выберите хотя бы одну услугу');
            return;
        }

        // Проверка, что у всех выбранных услуг указана цена > 0
        const invalidServices = selectedServices.filter(s => s.price <= 0);
        if (invalidServices.length > 0) {
            setError('Укажите положительную цену для всех выбранных услуг');
            return;
        }

        onAdd(selectedServices);
        setSelectedServices([]);
        setError('');
        onClose();
    };

    const handleClose = () => {
        setSelectedServices([]);
        setError('');
        onClose();
    };

    const handleBrandChange = async (brandId: number) => {
        const response = await api.getModelsByBrand(brandId, "");
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const brandModels : Model[] = await response.json();
        setModels(Array.from(brandModels));
    };

    const handleModelChange = async (modelId: number) => {
        const response1 = await api.getServicesForModel(modelId, "");
        if(!response1.ok) {
            const error = await response1.json().catch(() => ({}));
            setError(error);
            return;
        }
        const servicesForModel : Service[] = await response1.json();
        setExistingServices(Array.from(servicesForModel));

        const response2 = await api.getSimpleServices("");
        if(!response2.ok) {
            const error = await response2.json().catch(() => ({}));
            setError(error);
            return;
        }
        const allServices : Service[] = await response2.json();
        const existServices: Service[] = [];
        const availServices: ServiceWithPrice[] = [];

        for (const service of allServices) {
            if (servicesForModel.find(serviceM => serviceM.serviceName === service.serviceName)) {
                existServices.push(service);
            } else {
                availServices.push({
                    priceId: 0,
                    serviceId: service.serviceId,
                    serviceName: service.serviceName,
                    modelId: 0,
                    price : 0,
                    status: "BLOCK"});
            }
        }
        setExistingServices(existServices);
        setAvailableServices(availServices);
    };

    const handleTouchService = (service: ServiceWithPrice, checked: boolean) => {
        if (checked) {
            setSelectedServices(prev => [...prev,
                {
                    priceId: 0,
                    serviceId: service.serviceId,
                    serviceName: service.serviceName,
                    modelId: selectedModelId,
                    price: 0,
                    status: "BLOCK"
                }]);
        } else {
            setSelectedServices(prev => prev.filter(s => s.serviceId !== service.serviceId));
        }
    };

    const handlePriceChange = (serviceId: number, price: number) => {
        setSelectedServices(prev =>
            prev.map(service =>
                service.serviceId === serviceId ? { ...service, price } : service
            )
        );
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="add-service-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Добавление услуг</h3>
                    <button className="modal-close" onClick={handleClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Выбор марки */}
                        <div className="form-field">
                            <label>Марка автомобиля</label>
                            <select
                                value={selectedBrandId}
                                onChange={(e) => {
                                    setSelectedBrandId(Number(e.target.value));
                                    handleBrandChange(Number(e.target.value));}}
                            >
                                <option>Выберите марку</option>
                                {existingBrands?.map((brand) => (
                                    <option key={brand.brandId} value={brand.brandId}>
                                        {brand.brandName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Выбор модели */}
                        <div className="form-field">
                            <label>Модель автомобиля</label>
                            <select
                                value={selectedModelId}
                                onChange={(e) => {
                                    setSelectedModelId(Number(e.target.value));
                                    handleModelChange(Number(e.target.value));
                                }}
                                disabled={models.length === 0}
                            >
                                <option value={0}>Выберите модель</option>
                                {models?.map((model) => (
                                    <option key={model.modelId} value={model.modelId}>
                                        {model.modelName} ({model.modelYear})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Уже добавленные услуги */}
                        {selectedModelId > 0 && existingServices.length > 0 && (
                            <div className="existing-services-info">
                                <div className="info-title">📋 Уже добавлены:</div>
                                <div className="existing-services-list">
                                    {existingServices?.map((service, idx) => (
                                        <span key={idx} className="existing-service-tag">{service.serviceName}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Выбор новых услуг с ценой */}
                        {selectedModelId > 0 && (
                            <div className="services-selection">
                                <div className="info-title">➕ Выберите услуги для добавления:</div>
                                {availableServices.length === 0 ? (
                                    <div className="no-services-message">
                                        Все доступные услуги уже добавлены для этой модели
                                    </div>
                                ) : (
                                    <div className="services-list-with-price">
                                        {availableServices.map((service) => {
                                            const isSelected = selectedServices.some(s => s.serviceId === service.serviceId);
                                            const selectedService = selectedServices.find(s => s.serviceId === service.serviceId);

                                            return (
                                                <div key={service.serviceId} className="service-price-row">
                                                    <label className="service-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={(e) => handleTouchService(service, e.target.checked)}
                                                        />
                                                        <span>{service.serviceName}</span>
                                                    </label>
                                                    {isSelected && (
                                                        <input
                                                            type="number"
                                                            className="service-price-input"
                                                            placeholder="Цена (₽)"
                                                            value={selectedService?.price || ''}
                                                            onChange={(e) => handlePriceChange(service.serviceId, Number(e.target.value))}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={handleClose}>
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="add-btn"
                        >
                            Добавить услуги
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddServiceModal;