import React from 'react'
import NavBar from '../components/NavBar.jsx'
import Footer from '../components/Footer.jsx'

export default function HomePage({ onGoToPlazas, onGoToRegister, onGoToLogin, user }) {
  return (
    <div className="home-page">
      <NavBar active="home" onGoToHome={() => {}} onGoToPlazas={onGoToPlazas} onGoToLogin={onGoToLogin} user={user} />

      <main className="page-container">
        <section className="card-section hero-section">
          <h2>Adoptá una Plaza</h2>
          <p>Sumate a transformar los espacios verdes de Río Grande junto a tus vecinos.</p>
          <div className="home-actions">
            <button className="btn-primary" type="button" onClick={onGoToPlazas}>
              Ver plazas
            </button>
            <button className="btn-secondary" type="button">
              Ver actividades
            </button>
            <button className="btn-tertiary" type="button" onClick={onGoToRegister}>
              Registrarme
            </button>
          </div>
        </section>

        <section className="card-section">
          <h2 className="section-title">¿Cómo funciona el sitio?</h2>

          <div className="steps-wrapper">
            <div className="step-item">
              <div className="step-content">
                <span className="step-badge">Paso 1</span>
                <h3 className="step-title">Explorá y Votá en el Ranking</h3>
                <p className="step-description">Conocé las plazas de la ciudad que necesitan mantenimiento y votalas en tiempo real para acelerar su adopción.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-content">
                <span className="step-badge">Paso 2</span>
                <h3 className="step-title">Formá un Grupo de Voluntarios</h3>
                <p className="step-description">Registrate con tus vecinos para organizar cuadrillas de trabajo y apadrinar el espacio verde de tu barrio.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-content">
                <span className="step-badge">Paso 3</span>
                <h3 className="step-title">Participá en las Jornadas de Mantenimiento</h3>
                <p className="step-description">Consultá el calendario de actividades, completá los checklists de tareas y subí los avances.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onGoToPlazas={onGoToPlazas} />
    </div>
  )
}