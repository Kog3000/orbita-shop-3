// Мобильная навигация

document.querySelectorAll('.mobile-menu-toggle').forEach(toggle => {
    const menu = document.getElementById('mobileNavigation');
    if (!menu) return;

    const closeButton = menu.querySelector('.btn-close');

    function closeMenu() {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    // Открытие и закрытие по кнопке-бургеру
    toggle.addEventListener('click', () => {
        const opened = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(opened));
    });

    // Закрытие по крестику
    closeButton?.addEventListener('click', closeMenu);

    // Закрытие при переходе по ссылке
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Закрытие клавишей Escape
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
});