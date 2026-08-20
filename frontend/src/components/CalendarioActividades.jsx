import React, { useState} from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './CalendarioActividades.css';

export default function CalendarioActividades({plazaIds}) {
    //cargamos el calendario en un estado inicial vacio.
    const [actividades, setActividades] = useState([]);
    //estado para saber si estamos buscando datos.
    const [cargando, setCargando] = useState(false);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

    const cargarActividades = async () => {
        setCargando(true);
        try {
            const response = await fetch(`/api/actividades/coordinador?plazaIds=${plazaIds}`);
            if (!response.ok) throw new Error('error al cargar Datos');
            const data = await response.json();

            setActividades(data);
        } catch (error) {
            console.error("Error trayendo actividades:", error);
        } finally {
            setCargando(false);
        }
    }

    //ejecutamos la funcion una vez, justodespues del primer renderizado.
    useEffect(() => {
        if (plazaIds) {
            cargarActividades();
        }
    }, [plazaIds]);

    // Lógica para formatear y comparar fechas (igual que veníamos usando)
  const formatFechaString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const tieneActividad = (date) => {
    const fechaString = formatFechaString(date);
    return actividades.some(act => act.fechaProgramada === fechaString);
  };

  return (
    <div className="calendario-container">
      <h2>Calendario de Jornadas</h2>
      
      {/* 4. El calendario siempre está visible, desde el milisegundo cero */}
      <Calendar
        onChange={setFechaSeleccionada}
        value={fechaSeleccionada}
        tileClassName={({ date }) => tieneActividad(date) ? 'dia-con-actividad' : null}
      />

      {/* Feedback visual de que los datos están viajando */}
      {cargando && <p className="mensaje-carga">Buscando actividades programadas...</p>}

      <div className="actividades-resumen">
          <h3>Actividades del {fechaSeleccionada.toLocaleDateString()}</h3>
          {/* Aquí mapeas las actividades del día seleccionado... */}
      </div>
    </div>
  );
    
    
}