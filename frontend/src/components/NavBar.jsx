import React, { useState, useRef, useEffect } from 'react';
import '../styles/components/NavBar.css';

function NavBar({ active, onGoToHome, onGoToPlazas, onGoToDashboard, user, onGoToLogin, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = user?.nombre || 'Usuario'

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <div className="logo-container">
          <span className="logo-icon">🌳</span>
          <h1 className="logo-text">Adoptá una Plaza</h1>
        </div>
      </div>

      <nav className="navbar-center">
        <ul className="nav-links">
          <li>
            <button
              className={`nav-item ${active === 'home' ? 'active' : ''}`}
              type="button"
              onClick={onGoToHome}
            >
              Inicio
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${active === 'plazas' ? 'active' : ''}`}
              type="button"
              onClick={onGoToPlazas}
            >
              Plazas & Ranking
            </button>
          </li>
          {user?.rol  && (
            <li>
              <button
                className={`nav-item ${['coordinador', 'vecino','admin'].includes(active) ? 'active' : ''}`}
                type="button"
                onClick={onGoToDashboard}
              >
                Dashboard
              </button>
            </li>
          )}
          <li><button className="nav-item" type="button">Calendario</button></li>
          <li><button className="nav-item" type="button">Voluntarios</button></li>
        </ul>
      </nav>

      <div className="navbar-right">
        <button className="btn-icon" title="Notificaciones" type="button">
          🔔<span className="badge"></span>
        </button>
        {user ? (
          <div className="user-profile-container relative" ref={menuRef}>
            <button title='perfil' className='user-profile' onClick={() => setIsOpen(!isOpen)} type="button">
                <img src={user.avatar || 'https://dummyimage.com/30x30/ba5f1e/fff.png&text=user'} alt="Avatar" className="avatar" />
                <span className="user-name">{displayName}</span>
            </button>
            {isOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={ () => {
                  setIsOpen(false);
                  onGoToDashboard();
                }}>
                  ir al Dashboard
                </button>
                <button className='dropdown-item text-red' onClick= {onLogout} >Cerrar Sesión</button>
              </div>
            )}
          </div>
        ) : (
          <button className="btn-primary login-btn" type="button" onClick={onGoToLogin}>
            Iniciar sesión
          </button>
        )}
      </div>
    </header>
  );
}

export default NavBar
