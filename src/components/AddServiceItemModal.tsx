import React, { useState } from 'react';
import { ServiceRow } from '../types';

interface AddServiceItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (serviceName: string) => void;
    existingServices: ServiceRow[];
}

function AddServiceItemModal({ isOpen, onClose, onAdd, existingServices }: AddServiceItemModalProps) {
    const [serviceName, setServiceName] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!serviceName.trim()) {
            setError('Название услуги не может быть пустым');
            return;
        }

        const existingService = existingServices.find(
            service => service.name.toLowerCase() === serviceName.trim().toLowerCase()
        );

        if (existingService) {
            setError(`Услуга "${serviceName.trim()}" уже существует`);
            return;
        }

        onAdd(serviceName.trim());
        setServiceName('');
        setError('');
        onClose();
    };

    const handleClose = () => {
        setServiceName('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="add-service-item-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>➕ Добавление новой услуги</h3>
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
                            <label>Название услуги</label>
                            <input
                                type="text"
                                value={serviceName}
                                onChange={(e) => {
                                    setServiceName(e.target.value);
                                    setError('');
                                }}
                                placeholder="Например: Замена стекла, Полировка фар"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={handleClose}>
                            Отмена
                        </button>
                        <button type="submit" className="add-btn">
                            Добавить услугу
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddServiceItemModal;