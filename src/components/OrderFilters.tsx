import { useState } from 'react';
import { OrderFilters } from '../types';

interface OrderFiltersProps {
    filters: OrderFilters;
    onFilterChange: (filters: OrderFilters) => void;
    onReset: () => void;
}

function OrderFiltersComponent({ filters, onFilterChange, onReset }: OrderFiltersProps) {
    const [localFilters, setLocalFilters] = useState<OrderFilters>(filters);

    const handleChange = (field: keyof OrderFilters, value: string) => {
        const newFilters = { ...localFilters, [field]: value || undefined };
        setLocalFilters(newFilters);
    };

    const handleApply = () => {
        onFilterChange(localFilters);
    };

    const handleReset = () => {
        setLocalFilters({});
        onReset();
    };

    return (
        <div className="order-filters">
            <div className="filters-title">📋 Мои записи</div>
            <div className="filters-row">
                <div className="filter-group">
                    <label>Регистрационный номер</label>
                    <input
                        type="text"
                        placeholder="А123ВС"
                        value={localFilters.licensePlate || ''}
                        onChange={(e) => handleChange('licensePlate', e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label>Дата от</label>
                    <input
                        type="date"
                        value={localFilters.dateFrom || ''}
                        onChange={(e) => handleChange('dateFrom', e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label>Дата до</label>
                    <input
                        type="date"
                        value={localFilters.dateTo || ''}
                        onChange={(e) => handleChange('dateTo', e.target.value)}
                    />
                </div>
                <div className="filter-buttons">
                    <button className="apply-btn" onClick={handleApply}>Применить</button>
                    <button className="reset-btn" onClick={handleReset}>Сбросить</button>
                </div>
            </div>
        </div>
    );
}

export default OrderFiltersComponent;