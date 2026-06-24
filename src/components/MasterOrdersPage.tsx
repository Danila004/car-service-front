import React, { useState } from 'react';
import {Order, PageOrders, User} from '../types';
import {useApi} from "../hooks/useApi.ts";
import {api} from "../services/api.ts";
import OrderItem from "./OrderItem.tsx";

interface MasterOrdersPageProps {
    onBack: () => void;
    user: User;
}

function MasterOrdersPage({ onBack, user }: MasterOrdersPageProps) {
    const { data: apiOrders, error: apiError } = useApi<Order[]>(api.getOrdersForMaster,
        "/" + user.userId + "/ordersToWork" + "?date=");
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [inputDate, setInputDate] = useState<string>("");
    const [error, setError] = useState<string>("");

    React.useEffect(() => {
        setOrders(apiOrders ?? null);
    }, [apiOrders]);

    const handleOrderComplete = async (orderId: number) => {
        setOrders(prev => (prev ?? []).map(order =>
                order.orderId === orderId ? { ...order, orderStatus: 'READY'} : order)
        );
    };

    const handleFilterReset = async () => {
        const response = await api.getSimpleOrdersForMaster(user.userId, "?date=");
        if(!response.ok) {
            const error = await response.text();
            if(error === 'NOT_ACCESS_TOKEN' || error === 'NOT_REFRESH_TOKEN' || error === 'NOT_VALID_REFRESH_TOKEN') {
                setError('Пройдите авторизацию для продолжения');
                return;
            }
            setError(error);
            return;
        }
        const orderPage : PageOrders = await response.json();
        setOrders(orderPage.orders);
        setInputDate("");
    };

    const handleFilterClick = async (date: string) => {
        const response = await api.getSimpleOrdersForMaster(user.userId, "?date=" + date);
        if(!response.ok) {
            const error = await response.text();
            if(error === 'NOT_ACCESS_TOKEN' || error === 'NOT_REFRESH_TOKEN' || error === 'NOT_VALID_REFRESH_TOKEN') {
                setError('Пройдите авторизацию для продолжения');
                return;
            }
            setError(error);
            return;
        }
        const ordersToDate : Order[] = await response.json();
        setOrders(ordersToDate);
        setInputDate(date);
    };

    if (apiError || error) {
        return (
            <div className="brand-panel error-panel">
                <div className="panel-header">
                    <span>⚠️ Ошибка загрузки данных: {apiError ? apiError : error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="master-orders-page">
            <div className="master-orders-container">
                {/* Кнопка возврата */}
                <div className="master-back-button" onClick={onBack}>
                    <span className="back-arrow">←</span>
                    <span className="back-text">Вернуться в личный кабинет</span>
                </div>

                {/* Список заказов */}
                <div className="master-order-list-container">
                    {/* Фильтр по дате */}
                    <div className="master-filters">
                        <div className="master-filters-title">📋 Заказы для выполнения</div>
                        <div className="master-filters-row">
                            <div className="master-filter-group">
                                <label>Дата записи</label>
                                <input
                                    type="date"
                                    value={inputDate}
                                    onChange={(e) => handleFilterClick(e.target.value)}
                                />
                            </div>
                            <button className="master-reset-btn" onClick={handleFilterReset}>
                                Сбросить
                            </button>
                        </div>
                    </div>

                    {/* Список заказов */}
                    <div className="master-order-list">
                        {orders?.length === 0 ? (
                            <div className="empty-orders">Нет заказов для выполнения</div>
                        ) : (
                            <>
                                {orders?.map(order => (
                                    <OrderItem
                                        key={order.orderId}
                                        order={order}
                                        onComplete={handleOrderComplete}
                                        userRole={user.userType}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default MasterOrdersPage;