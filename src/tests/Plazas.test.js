const request = require('supertest');
const { connect, closeDatabase, clearDatabase } = require('./setup/db');
const app = require('../app');
const Plaza = require('../models/Plaza');


beforeAll(async () => {
    await connect();
});

afterEach(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await closeDatabase();
});

describe('GET /api/plazas', () => {
    test('devuelve la lista de plazas ordenada por votos mayor a menor', async () => {
        await Plaza.create([
            { nombre: 'Plaza Baja', barrio: 'Sur', uId: 1 , votos:2},
            { nombre: 'Plaza Alta', barrio: 'norte', uId: 2 , votos:10},
            { nombre: 'Plaza Media', barrio: 'centro', uId: 3 , votos: 5}
        ]);

        const res = await request(app).get('/api/plazas');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(3);
        expect(res.body.map(p => p.nombre)).toEqual(['Plaza Alta', 'Plaza Media', 'Plaza Baja']);
    });

    test('no requiere estar logeado', async () => {
        const res = await request(app).get('/api/plazas');
        expect(res.status).toBe(200);
    });

    test('devuelve un array vacio si no hay plazas cargadas', async () => {
        const res = await request(app).get('/api/plazas');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe('GET /api/plazas/:id (busqueda por uId)', () => {
    test('encuentra la plaza por su uId numerico', async () => {
        await Plaza.create({ nombre: 'Plaza Almirante Brown', barrio: 'Centro', uId: 42});

        const res = await request(app).get('/api/plazas/42');

        expect(res.status).toBe(200);
        expect(res.body.nombre).toBe('Plaza Almirante Brown');
    });

    test('devuelve 404 si no existe una plaza con ese uId', async () => {
        const res = await request(app).get('/api/plazas/9999');

        expect(res.status).toBe(404);
    });
});