import React, { useEffect } from 'react'
import NavBar from '../components/NavBar.jsx'
import Footer from '../components/Footer.jsx'

export default function PlazaDetailPage({ plaza, onBack, onGoToHome }) {
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

  return (
    <div className="detail-page">
      <NavBar active="detail" onGoToHome={onGoToHome} onGoToPlazas={onBack} />
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

        <div className="tasks-grid">
          {tasks.map((task) => (
            <article key={task.title} className="task-card">
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
      </section>
      <Footer onGoToPlazas={onBack} />
    </div>
  )
}
