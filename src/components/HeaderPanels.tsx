interface HeaderPanelsProps {
    onLoginClick: () => void;
    onRegisterClick: () => void;
    onBookingClick: () => void;
}

function HeaderPanels({ onLoginClick, onRegisterClick, onBookingClick }: HeaderPanelsProps) {
    return (
        <div className="header-panels">
            <div className="square-panel" onClick={onLoginClick}>
                <div className="square-content">
                    <span className="square-icon">👤</span>
                    <span className="square-text">Вход</span>
                </div>
            </div>

            <div className="square-panel" onClick={onRegisterClick}>
                <div className="square-content">
                    <span className="square-icon">📝</span>
                    <span className="square-text">Регистрация</span>
                </div>
            </div>

            <div className="square-panel" onClick={onBookingClick}>
                <div className="square-content">
                    <span className="square-icon">📅</span>
                    <span className="square-text">Запись</span>
                </div>
            </div>
        </div>
    );
}

export default HeaderPanels;