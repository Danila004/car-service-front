import {useEffect, useState} from 'react';
import {User, UserRole, UserStatistics} from '../types';
import UserItem from "./UserItem.tsx";
import {useApi} from "../hooks/useApi.ts";
import {api} from "../services/api.ts";

interface UsersPageProps {
    onBack: () => void;
}

function UsersPage({ onBack }: UsersPageProps) {
    const { data: apiUsers, error: apiError } = useApi<User[]>(api.getUsers, "?userType=");
    const [users, setUsers] = useState<User[] | null>([]);
    const [error, setError] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState<string>("");

    useEffect(() => {
        setUsers(apiUsers);
    }, [apiUsers]);
    
    const handleUpdateUser = (user: User) => {
        setUsers(prev => (prev ?? []).map(u =>
            u.authUserId === user.authUserId
                ? { ...u, ...user }
                : u
        ));
    };

    const handleResetFilter = async () => {
        const response = await api.getSimpleUsers("");
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const allUsers : User[] = await response.json();
        setUsers(allUsers);
        setSelectedRole("");
    };

    const handleFilterClick = async (role: string) => {
        const response = await api.getSimpleUsers("?userType=" + role);
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const filteredUsers : User[] = await response.json();
        setSelectedRole(role);
        setUsers(filteredUsers);
    };

    const getRoleLabel = (role: string) => {
        const labels = {
            CLIENT: '👤 Клиент',
            MASTER: '🔧 Мастер',
            ADMIN: '👑 Администратор',
        };
        return labels[role as keyof typeof labels];
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
        <div className="users-page">
            <div className="users-container">
                {/* Кнопка возврата */}
                <div className="users-back-button" onClick={onBack}>
                    <span className="back-arrow">←</span>
                    <span className="back-text">Вернуться в личный кабинет</span>
                </div>

                {/* Список пользователей */}
                <div className="user-list-container">
                    <div className="user-filters">
                        <div className="user-filters-title">👥 Все пользователи</div>
                        <div className="user-filters-row">
                            <div className="user-filter-group">
                                <label>Тип пользователя</label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => handleFilterClick(e.target.value)}
                                >
                                    <option value="">Все</option>
                                    <option value="CLIENT">{getRoleLabel('CLIENT')}</option>
                                    <option value="MASTER">{getRoleLabel('MASTER')}</option>
                                    <option value="ADMIN">{getRoleLabel('ADMIN')}</option>
                                </select>
                            </div>
                            <button className="user-reset-btn" onClick={handleResetFilter}>
                                Сбросить
                            </button>
                        </div>
                    </div>

                    <div className="user-list">
                        {users?.map((user) => (
                            <UserItem key={user.authUserId} user={user} onUpdateUser={handleUpdateUser} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsersPage;