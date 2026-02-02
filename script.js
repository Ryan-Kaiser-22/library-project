//Create empty library and get elements from HTML
let myLibrary = [];
const bookForm = document.querySelector('.book-form');
const cardContainer = document.getElementById('card-container');
const searchBar = document.getElementById('book-search');

//The Book constructor
function Book(title, author, pages, isRead) {
    this.id = crypto.randomUUID(); 
    this.title = capitalize(title);
    this.author = capitalize(author);
    this.pages = pages;
    this.isRead = isRead;
}

//Using prototype for toggle function
Book.prototype.toggleRead = function() {
    this.isRead = !this.isRead;
};

//Function for adding books to the library array
function addBookToLibrary(title, author, pages, isRead) {
    const newBook = new Book(title, author, pages, isRead);
    myLibrary.push(newBook);
    saveLocalStorage();
    renderBooks();
}

//Force input to capitalize book and author names
const capitalize = (str) => {
    return str.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

// Using Stringify for localStorage
const saveLocalStorage = () => {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
};

//Render book cards 
const renderBooks = (dataToRender = myLibrary) => {
    cardContainer.innerHTML = "";

    dataToRender.forEach((book) => {
        const newCard = document.createElement('div');
        newCard.classList.add('stat-card');
        
        newCard.innerHTML = `
            <h3>${book.title}</h3>
            <p>By: ${book.author}</p>
            <p>${book.pages} Pages</p>
            <p><strong>${book.isRead ? 'Have read' : 'Unread'}</strong></p>
            <div class="card-buttons">
                <button class="toggle-btn" onclick="handleToggle('${book.id}')">
                    ${book.isRead ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button class="delete-btn" onclick="handleDelete('${book.id}')" title="Delete Book">
                    <span class="material-symbols-outlined">close_small</span>
                </button>
            </div>
        `;
        cardContainer.appendChild(newCard);
    });
};

//Toggle read/not read using book's id
const handleToggle = (id) => {
    const book = myLibrary.find(b => b.id === id);
    if (book) {
        book.isRead = !book.isRead;
        saveLocalStorage();
        renderBooks();
    }
};

//Delete book from library and render change
const handleDelete = (id) => {
    const book = myLibrary.find(b => b.id === id);
    if (confirm(`Delete "${book.title}"?`)) {
        myLibrary = myLibrary.filter(b => b.id !== id);
        saveLocalStorage();
        renderBooks();
    }
};

//Event listeners
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = bookForm.querySelector('input[placeholder="Title"]').value;
    const author = bookForm.querySelector('input[placeholder="Author"]').value;
    const pages = bookForm.querySelector('input[placeholder="Pages"]').value;
    const isRead = bookForm.querySelector('#read').checked;

    addBookToLibrary(title, author, pages, isRead);
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

//Init localStorage for library
const init = () => {
    const savedData = localStorage.getItem('myLibrary');
    if (savedData) {
        myLibrary = JSON.parse(savedData);
        renderBooks();
    }
};

init();