import { useState } from 'react';
import HeaderPanels from './components/HeaderPanels';
import BrandModelPanel from './components/BrandModelPanel';
import ServicesModal from './components/ServicesModel';
import UserCabinet from './components/UserCabinet';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import CreateOrderModal from './components/CreateOrderModal.tsx';
import type {ModalType, User, Model, Brand,ServiceWithPrice} from './types';
import { carsData } from './data/carsData';
import './App.css';

const mockExistingUsers: User[] = [
    { authUserId: 1, userName: 'Алексей Иванов', workStatus: 'WORK', phoneNumber: '+79991234567', userType: 'CLIENT' },
    { authUserId: 2, userName: 'Елена Смирнова', workStatus: 'WORK', phoneNumber: '+79992345678', userType: 'CLIENT' },
    { authUserId: 3, userName: 'Иван Соколов', workStatus: 'WORK', phoneNumber: '+79995678901', userType: 'MASTER' },
    { authUserId: 4, userName: 'Мария Волкова', workStatus: 'WORK', phoneNumber: '+79996789012', userType: 'ADMIN' }
];

function App() {
    const [services, setServices] = useState<ServiceWithPrice[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [showCabinet, setShowCabinet] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>(mockExistingUsers);
    const [showCreateOrderModal, setShowCreateOrderModal] = useState<boolean>(false);

    const handleModelSelect = (model: Model) => {
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

                <BrandModelPanel onModelSelect={handleModelSelect}
                                 selectedBrand={selectedBrand}
                                 setSelectedBrand={setSelectedBrand}
                                 setServices={setServices}/>

            </div>

            {activeModal === 'services' && selectedModel && (
                <ServicesModal model={selectedModel} brand={selectedBrand} modelServices={services} onClose={closeModal} />
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