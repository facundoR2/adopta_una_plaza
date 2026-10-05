process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

const request = require('supertest');
const { connect, closeDatabase, clearDatabase } = require('./setup/db');
const app = require('../app');
const Usuario = require('../models/Usuario');
const Plaza = require('../models/Plaza');
const Actividad = require('../models/Actividad');
const Adopcion = require('../models/Adopcion');
const Avance = require('../models/Avance');

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

const crearUsuario = (email, rol = 'vecino') => {
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

const crearPlazaYActividad = async () => {
    const plaza = await Plaza.create({ nombre: 'Plaza Test', barrio: 'Centro', uId: 1 });
    const actividad = await Actividad.create({
        nombre: 'Jornada de prueba',
        fechaProgramada: '2026-06-05',
        plaza: plaza._id,
        estado: 'pendiente'
    });
    return { plaza, actividad };
};

describe('POST /api/avances', () => {
    test('un usuario con Adopcion activa de la plaza puede subir un avance', async () => {
        const { actividad, plaza } = await crearPlazaYActividad();
        const usuario = await crearUsuario('vecino-adoptante@test.com');
        await Adopcion.create({ usuario: usuario._id, plaza: plaza._id, estado: 'activa' });

        const agente = await loguear('vecino-adoptante@test.com');
        const res = await agente.post('/api/avances').send({
            actividad: actividad._id,
            texto: 'Pintamos los bancos del sector norte',
            fotos: ['https://ejemplo.com/foto1.jpg']
        });

        expect(res.status).toBe(201);
        expect(res.body.texto).toBe('Pintamos los bancos del sector norte');
        expect(res.body.fotos.length).toBe(1);
        expect(res.body.usuario.nombre).toBeDefined();
    });

    test('un usuario SIN Adopcion de esa plaza no puede subir el avance', async () => {
        const { actividad } = await crearPlazaYActividad();
        await crearUsuario('vecino-ajeno@test.com'); // nunca adoptó ninguna plaza

        const agente = await loguear('vecino-ajeno@test.com');
        const res = await agente.post('/api/avances').send({
            actividad: actividad._id,
            texto: 'Intento sin permiso'
        });

        expect(res.status).toBe(403);
    });

    test('rechaza sin estar logueado', async () => {
        const { actividad } = await crearPlazaYActividad();

        const res = await request(app).post('/api/avances').send({
            actividad: actividad._id,
            texto: 'Sin login'
        });

        expect(res.status).toBe(403);
    });

    test('rechaza si falta el id de actividad', async () => {
        const usuario = await crearUsuario('vecino@test.com');
        const agente = await loguear('vecino@test.com');

        const res = await agente.post('/api/avances').send({
            texto: 'Sin actividad asociada'
        });

        expect(res.status).toBe(400);
    });

    test('rechaza si no hay texto ni fotos', async () => {
        const { actividad, plaza } = await crearPlazaYActividad();
        const usuario = await crearUsuario('vecino-vacio@test.com');
        await Adopcion.create({ usuario: usuario._id, plaza: plaza._id, estado: 'activa' });

        const agente = await loguear('vecino-vacio@test.com');
        const res = await agente.post('/api/avances').send({
            actividad: actividad._id
        });

        expect(res.status).toBe(400);
    });

    test('rechaza si la actividad no existe', async () => {
        const usuario = await crearUsuario('vecino-fantasma@test.com');
        const agente = await loguear('vecino-fantasma@test.com');

        const idInexistente = '64b000000000000000000000'; // ObjectId válido pero inexistente
        const res = await agente.post('/api/avances').send({
            actividad: idInexistente,
            texto: 'Actividad que no existe'
        });

        expect(res.status).toBe(404);
    });

    test('un coordinador también puede subir avances si tiene Adopcion activa', async () => {
        const { actividad, plaza } = await crearPlazaYActividad();
        const coordinador = await crearUsuario('coordinador@test.com', 'coordinador');
        await Adopcion.create({ usuario: coordinador._id, plaza: plaza._id, estado: 'activa' });

        const agente = await loguear('coordinador@test.com');
        const res = await agente.post('/api/avances').send({
            actividad: actividad._id,
            texto: 'Avance subido por el coordinador'
        });

        expect(res.status).toBe(201);
    });
});

describe('GET /api/avances/actividad/:actividadId', () => {
    test('devuelve los avances de la actividad, más recientes primero', async () => {
        const { actividad, plaza } = await crearPlazaYActividad();
        const usuario = await crearUsuario('vecino@test.com');
        await Adopcion.create({ usuario: usuario._id, plaza: plaza._id, estado: 'activa' });

        await Avance.create({ actividad: actividad._id, usuario: usuario._id, texto: 'Primer avance' });
        await Avance.create({ actividad: actividad._id, usuario: usuario._id, texto: 'Segundo avance' });

        const agente = await loguear('vecino@test.com');
        const res = await agente.get(`/api/avances/actividad/${actividad._id}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body[0].texto).toBe('Segundo avance'); // el más nuevo primero
    });

    test('devuelve un array vacío si la actividad no tiene avances', async () => {
        const { actividad } = await crearPlazaYActividad();
        const usuario = await crearUsuario('vecino@test.com');
        const agente = await loguear('vecino@test.com');

        const res = await agente.get(`/api/avances/actividad/${actividad._id}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});