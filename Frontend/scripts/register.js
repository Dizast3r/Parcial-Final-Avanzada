document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const registerMsg = document.getElementById('register-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const nickname = document.getElementById('nickname').value.trim();
        const ciudadDeNacimiento = document.getElementById('ciudadDeNacimiento').value.trim();
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value.trim();
        const sexo = document.getElementById('sexo').value;

        try {
            const response = await fetch('https://parcial-final-avanzada-production-cdde.up.railway.app/usuario/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    nickname,
                    ciudadDeNacimiento,
                    password,
                    email,
                    sexo
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Error al registrar usuario');
            }

            const data = await response.json();
            registerMsg.textContent = 'Usuario registrado exitosamente. Redirigiendo al login...';
            registerMsg.style.color = 'green';
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            registerMsg.textContent = error.message;
            registerMsg.style.color = 'red';
        }
    });
});