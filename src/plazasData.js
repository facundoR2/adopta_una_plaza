// src/plazasData.js

let plazas = [
    {
        id: 1,
        nombre: "Plaza Almirante Brown",
        barrio: "Centro",
        estadoActual: "En progreso",
        progresoPorcentaje: 45, // Opcional del enunciado
        descripcion: "La plaza central de la ciudad, un espacio de encuentro histórico para las familias.",
        fotos: ["https://picsum.photos/id/1025/600/400"],
        votos: 0,
        integrantes: ["Equipo Eco-Jóvenes", "Vecinos del Centro"],
        tareas: [
            { id: 101, tipo: "Limpieza", descripcion: "Recolección de residuos generales", finalizada: true },
            { id: 102, tipo: "Pintura", descripcion: "Pintar los bancos de madera", finalizada: false },
            { id: 103, tipo: "Jardinería", descripcion: "Plantación de plantines autóctonos", finalizada: false }
        ],
        jornadas: [
            { fecha: "2026-06-20", hora: "10:00", tipo: "Pintura" },
            { fecha: "2026-06-27", hora: "14:00", tipo: "Jardinería" }
        ]
    },
    {
        id: 2,
        nombre: "Plaza Don Bosco",
        barrio: "Intevu",
        estadoActual: "Adoptada",
        progresoPorcentaje: 10,
        descripcion: "Espacio verde barrial que requiere restauración de luminarias y nuevos juegos.",
        fotos: ["https://picsum.photos/id/1043/600/400"],
        votos: 0,
        integrantes: ["Club Don Bosco", "Boy Scouts"],
        tareas: [
            { id: 201, tipo: "Limpieza", descripcion: "Desmalezado del sector trasero", finalizada: true },
            { id: 202, tipo: "Instalación de juegos", descripcion: "Colocación de hamacas nuevas", finalizada: false }
        ],
        jornadas: [
            { fecha: "2026-06-21", hora: "11:00", tipo: "Instalación de juegos" }
        ]
    },
    // Puedes autocompletar hasta las 10 plazas siguiendo este formato
    { id: 3, nombre: "Plaza de los Recuerdos", barrio: "AGP", estadoActual: "Disponible", progresoPorcentaje: 0, descripcion: "Plaza disponible para adopción.", fotos: [], votos: 0, integrantes: [], tareas: [], jornadas: [] },
    { id: 4, nombre: "Plaza Mafalda", barrio: "Chakra II", estadoActual: "Disponible", progresoPorcentaje: 0, descripcion: "Plaza disponible para adopción.", fotos: [], votos: 0, integrantes: [], tareas: [], jornadas: [] },
    { id: 5, nombre: "Plaza Capitán de Fragata Pedro Edgardo Giachino", barrio: "Malvinas Argentinas", estadoActual: "Disponible", progresoPorcentaje: 0, descripcion: "Plaza disponible para adopción.", fotos: [], votos: 0, integrantes: [], tareas: [], jornadas: [] },
    { id: 6, nombre: "Plaza del Delfín", barrio: "Mirador", estadoActual: "Disponible", progresoPorcentaje: 0, descripcion: "Plaza disponible para adopción.", fotos: [], votos: 0, integrantes: [], tareas: [], jornadas: [] },
    { id: 7, nombre: "Plaza De la Madre", barrio: "Buena Vista", estadoActual: "Disponible", progresoPorcentaje: 0, descripcion: "Plaza disponible para adopción.", fotos: [], votos: 0, integrantes: [], tareas: [], jornadas: [] },
    { id: 8, nombre: "Plaza Gaucho Rivero", barrio: "Mutual", estadoActual: "Disponible", progresoPorcentaje: 0, descripcion: "Plaza disponible para adopción.", fotos: [], votos: 0, integrantes: [], tareas: [], jornadas: [] },
    { id: 9, nombre: "Plaza Civica", barrio: "Perón", estadoActual: "Disponible", progresoPorcentaje: 0, descripcion: "Plaza disponible para adopción.", fotos: [], votos: 0, integrantes: [], tareas: [], jornadas: [] },
    { id: 10, nombre: "Plaza de los Animales", barrio: "Chakra XI", estadoActual: "Disponible", progresoPorcentaje: 0, descripcion: "Plaza disponible para adopción.", fotos: [], votos: 0, integrantes: [], tareas: [], jornadas: [] }
];

module.exports = plazas;