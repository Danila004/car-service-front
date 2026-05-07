import { useState } from 'react';
import HeaderPanels from './components/HeaderPanels';
import BrandModelPanel from './components/BrandModelPanel';
import ServiceCarPanel from './components/ServiceCarPanel';
import ServicesModal from './components/ServicesModel';
import UserCabinet from './components/UserCabinet';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import CreateOrderModal from './components/CreateOrderModal.tsx';
import type { SelectedModel, ModalType, User } from './types';
import { carsData } from './data/carsData';
import './App.css';

const mockExistingUsers: User[] = [
    { id: 1, name: 'Алексей Иванов', email: 'alexey@example.com', phone: '+79991234567', role: 'client' },
    { id: 2, name: 'Елена Смирнова', email: 'elena@example.com', phone: '+79992345678', role: 'client' },
    { id: 3, name: 'Иван Соколов', email: 'ivan.s@example.com', phone: '+79995678901', role: 'master' },
    { id: 4, name: 'Мария Волкова', email: 'maria@example.com', phone: '+79996789012', role: 'admin' },
];

function App() {
    const [selectedModel, setSelectedModel] = useState<SelectedModel | null>(null);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Статус входа
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [showCabinet, setShowCabinet] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>(mockExistingUsers);
    const [showCreateOrderModal, setShowCreateOrderModal] = useState<boolean>(false);

    const handleModelSelect = (model: SelectedModel) => {
        setSelectedModel(model);
        setActiveModal('services');
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedModel(null);
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleRegisterClick = () => {
        setShowRegisterModal(true);
    };

    const handleBookingClick = () => {
        setShowCreateOrderModal(true);
    };

    const handleRegisterSuccess = (user: User) => {
        setUsers(prev => [...prev, user]);
        setCurrentUser(user);
        setIsAuthenticated(true);
        setShowCabinet(true);
        setShowRegisterModal(false);
    };

    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
        setIsAuthenticated(true);
        setShowCabinet(true);
        setShowLoginModal(false);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setShowCabinet(false);
        setCurrentUser(null);
    };

    // Возврат на главную из кабинета
    const handleBackToHome = () => {
        setShowCabinet(false);
    };

    // Если пользователь авторизован и в кабинете - показываем кабинет
    if (isAuthenticated && showCabinet && currentUser) {
        return <UserCabinet onBackToHome={handleBackToHome} user={currentUser} onLogout={handleLogout} />;
    }

    return (
        <div className="app">
            <div className="container">
                <HeaderPanels
                    onLoginClick={handleLoginClick}
                    onRegisterClick={handleRegisterClick}
                    onBookingClick={handleBookingClick}
                />

                <BrandModelPanel onModelSelect={handleModelSelect} />

                <ServiceCarPanel />
            </div>

            {activeModal === 'services' && selectedModel && (
                <ServicesModal model={selectedModel} onClose={closeModal} />
            )}

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onRegisterSuccess={handleRegisterSuccess}
                existingUsers={users}
            />

            <CreateOrderModal
                isOpen={showCreateOrderModal}
                onClose={() => setShowCreateOrderModal(false)}
                brands={carsData}
                currentUser={currentUser}
            />
        </div>
    );
}

export default App;