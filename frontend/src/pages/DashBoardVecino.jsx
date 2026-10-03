import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';
import CalendarioActividades from '../components/CalendarioActividades.jsx';
import AvanceFormulario from '../components/AvanceFormulario.jsx';
import { getMisActividades } from '../services/actividadService.js';
import { getAvancesPorActividad } from '../services/avanceService.js';
import '../styles/pages/DashboardVecino.css';
 
export default function DashBoardVecino({ user, onGoToHome, onGoToPlazas, onGoToLogin, onLogout }) {
  const [actividades, setActividades] = useState([]);
  const [plaza, setPlaza] = useState(null); // el vecino/grupo tiene una sola plaza adoptada
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [avances, setAvances] = useState([]);
  const [cargandoAvances, setCargandoAvances] = useState(false);
 
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [misActividades, misPlazas] = await Promise.all([
        getMisActividades(),
        getMisPlazas()
      ]);
      setActividades(misActividades);
      setPlaza(misPlazas[0] || null);
    } catch (err) {
      console.error('Error cargando el dashboard de vecino:', err);
      setError('No se pudieron cargar tus datos. Intentá de nuevo en unos segundos.');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    cargarDatos();
  }, [])
 
  const abrirActividad = async (actividad) => {
    setActividadSeleccionada(actividad);
    setCargandoAvances(true);
    try {
      const data = await getAvancesPorActividad(actividad._id);
      setAvances(data);
    } catch (err) {
      console.error(err);
      setAvances([]);
    } finally {
      setCargandoAvances(false);
    }
  };
 
  const cerrarModal = () => {
    setActividadSeleccionada(null);
    setAvances([]);
  };
 
  const handleAvanceCreado = () => {
    // Refresca la lista de avances de la actividad abierta, sin cerrar el modal
    if (actividadSeleccionada) abrirActividad(actividadSeleccionada);
  };
 
  return (
    <div className="vecino-dashboard">
      <NavBar
        active="vecino"
        onGoToHome={onGoToHome}
        onGoToPlazas={onGoToPlazas}
        onGoToLogin={onGoToLogin}
        onLogout={onLogout}
        user={user}
      />
 
      <main className="dashboard-container">
        <section className="dashboard-hero">
          <div className="hero-copy">
            <p className="eyebrow">Dashboard vecino</p>
            <h1>Bienvenido, {user?.nombre || 'Vecino'}</h1>
            {plaza ? (
              <p className="hero-text">
                Tu plaza adoptada es <strong>{plaza.nombre}</strong> ({plaza.barrio}).
              </p>
            ) : (
              <p className="hero-text">Todavía no adoptaste ninguna plaza.</p>
            )}
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
          <section className="dashboard-panel activity-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Jornadas de trabajo</p>
                <h2>Actividades de tu plaza</h2>
              </div>
            </div>
 
            <CalendarioActividades
              actividades={actividades}
              userRole={user?.rol || 'vecino'}
              onSelectFecha={(fecha, lista) => {
                if (lista.length === 1) abrirActividad(lista[0]);
              }}
            />
 
            <div className="lista-actividades-vecino" style={{ marginTop: '1.5rem' }}>
              {actividades.length === 0 ? (
                <p className="no-data">Todavía no hay actividades programadas para tu plaza.</p>
              ) : (
                actividades.map((act) => (
                  <div key={act._id} className="actividad-item-card">
                    <div className="card-header-info">
                      <h4>{act.nombre}</h4>
                      <span className={`badge-estado ${act.estado}`}>{act.estado}</span>
                    </div>
                    <p className="plaza-nombre">{act.fechaProgramada}</p>
                    <button className="btn-secondary" type="button" onClick={() => abrirActividad(act)}>
                      📤 Ver y subir avances
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>
 
      {/* --- MODAL: avances de la actividad seleccionada --- */}
      {actividadSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>📤 Avances: {actividadSeleccionada.nombre}</h3>
 
            <AvanceFormulario
              actividadId={actividadSeleccionada._id}
              onAvanceCreado={handleAvanceCreado}
            />
 
            <div className="avances-lista" style={{ marginTop: '1.5rem' }}>
              <h4>Avances subidos</h4>
              {cargandoAvances ? (
                <p className="texto-cargando">Cargando avances...</p>
              ) : avances.length === 0 ? (
                <p className="no-data">Todavía no hay avances subidos para esta actividad.</p>
              ) : (
                avances.map((avance) => (
                  <div key={avance._id} className="avance-item">
                    <p className="avance-autor">
                      <strong>{avance.usuario?.nombre || 'Usuario'}</strong>
                      {' — '}
                      {avance.createdAt ? new Date(avance.createdAt).toLocaleDateString() : ''}
                    </p>
                    {avance.texto && <p>{avance.texto}</p>}
                    {avance.fotos?.length > 0 && (
                      <div className="preview-imagenes">
                        {avance.fotos.map((url, i) => (
                          <img key={url + i} src={url} alt={`Avance ${i + 1}`} style={{ maxWidth: '120px', borderRadius: '8px' }} />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
 
            <div className="modal-actions">
              <button className="btn-cancel" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
 
      <Footer onGoToPlazas={onGoToPlazas} />
    </div>
  )
}