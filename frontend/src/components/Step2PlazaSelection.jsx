// src/components/Step2PlazaSelection.jsx
import { useState, useEffect } from 'react';
import { registerUser } from '../services/usuarioService';
import { useNavigate } from 'react-router-dom';

export default function Step2PlazaSelection({ data, updateFields, onBack, onRegisterSuccess }) {
    const [plazas, setPlazas] = useState([]);
    const [loadingPlazas, setLoadingPlazas] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Cargar las plazas disponibles desde el backend si no vienen por props
    useEffect(() => {
        async function fetchPlazas() {
            try {
                const response = await fetch('/api/plazas');
                const dataPlazas = await response.json();
                setPlazas(dataPlazas);
                setLoadingPlazas(false);
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar las plazas disponibles.');
                setLoadingPlazas(false);
            }
        }
        fetchPlazas();
    }, []);

    const handleSelectPlaza = (plazaId) => {
        updateFields({ plazaId });
    };

    const handleSubmitRegistro = async () => {
        if (!data.plazaId) {
            setError('Debes seleccionar una plaza para poder adoptar y finalizar el registro.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            // Envía el objeto global unificado (nombre, apellido, email, password, esGrupo, plazaId)
            await registerUser({ nombre: data.nombre, apellido: data.apellido, email: data.email, password: data.password, esGrupo: data.esGrupo, plazaId: data.plazaId });
            alert('¡Registro y adopción exitosos! 🎉');
            navigate('/dashboard-vecino');

            
            if (onRegisterSuccess) {
                onRegisterSuccess();
            }

        } catch (err) {
            console.error(err);
            setError(err.message || 'Ocurrió un error al procesar el registro.');
            setSubmitting(false);
        }
    };

    return (
        <div className="plaza-selection-container" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h2>Paso 2: Elegí una Plaza para Adoptar</h2>
            <p>Selecciona el espacio verde que tu comunidad o tú desean cuidar:</p>

            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            {loadingPlazas ? (
                <p>Cargando plazas disponibles...</p>
            ) : (
                <div className="plazas-grid" style={{ display: 'grid', gap: '1rem', margin: '1.5rem 0', textAlign: 'left' }}>
                    {plazas.map((plaza) => {
                        const isSelected = data.plazaId === plaza._id || data.plazaId === plaza.uId;
                        return (
                            <div
                                key={plaza._id || plaza.uId}
                                onClick={() => handleSelectPlaza(plaza._id || plaza.uId)}
                                style={{
                                    padding: '1rem',
                                    border: isSelected ? '2px solid #4CAF50' : '1px solid #ccc',
                                    borderRadius: '8px',
                                    backgroundColor: isSelected ? '#E8F5E9' : '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                <h3>{plaza.nombre}</h3>
                                <p>Barrio: {plaza.barrio || 'Zona céntrica'}</p>
                                <small>{isSelected ? '✅ Plaza seleccionada' : 'Haz clic para seleccionar'}</small>
                            </div>
                        );
                    })}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button type="button" onClick={onBack} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Volver atrás
                </button>
                <button
                    type="button"
                    onClick={handleSubmitRegistro}
                    disabled={submitting || !data.plazaId}
                    style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px' }}
                >
                    {submitting ? 'Registrando...' : 'Completar Registro'}
                </button>
            </div>
        </div>
    );
}