document.addEventListener('DOMContentLoaded', () => {
    const barralateral = document.getElementById('barralateral');
    const overlay = document.getElementById('overlay');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const contenidoPrincipal = document.getElementById('contenidoPrincipal');
    const videosGrid = document.getElementById('videosGrid');
    const profileNickname = document.getElementById('profileNickname');
    
    let isMiniSidebar = false;

    const toggleSidebar = () => {
        if (window.innerWidth <= 768) {
            barralateral.classList.toggle('active');
            overlay.classList.toggle('active');
        } else {
            if (!barralateral.classList.contains('hidden') && !isMiniSidebar) {
                barralateral.classList.add('barralateral-mini');
                contenidoPrincipal.classList.add('mini-sidebar');
                contenidoPrincipal.classList.remove('expanded');
                isMiniSidebar = true;
            } else if (isMiniSidebar) {
                barralateral.classList.remove('barralateral-mini');   
                contenidoPrincipal.classList.remove('mini-sidebar');
                isMiniSidebar = false;
            } else {
                barralateral.classList.remove('hidden');
                contenidoPrincipal.classList.remove('expanded');
                isMiniSidebar = false;
            }
        }
    };

    hamburgerBtn.addEventListener('click', toggleSidebar);
    sidebarToggleBtn.addEventListener('click', toggleSidebar);

    overlay.addEventListener('click', () => {
        barralateral.classList.remove('active');
        overlay.classList.remove('active');
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && barralateral.classList.contains('active')) {
            barralateral.classList.remove('active');
            overlay.classList.remove('active');
        }
    });

    const sidebarLinks = document.querySelectorAll('.barralateral-item');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                barralateral.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            barralateral.classList.remove('active');
            overlay.classList.remove('active');
        }
    });

    // Mostrar nickname en el perfil
    const userToken = localStorage.getItem('token');
    let nickname = '';
    if (localStorage.getItem('nickname')) {
        nickname = localStorage.getItem('nickname');
    } else if (userToken) {
        // Si tienes un token JWT y el nickname está en el payload, puedes decodificarlo aquí
    }
    if (profileNickname) {
        profileNickname.textContent = nickname ? nickname : 'Invitado';
    }

    // Cerrar sesión desde la barra lateral
    const sidebarLogout = Array.from(document.querySelectorAll('.barralateral-item .text'))
        .find(el => el.textContent.trim() === 'Cerrar sesión')?.parentElement;
    if (sidebarLogout) {
        sidebarLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('nickname');
            localStorage.removeItem('userId');
            alert('Sesión cerrada correctamente.');
            window.location.href = 'login.html';
        });
    }

    // Redirigir a canal.html al hacer clic en "Mis videos"
    const misVideosLink = Array.from(document.querySelectorAll('.barralateral-item .text'))
        .find(el => el.textContent.trim() === 'Mis videos')?.parentElement;
    if (misVideosLink) {
        misVideosLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'canal.html';
        });
    }

    // Cargar todos los videos publicados usando el endpoint correcto /video/todos
    async function cargarVideos() {
        try {
            const response = await fetch('https://parcial-final-avanzada-production-cdde.up.railway.app/video/todos');
            if (!response.ok) throw new Error('No se pudieron cargar los videos');
            const videos = await response.json();
            
            console.log('Videos cargados:', videos); // Para debugging
            
            videosGrid.innerHTML = '';
            if (!Array.isArray(videos) || videos.length === 0) {
                videosGrid.innerHTML = '<div style="color:#fff;font-size:1.2rem;">No hay videos disponibles.</div>';
                return;
            }
            
            videos.forEach(video => {
                console.log('Procesando video:', video); // Para debugging
                
                const card = document.createElement('div');
                card.className = 'video-card';
                
                // Manejar la descripción correctamente - el campo se llama "Descripcion" con mayúscula
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
                
                // Al hacer click en la miniatura, mostrar el video en grande
                card.querySelector('.video-thumb').addEventListener('click', () => {
                    if (videoSrc) {
                        mostrarModalVideo(videoSrc, titulo, video);
                        // Incrementar vistas cuando se reproduce el video
                        incrementarVistas(video.id);
                    }
                });
                
                videosGrid.appendChild(card);
            });
        } catch (error) {
            console.error('Error al cargar videos:', error);
            videosGrid.innerHTML = `<div style='color:#fff;'>Error al cargar videos: ${error.message}</div>`;
        }
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

    // Función mejorada para mostrar el modal de video estilo YouTube
    function mostrarModalVideo(url, titulo, videoData) {
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
                                    <span class="avatar-icon">${videoData.usuario?.nickname ? videoData.usuario.nickname.charAt(0).toUpperCase() : 'U'}</span>
                                </div>
                                <div class="channel-details">
                                    <div class="channel-name">${videoData.usuario?.nickname || 'Usuario desconocido'}</div>
                                    <div class="subscriber-count">0 suscriptores</div>
                                </div>
                                <button class="subscribe-btn" data-user-id="${videoData.usuario?.id || ''}">
                                    SUSCRIBIRSE
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
                                <span class="avatar-icon">${localStorage.getItem('nickname')?.charAt(0).toUpperCase() || 'U'}</span>
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
        setupModalEventListeners(overlay, videoData);
        
        // Cargar datos iniciales
        cargarLikesYDislikes(videoData.id);
        cargarComentarios(videoData.id);
        verificarEstadoSuscripcion(videoData.usuario?.id);
    }

    // Configurar todos los event listeners del modal
    function setupModalEventListeners(overlay, videoData) {
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
        overlay.querySelector('.subscribe-btn').addEventListener('click', (e) => {
            const usuarioId = e.target.dataset.userId;
            if (usuarioId) {
                suscribirseAUsuario(usuarioId);
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
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
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

    // Función para suscribirse a un usuario
    async function suscribirseAUsuario(usuarioSuscritoId) {
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
            
            const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/${usuarioSuscriptorId}/suscribirse/${usuarioSuscritoId}`, {
                method: 'POST'
            });
            
            if (response.ok) {
                const subscribeBtn = document.querySelector('.subscribe-btn');
                if (subscribeBtn) {
                    subscribeBtn.textContent = 'SUSCRITO';
                    subscribeBtn.classList.add('subscribed');
                    subscribeBtn.disabled = true;
                }
            } else {
                const errorText = await response.text();
                alert('Error al suscribirse: ' + errorText);
            }
        } catch (error) {
            console.error('Error al suscribirse:', error);
        }
    }

    // Función para verificar estado de suscripción
    async function verificarEstadoSuscripcion(usuarioSuscritoId) {
        try {
            const usuarioSuscriptorId = obtenerUsuarioIdActual();
            if (!usuarioSuscriptorId || !usuarioSuscritoId) return;
            
            if (usuarioSuscriptorId === usuarioSuscritoId) {
                // Si es el propio usuario, ocultar el botón de suscripción
                const subscribeBtn = document.querySelector('.subscribe-btn');
                if (subscribeBtn) {
                    subscribeBtn.style.display = 'none';
                }
                return;
            }
            
            const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/${usuarioSuscriptorId}/esta-suscrito/${usuarioSuscritoId}`);
            const estaSuscrito = await response.json();
            
            if (estaSuscrito) {
                const subscribeBtn = document.querySelector('.subscribe-btn');
                if (subscribeBtn) {
                    subscribeBtn.textContent = 'SUSCRITO';
                    subscribeBtn.classList.add('subscribed');
                    subscribeBtn.disabled = true;
                }
            }
        } catch (error) {
            console.error('Error al verificar suscripción:', error);
        }
    }

    // Función auxiliar para obtener el ID del usuario actual
    function obtenerUsuarioIdActual() {
        return localStorage.getItem('userId');
    }

    // Función auxiliar para formatear fechas
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);
        const ahora = new Date();
        const diferencia = ahora - fecha;
        
        const minutos = Math.floor(diferencia / (1000 * 60));
        const horas = Math.floor(diferencia / (1000 * 60 * 60));
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        
        if (minutos < 60) {
            return `hace ${minutos} minutos`;
        } else if (horas < 24) {
            return `hace ${horas} horas`;
        } else {
            return `hace ${dias} días`;
        }
    }

    // Cargar los videos al inicio
    cargarVideos();
});