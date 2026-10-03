import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './styles/global.css'
import './login.css'
import './App.css'

//-------servicios-----//
import { fetchPlazas } from './services/plazaService.js'
//----auth------//
import { useAuth } from './context/AuthContext.jsx'
//-------plazas------//
import PlazasPage from './pages/PlazasPage.jsx'
import PlazaDetailPage from './pages/PlazaDetailPage.jsx'
//------coord------//
import CoordinatorDashboard from './pages/CoordinatorDashboard.jsx'
import CoordActividades from './pages/CoordActividades.jsx'
import DashBoardVecino  from './pages/DashBoardVecino.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import HomePage from './pages/HomePage.jsx'
import { logoutUser } from './services/usuarioService.js'
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  const { user, login, logout } = useAuth();
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

  const handleSelectPlaza = (plaza) => {
    navigate(`/plazas/${plaza.uId ?? plaza._id}`)
  }

  const handleBackToPlazas = () => {
    navigate('/plazas')
  };

  const handleBackHome = () => {
    navigate('/')
  };

  const handleGoToDashboard = () => {
      if (user?.rol === 'coordinador') {
          navigate('/dashboard-coordinador');
      } else if (user?.rol === 'administrator') {
          navigate('/dashboard-admin');
      } else {
          navigate('/dashboard-vecino');
      }
  };

  const handleGoToRegister = () => {
    navigate('/registro')
  }

  const handleGoToLogin = () => {
    navigate('/login')
  }

  const handleRegisterNext = (data) => {
    setRegisterData(data)
    navigate('/plazas')
  }

  return (
    <Routes>
      { /* Define your routes here */ }
      <Route path="/" element={<HomePage 
          onGoToPlazas={handleBackToPlazas}
          onGoToRegister={handleGoToRegister}
          onGoToLogin={handleGoToLogin}
          onGoToDashboard={handleGoToDashboard}
          onLogout={logout}
          user={user}
        /> } />

      <Route path="/login" element={<LoginPage
          onBackToHome={handleBackHome}
          onGoToRegister={handleGoToRegister}
          onLogin={login}
          /> } />
      <Route path="/registro" element={<RegisterPage
            onBackToHome={handleBackHome}
            onRegisterSuccess={(finalData) => {
              console.log("Registro completo:", finalData);
              navigate('/login');
            }}
            plazas={plazas}
            loading={loading}
          /> } />
      <Route path="/dashboard-vecino" element={<DashBoardVecino
            user={user}
            onGoToHome={handleBackHome}
            onGoToPlazas={handleBackToPlazas}
            onGoToLogin={handleGoToLogin}
            onGoToDashboard={handleGoToDashboard}
            onLogout={logout}
          /> } />
      <Route path='/dashboard-coordinador' element={<CoordinatorDashboard
            onLogout={logout}
            onGoToDashboard={handleGoToDashboard}
            user={user}
          /> } />
      <Route path='/dashboard-admin' element={<AdminDashboard
          onLogout={logout}
          onGoToDashboard={handleGoToDashboard}
          user={user}
          /> } />

      <Route path="/plazas" element={<PlazasPage
        plazas={plazas}
        loading={loading}
        error={error}
        onSelectPlaza={handleSelectPlaza}
        onBack={handleBackHome}
        onGoToHome={handleBackHome}
        onGoToLogin={handleGoToLogin}
        onGoToDashboard={handleGoToDashboard}
        user={user} />} />

      <Route path="/plazas/:id" element={
        <PlazaDetailPage
          plazas={plazas}
          onBack={handleBackToPlazas}
          onGoToHome={handleBackHome}
          onGoToLogin={handleGoToLogin}
          onGoToDashboard={handleGoToDashboard}
          user={user}
        />
      } />
        

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

export default App
