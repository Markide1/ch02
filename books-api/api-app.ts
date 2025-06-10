/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */

// Types
interface Book {
  id: number;
  title: string;
  author: string;
  publication_year: number;
  isbn: string;
  created_at: string;
  updated_at: string;
}

interface CreateBookDto {
  title: string;
  author: string;
  publication_year: number;
  isbn: string;
}

interface UpdateBookDto {
  title?: string;
  author?: string;
  publication_year?: number;
  isbn?: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  count?: number;
}

// Manager class for all CRUD operations

class BooksManager {
  private readonly baseUrl = "http://localhost:3000";
  private readonly booksUrl = `${this.baseUrl}/books`;
  private isEditing = false;
  private editingBookId: number | null = null;

  // DOM Elements
  private bookForm: HTMLFormElement;
  private booksList: HTMLElement;
  private booksCount: HTMLElement;
  private loadingSpinner: HTMLElement;
  private messageContainer: HTMLElement;
  private searchTitle: HTMLInputElement;
  private yearFilter: HTMLInputElement;
  private yearCountResult: HTMLElement;
  private cancelEditBtn: HTMLButtonElement;

  // Add new property with other DOM elements
  private bookIdInput: HTMLInputElement;

  // Initialization objects
  constructor() {
    this.initializeElements();
    this.attachEventListeners();
    this.clearAllFields();
    this.showEmptyState();
  }

  private initializeElements(): void {
    this.bookForm = document.getElementById("bookForm") as HTMLFormElement;
    this.booksList = document.getElementById("booksList") as HTMLElement;
    this.booksCount = document.getElementById("booksCount") as HTMLElement;
    this.loadingSpinner = document.getElementById(
      "loadingSpinner",
    ) as HTMLElement;
    this.messageContainer = document.getElementById(
      "messageContainer",
    ) as HTMLElement;
    this.searchTitle = document.getElementById(
      "searchTitle",
    ) as HTMLInputElement;
    this.yearFilter = document.getElementById("yearFilter") as HTMLInputElement;
    this.yearCountResult = document.getElementById(
      "yearCountResult",
    ) as HTMLElement;
    this.cancelEditBtn = document.getElementById(
      "cancelEdit",
    ) as HTMLButtonElement;

    // ...existing code...
    this.bookIdInput = document.getElementById("bookId") as HTMLInputElement;
  }

  private attachEventListeners(): void {
    // Form submission
    this.bookForm.addEventListener("submit", (e) => this.handleFormSubmit(e));

    // Search functionality
    document
      .getElementById("searchBtn")
      ?.addEventListener("click", () => this.searchBooks());
    this.searchTitle.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.searchBooks();
    });

    // Show all books functionality
    document
      .getElementById("showAllBtn")
      ?.addEventListener("click", () => this.showAllBooks());

    // Year count functionality
    document
      .getElementById("countByYearBtn")
      ?.addEventListener("click", () => this.countBooksByYear());
    this.yearFilter.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.countBooksByYear();
    });

    // Cancel edit
    this.cancelEditBtn.addEventListener("click", () => this.cancelEdit());

    // Find by ID functionality
    document
      .getElementById("findByIdBtn")
      ?.addEventListener("click", () => this.findBookById());
    this.bookIdInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.findBookById();
    });
  }

  // Form validation and submission
  private validateForm(bookData: CreateBookDto): string | null {
    // Title validation
    if (!bookData.title?.trim()) {
      return "Title is required";
    }
    if (bookData.title.trim().length > 255) {
      return "Title must be 255 characters or less";
    }

    // Author validation
    if (!bookData.author?.trim()) {
      return "Author is required";
    }
    if (bookData.author.trim().length > 255) {
      return "Author must be 255 characters or less";
    }

    // ISBN validation
    if (!bookData.isbn?.trim()) {
      return "ISBN is required";
    }
    if (bookData.isbn.length !== 10 && bookData.isbn.length !== 13) {
      return "ISBN must be 10 or 13 characters long";
    }

    // Publication year validation
    if (!bookData.publication_year || isNaN(bookData.publication_year)) {
      return "Publication year is required and must be a number";
    }
    if (
      bookData.publication_year < 1400 ||
      bookData.publication_year > new Date().getFullYear()
    ) {
      return "Please enter a valid publication year between 1400 and current year";
    }

    return null;
  }

  // Handle form submission
  private async handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const formData = new FormData(this.bookForm);
    const bookData: CreateBookDto = {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      publication_year: parseInt(formData.get("publication_year") as string),
      isbn: formData.get("isbn") as string,
    };

    // Validate form data
    const validationError = this.validateForm(bookData);
    if (validationError) {
      this.showMessage(validationError, "error");
      return;
    }

    if (this.isEditing && this.editingBookId) {
      await this.updateBook(this.editingBookId, bookData);
    } else {
      await this.createBook(bookData);
    }
  }

  // Create book

  private async createBook(bookData: CreateBookDto): Promise<void> {
    try {
      this.showLoading(true);

      const response = await fetch(this.booksUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const result: ApiResponse<Book> = await response.json();

      if (response.ok) {
        this.showMessage("Book created successfully!", "success", 3000);
        this.clearAllFields();
        this.showAllBooks();
      } else {
        throw new Error(result.message || "Failed to create book");
      }
    } catch (error) {
      this.showMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error",
      );
    } finally {
      this.showLoading(false);
    }
  }

  //  Edit book

  private async updateBook(id: number, bookData: UpdateBookDto): Promise<void> {
    try {
      this.showLoading(true);

      const response = await fetch(`${this.booksUrl}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const result: ApiResponse<Book> = await response.json();

      if (response.ok) {
        this.showMessage("Book updated successfully!", "success", 3000);
        this.cancelEdit();
        this.clearAllFields();
        this.showAllBooks();
      } else {
        throw new Error(result.message || "Failed to update book");
      }
    } catch (error) {
      this.showMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error",
      );
    } finally {
      this.showLoading(false);
    }
  }

  private async loadBooks(): Promise<void> {
    try {
      this.showLoading(true);

      const response = await fetch(this.booksUrl);
      const result: ApiResponse<Book[]> = await response.json();

      if (response.ok) {
        this.displayBooks(result.data);
        this.updateBooksCount(result.count || result.data.length);
      } else {
        throw new Error(result.message || "Failed to load books");
      }
    } catch (error) {
      this.showMessage(
        `Error loading books: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error",
      );
      this.displayBooks([]);
    } finally {
      this.showLoading(false);
    }
  }

  // Show all books

  private async showAllBooks(): Promise<void> {
    this.clearAllFields();
    await this.loadBooks();
    this.showMessage("Showing all books", "info", 2000);
  }

  // Search books by title
  private async searchBooks(): Promise<void> {
    const title = this.searchTitle.value.trim();
    if (!title) {
      this.showMessage("Please enter a title to search", "error");
      return;
    }

    try {
      this.showLoading(true);
      this.clearYearCount();
      this.clearFormFields();

      const response = await fetch(
        `${this.booksUrl}?title=${encodeURIComponent(title)}`,
      );
      const result: ApiResponse<Book[]> = await response.json();

      if (response.ok) {
        this.displayBooks(result.data);
        this.updateBooksCount(result.count || result.data.length);
        this.showMessage(
          `Found ${result.data.length} book(s) matching "${title}"`,
          "info",
          3000,
        );
      } else {
        throw new Error(result.message || "Search failed");
      }
    } catch (error) {
      this.showMessage(
        `Search error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error",
      );
    } finally {
      this.showLoading(false);
    }
  }

  // Search books by year
  private async countBooksByYear(): Promise<void> {
    const year = parseInt(this.yearFilter.value);
    if (!year || year < 1000 || year > new Date().getFullYear()) {
      this.showMessage("Please enter a valid year", "error");
      return;
    }

    try {
      this.showLoading(true);
      this.clearSearchTitle();
      this.clearFormFields();

      // Get count and books in a single request
      const response = await fetch(`${this.booksUrl}/count-by-year/${year}`);
      const result: ApiResponse<{ year: number; count: number }> =
        await response.json();

      if (response.ok) {
        this.yearCountResult.innerHTML = `
          <div class="result-message info">
            Found <strong>${result.data.count}</strong> book(s) published in <strong>${year}</strong>
          </div>
        `;

        // Update books display and count
        if (result.data.count === 0) {
          this.displayBooks([]);
          this.updateBooksCount(0);
          this.showMessage(`No books found for year ${year}`, "info", 3000);
        } else {
          // Load all books and filter by year client-side
          const booksResponse = await fetch(this.booksUrl);
          const booksResult: ApiResponse<Book[]> = await booksResponse.json();

          if (booksResponse.ok) {
            const filteredBooks = booksResult.data.filter(
              (book) => book.publication_year === year,
            );
            this.displayBooks(filteredBooks);
            this.updateBooksCount(filteredBooks.length);
            this.showMessage(
              `Showing ${filteredBooks.length} book(s) published in ${year}`,
              "info",
              3000,
            );
          } else {
            throw new Error(booksResult.message || "Failed to load books");
          }
        }
      } else {
        throw new Error(result.message || "Count failed");
      }
    } catch (error) {
      this.showMessage(
        `Count error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error",
      );
      this.displayBooks([]);
      this.updateBooksCount(0);
    } finally {
      this.showLoading(false);
    }
  }

  // Helper methods for clearing specific fields
  private clearSearchTitle(): void {
    this.searchTitle.value = "";
  }

  private clearYearCount(): void {
    this.yearFilter.value = "";
    this.yearCountResult.innerHTML = "";
  }

  private clearSearchAndFilterFields(): void {
    this.searchTitle.value = "";
    this.yearFilter.value = "";
    this.yearCountResult.innerHTML = "";
  }

  private clearFormFields(): void {
    this.bookForm.reset();
    // Ensure edit mode is properly reset
    if (this.isEditing) {
      this.cancelEdit();
    }
  }

  // Main method to clear ALL fields (form + search/filter)
  private clearAllFields(): void {
    this.clearFormFields();
    this.clearSearchAndFilterFields();
  }

  private showEmptyState(): void {
    this.booksList.innerHTML = `
      <div class="empty-state">
        <h3>📚 Books Library</h3>
        <p>Search for books or show all books to get started!</p>
      </div>
    `;
  }

  private displayBooks(books: Book[]): void {
    if (books.length === 0) {
      this.booksList.innerHTML = `
        <div class="empty-state">
          <h3>📚 No books found</h3>
          <p>Try a different search term or add some books!</p>
        </div>
      `;
      return;
    }

    this.booksList.innerHTML = books
      .map(
        (book) => `
          <div class="book-card">
            <h3>${this.escapeHtml(book.title)}</h3>
            <p><strong>Author:</strong> ${this.escapeHtml(book.author)}</p>
            <p><strong>Year:</strong> ${book.publication_year}</p>
            <p><strong>ISBN:</strong> ${this.escapeHtml(book.isbn)}</p>
            <div class="book-meta">
              <small>ID: ${book.id} | Added: ${new Date(book.created_at).toLocaleDateString()}</small>
            </div>
            <div class="book-actions">
              <button class="btn btn-warning" onclick="booksManager.editBook(${book.id})">
                 Edit
              </button>
              <button class="btn btn-danger" onclick="booksManager.deleteBook(${book.id})">
                Delete
              </button>
              <button class="btn btn-success" onclick="booksManager.viewBook(${book.id})">
                 View
              </button>
            </div>
          </div>
        `,
      )
      .join("");
  }

  // Update the total books count display
  private updateBooksCount(count: number): void {
    this.booksCount.textContent = `Total Books: ${count}`;
  }

  // Edit, delete, and view book methods
  public async editBook(id: number): Promise<void> {
    try {
      this.showLoading(true);

      const response = await fetch(`${this.booksUrl}/${id}`);
      const result: ApiResponse<Book> = await response.json();

      if (response.ok) {
        const book = result.data;

        // Clear search/filter fields when editing
        this.clearSearchAndFilterFields();

        // Populate form with book data
        (document.getElementById("title") as HTMLInputElement).value =
          book.title;
        (document.getElementById("author") as HTMLInputElement).value =
          book.author;
        (
          document.getElementById("publication_year") as HTMLInputElement
        ).value = book.publication_year.toString();
        (document.getElementById("isbn") as HTMLInputElement).value = book.isbn;

        // Switch to edit mode
        this.isEditing = true;
        this.editingBookId = id;
        this.cancelEditBtn.style.display = "inline-block";

        // Change submit button text
        const submitBtn = this.bookForm.querySelector(
          'button[type="submit"]',
        ) as HTMLButtonElement;
        submitBtn.textContent = "Update Book";
        submitBtn.className = "btn btn-warning";

        // Scroll to form
        document
          .querySelector(".form-section")
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        throw new Error(result.message || "Failed to load book for editing");
      }
    } catch (error) {
      this.showMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error",
      );
    } finally {
      this.showLoading(false);
    }
  }

  // Delete book
  public async deleteBook(id: number): Promise<void> {
    if (
      !confirm(
        "Are you sure you want to delete this book? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      this.showLoading(true);

      const response = await fetch(`${this.booksUrl}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        this.showMessage("Book deleted successfully!", "success", 3000);
        this.showAllBooks();
      } else {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete book");
      }
    } catch (error) {
      this.showMessage(
        `Delete error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error",
      );
    } finally {
      this.showLoading(false);
    }
  }

  // View book details
  public async viewBook(id: number): Promise<void> {
    try {
      this.showLoading(true);

      const response = await fetch(`${this.booksUrl}/${id}`);
      const result: ApiResponse<Book> = await response.json();

      if (response.ok) {
        const book = result.data;
        alert(`📚 Book Details:
                
Title: ${book.title}
Author: ${book.author}
Publication Year: ${book.publication_year}
ISBN: ${book.isbn}
ID: ${book.id}
Created: ${new Date(book.created_at).toLocaleString()}
Updated: ${new Date(book.updated_at).toLocaleString()}`);
      } else {
        throw new Error(result.message || "Failed to load book details");
      }
    } catch (error) {
      this.showMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error",
      );
    } finally {
      this.showLoading(false);
    }
  }

  // Cancel edit

  private cancelEdit(): void {
    this.isEditing = false;
    this.editingBookId = null;
    this.bookForm.reset();
    this.cancelEditBtn.style.display = "none";

    // Reset submit button
    const submitBtn = this.bookForm.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    submitBtn.textContent = "Add Book";
    submitBtn.className = "btn btn-primary";
  }

  // Loading state
  private showLoading(show: boolean): void {
    this.loadingSpinner.style.display = show ? "block" : "none";
  }

  // Show success/error/info messages

  private showMessage(
    message: string,
    type: "success" | "error" | "info",
    duration: number = 5000,
  ): void {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;

    this.messageContainer.appendChild(messageDiv);

    // Auto remove after 5s
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, duration);
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Method for finding book by ID
  private async findBookById(): Promise<void> {
    const id = parseInt(this.bookIdInput.value);
    if (!id || id < 1) {
      this.showMessage("Please enter a valid book ID", "error");
      return;
    }

    try {
      this.showLoading(true);
      this.clearYearCount();
      this.clearFormFields();

      const response = await fetch(`${this.booksUrl}/${id}`);
      const result: ApiResponse<Book> = await response.json();

      if (response.ok) {
        // Display single book
        this.displayBooks([result.data]);
        this.updateBooksCount(1);
        this.showMessage(`Found book with ID: ${id}`, "success", 3000);
      } else {
        throw new Error(result.message || "Book not found");
      }
    } catch (error) {
      this.showMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error",
      );
      this.displayBooks([]);
      this.updateBooksCount(0);
    } finally {
      this.showLoading(false);
    }
  }
}

// Initialize the application
let booksManager: BooksManager;

// Wait for DOM to be fully loaded before initializing
document.addEventListener("DOMContentLoaded", () => {
  booksManager = new BooksManager();
});
