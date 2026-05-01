import { useState } from 'react';
import {UserProfile, UserRole, WorkStatus} from '../types';

interface UserItemProps {
    user: UserProfile;
    onUpdateUser?: (userId: number, updates: Partial<UserProfile>) => void;
}

function UserItem({ user, onUpdateUser }: UserItemProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);
    const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    };

    const getRoleLabel = () => {
        const labels = {
            client: '👤 Клиент',
            master: '🔧 Мастер',
            admin: '👑 Администратор',
        };
        return labels[user.role];
    };

    const getRoleClass = () => {
        const classes = {
            client: 'role-client',
            master: 'role-master',
            admin: 'role-admin',
        };
        return classes[user.role];
    };

    const getWorkStatusLabel = (status?: WorkStatus) => {
        const labels = {
            working: '✅ Работает',
            sick: '🤒 Болеет',
            not_working: '❌ Не работает',
        };
        return status ? labels[status] : '';
    };

    const getWorkStatusClass = (status?: WorkStatus) => {
        const classes = {
            working: 'status-working',
            sick: 'status-sick',
            not_working: 'status-not-working',
        };
        return status ? classes[status] : '';
    };


    const handleStatusChange = (newStatus: WorkStatus) => {
        if (onUpdateUser) {
            onUpdateUser(user.id, { workStatus: newStatus });
        }
        setShowStatusDropdown(false);
    };

    const handleRoleChange = (newRole: UserRole) => {
        if (onUpdateUser) {
            onUpdateUser(user.id, { role: newRole });
        }
        setShowRoleDropdown(false);
    };

    // Показывать ли статус (только для мастеров и админов)
    const showWorkStatus = user.role === 'master' || user.role === 'admin';

    return (
        <div className={`user-item ${isExpanded ? 'expanded' : ''}`}>
            <div className="user-item-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="user-main-info">
                    <div className="user-name">{user.name}</div>
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
                                    onClick={() => handleRoleChange('client')}
                                >
                                    👤 Клиент
                                </div>
                                <div
                                    className="dropdown-item"
                                    onClick={() => handleRoleChange('master')}
                                >
                                    🔧 Мастер
                                </div>
                                <div
                                    className="dropdown-item"
                                    onClick={() => handleRoleChange('admin')}
                                >
                                    👑 Администратор
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="user-details-info">
                    <div className="user-email">{user.email}</div>
                    {showWorkStatus && user.workStatus && (
                        <div
                            className={`work-status ${getWorkStatusClass(user.workStatus)} status-clickable`}
                            onMouseEnter={() => setShowStatusDropdown(true)}
                            onMouseLeave={() => setShowStatusDropdown(false)}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {getWorkStatusLabel(user.workStatus)}
                            {showStatusDropdown && (
                                <div className="dropdown-menu status-dropdown">
                                    <div
                                        className="dropdown-item"
                                        onClick={() => handleStatusChange('working')}
                                    >
                                        ✅ Работает
                                    </div>
                                    <div
                                        className="dropdown-item"
                                        onClick={() => handleStatusChange('sick')}
                                    >
                                        🤒 Болеет
                                    </div>
                                    <div
                                        className="dropdown-item"
                                        onClick={() => handleStatusChange('not_working')}
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

            <div className="user-item-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="user-main-info">
                    <div className="user-name">{user.name}</div>
                    <div className={`user-role-badge ${getRoleClass()}`}>
                        {getRoleLabel()}
                    </div>
                </div>
                <div className="user-details-info">
                    <div className="user-email">{user.email}</div>
                    {user.phone && <div className="user-phone">{user.phone}</div>}
                    <div className="expand-icon">{isExpanded ? '▲' : '▼'}</div>
                </div>
            </div>

            {isExpanded && (
                <div className="user-item-expanded">
                    {/* Основная информация */}
                    <div className="user-expanded-section">
                        <div className="section-title">📋 Контактная информация</div>
                        <div className="user-info-grid">
                            <div className="info-row">
                                <span className="info-label">ID:</span>
                                <span className="info-value">{user.id}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                            {user.phone && (
                                <div className="info-row">
                                    <span className="info-label">Телефон:</span>
                                    <span className="info-value">{user.phone}</span>
                                </div>
                            )}
                            {user.createdAt && (
                                <div className="info-row">
                                    <span className="info-label">Дата регистрации:</span>
                                    <span className="info-value">{formatDate(user.createdAt)}</span>
                                </div>
                            )}
                            {user.lastVisit && (
                                <div className="info-row">
                                    <span className="info-label">Последний визит:</span>
                                    <span className="info-value">{formatDate(user.lastVisit)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Статистика для клиента */}
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