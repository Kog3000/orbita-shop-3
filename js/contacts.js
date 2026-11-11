// Раскрытие ответов FAQ
document.querySelectorAll('.faq-item button').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        if (!item) return;

        const isOpen = item.classList.toggle('is-open');

        button.setAttribute('aria-expanded', String(isOpen));
    });
});

// Валидация формы контактов
const contactsForm = document.getElementById('contactsForm');

if (contactsForm) {
    const feedback = document.getElementById('contactsFeedback');

    const fields = [
        ...contactsForm.querySelectorAll(
            'input:not([type="checkbox"]):not([type="hidden"]), textarea'
        )
    ];

    contactsForm.setAttribute('novalidate', '');

    function showError(field, message) {
        const wrapper = field.closest('.contacts-form-field');

        if (!wrapper) return;

        let error = wrapper.querySelector('.contacts-form-error');

        if (!error) {
            error = document.createElement('span');
            error.classList.add('contacts-form-error');
            wrapper.append(error);
        }

        error.textContent = message;
        field.classList.add('is-invalid');
        field.setAttribute('aria-invalid', 'true');
    }

    function clearError(field) {
        const wrapper = field.closest('.contacts-form-field');

        if (!wrapper) return;

        wrapper.querySelector('.contacts-form-error')?.remove();
        field.classList.remove('is-invalid');
        field.removeAttribute('aria-invalid');
    }

    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = `${field.name} ${field.id} ${field.className}`.toLowerCase();

        clearError(field);

        if (field.required && !value) {
            showError(field, 'Заполните это поле.');
            return false;
        }

        if (!value) return true;

        if (name.includes('email') || type === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(value)) {
                showError(field, 'Введите корректный email.');
                return false;
            }
        }

        if (name.includes('phone') || type === 'tel') {
            const digits = value.replace(/\D/g, '');
            const phonePattern = /^[+\d\s()\-]+$/;

            if (!phonePattern.test(value) || digits.length < 7 || digits.length > 15) {
                showError(field, 'Введите корректный номер телефона.');
                return false;
            }
        }

        if (field.tagName === 'TEXTAREA' || name.includes('message')) {
            if (value.length < 10) {
                showError(field, 'Сообщение должно содержать не менее 10 символов.');
                return false;
            }
        }

        if (name.includes('name')) {
            if (value.length < 2) {
                showError(field, 'Введите не менее 2 символов.');
                return false;
            }
        }

        return true;
    }

    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));

        field.addEventListener('input', () => {
            if (field.classList.contains('is-invalid')) {
                validateField(field);
            }

            if (feedback) feedback.textContent = '';
        });
    });

    contactsForm.addEventListener('submit', event => {
        event.preventDefault();

        let isValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            if (feedback) {
                feedback.textContent = 'Проверьте правильность заполнения полей.';
                feedback.classList.remove('is-success');
            }

            contactsForm.querySelector('.is-invalid')?.focus();
            return;
        }

        if (feedback) {
            feedback.textContent = 'Спасибо! Ваше сообщение подготовлено.';
            feedback.classList.add('is-success');
        }

        contactsForm.reset();
        fields.forEach(field => clearError(field));
    });
}
