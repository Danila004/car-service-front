import { useState, useEffect, useCallback, useRef } from 'react';
import { Order, OrderFilters } from '../types';
import OrderItem from './OrderItem';
import OrderFiltersComponent from './OrderFilters';

interface OrderListProps {
    orders: Order[];
    userRole: 'client' | 'master' | 'admin';
    onFilterChange?: (filters: OrderFilters) => void;
}

const ITEMS_PER_PAGE = 10;

function OrderList({ orders, userRole, onFilterChange }: OrderListProps) {
    const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [filters, setFilters] = useState<OrderFilters>({});
    const loaderRef = useRef<HTMLDivElement>(null);

    // Применение фильтров
    const filteredOrders = orders.filter(order => {
        if (filters.licensePlate && !order.licensePlate.toLowerCase().includes(filters.licensePlate.toLowerCase())) {
            return false;
        }
        if (filters.dateFrom && order.serviceDate < filters.dateFrom) {
            return false;
        }
        if (filters.dateTo && order.serviceDate > filters.dateTo) {
            return false;
        }
        return true;
    });

    // Сброс страницы при изменении фильтров
    useEffect(() => {
        setPage(1);
        setDisplayedOrders([]);
        setHasMore(true);
    }, [filters]);

    // Загрузка следующей порции
    const loadMore = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        setTimeout(() => {
            const start = (page - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const newOrders = filteredOrders.slice(start, end);

            setDisplayedOrders(prev => [...prev, ...newOrders]);
            setHasMore(end < filteredOrders.length);
            setLoading(false);
        }, 500); // Имитация задержки сети
    }, [page, filteredOrders, loading, hasMore]);

    // Отслеживание прокрутки
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(loaderRef.current);

        return () => observer.disconnect();
    }, [hasMore, loading]);

    // Загрузка при изменении страницы
    useEffect(() => {
        if (page > 1) {
            loadMore();
        }
    }, [page, loadMore]);

    // Начальная загрузка
    useEffect(() => {
        if (page === 1) {
            setLoading(true);
            setTimeout(() => {
                const initialOrders = filteredOrders.slice(0, ITEMS_PER_PAGE);
                setDisplayedOrders(initialOrders);
                setHasMore(ITEMS_PER_PAGE < filteredOrders.length);
                setLoading(false);
            }, 500);
        }
    }, [filteredOrders]);

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