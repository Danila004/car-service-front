import { useState } from 'react';
import HeaderPanels from './components/HeaderPanels';
import BrandModelPanel from './components/BrandModelPanel';
import ServiceCarPanel from './components/ServiceCarPanel';
import ServicesModal from './components/ServicesModel';
import UserCabinet from './components/UserCabinet';
import type { SelectedModel, ModalType } from './types';
import './App.css';

function App() {
    const [selectedModel, setSelectedModel] = useState<SelectedModel | null>(null);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [isAuthenticated, /*setIsAuthenticated*/] = useState<boolean>(true); // Статус входа
    const [showCabinet, setShowCabinet] = useState<boolean>(true);

    const handleModelSelect = (model: SelectedModel) => {
        setSelectedModel(model);
        setActiveModal('services');
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedModel(null);
    };

    // Обработка входа
    /*const handleLogin = () => {
        setIsAuthenticated(true);
        setShowCabinet(true);
    };*/

    // Обработка выхода из кабинета
    /*const handleLogout = () => {
        setIsAuthenticated(false);
        setShowCabinet(false);
    };*/

    // Возврат на главную из кабинета
    const handleBackToHome = () => {
        setShowCabinet(false);
    };

    // Если пользователь авторизован и в кабинете - показываем кабинет
    if (isAuthenticated && showCabinet) {
        return <UserCabinet onBackToHome={handleBackToHome} />;
    }

    const showMessage = (action: string) => {
        alert(`Функция "${action}" будет доступна в следующей версии`);
    };

    return (
        <div className="app">
            <div className="container">
                <HeaderPanels
                    onLoginClick={() => showMessage('Вход в личный кабинет')}
                    onRegisterClick={() => showMessage('Регистрация')}
                    onBookingClick={() => showMessage('Запись на обслуживание')}
                />

                <BrandModelPanel onModelSelect={handleModelSelect} />

                <ServiceCarPanel />
            </div>

            {activeModal === 'services' && selectedModel && (
                <ServicesModal model={selectedModel} onClose={closeModal} />
            )}
        </div>
    );
}

export default App;