import { useState } from 'react';
import { ServiceRow, ItemStatus } from '../types';

interface ServiceItemProps {
    service: ServiceRow;
    onUpdateStatus: (serviceId: number, newStatus: ItemStatus) => void;
}

function ServiceItem({ service, onUpdateStatus }: ServiceItemProps) {
    const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);

    const getStatusLabel = (status: ItemStatus) => {
        return status === 'active' ? '✅ Активно' : '🔒 Заблокировано';
    };

    const getStatusClass = (status: ItemStatus) => {
        return status === 'active' ? 'status-active' : 'status-blocked';
    };

    const handleStatusChange = (newStatus: ItemStatus) => {
        onUpdateStatus(service.id, newStatus);
        setShowStatusDropdown(false);
    };

    return (
        <div className="service-item-row">
            <div className="service-name">{service.name}</div>
            <div
                className={`service-status-badge ${getStatusClass(service.status)} status-clickable`}
                onMouseEnter={() => setShowStatusDropdown(true)}
                onMouseLeave={() => setShowStatusDropdown(false)}
            >
                {getStatusLabel(service.status)}
                {showStatusDropdown && (
                    <div className="dropdown-menu">
                        <div className="dropdown-item" onClick={() => handleStatusChange('active')}>
                            ✅ Активно
                        </div>
                        <div className="dropdown-item" onClick={() => handleStatusChange('blocked')}>
                            🔒 Заблокировано
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServiceItem;