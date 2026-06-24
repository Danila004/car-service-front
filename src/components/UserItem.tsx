import { useState } from 'react';
import {User, UserStatistics} from '../types';
import {api} from "../services/api.ts";

interface UserItemProps {
    user: User;
    onUpdateUser: (user: User) => void;
}

function UserItem({ user, onUpdateUser }: UserItemProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);
    const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(null);

    const getRoleLabel = () => {
        const labels = {
            CLIENT: '👤 Клиент',
            MASTER: '🔧 Мастер',
            ADMIN: '👑 Администратор',
        };
        return labels[user.userType as keyof typeof labels];
    };

    const getRoleClass = () => {
        const classes = {
            CLIENT: 'role-client',
            MASTER: 'role-master',
            ADMIN: 'role-admin',
        };
        return classes[user.userType as keyof typeof classes];
    };

    const getWorkStatusLabel = () => {
        const labels = {
            WORK: '✅ Работает',
            SICK: '🤒 Болеет',
            NOT_WORK: '❌ Не работает',
        };
        return labels[user.workStatus as keyof typeof labels];
    };

    const getWorkStatusClass = () => {
        const classes = {
            WORK: 'status-working',
            SICK: 'status-sick',
            NOT_WORK: 'status-not-working',
        };
        return classes[user.workStatus as keyof typeof classes];
    };


    const handleStatusChange = async (newWorkStatus: string) => {
        const response = await api.setWorkStatus(user.userId, newWorkStatus);
        if(!response.ok) {
            const error = await response.text();
            if(error === 'NOT_ACCESS_TOKEN' || error === 'NOT_REFRESH_TOKEN' || error === 'NOT_VALID_REFRESH_TOKEN') {
                setError('Пройдите авторизацию для продолжения');
                return;
            }
            setError(error);
            return;
        }
        onUpdateUser({
            userId: user.userId,
            userName: user.userName,
            phoneNumber: user.phoneNumber,
            userType: user.userType,
            workStatus: newWorkStatus
        });
        setShowStatusDropdown(false);
    };

    const handleRoleChange = async (newUserType: string) => {
        const response = await api.setUserType(user.userId, newUserType);
        if(!response.ok) {
            const error = await response.text();
            if(error === 'NOT_ACCESS_TOKEN' || error === 'NOT_REFRESH_TOKEN' || error === 'NOT_VALID_REFRESH_TOKEN') {
                setError('Пройдите авторизацию для продолжения');
                return;
            }
            setError(error);
            return;
        }
        onUpdateUser({
            userId: user.userId,
            userName: user.userName,
            phoneNumber: user.phoneNumber,
            userType: newUserType,
            workStatus: (user.userType === 'CLIENT' ? 'WORK' : user.workStatus)
        });
        setShowRoleDropdown(false);
    };

    const handleUserClick = async () => {
        if(!isExpanded) {
            const response = await api.getUserStatistics(user.userId);
            if(!response.ok) {
                const error = await response.text();
                if(error === 'NOT_ACCESS_TOKEN' || error === 'NOT_REFRESH_TOKEN' || error === 'NOT_VALID_REFRESH_TOKEN') {
                    setError('Пройдите авторизацию для продолжения');
                    return;
                }
                setError(error);
                return;
            }
            const statistics : UserStatistics = await response.json();
            setUserStatistics(statistics);
        }
        setIsExpanded(!isExpanded);
    };

    // Показывать ли статус (только для мастеров и админов)
    const showWorkStatus = user.userType === 'MASTER' || user.userType === 'ADMIN';

    if (error) {
        return (
            <div className="brand-panel error-panel">
                <div className="panel-header">
                    <span>⚠️ Ошибка загрузки данных: error</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`user-item ${isExpanded ? 'expanded' : ''}`}>
            <div className="user-item-header" onClick={() => handleUserClick()}>
                <div className="user-main-info">
                    <div className="user-name">{user.userName}</div>
                    <div
                        className={`user-role-badge ${getRoleClass()} role-clickable`}
                        onMouseEnter={() => setShowRoleDropdown(true)}
                        onMouseLeave={() => setShowRoleDropdown(false)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {getRoleLabel()}
                        {showRoleDropdown && (
                            <div className="dropdown-menu">
                                <div
                                    className="dropdown-item"
                                    onClick={() => handleRoleChange('CLIENT')}
                                >
                                    👤 Клиент
                                </div>
                                <div
                                    className="dropdown-item"
                                    onClick={() => handleRoleChange('MASTER')}
                                >
                                    🔧 Мастер
                                </div>
                                <div
                                    className="dropdown-item"
                                    onClick={() => handleRoleChange('ADMIN')}
                                >
                                    👑 Администратор
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="user-details-info">
                    {showWorkStatus && user.workStatus && (
                        <div
                            className={`work-status ${getWorkStatusClass()} status-clickable`}
                            onMouseEnter={() => setShowStatusDropdown(true)}
                            onMouseLeave={() => setShowStatusDropdown(false)}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {getWorkStatusLabel()}
                            {showStatusDropdown && (
                                <div className="dropdown-menu status-dropdown">
                                    <div
                                        className="dropdown-item"
                                        onClick={() => handleStatusChange('WORK')}
                                    >
                                        ✅ Работает
                                    </div>
                                    <div
                                        className="dropdown-item"
                                        onClick={() => handleStatusChange('SICK')}
                                    >
                                        🤒 Болеет
                                    </div>
                                    <div
                                        className="dropdown-item"
                                        onClick={() => handleStatusChange('NOT_WORK')}
                                    >
                                        ❌ Не работает
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="user-phone">{user.phoneNumber}</div>
                    <div className="expand-icon">{isExpanded ? '▲' : '▼'}</div>
                </div>
            </div>

            {isExpanded && (
                <div className="user-item-expanded">
                    {/* Статистика для клиента */}
                    <div className="user-expanded-section">
                        <div className="section-title">📊 Статистика</div>
                        <div className="user-info-grid">
                            <div className="info-row">
                                <span className="info-label">Последний визит:</span>
                                <span className="info-value">{userStatistics?.lastVisitDate ?? '-'}</span>
                            </div>
                        </div>

                        <div className="user-stats">
                            <div className="stat-card">
                                <div className="stat-value">{userStatistics?.countOrders}</div>
                                <div className="stat-label">Всего заказов</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">
                                    {userStatistics?.price} ₽
                                </div>
                                <div className="stat-label">Всего потрачено</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">
                                    {userStatistics?.avgPrice} ₽
                                </div>
                                <div className="stat-label">Средний чек</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserItem;