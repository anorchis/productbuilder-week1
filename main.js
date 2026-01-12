// Menu Data
const menus = [
    // Korean
    "Kimchi Stew (Kimchi-jjigae)", "Soybean Paste Stew (Doenjang-jjigae)", "Bibimbap", "Bulgogi", "Grilled Pork Belly (Samgyeopsal)", 
    "Spicy Stir-fried Pork (Jeyuk Bokkeum)", "Ginseng Chicken Soup (Samgyetang)", "Tteokbokki", "Cold Noodles (Naengmyeon)", "Braised Short Ribs (Galbi-jjim)",
    
    // Chinese
    "Jajangmyeon (Black Bean Noodles)", "Jjamppong (Spicy Seafood Noodle Soup)", "Sweet and Sour Pork (Tangsuyuk)", "Fried Rice", "Mapo Tofu", "Dumplings",
    
    // Japanese
    "Sushi", "Sashimi", "Udon", "Ramen", "Pork Cutlet (Tonkatsu)", "Tempura Rice Bowl (Tendon)", "Soba Noodles",
    
    // Western
    "Steak", "Pasta (Carbonara, Tomato, etc.)", "Pizza", "Hamburger", "Salad", "Sandwich", "Fried Chicken",
    
    // Others
    "Pho (Vietnamese Noodles)", "Curry", "Tacos"
];

// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    body.setAttribute('data-theme', 'dark');
    themeToggleBtn.textContent = '☀️';
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        themeToggleBtn.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
});

// Recommendation Logic
const recommendBtn = document.getElementById('recommend-btn');
const menuDisplay = document.getElementById('menu-display');

recommendBtn.addEventListener('click', () => {
    // Simple animation effect: clear -> wait -> show
    menuDisplay.style.opacity = '0';
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * menus.length);
        const selectedMenu = menus[randomIndex];
        
        menuDisplay.innerHTML = `<strong>${selectedMenu}</strong>`;
        menuDisplay.style.opacity = '1';
    }, 200);
});