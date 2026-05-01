// Модель автомобиля
export interface CarModel {
    id: number;
    name: string;
    year: number;
    price: number;
}

// Марка автомобиля
export interface Brand {
    id: number;
    name: string;
    models: CarModel[];
}

// Доступный автомобиль для услуги (из API)
export interface AvailableCar {
    brandId: number;
    modelId: number;
    price: number;
}

// Услуга
export interface Service {
    id: number;
    name: string;
    icon: string;
    availableCars: AvailableCar[];
}

// Детальная информация об автомобиле
export interface CarDetails {
    brand: string;
    brandId: number;
    model: string;
    modelId: number;
    year: number;
    basePrice: number;
}

// Автомобиль с ценой услуги (для отображения)
export interface CarWithServicePrice extends CarDetails {
    servicePrice: number;
}

// Услуга с ценой для конкретной модели
export interface ServiceWithPrice {
    id: number;
    name: string;
    icon: string;
    price: number;
}

// Выбранная модель с услугами (для модального окна)
export interface SelectedModel {
    brand: string;
    brandId: number;
    model: string;
    modelId: number;
    year: number;
    basePrice: number;
    services: ServiceWithPrice[];
}

// Тип модального окна
export type ModalType = 'login' | 'register' | 'booking' | 'services' | null;

// Состояние API
export interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

// ===== Для личного кабинета =====

// Роли пользователей
export type UserRole = 'client' | 'master' | 'admin';

// Статус работы для мастеров и админов
export type WorkStatus = 'working' | 'sick' | 'not_working';

// Данные пользователя
export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    workStatus?: WorkStatus;
}

export interface UserProfile extends User {
    createdAt?: string;
    lastVisit?: string;
    totalOrders?: number;
    totalSpent?: number;
}

// Мастер
export interface Master {
    id: number;
    name: string;
    specialty: string;
    comment?: string;
}

// Статус заказа
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// Заказ
export interface Order {
    id: number;
    userId: number;
    masterId: number;
    master?: Master;
    carBrand: string;
    carModel: string;
    licensePlate: string;      // Регистрационный номер
    serviceDate: string;        // Дата в формате ISO (YYYY-MM-DD)
    serviceTime: string;        // Время (HH:MM)
    services: ServiceWithPrice[];
    totalPrice: number;
    status: OrderStatus;
    masterComment?: string;     // Комментарий мастера
    createdAt: string;
}

// Фильтры для заказов
export interface OrderFilters {
    dateFrom?: string;    // ГГГГ-ММ-ДД
    dateTo?: string;
    licensePlate?: string;
}

// Состояние пагинации
export interface PaginationState {
    page: number;
    hasMore: boolean;
    loading: boolean;
}

// ===== Для мастера =====

// Заказ для мастера (расширенный)
export interface MasterOrder extends Order {
    isCompleted: boolean;
}

// Статус выполнения заказа
export interface OrderCompletion {
    orderId: number;
    completed: boolean;
    comment?: string;
}