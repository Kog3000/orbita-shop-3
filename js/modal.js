// Модальные окна товаров и избранное

const modal = document.getElementById('product-modal');
const productCards = document.querySelectorAll('.catalog-products-card');

if (modal && productCards.length) {
    const mainImage = document.getElementById('modal-main-image');
    const bottomImage = document.getElementById('modal-bottom-image');

    const title = document.getElementById('modal-title');
    const price = document.getElementById('modal-price');
    const category = document.getElementById('modal-category');
    const description = document.getElementById('modal-description');

    const quantity = document.getElementById('modal-quantity');
    const minus = document.getElementById('modal-minus');
    const plus = document.getElementById('modal-plus');

    let currentQuantity = 1;

    function openModal(card) {
        const data = card.dataset;

        currentQuantity = 1;
        if (quantity) quantity.textContent = currentQuantity;

        if (title) title.textContent = data.title || '';
        if (price) price.textContent = data.price || '';
        if (category) category.textContent = data.category || 'ТОВАР';
        if (description) description.textContent = data.description || '';

        const main = data.modalMain || data.image || '';
        const bottom = data.modalBottom || main;

        if (mainImage) {
            mainImage.src = main;
            mainImage.alt = data.title || '';
        }

        if (bottomImage) {
            bottomImage.src = bottom;
            bottomImage.alt = data.title || '';
        }

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    productCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    modal.querySelectorAll('[data-modal-close]').forEach(button => {
        button.addEventListener('click', closeModal);
    });

    minus?.addEventListener('click', () => {
        currentQuantity = Math.max(1, currentQuantity - 1);
        if (quantity) quantity.textContent = currentQuantity;
    });

    plus?.addEventListener('click', () => {
        currentQuantity += 1;
        if (quantity) quantity.textContent = currentQuantity;
    });

    modal.querySelectorAll('.modal-accordion').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('is-open');
        });
    });

    document.addEventListener('keydown', event => {
        if (
            event.key === 'Escape' &&
            modal.classList.contains('is-open')
        ) {
            closeModal();
        }
    });
}

// Избранное
document.querySelectorAll('.to-heart-button').forEach(button => {
    button.addEventListener('click', event => {
        event.stopPropagation();
        button.classList.toggle('checked');
    });
});