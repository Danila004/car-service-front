import React, { useState, useEffect } from 'react';
import { CarBrand } from '../types';

interface AddServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (brandId: number, modelId: number, services: { id: number; name: string; price: number }[]) => void;
    brands: CarBrand[];
}

// Базовая библиотека всех возможных услуг
const allAvailableServices = [
    { id: 1, name: 'Замена масла' },
    { id: 2, name: 'Диагностика' },
    { id: 3, name: 'Шиномонтаж' },
    { id: 4, name: 'Ремонт подвески' },
    { id: 5, name: 'Покраска' },
    { id: 6, name: 'Замена тормозных колодок' },
    { id: 7, name: 'Замена ремня ГРМ' },
    { id: 8, name: 'Регулировка развал-схождения' },
    { id: 9, name: 'Замена фильтров' },
    { id: 10, name: 'Замена свечей зажигания' },
    { id: 11, name: 'Замена аккумулятора' },
    { id: 12, name: 'Ремонт кондиционера' },
    { id: 13, name: 'Замена жидкости охлаждения' },
    { id: 14, name: 'Компьютерная диагностика' },
    { id: 15, name: 'Чистка инжектора' },
];

interface SelectedService {
    id: number;
    name: string;
    price: number;
}

function AddServiceModal({ isOpen, onClose, onAdd, brands }: AddServiceModalProps) {
    const [selectedBrandId, setSelectedBrandId] = useState<number>(brands[0]?.id || 0);
    const [selectedModelId, setSelectedModelId] = useState<number>(0);
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
    const [error, setError] = useState<string>('');
    const [availableModels, setAvailableModels] = useState<CarBrand['models']>([]);

    // Сброс состояния при открытии
    useEffect(() => {
        if (isOpen && brands.length > 0) {
            setSelectedBrandId(brands[0]?.id || 0);
            setSelectedModelId(0);
            setSelectedServices([]);
            setError('');
        }
    }, [isOpen, brands]);

    // Обновление списка моделей при выборе марки
    useEffect(() => {
        const selectedBrand = brands.find(b => b.id === selectedBrandId);
        setAvailableModels(selectedBrand?.models || []);
        setSelectedModelId(0);
        setSelectedServices([]);
    }, [selectedBrandId, brands]);

    // Получение уже добавленных услуг для выбранной модели
    const getExistingServiceIds = (): number[] => {
        const brand = brands.find(b => b.id === selectedBrandId);
        const model = brand?.models.find(m => m.id === selectedModelId);
        return model?.services.map(s => s.id) || [];
    };

    // Доступные услуги (все, кроме уже добавленных)
    const getAvailableServices = () => {
        const existingIds = getExistingServiceIds();
        return allAvailableServices.filter(service => !existingIds.includes(service.id));
    };

    const handleServiceToggle = (serviceId: number, serviceName: string, checked: boolean) => {
        if (checked) {
            setSelectedServices(prev => [...prev, { id: serviceId, name: serviceName, price: 0 }]);
        } else {
            setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
        }
    };

    const handlePriceChange = (serviceId: number, price: number) => {
        setSelectedServices(prev =>
            prev.map(service =>
                service.id === serviceId ? { ...service, price } : service
            )
        );
    };

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
            setError('Укажите цену для всех выбранных услуг');
            return;
        }

        onAdd(selectedBrandId, selectedModelId, selectedServices);
        setSelectedServices([]);
        setError('');
        onClose();
    };

    const handleClose = () => {
        setSelectedServices([]);
        setError('');
        onClose();
    };

    const existingServiceNames = (): string[] => {
        const existingIds = getExistingServiceIds();
        return allAvailableServices
            .filter(s => existingIds.includes(s.id))
            .map(s => s.name);
    };

    const availableServices = getAvailableServices();

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
                                onChange={(e) => setSelectedBrandId(Number(e.target.value))}
                            >
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}шы
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Выбор модели */}
                        <div className="form-field">
                            <label>Модель автомобиля</label>
                            <select
                                value={selectedModelId}
                                onChange={(e) => setSelectedModelId(Number(e.target.value))}
                                disabled={availableModels.length === 0}
                            >
                                <option value={0}>Выберите модель</option>
                                {availableModels.map((model) => (
                                    <option key={model.id} value={model.id}>
                                        {model.name} ({model.year})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Уже добавленные услуги */}
                        {selectedModelId > 0 && existingServiceNames().length > 0 && (
                            <div className="existing-services-info">
                                <div className="info-title">📋 Уже добавлены:</div>
                                <div className="existing-services-list">
                                    {existingServiceNames().map((service, idx) => (
                                        <span key={idx} className="existing-service-tag">
                      {service}
                    </span>
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
                                            const isSelected = selectedServices.some(s => s.id === service.id);
                                            const selectedService = selectedServices.find(s => s.id === service.id);

                                            return (
                                                <div key={service.id} className="service-price-row">
                                                    <label className="service-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={(e) => handleServiceToggle(service.id, service.name, e.target.checked)}
                                                        />
                                                        <span>{service.name}</span>
                                                    </label>
                                                    {isSelected && (
                                                        <input
                                                            type="number"
                                                            className="service-price-input"
                                                            placeholder="Цена (₽)"
                                                            value={selectedService?.price || ''}
                                                            onChange={(e) => handlePriceChange(service.id, Number(e.target.value))}
                                                            min="1"
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