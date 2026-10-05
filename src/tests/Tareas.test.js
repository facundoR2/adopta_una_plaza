process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

const request = require('supertest');
const { connect, closeDatabase, clearDatabase } = require('./setup/db');
const app = require('../app');
const Usuario = require('../models/Usuario');
const Plaza = require('../models/Plaza');
const Actividad = require('../models/Actividad');
const Adopcion = require('../models/Adopcion');

beforeAll(async () => {
    await connect();
});

afterEach(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await closeDatabase();
});

// --- Helpers ---

const crearUsuario = (email, rol = 'coordinador') => {
    return Usuario.create({
        nombre: 'Test',
        apellido: 'Usuario',
        email,
        password: 'Password123',
        tipo: 'voluntario',
        rol
    });
};

const loguear = async (email, password = 'Password123') => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email, password });
    return agent;
};

const crearPlazaYActividad = async (uId = 1) => {
    const plaza = await Plaza.create({ nombre: 'Plaza Test', barrio: 'Centro', uId });
    const actividad = await Actividad.create({
        nombre: 'Jornada de prueba',
        fechaProgramada: '2026-06-05',
        plaza: plaza._id,
        estado: 'pendiente'
    });
    return { plaza, actividad };
};

describe('PATCH /api/actividades/:id/tareas', () => {
    test('un coordinador con Adopcion activa de la plaza puede actualizar las tareas', async () => {
        const { plaza, actividad } = await crearPlazaYActividad(1);
        const coordinador = await crearUsuario('coord-dueno@test.com');
        await Adopcion.create({ usuario: coordinador._id, plaza: plaza._id, estado: 'activa' });

        const agente = await loguear('coord-dueno@test.com');
        const res = await agente.patch(`/api/actividades/${actividad._id}/tareas`).send({
            tareas: [
                { descripcion: 'Podar el sector norte', completada: false },
                { descripcion: 'Pintar bancos', completada: true }
            ]
        });

        expect(res.status).toBe(200);
        expect(res.body.tareas.length).toBe(2);
        expect(res.body.tareas[1].completada).toBe(true);
        // Mongoose debe haber asignado un _id propio a cada subdocumento nuevo
        expect(res.body.tareas[0]._id).toBeDefined();
    });

    test('un coordinador SIN Adopcion de esa plaza no puede tocar sus tareas', async () => {
        const { actividad } = await crearPlazaYActividad(2);
        await crearUsuario('coord-ajeno@test.com'); // no adoptó ninguna plaza

        const agente = await loguear('coord-ajeno@test.com');
        const res = await agente.patch(`/api/actividades/${actividad._id}/tareas`).send({
            tareas: [{ descripcion: 'Intento sin permiso' }]
        });

        expect(res.status).toBe(403);
    });

    test('un vecino no puede acceder, sin importar si tiene Adopcion (bloqueo a nivel de rol en la ruta)', async () => {
        const { plaza, actividad } = await crearPlazaYActividad(3);
        const vecino = await crearUsuario('vecino@test.com', 'vecino');
        await Adopcion.create({ usuario: vecino._id, plaza: plaza._id, estado: 'activa' });

        const agente = await loguear('vecino@test.com');
        const res = await agente.patch(`/api/actividades/${actividad._id}/tareas`).send({
            tareas: [{ descripcion: 'Un vecino no debería poder' }]
        });

        expect(res.status).toBe(403);
    });

    test('rechaza sin estar logueado', async () => {
        const { actividad } = await crearPlazaYActividad(4);

        const res = await request(app).patch(`/api/actividades/${actividad._id}/tareas`).send({
            tareas: [{ descripcion: 'Sin login' }]
        });

        expect(res.status).toBe(403);
    });

    test('rechaza si "tareas" no es un arreglo', async () => {
        const { plaza, actividad } = await crearPlazaYActividad(5);
        const coordinador = await crearUsuario('coord@test.com');
        await Adopcion.create({ usuario: coordinador._id, plaza: plaza._id, estado: 'activa' });

        const agente = await loguear('coord@test.com');
        const res = await agente.patch(`/api/actividades/${actividad._id}/tareas`).send({
            tareas: 'esto no es un array'
        });

        expect(res.status).toBe(400);
    });

    test('rechaza si la actividad no existe', async () => {
        const coordinador = await crearUsuario('coord-fantasma@test.com');
        const agente = await loguear('coord-fantasma@test.com');

        const idInexistente = '64b000000000000000000000';
        const res = await agente.patch(`/api/actividades/${idInexistente}/tareas`).send({
            tareas: [{ descripcion: 'No debería guardarse' }]
        });

        expect(res.status).toBe(404);
    });

    test('permite agregar una tarea nueva sin sacar las que ya existían', async () => {
        const { plaza, actividad } = await crearPlazaYActividad(6);
        const coordinador = await crearUsuario('coord2@test.com');
        await Adopcion.create({ usuario: coordinador._id, plaza: plaza._id, estado: 'activa' });

        const agente = await loguear('coord2@test.com');

        // Primero cargamos una tarea
        await agente.patch(`/api/actividades/${actividad._id}/tareas`).send({
            tareas: [{ descripcion: 'Tarea original' }]
        });

        // Releemos la actividad para tomar el _id real que Mongoose le asignó
        const actividadConTarea = await Actividad.findById(actividad._id);
        const tareaExistente = actividadConTarea.tareas[0].toObject();

        // Mandamos la existente + una nueva
        const res = await agente.patch(`/api/actividades/${actividad._id}/tareas`).send({
            tareas: [tareaExistente, { descripcion: 'Tarea nueva' }]
        });

        expect(res.status).toBe(200);
        expect(res.body.tareas.length).toBe(2);
        expect(res.body.tareas.map(t => t.descripcion)).toEqual(
            expect.arrayContaining(['Tarea original', 'Tarea nueva'])
        );
    });
});