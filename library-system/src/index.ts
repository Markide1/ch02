// Book model
interface Book {
    id: string;
    title: string;
    author: string;
    isBorrowed: boolean;
    borrowedByMemberId: string;
}

// Member model
interface Member {
    id: string;
    name: string;
    email: string;
}

class LibraryManager {
    private books: Book[] = [];
    private members: Member[] = [];
    private editingBookId: string | null = null;
    private editingMemberId: string | null = null;

    constructor() {
        this.initializeEventListeners();
        this.loadData();
        this.renderBooks();
        this.renderMembers();
        this.updateBorrowSelects();
    }

    // Utility function to generate unique IDs
    private generateId(): string {
        return Math.random().toString(36).substring(3, 8);
    }

    // Local storage functions
    private saveData(): void {
        localStorage.setItem('library_books', JSON.stringify(this.books));
        localStorage.setItem('library_members', JSON.stringify(this.members));
    }

    private loadData(): void {
        const savedBooks = localStorage.getItem('library_books');
        const savedMembers = localStorage.getItem('library_members');
        
        if (savedBooks) {
            this.books = JSON.parse(savedBooks);
        }
        
        if (savedMembers) {
            this.members = JSON.parse(savedMembers);
        }
    }

    // Initialize all event listeners
    private initializeEventListeners(): void {
        // Book form events
        const bookForm = document.getElementById('book-form') as HTMLFormElement;
        const clearBookButton = document.getElementById('clear-book-form') as HTMLButtonElement;
        
        bookForm.addEventListener('submit', (e) => this.handleBookSubmit(e));
        clearBookButton.addEventListener('click', () => this.clearBookForm());

        // Member form events
        const memberForm = document.getElementById('member-form') as HTMLFormElement;
        const clearMemberButton = document.getElementById('clear-member-form') as HTMLButtonElement;
        
        memberForm.addEventListener('submit', (e) => this.handleMemberSubmit(e));
        clearMemberButton.addEventListener('click', () => this.clearMemberForm());

        // Borrow/Return events
        const borrowButton = document.getElementById('borrow-button') as HTMLButtonElement;
        const returnButton = document.getElementById('return-button') as HTMLButtonElement;
        
        borrowButton.addEventListener('click', () => this.handleBorrowBook());
        returnButton.addEventListener('click', () => this.handleReturnBook());
    }

    // Book management functions
    private handleBookSubmit(e: Event): void {
        e.preventDefault();
        
        const titleInput = document.getElementById('book-title') as HTMLInputElement;
        const authorInput = document.getElementById('book-author') as HTMLInputElement;
        const bookIdInput = document.getElementById('book-id') as HTMLInputElement;
        
        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        
        if (!title || !author) {
            alert('Please fill in all required fields');
            return;
        }

        if (this.editingBookId) {
            // Update existing book
            const bookIndex = this.books.findIndex(book => book.id === this.editingBookId);
            if (bookIndex !== -1) {
                this.books[bookIndex].title = title;
                this.books[bookIndex].author = author;
            }
            this.editingBookId = null;
        } else {
            // Add new book
            const newBook: Book = {
                id: this.generateId(),
                title,
                author,
                isBorrowed: false,
                borrowedByMemberId: ''
            };
            this.books.push(newBook);
        }

        this.saveData();
        this.renderBooks();
        this.updateBorrowSelects();
        this.clearBookForm();
    }

    private clearBookForm(): void {
        const form = document.getElementById('book-form') as HTMLFormElement;
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        
        form.reset();
        this.editingBookId = null;
        submitButton.textContent = 'Save Book';
        
        (document.getElementById('book-id') as HTMLInputElement).value = '';
    }

    private editBook(id: string): void {
        const book = this.books.find(b => b.id === id);
        if (!book) return;

        const titleInput = document.getElementById('book-title') as HTMLInputElement;
        const authorInput = document.getElementById('book-author') as HTMLInputElement;
        const bookIdInput = document.getElementById('book-id') as HTMLInputElement;
        const submitButton = document.querySelector('#book-form button[type="submit"]') as HTMLButtonElement;

        titleInput.value = book.title;
        authorInput.value = book.author;
        bookIdInput.value = book.id;
        submitButton.textContent = 'Update Book';
        
        this.editingBookId = id;
    }

    private deleteBook(id: string): void {
        const book = this.books.find(b => b.id === id);
        
        if (!book) {
            alert('Book not found');
            return;
        }

        if (book.isBorrowed) {
            alert('Cannot delete a book that is currently borrowed. Please ensure it is returned first.');
            return;
        }

        if (confirm('Are you sure you want to delete this book?')) {
            this.books = this.books.filter(book => book.id !== id);
            this.saveData();
            this.renderBooks();
            this.updateBorrowSelects();
        }
    }

    private renderBooks(): void {
        const tbody = document.querySelector('#books-table tbody') as HTMLTableSectionElement;
        tbody.innerHTML = '';

        this.books.forEach(book => {
            const row = document.createElement('tr');
            const borrowedByMember = book.borrowedByMemberId ? 
                this.members.find(m => m.id === book.borrowedByMemberId)?.name || 'Unknown' : '';
            
            row.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isBorrowed ? 'Borrowed' : 'Available'}</td>
                <td>${borrowedByMember}</td>
                <td>
                    <button class="edit" onclick="libraryManager.editBook('${book.id}')">Edit</button>
                    <button class="delete" onclick="libraryManager.deleteBook('${book.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Member management functions
    private handleMemberSubmit(e: Event): void {
        e.preventDefault();
        
        const nameInput = document.getElementById('member-name') as HTMLInputElement;
        const emailInput = document.getElementById('member-email') as HTMLInputElement;
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        
        if (!name || !email) {
            alert('Please fill in all required fields');
            return;
        }

        // Check if email already exists (for new members)
        if (!this.editingMemberId && this.members.some(m => m.email === email)) {
            alert('A member with this email already exists');
            return;
        }

        if (this.editingMemberId) {
            // Update existing member
            const memberIndex = this.members.findIndex(member => member.id === this.editingMemberId);
            if (memberIndex !== -1) {
                // Check if email is being changed to an existing one
                const existingMember = this.members.find(m => m.email === email && m.id !== this.editingMemberId);
                if (existingMember) {
                    alert('A member with this email already exists');
                    return;
                }
                
                this.members[memberIndex].name = name;
                this.members[memberIndex].email = email;
            }
            this.editingMemberId = null;
        } else {
            // Add new member
            const newMember: Member = {
                id: this.generateId(),
                name,
                email
            };
            this.members.push(newMember);
        }

        this.saveData();
        this.renderMembers();
        this.updateBorrowSelects();
        this.clearMemberForm();
    }

    private clearMemberForm(): void {
        const form = document.getElementById('member-form') as HTMLFormElement;
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        
        form.reset();
        this.editingMemberId = null;
        submitButton.textContent = 'Save Member';
        
        (document.getElementById('member-id') as HTMLInputElement).value = '';
    }

    private editMember(id: string): void {
        const member = this.members.find(m => m.id === id);
        if (!member) return;

        const nameInput = document.getElementById('member-name') as HTMLInputElement;
        const emailInput = document.getElementById('member-email') as HTMLInputElement;
        const memberIdInput = document.getElementById('member-id') as HTMLInputElement;
        const submitButton = document.querySelector('#member-form button[type="submit"]') as HTMLButtonElement;

        nameInput.value = member.name;
        emailInput.value = member.email;
        memberIdInput.value = member.id;
        submitButton.textContent = 'Update Member';
        
        this.editingMemberId = id;
    }

    private deleteMember(id: string): void {
        // Check if member has borrowed books
        const hasBorrowedBooks = this.books.some(book => book.borrowedByMemberId === id);
        
        if (hasBorrowedBooks) {
            alert('Cannot delete member who has borrowed books. Please return all books first.');
            return;
        }

        if (confirm('Are you sure you want to delete this member?')) {
            this.members = this.members.filter(member => member.id !== id);
            this.saveData();
            this.renderMembers();
            this.updateBorrowSelects();
        }
    }

    private renderMembers(): void {
        const tbody = document.querySelector('#members-table tbody') as HTMLTableSectionElement;
        tbody.innerHTML = '';

        this.members.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>
                    <button class="edit" onclick="libraryManager.editMember('${member.id}')">Edit</button>
                    <button class="delete" onclick="libraryManager.deleteMember('${member.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Borrow/Return functions
    private handleBorrowBook(): void {
        const bookSelect = document.getElementById('borrow-book-select') as HTMLSelectElement;
        const memberSelect = document.getElementById('borrow-member-select') as HTMLSelectElement;
        
        const bookId = bookSelect.value;
        const memberId = memberSelect.value;
        
        if (!bookId || !memberId) {
            alert('Please select both a book and a member');
            return;
        }

        const book = this.books.find(b => b.id === bookId);
        const member = this.members.find(m => m.id === memberId);
        
        if (!book || !member) {
            alert('Invalid book or member selection');
            return;
        }

        if (book.isBorrowed) {
            alert('This book is already borrowed');
            return;
        }

        // Update book status
        book.isBorrowed = true;
        book.borrowedByMemberId = memberId;

        this.saveData();
        this.renderBooks();
        this.updateBorrowSelects();
        
        // Reset selections
        bookSelect.value = '';
        memberSelect.value = '';
        
        alert(`Book "${book.title}" has been borrowed by ${member.name}`);
    }

    private handleReturnBook(): void {
        const returnBookSelect = document.getElementById('return-book-select') as HTMLSelectElement;
        const bookId = returnBookSelect.value;
        
        if (!bookId) {
            alert('Please select a book to return');
            return;
        }

        const book = this.books.find(b => b.id === bookId);
        
        if (!book) {
            alert('Invalid book selection');
            return;
        }

        if (!book.isBorrowed) {
            alert('This book is not currently borrowed');
            return;
        }

        const memberName = this.members.find(m => m.id === book.borrowedByMemberId)?.name || 'Unknown';

        // Update book status
        book.isBorrowed = false;
        book.borrowedByMemberId = '';

        this.saveData();
        this.renderBooks();
        this.updateBorrowSelects();
        
        // Reset selection
        returnBookSelect.value = '';
        
        alert(`Book "${book.title}" has been returned by ${memberName}`);
    }

    private updateBorrowSelects(): void {
        
        // Update available books for borrowing
        const borrowBookSelect = document.getElementById('borrow-book-select') as HTMLSelectElement;
        borrowBookSelect.innerHTML = '<option value="">Select a book...</option>';
        
        const availableBooks = this.books.filter(book => !book.isBorrowed);
        availableBooks.forEach(book => {
            const option = document.createElement('option');
            option.value = book.id;
            option.textContent = `${book.title} by ${book.author}`;
            borrowBookSelect.appendChild(option);
        });

        // Update members for borrowing
        const borrowMemberSelect = document.getElementById('borrow-member-select') as HTMLSelectElement;
        borrowMemberSelect.innerHTML = '<option value="">Select a member...</option>';
        
        this.members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = `${member.name} (${member.email})`;
            borrowMemberSelect.appendChild(option);
        });

        // Update borrowed books for returning
        const returnBookSelect = document.getElementById('return-book-select') as HTMLSelectElement;
        returnBookSelect.innerHTML = '<option value="">Select a book to return...</option>';
        
        const borrowedBooks = this.books.filter(book => book.isBorrowed);
        borrowedBooks.forEach(book => {
            const member = this.members.find(m => m.id === book.borrowedByMemberId);
            const option = document.createElement('option');
            option.value = book.id;
            option.textContent = `${book.title} (borrowed by ${member?.name || 'Unknown'})`;
            returnBookSelect.appendChild(option);
        });
    }

}

// Initialize the library manager when the DOM is loaded
let libraryManager: LibraryManager;

document.addEventListener('DOMContentLoaded', () => {
    libraryManager = new LibraryManager();
});
