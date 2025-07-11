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



// Variables para la búsqueda
let todosLosVideos = []; // Cache de todos los videos
let busquedaTimeout; // Para debounce de la búsqueda

// Función para inicializar la búsqueda
function inicializarBusqueda() {
    const buscarInput = document.querySelector('.buscar-input');
    const buscarBtn = document.querySelector('.buscar-btn');
    
    if (buscarInput) {
        // Búsqueda en tiempo real con debounce
        buscarInput.addEventListener('input', (e) => {
            clearTimeout(busquedaTimeout);
            const termino = e.target.value.trim();
            
            // Debounce de 300ms para evitar muchas búsquedas
            busquedaTimeout = setTimeout(() => {
                if (termino.length >= 2) {
                    buscarVideos(termino);
                } else if (termino.length === 0) {
                    mostrarTodosLosVideos();
                }
            }, 300);
        });
        
        // Búsqueda al presionar Enter
        buscarInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const termino = e.target.value.trim();
                if (termino.length >= 1) {
                    buscarVideos(termino);
                }
            }
        });
    }
    
    if (buscarBtn) {
        // Búsqueda al hacer clic en el botón
        buscarBtn.addEventListener('click', () => {
            const termino = buscarInput.value.trim();
            if (termino.length >= 1) {
                buscarVideos(termino);
            }
        });
    }
}

// Función para buscar videos
async function buscarVideos(termino) {
    try {
        // Mostrar indicador de carga
        mostrarIndicadorCarga();
        
        const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/video/buscar?titulo=${encodeURIComponent(termino)}`);
        
        if (!response.ok) {
            throw new Error('Error en la búsqueda');
        }
        
        const videos = await response.json();
        console.log('Resultados de búsqueda:', videos);
        
        // Mostrar resultados
        mostrarResultadosBusqueda(videos, termino);
        
    } catch (error) {
        console.error('Error al buscar videos:', error);
        mostrarErrorBusqueda(error.message);
    }
}

// Función para mostrar resultados de búsqueda
function mostrarResultadosBusqueda(videos, termino) {
    const videosGrid = document.getElementById('videosGrid');
    const contenidoPrincipal = document.getElementById('contenidoPrincipal');
    
    // Actualizar el título para mostrar que es una búsqueda
    const titulo = contenidoPrincipal.querySelector('h1');
    if (titulo) {
        titulo.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span>Resultados para "${termino}"</span>
                <button class="limpiar-busqueda-btn" onclick="limpiarBusqueda()" style="
                    background: #ff4444;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#ff6666'" onmouseout="this.style.background='#ff4444'">
                    Limpiar búsqueda
                </button>
            </div>
        `;
    }
    
    if (!Array.isArray(videos) || videos.length === 0) {
        videosGrid.innerHTML = `
            <div style="
                color: #fff;
                font-size: 1.2rem;
                text-align: center;
                padding: 2rem;
                background: #2a2a2a;
                border-radius: 10px;
                margin: 2rem 0;
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <div>No se encontraron videos para "${termino}"</div>
                <div style="font-size: 1rem; color: #aaa; margin-top: 0.5rem;">
                    Intenta con otros términos de búsqueda
                </div>
            </div>
        `;
        return;
    }
    
    // Cargar videos encontrados usando la función existente
    videosGrid.innerHTML = '';
    videos.forEach(video => {
        console.log('Procesando video de búsqueda:', video);
        
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
        
        // Al hacer click en la miniatura, mostrar el video en grande
        card.querySelector('.video-thumb').addEventListener('click', () => {
            if (videoSrc) {
                mostrarModalVideo(videoSrc, titulo, video);
                incrementarVistas(video.id);
            }
        });
        
        videosGrid.appendChild(card);
    });
    
    // Mostrar estadísticas de búsqueda
    const estadisticas = document.createElement('div');
    estadisticas.style.cssText = `
        color: #aaa;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid #333;
    `;
    estadisticas.textContent = `Se encontraron ${videos.length} ${videos.length === 1 ? 'video' : 'videos'}`;
    videosGrid.insertBefore(estadisticas, videosGrid.firstChild);
}

// Redirigir a suscripciones.html al hacer clic en "Suscripciones"
const suscripcionesLink = Array.from(document.querySelectorAll('.barralateral-item .text'))
    .find(el => el.textContent.trim() === 'Suscripciones')?.parentElement;
if (suscripcionesLink) {
    suscripcionesLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'suscripciones.html';
    });
}

// Redirigir a videos-que-me-gustan.html al hacer clic en "Videos que me gustan"
const videosQueMeGustanLink = Array.from(document.querySelectorAll('.barralateral-item .text'))
    .find(el => el.textContent.trim() === 'Videos que me gustan')?.parentElement;
if (videosQueMeGustanLink) {
    videosQueMeGustanLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'videos-que-me-gustan.html';
    });
}

// Redirigir a suscriptores.html al hacer clic en "Suscriptores"
const suscriptoresLink = Array.from(document.querySelectorAll('.barralateral-item .text'))
    .find(el => el.textContent.trim() === 'Suscriptores')?.parentElement;
if (suscriptoresLink) {
    suscriptoresLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'suscriptores.html';
    });
}

// Función para crear tarjeta de video (eliminada para evitar duplicación)
// Se usa el código integrado en mostrarResultadosBusqueda

// Función para mostrar indicador de carga
function mostrarIndicadorCarga() {
    const videosGrid = document.getElementById('videosGrid');
    videosGrid.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 3rem;
            color: #fff;
            font-size: 1.1rem;
        ">
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
            ">
                <div class="loader" style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid #333;
                    border-top: 4px solid #ff0000;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <span>Buscando videos...</span>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
}

// Función para mostrar error de búsqueda
function mostrarErrorBusqueda(mensaje) {
    const videosGrid = document.getElementById('videosGrid');
    videosGrid.innerHTML = `
        <div style="
            color: #fff;
            font-size: 1.2rem;
            text-align: center;
            padding: 2rem;
            background: #ff4444;
            border-radius: 10px;
            margin: 2rem 0;
        ">
            <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
            <div>Error al buscar videos</div>
            <div style="font-size: 1rem; color: #ffcccc; margin-top: 0.5rem;">
                ${mensaje}
            </div>
            <button onclick="mostrarTodosLosVideos()" style="
                background: #fff;
                color: #ff4444;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                cursor: pointer;
                margin-top: 1rem;
                font-weight: bold;
            ">
                Volver a todos los videos
            </button>
        </div>
    `;
}

// Función para limpiar búsqueda
function limpiarBusqueda() {
    const buscarInput = document.querySelector('.buscar-input');
    if (buscarInput) {
        buscarInput.value = '';
    }
    mostrarTodosLosVideos();
}

// Función para mostrar todos los videos
function mostrarTodosLosVideos() {
    const contenidoPrincipal = document.getElementById('contenidoPrincipal');
    const titulo = contenidoPrincipal.querySelector('h1');
    if (titulo) {
        titulo.innerHTML = 'Videos';
    }
    
    // Recargar todos los videos
    cargarVideos();
}

// Función para resaltar términos de búsqueda (opcional)
function resaltarTermino(texto, termino) {
    if (!termino || termino.length < 2) return texto;
    
    const regex = new RegExp(`(${termino})`, 'gi');
    return texto.replace(regex, '<mark style="background: #ffff00; color: #000; padding: 0 2px;">$1</mark>');
}

// Función para obtener sugerencias de búsqueda (opcional)
async function obtenerSugerencias(termino) {
    try {
        // Filtrar videos locales para sugerencias rápidas
        if (todosLosVideos.length > 0) {
            const sugerencias = todosLosVideos
                .filter(video => 
                    video.titulo?.toLowerCase().includes(termino.toLowerCase()) ||
                    video.usuario?.nickname?.toLowerCase().includes(termino.toLowerCase())
                )
                .slice(0, 5)
                .map(video => ({
                    tipo: 'video',
                    texto: video.titulo,
                    canal: video.usuario?.nickname
                }));
            
            return sugerencias;
        }
        return [];
    } catch (error) {
        console.error('Error al obtener sugerencias:', error);
        return [];
    }
}

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

    // Mostrar nickname en el perfil
    const datosUsuario = obtenerDatosUsuario();
    if (profileNickname) {
        profileNickname.textContent = datosUsuario.nickname ? datosUsuario.nickname : 'Invitado';
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
            localStorage.removeItem('usuario'); // Limpiar también el objeto usuario
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
        setupModalEventListeners(overlay, videoData);
        
        // Cargar datos iniciales
        cargarLikesYDislikes(videoData.id);
        cargarComentarios(videoData.id);
        cargarContadorSuscriptores(videoData.usuario?.id);
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

    // Función auxiliar para obtener el ID del usuario actual
    function obtenerUsuarioIdActual() {
        const datosUsuario = obtenerDatosUsuario();
        return datosUsuario.id || localStorage.getItem('userId');
    }

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

    window.limpiarBusqueda = limpiarBusqueda;
window.mostrarTodosLosVideos = mostrarTodosLosVideos;

    // Cargar los videos al inicio
    cargarVideos();
    
    // Inicializar funcionalidad de búsqueda
    inicializarBusqueda();
});