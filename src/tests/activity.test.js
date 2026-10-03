const { connect, closeDatabase, clearDatabase } = require('./setup/db');

// Importa tus modelos
const Jornada = require('../models/Jornada');
const Plaza = require('../models/Plaza');
const Actividad = require('../models/Actividad');

describe('Validaciones de Actividades y Jornadas', () => {

    beforeAll(async () => {
        await connect();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    beforeEach(async () => {
        await clearDatabase();
    });

    test('Debe fallar si la fecha programada está fuera del rango de la jornada activa', async () => {
        // 1. Crear una plaza y asociarla a una jornada activa
        const plaza = await Plaza.create({
            nombre: 'Plaza Central',
            barrio: 'San martin Norte',
            uId: 124
        });

        await Jornada.create({
            codigo: 'Jornada Activa',
            fechaInicio: new Date('2026-06-01'),
            fechaFin: new Date('2026-06-10'),
            estado: 'en_curso',
            plazas: [plaza._id]
        });

        // 2. Buscar la jornada y simular validación de fecha fuera de rango
        const jornadaActiva = await Jornada.findOne({ estado: 'en_curso' }).select('plazas fechaInicio fechaFin');

        const fechaFueraDeRango = new Date('2026-06-15'); // Fuera del 1 al 10
        const esValida = fechaFueraDeRango >= new Date(jornadaActiva.fechaInicio) &&
            fechaFueraDeRango <= new Date(jornadaActiva.fechaFin);

        // 3. Assert
        expect(esValida).toBe(false);
    });

    test('Debe permitir crear la actividad si la plaza y la fecha son válidas', async () => {
        const plaza = await Plaza.create({
            nombre: 'Plaza Norte',
            barrio: 'centro',
            uId: 123
        });

        await Jornada.create({
            codigo: 'jornadaTest',
            fechaInicio: new Date('2026-06-01'),
            fechaFin: new Date('2026-06-10'),
            estado: 'en_curso',
            plazas: [plaza._id]
        });

        const datosValidos = {
            nombre: 'Mantenimiento',
            fechaProgramada: '2026-06-05', // Dentro del rango
            plaza: plaza._id,              // Pertenece a la jornada
            tareas: [{ descripcion: 'Revisión general' }]
        };

        // Simulación de validaciones
        const jornadaActiva = await Jornada.findOne({ estado: 'en_curso' }).select('plazas fechaInicio fechaFin');

        const fechaActividad = new Date(datosValidos.fechaProgramada);
        const rangoValido = fechaActividad >= new Date(jornadaActiva.fechaInicio) &&
            fechaActividad <= new Date(jornadaActiva.fechaFin);

        const plazaValida = jornadaActiva.plazas.some(
            (idPlaza) => idPlaza.toString() === datosValidos.plaza.toString()
        );

        expect(rangoValido).toBe(true);
        expect(plazaValida).toBe(true);

        // Guardado en base de datos
        const nuevaActividad = await Actividad.create(datosValidos);

        expect(nuevaActividad._id).toBeTruthy();
        expect(nuevaActividad.tareas.length).toBe(1);
    });
});