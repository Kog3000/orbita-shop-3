const modal = document.getElementById('product-modal')
const cards = document.querySelectorAll('.catalog-products-card')

if (modal && cards.length) {

    const mainImage = document.getElementById('modal-main-image')
    const bottomImage = document.getElementById('modal-bottom-image')

    const title = document.getElementById('modal-title')
    const price = document.getElementById('modal-price')
    const category = document.getElementById('modal-category')
    const description = document.getElementById('modal-description')

    const quantity = document.getElementById('modal-quantity')
    const minus = document.getElementById('modal-minus')
    const plus = document.getElementById('modal-plus')

    const favorite = document.querySelector('.modal-favorite')

    let currentQuantity = 1

    function openModal(card) {
        const data = card.dataset

        currentQuantity = 1
        quantity.textContent = currentQuantity

        title.textContent = data.title || ''
        price.textContent = data.price || ''
        category.textContent = data.category || 'ТОВАР'
        description.textContent = data.description || ''

        const main = data.modalMain || data.image || ''
        const bottom = data.modalBottom || main

        mainImage.src = main
        mainImage.alt = data.title || ''

        bottomImage.src = bottom
        bottomImage.alt = data.title || ''

        modal.classList.add('is-open')
        modal.setAttribute('aria-hidden', 'false')

        document.body.style.overflow = 'hidden'
    }


    function closeModal() {
        modal.classList.remove('is-open')
        modal.setAttribute('aria-hidden', 'true')

        document.body.style.overflow = ''
    }


    cards.forEach(card => {
        card.addEventListener('click', () => {
            openModal(card)
        })
    })


    modal.querySelectorAll('[data-modal-close]').forEach(button => {
        button.addEventListener('click', closeModal)
    })


    minus.addEventListener('click', () => {
        currentQuantity = Math.max(1, currentQuantity - 1)
        quantity.textContent = currentQuantity
    })


    plus.addEventListener('click', () => {
        currentQuantity += 1
        quantity.textContent = currentQuantity
    })


    modal.querySelectorAll('.modal-accordion').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('is-open')
        })
    })


    document.addEventListener('keydown', event => {
        if (
            event.key === 'Escape' &&
            modal.classList.contains('is-open')
        ) {
            closeModal()
        }
    })
}


const toHeartButtons = [...document.querySelectorAll('.to-heart-button')]

toHeartButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.stopPropagation()
        button.classList.toggle('checked')
    })
})


const catalogButtons = [...document.querySelectorAll('.catalog-buttons-item button')]

catalogButtons.forEach((button) => {
    button.addEventListener('click', () => {
        button.classList.toggle('button-toggle')
    })
})


const filterItems = document.querySelectorAll('.catalog-filters-item')

filterItems.forEach(item => {
    const trigger = item.querySelector('.catalog-filter-trigger')

    trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open')
        filterItems.forEach(filter => {
            filter.classList.remove('is-open')
            filter.querySelector('.catalog-filter-trigger')
                .setAttribute('aria-expanded', 'false')
        })
        if (!isOpen) {
            item.classList.add('is-open')
            trigger.setAttribute('aria-expanded', 'true')
        }
    })
})


document.addEventListener('click', event => {
    if (!event.target.closest('.catalog-filters-list')) {
        filterItems.forEach(item => {
            item.classList.remove('is-open')
            item.querySelector('.catalog-filter-trigger')
                .setAttribute('aria-expanded', 'false')
        })
    }
})


document.querySelectorAll('.mobile-menu-toggle').forEach((toggle) => {
    const menu = document.getElementById('mobileNavigation');
    if (!menu) return;

    const closeButton = menu.querySelector('.btn-close');

    function closeMenu() {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
    }

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


(() => {
    const catalog = document.querySelector('.catalog-layout');
    if (!catalog) return;
    const cards = [...catalog.querySelectorAll('.catalog-products-card')];
    const checkboxes = [...catalog.querySelectorAll('[data-filter]:is(input[type="checkbox"])')];
    const selects = [...catalog.querySelectorAll('select[data-filter]')];
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const rangeMin = document.getElementById('priceRangeMin');
    const rangeMax = document.getElementById('priceRangeMax');
    const count = document.getElementById('productsCount');
    const empty = document.getElementById('noProducts');
    const sort = document.getElementById('sortProducts');
    const categoryButtons = [...document.querySelectorAll('.catalog-buttons-item button')];
    let activeCategory = 'Все товары';

    function selectedValues(key) {
        return checkboxes.filter(input => input.dataset.filter === key && input.checked).map(input => input.value);
    }
    function applyFilters() {
        const min = Math.max(0, Number(minPrice?.value || 0));
        const max = Math.max(min, Number(maxPrice?.value || 10000));
        let visible = 0;
        cards.forEach(card => {
            const d = card.dataset;
            const groups = ['color','material','shape'];
            const matchesChecks = groups.every(key => {
                const values = selectedValues(key);
                return !values.length || values.includes(d[key]);
            });
            const matchesSelects = selects.every(select => !select.value || d[select.dataset.filter] === select.value);
            const matchesPrice = Number(d.priceValue || 0) >= min && Number(d.priceValue || 0) <= max;
            const matchesCategory = activeCategory === 'Все товары' || d.type === activeCategory;
            const show = matchesChecks && matchesSelects && matchesPrice && matchesCategory;
            card.hidden = !show;
            if (show) visible++;
        });
        if (count) count.textContent = visible;
        if (empty) empty.hidden = visible !== 0;
        sortCards();
    }
    function sortCards() {
        const list = document.querySelector('.catalog-products-cards-list');
        if (!list) return;
        const sorted = [...cards].sort((a,b) => {
            if (sort?.value === 'price-asc') return Number(a.dataset.priceValue)-Number(b.dataset.priceValue);
            if (sort?.value === 'price-desc') return Number(b.dataset.priceValue)-Number(a.dataset.priceValue);
            if (sort?.value === 'name') return (a.dataset.title||'').localeCompare(b.dataset.title||'', 'ru');
            return cards.indexOf(a)-cards.indexOf(b);
        });
        sorted.forEach(card => list.appendChild(card));
    }

    [minPrice, maxPrice].forEach(input => input?.addEventListener('input', () => {
        if (input === minPrice && rangeMin) {
            rangeMin.value = Math.min(
                Number(input.value) || 0,
                Number(rangeMax?.value || 10000)
            );
        }

        if (input === maxPrice && rangeMax) {
            rangeMax.value = Math.max(
                Number(input.value) || 0,
                Number(rangeMin?.value || 0)
            );
        }
    }));

    rangeMin?.addEventListener('input', () => {
        if (Number(rangeMin.value) > Number(rangeMax?.value || 10000)) {
            rangeMax.value = rangeMin.value;
        }

        if (minPrice) minPrice.value = rangeMin.value;
    });

    rangeMax?.addEventListener('input', () => {
        if (Number(rangeMax.value) < Number(rangeMin?.value || 0)) {
            rangeMin.value = rangeMax.value;
        }

        if (maxPrice) maxPrice.value = rangeMax.value;
    });

    sort?.addEventListener('change', sortCards);
    
    categoryButtons.forEach(button => button.addEventListener('click', () => {
        categoryButtons.forEach(item => item.classList.remove('button-toggle'));
        button.classList.add('button-toggle');
        activeCategory = button.textContent.trim();
        applyFilters();
    }));
    document.getElementById('resetFilters')?.addEventListener('click', () => {
        checkboxes.forEach(input => input.checked = false);
        selects.forEach(select => select.value = '');
        if (minPrice) minPrice.value = 1000;
        if (maxPrice) maxPrice.value = 10000;
        if (rangeMin) rangeMin.value = 1000;
        if (rangeMax) rangeMax.value = 10000;
        activeCategory = 'Все товары';
        categoryButtons.forEach((button,index) => button.classList.toggle('button-toggle', index===0));
        applyFilters();
    });

    const sidebar = document.getElementById('catalogSidebar');
    const openFiltersButton = document.getElementById('openFilters');

    const applyFiltersButton = document.getElementById('applyFilters');

    applyFiltersButton?.addEventListener('click', () => {
        applyFilters();

        sidebar?.classList.remove('is-open');
        openFiltersButton?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });

    function openFilters() {
        if (!sidebar) return;

        sidebar.classList.add('is-open');
        sidebar.setAttribute('aria-hidden', 'false');

        openFiltersButton?.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeFilters() {
        if (!sidebar) return;

        sidebar.classList.remove('is-open');
        sidebar.setAttribute('aria-hidden', 'true');

        openFiltersButton?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // Открытие фильтров
    openFiltersButton?.addEventListener('click', function(event) {
        event.preventDefault();
        openFilters();
    });

    // Закрытие по крестику
    document.addEventListener('click', function(event) {
        const closeButton = event.target.closest(
            '#closeFilters, .filter-close-button, [data-close-filters]'
        );

        if (closeButton) {
            event.preventDefault();
            event.stopPropagation();
            closeFilters();
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeFilters();
        }
    });

    // Закрытие при клике вне панели
    document.addEventListener('click', function(event) {
        if (
            sidebar?.classList.contains('is-open') &&
            !sidebar.contains(event.target) &&
            !event.target.closest('#openFilters')
        ) {
            closeFilters();
        }
    });
})();


document.querySelectorAll('.faq-item button').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const open = item.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(open));
}));
document.getElementById('contactsForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const feedback = document.getElementById('contactsFeedback');
    feedback.textContent = 'Спасибо! Ваше сообщение подготовлено.';
    event.currentTarget.reset();
});
