// src/components/Step1Form.jsx
import { useState } from 'react';
import { validateStep1 } from '../utils/validators';
import { checkEmailExists } from '../services/usuarioService'; // Asegúrate de tener este servicio configurado

export default function Step1Form({ data, updateFields, onNext }) {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        updateFields({ [name]: val });
    };

    const handleNextStep = async (e) => {
        e.preventDefault();
        setServerError('');

        // 1. Validaciones locales con el módulo externo
        const validationErrors = validateStep1(data);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        // 2. Validación asíncrona: Comprobar si el email ya existe en la BD
        setLoading(true);
        try {
            const emailExists = await checkEmailExists(data.email);
            
            if (emailExists) {
                setServerError('Este correo electrónico ya se encuentra registrado en el sistema.');
                setLoading(false);
                return;
            }

            // Si pasa todas las validaciones, avanzamos al paso 2
            setLoading(false);
            onNext();
        } catch (error) {
            console.error(error);
            setServerError('Error al verificar el correo en el servidor. Intenta de nuevo.');
            setLoading(false);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2>Paso 1: Datos de Registro</h2>
            
            {serverError && <p style={{ color: 'red', fontWeight: 'bold' }}>{serverError}</p>}

            <form onSubmit={handleNextStep}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={data.nombre}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                    {errors.nombre && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.nombre}</span>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label>Apellido:</label>
                    <input
                        type="text"
                        name="apellido"
                        value={data.apellido}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                    {errors.apellido && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.apellido}</span>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label>Correo Electrónico:</label>
                    <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                    {errors.email && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.email}</span>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                    {errors.password && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.password}</span>}
                </div>

                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        name="esGrupo"
                        id="esGrupo"
                        checked={data.esGrupo}
                        onChange={handleChange}
                    />
                    <label htmlFor="esGrupo">¿Te registras en representación de un grupo de vecinos?</label>
                </div>

                <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    {loading ? 'Verificando...' : 'Siguiente: Elegir Plaza'}
                </button>
            </form>
        </div>
    );
}