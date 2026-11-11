
const products = [
    {
        title: 'Аура',
        price: '3 000 руб.',
        priceValue: 3000,
        image: './images/products_on_main_page/1.png',
        alt: 'Оранжевая лампа',
        category: 'Настольная лампа',
        description: 'Авторский светильник для создания уютной атмосферы.',
        modalMain: './images/products_on_main_page/1.png',
        modalBottom: './images/modal/5.png',
        color: 'Оранжевый',
        material: 'Стекло',
        shape: 'Купол',
        size: 'Компактный',
        room: 'Спальня',
        light: 'Рассеянный',
        type: 'Настольные лампы'
    },
    {
        title: 'Роза',
        price: '3 500 руб.',
        priceValue: 3500,
        image: './images/products_on_main_page/2.png',
        alt: 'Розовая лампа',
        category: 'Настольная лампа',
        description: 'Авторский светильник для создания уютной атмосферы в современном интерьере.',
        modalMain: './images/products_on_main_page/2.png',
        modalBottom: './images/modal/2.png',
        color: 'Розовый',
        material: 'Керамика',
        shape: 'Геометрическая',
        size: 'Средний',
        room: 'Спальня',
        light: 'Рассеянный',
        type: 'Настольные лампы'
    },
    {
        title: 'Пламя',
        price: '3 700 руб.',
        priceValue: 3700,
        image: './images/products_on_main_page/3.png',
        alt: 'Огненная лампа',
        category: 'Декоративная лампа',
        description: 'Авторский светильник для создания уютной атмосферы в современном интерьере.',
        modalMain: './images/products_on_main_page/3.png',
        modalBottom: './images/modal/3.png',
        color: 'Оранжевый',
        material: 'Металл',
        shape: 'Многослойная',
        size: 'Средний',
        room: 'Гостиная',
        light: 'Декоративный',
        type: 'Декор'
    },
    {
        title: 'Океания',
        price: '4 000 руб.',
        priceValue: 4000,
        image: './images/products_on_main_page/4.png',
        alt: 'Лампа в виде океанского цветка',
        category: 'Настольная лампа',
        description: 'Авторский светильник для создания уютной атмосферы в современном интерьере.',
        modalMain: './images/products_on_main_page/4.png',
        modalBottom: './images/modal/4.png',
        color: 'Розовый',
        material: 'Керамика',
        shape: 'Геометрическая',
        size: 'Большой',
        room: 'Гостиная',
        light: 'Декоративный',
        type: 'Декор'
    },
    {
        title: 'Дюна',
        price: '3 000 руб.',
        priceValue: 3000,
        image: './images/catalog/1.png',
        alt: 'Оранжевая стеклянная лампа',
        category: 'Настольная лампа',
        description: 'Авторский светильник для создания уютной атмосферы в современном интерьере.',
        modalMain: './images/catalog/1.png',
        modalBottom: './images/modal/1.png',
        color: 'Оранжевый',
        material: 'Стекло',
        shape: 'Купол',
        size: 'Средний',
        room: 'Кухня',
        light: 'Направленный',
        type: 'Подвесные лампы'
    }
];

const productsContainer = document.querySelector(
    '.catalog-products-cards-list'
);

function createProductCard(product) {
    const card = document.createElement('li');
    card.classList.add('catalog-products-card', 'card');

    card.dataset.title = product.title;
    card.dataset.price = product.price;
    card.dataset.priceValue = product.priceValue;
    card.dataset.category = product.category;
    card.dataset.description = product.description;
    card.dataset.modalMain = product.modalMain;
    card.dataset.modalBottom = product.modalBottom;
    card.dataset.color = product.color;
    card.dataset.material = product.material;
    card.dataset.shape = product.shape;
    card.dataset.size = product.size;
    card.dataset.room = product.room;
    card.dataset.light = product.light;
    card.dataset.type = product.type;

    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.alt;
    image.classList.add(
        'catalog-products-card-image',
        'card-image'
    );

    const heartButton = document.createElement('button');
    heartButton.type = 'button';
    heartButton.classList.add('to-heart-button');
    heartButton.setAttribute('aria-label', 'Добавить в избранное');

    const body = document.createElement('div');
    body.classList.add('catalog-products-card-body', 'card-body');

    const title = document.createElement('p');
    title.classList.add('catalog-products-card-title', 'card-title');
    title.textContent = product.title;

    const price = document.createElement('p');
    price.classList.add(
        'catalog-products-card-price',
        'small-acsent-title',
        'card-price'
    );
    price.textContent = product.price;

    body.append(title, price);
    card.append(image, heartButton, body);

    return card;
}

function renderProducts(container, productsToRender) {
    if (!container) return;

    container.replaceChildren();

    productsToRender.forEach(product => {
        const card = createProductCard(product);
        container.append(card);
    });
}

// Каталог — все товары
const catalogContainer = document.querySelector(
    '.catalog-products-cards-list'
);

if (catalogContainer) {
    renderProducts(catalogContainer, products);
}

// Главная — первые четыре товара
const mainContainer = document.querySelector(
    '.new-products .catalog-products-cards-list'
);

if (mainContainer) {
    renderProducts(mainContainer, products.slice(0, 4));
}

renderProducts();
