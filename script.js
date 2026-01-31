
let myLibrary = [];
const bookForm = document.querySelector('.book-form');
const cardContainer = document.getElementById('card-container');
const searchBar = document.getElementById('book-search');

const capitalize = (str) => {
    return str.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

const saveLocalStorage = () => {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
};

const renderBooks = (dataToRender = myLibrary) => {
    cardContainer.innerHTML = "";

    dataToRender.forEach((book, index) => {
        const newCard = document.createElement('div');
        newCard.classList.add('stat-card');
        
        newCard.innerHTML = `
            <h3>${book.title}</h3>
            <p>By: ${book.author}</p>
            <p>${book.pages} Pages</p>
            <p><strong>${book.isRead ? 'Read' : 'Need to read!'}</strong></p>
            <button class="delete-btn" onclick="removeBook(${index})" title="Delete Book">
                <span class="material-symbols-outlined">close_small</span>
            </button>
        `;
        cardContainer.appendChild(newCard);
    });
};

const removeBook = (index) => {
    const bookTitle = myLibrary[index].title;
    const confirmed = confirm(`Are you sure you want to delete "${bookTitle}"?`);
    if (confirmed) {
        myLibrary.splice(index, 1); 
        saveLocalStorage();         
        renderBooks();           
    } 
};

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = capitalize(bookForm.querySelector('input[placeholder="Title"]').value);
    const author = capitalize(bookForm.querySelector('input[placeholder="Author"]').value);
    const pages = bookForm.querySelector('input[placeholder="Pages"]').value;
    const isRead = bookForm.querySelector('#read').checked;

    const newBook = { title, author, pages, isRead };

    myLibrary.push(newBook);
    saveLocalStorage();
    renderBooks();
    bookForm.reset();
});

searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    const filteredBooks = myLibrary.filter(book => 
        book.title.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm)
    );

    renderBooks(filteredBooks);
});

const init = () => {
    const savedData = localStorage.getItem('myLibrary');
    if (savedData) {
        myLibrary = JSON.parse(savedData);
        renderBooks();
    }
};

init();