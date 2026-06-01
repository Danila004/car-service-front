import {Service} from '../types';
import {useEffect, useState} from "react";
import {useApi} from "../hooks/useApi.ts";
import {api} from "../services/api.ts";
import AddServiceItemModal from "./AddServiceItemModal.tsx";

interface ServicesListProps {
    onBack: () => void;
}

function ServicesList({ onBack }: ServicesListProps) {
    const { data: apiServices, error: apiError } = useApi<Service[]>(api.getServices, "?status=");
    const [services, setServices] = useState<Service[] | null>([]);
    const [showAddServiceModal, setShowAddServiceModal] = useState<boolean>(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState<number>(0);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        setServices(apiServices);
    }, [apiServices]);

    const getStatusLabel = (status: string) => {
        return status === 'ACTIVE' ? '✅ Активно' : '🔒 Заблокировано';
    };

    const getStatusClass = (status: string) => {
        return status === 'ACTIVE' ? 'status-active' : 'status-blocked';
    };

    // Обновление статуса услуги
    const handleUpdateStatus = async (service: Service, newStatus: string) => {
        const response = await api.setService({
            serviceId: service.serviceId,
            serviceName: service.serviceName,
            status: newStatus
        });
        console.log(response)
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        services?.map(s => {
            if (s.serviceId === service.serviceId)
                s.status = newStatus;
        })
        setShowStatusDropdown(0);
    };

    // Добавление новой услуги
    const handleAddService = async (serviceName: string) => {
        const newService: Service = {
            serviceId: 0,
            serviceName: serviceName,
            status: 'BLOCK',
        };
        const response : Response = await api.addService(newService);
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const newServiceWithId : Service = await response.json();
        setServices(prev => [...(prev ?? []), newServiceWithId]);
    };

    if (apiError) {
        return (
            <div className="brand-panel error-panel">
                <div className="panel-header">
                    <span>⚠️ Ошибка загрузки данных: {apiError}</span>
                </div>
            </div>
        );
    }

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

                <div className="services-list-container">
                    <div className="services-list-title">🔧 Услуги</div>
                    <div className="services-list">
                        {services?.map((service) => (
                            <div className="service-item-row">
                                <div className="service-name">{service.serviceName}</div>
                                <div
                                    className={`service-status-badge ${getStatusClass(service.status)} status-clickable`}
                                    onMouseEnter={() => setShowStatusDropdown(service.serviceId)}
                                    onMouseLeave={() => setShowStatusDropdown(0)}
                                >
                                    {getStatusLabel(service.status)}
                                    {showStatusDropdown === service.serviceId && (
                                        <div className="dropdown-menu">
                                            <div className="dropdown-item" onClick={() => handleUpdateStatus(service,'ACTIVE')}>
                                                ✅ Активно
                                            </div>
                                            <div className="dropdown-item" onClick={() => handleUpdateStatus(service,'BLOCK')}>
                                                🔒 Заблокировано
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
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

export default ServicesList;