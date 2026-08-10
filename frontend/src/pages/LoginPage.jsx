import React from 'react'
import './LoginPage.css'

export default function LoginPage({ onBackToHome, onLogin, onGoToRegister }) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [role, setRole] = React.useState('vecino')

  const handleSubmit = (event) => {
    event.preventDefault()
    const usuario = {
      nombre: email.split('@')[0] || 'Usuario',
      email,
      rol: role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0] || 'U')}&background=3BA051&color=fff`,
    }
    localStorage.setItem('user', JSON.stringify(usuario))
    onLogin(usuario)
  }

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

          <form className="login-form-fields" onSubmit={handleSubmit}>
            <div className="field">
              <span>✉️</span>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="field">
              <span>🔒</span>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="role-select-label">Soy:</label>
              <select value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="vecino">Vecino</option>
                <option value="coordinador">Coordinador</option>
              </select>
            </div>
            <button className="btn-primary" type="submit">Entrar</button>
            <div className="divider"><span>o</span></div>
            <button className="btn-secondary" type="button" onClick={onGoToRegister}>
              Crear una cuenta
            </button>
          </form>

          <div className="extra-links">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
        </section>
      </div>
    </div>
  )
}
