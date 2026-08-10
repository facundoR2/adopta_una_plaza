import React, { useEffect, useRef } from 'react'
import NavBar from '../components/NavBar.jsx'
import Footer from '../components/Footer.jsx'

export default function PlazaDetailPage({ plaza, onBack, onGoToHome, onGoToLogin, user }) {
  useEffect(() => {
    void import('../cards.css')
  }, [])

  const tasks = [
    {
      title: 'Pintar bancos',
      participants: 20,
      detail: 'Renovar los bancos y mejorar el entorno del parque.',
    },
    {
      title: 'Limpieza: área de juegos',
      participants: 5,
      detail: 'Recoger basura y ordenar el espacio infantil.',
    },
    {
      title: 'Limpieza: zona de tierra',
      participants: 10,
      detail: 'Preparar el terreno y retirar escombros.',
    },
  ]

  const pending = [
    { title: 'Colocar plantas', participants: 8, detail: 'Agregar macetas y arbustos en veredas.' },
    { title: 'Reparar luminarias', participants: 3, detail: 'Arreglar y reemplazar focos quemados.' },
    { title: 'Sembrar césped', participants: 12, detail: 'Reparar parches con tierra y semilla.' },
    { title: 'Instalar bancos', participants: 6, detail: 'Colocar 3 bancos nuevos en la entrada.' },
  ]

  const trackRef = useRef(null)

  const scrollBy = (offset) => {
    if (!trackRef.current) return
    trackRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  const completedTrackRef = useRef(null)

  const scrollCompleted = (offset) => {
    if (!completedTrackRef.current) return
    completedTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <div className="detail-page">
      <NavBar active="detail" onGoToHome={onGoToHome} onGoToPlazas={onBack} onGoToLogin={onGoToLogin} user={user} />
      <button className="btn-link" type="button" onClick={onBack}>
        ← Volver a plazas
      </button>

      <section className="detail-hero">
        <div className="detail-image" />
        <div className="detail-title-block">
          <span className="eyebrow">{plaza.barrio}</span>
          <h1>{plaza.nombre}</h1>
          <div className="detail-meta">
            <div>
              <span>UID</span>
              <strong>{plaza.uId}</strong>
            </div>
            <div>
              <span>Votos</span>
              <strong>{plaza.votos ?? 0}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-content">
        <div className="detail-section-header">
          <h2>Tareas completadas</h2>
          <p>Estas son las actividades recientes de esta plaza.</p>
        </div>

        <div className="tasks-carousel small-carousel">
          <button
            type="button"
            className="carousel-btn carousel-prev"
            onClick={() => scrollCompleted(-240)}
            aria-label="Anterior"
          >
            ‹
          </button>

          <div className="tasks-track" ref={completedTrackRef}>
            {tasks.map((task) => (
              <article key={task.title} className="task-card xsmall">
                <div className="task-card-image" />
                <div className="task-card-body">
                  <h3>{task.title}</h3>
                  <p>{task.detail}</p>
                </div>
                <div className="task-card-footer">
                  <span>{task.participants} participantes</span>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="carousel-btn carousel-next"
            onClick={() => scrollCompleted(240)}
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>

        <div className="detail-section-header" style={{ marginTop: 28 }}>
          <h2>Tareas pendientes</h2>
          <p>Pequeño carrusel con las tareas pendientes de la plaza.</p>
        </div>

        <div className="tasks-carousel">
          <button
            type="button"
            className="carousel-btn carousel-prev"
            onClick={() => scrollBy(-280)}
            aria-label="Anterior"
          >
            ‹
          </button>

          <div className="tasks-track" ref={trackRef}>
            {pending.map((t) => (
              <article key={t.title} className="task-card small">
                <div className="task-card-image" />
                <div className="task-card-body">
                  <h3>{t.title}</h3>
                  <p>{t.detail}</p>
                </div>
                <div className="task-card-footer">
                  <span>{t.participants} participantes</span>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="carousel-btn carousel-next"
            onClick={() => scrollBy(280)}
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </section>
      <Footer onGoToPlazas={onBack} />
    </div>
  )
}
