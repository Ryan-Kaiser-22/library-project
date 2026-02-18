
class Book {
    constructor(title, author, pages, isRead, id = crypto.randomUUID()) {
        this.id = id;
        this.title = this.capitalize(title);
        this.author = this.capitalize(author);
        this.pages = pages;
        this.isRead = isRead;
    }

    toggleRead() {
        this.isRead = !this.isRead;
    }

    capitalize(str) {
        return str.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
}

class Library {
    constructor() {
        this.books = this.load();
    }

    addBook(title, author, pages, isRead) {
        const newBook = new Book(title, author, pages, isRead);
        this.books.push(newBook);
        this.save();
        return newBook;
    }

    deleteBook(id) {
        this.books = this.books.filter(book => book.id !== id);
        this.save();
    }

    toggleBookStatus(id) {
        const book = this.books.find(b => b.id === id);
        if (book) {
            book.toggleRead();
            this.save();
        }
    }

    save() {
        localStorage.setItem('myLibrary', JSON.stringify(this.books));
    }

    load() {
        const savedData = JSON.parse(localStorage.getItem('myLibrary')) || [];
        return savedData.map(b => new Book(b.title, b.author, b.pages, b.isRead, b.id));
    }
}

class UI {
    constructor(library) {
        this.library = library;
        this.cardContainer = document.getElementById('card-container');
        this.bookForm = document.querySelector('.book-form');
        this.searchBar = document.getElementById('book-search');
        
        this.initEventListeners();
        this.render();
    }

    render(data = this.library.books) {
        this.cardContainer.innerHTML = "";
        data.forEach(book => {
            const card = document.createElement('div');
            card.classList.add('stat-card');
            card.innerHTML = `
                <h3>${book.title}</h3>
                <p>By: ${book.author}</p>
                <p>${book.pages} Pages</p>
                <p><strong>${book.isRead ? 'Have read' : 'Unread'}</strong></p>
                <div class="card-buttons">
                    <button class="toggle-btn" data-id="${book.id}">
                        ${book.isRead ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <button class="delete-btn" data-id="${book.id}">
                        <span class="material-symbols-outlined">close_small</span>
                    </button>
                </div>
            `;
            this.cardContainer.appendChild(card);
        });
    }

    initEventListeners() {
        this.bookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = this.bookForm.querySelectorAll('input');
            this.library.addBook(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].checked);
            this.bookForm.reset();
            this.render();
        });

        this.searchBar.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = this.library.books.filter(b => 
                b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)
            );
            this.render(filtered);
        });

        this.cardContainer.addEventListener('click', (e) => {
            const id = e.target.closest('button')?.dataset.id;
            if (!id) return;

            if (e.target.closest('.delete-btn')) {
                if (confirm("Delete this book?")) {
                    this.library.deleteBook(id);
                    this.render();
                }
            } else if (e.target.closest('.toggle-btn')) {
                this.library.toggleBookStatus(id);
                this.render();
            }
        });
    }
}

const myApp = new UI(new Library());