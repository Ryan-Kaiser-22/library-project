const bookForm = document.querySelector('.book-form');

const capitalize = (str) => {
    return str.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cardContainer = document.getElementById('card-container');

    const rawTitle = bookForm.querySelector('input[placeholder="Title"]').value;
    const rawAuthor = bookForm.querySelector('input[placeholder="Author"]').value;
    const pages = bookForm.querySelector('input[placeholder="Pages"]').value;
    const isRead = bookForm.querySelector('#read').checked;

    const cleanTitle = capitalize(rawTitle);
    const cleanAuthor = capitalize(rawAuthor);
    const newCard = document.createElement('div');
    newCard.classList.add('stat-card');
    newCard.innerHTML = `
        <h3>${cleanTitle}</h3>
        <p>By: ${cleanAuthor}</p>
        <p>${pages} Pages</p>
        <p>${isRead ? 'Read' : 'Need to read!'}</p>
        <span class="material-symbols-outlined">book</span>
    `;
    if (cardContainer) {
        cardContainer.appendChild(newCard);
    }
    bookForm.reset();
});

const searchBar = document.getElementById('book-search');

searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.stat-card');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const author = card.querySelector('p').textContent.toLowerCase();

        if (title.includes(searchTerm) || author.includes(searchTerm)) {
            card.style.display = "block";
            card.classList.add('search-focus');
            if (searchTerm === "") {
                card.classList.remove('search-focus');
            }
        } else {
            card.style.display = "none";
            card.classList.remove('search-focus');
        }
    });
});