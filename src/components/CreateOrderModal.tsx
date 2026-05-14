import React, { useState } from 'react';
import {CarModel, SelectedModel, ServiceWithPrice} from '../types';
import { api } from '../services/api';
import { CarBrand, SelectedService, TIME_SLOTS, User } from '../types';

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    brands: CarBrand[];
    currentUser?: User | null;
}

// Все доступные услуги
const allServices: SelectedService[] = [
    { id: 1, name: 'Замена масла', price: 3000 },
    { id: 2, name: 'Диагностика', price: 2000 },
    { id: 3, name: 'Шиномонтаж', price: 2500 },
    { id: 4, name: 'Ремонт подвески', price: 8000 },
    { id: 5, name: 'Покраска', price: 15000 },
    { id: 6, name: 'Замена тормозных колодок', price: 3500 },
    { id: 7, name: 'Замена ремня ГРМ', price: 5000 },
    { id: 8, name: 'Регулировка развал-схождения', price: 2000 },
    { id: 9, name: 'Замена фильтров', price: 1500 },
    { id: 10, name: 'Замена свечей зажигания', price: 2500 },
];

function CreateOrderModal({ isOpen, onClose, brands, currentUser }: CreateOrderModalProps) {
    const isAuthenticated = !!currentUser;

    // Основные поля
    const [selectedBrandId, setSelectedBrandId] = useState<number>(brands[0]?.id || 0);
    const [selectedModelId, setSelectedModelId] = useState<number>(0);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [licensePlate, setLicensePlate] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    // Поля для незарегистрированного пользователя
    const [clientName, setClientName] = useState<string>('');
    const [clientPhone, setClientPhone] = useState<string>('');

    // Услуги
    const [services, setServices] = useState<SelectedService[]>([]);
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);

    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [availableModels, setAvailableModels] = useState<CarModel[]>([]);

    // Расчет скидки
    const getDiscount = (): number => {
        if (!isAuthenticated) return 0;
        if (currentUser?.role === 'client') return 10;
        if (currentUser?.role === 'master' || currentUser?.role === 'admin') return 20;
        return 0;
    };

    const totalServicesPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const discountPercent = getDiscount();
    const discountAmount = totalServicesPrice * discountPercent / 100;
    const finalPrice = totalServicesPrice - discountAmount;

    // Сброс состояния при открытии
    React.useEffect(() => {
        if (isOpen && brands.length > 0) {
            setSelectedBrandId(brands[0]?.id || 0);
            setSelectedModelId(0);
            setYear(new Date().getFullYear());
            setLicensePlate('');
            setSelectedDate('');
            setSelectedTime('');
            setSelectedServices([]);
            setClientName('');
            setClientPhone('');
            setError('');
        }
    }, [isOpen, brands]);

    // Обновление списка моделей при выборе марки
    React.useEffect(() => {
        const loadModels = async () => {
            setError('');
            try {
                const models = await api.getModelsByBrand(selectedBrandId);
                setAvailableModels(models);
            } catch (err) {
                setError('Ошибка загрузки услуг');
                console.error(err);
            } finally {
                setSelectedModelId(0);
            }
        };

        loadModels();
    }, [selectedBrandId]);

    //Загрузка услуг
    React.useEffect(() => {
        const loadServices = async () => {
            setError('');
            try {
                const services = await api.getServicesForModel(selectedBrandId, selectedModelId);
                setServices(services);
            } catch (err) {
                setError('Ошибка загрузки услуг');
                console.error(err);
            }
        };

        loadServices();
    }, [selectedModelId]);

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        return maxDate.toISOString().split('T')[0];
    };

    const handleServiceToggle = (service: SelectedService) => {
        setSelectedServices(prev => {
            const exists = prev.some(s => s.id === service.id);
            if (exists) {
                return prev.filter(s => s.id !== service.id);
            } else {
                return [...prev, service];
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Валидация для незарегистрированных пользователей
        if (!isAuthenticated) {
            if (!clientName.trim()) {
                setError('Введите ваше имя');
                return;
            }
            if (!clientPhone.trim()) {
                setError('Введите ваш номер телефона');
                return;
            }
            const phoneRegex = /^\+?\d{10,12}$/;
            const cleanPhone = clientPhone.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone) && !/^\+\d{11}$/.test(cleanPhone)) {
                setError('Введите корректный номер телефона (например, +79991234567)');
                return;
            }
        }

        // Общая валидация
        if (!selectedModelId) {
            setError('Выберите модель автомобиля');
            return;
        }

        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear + 1) {
            setError(`Год выпуска должен быть между 1900 и ${currentYear + 1}`);
            return;
        }

        if (!licensePlate.trim()) {
            setError('Введите регистрационный номер автомобиля');
            return;
        }

        if (!selectedDate) {
            setError('Выберите дату записи');
            return;
        }

        if (!selectedTime) {
            setError('Выберите время записи');
            return;
        }

        if (selectedServices.length === 0) {
            setError('Выберите хотя бы одну услугу');
            return;
        }

        const selectedBrand = brands.find(b => b.id === selectedBrandId);
        const selectedModel = availableModels.find(m => m.id === selectedModelId);

        if (!selectedBrand || !selectedModel) {
            setError('Ошибка при выборе автомобиля');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {}, 100);
        setIsLoading(false);
    };

    const handleClose = () => {
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="create-order-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>📅 Запись на обслуживание</h3>
                    <button className="modal-close" onClick={handleClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Для незарегистрированных пользователей */}
                        {!isAuthenticated && (
                            <>
                                <div className="form-row">
                                    <div className="form-field half">
                                        <label>Ваше имя</label>
                                        <input
                                            type="text"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            placeholder="Введите имя и фамилию"
                                        />
                                    </div>
                                    <div className="form-field half">
                                        <label>Номер телефона</label>
                                        <input
                                            type="tel"
                                            value={clientPhone}
                                            onChange={(e) => setClientPhone(e.target.value)}
                                            placeholder="+7 999 123-45-67"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="form-row">
                            <div className="form-field half">
                                <label>Марка автомобиля</label>
                                <select
                                    value={selectedBrandId}
                                    onChange={(e) => setSelectedBrandId(Number(e.target.value))}
                                >
                                    <option value={0}>Выберите марку</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-field half">
                                <label>Модель автомобиля</label>
                                <select
                                    value={selectedModelId}
                                    onChange={(e) => setSelectedModelId(Number(e.target.value))}
                                    disabled={availableModels.length === 0}
                                >
                                    <option value={0}>Выберите модель</option>
                                    {availableModels.map((model) => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field half">
                                <label>Год выпуска</label>
                                <input
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    step="1"
                                />
                            </div>
                            <div className="form-field half">
                                <label>Регистрационный номер</label>
                                <input
                                    type="text"
                                    value={licensePlate}
                                    onChange={(e) => setLicensePlate(e.target.value)}
                                    placeholder="А123ВС"
                                    maxLength={12}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field half">
                                <label>Дата записи</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={getMinDate()}
                                    max={getMaxDate()}
                                />
                            </div>
                            <div className="form-field half">
                                <label>Время записи</label>
                                <select
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    disabled={!selectedDate}
                                >
                                    <option value="">Выберите время</option>
                                    {TIME_SLOTS.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Выбор услуг */}
                        <div className="services-selection-section">
                            <div className="section-title">🔧 Выберите услуги</div>
                            <div className="services-checkbox-list-order">
                                {allServices.map((service) => (
                                    <label key={service.id} className="service-checkbox-order">
                                        <input
                                            type="checkbox"
                                            checked={selectedServices.some(s => s.id === service.id)}
                                            onChange={() => handleServiceToggle(service)}
                                        />
                                        <span className="service-name-order">{service.name}</span>
                                        <span className="service-price-order">{service.price.toLocaleString()} ₽</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Сумма и скидка */}
                        {selectedServices.length > 0 && (
                            <div className="price-summary">
                                <div className="summary-row">
                                    <span>Сумма услуг:</span>
                                    <span>{totalServicesPrice.toLocaleString()} ₽</span>
                                </div>
                                {discountPercent > 0 && (
                                    <>
                                        <div className="summary-row discount">
                                            <span>Скидка {discountPercent}%:</span>
                                            <span>- {discountAmount.toLocaleString()} ₽</span>
                                        </div>
                                        <div className="summary-row total">
                                            <span>Итого к оплате:</span>
                                            <span>{finalPrice.toLocaleString()} ₽</span>
                                        </div>
                                    </>
                                )}
                                {discountPercent === 0 && isAuthenticated && (
                                    <div className="summary-row total">
                                        <span>Итого к оплате:</span>
                                        <span>{finalPrice.toLocaleString()} ₽</span>
                                    </div>
                                )}
                                {!isAuthenticated && (
                                    <div className="info-note">
                                        <span className="info-icon">💡</span>
                                        <span className="info-text">Зарегистрируйтесь и получите скидку 10% на услуги!</span>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="create-order-btn" disabled={isLoading}>
                            {isLoading ? 'Запись...' : 'Записаться'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateOrderModal;