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
                        <img class='video-thumb' src='${video.miniatura_src || ''}' alt='Miniatura' style='width:160px;height:90px;object-fit:cover;border-radius:8px;' onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjM0YzRjNGIi8+CjxwYXRoIGQ9Ik0xMzUgNzBMMTc1IDkwTDEzNSAxMTBWNzBaIiBmaWxsPSIjN0Y3RjdGIi8+Cjwvc3ZnPg=='"/>
                        <div style='flex: 1;'>
                            <div style='font-size:1.1rem;color:#fff;margin-bottom:4px;font-weight:600;'>${video.titulo || 'Sin título'}</div>
                            <div style='font-size:0.9rem;color:#aaa;margin-bottom:4px;'>${video.descripcion || video.Descripcion || 'Sin descripción'}</div>
                            <div style='font-size:0.85rem;color:#aaa;display:flex;gap:16px;'>
                                <span>👁️ ${video.vistas || 0} vistas</span>
                                <span>🎬 ${canal.nickname}</span>
                            </div>
                        </div>
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
                videosDiv.innerHTML = `<div style='color:#fff;text-align:center;padding:2rem;'>${canal.nickname} no tiene videos.</div>`;
            }
            canalesContent.appendChild(videosDiv);
        } catch (e) {
            const videosDiv = document.createElement('div');
            videosDiv.className = 'videos-canal-columna';
            videosDiv.innerHTML = `<div style='color:#fff;text-align:center;padding:2rem;'>No se pudieron cargar los videos.</div>`;
            canalesContent.appendChild(videosDiv);
        }
    }

    // --- Modal igual que en principal.js (con todas las funciones completas) ---
    async function incrementarVistas(videoId) {
        try {
            await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/video/incrementar-vistas/${videoId}`, { method: 'POST' });
        } catch (error) {
            console.error('Error al incrementar vistas:', error);
        }
    }

    // Modal de video completo (copiado de principal.js)
    function mostrarModalVideo(url, titulo, videoData, canal) {
        const datosUsuario = obtenerDatosUsuario();
        
        const overlay = document.createElement('div');
        overlay.className = 'video-modal-overlay';
        overlay.innerHTML = `
            <div class="video-modal-container">
                <div class="video-modal-content">
                    <!-- Sección principal del video -->
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
                        
                        <!-- Información del video -->
                        <div class="video-info-section">
                            <h1 class="video-title-modal">${titulo}</h1>
                            
                            <!-- Estadísticas y acciones -->
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
                            
                            <!-- Información del canal -->
                            <div class="channel-info">
                                <div class="channel-avatar">
                                    <span class="avatar-icon">${canal.nickname ? canal.nickname.charAt(0).toUpperCase() : 'U'}</span>
                                </div>
                                <div class="channel-details">
                                    <div class="channel-name">${canal.nickname || 'Usuario desconocido'}</div>
                                    <div class="subscriber-count" id="subscriberCount">Cargando suscriptores...</div>
                                </div>
                                <button class="subscribe-btn" data-user-id="${canal.id || ''}" id="subscribeBtn">
                                    <span class="subscribe-text">SUSCRIBIRSE</span>
                                </button>
                            </div>
                            
                            <!-- Descripción del video -->
                            <div class="video-description">
                                <div class="description-content">
                                    <p>${videoData.Descripcion || videoData.descripcion || 'Sin descripción'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sección de comentarios -->
                    <div class="comments-section">
                        <div class="comments-header">
                            <h3>Comentarios</h3>
                            <span class="comments-count" id="commentsCount">0</span>
                        </div>
                        
                        <!-- Formulario para agregar comentario -->
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
                        
                        <!-- Lista de comentarios -->
                        <div class="comments-list" id="commentsList">
                            <!-- Los comentarios se cargarán aquí dinámicamente -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Configurar event listeners
        setupModalEventListeners(overlay, videoData, canal);
        
        // Cargar datos iniciales
        cargarLikesYDislikes(videoData.id);
        cargarComentarios(videoData.id);
        cargarContadorSuscriptores(canal.id);
        verificarEstadoSuscripcion(canal.id);
    }

    // Configurar todos los event listeners del modal
    function setupModalEventListeners(overlay, videoData, canal) {
        // Cerrar modal
        overlay.querySelector('#cerrarModalVideo').onclick = () => overlay.remove();
        
        // Cerrar con click fuera del contenido
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        // Cerrar con Escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // Like/Dislike buttons
        overlay.querySelector('.like-btn').addEventListener('click', (e) => {
            darLikeDislike(videoData.id, true);
        });
        
        overlay.querySelector('.dislike-btn').addEventListener('click', (e) => {
            darLikeDislike(videoData.id, false);
        });
        
        // Subscribe button
        overlay.querySelector('#subscribeBtn').addEventListener('click', (e) => {
            const usuarioId = e.target.dataset.userId;
            if (usuarioId) {
                manejarSuscripcion(usuarioId);
            }
        });
        
        // Submit comment
        overlay.querySelector('#submitComment').addEventListener('click', (e) => {
            enviarComentario(videoData.id);
        });
        
        // Cancel comment
        overlay.querySelector('.comment-cancel-btn').addEventListener('click', () => {
            overlay.querySelector('#newCommentText').value = '';
            overlay.querySelector('#newCommentText').blur();
        });
        
        // Auto-resize textarea
        const textarea = overlay.querySelector('#newCommentText');
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
        
        // Mostrar/ocultar acciones de comentario
        textarea.addEventListener('focus', function() {
            overlay.querySelector('.comment-actions').style.opacity = '1';
        });
        
        textarea.addEventListener('blur', function() {
            if (!this.value.trim()) {
                overlay.querySelector('.comment-actions').style.opacity = '0';
            }
        });
    }

    // Función para obtener datos del usuario desde localStorage
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
            
            // Fallback para compatibilidad con versiones anteriores
            return {
                nickname: localStorage.getItem('nickname') || '',
                id: localStorage.getItem('userId') || '',
                token: localStorage.getItem('token') || ''
            };
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            return {
                nickname: '',
                id: '',
                token: ''
            };
        }
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

    // Función para cargar el contador de suscriptores
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
            console.error('Error al cargar contador de suscriptores:', error);
            const subscriberCountEl = document.getElementById('subscriberCount');
            if (subscriberCountEl) {
                subscriberCountEl.textContent = '0 suscriptores';
            }
        }
    }

    // Función para manejar suscripción/desuscripción
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
                // Desuscribirse
                const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/${usuarioSuscriptorId}/desuscribirse/${usuarioSuscritoId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    subscribeBtn.classList.remove('subscribed');
                    subscribeText.textContent = 'SUSCRIBIRSE';
                    subscribeBtn.disabled = false;
                    
                    // Actualizar contador
                    cargarContadorSuscriptores(usuarioSuscritoId);
                } else {
                    const errorText = await response.text();
                    alert('Error al desuscribirse: ' + errorText);
                }
            } else {
                // Suscribirse
                const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/${usuarioSuscriptorId}/suscribirse/${usuarioSuscritoId}`, {
                    method: 'POST'
                });
                
                if (response.ok) {
                    subscribeBtn.classList.add('subscribed');
                    subscribeText.textContent = 'DESUSCRIBIRSE';
                    subscribeBtn.disabled = false;
                    
                    // Actualizar contador
                    cargarContadorSuscriptores(usuarioSuscritoId);
                } else {
                    const errorText = await response.text();
                    alert('Error al suscribirse: ' + errorText);
                }
            }
        } catch (error) {
            console.error('Error al manejar suscripción:', error);
            alert('Error al procesar la suscripción');
        }
    }

    // Función para verificar estado de suscripción
    async function verificarEstadoSuscripcion(usuarioSuscritoId) {
        try {
            const usuarioSuscriptorId = obtenerUsuarioIdActual();
            if (!usuarioSuscriptorId || !usuarioSuscritoId) return;
            
            const subscribeBtn = document.getElementById('subscribeBtn');
            const subscribeText = subscribeBtn.querySelector('.subscribe-text');
            
            if (usuarioSuscriptorId === usuarioSuscritoId) {
                // Si es el propio usuario, ocultar el botón de suscripción
                if (subscribeBtn) {
                    subscribeBtn.style.display = 'none';
                }
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
        } catch (error) {
            console.error('Error al verificar suscripción:', error);
        }
    }

    // Función para dar like/dislike
    async function darLikeDislike(videoId, isLike) {
        try {
            const usuarioId = obtenerUsuarioIdActual();
            if (!usuarioId) {
                alert('Debes iniciar sesión para dar like/dislike');
                return;
            }
            
            const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/like/dar/${videoId}/${usuarioId}/${isLike}`, {
                method: 'POST'
            });
            
            if (response.ok) {
                cargarLikesYDislikes(videoId);
            }
        } catch (error) {
            console.error('Error al dar like/dislike:', error);
        }
    }

    // Función para cargar likes y dislikes
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
        } catch (error) {
            console.error('Error al cargar likes/dislikes:', error);
        }
    }

    // Función para cargar comentarios
    async function cargarComentarios(videoId) {
        try {
            const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/comentario/video/${videoId}`);
            const comentarios = await response.json();
            
            const commentsList = document.getElementById('commentsList');
            const commentsCount = document.getElementById('commentsCount');
            const usuarioActualId = obtenerUsuarioIdActual();
            
            if (commentsCount) commentsCount.textContent = comentarios.length;
            
            if (commentsList) {
                commentsList.innerHTML = comentarios.map(comentario => `
                    <div class="comment-item" data-comment-id="${comentario.id}">
                        <div class="comment-avatar">
                            <span class="avatar-icon">${comentario.usuario?.nickname?.charAt(0).toUpperCase() || 'U'}</span>
                        </div>
                        <div class="comment-content">
                            <div class="comment-header">
                                <span class="comment-author">${comentario.usuario?.nickname || 'Usuario'}</span>
                                <span class="comment-date">${formatearFecha(comentario.fechaDeCreacion)}</span>
                                ${comentario.usuario?.id == usuarioActualId ? `
                                    <button class="delete-comment-btn" data-comment-id="${comentario.id}" title="Eliminar comentario">
                                        <svg viewBox="0 0 24 24" width="16" height="16">
                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                        </svg>
                                    </button>
                                ` : ''}
                            </div>
                            <div class="comment-text">${comentario.comentario}</div>
                        </div>
                    </div>
                `).join('');
                
                // Agregar event listeners a los botones de eliminar
                const deleteButtons = commentsList.querySelectorAll('.delete-comment-btn');
                deleteButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const comentarioId = btn.dataset.commentId;
                        eliminarComentario(comentarioId, videoId);
                    });
                });
            }
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
        }
    }

    // Función para eliminar comentario
    async function eliminarComentario(comentarioId, videoId) {
        try {
            const usuarioId = obtenerUsuarioIdActual();
            if (!usuarioId) {
                alert('Debes iniciar sesión para eliminar comentarios');
                return;
            }
            
            // Confirmar eliminación
            if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
                return;
            }
            
            const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/comentario/${comentarioId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // Recargar comentarios después de eliminar
                cargarComentarios(videoId);
            } else {
                const errorText = await response.text();
                alert('Error al eliminar comentario: ' + errorText);
            }
        } catch (error) {
            console.error('Error al eliminar comentario:', error);
            alert('Error al eliminar comentario');
        }
    }

    // Función para enviar comentario
    async function enviarComentario(videoId) {
        try {
            const usuarioId = obtenerUsuarioIdActual();
            if (!usuarioId) {
                alert('Debes iniciar sesión para comentar');
                return;
            }
            
            const comentarioTexto = document.getElementById('newCommentText').value.trim();
            if (!comentarioTexto) {
                return;
            }
            
            const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/comentario/crear/${videoId}/${usuarioId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comentarioTexto)
            });
            
            if (response.ok) {
                document.getElementById('newCommentText').value = '';
                document.querySelector('.comment-actions').style.opacity = '0';
                cargarComentarios(videoId);
            }
        } catch (error) {
            console.error('Error al enviar comentario:', error);
        }
    }

    // Función para formatear fecha
    function formatearFecha(fechaString) {
        try {
            // Crear objeto Date desde el string
            const fecha = new Date(fechaString);
            const ahora = new Date();
            
            // Verificar que la fecha sea válida
            if (isNaN(fecha.getTime())) {
                return 'Fecha inválida';
            }
            
            // Calcular diferencia en milisegundos
            const diferencia = ahora.getTime() - fecha.getTime();
            
            // Si la diferencia es negativa, la fecha es en el futuro
            if (diferencia < 0) {
                return 'Justo ahora';
            }
            
            // Convertir a diferentes unidades
            const segundos = Math.floor(diferencia / 1000);
            const minutos = Math.floor(segundos / 60);
            const horas = Math.floor(minutos / 60);
            const dias = Math.floor(horas / 24);
            const semanas = Math.floor(dias / 7);
            const meses = Math.floor(dias / 30);
            const años = Math.floor(dias / 365);
            
            // Retornar el formato apropiado
            if (segundos < 60) {
                return 'Justo ahora';
            } else if (minutos < 60) {
                return `hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
            } else if (horas < 24) {
                return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
            } else if (dias < 7) {
                return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
            } else if (semanas < 4) {
                return `hace ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`;
            } else if (meses < 12) {
                return `hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
            } else {
                return `hace ${años} ${años === 1 ? 'año' : 'años'}`;
            }
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return 'Fecha inválida';
        }
    }

    // Inicializar la carga de canales seguidos
    cargarCanalesSeguidos();
});
