// src/public/main.js
const socket = io();
const container = document.getElementById('ranking-container');

// Escuchar el evento que envía el servidor con el ranking
socket.on('ranking_actualizado', (rankingPlazas) => {
    container.innerHTML = ''; // Limpiar la pantalla

    rankingPlazas.forEach((plaza) => {
        const card = document.createElement('div');
        card.className = 'plaza-card';

        // REMODELACIÓN: Quitamos el onclick="" y usamos data-id para guardar de forma segura el ID de la plaza
        card.innerHTML = `
            <div>
                <strong>${plaza.nombre}</strong> (${plaza.barrio}) <br>
                <span>Estado: ${plaza.estadoActual}</span>
            </div>
            <div>
                <span style="margin-right: 15px;">⭐ <b>${plaza.votos}</b> votos</span>
                <button class="btn-votar" data-id="${plaza.id}">Votar</button>
            </div>
        `;
        container.appendChild(card);
    });
});

// ESCUCHA DE EVENTOS SEGURA (Delegación de eventos)
// Escuchamos cualquier clic dentro del contenedor, si el elemento tiene la clase 'btn-votar', extraemos su data-id.
container.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('btn-votar')) {
        const plazaId = event.target.getAttribute('data-id');
        emitirVoto(plazaId);
    }
});

function emitirVoto(id) {
    socket.emit('votar_plaza', id);
}

socket.on('error_votacion', (mensaje) => {
    alert(mensaje);
});