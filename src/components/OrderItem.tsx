import { useState } from 'react';
import { Order } from '../types';

interface OrderItemProps {
    order: Order;
    userRole: 'client' | 'master' | 'admin';
    onCancelOrder?: (orderId: number) => void;
}

function OrderItem({ order, userRole, onCancelOrder }: OrderItemProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isCancelling, setIsCancelling] = useState<boolean>(false);

    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    };

    const getStatusText = (status: string) => {
        const statusMap = {
            pending: '⏳ Ожидает',
            in_progress: '🔧 В работе',
            completed: '✅ Выполнен',
            cancelled: '❌ Отменён'
        };
        return statusMap[status as keyof typeof statusMap] || status;
    };

    const handleCancel = () => {
        setIsCancelling(true);
        if (onCancelOrder) {
            onCancelOrder(order.id);
        }
    };

    const currentStatus = isCancelling ? 'cancelled' : order.status;
    const showCancelButton = currentStatus === 'pending';

    return (
        <div className={`order-item ${isExpanded ? 'expanded' : ''}`}>
            <div className="order-item-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="order-main-info">
                    <div className="order-car">
                        <span className="car-brand">{order.carBrand}</span>
                        <span className="car-model">{order.carModel}</span>
                    </div>
                    <div className="order-license">{order.licensePlate}</div>
                </div>
                <div className="order-details">
                    <div className="order-date">
                        {formatDate(order.serviceDate)} {order.serviceTime}
                    </div>
                    <div className="order-price">{order.totalPrice.toLocaleString()} ₽</div>
                    <div className={`order-status status-${currentStatus}`}>
                        {getStatusText(currentStatus)}
                    </div>
                    <div className="expand-icon">{isExpanded ? '▲' : '▼'}</div>
                </div>
            </div>

            {isExpanded && (
                <div className="order-item-expanded">
                    <div className="expanded-section">
                        <div className="section-title">📝 Услуги:</div>
                        <div className="services-list-expanded">
                            {order.services.map((service, idx) => (
                                <div key={idx} className="expanded-service-item">
                                    <span className="service-icon">{service.icon}</span>
                                    <span className="service-name">{service.name}</span>
                                    <span className="service-price">{service.price.toLocaleString()} ₽</span>
                                </div>
                            ))}
                        </div>
                        <div className="total-price-expanded">
                            Итого: <strong>{order.totalPrice.toLocaleString()} ₽</strong>
                        </div>
                    </div>

                    {order.master && (
                        <div className="expanded-section">
                            <div className="section-title">👨‍🔧 Мастер:</div>
                            <div className="master-info">
                                <div className="master-name">{order.master.name}</div>
                                <div className="master-specialty">{order.master.specialty}</div>
                                {order.masterComment && (
                                    <div className="master-comment">
                                        <span className="comment-label">Комментарий:</span>
                                        <span className="comment-text">{order.masterComment}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {userRole !== 'client' && (
                        <div className="expanded-section">
                            <div className="section-title">👤 Клиент:</div>
                            <div className="client-info-placeholder">
                                Информация о клиенте будет доступна позже
                            </div>
                        </div>
                    )}

                    {/* Кнопка отмены записи */}
                    {showCancelButton && (
                        <div className="cancel-button-container">
                            <button
                                className="cancel-order-btn"
                                onClick={handleCancel}
                            >
                                ❌ Отменить
                            </button>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

export default OrderItem;