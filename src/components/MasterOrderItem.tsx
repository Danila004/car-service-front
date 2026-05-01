import { useState } from 'react';
import { MasterOrder } from '../types';

interface MasterOrderItemProps {
    order: MasterOrder;
    onComplete: (orderId: number, comment: string) => void;
}

function MasterOrderItem({ order, onComplete }: MasterOrderItemProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(order.isCompleted);
    const [comment, setComment] = useState<string>('');

    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    };

    const handleComplete = () => {
        if (isCompleted) return;
        setIsCompleted(true);
        onComplete(order.id, comment);
    };

    return (
        <div className={`master-order-item ${isCompleted ? 'completed' : ''}`}>
            <div className="master-order-item-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="master-order-main-info">
                    <div className="master-order-car">
                        <span className="car-brand">{order.carBrand}</span>
                        <span className="car-model">{order.carModel}</span>
                    </div>
                    <div className="master-order-license">{order.licensePlate}</div>
                </div>
                <div className="master-order-details">
                    <div className="master-order-date">
                        {formatDate(order.serviceDate)} {order.serviceTime}
                    </div>
                    <div className="master-order-services-count">
                        📋 {order.services.length} услуг
                    </div>
                    <button
                        className={`complete-btn ${isCompleted ? 'completed' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleComplete();
                        }}
                        disabled={isCompleted}
                    >
                        {isCompleted ? '✓ Выполнен' : '○ Отметить выполненным'}
                    </button>
                    <div className="expand-icon">{isExpanded ? '▲' : '▼'}</div>
                </div>
            </div>

            {isExpanded && (
                <div className="master-order-item-expanded">
                    {/* Список услуг */}
                    <div className="master-expanded-section">
                        <div className="section-title">📝 Услуги для выполнения:</div>
                        <div className="master-services-list">
                            {order.services.map((service, idx) => (
                                <div key={idx} className="master-service-item">
                                    <span className="service-icon">{service.icon}</span>
                                    <span className="service-name">{service.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Поле для комментария (только если заказ не выполнен) */}
                    {!isCompleted && (
                        <div className="master-expanded-section">
                            <div className="section-title">💬 Комментарий по ремонту (необязательно):</div>
                            <textarea
                                className="master-comment-input"
                                placeholder="Опишите выполненные работы, рекомендации клиенту..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={3}
                            />
                        </div>
                    )}

                    {/* Показать комментарий, если он есть и заказ выполнен */}
                    {isCompleted && order.masterComment && (
                        <div className="master-expanded-section">
                            <div className="section-title">💬 Комментарий мастера:</div>
                            <div className="master-comment-display">{order.masterComment}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default MasterOrderItem;