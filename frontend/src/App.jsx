import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './global.css'
import './login.css'
import './App.css'

//-------servicios-----//
import { fetchPlazas } from './services/plazaService.js'
//-------plazas------//
import PlazasPage from './pages/PlazasPage.jsx'
import PlazaDetailPage from './pages/PlazaDetailPage.jsx'
import CoordinatorDashboard from './pages/CoordinatorDashboard.jsx'
import CoordActividades from './pages/CoordActividades.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import HomePage from './pages/HomePage.jsx'

function App() {
  

  const [user, setUser] = useState(null)
  const [plazas, setPlazas] = useState([])
  const [selectedPlaza, setSelectedPlaza] = useState(null)
  const [registerData, setRegisterData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()

    async function loadPlazas() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPlazas()
        setPlazas(data)
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

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) {
        setUser(JSON.parse(raw))
      }
    } catch (err) {
      // ignore parse errors
    }
  }, [])

  const handleBackDashBoard = () => {
    navigate('/coordinador')
  }

  // const handleSelectActividad = (actividad) => {
  //   setSelectedActividad(actividad)
  //   navigate(`/actividades/${actividad._id || actividad.id}`)
  // }

  const handleSelectPlaza = (plaza) => {
    setSelectedPlaza(plaza)
    navigate(`/plazas/${plaza._id || plaza.id}`)
  }

  const handleBackToPlazas = () => {
    navigate('/plazas')
  }

  const handleBackHome = () => {
    navigate('/')
  }

  const handleGoToRegister = () => {
    navigate('/registro')
  }

  const handleGoToLogin = () => {
    navigate('/login')
  }

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    if (userData?.rol === 'coordinador') {
      navigate('/coordinador')
    } else {
      navigate('/')
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleRegisterNext = (data) => {
    setRegisterData(data)
    navigate('/plazas')
  }

  return (
    <Routes>
      {/* Define your routes here */}
      <Route
        path="/"
        element={<HomePage onGoToPlazas={handleBackToPlazas} onGoToRegister={handleGoToRegister} onGoToLogin={handleGoToLogin} user={user} />} />

      <Route
        path="/login"
        element={<LoginPage onBackToHome={handleBackHome} onLogin={handleLogin} onGoToRegister={handleGoToRegister} />} />

      <Route
        path="/registro"
        element={<RegisterPage
        onBackToHome={handleBackHome}
        onNext={handleRegisterNext}
        plazas={plazas}
        loading={loading} />} />

      <Route path="/plazas" element={<PlazasPage
        plazas={plazas}
        loading={loading}
        error={error}
        onSelectPlaza={handleSelectPlaza}
        onBack={handleBackHome}
        onGoToHome={handleBackHome}
        onGoToLogin={handleGoToLogin}
        user={user} />} />

      <Route
        path="/plazas/:id"
        element={selectedPlaza ? (
          <PlazaDetailPage
            plaza={selectedPlaza}
            onBack={handleBackToPlazas}
            onGoToHome={handleBackHome}
            onGoToLogin={handleGoToLogin}
            user={user} />
        ) : (
          <Navigate to="/plazas" replace />
        )} />

      <Route path="*" element={<Navigate to="/" replace />} />

        
    </Routes>
  )
}

export default App
