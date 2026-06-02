import {useEffect, useState} from 'react';
import {User, UserRole} from '../types';
import UserItem from "./UserItem.tsx";
import {useApi} from "../hooks/useApi.ts";
import {api} from "../services/api.ts";

interface UsersPageProps {
    onBack: () => void;
}

function UsersPage({ onBack }: UsersPageProps) {
    const { data: apiUsers, error: apiError } = useApi<User[]>(api.getUsers, "");
    const [users, setUsers] = useState<User[] | null>([]);
    const [filterRole, setFilterRole] = useState<UserRole | ''>('');

    useEffect(() => {
        setUsers(apiUsers);
    }, [apiUsers]);
    
    const handleUpdateUser = async (user: User) => {
        const response = await api.setUser(user);
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const newUserInDb : User = response.json();
        users?.map(u => {
            return u.userId === user.userId ? {...u, ...newUserInDb} : u;
        })
    };

    const handleResetFilter = () => {
        setFilterRole('');
    };

    const getRoleLabel = (role: UserRole) => {
        const labels = {
            client: '👤 Клиент',
            master: '🔧 Мастер',
            admin: '👑 Администратор',
        };
        return labels[role];
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
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value as UserRole | '')}
                                >
                                    <option value="">Все</option>
                                    <option value="client">{getRoleLabel('client')}</option>
                                    <option value="master">{getRoleLabel('master')}</option>
                                    <option value="admin">{getRoleLabel('admin')}</option>
                                </select>
                            </div>
                            <button className="user-reset-btn" onClick={handleResetFilter}>
                                Сбросить
                            </button>
                        </div>
                    </div>

                    <div className="user-list">
                        {users?.map((user) => (
                            <UserItem key={user.userId} user={user} onUpdateUser={handleUpdateUser} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsersPage;