import { useState } from 'react';
import OrderList from './OrderList';
import MasterOrdersPage from './MasterOrdersPage';
import UsersPage from './UsersPage';
import { currentUser, mockOrders } from '../data/mockOrders';
import { UserRole } from '../types';

interface UserCabinetProps {
    onBackToHome: () => void;
}

function UserCabinet({ onBackToHome }: UserCabinetProps) {
    const [userRole] = useState<UserRole>(currentUser.role);
    const [showMasterOrders, setShowMasterOrders] = useState<boolean>(false);
    const [showUsersPage, setShowUsersPage] = useState<boolean>(true);

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

    if (showUsersPage) {
        return <UsersPage onBack={handleBackFromUsersPage} />;
    }

    if (showMasterOrders) {
        return <MasterOrdersPage onBack={handleBackFromMasterOrders} />;
    }

    return (
        <div className="user-cabinet">
            <div className="cabinet-container">
                {/* Верхние панели */}
                <div className="cabinet-header-panels">

                    <div className="cabinet-square-panel" onClick={onBackToHome}>
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

                    <div className="cabinet-square-panel" onClick={() => alert('Запись на обслуживание')}>
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

                </div>

                {/* Информация о пользователе */}
                <div className="cabinet-user-info">
                    <div className="user-avatar">👤</div>
                    <div className="user-details">
                        <h3>{currentUser.name}</h3>
                        <p>{currentUser.email}</p>
                        {currentUser.phone && <p>{currentUser.phone}</p>}
                    </div>
                </div>

                {/* Список заказов */}
                <OrderList orders={mockOrders} userRole={userRole} />
            </div>
        </div>
    );
}

export default UserCabinet;