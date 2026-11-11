// Категории, фильтры и сортировка товаров

(() => {
    const catalog = document.querySelector('.catalog-layout');
    if (!catalog) return;

    const cards = [...catalog.querySelectorAll('.catalog-products-card')];

    const checkboxes = [
        ...catalog.querySelectorAll('[data-filter]:is(input[type="checkbox"])')
    ];

    const selects = [
        ...catalog.querySelectorAll('select[data-filter]')
    ];

    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');

    const rangeMin = document.getElementById('priceRangeMin');
    const rangeMax = document.getElementById('priceRangeMax');

    const count = document.getElementById('productsCount');
    const empty = document.getElementById('noProducts');
    const sort = document.getElementById('sortProducts');
    const searchInput = document.getElementById('searchProducts');

    const categoryButtons = [
        ...document.querySelectorAll('.catalog-buttons-item button')
    ];

    let activeCategory = 'Все товары';

    // Раскрытие групп фильтров
    const filterItems = catalog.querySelectorAll('.catalog-filters-item');

    filterItems.forEach(item => {
        const trigger = item.querySelector('.catalog-filter-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            filterItems.forEach(filter => {
                filter.classList.remove('is-open');

                filter.querySelector('.catalog-filter-trigger')
                    ?.setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Закрытие раскрытых фильтров при клике вне списка
    document.addEventListener('click', event => {
        if (!event.target.closest('.catalog-filters-list')) {
            filterItems.forEach(item => {
                item.classList.remove('is-open');

                item.querySelector('.catalog-filter-trigger')
                    ?.setAttribute('aria-expanded', 'false');
            });
        }
    });

    function selectedValues(key) {
        return checkboxes
            .filter(input =>
                input.dataset.filter === key && input.checked
            )
            .map(input => input.value);
    }

    // Сортировка товаров
    function sortCards() {
        const list = catalog.querySelector('.catalog-products-cards-list');
        if (!list) return;

        const sorted = [...cards].sort((a, b) => {
            if (sort?.value === 'price-asc') {
                return Number(a.dataset.priceValue) -
                    Number(b.dataset.priceValue);
            }

            if (sort?.value === 'price-desc') {
                return Number(b.dataset.priceValue) -
                    Number(a.dataset.priceValue);
            }

            if (sort?.value === 'name') {
                return (a.dataset.title || '').localeCompare(
                    b.dataset.title || '',
                    'ru'
                );
            }

            return cards.indexOf(a) - cards.indexOf(b);
        });

        sorted.forEach(card => list.appendChild(card));
    }

    // Применение фильтров
    function applyFilters() {
        const min = Math.max(0, Number(minPrice?.value || 0));
        const max = Math.max(min, Number(maxPrice?.value || 10000));

        const searchValue = searchInput?.value
            .trim()
            .toLowerCase() || '';

        let visible = 0;

        cards.forEach(card => {
            const data = card.dataset;

            const productName = (data.title || '').toLowerCase();

            const matchesSearch = productName.includes(searchValue);

            const groups = ['color', 'material'];

            const matchesChecks = groups.every(key => {
                const values = selectedValues(key);
                return !values.length || values.includes(data[key]);
            });

            const matchesSelects = selects.every(select =>
                !select.value ||
                data[select.dataset.filter] === select.value
            );

            const matchesPrice =
                Number(data.priceValue || 0) >= min &&
                Number(data.priceValue || 0) <= max;

            const matchesCategory =
                activeCategory === 'Все товары' ||
                data.type === activeCategory;

            const show =
                matchesChecks &&
                matchesSelects &&
                matchesPrice &&
                matchesCategory &&
                matchesSearch;

            card.hidden = !show;

            if (show) visible++;
        });

        if (count) count.textContent = visible;
        if (empty) empty.hidden = visible !== 0;

        sortCards();
    }

    // Синхронизация полей цены и ползунков
    [minPrice, maxPrice].forEach(input => {
        input?.addEventListener('input', () => {
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
        });
    });

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

    // Сортировка
    sort?.addEventListener('change', sortCards);

    // Поиск товаров по названию
    searchInput?.addEventListener('input', applyFilters);

    // Выбор категории
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(item => {
                item.classList.remove('button-toggle');
            });

            button.classList.add('button-toggle');
            activeCategory = button.textContent.trim();

            applyFilters();
        });
    });

    // Сброс фильтров
    document.getElementById('resetFilters')?.addEventListener('click', () => {
        checkboxes.forEach(input => input.checked = false);
        selects.forEach(select => select.value = '');

        if (minPrice) minPrice.value = 1000;
        if (maxPrice) maxPrice.value = 10000;

        if (rangeMin) rangeMin.value = 1000;
        if (rangeMax) rangeMax.value = 10000;

        activeCategory = 'Все товары';

        categoryButtons.forEach((button, index) => {
            button.classList.toggle('button-toggle', index === 0);
        });

        applyFilters();
    });

    // Мобильная панель фильтров
    const sidebar = document.getElementById('catalogSidebar');
    const openFiltersButton = document.getElementById('openFilters');
    const applyFiltersButton = document.getElementById('applyFilters');

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

    // Кнопка «Применить»
    applyFiltersButton?.addEventListener('click', () => {
        applyFilters();
        closeFilters();
    });

    // Открытие фильтров
    openFiltersButton?.addEventListener('click', event => {
        event.preventDefault();
        openFilters();
    });

    // Закрытие по крестику
    document.addEventListener('click', event => {
        const closeButton = event.target.closest(
            '#closeFilters, .filter-close-button, [data-close-filters]'
        );

        if (closeButton) {
            event.preventDefault();
            event.stopPropagation();
            closeFilters();
        }
    });

    // Закрытие клавишей Escape
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeFilters();
        }
    });

    // Закрытие при клике вне панели
    document.addEventListener('click', event => {
        if (
            sidebar?.classList.contains('is-open') &&
            !sidebar.contains(event.target) &&
            !event.target.closest('#openFilters')
        ) {
            closeFilters();
        }
    });
})();