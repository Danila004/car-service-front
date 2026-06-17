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

// Тип модального окна
export type ModalType = 'login' | 'register' | 'booking' | 'services' | null;

// Состояние API
export interface ApiState<T> {
    data: T | null;
    error: string | null;
}

// Данные пользователя
export interface User {
    userId: number;
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

// Заказ
export interface Order {
    brandName: string;
    modelName: string;
    orderId: number;
    orderStatus: string;
    price: number;
    stateNumber: string;
    visitDate: string;
    visitTime: string;
}

export interface CreateOrder extends Order {
    userId: number | null;
    userName: string;
    userPhoneNumber: string;
    masterId: number;
}

export interface PageOrders {
    orders: Order[];
    pageNumber: number;
    totalPages: number;
}

export interface OrderDetailsForUserOrMaster {
    services: string[];
}

export interface OrderDetailsForAdmin {
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

export  interface DateSlot {
    slotId: number;
    visitTime: string;
    masterId: number;
}