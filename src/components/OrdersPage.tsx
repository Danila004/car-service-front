import React, { useState } from 'react';
import {Order, PageOrders, User} from '../types';
import OrderItem from "./OrderItem.tsx";
import {useApi} from "../hooks/useApi.ts";
import {api} from "../services/api.ts";

interface OrdersPageProps {
    user: User;
    onBack: () => void;
}

function OrdersPage({ user, onBack }: OrdersPageProps) {
    const { data: apiOrders, error: apiError } = useApi<PageOrders>(api.getOrders, "?page=0");
    const [orders, setOrders] = useState<Order[] | null>([]);
    const [error, setError] = useState<string>("");
    const [moreButton, setMoreButton] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [inputDateFrom, setInputDateFrom] = useState<string>("");
    const [inputDateTo, setInputDateTo] = useState<string>("");
    const [inputStateNumber, setInputStateNumber] = useState<string>("");

    React.useEffect(() => {
        setOrders(apiOrders?.orders ?? null);
        if(apiOrders?.totalPages || apiOrders?.pageNumber !== apiOrders?.pageNumber)
            setMoreButton(true);
    }, [apiOrders]);

    const handleFilterClick = async () => {
        const response = await api.getSimpleOrders(
            (inputStateNumber === "" ? "?" : "?stateNumber=" + inputStateNumber) +
            (inputDateFrom === "" ? "" : "&start=" + inputDateFrom) +
            (inputDateTo === "" ? "" : "&end=" + inputDateTo) +
            "&page=0");
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const orderPage : PageOrders = await response.json();
        setOrders(orderPage.orders);
        if(orderPage.pageNumber + 1 === orderPage.totalPages)
            setMoreButton(false);
        setCurrentPage(0);
    };

    const handleFilterReset = async () => {
        const response = await api.getSimpleOrders("?page=0");
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const orderPage : PageOrders = await response.json();
        setOrders(orderPage.orders);
        if(orderPage.pageNumber + 1 === orderPage.totalPages)
            setMoreButton(false);
        setInputStateNumber("");
        setInputDateTo("");
        setInputDateFrom("");
        setCurrentPage(0);
    };

    const handleMoreButtonClick = async () => {
        const response = await api.getSimpleOrders(
            (inputStateNumber === "" ? "?" : "?stateNumber=" + inputStateNumber) +
            (inputDateFrom === "" ? "" : "&start=" + inputDateFrom) +
            (inputDateTo === "" ? "" : "&end=" + inputDateTo) +
            "&page=" + (currentPage + 1));
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const orderPage : PageOrders = await response.json();
        setOrders(prev => [...(prev ?? []), ...orderPage.orders]);
        if(orderPage.pageNumber + 1 === orderPage.totalPages)
            setMoreButton(false);
        setCurrentPage(currentPage + 1);
    };

    const handleDeleteOrder = async (orderId: number) => {
        setOrders(prev => (prev ?? []).filter(order => order.orderId !== orderId))
    };

    const handleChangeStatusToWork = async (orderId: number) => {
        setOrders(prev => (prev ?? []).map(order =>
            order.orderId === orderId ? {...order, orderStatus: 'WORK'} : order));
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
        <div className="orders-page">
            <div className="ordrs-container">

                {/* Кнопка возврата */}
                <div className="users-back-button" onClick={onBack}>
                    <span className="back-arrow">←</span>
                    <span className="back-text">Вернуться в личный кабинет</span>
                </div>

                <div className="order-list-container">
                    <div className="order-filters">
                        <div className="filters-title">📋 Заказы</div>
                        <div className="filters-row">
                            <div className="filter-group">
                                <label>Регистрационный номер</label>
                                <input
                                    type="text"
                                    placeholder="А123ВС"
                                    value={inputStateNumber}
                                    onChange={(e) => setInputStateNumber(e.target.value)}
                                />
                            </div>
                            <div className="filter-group">
                                <label>Дата от</label>
                                <input
                                    type="date"
                                    value={inputDateFrom}
                                    onChange={(e) => setInputDateFrom(e.target.value)}
                                />
                            </div>
                            <div className="filter-group">
                                <label>Дата до</label>
                                <input
                                    type="date"
                                    value={inputDateTo}
                                    onChange={(e) => setInputDateTo(e.target.value)}
                                />
                            </div>
                            <div className="filter-buttons">
                                <button className="apply-btn" onClick={handleFilterClick}>Применить</button>
                                <button className="reset-btn" onClick={handleFilterReset}>Сбросить</button>
                            </div>
                        </div>
                    </div>

                    <div className="order-list">
                        {orders?.length === 0 ? (
                            <div className="empty-orders">Нет записей</div>
                        ) : (
                            <>
                                {orders?.map((order) => (
                                    <OrderItem
                                        key={order.orderId}
                                        order={order}
                                        onDeleteOrder={handleDeleteOrder}
                                        userRole={user.userType}
                                        onChangeStatusToWork={handleChangeStatusToWork}
                                    />
                                ))}
                            </>
                        )}

                        {moreButton && (
                            <button className="user-more-btn" onClick={handleMoreButtonClick}>
                                Еще
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrdersPage;