import './NavBar.css'

function NavBar({ active, onGoToHome, onGoToPlazas }) {
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
          <li><button className="nav-item" type="button">Calendario</button></li>
          <li><button className="nav-item" type="button">Voluntarios</button></li>
        </ul>
      </nav>

      <div className="navbar-right">
        <button className="btn-icon" title="Notificaciones" type="button">
          🔔<span className="badge"></span>
        </button>
        <div className="user-profile">
          <img src="https://via.placeholder.com/35" alt="Avatar" className="avatar" />
          <span className="user-name">Vecino Activo</span>
        </div>
      </div>
    </header>
  )
}

export default NavBar
