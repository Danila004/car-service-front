import { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import UserItem from './UserItem';

interface UserListProps {
    users: UserProfile[];
    onUpdateUser?: (userId: number, updates: Partial<UserProfile>) => void;
}

function UserList({ users, onUpdateUser }: UserListProps) {
    const [filterRole, setFilterRole] = useState<UserRole | ''>('');

    // Применение фильтра по роли
    const filteredUsers = users.filter(user => {
        if (filterRole && user.role !== filterRole) {
            return false;
        }
        return true;
    });

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

    return (
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
                {filteredUsers.length === 0 ? (
                    <div className="empty-users">Нет пользователей</div>
                ) : (
                    filteredUsers.map((user) => (
                        <UserItem key={user.id} user={user} onUpdateUser={onUpdateUser} />
                    ))
                )}
            </div>
        </div>
    );
}

export default UserList;