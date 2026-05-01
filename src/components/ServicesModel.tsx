import React from 'react';
import { SelectedModel, ServiceWithPrice } from '../types';
import './ServiceModal.css';

interface ServicesModalProps {
    model: SelectedModel;
    onClose: () => void;
}

function ServicesModal({ model, onClose }: ServicesModalProps) {
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const services: ServiceWithPrice[] = model.services || [];

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Услуги для {model.brand} {model.model} ({model.year})</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    {services.length === 0 ? (
                        <div className="placeholder">Нет доступных услуг для этого автомобиля</div>
                    ) : (
                        <div className="services-list">
                            {services.map((service) => (
                                <div key={service.id} className="service-item">
                                    <div className="service-info">
                                        <span className="service-icon">{service.icon}</span>
                                        <span className="service-name">{service.name}</span>
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