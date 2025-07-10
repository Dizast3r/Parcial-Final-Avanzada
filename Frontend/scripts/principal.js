document.addEventListener('DOMContentLoaded', () => {
    const barralateral = document.getElementById('barralateral');
    const cerrar = document.querySelector('.barralateral-overlay');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const contenidoPrincipal = document.getElementById('contenidoPrincipal');

    const toggleSidebar = () => {
        barralateral.classList.toggle('active');
        cerrar.classList.toggle('active');
    };

    const toggleSidebarVisibility = () => {
        barralateral.classList.toggle('hidden');
        contenidoPrincipal.classList.toggle('expanded');

        if (barralateral.classList.contains('hidden')) {
            hamburgerBtn.classList.add('show');
        } else {
            hamburgerBtn.classList.remove('show');
        }
    };

    hamburgerBtn.addEventListener('click', (e) => {
        
        if (window.innerWidth <= 768) {
            toggleSidebar();
        } else {
            
            if (hamburgerBtn.classList.contains('show')) {
                toggleSidebarVisibility();
            }
        }
    });

    sidebarToggleBtn.addEventListener('click', toggleSidebarVisibility);

    cerrar.addEventListener('click', toggleSidebar);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && barralateral.classList.contains('active')) {
            barralateral.classList.remove('active');
            cerrar.classList.remove('active');
        }
    });

    const sidebarLinks = document.querySelectorAll('.barralateral-item');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                barralateral.classList.remove('active');
                cerrar.classList.remove('active');
            }
        });
    });
});