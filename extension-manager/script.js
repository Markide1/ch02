document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

function loadData() {
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('.container');
            
            // Initialize theme from JSON data
            const savedTheme = data.theme || 'light';
            applyTheme(savedTheme);
            
            // Create extension cards
            data.extensions.forEach(extension => {
                const card = createExtensionCard(extension);
                container.appendChild(card);
            });
            
            // Filter buttons
            setupFilterButtons();
        })
        .catch(error => console.error('Error loading data:', error));
}

// Function to create extension cards 

function createExtensionCard(extension) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.active = extension.isActive;
    
    const imgBackground = getBackgroundColor(extension.name);
    
    card.innerHTML = `
        <div class="card__image" style="background-color: ${imgBackground}">
            <img src="${extension.logo}" alt="${extension.name} logo">
        </div>
        <div class="card__content">
            <h3>${extension.name}</h3>
            <p>${extension.description}</p>
            <div class="card__content__status">
                <button class="card__button">Remove</button>
                <label class="toggle-switch">
                    <input type="checkbox" ${extension.isActive ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    `;

    // Remove button 
    card.querySelector('.card__button').addEventListener('click', () => {
        card.remove();
           
    });
    
    // Toggle switch for status
    const toggleSwitch = card.querySelector('input[type="checkbox"]');
    toggleSwitch.addEventListener('change', () => {
        extension.isActive = toggleSwitch.checked;
        card.dataset.active = extension.isActive;
    });

    return card;
}

// Function to get background color based on extension name
function getBackgroundColor(name) {
   
    const colors = {
        'DevLens': '#D1E7D3',
        'StyleSpy': '#BEE1E6',
        'SpeedBoost': '#F8D5D7',
        'JSONWizard': '#F8D5E9',
        'TabMaster Pro': '#D8C6E7',
        'ViewportBuddy': '#C5DEF0',
        'Markup Notes': '#A5DDF9',
        'GridGuides': '#D8C6E7',
        'Palette Picker': '#BEEBD4',
        'LinkChecker': '#F8E1D1',
        'DOM Snapshot': '#BEE1E6',
        'ConsolePlus': '#C8F6D4'
    };
    
    return colors[name] || '#D1E7D3';
}

// Function to set up filter buttons
function setupFilterButtons() {
    const allButton = document.querySelector('.header__status button:nth-child(1)');
    const activeButton = document.querySelector('.header__status button:nth-child(2)');
    const inactiveButton = document.querySelector('.header__status button:nth-child(3)');
    
    // Set default active button
    allButton.classList.add('active');
    
    // Filter buttons event listeners
    allButton.addEventListener('click', () => {
        setActiveButton(allButton);
        filterCards('all');
    });
    
    // Active button event listener
    activeButton.addEventListener('click', () => {
        setActiveButton(activeButton);
        filterCards('active');
    });
    
    // Inactive button event listener
    inactiveButton.addEventListener('click', () => {
        setActiveButton(inactiveButton);
        filterCards('inactive');
    });
}

function setActiveButton(activeButton) {

    // Remove active class from all buttons
    document.querySelectorAll('.header__status button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to clicked button
    activeButton.classList.add('active');
}


// Function to filter cards based on status
function filterCards(filter) {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const isActive = card.dataset.active === 'true';
        
        if (filter === 'all') {
            card.style.display = 'flex';
        } else if (filter === 'active' && isActive) {
            card.style.display = 'flex';
        } else if (filter === 'inactive' && !isActive) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Theme toggle function
function applyTheme(theme) {
    const body = document.body;
    const toggleIcon = document.getElementById("toggle")?.querySelector("img");
    
    // Apply theme class and update icon
    if (theme === "dark") {
        body.classList.add("dark-theme");
        if (toggleIcon) toggleIcon.src = "./assets/images/icon-sun.svg";
    } else {
        body.classList.remove("dark-theme");
        if (toggleIcon) toggleIcon.src = "./assets/images/icon-moon.svg";
    }
}

// Theme toggle event listener
function themeToggle() {
    const body = document.body;
    const isDarkMode = body.classList.contains("dark-theme");
    const toggleIcon = document.getElementById("toggle").querySelector("img");
    
    // Toggle theme
    if (!isDarkMode) {
        body.classList.add("dark-theme");
        toggleIcon.src = "./assets/images/icon-sun.svg";
    } else {
        body.classList.remove("dark-theme");
        toggleIcon.src = "./assets/images/icon-moon.svg";
    }
    
    // Save theme preference
    const theme = isDarkMode ? "light" : "dark";
    console.log("Theme set to:", theme);
}