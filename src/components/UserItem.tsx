import { useState } from 'react';
import {User, UserProfile} from '../types';

interface UserItemProps {
    user: UserProfile;
    onUpdateUser: (user: User) => void;
}

function UserItem({ user, onUpdateUser }: UserItemProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);
    const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [userStatistics, setUserStatistics] = useState<UserStatictics | null>(null);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    };

    const getRoleLabel = () => {
        const labels = {
            CLIENT: '👤 Клиент',
            MASTER: '🔧 Мастер',
            ADMIN: '👑 Администратор',
        };
        return labels[user.role as keyof typeof labels];
    };

    const getRoleClass = () => {
        const classes = {
            CLIENT: 'role-client',
            MASTER: 'role-master',
            ADMIN: 'role-admin',
        };
        return classes[user.role as keyof typeof classes];
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


    const handleStatusChange = (newWorkStatus: string) => {
        onUpdateUser({
            userId: user.userId,
            username: user.username,
            email: user.email,
            role: user.role,
            phone: user.phone,
            workStatus: newWorkStatus
        });
        setShowStatusDropdown(false);
    };

    const handleRoleChange = (newRole: string) => {
        onUpdateUser({
            userId: user.userId,
            username: user.username,
            email: user.email,
            role: newRole,
            phone: user.phone,
            workStatus: user.workStatus
        });
        setShowRoleDropdown(false);
    };

    const handleUserClick = () => {
        if(!isExpanded) {

        }
        setIsExpanded(!isExpanded);
    };

    // Показывать ли статус (только для мастеров и админов)
    const showWorkStatus = user.role === 'MASTER' || user.role === 'ADMIN';

    return (
        <div className={`user-item ${isExpanded ? 'expanded' : ''}`}>
            <div className="user-item-header" onClick={() => }>
                <div className="user-main-info">
                    <div className="user-name">{user.username}</div>
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
                    {user.phone && <div className="user-phone">{user.phone}</div>}
                    <div className="expand-icon">{isExpanded ? '▲' : '▼'}</div>
                </div>
            </div>

            {isExpanded && (
                <div className="user-item-expanded">
                    {/* Статистика для клиента */}
                    <div className="user-expanded-section">
                        <div className="section-title">📋 Контактная информация</div>
                        <div className="user-info-grid">
                            {user.lastVisit && (
                                <div className="info-row">
                                    <span className="info-label">Последний визит:</span>
                                    <span className="info-value">{formatDate(user.lastVisit)}</span>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="user-expanded-section">
                        <div className="section-title">📊 Статистика</div>
                        <div className="user-stats">
                            <div className="stat-card">
                                <div className="stat-value">{user.totalOrders || 0}</div>
                                <div className="stat-label">Всего заказов</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">
                                    {user.totalSpent ? user.totalSpent.toLocaleString() : 0} ₽
                                </div>
                                <div className="stat-label">Всего потрачено</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">
                                    {user.totalOrders && user.totalSpent
                                        ? Math.round(user.totalSpent / user.totalOrders).toLocaleString()
                                        : 0} ₽
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