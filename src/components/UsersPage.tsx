import React, {useEffect, useState} from 'react';
import {PageUsers, User, UserRole, UserStatistics} from '../types';
import UserItem from "./UserItem.tsx";
import {useApi} from "../hooks/useApi.ts";
import {api} from "../services/api.ts";

interface UsersPageProps {
    onBack: () => void;
}

function UsersPage({ onBack }: UsersPageProps) {
    const { data: apiUsers, error: apiError } = useApi<PageUsers>(api.getUsers, "?userType=&page=0");
    const [users, setUsers] = useState<User[] | null>([]);
    const [error, setError] = useState<string>("");
    const [inputPhone, setInputPhone] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [moreButton, setMoreButton] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);

    React.useEffect(() => {
        setUsers(apiUsers?.users ?? null);
        if(apiUsers?.totalPages || apiUsers?.pageNumber !== apiUsers?.pageNumber)
            setMoreButton(true);
    }, [apiUsers]);
    
    const handleUpdateUser = (user: User) => {
        setUsers(prev => (prev ?? []).map(u =>
            u.authUserId === user.authUserId
                ? { ...u, ...user }
                : u
        ));
    };

    const handleResetFilter = async () => {
        const response = await api.getSimpleUsers("?userType=" + "&page=0");
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const allPageUsers : PageUsers = await response.json();
        setUsers(allPageUsers.users);
        setSelectedRole("");
        setInputPhone("");
        setCurrentPage(0);
    };

    const handleFilterClick = async (role: string) => {
        const response = await api.getSimpleUsers("?userType=" + role + "&page=0");
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }

        const filteredPageUsers : PageUsers = await response.json();
        setSelectedRole(role);
        setUsers(filteredPageUsers.users);
        if(filteredPageUsers.pageNumber + 1 === filteredPageUsers.totalPages)
            setMoreButton(false);
        setCurrentPage(0);
    };

    const handleChangePhone = async (phoneNumber: string) => {
        setInputPhone(phoneNumber);
        if(phoneNumber.length != 11) {
            return;
        }

        const response = await api.findUserByPhone("?phoneNumber=" + phoneNumber);
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const user : User = await response.json();
        setUsers([user]);
    };

    const handleMoreButtonClick = async () => {
        const response = await api.getSimpleUsers("?userType=" + selectedRole + "&page=" + (currentPage + 1));
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const userPage : PageUsers = await response.json();
        setUsers(prev => [...(prev ?? []), ...userPage.users]);
        if(userPage.pageNumber + 1 === userPage.totalPages)
            setMoreButton(false);
        setCurrentPage(currentPage + 1);
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
                                    disabled={inputPhone.length != 0}
                                    value={selectedRole}
                                    onChange={(e) => handleFilterClick(e.target.value)}
                                >
                                    <option value="">Все</option>
                                    <option value="CLIENT">{getRoleLabel('CLIENT')}</option>
                                    <option value="MASTER">{getRoleLabel('MASTER')}</option>
                                    <option value="ADMIN">{getRoleLabel('ADMIN')}</option>
                                </select>
                            </div>

                            <div className="user-filter-group">
                                <label>Номер телефона</label>
                                <input
                                    type="text"
                                    placeholder="89009009090"
                                    value={inputPhone}
                                    onChange={(e) => handleChangePhone(e.target.value)}
                                />
                            </div>

                            <button className="user-reset-btn" onClick={handleResetFilter}>
                                Сбросить
                            </button>
                        </div>
                    </div>

                    <div className="user-list">
                        {users?.some(user => user === null) ? ("Не найдено") : (
                            users?.map((user) => (
                            <UserItem user={user} onUpdateUser={handleUpdateUser} />
                        )))}

                        {moreButton && (
                            <button className="user-more-btn" onClick={handleMoreButtonClick}>
                                Еще
                            </button>
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
}

export default UsersPage;