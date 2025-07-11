document.addEventListener('DOMContentLoaded', () => {
    // Mostrar nickname en el canal
    const canalNickname = document.getElementById('canalNickname');
    const nickname = localStorage.getItem('nickname') || 'Invitado';
    if (canalNickname) {
        canalNickname.textContent = nickname;
    }

    // Mossstrar videos publicados (fetch real)
    async function cargarVideosUsuario() {
        const videosList = document.getElementById('videosList');
        videosList.classList.add('empty');
        videosList.textContent = 'No has publicado ningún video aún.';
        const nickname = localStorage.getItem('nickname');
        if (!nickname) return;
        // Obtener usuarioId por nickname
        try {
            const usuarioResp = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/nickname=${nickname}`);
            const usuarioData = await usuarioResp.json();
            if (!usuarioData || !usuarioData.id) return;
            const usuarioId = usuarioData.id;
            // Obtener videos del usuario
            const videosResp = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/video/usuario/${usuarioId}`);
            const videos = await videosResp.json();
            if (Array.isArray(videos) && videos.length > 0) {
                videosList.classList.remove('empty');
                videosList.textContent = '';
                videos.forEach(video => agregarVideoAlCanal({
                    titulo: video.titulo,
                    descripcion: video.descripcion || video.Descripcion,
                    miniatura: video.miniatura_src,
                    url: video.video_src
                }));
            }
        } catch (e) {
            // Si hay error, dejar mensaje vacío
        }
    }
    cargarVideosUsuario();

    // Crear y mostrar el formulario modal para subir video
    function mostrarModalSubirVideo() {
        // Crear overlay
        let overlay = document.createElement('div');
        overlay.id = 'modalOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.6)';
        overlay.style.zIndex = 1000;
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        // Crear modal
        let modal = document.createElement('div');
        modal.className = 'modal-subir-video';
        modal.innerHTML = `
            <h2>Subir video</h2>
            <form id="formSubirVideo">
                <label for="tituloVideo">Título del video</label>
                <input type="text" id="tituloVideo" name="tituloVideo" required />
                <label for="descripcionVideo">Descripción</label>
                <textarea id="descripcionVideo" name="descripcionVideo" required></textarea>
                <label for="miniaturaUrl">URL de la miniatura</label>
                <input type="text" id="miniaturaUrl" name="miniaturaUrl" required />
                <label for="videoUrl">URL del video</label>
                <input type="text" id="videoUrl" name="videoUrl" required />
                <div class="modal-btns">
                    <button type="submit">Subir video</button>
                    <button type="button" id="cerrarModalBtn">Cancelar</button>
                </div>
                <div id="mensajeSubida" class="mensaje-subida"></div>
                <div id="progresoSubida" class="progreso-subida"></div>
            </form>
        `;
        modal.style.background = '#232323';
        modal.style.padding = '2rem 2.5rem';
        modal.style.borderRadius = '16px';
        modal.style.boxShadow = '0 4px 32px rgba(0,0,0,0.25)';
        modal.style.width = '100%';
        modal.style.maxWidth = '400px';
        modal.style.color = '#fff';
        modal.style.position = 'relative';

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Cerrar modal
        document.getElementById('cerrarModalBtn').onclick = () => {
            overlay.remove();
        };

        // Subir video
        document.getElementById('formSubirVideo').onsubmit = async function(e) {
            e.preventDefault();
            const mensaje = document.getElementById('mensajeSubida');
            const progreso = document.getElementById('progresoSubida');
            mensaje.textContent = 'Subiendo video...';
            progreso.textContent = '';
            let percent = 0;
            // Animación de carga
            const interval = setInterval(() => {
                percent++;
                progreso.textContent = `Cargando: ${percent * 10}%`;
                if (percent >= 10) {
                    clearInterval(interval);
                    mensaje.textContent = '¡Se ha subido el video correctamente!';
                    progreso.textContent = '';
                    setTimeout(() => {
                        overlay.remove();
                        cargarVideosUsuario(); // Refrescar lista de videos desde el backend
                    }, 1200);
                }
            }, 100);
            // Obtener usuarioId directamente del localStorage si ya está guardado
            let usuarioId = localStorage.getItem('usuarioId');
            if (!usuarioId) {
                try {
                    const usuarioResp = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/nickname=${localStorage.getItem('nickname')}`);
                    const usuarioData = await usuarioResp.json();
                    usuarioId = usuarioData.id;
                    if (usuarioId) localStorage.setItem('usuarioId', usuarioId);
                } catch {}
            }
            // Enviar al backend usando el endpoint /video/crear
            if (usuarioId) {
                await fetch('https://parcial-final-avanzada-production-cdde.up.railway.app/video/crear', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        titulo: document.getElementById('tituloVideo').value,
                        miniatura_src: document.getElementById('miniaturaUrl').value,
                        video_src: document.getElementById('videoUrl').value,
                        Descripcion: document.getElementById('descripcionVideo').value,
                        usuario: { id: usuarioId },
                        vistas: 0
                    })
                });
            }
        };
    }

    // Agregar video al canal (simulado)
    function agregarVideoAlCanal(video) {
        const videosList = document.getElementById('videosList');
        videosList.classList.remove('empty');
        // Crear contenedor de video
        const div = document.createElement('div');
        div.className = 'video-item';
        div.innerHTML = `
            <div class="video-miniatura-container" style="display:flex;align-items:center;gap:16px;">
                <img src="${video.miniatura}" alt="Miniatura" style="width:120px;height:70px;object-fit:cover;border-radius:8px;cursor:pointer;">
                <div>
                    <strong>${video.titulo}</strong><br>
                    <span style="font-size:0.95rem;color:#ccc;">${video.descripcion}</span>
                </div>
            </div>
        `;
        // Evento para mostrar el video pequeño al hacer click en la miniatura
        const miniatura = div.querySelector('img');
        miniatura.addEventListener('click', () => {
            mostrarVideoMini(video.url, video.titulo);
        });
        videosList.appendChild(div);
    }

    // Mostrar video pequeño en el lugar
    function mostrarVideoMini(url, titulo) {
        // Crear overlay para el video
        let overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.7)';
        overlay.style.zIndex = 2000;
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.innerHTML = `
            <div style="background:#232323;padding:1.5rem 2rem;border-radius:16px;box-shadow:0 4px 32px rgba(0,0,0,0.25);display:flex;flex-direction:column;align-items:center;">
                <h3 style="color:#fff;margin-bottom:1rem;">${titulo}</h3>
                <video src="${url}" controls style="width:320px;height:180px;border-radius:10px;background:#000;"></video>
                <button id="cerrarVideoMini" style="margin-top:1.2rem;padding:0.5rem 1.5rem;background:#7614a3;color:#fff;border:none;border-radius:8px;cursor:pointer;">Cerrar</button>
            </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('cerrarVideoMini').onclick = () => overlay.remove();
    }

    // Botón para subir video (puedes enlazar a un formulario o modal)
    document.getElementById('subirVideoBtn').addEventListener('click', mostrarModalSubirVideo);

    // Menú desplegable de usuario
    const profileMenuBtn = document.getElementById('profileMenuBtn');
    const profileMenuDropdown = document.getElementById('profileMenuDropdown');
    const profileMenuContainer = profileMenuBtn?.parentElement;
    if (profileMenuBtn && profileMenuDropdown && profileMenuContainer) {
        profileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileMenuContainer.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!profileMenuContainer.contains(e.target)) {
                profileMenuContainer.classList.remove('open');
            }
        });
    }

    // Opción de cerrar sesión
    const cerrarSesionBtn = document.getElementById('menuCerrarSesion');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('nickname');
            alert('Sesión cerrada correctamente.');
            window.location.href = 'login.html';
        });
    }

    // Opción de inicio
    const inicioBtn = document.getElementById('menuInicio');
    if (inicioBtn) {
        inicioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'principal.html';
        });
    }
});
