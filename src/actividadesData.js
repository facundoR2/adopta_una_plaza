const actividadesIniciales = [
    {
        nombre: "Jornada de Riego y Limpieza",
        fechaProgramada: "2026-07-15",
        estado: "pendiente",
        plazaUId: 1, // Relación temporal con la Plaza Almirante Brown (uId: 1)
        tareas: [
            { descripcion: "Regar plantines autóctonos", completada: false },
            { descripcion: "Recolección de residuos secos", completada: false }
        ]
    },
    {
        nombre: "Pintura de Bancos y Juegos",
        fechaProgramada: "2026-07-20",
        estado: "pendiente",
        plazaUId: 2, // Relación temporal con la Plaza Don Bosco (uId: 2)
        tareas: [
            { descripcion: "Lijar superficies de madera", completada: false },
            { descripcion: "Aplicar pintura sintética verde", completada: false }
        ]
    }
];

module.exports = actividadesIniciales;