import React, { useEffect } from 'react'
import NavBar from '../components/NavBar.jsx'
import Footer from '../components/Footer.jsx'

export default function PlazasPage({ plazas = [], loading, error, onSelectPlaza, onBack, onGoToHome, onGoToLogin, user }) {
  useEffect(() => {
    void import('../cards.css')
  }, [])

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('PlazasPage props', { plazasLength: plazas.length, loading, error })
  }, [plazas, loading, error])

  return (
    <div className="plazas-page">
      <NavBar active="plazas" onGoToHome={onGoToHome} onGoToPlazas={onBack} onGoToLogin={onGoToLogin} user={user} />
      <header className="page-header">
        <button className="btn-link" type="button" onClick={onBack}>
          ← Volver
        </button>
        <div>
          <p className="eyebrow">Plazas asociadas</p>
          <h1>Ranking de las 10 plazas</h1>
          <p className="subtitle">Haz click en una plaza para ver el detalle y sus votos.</p>
        </div>
      </header>

      <section className="plazas-grid">
        {loading && <div className="status-text">Cargando plazas...</div>}
        {error && <div className="status-text status-error">{error}</div>}
        {!loading && !error && plazas.length === 0 && (
          <div className="status-text">No se encontraron plazas aún.</div>
        )}
        {plazas.length > 0 && plazas.map((plaza) => (
          <button
            key={plaza.uId}
            className="plaza-card"
            type="button"
            onClick={() => onSelectPlaza(plaza)}
          >
            <div
              className="plaza-card-image"
              style={plaza.imagen ? { backgroundImage: `url(${plaza.imagen})` } : undefined}
            >
              <h2 className="plaza-image-title">{plaza.nombre}</h2>
            </div>

            <div className="plaza-card-body">
              <span className="plaza-id">#{plaza.uId}</span>
              <p>{plaza.barrio}</p>
            </div>

            <div className="plaza-card-footer">
              <span>{plaza.votos ?? 0} votos</span>
              <span className="arrow">→</span>
            </div>
          </button>
        ))}
      </section>
      <Footer onGoToPlazas={onBack} />
    </div>
  )
}
