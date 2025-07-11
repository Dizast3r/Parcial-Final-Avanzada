document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nickname = document.getElementById('nickname').value.trim();
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({nickname, password}) // Enviamos como 'nickname' al backend
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
            localStorage.setItem('token', data.token);
            localStorage.setItem('nickname', nickname);

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