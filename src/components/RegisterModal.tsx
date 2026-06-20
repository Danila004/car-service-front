import React, { useState } from 'react';
import { User, RegisterData } from '../types';
import {api} from "../services/api.ts";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegisterSuccess: (user: User) => void;
}

function RegisterModal({ isOpen, onClose, onRegisterSuccess }: RegisterModalProps) {
    const [formData, setFormData] = useState<RegisterData>({
        userName: '',
        phoneNumber: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Валидация имени
        if (!formData.userName.trim()) {
            setError('Введите имя');
            return;
        }

        // Валидация телефона
        if (!formData.phoneNumber.trim()) {
            setError('Введите номер телефона');
            return;
        }

        // Простая валидация формата телефона (должен содержать только цифры и +)
        const phoneRegex = /^8\d{10}$/;
        const cleanPhone = formData.phoneNumber.replace(/\s/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            setError('Введите корректный номер телефона (например, +79991234567)');
            return;
        }

        // Валидация пароля
        if (!formData.password) {
            setError('Введите пароль');
            return;
        }

        if (formData.password.length < 4) {
            setError('Пароль должен содержать минимум 4 символа');
            return;
        }

        // Проверка совпадения паролей
        if (formData.password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        // Проверка на существующего пользователя
        const response = await api.registration(formData);
        if(!response.ok) {
            const error = await response.json().catch(() => ({}));
            setError(error);
            return;
        }
        const newUser: User = await response.json();
        setFormData({
            userName: '',
            phoneNumber: '',
            password: '',
        });
        setConfirmPassword('');
        setError('');
        onClose();
        onRegisterSuccess(newUser);
    };

    const handleClose = () => {
        setFormData({
            userName: '',
            phoneNumber: '',
            password: '',
        });
        setConfirmPassword('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="register-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>📝 Регистрация нового пользователя</h3>
                    <button className="modal-close" onClick={handleClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-field half">
                                <label>Имя</label>
                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    placeholder="Введите имя"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Номер телефона</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+7 999 123-45-67"
                            />
                            <div className="field-hint">Введите номер в формате +7XXXXXXXXXX</div>
                        </div>

                        <div className="form-field">
                            <label>Пароль</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Введите пароль (минимум 4 символа)"
                            />
                        </div>

                        <div className="form-field">
                            <label>Подтверждение пароля</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Повторите пароль"
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="register-btn">
                            {'Зарегистрироваться'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterModal;