import React, { useState } from 'react';
import { CarBrand } from '../types';

interface AddBrandModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (brandName: string) => void;
    existingBrands: CarBrand[];
}

function AddBrandModal({ isOpen, onClose, onAdd, existingBrands }: AddBrandModalProps) {
    const [brandName, setBrandName] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Проверка на пустое имя
        if (!brandName.trim()) {
            setError('Название марки не может быть пустым');
            return;
        }

        // Проверка на существующую марку
        const existingBrand = existingBrands.find(
            brand => brand.name.toLowerCase() === brandName.trim().toLowerCase()
        );

        if (existingBrand) {
            setError(`Марка "${brandName.trim()}" уже существует`);
            return;
        }

        // Если все проверки пройдены
        onAdd(brandName.trim());
        setBrandName('');
        setError('');
        onClose();
    };

    const handleClose = () => {
        setBrandName('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="add-brand-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Добавление новой марки</h3>
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
                            <label>Название марки</label>
                            <input
                                type="text"
                                value={brandName}
                                onChange={(e) => {
                                    setBrandName(e.target.value);
                                    setError('');
                                }}
                                placeholder="Например: Lexus, Honda, Nissan"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={handleClose}>
                            Отмена
                        </button>
                        <button type="submit" className="add-btn">
                            Добавить марку
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddBrandModal;