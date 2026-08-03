import { useEffect, useState } from 'react'
import './global.css'
import './login.css'
import './App.css'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import PlazasPage from './pages/PlazasPage.jsx'
import PlazaDetailPage from './pages/PlazaDetailPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

function HomePage({ onGoToPlazas }) {
  return (
    <div className="home-page">
      <NavBar active="home" onGoToHome={() => {}} onGoToPlazas={onGoToPlazas} />

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




function App() {
  const [view, setView] = useState('home')
  const [plazas, setPlazas] = useState([])
  const [selectedPlaza, setSelectedPlaza] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Debug: log app state changes to help trace missing home render
    // Check browser console for these messages when running the frontend
    // eslint-disable-next-line no-console
    console.log('APP STATE', { view, selectedPlaza, loading, error, plazasLength: plazas.length })
  }, [view, selectedPlaza, loading, error, plazas])

  useEffect(() => {
    const controller = new AbortController()

    async function loadPlazas() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/plazas/', { signal: controller.signal })
        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de plazas')
        }
        const data = await response.json()
        setPlazas(data.slice(0, 10))
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError('Error cargando plazas. Revisa tu conexión o la API.')
          console.error(fetchError)
        }
      } finally {
        setLoading(false)
      }
    }

    loadPlazas()
    return () => controller.abort()
  }, [])

  const handleSelectPlaza = (plaza) => {
    setSelectedPlaza(plaza)
    setView('detail')
  }

  const handleBackToPlazas = () => setView('plazas')
  const handleBackHome = () => setView('home')

    if (view === 'login') {
      return <LoginPage onBackToHome={handleBackHome} />
    }

  if (view === 'detail' && selectedPlaza) {
    return <PlazaDetailPage plaza={selectedPlaza} onBack={handleBackToPlazas} onGoToHome={handleBackHome} />
  }

  if (view === 'plazas') {
    return (
      <PlazasPage
        plazas={plazas}
        loading={loading}
        error={error}
        onSelectPlaza={handleSelectPlaza}
        onBack={handleBackHome}
        onGoToHome={handleBackHome}
      />
    )
  }

  return <HomePage onGoToPlazas={() => setView('plazas')} />
}

export default App
