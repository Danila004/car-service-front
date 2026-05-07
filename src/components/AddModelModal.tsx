import React, { useState } from 'react';
import { CarBrand } from '../types';

interface AddModelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (brandId: number, modelName: string, year: number) => void;
    brands: CarBrand[];
}

function AddModelModal({ isOpen, onClose, onAdd, brands }: AddModelModalProps) {
    const [selectedBrandId, setSelectedBrandId] = useState<number>(brands[0]?.id || 0);
    const [modelName, setModelName] = useState<string>('');
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBrandId) {
            setError('Выберите марку');
            return;
        }

        if (!modelName.trim()) {
            setError('Название модели не может быть пустым');
            return;
        }

        if (year < 1900 || year > new Date().getFullYear() + 1) {
            setError(`Год должен быть между 1900 и ${new Date().getFullYear() + 1}`);
            return;
        }

        // Проверка на существующую модель
        const selectedBrand = brands.find(b => b.id === selectedBrandId);
        const existingModel = selectedBrand?.models.find(
            m => m.name.toLowerCase() === modelName.trim().toLowerCase()
        );

        if (existingModel) {
            setError(`Модель "${modelName.trim()}" уже существует у марки ${selectedBrand?.name}`);
            return;
        }

        onAdd(selectedBrandId, modelName.trim(), year);
        setModelName('');
        setYear(new Date().getFullYear());
        setError('');
        onClose();
    };

    const handleClose = () => {
        setModelName('');
        setYear(new Date().getFullYear());
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="add-model-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Добавление новой модели</h3>
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
                            <label>Выберите марку</label>
                            <select
                                value={selectedBrandId}
                                onChange={(e) => setSelectedBrandId(Number(e.target.value))}
                            >
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Название модели</label>
                            <input
                                type="text"
                                value={modelName}
                                onChange={(e) => {
                                    setModelName(e.target.value);
                                    setError('');
                                }}
                                placeholder="Например: Camry, X5, A4"
                                autoFocus
                            />
                        </div>
                        <div className="form-field">
                            <label>Год выпуска</label>
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                min="1900"
                                max={new Date().getFullYear() + 1}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={handleClose}>
                            Отмена
                        </button>
                        <button type="submit" className="add-btn">
                            Добавить модель
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddModelModal;