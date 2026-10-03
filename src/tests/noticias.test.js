process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';

const request = require('supertest');
const { connect, closeDatabase, clearDatabase } = require('./setup/db');
const app = require('../app');
const Usuario = require('../models/Usuario');
const Noticia = require('../models/Noticia');

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

const crearUsuario = (rol) => {
    return Usuario.create({
        nombre: 'Test',
        apellido: 'Usuario',
        email: `${rol}@test.com`,
        password: 'Password123',
        tipo: 'voluntario',
        rol
    });
};

// Un agent de supertest guarda la cookie httpOnly entre requests,
// así podemos loguear una vez y reusar la sesión en varios pedidos.
const loguear = async (email, password = 'Password123') => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email, password });
    return agent;
};

describe('POST /api/noticias', () => {
    test('un admin puede crear una noticia', async () => {
        await crearUsuario('administrador');
        const agenteAdmin = await loguear('administrador@test.com');

        const res = await agenteAdmin.post('/api/noticias/new').send({
            titulo: 'Nueva jornada',
            descripcion: 'Descripción de prueba',
            imagen: 'https://ejemplo.com/foto.jpg',
            publicado: true
        });

        expect(res.status).toBe(201);
        expect(res.body.titulo).toBe('Nueva jornada');
        expect(res.body.publicado).toBe(true);
    });

    test('un vecino NO puede crear una noticia', async () => {
        await crearUsuario('vecino');
        const agenteVecino = await loguear('vecino@test.com');

        const res = await agenteVecino.post('/api/noticias/new').send({
            titulo: 'Intento no autorizado',
            descripcion: 'No debería poder crear esto'
        });

        expect(res.status).toBe(403);
    });

    test('rechaza la creación sin estar logueado', async () => {
        const res = await request(app).post('/api/noticias/new').send({
            titulo: 'Sin login',
            descripcion: 'No autenticado'
        });

        expect(res.status).toBe(403);
    });

    test('rechaza si falta el título', async () => {
        await crearUsuario('administrador');
        const agenteAdmin = await loguear('administrador@test.com');

        const res = await agenteAdmin.post('/api/noticias/new').send({
            descripcion: 'Sin título'
        });

        expect(res.status).toBe(400);
    });
});

describe('GET /api/noticias (pública)', () => {
    test('solo devuelve noticias publicadas', async () => {
        const admin = await crearUsuario('administrador');
        await Noticia.create([
            { titulo: 'Publicada', descripcion: 'Visible', publicado: true, autor: admin._id },
            { titulo: 'Borrador', descripcion: 'No visible', publicado: false, autor: admin._id }
        ]);

        const res = await request(app).get('/api/noticias');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].titulo).toBe('Publicada');
    });

    test('no requiere estar logueado', async () => {
        const res = await request(app).get('/api/noticias');
        expect(res.status).toBe(200);
    });
});

describe('GET /api/noticias/admin', () => {
    test('un admin ve todas las noticias, publicadas y borradores', async () => {
        const admin = await crearUsuario('administrador');
        await Noticia.create([
            { titulo: 'Publicada', descripcion: 'Visible', publicado: true, autor: admin._id },
            { titulo: 'Borrador', descripcion: 'No visible', publicado: false, autor: admin._id }
        ]);

        const agenteAdmin = await loguear('administrador@test.com');
        const res = await agenteAdmin.get('/api/noticias/admin');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    test('un vecino no puede ver el listado de admin', async () => {
        await crearUsuario('vecino');
        const agenteVecino = await loguear('vecino@test.com');

        const res = await agenteVecino.get('/api/noticias/admin');
        expect(res.status).toBe(403);
    });
});

describe('PUT /api/noticias/:id — publicar / despublicar', () => {
    test('un admin puede despublicar una noticia', async () => {
        const admin = await crearUsuario('administrador');
        const noticia = await Noticia.create({
            titulo: 'A despublicar',
            descripcion: 'Texto',
            publicado: true,
            autor: admin._id
        });

        const agenteAdmin = await loguear('administrador@test.com');
        const res = await agenteAdmin.put(`/api/noticias/${noticia._id}`).send({ publicado: false });

        expect(res.status).toBe(200);
        expect(res.body.publicado).toBe(false);
    });

    test('un vecino no puede editar una noticia', async () => {
        const admin = await crearUsuario('administrador');
        const noticia = await Noticia.create({
            titulo: 'Protegida',
            descripcion: 'Texto',
            publicado: true,
            autor: admin._id
        });

        await crearUsuario('vecino');
        const agenteVecino = await loguear('vecino@test.com');

        const res = await agenteVecino.put(`/api/noticias/${noticia._id}`).send({ publicado: false });
        expect(res.status).toBe(403);
    });
});

describe('DELETE /api/noticias/:id', () => {
    test('un admin puede eliminar una noticia', async () => {
        const admin = await crearUsuario('administrador');
        const noticia = await Noticia.create({
            titulo: 'A eliminar',
            descripcion: 'Texto',
            autor: admin._id
        });

        const agenteAdmin = await loguear('administrador@test.com');
        const res = await agenteAdmin.delete(`/api/noticias/${noticia._id}`);

        expect(res.status).toBe(200);

        const buscada = await Noticia.findById(noticia._id);
        expect(buscada).toBeNull();
    });

    test('un vecino no puede eliminar una noticia', async () => {
        const admin = await crearUsuario('administrador');
        const noticia = await Noticia.create({
            titulo: 'Protegida',
            descripcion: 'Texto',
            autor: admin._id
        });

        await crearUsuario('vecino');
        const agenteVecino = await loguear('vecino@test.com');

        const res = await agenteVecino.delete(`/api/noticias/${noticia._id}`);
        expect(res.status).toBe(403);

        const sigueExistiendo = await Noticia.findById(noticia._id);
        expect(sigueExistiendo).not.toBeNull();
    });
});