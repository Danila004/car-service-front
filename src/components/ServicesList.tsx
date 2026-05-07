import { ServiceRow, ItemStatus } from '../types';
import ServiceItemRow from './ServiceItem';

interface ServicesListProps {
    services: ServiceRow[];
    onUpdateStatus: (serviceId: number, newStatus: ItemStatus) => void;
}

function ServicesList({ services, onUpdateStatus }: ServicesListProps) {
    return (
        <div className="services-list-container">
            <div className="services-list-title">🔧 Услуги</div>
            <div className="services-list">
                {services.map((service) => (
                    <ServiceItemRow
                        key={service.id}
                        service={service}
                        onUpdateStatus={onUpdateStatus}
                    />
                ))}
            </div>
        </div>
    );
}

export default ServicesList;