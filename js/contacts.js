// Раскрытие ответов FAQ
document.querySelectorAll('.faq-item button').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        if (!item) return;

        const isOpen = item.classList.toggle('is-open');

        button.setAttribute('aria-expanded', String(isOpen));
    });
});

// Обработка формы контактов
document.getElementById('contactsForm')?.addEventListener('submit', event => {
    event.preventDefault();

    const feedback = document.getElementById('contactsFeedback');

    if (feedback) {
        feedback.textContent = 'Спасибо! Ваше сообщение подготовлено.';
    }

    event.currentTarget.reset();
});