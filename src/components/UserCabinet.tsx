import React, { useState } from 'react';
import MasterOrdersPage from './MasterOrdersPage';
import UsersPage from './UsersPage';
import CreateOrderModal from './CreateOrderModal.tsx';
import {Order, PageOrders, User} from '../types';
import {carsData} from "../data/carsData.ts";
import CarsList from "./CarsList.tsx";
import ServicesList from "./ServicesList.tsx";
import OrderItem from "./OrderItem.tsx";
import {useApi} from "../hooks/useApi.ts";
import {api} from "../services/api.ts";
import OrdersPage from "./OrdersPage.tsx";

interface UserCabinetProps {
    onBackToHome: () => void;
    user: User;
    onLogout: () => void;
}

function UserCabinet({ user, onLogout }: UserCabinetProps) {
    const { data: apiOrders, error: apiError } = useApi<PageOrders>(api.getOrdersForUser, "/" + user.authUserId +
        "/orders?page=0");
    const [orders, setOrders] = useState<Order[] | null>([]);
    const [error, setError] = useState<string>("");
    const [moreButton, setMoreButton] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [inputDateFrom, setInputDateFrom] = useState<string>("");
    const [inputDateTo, setInputDateTo] = useState<string>("");
    const [inputStateNumber, setInputStateNumber] = useState<string>("");
    const [showMasterOrders, setShowMasterOrders] = useState<boolean>(false);
    const [showUsersPage, setShowUsersPage] = useState<boolean>(false);
    const [showOrdersPage, setShowOrdersPage] = useState<boolean>(false);
    const [showCarsPage, setShowCarsPage] = useState<boolean>(false);
    const [showServicesPage, setShowServicesPage] = useState<boolean>(false);
    const [showCreateOrderModal, setShowCreateOrderModal] = useState<boolean>(false);

    React.useEffect(() => {
        setOrders(apiOrders?.orders ?? null);
        if(apiOrders?.totalPages || apiOrders?.pageNumber !== apiOrders?.pageNumber)
            setMoreButton(true);
    }, [apiOrders]);

    const handleFilterClick = async () => {
        const response = await api.getSimpleOrdersForUser(user.authUserId,
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
        const response = await api.getSimpleOrdersForUser(user.authUserId,
            "?page=0");
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
        const response = await api.getSimpleOrdersForUser(user.authUserId,
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
        const response = await api.deleteOrder(orderId);
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        setOrders(prev => (prev ?? []).filter(order => order.orderId !== orderId))
    };

    // Временные заглушки для кнопок (позже реализуем)
    const handleMasterOrders = () => {
        setShowMasterOrders(true);
    };

    const handleAdminUsers = () => {
        setShowUsersPage(true);
    };

    const handleOrdersPage = () => {
        setShowOrdersPage(true);
    };

    const handleBackFromMasterOrders = () => {
        setShowMasterOrders(false);
    };

    const handleBackFromUsersPage = () => {
        setShowUsersPage(false);
    };

    const handleCarsManagement = () => {
        setShowCarsPage(true);
    };

    const handleBackFromCarsPage = () => {
        setShowCarsPage(false);
    };

    const handleBackFromOrdersPage = () => {
        setShowOrdersPage(false);
    };

    const handleBookingClick = () => {
        setShowCreateOrderModal(true);
    };

    const handleServicesManagement = () => setShowServicesPage(true);

    const handleBackFromServicesPage = () => setShowServicesPage(false);

    if (showCarsPage) {
        return <CarsList onBack={handleBackFromCarsPage} />;
    }

    if (showOrdersPage) {
        return <OrdersPage onBack={handleBackFromOrdersPage} user={user} />;
    }

    if (showUsersPage) {
        return <UsersPage onBack={handleBackFromUsersPage} />;
    }

    if (showMasterOrders) {
        return <MasterOrdersPage onBack={handleBackFromMasterOrders} />;
    }

    if (showServicesPage) {
        return <ServicesList onBack={handleBackFromServicesPage} />;
    }

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
        <div className="user-cabinet">
            <div className="cabinet-container">
                {/* Верхние панели */}
                <div className="cabinet-header-panels">

                    <div className="cabinet-square-panel" onClick={onLogout}>
                        <div className="square-content">
                            <span className="square-icon">🏠</span>
                            <span className="square-text">Главная</span>
                        </div>
                    </div>


                    {user.userType === 'MASTER' && (
                        <div className="cabinet-square-panel" onClick={handleMasterOrders}>
                            <div className="square-content">
                                <span className="square-icon">🔧</span>
                                <span className="square-text">Работа</span>
                            </div>
                        </div>
                    )}

                    {user.userType === 'ADMIN' && (
                        <div className="cabinet-square-panel" onClick={handleAdminUsers}>
                            <div className="square-content">
                                <span className="square-icon">👥</span>
                                <span className="square-text">Клиенты</span>
                            </div>
                        </div>
                    )}

                    <div className="cabinet-square-panel" onClick={handleBookingClick}>
                        <div className="square-content">
                            <span className="square-icon">📅</span>
                            <span className="square-text">Запись</span>
                        </div>
                    </div>

                    {user.userType === 'ADMIN' && (
                        <div className="cabinet-square-panel" onClick={handleOrdersPage}>
                            <div className="square-content">
                                <span className="square-icon">📊</span>
                                <span className="square-text">Все заказы</span>
                            </div>
                        </div>
                    )}

                    {user.userType === 'ADMIN' && (
                        <div className="cabinet-square-panel" onClick={handleCarsManagement}>
                            <div className="square-content">
                                <span className="square-icon">🚗</span>
                                <span className="square-text">Автомобили</span>
                            </div>
                        </div>
                    )}

                    {user.userType === 'ADMIN' && (
                        <div className="cabinet-square-panel" onClick={handleServicesManagement}>
                            <div className="square-content">
                                <span className="square-icon">🔧</span>
                                <span className="square-text">Услуги</span>
                            </div>
                        </div>
                    )}

                </div>

                {/* Информация о пользователе */}
                <div className="cabinet-user-info">
                    <div className="user-avatar">👤</div>
                    <div className="user-details">
                        <h3>{user.userName}</h3>
                        <p>{user.phoneNumber}</p>
                    </div>
                </div>

                <div className="order-list-container">
                    <div className="order-filters">
                        <div className="filters-title">📋 Мои записи</div>
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

                <CreateOrderModal
                    isOpen={showCreateOrderModal}
                    onClose={() => setShowCreateOrderModal(false)}
                    brands={carsData}
                    currentUser={user}
                />
            </div>
        </div>
    );
}

export default UserCabinet;