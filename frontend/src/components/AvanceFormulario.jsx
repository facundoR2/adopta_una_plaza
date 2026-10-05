import React, { useState } from 'react';
import SubidorImagenes from './uploaderImagenes.jsx';
import { crearAvance } from '../services/avanceService.js';

export default function AvanceFormulario({ actividadId, onAvanceCreado }) {
    const [texto, setTexto] = useState('');
    const [fotos, setFotos] = useState([]);
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!texto.trim() && fotos.length === 0) {
            alert('Agrega un texto o almenos una foto para subir el avance.');
            return;
        }

        setEnviando(true);
        try {
            await crearAvance({ actividad: actividadId, texto, fotos });
            alert('Avance subido con exito!');
            setTexto('');
            setFotos([]);
            if (onAvanceCreado) onAvanceCreado();
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setEnviado(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="avance-form">
            <div className="form-group">
                <label>Contanos como te fue en la jornada</label>
                <textarea
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Ej: pintamos bancos de sector norte y limpiamos los juegos..."
                    rows={4}
                />
            </div>

            <div className="form-group">
                <SubidorImagenes
                    valor={fotos}
                    onChange={setFotos}
                    multiple
                    folder="avances"
                />
            </div>

            <button type="submit" className="btn-save" disabled={enviando}>
                {enviando ? 'Subiendo...' : 'Subir Avance'}
            </button>
        </form>
    );
}