/**
 * Manejo del formulario de registro de usuarios
 * @authors Jorge Miguel Méndez Barón, Jose David Cucanchon Ramirez, Edgar Julian Roldan Rojas
 */

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

        /**
         * Registra un nuevo usuario en el sistema
         * @async
         * @function registerUser
         * @param {Object} userData - Datos del usuario a registrar
         * @param {string} userData.nombre - Nombre completo del usuario
         * @param {string} userData.nickname - Nombre de usuario único
         * @param {string} userData.ciudadDeNacimiento - Ciudad de nacimiento
         * @param {string} userData.password - Contraseña del usuario
         * @param {string} userData.email - Correo electrónico
         * @param {string} userData.sexo - Sexo del usuario
         * @throws {Error} Error al registrar usuario (nickname duplicado, email inválido, etc.)
         * @returns {Promise<void>} Redirige al login si el registro es exitoso
         */
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
            // Limpiar estilos previos
            form.querySelectorAll('input, select').forEach(el => {
                el.style.borderColor = '';
            });
            // Marcar campo con error si es posible
            if (error.message.toLowerCase().includes('nickname')) {
                document.getElementById('nickname').style.border = '2px solid red';
            } else if (error.message.toLowerCase().includes('correo') || error.message.toLowerCase().includes('email')) {
                document.getElementById('email').style.border = '2px solid red';
            } else if (error.message.toLowerCase().includes('contraseña') || error.message.toLowerCase().includes('password')) {
                document.getElementById('password').style.border = '2px solid red';
            }
            setTimeout(() => {
                registerMsg.textContent = '';
                form.querySelectorAll('input, select').forEach(el => {
                    el.style.border = '';
                });
            }, 2000);
        }
    });
});