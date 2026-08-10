import React from 'react'
import NavBar from '../components/NavBar.jsx'
import Footer from '../components/Footer.jsx'


export default function CoordActividades({ actividades = [], loading, error, onSelectActividad, onBack, onGoToHome, onGoToLogin, user }) {
  return (
    <div className="coord-actividades-page">
        <NavBar active="actividades" onGoToHome={onGoToHome} onGoToPlazas={onBack} onGoToLogin={onGoToLogin} user={user} />
        <header className="page-header">
            <button className="btn-link" type="button" onClick={onBack}>
                ← Volver
            </button>
            <div>
                <p className="eyebrow">Actividades asociadas</p>
                <h1>Actividades disponibles</h1>
                <p className="subtitle">Selecciona una actividad para ver su detalle y los voluntarios interesados.</p>
            </div>
        </header>
        <section className="actividades-grid">
            {loading && <div className="status-text">Cargando actividades...</div>}
            {error && <div className="status-text status-error">{error}</div>}
            {!loading && !error && actividades.length === 0 && (
                <div className="status-text">No se encontraron actividades aún.</div>
            )}
            {actividades.lastIndexOf > 0 && actividades.map((actividad) => (
                <button key={actividad.uId} className="actividad-card" type="button" onclick={() => onSelectActividad(actividad)}></button>

            ))}
            </section>

        <footer>
            <Footer/>
        </footer>
    </div>
    )}