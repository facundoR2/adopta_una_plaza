import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/usuarioService.js';


const AuthContext = createContext(null)

export function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const raw = localStorage.getItem('user');
            if (raw) {
                setUser(JSON.parse(raw));
            }
        } catch (error) {
            //si llego aca, algo paso con el json.
            localStorage.removeItem('user');
        } finally {
            setLoadingUser(false);
        }
    }, [])


    const login = (userData) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData));
        if(userData?.rol === 'coordinador') {
            navigate('/dashboard-coordinador');
        } else if (userData?.rol === 'administrador') {
            navigate('/dashboard-admin');
        } else {
            navigate('/dashboard-vecino');
        }
    }

    const logout = async() => {
        try {
            await logoutUser();
        } catch (err) {
            console.error('Error al cerrar sesion', err);
        } finally {
            setUser(null)
            localStorage.removeItem('user');
            navigate('/');
        }
    }

    const value = {
        user,
        loadingUser,
        isAuthenticated: !user,
        rol: user?.rol ?? null,
        login,
        logout,
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(context === null) {
        throw new Error('useAuth debe usarse dentro de un authprovider');
    }
    return context;
}