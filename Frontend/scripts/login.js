document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5500/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.messege || 'Error al iniciar sesion')
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);

            window.location.href = 'home.html';
        } catch (error) {
            errorMsg.textContent = error.message;
        }
    });
});