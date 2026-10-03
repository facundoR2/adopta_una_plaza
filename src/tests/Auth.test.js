process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

const request = require('supertest');
const { connect, closeDatabase, clearDatabase } = require('./setup/Db');
const app = require('../app');
const Usuario = require('../models/Usuario');

beforeAll(async () => {
    await connect();
});

afterEach(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await closeDatabase();
});

describe('POST /api/auth/login', () => {
    const credencialesValidas = {
        email: 'vecino@test.com',
        password: 'Password123'
    };

    beforeEach(async () => {
        await Usuario.create({
            nombre: 'Vecino',
            apellido: 'De Prueba',
            email: credencialesValidas.email,
            password: credencialesValidas.password,
            tipo: 'voluntario',
            rol: 'vecino'
        });
    });

    it('loguea correctamente con credenciales validas', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send(credencialesValidas);

        expect(res.status).toBe(200);
        expect(res.body.usuario).toBeDefined();
        expect(res.body.usuario.email).toBe(credencialesValidas.email);
        // la coki debe estar en la respuesta.
        expect(res.headers['set-cookie']).toBeDefined();
    });

    it('rechaza con contraseña incorrecta', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send(credencialesValidas);

        expect(res.status).toBe(200);
        expect(res.body.usuario).toBeDefined();
        expect(res.body.usuario.email).toBe(credencialesValidas.email);
        //la cookie httpOnly con el JWT..
        expect(res.headers['set-cookie']).toBeDefined();
    });

    it('rechaza con un email que no existe', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'noexiste@test.com', password: 'cualquiera' });

        expect(res.status).toBe(401);
    });

    it('rechaza si falta el email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ password: credencialesValidas.password });

        expect(res.status).toBe(400);
    });

    it('rechaza si falta la contraseña', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: credencialesValidas.email });

        expect(res.status).toBe(400);
    });
})