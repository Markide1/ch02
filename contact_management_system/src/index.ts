interface Contact {
    id: number;
    name: string;
    email: string;
    mobile: string;  
}

class ContactManager {
    private contacts: Contact[] = [];

    constructor() {
        this.contacts = this.loadContacts();
    }

    // Show saved contacts

    private loadContacts(): Contact[] {
        const data = localStorage.getItem("contacts");
        return data ? JSON.parse(data) : [];
    }

    // Saving to local storage
    private saveContacts(): void {
        localStorage.setItem("contacts", JSON.stringify(this.contacts));
    }

    public addContact(contact: Contact): boolean {
        if (this.isDuplicate(contact.email, contact.mobile)) {
            return false;  
        }
        this.contacts.push(contact);
        this.saveContacts();
        return true; 
    }

    public updateContact(updatedContact: Contact): boolean {
        const originalContact = this.getContactById(updatedContact.id);
        if (!originalContact) return false;

        // Check duplications
        if (
            originalContact.email !== updatedContact.email ||
            originalContact.mobile !== updatedContact.mobile
        ) {
            if (
                this.isDuplicate(
                    updatedContact.email,
                    updatedContact.mobile,
                    updatedContact.id
                )
            ) {
                return false;  
            }
        }

        this.contacts = this.contacts.map((c) =>
            c.id === updatedContact.id ? updatedContact : c
        );
        this.saveContacts();
        return true; 
    }

    public deleteContact(id: number): void {
        this.contacts = this.contacts.filter((c) => c.id !== id);
        this.saveContacts();
    }

    public getAllContacts(): Contact[] {
        return this.contacts;
    }

    public getContactById(id: number): Contact | undefined {
        return this.contacts.find((c) => c.id === id);
    }

    // Method to check for duplicates
    private isDuplicate(
        email: string,
        mobile: string,
        currentContactId?: number
    ): boolean {
        return this.contacts.some(
            (contact) =>
                (contact.email === email && contact.id !== currentContactId) ||
                (contact.mobile === mobile && contact.id !== currentContactId)
        );
    }
}

  // Inputs for HTML Elements
const manager = new ContactManager();
const form = document.getElementById("contact_data") as HTMLFormElement;
const contactListDiv = document.querySelector(".contact_list") as HTMLElement;
const messageDiv = document.getElementById("message") as HTMLElement;
const userIdInput = document.getElementById("user-id") as HTMLInputElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const mobileInput = document.getElementById("mobile") as HTMLInputElement;
const cancelBtn = document.getElementById("cancel-btn") as HTMLButtonElement;
const toggleThemeBtn = document.getElementById("toggle-theme") as HTMLButtonElement;

  //  Timeout and Succeess/Error Functions
function showMessage(msg: string, type: "success" | "error"): void {
    messageDiv.textContent = msg;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = "block";

    setTimeout(() => {
        messageDiv.style.display = "none";
        messageDiv.textContent = "";
        messageDiv.className = "message";
    }, 3000);
}

  // Clear form
function clearForm(): void {
    form.reset();
    userIdInput.value = "";
}

  // Email validation

function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
  
  // Number validation
function validateMobile(mobile: string): boolean {
    const re = /^\+?[\d\s\-\(\)\.]{7,}$/;
    return re.test(mobile);
}

//  Display all Contacts

function displayContacts(): void {
    contactListDiv.innerHTML = "";
    const contacts = manager.getAllContacts();
    if (contacts.length === 0) {
        contactListDiv.innerHTML =
            "<p>No contacts found. Please add a new contact!</p>";
        return;
    }

    contacts.forEach((contact) => {
        const div = document.createElement("div");
        div.className = "user-item";
        div.innerHTML = `
      <div class="user-details">
        <strong>${contact.name}</strong><br>
        Email: ${contact.email}<br>
        Mobile: ${contact.mobile}
      </div>
      <div class="user-actions">
        <button class="edit-btn" onclick="editContact(${contact.id})"><i class="fas fa-edit"></i> Edit</button>
        <button class="delete-btn" onclick="deleteContact(${contact.id})"><i class="fas fa-trash-alt"></i> Delete</button>
      </div>
    `;
        contactListDiv.appendChild(div);
    });
}

//  Event Listeners

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = userIdInput.value ? +userIdInput.value : Date.now();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const mobile = mobileInput.value.trim();

    //  Form Validation
    if (!name || !email || !mobile) {
        showMessage("All fields are required.", "error");
        return;
    }

    //  Email validation
    if (!validateEmail(email)) {
        showMessage("Please enter a valid email address.", "error");
        return;
    }

    //   Number validation
    if (!validateMobile(mobile)) {
        showMessage(
            "Please enter a valid phone number (e.g., +123 456 7890, 07XXXXXXXX, 011XXXXXXX).",
            "error"
        );
        return;
    }

    const contact: Contact = { id, name, email, mobile };
    let success = false;
    let message = "";

    //   Update existing contact
    if (userIdInput.value) {
        success = manager.updateContact(contact);
        if (success) {
            message = "Contact updated successfully!";
            showMessage(message, "success");
        } else {
            message = "Failed to update contact. The email or mobile already exists.";
            showMessage(message, "error");
        }
    }

    //   Add contact
    else {
        success = manager.addContact(contact);
        if (success) {
            message = "Contact added successfully!";
            showMessage(message, "success");
        } else {
            message = "Failed to add contact. The email or mobile already exists.";
            showMessage(message, "error");
        }
    }

    if (success) {
        clearForm();
        displayContacts();
    }
});

// Cancel input

cancelBtn.addEventListener("click", () => {
    clearForm();
    showMessage("Form cleared.", "success");
});

//  Edit contact

(window as any).editContact = function (id: number) {
    const contact = manager.getContactById(id);
    if (!contact) {
        showMessage("Contact not found for editing.", "error");
        return;
    }

    userIdInput.value = String(contact.id);
    nameInput.value = contact.name;
    emailInput.value = contact.email;
    mobileInput.value = contact.mobile;
    showMessage("Editing contact: " + contact.name, "success");
};

// Delete contact

(window as any).deleteContact = function (id: number) {
    if (confirm("Are you sure you want to delete this contact?")) {
        manager.deleteContact(id);
        displayContacts();
        showMessage("Contact deleted successfully!", "success");
    } else {
        showMessage("Deletion cancelled.", "success");
    }
};

//  Theme Toggle
toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const icon = toggleThemeBtn.querySelector("i");
    if (icon) {
        if (document.body.classList.contains("dark-theme")) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }
    }

    if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

// Load saved theme preference
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    const icon = toggleThemeBtn.querySelector("i");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        if (icon) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        }
    } else {
        if (icon) {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }
    }
    displayContacts();
});
