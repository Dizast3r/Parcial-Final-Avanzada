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
                        mostrarModalVideo(videoSrc, titulo);
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

    function mostrarModalVideo(url, titulo) {
        let overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.8)';
        overlay.style.zIndex = 3000;
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.innerHTML = `
            <div style="background:#232323;padding:2rem 2.5rem;border-radius:18px;box-shadow:0 4px 32px rgba(0,0,0,0.25);display:flex;flex-direction:column;align-items:center;">
                <h2 style="color:#fff;margin-bottom:1.2rem;">${titulo}</h2>
                <video src="${url}" controls autoplay style="width:480px;max-width:80vw;height:270px;max-height:60vh;border-radius:12px;background:#000;"></video>
                <button id="cerrarModalVideo" style="margin-top:1.5rem;padding:0.6rem 2rem;background:#7614a3;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:1rem;">Cerrar</button>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Cerrar modal con click en el botón
        document.getElementById('cerrarModalVideo').onclick = () => overlay.remove();
        
        // Cerrar modal con click fuera del contenido
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    }

    // Cargar los videos al inicio
    cargarVideos();
});