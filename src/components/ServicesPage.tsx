import { useState } from 'react';
import ServicesList from './ServicesList';
import AddServiceItemModal from './AddServiceItemModal';
import { servicesData as initialServicesData } from '../data/servicesData';
import { ServiceRow, ItemStatus } from '../types';

interface ServicesPageProps {
    onBack: () => void;
}

function ServicesPage({ onBack }: ServicesPageProps) {
    const [services, setServices] = useState<ServiceRow[]>(initialServicesData);
    const [showAddServiceModal, setShowAddServiceModal] = useState<boolean>(false);

    // Обновление статуса услуги
    const handleUpdateStatus = (serviceId: number, newStatus: ItemStatus) => {
        setServices(prev =>
            prev.map(service =>
                service.id === serviceId ? { ...service, status: newStatus } : service
            )
        );
    };

    // Добавление новой услуги
    const handleAddService = (serviceName: string) => {
        const newServiceId = Math.max(...services.map(s => s.id), 0) + 1;
        const newService: ServiceRow = {
            id: newServiceId,
            name: serviceName,
            status: 'active',
        };
        setServices(prev => [...prev, newService]);
        alert(`Услуга "${serviceName}" успешно добавлена!`);
    };

    return (
        <div className="services-page">
            <div className="services-container">
                {/* Кнопка возврата */}
                <div className="services-back-button" onClick={onBack}>
                    <span className="back-arrow">←</span>
                    <span className="back-text">Вернуться в личный кабинет</span>
                </div>

                <div className="cabinet-header-panels">
                    <div className="cabinet-square-panel" onClick={() => setShowAddServiceModal(true)}>
                        <div className="square-content">
                            <span className="square-icon">🔧</span>
                            <span className="square-text">Добавить услугу</span>
                        </div>
                    </div>
                </div>

                {/* Список услуг */}
                <ServicesList
                    services={services}
                    onUpdateStatus={handleUpdateStatus}
                />
            </div>

            {/* Модальное окно добавления услуги */}
            <AddServiceItemModal
                isOpen={showAddServiceModal}
                onClose={() => setShowAddServiceModal(false)}
                onAdd={handleAddService}
                existingServices={services}
            />
        </div>
    );
}

export default ServicesPage;