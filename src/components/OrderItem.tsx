import { useState } from 'react';
import {Order, OrderDetailsForAdmin, OrderDetailsForUserOrMaster, OrderUserAndMasterDetails} from '../types';
import {api} from "../services/api.ts";

interface OrderItemProps {
    order: Order;
    onDeleteOrder: (orderId: number) => void;
    userRole: string;
}

function OrderItem({ order, onDeleteOrder, userRole }: OrderItemProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [orderUserOrMasterDetails, setOrderUserOrMasterDetails] = useState<OrderUserAndMasterDetails | null>(null)
    const [orderAdminDetails, setOrderAdminDetails] = useState<OrderDetailsForAdmin | null>(null)
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
            const response = await (userRole === 'ADMIN' ? api.getOrderDetailsForAdmin(order.orderId) :
                api.getOrderDetailsForUserOrMaster(order.orderId));
            if(!response.ok) {
                const error = await response.json().catch(() => ({}));
                setError(error);
                return;
            }
            const details = await response.json();
            if(userRole === 'ADMIN')
                setOrderAdminDetails(details)
            else
                setOrderUserOrMasterDetails(details);
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
                        {order.visitDate} {order.visitTime.slice(0, 5)}
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
                            {(userRole === 'ADMIN' ? orderAdminDetails : orderUserOrMasterDetails)
                                .services.map(serviceName => (
                                <div className="expanded-service-item">
                                    <span className="service-icon">🔧</span>
                                    <span className="service-name">{serviceName}</span>
                                </div>
                            ))}
                        </div>
                    </div>


                    {userRole === 'ADMIN' && (
                        <>
                            <div className="expanded-section">
                                <div className="section-title">👨‍🔧 Мастер:</div>
                                <div className="master-info">
                                    <div className="master-name">{orderAdminDetails?.masterName}</div>
                                    <div className="master-number">
                                        <span className="number-label">Телефон:</span>
                                        <span className="number-text">{orderAdminDetails?.masterPhoneNumber}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="expanded-section">
                                <div className="section-title">👤 Клиент:</div>
                                <div className="client-info">
                                    <div className="client-name">{orderAdminDetails?.userName}</div>
                                    <div className="client-number">
                                        <span className="number-label">Телефон:</span>
                                        <span className="number-text">{orderAdminDetails?.userPhoneNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}


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