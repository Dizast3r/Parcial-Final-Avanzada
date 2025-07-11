/**
 * Funcionalidad para mostrar los suscriptores del canal del usuario
 * @authors Jorge Miguel Méndez Barón, Jose David Cucanchon Ramirez, Edgar Julian Roldan Rojas
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Menú hamburguesa y dropdown ---
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const menuDropdown = document.getElementById('menuDropdown');
    const goInicio = document.getElementById('goInicio');
    const cerrarSesion = document.getElementById('cerrarSesion');

    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDropdown.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
        if (!menuDropdown.contains(e.target) && e.target !== hamburgerBtn) {
            menuDropdown.classList.remove('show');
        }
    });
    goInicio.addEventListener('click', () => {
        window.location.href = 'principal.html';
    });
    cerrarSesion.addEventListener('click', () => {
        localStorage.removeItem('nickname');
        localStorage.removeItem('userId');
        localStorage.removeItem('usuario');
        alert('Sesión cerrada correctamente.');
        window.location.href = 'login.html';
    });

    // --- Cargar suscriptores del canal ---
    const suscriptoresGrid = document.getElementById('suscriptoresGrid');
    const usuarioId = obtenerUsuarioIdActual();

    /**
     * Carga la lista de suscriptores del usuario actual
     * @async
     * @function cargarSuscriptores
     * @throws {Error} Error al cargar suscriptores desde el servidor
     * @returns {Promise<void>} Renderiza los suscriptores en la interfaz
     */
    async function cargarSuscriptores() {
        try {
            const res = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/${usuarioId}/suscriptores`);
            const suscriptores = await res.json();
            renderSuscriptores(suscriptores);
        } catch (e) {
            suscriptoresGrid.innerHTML = '<div style="color:#fff;">No se pudieron cargar los suscriptores.</div>';
        }
    }

    function renderSuscriptores(suscriptores) {
        suscriptoresGrid.innerHTML = '';
        if (!Array.isArray(suscriptores) || suscriptores.length === 0) {
            suscriptoresGrid.innerHTML = '<div style="color:#fff;">No tienes suscriptores.</div>';
            return;
        }
        suscriptores.forEach(suscriptor => {
            const card = document.createElement('div');
            card.className = 'suscriptor-card';
            card.innerHTML = `
                <div class="suscriptor-avatar">${suscriptor.nickname.charAt(0).toUpperCase()}</div>
                <div class="suscriptor-nickname">${suscriptor.nickname}</div>
            `;
            suscriptoresGrid.appendChild(card);
        });
    }

    function obtenerUsuarioIdActual() {
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) {
            const usuario = JSON.parse(usuarioData);
            return usuario.id || localStorage.getItem('userId');
        }
        return localStorage.getItem('userId');
    }

    cargarSuscriptores();
});
