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

    // --- Cargar videos que me gustan ---
    const videosGrid = document.getElementById('videosGrid');
    const usuarioId = obtenerUsuarioIdActual();

    async function cargarVideosQueMeGustan() {
        try {
            // Obtener todos los likes del usuario y filtrar solo los que son like (megusta=true)
            const res = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/like/usuario/${usuarioId}`);
            const likes = await res.json();
            // Filtrar solo los likes positivos y mapear a los videos
            const videos = likes.filter(like => like.megusta && like.video).map(like => like.video);
            renderVideos(videos);
        } catch (e) {
            videosGrid.innerHTML = '<div style="color:#fff;">No se pudieron cargar los videos.</div>';
        }
    }

    function renderVideos(videos) {
        videosGrid.innerHTML = '';
        if (!Array.isArray(videos) || videos.length === 0) {
            videosGrid.innerHTML = '<div style="color:#fff;">No tienes videos que te gusten.</div>';
            return;
        }
        videos.forEach(video => {
            const card = document.createElement('div');
            card.className = 'video-card';
            const descripcion = video.Descripcion || video.descripcion || 'Sin descripción';
            const titulo = video.titulo || 'Sin título';
            const vistas = video.vistas || 0;
            const nickname = video.usuario?.nickname || 'Desconocido';
            const miniatura = video.miniatura_src || '';
            const videoSrc = video.video_src || '';
            card.innerHTML = `
                <img class="video-thumb" src="${miniatura}" alt="Miniatura" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjM0YzRjNGIi8+CjxwYXRoIGQ9Ik0xMzUgNzBMMTc1IDkwTDEzNSAxMTBWNzBaIiBmaWxsPSIjN0Y3RjdGIi8+Cjwvc3ZnPg=='">
                <div class="video-card-content">
                    <div class="video-title">${titulo}</div>
                    <div class="video-desc">${descripcion}</div>
                    <div class="video-meta">
                        <span>👁️ ${vistas} vistas</span>
                        <span>🎬 ${nickname}</span>
                    </div>
                </div>
            `;
            card.querySelector('.video-thumb').addEventListener('click', () => {
                if (videoSrc) {
                    mostrarModalVideo(videoSrc, titulo, video);
                    incrementarVistas(video.id);
                }
            });
            videosGrid.appendChild(card);
        });
    }

    // --- Lógica del modal reutilizada de principal.js ---
    function obtenerDatosUsuario() {
        try {
            const usuarioData = localStorage.getItem('usuario');
            if (usuarioData) {
                const usuario = JSON.parse(usuarioData);
                return {
                    nickname: usuario.nickname || '',
                    id: usuario.id || '',
                    token: localStorage.getItem('token') || ''
                };
            }
            return {
                nickname: localStorage.getItem('nickname') || '',
                id: localStorage.getItem('userId') || '',
                token: localStorage.getItem('token') || ''
            };
        } catch (error) {
            return { nickname: '', id: '', token: '' };
        }
    }
    function obtenerUsuarioIdActual() {
        const datosUsuario = obtenerDatosUsuario();
        return datosUsuario.id || localStorage.getItem('userId');
    }
    function mostrarModalVideo(url, titulo, videoData) {
        const datosUsuario = obtenerDatosUsuario();
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
                                    <button class="action-btn dislike-btn" data-video-id="${videoData.id}" data-action="dislike">
                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                            <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                                        </svg>
                                        <span class="dislike-count">0</span>
                                    </button>
                                </div>
                            </div>
                            <div class="channel-info">
                                <div class="channel-avatar">
                                    <span class="avatar-icon">${videoData.usuario?.nickname ? videoData.usuario.nickname.charAt(0).toUpperCase() : 'U'}</span>
                                </div>
                                <div class="channel-details">
                                    <div class="channel-name">${videoData.usuario?.nickname || 'Usuario desconocido'}</div>
                                    <div class="subscriber-count" id="subscriberCount">Cargando suscriptores...</div>
                                </div>
                                <button class="subscribe-btn" data-user-id="${videoData.usuario?.id || ''}" id="subscribeBtn">
                                    <span class="subscribe-text">SUSCRIBIRSE</span>
                                </button>
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
                                <span class="avatar-icon">${datosUsuario.nickname ? datosUsuario.nickname.charAt(0).toUpperCase() : 'U'}</span>
                            </div>
                            <div class="comment-input-container">
                                <textarea 
                                    class="comment-input" 
                                    placeholder="Agrega un comentario..." 
                                    id="newCommentText"
                                ></textarea>
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
        setupModalEventListeners(overlay, videoData);
        cargarLikesYDislikes(videoData.id);
        cargarComentarios(videoData.id);
        cargarContadorSuscriptores(videoData.usuario?.id);
        verificarEstadoSuscripcion(videoData.usuario?.id);
    }
    function setupModalEventListeners(overlay, videoData) {
        overlay.querySelector('#cerrarModalVideo').onclick = () => overlay.remove();
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        overlay.querySelector('.like-btn').addEventListener('click', () => {
            darLikeDislike(videoData.id, true);
        });
        overlay.querySelector('.dislike-btn').addEventListener('click', () => {
            darLikeDislike(videoData.id, false);
        });
        overlay.querySelector('#subscribeBtn').addEventListener('click', (e) => {
            const usuarioId = e.target.dataset.userId;
            if (usuarioId) manejarSuscripcion(usuarioId);
        });
        overlay.querySelector('#submitComment').addEventListener('click', () => {
            enviarComentario(videoData.id);
        });
        overlay.querySelector('.comment-cancel-btn').addEventListener('click', () => {
            overlay.querySelector('#newCommentText').value = '';
            overlay.querySelector('#newCommentText').blur();
        });
        const textarea = overlay.querySelector('#newCommentText');
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
        textarea.addEventListener('focus', function() {
            overlay.querySelector('.comment-actions').style.opacity = '1';
        });
        textarea.addEventListener('blur', function() {
            if (!this.value.trim()) {
                overlay.querySelector('.comment-actions').style.opacity = '0';
            }
        });
    }
    async function cargarContadorSuscriptores(usuarioId) {
        try {
            if (!usuarioId) return;
            const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/${usuarioId}/suscriptores/count`);
            if (response.ok) {
                const count = await response.text();
                const subscriberCountEl = document.getElementById('subscriberCount');
                if (subscriberCountEl) {
                    const numSuscriptores = parseInt(count);
                    subscriberCountEl.textContent = `${numSuscriptores} ${numSuscriptores === 1 ? 'suscriptor' : 'suscriptores'}`;
                }
            }
        } catch (error) {
            const subscriberCountEl = document.getElementById('subscriberCount');
            if (subscriberCountEl) subscriberCountEl.textContent = '0 suscriptores';
        }
    }
    async function manejarSuscripcion(usuarioSuscritoId) {
        try {
            const usuarioSuscriptorId = obtenerUsuarioIdActual();
            if (!usuarioSuscriptorId) {
                alert('Debes iniciar sesión para suscribirte');
                return;
            }
            if (usuarioSuscriptorId === usuarioSuscritoId) {
                alert('No puedes suscribirte a ti mismo');
                return;
            }
            const subscribeBtn = document.getElementById('subscribeBtn');
            const subscribeText = subscribeBtn.querySelector('.subscribe-text');
            const isSubscribed = subscribeBtn.classList.contains('subscribed');
            if (isSubscribed) {
                const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/${usuarioSuscriptorId}/desuscribirse/${usuarioSuscritoId}`, { method: 'DELETE' });
                if (response.ok) {
                    subscribeBtn.classList.remove('subscribed');
                    subscribeText.textContent = 'SUSCRIBIRSE';
                    subscribeBtn.disabled = false;
                    cargarContadorSuscriptores(usuarioSuscritoId);
                } else {
                    const errorText = await response.text();
                    alert('Error al desuscribirse: ' + errorText);
                }
            } else {
                const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/${usuarioSuscriptorId}/suscribirse/${usuarioSuscritoId}`, { method: 'POST' });
                if (response.ok) {
                    subscribeBtn.classList.add('subscribed');
                    subscribeText.textContent = 'DESUSCRIBIRSE';
                    subscribeBtn.disabled = false;
                    cargarContadorSuscriptores(usuarioSuscriptorId);
                } else {
                    const errorText = await response.text();
                    alert('Error al suscribirse: ' + errorText);
                }
            }
        } catch (error) {
            alert('Error al procesar la suscripción');
        }
    }
    async function verificarEstadoSuscripcion(usuarioSuscritoId) {
        try {
            const usuarioSuscriptorId = obtenerUsuarioIdActual();
            if (!usuarioSuscriptorId || !usuarioSuscritoId) return;
            const subscribeBtn = document.getElementById('subscribeBtn');
            const subscribeText = subscribeBtn.querySelector('.subscribe-text');
            if (usuarioSuscriptorId === usuarioSuscritoId) {
                if (subscribeBtn) subscribeBtn.style.display = 'none';
                return;
            }
            const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/${usuarioSuscriptorId}/esta-suscrito/${usuarioSuscritoId}`);
            if (response.ok) {
                const estaSuscrito = await response.json();
                if (estaSuscrito) {
                    subscribeBtn.classList.add('subscribed');
                    subscribeText.textContent = 'DESUSCRIBIRSE';
                } else {
                    subscribeBtn.classList.remove('subscribed');
                    subscribeText.textContent = 'SUSCRIBIRSE';
                }
                subscribeBtn.disabled = false;
            }
        } catch (error) {}
    }
    async function darLikeDislike(videoId, isLike) {
        try {
            const usuarioId = obtenerUsuarioIdActual();
            if (!usuarioId) {
                alert('Debes iniciar sesión para dar like/dislike');
                return;
            }
            const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/like/dar/${videoId}/${usuarioId}/${isLike}`, { method: 'POST' });
            if (response.ok) cargarLikesYDislikes(videoId);
        } catch (error) {}
    }
    async function cargarLikesYDislikes(videoId) {
        try {
            const [likesResponse, dislikesResponse] = await Promise.all([
                fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/like/contar/likes/${videoId}`),
                fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/like/contar/dislikes/${videoId}`)
            ]);
            const likes = await likesResponse.text();
            const dislikes = await dislikesResponse.text();
            const likeCountEl = document.querySelector('.like-count');
            const dislikeCountEl = document.querySelector('.dislike-count');
            if (likeCountEl) likeCountEl.textContent = likes;
            if (dislikeCountEl) dislikeCountEl.textContent = dislikes;
        } catch (error) {}
    }
    async function cargarComentarios(videoId) {
        try {
            const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/comentario/video/${videoId}`);
            const comentarios = await response.json();
            const commentsList = document.getElementById('commentsList');
            const commentsCount = document.getElementById('commentsCount');
            if (commentsCount) commentsCount.textContent = comentarios.length;
            if (commentsList) {
                commentsList.innerHTML = comentarios.map(comentario => `
                    <div class="comment-item">
                        <div class="comment-avatar">
                            <span class="avatar-icon">${comentario.usuario?.nickname?.charAt(0).toUpperCase() || 'U'}</span>
                        </div>
                        <div class="comment-content">
                            <div class="comment-header">
                                <span class="comment-author">${comentario.usuario?.nickname || 'Usuario'}</span>
                                <span class="comment-date">${formatearFecha(comentario.fechaDeCreacion)}</span>
                            </div>
                            <div class="comment-text">${comentario.comentario}</div>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {}
    }
    async function enviarComentario(videoId) {
        try {
            const usuarioId = obtenerUsuarioIdActual();
            if (!usuarioId) {
                alert('Debes iniciar sesión para comentar');
                return;
            }
            const comentarioTexto = document.getElementById('newCommentText').value.trim();
            if (!comentarioTexto) return;
            const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/comentario/crear/${videoId}/${usuarioId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(comentarioTexto)
            });
            if (response.ok) {
                document.getElementById('newCommentText').value = '';
                document.querySelector('.comment-actions').style.opacity = '0';
                cargarComentarios(videoId);
            }
        } catch (error) {}
    }
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);
        const ahora = new Date();
        const diferencia = ahora - fecha;
        const minutos = Math.floor(diferencia / (1000 * 60));
        const horas = Math.floor(diferencia / (1000 * 60 * 60));
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        if (minutos < 60) return `hace ${minutos} minutos`;
        else if (horas < 24) return `hace ${horas} horas`;
        else return `hace ${dias} días`;
    }
    function obtenerUsuarioIdActual() {
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) {
            const usuario = JSON.parse(usuarioData);
            return usuario.id || localStorage.getItem('userId');
        }
        return localStorage.getItem('userId');
    }

    cargarVideosQueMeGustan();
});
