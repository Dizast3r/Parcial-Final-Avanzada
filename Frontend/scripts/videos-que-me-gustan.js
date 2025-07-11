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

    // --- Obtener datos del usuario ---
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
            console.error('Error al obtener datos del usuario:', error);
            return { nickname: '', id: '', token: '' };
        }
    }

    function obtenerUsuarioIdActual() {
        const datosUsuario = obtenerDatosUsuario();
        return datosUsuario.id || localStorage.getItem('userId');
    }

    // --- Cargar videos que me gustan ---
    const videosGrid = document.getElementById('videosGrid');
    const usuarioId = obtenerUsuarioIdActual();

    async function cargarVideosQueMeGustan() {
        try {
            console.log('Cargando videos que me gustan para usuario:', usuarioId);
            
            if (!usuarioId) {
                videosGrid.innerHTML = '<div style="color:#fff;text-align:center;padding:2rem;">Debes iniciar sesión para ver tus videos favoritos.</div>';
                return;
            }

            // Usar el endpoint correcto que ya existe en el backend
            const res = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/${usuarioId}/videos-que-me-gustan`);
            
            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${res.statusText}`);
            }
            
            const videos = await res.json();
            console.log('Videos que me gustan recibidos:', videos);
            renderVideos(videos);
        } catch (error) {
            console.error('Error al cargar videos que me gustan:', error);
            videosGrid.innerHTML = `
                <div style="color:#fff;text-align:center;padding:2rem;">
                    <div style="font-size:3rem;margin-bottom:1rem;">😔</div>
                    <div>No se pudieron cargar los videos.</div>
                    <div style="font-size:0.9rem;color:#aaa;margin-top:0.5rem;">
                        Error: ${error.message}
                    </div>
                    <button onclick="location.reload()" style="
                        background:#7614a3;
                        color:white;
                        border:none;
                        padding:0.5rem 1rem;
                        border-radius:20px;
                        cursor:pointer;
                        margin-top:1rem;
                    ">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    function renderVideos(videos) {
        videosGrid.innerHTML = '';
        
        if (!Array.isArray(videos) || videos.length === 0) {
            videosGrid.innerHTML = `
                <div style="color:#fff;text-align:center;padding:3rem;">
                    <div style="font-size:4rem;margin-bottom:1rem;">💔</div>
                    <div style="font-size:1.5rem;margin-bottom:0.5rem;">No tienes videos que te gusten</div>
                    <div style="font-size:1rem;color:#aaa;">
                        ¡Ve algunos videos y dale like a los que más te gusten!
                    </div>
                    <button onclick="window.location.href='principal.html'" style="
                        background:#7614a3;
                        color:white;
                        border:none;
                        padding:0.75rem 1.5rem;
                        border-radius:25px;
                        cursor:pointer;
                        margin-top:1.5rem;
                        font-size:1rem;
                        font-weight:600;
                    ">
                        Explorar videos
                    </button>
                </div>
            `;
            return;
        }

        videos.forEach(video => {
            console.log('Renderizando video:', video);
            
            const card = document.createElement('div');
            card.className = 'video-card';
            
            const descripcion = video.descripcion || video.Descripcion || 'Sin descripción';
            const titulo = video.titulo || 'Sin título';
            const vistas = video.vistas || 0;
            const nickname = video.usuario?.nickname || 'Desconocido';
            const miniatura = video.miniatura_src || '';
            const videoSrc = video.video_src || '';
            
            card.innerHTML = `
                <img class="video-thumb" src="${miniatura}" alt="Miniatura" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjM0YzRjNGIi8+CjxwYXRoIGQ9Ik0xMzUgNzBMMTc1IDkwTDEzNSAxMTBWNzBaIiBmaWxsPSIjN0Y3RjdGIi8+Cjwvc3ZnPg=='">
                <div class="video-card-content">
                    <div class="video-title">${titulo}</div>
                    <div class="video-desc">${descripcion}</div>
                    <div class="video-meta">
                        <span>👁️ ${vistas} vistas</span>
                        <span>🎬 ${nickname}</span>
                        <span>❤️ Te gusta</span>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                if (videoSrc) {
                    mostrarModalVideo(videoSrc, titulo, video);
                    incrementarVistas(video.id);
                } else {
                    alert('Video no disponible');
                }
            });
            
            videosGrid.appendChild(card);
        });
    }

    // Función para incrementar vistas
    async function incrementarVistas(videoId) {
        try {
            await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/video/incrementar-vistas/${videoId}`, {
                method: 'POST'
            });
        } catch (error) {
            console.error('Error al incrementar vistas:', error);
        }
    }

    // --- Modal de video ---
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
                            <button class="modal-close-btn" id="cerrarModalVideo">×</button>
                        </div>
                        <div class="video-info-section">
                            <h1 class="video-title-modal">${titulo}</h1>
                            <div class="video-stats-actions">
                                <div class="video-stats">
                                    <span class="views-count">${videoData.vistas || 0} visualizaciones</span>
                                </div>
                                <div class="video-actions">
                                    <button class="action-btn like-btn" data-video-id="${videoData.id}">
                                        👍 <span class="like-count">0</span>
                                    </button>
                                    <button class="action-btn dislike-btn" data-video-id="${videoData.id}">
                                        👎 <span class="dislike-count">0</span>
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
                                    <p>${videoData.descripcion || videoData.Descripcion || 'Sin descripción'}</p>
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
        setupModalEventListeners(overlay, videoData);
        cargarLikesYDislikes(videoData.id);
        cargarComentarios(videoData.id);
        cargarContadorSuscriptores(videoData.usuario?.id);
        verificarEstadoSuscripcion(videoData.usuario?.id);
    }

    function setupModalEventListeners(overlay, videoData) {
        // Cerrar modal
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
        
        // Like/Dislike
        overlay.querySelector('.like-btn').addEventListener('click', () => {
            darLikeDislike(videoData.id, true);
        });
        
        overlay.querySelector('.dislike-btn').addEventListener('click', () => {
            darLikeDislike(videoData.id, false);
        });
        
        // Suscripción
        overlay.querySelector('#subscribeBtn').addEventListener('click', (e) => {
            const usuarioId = e.target.dataset.userId;
            if (usuarioId) manejarSuscripcion(usuarioId);
        });
        
        // Comentarios
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

    // --- Funciones de likes ---
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
                if (!isLike) {
                    setTimeout(() => {
                        cargarVideosQueMeGustan();
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Error al dar like/dislike:', error);
        }
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
        } catch (error) {
            console.error('Error al cargar likes/dislikes:', error);
        }
    }

    // --- Funciones de suscripción ---
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
                const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/${usuarioSuscriptorId}/desuscribirse/${usuarioSuscritoId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    subscribeBtn.classList.remove('subscribed');
                    subscribeText.textContent = 'SUSCRIBIRSE';
                    cargarContadorSuscriptores(usuarioSuscritoId);
                } else {
                    const errorText = await response.text();
                    alert('Error al desuscribirse: ' + errorText);
                }
            } else {
                const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/${usuarioSuscriptorId}/suscribirse/${usuarioSuscritoId}`, {
                    method: 'POST'
                });
                
                if (response.ok) {
                    subscribeBtn.classList.add('subscribed');
                    subscribeText.textContent = 'DESUSCRIBIRSE';
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
            }
        } catch (error) {
            console.error('Error al verificar suscripción:', error);
        }
    }

    // --- Funciones de comentarios ---
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
                                    <button class="delete-comment-btn" data-comment-id="${comentario.id}" title="Eliminar comentario" style="
                                        background: none;
                                        border: none;
                                        color: #aaa;
                                        cursor: pointer;
                                        padding: 4px;
                                        border-radius: 4px;
                                        margin-left: 8px;
                                    ">🗑️</button>
                                ` : ''}
                            </div>
                            <div class="comment-text">${comentario.comentario}</div>
                        </div>
                    </div>
                `).join('');
                
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

    async function eliminarComentario(comentarioId, videoId) {
        try {
            const usuarioId = obtenerUsuarioIdActual();
            if (!usuarioId) {
                alert('Debes iniciar sesión para eliminar comentarios');
                return;
            }
            
            if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
                return;
            }
            
            const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/comentario/${comentarioId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
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
        } catch (error) {
            console.error('Error al enviar comentario:', error);
        }
    }

    // --- Función para formatear fecha ---
    function formatearFecha(fechaString) {
        try {
            const fecha = new Date(fechaString);
            const ahora = new Date();
            
            if (isNaN(fecha.getTime())) {
                return 'Fecha inválida';
            }
            
            const diferencia = ahora.getTime() - fecha.getTime();
            
            if (diferencia < 0) {
                return 'Justo ahora';
            }
            
            const segundos = Math.floor(diferencia / 1000);
            const minutos = Math.floor(segundos / 60);
            const horas = Math.floor(minutos / 60);
            const dias = Math.floor(horas / 24);
            const semanas = Math.floor(dias / 7);
            const meses = Math.floor(dias / 30);
            const años = Math.floor(dias / 365);
            
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

    // --- Inicializar ---
    cargarVideosQueMeGustan();
});