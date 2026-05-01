import { Order, Master, User } from '../types';

// Мастера
export const masters: Master[] = [
    { id: 1, name: 'Иван Петров', specialty: 'Диагностика и ремонт двигателя', comment: 'Заменил масло, проверил подвеску. Рекомендую заменить тормозные колодки через 5000 км.' },
    { id: 2, name: 'Алексей Сидоров', specialty: 'Кузовной ремонт', comment: 'Устранил сколы на капоте, полировка в подарок.' },
    { id: 3, name: 'Дмитрий Козлов', specialty: 'Электрика', comment: 'Замена аккумулятора и диагностика генератора.' },
    { id: 4, name: 'Сергей Новиков', specialty: 'Шиномонтаж и балансировка', comment: 'Сезонная смена резины, балансировка выполнена.' },
    { id: 5, name: 'Андрей Морозов', specialty: 'Ремонт подвески', comment: 'Замена сайлентблоков, сход-развал.' },
];

// Текущий пользователь (клиент)
export const currentUser: User = {
    id: 1,
    name: 'Алексей Иванов',
    email: 'alexey@example.com',
    role: 'client',
    phone: '+7 (999) 123-45-67'
};

// Генерация моковых заказов (50 штук для демонстрации пагинации)
export const generateMockOrders = (): Order[] => {
    const carBrands = ['Toyota', 'BMW', 'Mercedes-Benz', 'Audi', 'Hyundai', 'Kia', 'Volkswagen', 'Ford'];
    const carModels: Record<string, string[]> = {
        'Toyota': ['Camry', 'Corolla', 'RAV4', 'Land Cruiser'],
        'BMW': ['X5', 'X3', 'M3', 'M5'],
        'Mercedes-Benz': ['E-Class', 'S-Class', 'C-Class', 'GLE'],
        'Audi': ['A4', 'A6', 'Q5', 'Q7'],
        'Hyundai': ['Sonata', 'Tucson', 'Santa Fe', 'Elantra'],
        'Kia': ['K5', 'Sportage', 'Sorento', 'Rio'],
        'Volkswagen': ['Passat', 'Tiguan', 'Golf', 'Polo'],
        'Ford': ['Focus', 'Mondeo', 'Kuga', 'Explorer']
    };

    const services = [
        { name: 'Замена масла', icon: '🔧', basePrice: 3000 },
        { name: 'Диагностика', icon: '⚙️', basePrice: 2000 },
        { name: 'Шиномонтаж', icon: '🛞', basePrice: 2500 },
        { name: 'Ремонт подвески', icon: '🔩', basePrice: 8000 },
        { name: 'Покраска', icon: '🎨', basePrice: 15000 },
    ];

    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const statuses: ('pending' | 'in_progress' | 'completed' | 'cancelled')[] = ['pending', 'in_progress', 'completed', 'completed', 'completed', 'cancelled'];

    const orders: Order[] = [];
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-12-31');

    for (let i = 0; i < 50; i++) {
        const brand = carBrands[Math.floor(Math.random() * carBrands.length)];
        const models = carModels[brand];
        const model = models[Math.floor(Math.random() * models.length)];

        // Генерация случайной даты
        const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        const year = randomDate.getFullYear();
        const month = String(randomDate.getMonth() + 1).padStart(2, '0');
        const day = String(randomDate.getDate()).padStart(2, '0');

        // Случайные услуги
        const numServices = Math.floor(Math.random() * 3) + 1;
        const selectedServices = services.slice(0, numServices).map((s, idx) => ({
            id: idx + 1,
            name: s.name,
            icon: s.icon,
            price: s.basePrice + Math.floor(Math.random() * 2000)
        }));

        const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
        const master = masters[Math.floor(Math.random() * masters.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        orders.push({
            id: i + 1,
            userId: 1, // Все заказы для текущего пользователя
            masterId: master.id,
            master: master,
            carBrand: brand,
            carModel: model,
            licensePlate: `${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${['А', 'В', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С', 'Т', 'У', 'Х'][Math.floor(Math.random() * 12)]}${['А', 'В', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С', 'Т', 'У', 'Х'][Math.floor(Math.random() * 12)]}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`,
            serviceDate: `${year}-${month}-${day}`,
            serviceTime: timeSlots[Math.floor(Math.random() * timeSlots.length)],
            services: selectedServices,
            totalPrice: totalPrice,
            status: status,
            masterComment: status === 'completed' ? master.comment : undefined,
            createdAt: `${year}-${month}-${day}T${timeSlots[Math.floor(Math.random() * timeSlots.length)]}:00`,
        });
    }

    // Сортируем по дате (свежие сверху)
    return orders.sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime());
};

export const mockOrders = generateMockOrders();