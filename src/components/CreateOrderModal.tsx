import React, { useState } from 'react';
import {Brand, CreateOrder, DateSlot, Model, ServiceWithPrice} from '../types';
import { api } from '../services/api';
import { User } from '../types';

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser?: User | null;
}

function CreateOrderModal({ isOpen, onClose, currentUser }: CreateOrderModalProps) {
    const isAuthenticated = !!currentUser;

    // Основные поля
    const [selectedBrandId, setSelectedBrandId] = useState<number>(0);
    const [selectedModelId, setSelectedModelId] = useState<number>(0);
    const [models, setModels] = useState<Model[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [dateSlots, setDateSlots] = useState<DateSlot[]>([]);
    const [year, setYear] = useState<number>(0);
    const [licensePlate, setLicensePlate] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTimeId, setSelectedTimeId] = useState<number>(0);

    // Поля для незарегистрированного пользователя
    const [clientName, setClientName] = useState<string>('');
    const [clientPhone, setClientPhone] = useState<string>('');

    // Услуги
    const [services, setServices] = useState<ServiceWithPrice[]>([]);
    const [selectedServices, setSelectedServices] = useState<ServiceWithPrice[]>([]);
    const [error, setError] = useState<string>('');

    // Расчет скидки
    const getDiscount = (): number => {
        if (!isAuthenticated) return 0;
        if (currentUser?.userType === 'CLIENT') return 10;
        if (currentUser?.userType === 'MASTER' || currentUser?.userType === 'ADMIN') return 20;
        return 0;
    };

    const totalServicesPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const discountPercent = getDiscount();
    const discountAmount = totalServicesPrice * discountPercent / 100;
    const finalPrice = totalServicesPrice - discountAmount;

    // Сброс состояния при открытии
    React.useEffect(() => {
        const handlePanelClick = async () => {
            const response = await api.getSimpleBrands( "?status=ACTIVE");
            if(!response.ok) {
                const error = await response.json().catch(() => ({}));
                setError(error);
                return;
            }
            const brands : Brand[] = await response.json();
            setBrands(brands);
        };
        if (isOpen) {
            setYear(new Date().getFullYear());
            setLicensePlate('');
            setSelectedDate('');
            setSelectedTimeId(0);
            setSelectedServices([]);
            setClientName('');
            setClientPhone('');
            setError('');
            handlePanelClick();
        }
    }, [isOpen]);

    // Обновление списка моделей при выборе марки
    React.useEffect(() => {
        const loadModels = async () => {
            setError('');
            const response = await api.getModelsByBrand(selectedBrandId, "?status=ACTIVE");
            if(!response.ok) {
                const error = await response.json().catch(() => ({}));
                setError(error);
                return;
            }
            const models : Model[] = await response.json();
            setModels(models);
        };
        if(selectedBrandId !== 0)
            loadModels();
    }, [selectedBrandId]);

    //Загрузка услуг
    React.useEffect(() => {
        const loadServices = async () => {
            setError('');
            const response = await api.getServicesForModel(selectedModelId, "?status=ACTIVE");
            if(!response.ok) {
                const error = await response.json().catch(() => ({}));
                setError(error);
                return;
            }
            const services = await response.json();
            setServices(services);
        };
        if(selectedModelId !== 0)
            loadServices();
    }, [selectedModelId]);

    React.useEffect(() => {
        const loadDateSlots = async () => {
            setError('');
            const response = await api.getDateSlots("?date=" + selectedDate);
            if(!response.ok) {
                const error = await response.json().catch(() => ({}));
                setError(error);
                return;
            }
            const dateSlots: DateSlot[] = await response.json();
            setDateSlots(dateSlots);
        };
        if(selectedDate)
            loadDateSlots();
    }, [selectedDate]);

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        return maxDate.toISOString().split('T')[0];
    };

    const handleServiceToggle = (service: ServiceWithPrice) => {
        setSelectedServices(prev => {
            const exists = prev.some(s => s.serviceId === service.serviceId);
            if (exists) {
                return prev.filter(s => s.serviceId !== service.serviceId);
            } else {
                return [...prev, service];
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
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

        if (selectedTimeId === 0) {
            setError('Выберите время записи');
            return;
        }

        if (selectedServices.length === 0) {
            setError('Выберите хотя бы одну услугу');
            return;
        }

        if (selectedBrandId === 0 || selectedModelId === 0) {
            setError('Ошибка при выборе автомобиля');
            return;
        }

        const newOrder: CreateOrder = {
            orderId: 0,
            brandName: brands.find(brand => brand.brandId === selectedBrandId)?.brandName,
            modelName: models.find(model => model.modelId === selectedModelId)?.modelName,
            orderStatus: 'REGISTRED',
            price: finalPrice,
            stateNumber: licensePlate,
            visitDate: selectedDate,
            visitTime: dateSlots.find(ds => ds.dateSlotId === selectedTimeId)?.visitTime,
            authUserId: currentUser?.authUserId ?? null,
            userName: currentUser?.userName ?? clientName,
            userPhoneNumber: currentUser?.phoneNumber ?? clientPhone,
            masterId: dateSlots.find(ds => ds.dateSlotId === selectedTimeId)?.masterId
        };
        const services = selectedServices.map(s => s.serviceId);

        const response = await api.createOrder(newOrder, services);
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
        }
        handleClose();
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
                                    onChange={(e) => {
                                        setSelectedBrandId(Number(e.target.value));
                                    }}
                                >
                                    <option value={0}>Выберите марку</option>
                                    {brands.map((brand) => (
                                        <option key={brand.brandId} value={brand.brandId}>
                                            {brand.brandName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-field half">
                                <label>Модель автомобиля</label>
                                <select
                                    value={selectedModelId}
                                    onChange={(e) => {
                                        setSelectedModelId(Number(e.target.value));
                                    }}
                                    disabled={models.length === 0}
                                >
                                    <option value={0}>Выберите модель</option>
                                    {models.map((model) => (
                                        <option key={model.modelId} value={model.modelId}>
                                            {model.modelName}
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
                                    value={selectedTimeId}
                                    onChange={(e) => setSelectedTimeId(Number(e.target.value))}
                                    disabled={!selectedDate}
                                >
                                    <option value="">Выберите время</option>
                                    {dateSlots.map((time) => (
                                        <option key={time.dateSlotId} value={time.dateSlotId}>
                                            {time.visitTime}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Выбор услуг */}
                        <div className="services-selection-section">
                            <div className="section-title">🔧 Выберите услуги</div>
                            <div className="services-checkbox-list-order">
                                {services.map((service) => (
                                    <label key={service.serviceId} className="service-checkbox-order">
                                        <input
                                            type="checkbox"
                                            checked={selectedServices.some(s => s.serviceId === service.serviceId)}
                                            onChange={() => handleServiceToggle(service)}
                                        />
                                        <span className="service-name-order">{service.serviceName}</span>
                                        <span className="service-price-order">{service.price} ₽</span>
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
                </form>
            </div>
        </div>
    );
}

export default CreateOrderModal;