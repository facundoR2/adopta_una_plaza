import React from 'react'
import NavBar from '../components/NavBar.jsx'
import Footer from '../components/Footer.jsx'
import './CoordinatorDashboard.css'
import CalendarioActividades from '../components/CalendarioActividades.jsx'

const noticias = [
  {
    id: 1,
    title: 'Nueva revista de plaza verde',
    subtitle: '20 asociados',
    description: 'Propuesta de acciones comunitarias para la próxima jornada.',
  },
  {
    id: 2,
    title: 'Se agrega cancha de básquet',
    subtitle: '20 asociados',
    description: 'Espacio deportivo para jóvenes y familias del barrio.',
  },
  {
    id: 3,
    title: 'Descubren grafitis críticos',
    subtitle: '20 asociados',
    description: 'Intervenciones artísticas y propuestas de mantenimiento.',
  },
]

const actividadesHoy = [
  { id: 1, title: 'Limpiar sendero', detail: 'Recorrer y levantar residuos', status: 'Completada' },
  { id: 2, title: 'Seleccionar plantas', detail: 'Elegir especies nativas', status: 'En progreso' },
  { id: 3, title: 'Reparar juegos', detail: 'Revisar estructura y pintar', status: 'Planificada' },
]

const actividadesAgendadas = [
  { id: 1, title: 'Reparar juegos espacio 02', time: 'mañana 10:30 hs' },
  { id: 2, title: 'Poda paso', time: 'viernes 15:00 hs' },
  { id: 3, title: 'Arreglar dispenser de agua caliente', time: 'lunes 09:00 hs' },
]

export default function CoordinatorDashboard({ user, onGoToHome, onGoToPlazas, onGoToLogin, onLogout }) {
  const [actividades, setActividades] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [loading, setLoading] = useState(true);

 
  return (
    <div className="coordinator-dashboard">
      <NavBar
        active="coordinator"
        onGoToHome={onGoToHome}
        onGoToPlazas={onGoToPlazas}
        onGoToLogin={onGoToLogin}
        onGoToCoordinator={() => {}}
        onLogout={onLogout}
        user={user}
      />

      <main className="dashboard-container">
        <section className="dashboard-hero">
          <div className="hero-copy">
            <p className="eyebrow">Dashboard coordinador</p>
            <h1>Bienvenido, {user?.name || 'Coordinador'}</h1>
            <p className="hero-text">
              Gestiona noticias, actividades y el progreso de las plazas desde un solo lugar.
            </p>
          </div>
          <div className="hero-actions">
            <button className="btn-secondary" type="button">
              Gestionar actividades
            </button>
            <button className="btn-primary" type="button">
              Nueva actividad
            </button>
          </div>
        </section>

        <section className="dashboard-panel news-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Noticias y blogs</p>
              <h2>Publicaciones recientes</h2>
            </div>
            <button className="btn-primary" type="button">
              Crear Noticia
            </button>
          </div>

          <div className="news-grid">
            {noticias.map((noticia) => (
              <article key={noticia.id} className="news-card">
                <div className="news-card-image" />
                <div className="news-card-body">
                  <h3>{noticia.title}</h3>
                  <p className="news-card-meta">{noticia.subtitle}</p>
                  <p>{noticia.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-panel activity-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Actividades y progresos</p>
              <h2>Resumen de los próximos días</h2>
            </div>
            <div className="action-buttons">
              <button className="btn-secondary" type="button">
                Gestionar actividades
              </button>
              <button className="btn-primary" type="button">
                Nueva actividad
              </button>
            </div>
          </div>

          {/* <div className="activity-grid">
            <div className="sideBar-columna-derecha">
              <CalendarioActividades
                actividades={actividades}
                userRole={user?.rol || 'vecino'}
                onSelectFecha={(fecha, lista) => console.log('Selecciono:', fecha, lista)}
              />
            </div>
          </div> */}
        </section>
      </main>

      <Footer onGoToPlazas={onGoToPlazas} />
    </div>
  )
}
