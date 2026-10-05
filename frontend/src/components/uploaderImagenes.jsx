import React, { useState } from 'react';
import { subirImagen, subirImagenes } from '../services/Cloudinaryservice.js';


export default function SubidorImagenes({ valor, onChange, multiple = false, folder}) {
    const [subiendo, setSubiendo] = useState(false);

    const urls = multiple ? (valor || []) : (valor ? [valor] : []);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files || []);
        if ( files.length === 0) return;
        setSubiendo(true);
        try{
            if (multiple) {
                const nuevasUrls = await subirImagenes(files, folder);
                onChange([...(valor || []), ...nuevasUrls]);
            } else {
                const url = await subirImagen(files[0], folder);
                onChange(url);
            }
        } catch (error) {
            console.error('Error al subir imagen:', error);
            alert(error.message);
        } finally {
            setSubiendo(false);
            e.target.value = ''; // permite volver a elegir el mismo archivo.
        }
    };

    const handleQuitar = (urlAQuitar) => {
        if (multiple) {
            onChange((valor || []).filter((u) => u !== urlAQuitar));
        } else {
            onChange('');
        }
    };

    return (
        <div className="subidor-imagenes">
            <input
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileChange}
                disabled={subiendo}
            />
            {subiendo && <p className="form-hint">Subiendo imagen{multiple ? 'es' : ''}...</p>}

            {urls.length > 0 && (
                <div className="preview-grid">
                    {urls.map((url) => (
                        <div key={url} className="preview-item">
                            <img src={url} alt="Vista previa" />
                            <button type="button" className="preview-quitar" onClick={() => handleQuitar(url)}>
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}