import React from 'react'
import './LoginPage.css'

export default function LoginPage({ onBackToHome }) {
  return (
    <div className="login-page">
      <div className="login-shell">
        <section className="login-hero">
          <div>
            <span className="hero-badge">Plazas verdes • Comunidad activa</span>
            <h2>Tu espacio para cuidar y compartir el barrio</h2>
            <p>Accede para gestionar actividades, participar en iniciativas y conectar con tu comunidad.</p>
          </div>
          <div className="hero-footer">Adopta una plaza</div>
        </section>

        <section className="login-form">
          <button className="btn-link" type="button" onClick={onBackToHome}>
            ← Volver al inicio
          </button>

          <div className="form-header">
            <p className="eyebrow">Bienvenido de nuevo</p>
            <h1>Inicia sesión</h1>
            <p className="subtitle">Ingresa tus datos para continuar.</p>
          </div>

          <form className="login-form-fields">
            <div className="field">
              <span>✉️</span>
              <input type="email" placeholder="Correo electrónico" />
            </div>
            <div className="field">
              <span>🔒</span>
              <input type="password" placeholder="Contraseña" />
            </div>
            <button className="btn-primary" type="submit">Entrar</button>
            <div className="divider"><span>o</span></div>
            <a className="btn-secondary" href="#">Crear una cuenta</a>
          </form>

          <div className="extra-links">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
        </section>
      </div>
    </div>
  )
}
