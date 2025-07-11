// --- Suscripciones: barra de menú, canales y videos ---
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
        localStorage.removeItem('token');
        localStorage.removeItem('nickname');
        localStorage.removeItem('userId');
        localStorage.removeItem('usuario');
        alert('Sesión cerrada correctamente.');
        window.location.href = 'login.html';
    });

    // --- Cargar canales seguidos (ahora en columna) ---
    const canalesBar = document.getElementById('canalesBar');
    const canalesContent = document.getElementById('canalesContent');
    let canales = [];
    let usuarioId = obtenerUsuarioIdActual();

    async function cargarCanalesSeguidos() {
        try {
            // Cambiar endpoint a /usuario/{usuarioId}/suscripciones
            const res = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/${usuarioId}/suscripciones`);
            canales = await res.json();
            console.log('Canales seguidos recibidos:', canales); // DEBUG
            renderCanalesColumna();
        } catch (e) {
            canalesBar.innerHTML = '<div style="color:#fff;">No se pudieron cargar los canales.</div>';
        }
    }

    // Renderiza los canales en columna, y al hacer click muestra los videos debajo
    function renderCanalesColumna() {
        canalesBar.innerHTML = '';
        canalesContent.innerHTML = '';
        if (!Array.isArray(canales) || canales.length === 0) {
            canalesBar.innerHTML = '<div style="color:#fff;">No sigues ningún canal.</div>';
            return;
        }
        canales.forEach((canal, idx) => {
            const canalDiv = document.createElement('div');
            canalDiv.className = 'canal-col-item';
            canalDiv.innerHTML = `
                <div class="canal-avatar" data-idx="${idx}">${canal.nickname.charAt(0).toUpperCase()}</div>
                <div class="canal-nickname">${canal.nickname}</div>
            `;
            canalDiv.addEventListener('click', () => mostrarVideosCanalFila(idx, canalDiv));
            canalesBar.appendChild(canalDiv);
        });
    }

    // Mostrar videos debajo de la barra, ocupando todo el ancho
    async function mostrarVideosCanalFila(idx, canalDiv) {
        canalesContent.innerHTML = '';
        document.querySelectorAll('.canal-avatar').forEach(el => el.classList.remove('selected'));
        canalDiv.querySelector('.canal-avatar').classList.add('selected');
        const canal = canales[idx];
        try {
            const res = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/video/usuario/${canal.id}`);
            const videos = await res.json();
            console.log(`Videos recibidos para canal ${canal.nickname} (ID: ${canal.id}):`, videos); // DEBUG
            const videosDiv = document.createElement('div');
            videosDiv.className = 'videos-canal-columna';
            if (Array.isArray(videos) && videos.length > 0) {
                videosDiv.innerHTML = videos.map(video => `
                    <div class='video-card' style='margin: 16px 0; display: flex; align-items: center; gap: 1rem; cursor: pointer;'>
                        <img class='video-thumb' src='${video.miniatura_src || ''}' alt='Miniatura' style='width:160px;height:90px;object-fit:cover;border-radius:8px;'/>
                        <span style='font-size:1.1rem;color:#fff;'>${video.titulo || 'Sin título'}</span>
                    </div>
                `).join('');
                Array.from(videosDiv.querySelectorAll('.video-card')).forEach((card, i) => {
                    card.addEventListener('click', () => {
                        const video = videos[i];
                        mostrarModalVideo(
                            video.video_src || '',
                            video.titulo || 'Sin título',
                            video,
                            canal
                        );
                        incrementarVistas(video.id);
                    });
                });
            } else {
                videosDiv.innerHTML = `<div style='color:#fff;'>${canal.nickname} no tiene videos.</div>`;
            }
            canalesContent.appendChild(videosDiv);
        } catch (e) {
            const videosDiv = document.createElement('div');
            videosDiv.className = 'videos-canal-columna';
            videosDiv.innerHTML = `<div style='color:#fff;'>No se pudieron cargar los videos.</div>`;
            canalesContent.appendChild(videosDiv);
        }
    }

    // --- Modal igual que en videos que me gustan (con scroll y acciones) ---
    async function incrementarVistas(videoId) {
        try {
            await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/video/incrementar-vistas/${videoId}`, { method: 'POST' });
        } catch {}
    }

    // Modal de video (reutiliza lógica de principal.js simplificada)
    function mostrarModalVideo(url, titulo, videoData, canal) {
        const overlay = document.createElement('div');
        overlay.className = 'video-modal-overlay';
        overlay.innerHTML = `
            <div class="video-modal-container">
                <div class="video-modal-content">
                    <div class="video-main-section">
                        <div class="video-player-container">
                            <video src="${url}" controls autoplay class="video-player">
                                Tu navegador no soporta el elemento video.
                            </video>
                            <button class="modal-close-btn" id="cerrarModalVideo">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                            </button>
                        </div>
                        <div class="video-info-section">
                            <h1 class="video-title-modal">${titulo}</h1>
                            <div class="video-stats-actions">
                                <div class="video-stats">
                                    <span class="views-count">${videoData.vistas || 0} visualizaciones</span>
                                </div>
                                <div class="video-actions">
                                    <button class="action-btn like-btn" data-video-id="${videoData.id}" data-action="like">
                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                                        </svg>
                                        <span class="like-count">0</span>
                                    </button>
                                </div>
                            </div>
                            <div class="channel-info">
                                <div class="channel-avatar">
                                    <span class="avatar-icon">${canal.nickname.charAt(0).toUpperCase()}</span>
                                </div>
                                <div class="channel-details">
                                    <div class="channel-name">${canal.nickname}</div>
                                </div>
                            </div>
                            <div class="video-description">
                                <div class="description-content">
                                    <p>${videoData.Descripcion || videoData.descripcion || 'Sin descripción'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="comments-section">
                        <div class="comments-header">
                            <h3>Comentarios</h3>
                            <span class="comments-count" id="commentsCount">0</span>
                        </div>
                        <div class="add-comment-section">
                            <div class="comment-avatar">
                                <span class="avatar-icon">U</span>
                            </div>
                            <div class="comment-input-container">
                                <textarea class="comment-input" placeholder="Agrega un comentario..." id="newCommentText"></textarea>
                                <div class="comment-actions">
                                    <button class="comment-cancel-btn">CANCELAR</button>
                                    <button class="comment-submit-btn" id="submitComment" data-video-id="${videoData.id}">COMENTAR</button>
                                </div>
                            </div>
                        </div>
                        <div class="comments-list" id="commentsList"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('#cerrarModalVideo').onclick = () => overlay.remove();
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        // Comentarios y likes (puedes reutilizar funciones de principal.js si lo deseas)
    }

    function obtenerUsuarioIdActual() {
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) {
            try {
                const usuario = JSON.parse(usuarioData);
                return usuario.id || localStorage.getItem('userId');
            } catch {
                return localStorage.getItem('userId');
            }
        }
        return localStorage.getItem('userId');
    }

    cargarCanalesSeguidos();
});
