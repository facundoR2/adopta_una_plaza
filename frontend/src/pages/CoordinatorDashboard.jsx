import React from 'react'
import NavBar from '../components/NavBar.jsx'
import Footer from '../components/Footer.jsx'
import './CoordinatorDashboard.css'

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

          <div className="activity-grid">
            <div className="calendar-card">
              <div className="calendar-header">
                <h3>Calendario</h3>
                <span>Sep 2025</span>
              </div>
              <div className="calendar-body">
                <div className="calendar-row">
                  <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
                </div>
                <div className="calendar-days">
                  {Array.from({ length: 35 }, (_, index) => (
                    <button key={index} type="button" className={`calendar-day ${index === 10 ? 'selected' : ''}`}>
                      {index < 30 ? index + 1 : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="task-columns">
              <div className="today-card">
                <div className="section-label">activ. para hoy</div>
                <div className="task-list">
                  {actividadesHoy.map((actividad) => (
                    <article key={actividad.id} className="task-item">
                      <div>
                        <h3>{actividad.title}</h3>
                        <p>{actividad.detail}</p>
                      </div>
                      <span className={`status-badge status-${actividad.status.toLowerCase().replace(' ', '-')}`}>
                        {actividad.status}
                      </span>
                    </article>
                  ))}
                </div>
              </div>

              <div className="scheduled-card">
                <div className="section-label">activ. agendadas</div>
                <div className="schedule-list">
                  {actividadesAgendadas.map((actividad) => (
                    <article key={actividad.id} className="schedule-item">
                      <h3>{actividad.title}</h3>
                      <p>{actividad.time}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onGoToPlazas={onGoToPlazas} />
    </div>
  )
}
