import { CarBrand } from '../types';

export const carsData: CarBrand[] = [
    {
        id: 1,
        name: 'Toyota',
        status: 'active',
        models: [
            {
                id: 101,
                name: 'Camry',
                year: 2020,
                status: 'active',
                services: [
                    { id: 1, name: 'Замена масла', price: 3000, status: 'active' },
                    { id: 2, name: 'Диагностика', price: 2000, status: 'active' },
                    { id: 3, name: 'Шиномонтаж', price: 2500, status: 'blocked' },
                ],
            },
            {
                id: 102,
                name: 'Corolla',
                year: 2021,
                status: 'active',
                services: [
                    { id: 1, name: 'Замена масла', price: 2800, status: 'active' },
                    { id: 2, name: 'Диагностика', price: 1800, status: 'active' },
                ],
            },
            {
                id: 103,
                name: 'RAV4',
                year: 2022,
                status: 'blocked',
                services: [
                    { id: 1, name: 'Замена масла', price: 3500, status: 'active' },
                    { id: 3, name: 'Шиномонтаж', price: 3000, status: 'blocked' },
                ],
            },
        ],
    },
    {
        id: 2,
        name: 'BMW',
        status: 'active',
        models: [
            {
                id: 201,
                name: 'X5',
                year: 2021,
                status: 'active',
                services: [
                    { id: 1, name: 'Замена масла', price: 4500, status: 'active' },
                    { id: 2, name: 'Диагностика', price: 3500, status: 'active' },
                    { id: 4, name: 'Ремонт подвески', price: 8000, status: 'active' },
                ],
            },
            {
                id: 202,
                name: 'X3',
                year: 2020,
                status: 'active',
                services: [
                    { id: 1, name: 'Замена масла', price: 4000, status: 'active' },
                    { id: 4, name: 'Ремонт подвески', price: 6500, status: 'blocked' },
                ],
            },
            {
                id: 203,
                name: 'M3',
                year: 2022,
                status: 'blocked',
                services: [
                    { id: 1, name: 'Замена масла', price: 5000, status: 'active' },
                    { id: 2, name: 'Диагностика', price: 4000, status: 'active' },
                    { id: 5, name: 'Покраска', price: 15000, status: 'active' },
                ],
            },
        ],
    },
    {
        id: 3,
        name: 'Mercedes-Benz',
        status: 'active',
        models: [
            {
                id: 301,
                name: 'E-Class',
                year: 2020,
                status: 'active',
                services: [
                    { id: 1, name: 'Замена масла', price: 4200, status: 'active' },
                    { id: 2, name: 'Диагностика', price: 3000, status: 'active' },
                    { id: 4, name: 'Ремонт подвески', price: 10000, status: 'active' },
                ],
            },
            {
                id: 302,
                name: 'S-Class',
                year: 2021,
                status: 'active',
                services: [
                    { id: 1, name: 'Замена масла', price: 5000, status: 'active' },
                    { id: 5, name: 'Покраска', price: 18000, status: 'active' },
                ],
            },
        ],
    },
    {
        id: 4,
        name: 'Audi',
        status: 'blocked',
        models: [
            {
                id: 401,
                name: 'A4',
                year: 2020,
                status: 'active',
                services: [
                    { id: 1, name: 'Замена масла', price: 3800, status: 'active' },
                    { id: 2, name: 'Диагностика', price: 2500, status: 'blocked' },
                ],
            },
            {
                id: 402,
                name: 'Q5',
                year: 2022,
                status: 'active',
                services: [
                    { id: 1, name: 'Замена масла', price: 4200, status: 'active' },
                    { id: 3, name: 'Шиномонтаж', price: 3500, status: 'active' },
                ],
            },
        ],
    },
    {
        id: 5,
        name: 'Hyundai',
        status: 'active',
        models: [
            {
                id: 501,
                name: 'Tucson',
                year: 2021,
                status: 'active',
                services: [
                    { id: 1, name: 'Замена масла', price: 3200, status: 'active' },
                    { id: 3, name: 'Шиномонтаж', price: 2800, status: 'active' },
                ],
            },
            {
                id: 502,
                name: 'Santa Fe',
                year: 2022,
                status: 'blocked',
                services: [
                    { id: 1, name: 'Замена масла', price: 3800, status: 'active' },
                    { id: 2, name: 'Диагностика', price: 3000, status: 'active' },
                ],
            },
        ],
    },
];