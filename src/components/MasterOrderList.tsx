import { useState, useEffect, useCallback, useRef } from 'react';
import { MasterOrder } from '../types';
import MasterOrderItem from './MasterOrderItem';

interface MasterOrderListProps {
    orders: MasterOrder[];
    onOrderComplete: (orderId: number, comment: string) => void;
}

const ITEMS_PER_PAGE = 10;

function MasterOrderList({ orders, onOrderComplete }: MasterOrderListProps) {
    const [displayedOrders, setDisplayedOrders] = useState<MasterOrder[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [filterDate, setFilterDate] = useState<string>('');
    const loaderRef = useRef<HTMLDivElement>(null);

    // Применение фильтра по дате
    const filteredOrders = orders.filter(order => {
        if (filterDate && order.serviceDate !== filterDate) {
            return false;
        }
        return true;
    });

    // Сброс страницы при изменении фильтра
    useEffect(() => {
        setPage(1);
        setDisplayedOrders([]);
        setHasMore(true);
    }, [filterDate]);

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
        }, 300);
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
            }, 300);
        }
    }, [filteredOrders]);

    const handleResetFilter = () => {
        setFilterDate('');
    };

    return (
        <div className="master-order-list-container">
            {/* Фильтр по дате */}
            <div className="master-filters">
                <div className="master-filters-title">📋 Заказы для выполнения</div>
                <div className="master-filters-row">
                    <div className="master-filter-group">
                        <label>Дата записи</label>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </div>
                    <button className="master-reset-btn" onClick={handleResetFilter}>
                        Сбросить
                    </button>
                </div>
            </div>

            {/* Список заказов */}
            <div className="master-order-list">
                {displayedOrders.length === 0 && !loading ? (
                    <div className="empty-orders">Нет заказов для выполнения</div>
                ) : (
                    <>
                        {displayedOrders.map((order) => (
                            <MasterOrderItem
                                key={order.id}
                                order={order}
                                onComplete={onOrderComplete}
                            />
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

export default MasterOrderList;