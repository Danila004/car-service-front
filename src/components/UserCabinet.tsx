import { useState } from 'react';
import OrderList from './OrderList';
import MasterOrdersPage from './MasterOrdersPage';
import UsersPage from './UsersPage';
import CarsPage from './CarsPage';
import ServicesPage from './ServicesPage';
import CreateOrderModal from './CreateOrderModal.tsx';
import { currentUser, mockOrders } from '../data/mockOrders';
import {User, UserRole} from '../types';
import {carsData} from "../data/carsData.ts";

interface UserCabinetProps {
    onBackToHome: () => void;
    user: User;
    onLogout: () => void;
}

function UserCabinet({ user, onLogout }: UserCabinetProps) {
    const [userRole] = useState<UserRole>(currentUser.role);
    const [showMasterOrders, setShowMasterOrders] = useState<boolean>(false);
    const [showUsersPage, setShowUsersPage] = useState<boolean>(true);
    const [showCarsPage, setShowCarsPage] = useState<boolean>(false);
    const [showServicesPage, setShowServicesPage] = useState<boolean>(false);
    const [showCreateOrderModal, setShowCreateOrderModal] = useState<boolean>(false);

    // Временные заглушки для кнопок (позже реализуем)
    const handleMasterOrders = () => {
        alert('Список заказов мастера будет доступен в следующей версии');
    };

    const handleAdminUsers = () => {
        alert('Список пользователей будет доступен в следующей версии');
    };

    const handleGeneralOrders = () => {
        alert('Общие заказы автосервиса будут доступны в следующей версии');
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

    const handleBookingClick = () => {
        setShowCreateOrderModal(true);
    };

    const handleServicesManagement = () => setShowServicesPage(true);

    const handleBackFromServicesPage = () => setShowServicesPage(false);

    if (showCarsPage) {
        return <CarsPage onBack={handleBackFromCarsPage} />;
    }

    if (showUsersPage) {
        return <UsersPage onBack={handleBackFromUsersPage} />;
    }

    if (showMasterOrders) {
        return <MasterOrdersPage onBack={handleBackFromMasterOrders} />;
    }

    if (showServicesPage) {
        return <ServicesPage onBack={handleBackFromServicesPage} />;
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


                    {(userRole === 'master') && (
                        <div className="cabinet-square-panel" onClick={handleMasterOrders}>
                            <div className="square-content">
                                <span className="square-icon">🔧</span>
                                <span className="square-text">Работа</span>
                            </div>
                        </div>
                    )}

                    {userRole === 'admin' && (
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

                    {userRole === 'admin' && (
                        <div className="cabinet-square-panel" onClick={handleGeneralOrders}>
                            <div className="square-content">
                                <span className="square-icon">📊</span>
                                <span className="square-text">Все заказы</span>
                            </div>
                        </div>
                    )}

                    {userRole === 'admin' && (
                        <div className="cabinet-square-panel" onClick={handleCarsManagement}>
                            <div className="square-content">
                                <span className="square-icon">🚗</span>
                                <span className="square-text">Автомобили</span>
                            </div>
                        </div>
                    )}

                    {userRole === 'admin' && (
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
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                        {user.phone && <p>{user.phone}</p>}
                    </div>
                </div>

                {/* Список заказов */}
                <OrderList orders={mockOrders} userRole={userRole} />

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