import React, { useState } from 'react';
import {LoginData, User} from '../types';
import {api} from "../services/api.ts";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
}

// Моковые данные пользователей для проверки
const mockUsers: User[] = [
    { userId: 1, userName: 'Алексей Иванов', workStatus: 'WORK', phoneNumber: '+79991234567', userType: 'CLIENT' },
    { userId: 2, userName: 'Елена Смирнова', workStatus: 'WORK', phoneNumber: '+79992345678', userType: 'CLIENT' },
    { userId: 3, userName: 'Иван Соколов', workStatus: 'WORK', phoneNumber: '+79995678901', userType: 'MASTER' },
    { userId: 4, userName: 'Мария Волкова', workStatus: 'WORK', phoneNumber: '+79996789012', userType: 'ADMIN' }
];

// Пароль для всех пользователей (упрощённо)
const DEFAULT_PASSWORD = '123456';

function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
    const [error, setError] = useState<string>('');
    const [formData, setFormData] = useState<LoginData>({
        phoneNumber: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Очистка предыдущей ошибки
        setError('');

        const phoneRegex = /^8\d{10}$/;
        const cleanPhone = formData.phoneNumber.replace(/\s/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            setError('Введите корректный номер телефона');
            return;
        }

        if (!formData.password.trim()) {
            setError('Введите пароль');
            return;
        }

        const response = await api.login(formData);
        if(!response.ok) {
            const error = await response.text();
            setError(error === 'NOT_FOUND' ? 'Неверный логин или пароль' : error);
            return;
        }
        const user: User = await response.json();

        setFormData({
            phoneNumber: '',
            password: '',
        });
        setError("");
        onLoginSuccess(user);
    };

    const handleClose = () => {
        setFormData({
            phoneNumber: '',
            password: '',
        });
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
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+7 999 123-45-67"
                                autoFocus
                            />
                            <div className="field-hint">Введите номер в формате 8XXXXXXXXXX</div>
                        </div>
                        <div className="form-field">
                            <label>Пароль</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Введите пароль"
                            />
                            <div className="field-hint">Демо-пароль: 123456</div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="login-btn" >
                            {'Войти'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;