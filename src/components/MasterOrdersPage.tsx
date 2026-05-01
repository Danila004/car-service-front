import { useState } from 'react';
import MasterOrderList from './MasterOrderList';
import { MasterOrder } from '../types';
import { masterOrders } from '../data/mockMasterOrders';

interface MasterOrdersPageProps {
    onBack: () => void;
}

function MasterOrdersPage({ onBack }: MasterOrdersPageProps) {
    const [orders, setOrders] = useState<MasterOrder[]>(masterOrders);

    const handleOrderComplete = (orderId: number, comment: string) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId
                    ? { ...order, isCompleted: true, masterComment: comment || order.masterComment }
                    : order
            )
        );
        alert(`Заказ #${orderId} отмечен как выполненный${comment ? `\nКомментарий: ${comment}` : ''}`);
    };

    return (
        <div className="master-orders-page">
            <div className="master-orders-container">
                {/* Кнопка возврата */}
                <div className="master-back-button" onClick={onBack}>
                    <span className="back-arrow">←</span>
                    <span className="back-text">Вернуться в личный кабинет</span>
                </div>

                {/* Список заказов */}
                <MasterOrderList
                    orders={orders}
                    onOrderComplete={handleOrderComplete}
                />
            </div>
        </div>
    );
}

export default MasterOrdersPage;