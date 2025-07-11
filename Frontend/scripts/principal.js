document.addEventListener('DOMContentLoaded', () => {
    const barralateral = document.getElementById('barralateral');
    const overlay = document.getElementById('overlay');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const contenidoPrincipal = document.getElementById('contenidoPrincipal');
    
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
    const profileNickname = document.getElementById('profileNickname');
    const userToken = localStorage.getItem('token');
    let nickname = '';
    // Si guardaste el nickname en localStorage, úsalo directamente
    if (localStorage.getItem('nickname')) {
        nickname = localStorage.getItem('nickname');
    } else if (userToken) {
        // Si tienes un token JWT y el nickname está en el payload, puedes decodificarlo aquí
        // (esto es opcional y depende de cómo generes el token en el backend)
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
    async function cargarVideosTodosPrincipal() {
        try {
            const resp = await fetch('https://parcial-final-avanzada-production-cdde.up.railway.app/video/todos');
            const videos = await resp.json();
            if (Array.isArray(videos) && videos.length > 0) {
                mostrarVideosPrincipal(videos);
            } else {
                document.getElementById('contenidoPrincipal').innerHTML = '<h2>No hay videos publicados aún.</h2>';
            }
        } catch {
            document.getElementById('contenidoPrincipal').innerHTML = '<h2>Error al cargar los videos.</h2>';
        }
    }

    // Mostrar solo miniatura y título de cada video en la sección de inicio
    function mostrarVideosPrincipal(videos) {
        const cont = document.getElementById('contenidoPrincipal');
        cont.innerHTML = '<div class="videos-grid"></div>';
        const grid = cont.querySelector('.videos-grid');
        videos.reverse().forEach(video => {
            const div = document.createElement('div');
            div.className = 'video-card-inicio';
            div.innerHTML = `
                <div class="video-thumb-container">
                    <img src="${video.miniatura_src}" alt="Miniatura" class="video-thumb-inicio">
                </div>
                <div class="video-info-inicio">
                    <h3 class="video-title-inicio">${video.titulo}</h3>
                </div>
            `;
            grid.appendChild(div);
        });
    }

    cargarVideosTodosPrincipal();
});