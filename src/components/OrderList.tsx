import { useState, useEffect, useCallback, useRef } from 'react';
import {Order, OrderFilters, PageUsers, User} from '../types';
import OrderItem from './OrderItem';
import OrderFiltersComponent from './OrderFilters';
import {useApi} from "../hooks/useApi.ts";
import {api} from "../services/api.ts";

interface OrderListProps {
    orders: Order[];
    userRole: 'client' | 'master' | 'admin';
    onFilterChange?: (filters: OrderFilters) => void;
}

const ITEMS_PER_PAGE = 10;

function OrderList({ orders, userRole, onFilterChange }: OrderListProps) {
    const { data: apiOrders, error: apiError } = useApi<PageUsers>(api.getOrders, "?userId=" + user.authUserId +
        "&page=0");
    const [orders, setOrders] = useState<Order[] | null>([]);
    const [error, setError] = useState<string>("");
    const [inputPhone, setInputPhone] = useState<string>("");
    const [moreButton, setMoreButton] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);

    // Сброс страницы при изменении фильтров
    useEffect(() => {

    }, [apiOrders]);

    const handleFilterChange = (newFilters: OrderFilters) => {
        setFilters(newFilters);
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    const handleResetFilters = () => {
        setFilters({});
    };

    return (
        <div className="order-list-container">
            <OrderFiltersComponent
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />

            <div className="order-list">
                {displayedOrders.length === 0 && !loading ? (
                    <div className="empty-orders">Нет записей</div>
                ) : (
                    <>
                        {displayedOrders.map((order) => (
                            <OrderItem key={order.id} order={order} userRole={userRole} />
                        ))}

                        <div ref={loaderRef} className="loader-trigger">
                            {loading && <div className="loader">Загрузка...</div>}
                            {!hasMore && displayedOrders.length > 0 && (
                                <div className="end-of-list">Все заказы загружены</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default OrderList;