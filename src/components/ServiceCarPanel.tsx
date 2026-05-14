import React, {useState} from 'react';
import { api } from '../services/api';
import { useApi } from '../hooks/useApi';
import { Service, CarWithServicePrice } from '../types';

function ServiceCarPanel() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [carsWithDetails, setCarsWithDetails] = useState<CarWithServicePrice[]>([]);
    const [loadingCars, setLoadingCars] = useState<boolean>(false);

    const { data: services, loading: loadingServices, error: servicesError } = useApi<Service[]>(api.getServices);

    React.useEffect(() => {
        if (selectedService && selectedService.availableCars && selectedService.availableCars.length > 0) {
            //setLoadingCars(true);
            setCarsWithDetails([]);

            api.getCarsForService(selectedService.availableCars)
                .then(cars => {
                    setCarsWithDetails(cars);
                })
                .catch(error => {
                    console.error('Ошибка загрузки автомобилей:', error);
                })
                .finally(() => {
                    //setLoadingCars(false);
                });
        } else {
            setCarsWithDetails([]);
        }
    }, [selectedService]);

    const handleServiceClick = (service: Service) => {
        setSelectedService(service);
        /*const cars = getCarsForService(service.availableCars);
        setCarsWithDetails(cars);*/
    };

    if (servicesError) {
        return (
            <div className="service-panel error-panel">
                <div className="panel-header">
                    <span>⚠️ Ошибка загрузки услуг: {servicesError}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="service-panel">
            <div className="panel-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="header-content">
                    <span className="panel-icon">🔧</span>
                    <span className="panel-title">Услуги</span>
                </div>
                <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </div>

            {isOpen && (
                <div className="panel-body split">
                    <div className="left-section">
                        <h4>Услуги</h4>
                        <ul className="services-list-panel">
                            {services?.map((service) => (
                                <li
                                    key={service.id}
                                    className={`service-item-panel ${selectedService?.id === service.id ? 'active' : ''}`}
                                    onClick={() => handleServiceClick(service)}
                                >
                                    <span className="service-icon">{service.icon}</span>
                                    <span className="service-name">{service.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="right-section">
                        <h4>Доступные автомобили</h4>
                        {!selectedService ? (
                            <div className="placeholder">Выберите услугу</div>
                        ) : carsWithDetails.length === 0 ? (
                            <div className="placeholder">Нет доступных автомобилей для этой услуги</div>
                        ) : (
                            <ul className="cars-list">
                                {carsWithDetails.map((car, idx) => (
                                    <li key={idx} className="car-item">
                                        <div className="car-info">
                                            <span className="car-brand">{car.brand}</span>
                                            <span className="car-model">{car.model}</span>
                                            <span className="car-year">{car.year}</span>
                                        </div>
                                        <div className="car-price">{car.servicePrice.toLocaleString()} ₽</div>
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

export default ServiceCarPanel;