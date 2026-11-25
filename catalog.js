(() => {
  const products = window.catalogProducts;
  const grid = document.querySelector('#products');
  const template = document.querySelector('#product-template');
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#empty');
  const search = document.querySelector('#search');
  const filters = [...document.querySelectorAll('[data-category]')];
  let category = 'all';

  if (!Array.isArray(products)) {
    document.querySelector('#data-error').hidden = false;
    return;
  }

  const cards = products.map((product, index) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const image = card.querySelector('img');
    image.addEventListener('error', () => { image.hidden = true; }, { once: true });
    image.loading = index < 4 ? 'eager' : 'lazy';
    image.src = `./images/${product.number}.webp`;
    image.alt = `Foto ${product.name}`;
    card.querySelector('.product-number').textContent = `#${String(product.number).padStart(2, '0')}`;
    card.querySelector('.product-category').textContent = product.category;
    card.querySelector('h3').textContent = product.name;

    const link = card.querySelector('.product-link');
    link.href = product.url;
    link.setAttribute('aria-label', `Lihat ${product.name} di Shopee (tab baru)`);
    return { product, card };
  });

  function render() {
    const query = search.value.trim().toLocaleLowerCase('id-ID');
    const numberQuery = query.match(/^#?\s*(\d+)$/);
    let visible = 0;

    for (const { product, card } of cards) {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesSearch = numberQuery
        ? product.number === Number(numberQuery[1])
        : product.name.toLocaleLowerCase('id-ID').includes(query);
      card.hidden = !(matchesCategory && matchesSearch);
      if (!card.hidden) visible++;
    }

    count.textContent = `${visible} produk`;
    empty.hidden = visible > 0;
  }

  function selectCategory(value) {
    category = value;
    for (const button of filters) {
      button.setAttribute('aria-pressed', String(button.dataset.category === value));
    }
    render();
  }

  grid.append(...cards.map(({ card }) => card));
  search.disabled = false;
  search.addEventListener('input', render);
  for (const button of filters) {
    button.disabled = false;
    button.addEventListener('click', () => selectCategory(button.dataset.category));
  }
  document.querySelector('#reset').addEventListener('click', () => {
    search.value = '';
    selectCategory('all');
    search.focus();
  });
  render();
})();
