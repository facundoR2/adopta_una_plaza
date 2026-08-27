import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/pages/CoordinatorDashboard.css';
import CalendarioActividades from '../components/CalendarioActividades.jsx';
import { getCoordActivitys, getMisPlazas } from '../services/actividadService.js';
import ABMactividades from '../components/ABMactividades.jsx';
import ABMtareas from '../components/ABMtareas.jsx';

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

export default function CoordinatorDashboard({ user, onGoToHome, onGoToPlazas, onGoToLogin, onLogout }) {
  const [actividades, setActividades] = useState([]);
  const [plazasCoordinador, setPlazasCoordinador] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vistaActividades, setVistaActividades] = useState(false);
  const [vistaTareas, setVistaTareas] = useState('calendario'); //calendario o gestion.

  const cargarDatos = async() => {
    setLoading(true);
    setError(null);
    try {
      const [dataActividades, plazas] = await Promise.all([
        getCoordActivitys(),
        getMisPlazas()
      ]);
      setActividades(dataActividades.actividades || [] );
      setPlazasCoordinador(plazas || []);
    } catch (error) {
      console.error("Error cargando el dashboard:", error);
      setError('No se pudo cargar las actividades. Intenta denuevo en unos segundos');
    } finally {
       setLoading(false);
    }
  };
  
  useEffect(() => {
    cargarDatos();
  }, []); //array vacio para que se ejecute una vez al cargar pagina.
 
  return (
    <div className="coordinator-dashboard">
      <NavBar
        active="coordinator"
        onGoToHome={onGoToHome}
        onGoToPlazas={onGoToPlazas}
        onGoToLogin={onGoToLogin}
        onLogout={onLogout}
        user={user}
      />

      <main className="dashboard-container">
        {/*------seccion HERO--------- */}
        <section className="dashboard-hero">
          <div className="hero-copy">
            <p className="eyebrow">Dashboard coordinador</p>
            <h1>Bienvenido, {user?.nombre || 'Coordinador'}</h1>
            <p className="hero-text">
              Gestiona noticias, actividades y el progreso de las plazas desde un solo lugar.
            </p>
          </div>
          <div className="hero-actions">
            {/*Control de visibilidad de abm */}
            <button className={vistaActividades ? "btn-primary" : "btn-secondary"} type="button"
            onClick={() => setVistaActividades(!vistaActividades)}>
              {vistaActividades ? 'ocultar Gestion de Actividades' : 'Gestionar actividades'}
            </button>
            <button className="btn-primary" type="button" onClick={() => setVistaActividades(true)}>
              Nueva actividad
            </button>
          </div>
        </section>

        {error && (
          <section className='dashboard-panel error-panel'>
            <p className='texto-error'>{error}</p>
          </section> 
        )}
        {vistaActividades && (
          <section className='dashboard-panel'>
            <ABMactividades 
              actividades={actividades}
              plazas={plazasCoordinador}
              onActualizarLista={cargarDatos}
            />
          </section>
        )}

        <section className="dashboard-panel news-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Noticias y blogs</p>
              <h2>Publicaciones recientes</h2>
            </div>
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
              <h2>Seguimiento de Tareas</h2>
            </div>
            <div className="action-buttons">
              <button className={vistaTareas === 'calendario' ? 'btn-primary' : 'btn-secondary'}
              type='button' onClick={() => setVistaTareas('calendario')}>Ver actividades (calendario)</button>
              <button className={vistaTareas === 'abm-tareas' ? 'btn-primary' : 'btn-secondary'}
              type='button' onClick={() => setVistaTareas('abm-tareas')}>Gestionar Tareas</button>
            </div>
          </div>

          {loading ? (
            <p className='texto-cargando'>Cargando actividades...</p>
          ) : (
            <div className='contenido-dinamico'>
              {vistaTareas === 'calendario' && (
                <CalendarioActividades
                  actividades={actividades}
                  userRole={user?.rol || 'coordinador'}
                  onSelectFecha={(fecha, lista) => console.log('Selecciono:', fecha, lista)}
                />
              )}
              {vistaTareas === 'abm-tareas' && (
              <ABMtareas actividades={actividades} onActualizarLista={cargarDatos} />
              )}
            </div>
          )}
        </section>
      </main>
      <Footer onGoToPlazas={onGoToPlazas} />
    </div>
  )
}
