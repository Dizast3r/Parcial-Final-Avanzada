/**
 * Manejo del formulario de inicio de sesión
 * @authors Jorge Miguel Méndez Barón, Jose David Cucanchon Ramirez, Edgar Julian Roldan Rojas
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nickname = document.getElementById('nickname').value.trim();
        const password = document.getElementById('password').value;

        /**
         * Realiza el proceso de autenticación del usuario
         * @async
         * @function authenticateUser
         * @param {string} nickname - Nombre de usuario
         * @param {string} password - Contraseña del usuario
         * @throws {Error} Error al iniciar sesión o credenciales inválidas
         * @returns {Promise<void>} Redirige al usuario a la página principal si es exitoso
         */
        try {
            const response = await fetch('https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({nickname, password})
            });

            if (!response.ok) {
                const err = await response.json();
                // Mensaje personalizado para credenciales inválidas
                if (err.message && err.message.toLowerCase().includes('credenciales')) {
                    throw new Error('Nombre de usuario o contraseña incorrectos');
                }
                throw new Error(err.message || 'Error al iniciar sesión');
            }

            const data = await response.json();
            // Guardar el nickname
            localStorage.setItem('nickname', nickname);
            // Guardar el usuario completo como JSON string (el backend retorna el usuario directamente)
            localStorage.setItem('usuario', JSON.stringify(data));
            window.location.href = 'principal.html';
        } catch (error) {
            errorMsg.textContent = error.message;
        }
    });

    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (togglePasswordBtn && passwordInput && eyeIcon) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            eyeIcon.textContent = isPassword ? '🙈' : '👁️';
        });
    }
});