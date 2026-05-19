import React from 'react';
import {BrandToHomepage, Model, ServiceWithPrice} from '../types';
import './ServiceModal.css';

interface ServicesModalProps {
    model: Model;
    brand: BrandToHomepage | null;
    modelServices: ServiceWithPrice[];
    onClose: () => void;
}

function ServicesModal({ model, brand, modelServices, onClose }: ServicesModalProps) {
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const services: ServiceWithPrice[] = modelServices || [];

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Услуги для {brand?.brandName} {model.modelName}</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    {services.length === 0 ? (
                        <div className="placeholder">Нет доступных услуг для этого автомобиля</div>
                    ) : (
                        <div className="services-list">
                            {services.map((service) => (
                                <div key={service.serviceId} className="service-item">
                                    <div className="service-info">
                                        <span className="service-icon">🔧</span>
                                        <span className="service-name">{service.serviceName}</span>
                                    </div>
                                    <div className="service-price">{service.price.toLocaleString()} ₽</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ServicesModal;