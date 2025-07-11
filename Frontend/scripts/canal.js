document.addEventListener('DOMContentLoaded', () => {
    // Mostrar nickname en el canal
    const canalNickname = document.getElementById('canalNickname');
    const nickname = localStorage.getItem('nickname') || 'Invitado';
    if (canalNickname) {
        canalNickname.textContent = nickname;
    }

    // Mostrar videos publicados (simulado)
    const videosList = document.getElementById('videosList');
    // Aquí deberías hacer un fetch al backend para obtener los videos del usuario
    // Por ahora, simulamos vacío
    const videos = [];
    if (videos.length === 0) {
        videosList.classList.add('empty');
        videosList.textContent = 'No has publicado ningún video aún.';
    } else {
        videos.forEach(video => {
            const div = document.createElement('div');
            div.className = 'video-item';
            div.textContent = video.titulo;
            videosList.appendChild(div);
        });
    }

    // Botón para subir video (puedes enlazar a un formulario o modal)
    document.getElementById('subirVideoBtn').addEventListener('click', () => {
        alert('Funcionalidad de subir video próximamente.');
    });

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
