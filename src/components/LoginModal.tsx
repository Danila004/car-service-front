import React, { useState } from 'react';
import { User } from '../types';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
}

// Моковые данные пользователей для проверки
const mockUsers: User[] = [
    { id: 1, name: 'Алексей Иванов', email: 'alexey@example.com', phone: '+79991234567', role: 'client' },
    { id: 2, name: 'Елена Смирнова', email: 'elena@example.com', phone: '+79992345678', role: 'client' },
    { id: 3, name: 'Иван Соколов', email: 'ivan.s@example.com', phone: '+79995678901', role: 'master' },
    { id: 4, name: 'Мария Волкова', email: 'maria@example.com', phone: '+79996789012', role: 'admin' },
    { id: 5, name: 'Дмитрий Петров', email: 'dmitry@example.com', phone: '+79993456789', role: 'client' },
];

// Пароль для всех пользователей (упрощённо)
const DEFAULT_PASSWORD = '123456';

function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
    const [phone, setPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Очистка предыдущей ошибки
        setError('');

        // Валидация
        if (!phone.trim()) {
            setError('Введите номер телефона');
            return;
        }

        if (!password.trim()) {
            setError('Введите пароль');
            return;
        }

        // Поиск пользователя
        const user = mockUsers.find(u => u.phone === phone.trim());

        if (!user) {
            setError('Пользователь с таким номером не найден');
            return;
        }

        if (password !== DEFAULT_PASSWORD) {
            setError('Неверный пароль');
            return;
        }

        // Имитация задержки сети
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onLoginSuccess(user);
            setPhone('');
            setPassword('');
            onClose();
        }, 500);
    };

    const handleClose = () => {
        setPhone('');
        setPassword('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>🔐 Вход в аккаунт</h3>
                    <button className="modal-close" onClick={handleClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}
                        <div className="form-field">
                            <label>Номер телефона</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setError('');
                                }}
                                placeholder="+7 999 123-45-67"
                                autoFocus
                            />
                            <div className="field-hint">Введите номер в формате +7XXXXXXXXXX</div>
                        </div>
                        <div className="form-field">
                            <label>Пароль</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                placeholder="Введите пароль"
                            />
                            <div className="field-hint">Демо-пароль: 123456</div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? 'Вход...' : 'Войти'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;