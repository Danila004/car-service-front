import React, { useState } from 'react';
import { User, RegisterData } from '../types';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegisterSuccess: (user: User) => void;
    existingUsers: User[];
}

function RegisterModal({ isOpen, onClose, onRegisterSuccess, existingUsers }: RegisterModalProps) {
    const [formData, setFormData] = useState<RegisterData>({
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Валидация имени
        if (!formData.firstName.trim()) {
            setError('Введите имя');
            return;
        }

        // Валидация фамилии
        if (!formData.lastName.trim()) {
            setError('Введите фамилию');
            return;
        }

        // Валидация телефона
        if (!formData.phone.trim()) {
            setError('Введите номер телефона');
            return;
        }

        // Простая валидация формата телефона (должен содержать только цифры и +)
        const phoneRegex = /^\+?\d{10,12}$/;
        const cleanPhone = formData.phone.replace(/\s/g, '');
        if (!phoneRegex.test(cleanPhone) && !/^\+\d{11}$/.test(cleanPhone)) {
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
        const existingUser = existingUsers.find(
            u => u.phone === formData.phone.trim()
        );

        if (existingUser) {
            setError('Пользователь с таким номером телефона уже существует');
            return;
        }

        // Имитация регистрации
        setIsLoading(true);
        setTimeout(() => {
            const newUser: User = {
                id: Math.max(...existingUsers.map(u => u.id), 0) + 1,
                name: `${formData.firstName} ${formData.lastName}`,
                email: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@example.com`,
                phone: formData.phone.trim(),
                role: 'client',
            };

            setIsLoading(false);
            onRegisterSuccess(newUser);
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                password: '',
            });
            setConfirmPassword('');
            onClose();
        }, 500);
    };

    const handleClose = () => {
        setFormData({
            firstName: '',
            lastName: '',
            phone: '',
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
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Введите имя"
                                    autoFocus
                                />
                            </div>
                            <div className="form-field half">
                                <label>Фамилия</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Введите фамилию"
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Номер телефона</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
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
                        <button type="submit" className="register-btn" disabled={isLoading}>
                            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterModal;