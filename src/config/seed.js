const Plaza = require('../models/Plaza');
const Actividad = require('../models/Actividad'); // Importamos el modelo Actividad
const plazasIniciales = require('../plazasData');
const Usuario = require('../models/Usuario');
const actividadesIniciales = require('../actividadesData'); // Importamos los datos de actividades

async function sembrarDatos() {
    try {
        // 1. Contamos cuántas plazas existen en la colección
        const cantidadUsuarios = await Usuario.countDocuments();
        const cantidadPlazas = await Plaza.countDocuments();
        if (cantidadUsuarios === 0) {
            console.log('\n---No se han encontrado base de Usuarios. Inciando Sembrado de Usuarios... ---');

        }

        if (cantidadPlazas === 0) {
            console.log('\n--- La base de datos está vacía. Iniciando sembrado automático... ---');

            // 2. Insertamos las plazas y guardamos el array resultante (con los _id reales de MongoDB)
            const plazasGuardadas = await Plaza.insertMany(plazasIniciales);
            console.log(`=== Éxito: Se sembraron ${plazasGuardadas.length} plazas iniciales ===`);

            // 3. Vinculamos dinámicamente las actividades con los _id generados
            const actividadesConPlazaId = actividadesIniciales.map(actividad => {
                // Buscamos la plaza guardada que coincida con el uId de la actividad
                const plazaCorrespondiente = plazasGuardadas.find(p => p.uId === actividad.plazaUId);

                return {
                    nombre: actividad.nombre,
                    fechaProgramada: actividad.fechaProgramada,
                    estado: actividad.estado,
                    tareas: actividad.tareas,
                    plaza: plazaCorrespondiente ? plazaCorrespondiente._id : null // Inyectamos el ObjectId real
                };
            });

            // 4. Insertamos las actividades en MongoDB
            await Actividad.insertMany(actividadesConPlazaId);
            console.log(`=== Éxito: Se sembraron ${actividadesConPlazaId.length} actividades vinculadas ===\n`);

        } else {
            // Contamos las actividades actuales solo para informar en el log
            const cantidadActividades = await Actividad.countDocuments();
            console.log(`\n--- Seed omitido: Ya existen ${cantidadPlazas} plazas y ${cantidadActividades} actividades guardadas. ---\n`);
        }
    } catch (error) {
        console.error('⚠️ Error al verificar o sembrar la base de datos:', error.message);
    }
}

module.exports = sembrarDatos;