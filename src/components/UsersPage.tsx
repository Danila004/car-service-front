import { useState } from 'react';
import UserList from './UserList';
import { allUsers } from '../data/usersData';
import { UserProfile } from '../types';

interface UsersPageProps {
    onBack: () => void;
}

function UsersPage({ onBack }: UsersPageProps) {
    const [users, setUsers] = useState<UserProfile[]>(allUsers);

    const handleUpdateUser = (userId: number, updates: Partial<UserProfile>) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, ...updates } : user
            )
        );
    };

    return (
        <div className="users-page">
            <div className="users-container">
                {/* Кнопка возврата */}
                <div className="users-back-button" onClick={onBack}>
                    <span className="back-arrow">←</span>
                    <span className="back-text">Вернуться в личный кабинет</span>
                </div>

                {/* Список пользователей */}
                <UserList users={users} onUpdateUser={handleUpdateUser}/>
            </div>
        </div>
    );
}

export default UsersPage;