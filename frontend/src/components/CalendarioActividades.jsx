import React, { useEffect, useState} from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import '../styles/components/CalendarioActividades.css';

export default function CalendarioActividades({ actividades = [], userRole, onSelectFecha }) {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (actividades) {
        setLoading(false);
      }
    }, [actividades]);

    const formatFechaString = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }


  
    const getClaseEstadoDia = (date) => {
      const fechaString = formatFechaString(date);
      const actsDelDia = actividades.filter(act => act.fechaProgramada === fechaString);
      if (actsDelDia.length === 0) return null;

      const estados = actsDelDia.map(a => a.estado);

      if (estados.includes('en_proceso')) return 'dia-en-proceso';
      if (estados.includes('pendiente')) return 'dia-pendiente';
      if (estados.every(e => e === 'cancelada')) return 'dia-cancelada';
      if (estados.every(e => e === 'completada')) return 'dia-completada';

      return 'dia-con-actividad';
    };

    const handleDateChange = (date) => {
    setFechaSeleccionada(date);
    if (onSelectFecha) {
      const fechaString = formatFechaString(date);
      const actividadesDelDia = actividades.filter(a => a.fechaProgramada === fechaString);
      onSelectFecha(date, actividadesDelDia);
    }
  };
  
  const fechaStrActual = formatFechaString(fechaSeleccionada);
  const actividadesDelDia = actividades.filter(a => a.fechaProgramada === fechaStrActual);
    
  return (
    <div className="calendario-container">
      <div className="calendario-header">
        <h2>Calendario de Jornadas</h2>
        {/* Feedback visual de que los datos están viajando */}
        {loading && <span className="mensaje-carga">Buscando actividades programadas...</span>}
      </div>
      <div className="calendario-layout">
        <div className="calendario-columna-izq">
          {/* 4. El calendario siempre está visible, desde el milisegundo cero */}
          <Calendar
            onChange={handleDateChange}
            value={fechaSeleccionada}
            tileClassName={({ date }) => getClaseEstadoDia(date)}
          />
        </div>
        <div className="actividades-resumen">
        <h3>Actividades del {fechaSeleccionada.toLocaleDateString()}</h3>
        {actividadesDelDia.length === 0 ? (
          <p className="texto-sin-actividad">No hay actividades programadas para este dia.</p>
        ) : (
          actividadesDelDia.map(act => (
            <div key={act._id} className={`actividad-item-card estado-${act.estado || 'pendiente'}`}>
              <div className="card-header-info">
                <h4>{act.nombre || 'Actividad Programada'}</h4>
                <span className={`badge-estado ${act.estado}`}>
                  {act.estado ? act.estado.replace('_', ' ') : 'Pendiente'}
                </span>
              </div>
              
              <p className="plaza-nombre"> {act.plaza?.nombre || 'Plaza asignada'}</p>

              <div className="tareas-contenedor">
                <h5>Tareas a completar</h5>
                {act.tareas && act.tareas.length > 0 ? (
                  <ul className="lista-tareas">
                    {act.tareas.map(tarea => (
                      <li key={tarea._id} className="tarea-item">
                        <label>
                          <input type="checkbox" defaultChecked={tarea.completada} onChange={() => console.log('Cambiar estado de tarea:', tarea._id)} />
                          <span className={tarea.completada ? 'tachado' : ''}>
                            {tarea.descripcion}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                  ) : (
                  <p className="sin-tareas">No hay tareas especificas para esta actividad.</p>
                  )}
              </div>
            </div>
          ))
        )}
      </div>

      </div>
      
    </div>
  );   
}