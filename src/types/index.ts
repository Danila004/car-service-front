export interface CarModel {
    id: number;
    name: string;
    year: number;
    price: number;
}

export interface Model {
    modelId: number;
    modelName: string;
    modelYear: number;
    brandId: number;
    status: string;
}

export interface Brand {
    brandId: number;
    brandName: string;
    status: string;
}

// Услуга
export interface Service {
    serviceId: number;
    serviceName: string;
    status: string;
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

// Услуга с ценой для конкретной модели
export interface ServiceWithPrice {
    priceId: number
    serviceId: number;
    serviceName: string;
    modelId: number;
    price: number;
    status: string;
}

export interface Price {
    priceId: number;
    serviceId: number;
    modelId: number;
    price: number;
    status: string;
}

export interface SelectedService {
    id: number;
    name: string;
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
    error: string | null;
}

// Данные пользователя
export interface User {
    authUserId: number;
    userName: string;
    userType: string;
    phoneNumber: string;
    workStatus: string;
}

export interface UserStatistics {
    lastVisitDate: string;
    countOrders: number;
    price: number;
    avgPrice: number;
}

export interface PageUsers {
    users: User[];
    pageNumber: number;
    totalPages: number;
}

// Статус заказа
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// Заказ
export interface Order {
    orderId: number;
    brandName: string;
    modelName: string;
    stateNumber: string;
    visitDate: string;
    visitTime: string;
    price: number;
    orderStatus: string;
}

export interface PageOrders {
    orders: Order[];
    pageNumber: number;
    totalPages: number;
}

export interface OrderUserAndMasterDetails {
    services: string[];
}

export interface OrderDetails {
    services: string[];
    userName: string;
    userPhoneNumber: string;
    masterName: string;
    masterPhoneNumber: string;
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

// ===== Для страницы автомобилей =====

// Статус элемента
export type ItemStatus = 'active' | 'blocked';

// Марка автомобиля
export interface CarBrand {
    id: number;
    name: string;
    status: ItemStatus;
    models: CarModelForAdmin[];
}

// Модель автомобиля
export interface CarModelForAdmin {
    id: number;
    name: string;
    year: number;
    status: ItemStatus;
    services: ModelService[];
}

// Услуга для модели
export interface ModelService {
    id: number;
    name: string;
    price: number;
    status: ItemStatus;
}

// Для редактирования услуги
export interface EditingService {
    modelId: number;
    serviceId: number;
    name: string;
    price: number;
}

// Услуга автосервиса
export interface ServiceRow {
    id: number;
    name: string;
    status: ItemStatus;
}

// ===== Для аутентификации =====

// Данные для входа
export interface LoginCredentials {
    phone: string;
    password: string;
}

// Ответ после входа
export interface LoginResponse {
    success: boolean;
    message?: string;
    user?: User;
}

// ===== Для регистрации =====

// Данные для регистрации
export interface RegisterData {
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
}

// Ответ после регистрации
export interface RegisterResponse {
    success: boolean;
    message?: string;
    user?: User;
}

// ===== Для создания заказа =====

// Данные для создания заказа
export interface CreateOrderData {
    brandId: number;
    brandName: string;
    modelId: number;
    modelName: string;
    year: number;
    licensePlate: string;
    date: string;
    time: string;
    services: SelectedService[];
    clientName?: string;
    clientPhone?: string;
}

// Выбранная услуга
export interface SelectedService {
    id: number;
    name: string;
    price: number;
}

// Доступные временные слоты
export const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export enum icons {
    CAR = '🚗',
    ERROR = '⚠️',
    SERVICE = '🔧'
}