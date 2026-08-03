import './Footer.css'

function Footer({ onGoToPlazas }) {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-col">
          <h3>Adoptá una Plaza</h3>
          <p>Iniciativa comunitaria para cuidar, poner en valor y mantener los espacios verdes de Río Grande.</p>
        </div>

        <div className="footer-col">
          <h4>Navegación</h4>
          <ul>
            <li>
              <button className="footer-link" type="button" onClick={onGoToPlazas}>
                Ver Plazas
              </button>
            </li>
            <li><a href="#actividades">Calendario de Actividades</a></li>
            <li><a href="#voluntarios">Unirse como Voluntario</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          <p>📍 Río Grande, Tierra del Fuego</p>
          <p>✉️ contacto@adoptaunaplaza.org</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Adoptá una Plaza. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
