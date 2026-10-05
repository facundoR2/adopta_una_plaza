import test from 'node:test';
import assert from 'node:assert/strict';
import { registerUser } from '../services/usuarioService.js';

test('registerUser envía la solicitud de registro al endpoint correcto', async () => {
  const originalFetch = global.fetch;
  let capturedUrl;
  let capturedOptions;

  global.fetch = async (url, options) => {
    capturedUrl = url;
    capturedOptions = options;

    return {
      ok: true,
      json: async () => ({ ok: true }),
    };
  };

  try {
    const result = await registerUser({
      nombre: 'Ana',
      apellido: 'Pérez',
      email: 'ana@example.com',
      password: '123456',
    });

    assert.equal(capturedUrl, '/api/auth/registro');
    assert.equal(capturedOptions.method, 'POST');
    assert.equal(capturedOptions.headers['Content-Type'], 'application/json');
    assert.equal(JSON.parse(capturedOptions.body).email, 'ana@example.com');
    assert.equal(result.ok, true);
  } finally {
    global.fetch = originalFetch;
  }
});
