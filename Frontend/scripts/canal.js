document.addEventListener('DOMContentLoaded', () => {
    // Mostrar nickname en el canal
    const canalNickname = document.getElementById('canalNickname');
    const nickname = localStorage.getItem('nickname') || 'Invitado';
    if (canalNickname) {
        canalNickname.textContent = nickname;
    }

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
                <input type="text" id="tituloVideo" name="tituloVideo" required maxlength="50" />
                <label for="descripcionVideo">Descripción</label>
                <textarea id="descripcionVideo" name="descripcionVideo" required maxlength="400"></textarea>
                <label for="miniaturaUrl">URL de la miniatura</label>
                <input type="url" id="miniaturaUrl" name="miniaturaUrl" required maxlength="300" />
                <label for="videoUrl">URL del video</label>
                <input type="url" id="videoUrl" name="videoUrl" required maxlength="300" />
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

        // Cerrar modal al hacer clic fuera
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // Cerrar modal
        document.getElementById('cerrarModalBtn').onclick = () => {
            overlay.remove();
        };

        // Manejar el submit del formulario de subir video
        const formSubirVideo = document.getElementById('formSubirVideo');
        const mensajeSubida = document.getElementById('mensajeSubida');
        
        formSubirVideo.addEventListener('submit', async (e) => {
            e.preventDefault();
            mensajeSubida.textContent = '';
            mensajeSubida.style.color = '';

            // Obtener datos del formulario
            const titulo = document.getElementById('tituloVideo').value.trim();
            const descripcion = document.getElementById('descripcionVideo').value.trim();
            const miniatura_src = document.getElementById('miniaturaUrl').value.trim();
            const video_src = document.getElementById('videoUrl').value.trim();

            // Validaciones básicas
            if (!titulo || !descripcion || !miniatura_src || !video_src) {
                mensajeSubida.textContent = 'Todos los campos son obligatorios.';
                mensajeSubida.style.color = 'red';
                return;
            }

            if (titulo.length > 50) {
                mensajeSubida.textContent = 'El título no puede tener más de 50 caracteres.';
                mensajeSubida.style.color = 'red';
                return;
            }

            if (descripcion.length > 400) {
                mensajeSubida.textContent = 'La descripción no puede tener más de 400 caracteres.';
                mensajeSubida.style.color = 'red';
                return;
            }

            // Obtener usuario de localStorage
            let usuario = null;
            let usuarioStr = localStorage.getItem('usuario');
            if (!usuarioStr) {
                mensajeSubida.textContent = 'No se encontró información del usuario. Inicia sesión de nuevo.';
                mensajeSubida.style.color = 'red';
                return;
            }

            try {
                usuario = JSON.parse(usuarioStr);
            } catch (err) {
                mensajeSubida.textContent = 'Error al leer los datos del usuario.';
                mensajeSubida.style.color = 'red';
                return;
            }

            let userId = usuario.id;
            if (typeof userId === 'string' && userId.includes(':')) {
                userId = userId.split(':')[0];
            }
            
            if (!userId) {
                mensajeSubida.textContent = 'No se encontró el ID del usuario. Vuelve a iniciar sesión.';
                mensajeSubida.style.color = 'red';
                return;
            }

            // Convertir userId a número si es string
            userId = parseInt(userId);
            if (isNaN(userId)) {
                mensajeSubida.textContent = 'ID de usuario inválido. Vuelve a iniciar sesión.';
                mensajeSubida.style.color = 'red';
                return;
            }

            // Mostrar mensaje de carga
            mensajeSubida.textContent = 'Subiendo video...';
            mensajeSubida.style.color = 'yellow';

            // Ahora el backend usa @RequestParam, enviamos como FormData
            const endpoint = `https://parcial-final-avanzada-production-cdde.up.railway.app/video/crear/${userId}`;
            
            // Crear FormData para enviar parámetros
            const formData = new FormData();
            formData.append('titulo', titulo);
            formData.append('miniatura_src', miniatura_src);
            formData.append('video_src', video_src);
            formData.append('descripcion', descripcion);
            
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    let errMsg = 'Error al subir el video';
                    try {
                        const errorData = await response.json();
                        if (errorData.message) {
                            errMsg = errorData.message;
                        } else if (errorData.error) {
                            errMsg = errorData.error;
                        }
                    } catch (jsonError) {
                        errMsg = `Error ${response.status}: ${response.statusText}`;
                    }
                    throw new Error(errMsg);
                }

                const videoCreado = await response.json();
                mensajeSubida.textContent = '¡Video subido exitosamente!';
                mensajeSubida.style.color = 'lightgreen';
                
                // Limpiar formulario
                formSubirVideo.reset();
                
                // Agregar video al canal si existe la función
                if (typeof agregarVideoAlCanal === 'function') {
                    agregarVideoAlCanal({
                        id: videoCreado.id,
                        titulo: videoCreado.titulo,
                        descripcion: videoCreado.descripcion || videoCreado.Descripcion,
                        miniatura: videoCreado.miniatura_src,
                        url: videoCreado.video_src
                    });
                }
                
                // Cerrar modal después de un tiempo
                setTimeout(() => {
                    overlay.remove();
                    // Opcional: recargar la página para mostrar el nuevo video
                    // window.location.reload();
                }, 1500);

            } catch (error) {
                console.error('Error al subir video:', error);
                mensajeSubida.textContent = error.message || 'Error al subir el video';
                mensajeSubida.style.color = 'red';
            }
        });
    }

    // Función para eliminar video
    async function eliminarVideo(videoId, videoElement) {
        if (!confirm('¿Estás seguro de que quieres eliminar este video?')) {
            return;
        }

        try {
            const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/video/${videoId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el video');
            }

            // Remover el elemento del DOM
            videoElement.remove();
            
            // Mostrar mensaje de éxito
            const mensaje = document.createElement('div');
            mensaje.style.position = 'fixed';
            mensaje.style.top = '20px';
            mensaje.style.right = '20px';
            mensaje.style.background = '#4CAF50';
            mensaje.style.color = '#fff';
            mensaje.style.padding = '1rem 1.5rem';
            mensaje.style.borderRadius = '8px';
            mensaje.style.zIndex = '9999';
            mensaje.textContent = 'Video eliminado exitosamente';
            document.body.appendChild(mensaje);

            // Remover mensaje después de 3 segundos
            setTimeout(() => {
                mensaje.remove();
            }, 3000);

        } catch (error) {
            console.error('Error al eliminar video:', error);
            alert('Error al eliminar el video. Inténtalo de nuevo.');
        }
    }

    // Agregar video al canal (con botón eliminar)
    function agregarVideoAlCanal(video) {
        const videosList = document.getElementById('videosList');
        if (videosList) {
            videosList.classList.remove('empty');
            
            // Crear contenedor de video
            const div = document.createElement('div');
            div.className = 'video-item';
            div.innerHTML = `
                <div class="video-content">
                    <div class="video-info">
                        <img src="${video.miniatura}" alt="Miniatura" class="video-miniatura">
                        <div class="video-details">
                            <h4 class="video-titulo">${video.titulo}</h4>
                            <p class="video-descripcion">${video.descripcion}</p>
                        </div>
                    </div>
                    <button class="eliminar-btn" data-video-id="${video.id}">
                        <span class="eliminar-icono">🗑️</span>
                        Eliminar
                    </button>
                </div>
            `;
            
            // Evento para mostrar el video pequeño al hacer click en la miniatura
            const miniatura = div.querySelector('.video-miniatura');
            miniatura.addEventListener('click', () => {
                mostrarVideoMini(video.url, video.titulo, video.descripcion);
            });
            
            // Evento para eliminar video
            const eliminarBtn = div.querySelector('.eliminar-btn');
            eliminarBtn.addEventListener('click', () => {
                eliminarVideo(video.id, div);
            });
            
            videosList.appendChild(div);
        }
    }

    // Mostrar video pequeño en el lugar
    function mostrarVideoMini(url, titulo, descripcion) {
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
            <p style="color:#ccc;margin-top:1rem;font-size:0.95rem;text-align:center;">${descripcion}</p>
            <button id="cerrarVideoMini" style="margin-top:1.2rem;padding:0.5rem 1.5rem;background:#7614a3;color:#fff;border:none;border-radius:8px;cursor:pointer;">Cerrar</button>
        </div>
        `;
        document.body.appendChild(overlay);
        
        // Cerrar modal al hacer clic fuera
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        document.getElementById('cerrarVideoMini').onclick = () => overlay.remove();
    }

    // Botón para subir video
    const subirVideoBtn = document.getElementById('subirVideoBtn');
    if (subirVideoBtn) {
        subirVideoBtn.addEventListener('click', mostrarModalSubirVideo);
    }

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
            localStorage.removeItem('usuario');
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

    // Cargar videos existentes del usuario al cargar la página
    async function cargarVideosDelUsuario() {
        try {
            const usuarioStr = localStorage.getItem('usuario');
            if (!usuarioStr) return;

            const usuario = JSON.parse(usuarioStr);
            let userId = usuario.id;
            
            if (typeof userId === 'string' && userId.includes(':')) {
                userId = userId.split(':')[0];
            }
            
            userId = parseInt(userId);
            if (isNaN(userId)) return;

            const response = await fetch(`https://parcial-final-avanzada-production-cdde.up.railway.app/video/todos`);
            
            if (response.ok) {
                const videos = await response.json();
                const videosDelUsuario = videos.filter(video => video.usuario && video.usuario.id === userId);
                
                videosDelUsuario.forEach(video => {
                    agregarVideoAlCanal({
                        id: video.id,
                        titulo: video.titulo,
                        descripcion: video.descripcion || video.Descripcion,
                        miniatura: video.miniatura_src,
                        url: video.video_src
                    });
                });
            }
        } catch (error) {
            console.error('Error al cargar videos:', error);
        }
    }

    // Cargar videos al iniciar
    cargarVideosDelUsuario();
});
