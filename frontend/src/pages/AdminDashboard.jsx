import React, { useEffect,useState } from 'react'
import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/pages/AdminDashboard.css';
import { getNoticiasAdmin } from '../services/noticiaService.js';
import ABMNoticias from '../components/ABMNoticias.jsx';
// import ABMJornadas from '../components/ABMJornadas.jsx';

export default function AdminDashboard({ user, onGoToHome, onGoToPlazas, onGoToLogin, onLogout }) {
  const [seccionActiva, setSeccionActiva] = useState('noticias'); // 'noticias' o 'jornadas'
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNoticiasAdmin();
      setNoticias(data);
    } catch (err) {
      console.error('Error cargando el dashboard de admin:', err);
      setError('No se pudieron cargar las noticias. Intentá de nuevo en unos segundos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [])

  return (
      <div className="admin-dashboard">
        <NavBar
            active="admin"
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
              <p className="eyebrow">Dashboard administrador</p>
              <h1>Bienvenido, {user?.nombre || 'Administrador'}</h1>
              <p className="hero-text">
                Gestioná las noticias del programa y las jornadas de trabajo comunitario.
              </p>
            </div>
            <div className="hero-actions">
              <button
                  className={seccionActiva === 'noticias' ? 'btn-primary' : 'btn-secondary'}
                  type="button"
                  onClick={() => setSeccionActiva('noticias')}
              >
                Gestionar Noticias
              </button>
              <button
                  className={seccionActiva === 'jornadas' ? 'btn-primary' : 'btn-secondary'}
                  type="button"
                  onClick={() => setSeccionActiva('jornadas')}
              >
                Gestionar Jornadas
              </button>
            </div>
          </section>

          {error && (
              <section className="dashboard-panel error-panel">
                <p className="texto-error">{error}</p>
              </section>
          )}

          {loading ? (
              <p className="texto-cargando">Cargando...</p>
          ) : (
              <>
                {seccionActiva === 'noticias' && (
                    <section className="dashboard-panel">
                      <ABMNoticias noticias={noticias} onActualizarLista={cargarDatos} />
                    </section>
                )}

                {seccionActiva === 'jornadas' && (
                    <section className="dashboard-panel">
                      <div className="panel-header">
                        <div>
                          <p className="eyebrow">Campañas</p>
                          <h2>Jornadas de trabajo</h2>
                        </div>
                      </div>
                      {/* Acá va <ABMJornadas /> cuando lo armemos */}
                      <p className="texto-cargando">Sección de jornadas — todavía sin implementar.</p>
                    </section>
                )}
              </>
          )}
        </main>
        <Footer onGoToPlazas={onGoToPlazas} />
      </div>
  )
}