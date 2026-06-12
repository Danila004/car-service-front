import { useState } from 'react';
import {Order, OrderUserAndMasterDetails} from '../types';
import {api} from "../services/api.ts";

interface OrderItemProps {
    order: Order;
    onDeleteOrder: (orderId: number) => void;
}

function OrderItem({ order, onDeleteOrder }: OrderItemProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [orderUserDetails, setOrderUserDetails] = useState<OrderUserAndMasterDetails | null>(null)
    const [error, setError] = useState<string>("");

    const getStatusText = (status: string) => {
        const statusMap = {
            REGISTRED: '⏳ Ожидает',
            WORK: '🔧 В работе',
            READY: '✅ Выполнен'
        };
        return statusMap[status as keyof typeof statusMap];
    };

    const getStatusClass = (status: string) => {
        const classMap = {
            REGISTRED: 'pending',
            WORK: 'in_progress',
            READY: 'completed'
        }
        return classMap[status as keyof typeof classMap];
    };

    const handleCancel = () => {
        onDeleteOrder(order.orderId);
    };

    const handleOrderClick = async () => {
        if(!isExpanded) {
            const response = await api.getUserStatistics(order.orderId);
            if(!response.ok) {
                const error = await response.json().catch(() => ({}));
                setError(error);
                return;
            }
            const details : OrderUserAndMasterDetails = await response.json();
            setOrderUserDetails(details);
        }
        setIsExpanded(!isExpanded);
    };

    if (error) {
        return (
            <div className="brand-panel error-panel">
                <div className="panel-header">
                    <span>⚠️ Ошибка загрузки данных: {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`order-item ${isExpanded ? 'expanded' : ''}`}>
            <div className="order-item-header" onClick={() => handleOrderClick()}>
                <div className="order-main-info">
                    <div className="order-car">
                        <span className="car-brand">{order.brandName}</span>
                        <span className="car-model">{order.modelName}</span>
                    </div>
                    <div className="order-license">{order.stateNumber}</div>
                </div>
                <div className="order-details">
                    <div className="order-date">
                        {order.visitDate} {order.visitTime}
                    </div>
                    <div className="order-price">{order.price} ₽</div>
                    <div className={`order-status status-${getStatusClass(order.orderStatus)}`}>
                        {getStatusText(order.orderStatus)}
                    </div>
                    <div className="expand-icon">{isExpanded ? '▲' : '▼'}</div>
                </div>
            </div>

            {isExpanded && (
                <div className="order-item-expanded">
                    <div className="expanded-section">
                        <div className="section-title">📝 Услуги:</div>
                        <div className="services-list-expanded">
                            {orderUserDetails.services.map(serviceName => (
                                <div className="expanded-service-item">
                                    <span className="service-icon">🔧</span>
                                    <span className="service-name">{serviceName}</span>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/*<div className="expanded-section">
                        <div className="section-title">👨‍🔧 Мастер:</div>
                        <div className="master-info">
                            <div className="master-name">{orderUserDatails.name}</div>
                            <div className="master-comment">
                                <span className="comment-label">Телефон:</span>
                                <span className="comment-text">{orderUserDatails.phoneNumber}</span>
                            </div>
                        </div>
                    </div>*/}

                    {/* Кнопка отмены записи */}
                    {order.orderStatus === 'REGISTRED' && (
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