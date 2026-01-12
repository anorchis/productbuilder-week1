
// Translations
const translations = {
    en: {
        title: "Dinner Menu Recommender",
        subtitle: "What should I eat today?",
        placeholder: "Click the button!",
        button: "Recommend Menu"
    },
    ko: {
        title: "저녁 메뉴 추천기",
        subtitle: "오늘 뭐 먹지?",
        placeholder: "버튼을 눌러주세요!",
        button: "메뉴 추천받기"
    }
};

// Menu Data (English and Korean) with specific real image overrides where possible
const menus = [
    { en: "Kimchi Stew", ko: "김치찌개", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Korean.cuisine-Kimchi_jjigae-01.jpg/640px-Korean.cuisine-Kimchi_jjigae-01.jpg" },
    { en: "Soybean Paste Stew", ko: "된장찌개", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Doenjang_jjigae.jpg/640px-Doenjang_jjigae.jpg" },
    { en: "Bibimbap", ko: "비빔밥", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Dolsot-bibimbap.jpg/640px-Dolsot-bibimbap.jpg" },
    { en: "Bulgogi", ko: "불고기", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Bulgogi_1.jpg/640px-Bulgogi_1.jpg" },
    { en: "Grilled Pork Belly", ko: "삼겹살", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Samgyeopsal_gui.jpg/640px-Samgyeopsal_gui.jpg" },
    { en: "Spicy Stir-fried Pork", ko: "제육볶음", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Jeyuk-bokkeum.jpg/640px-Jeyuk-bokkeum.jpg" },
    { en: "Ginseng Chicken Soup", ko: "삼계탕", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Samgyetang_1.jpg/640px-Samgyetang_1.jpg" },
    { en: "Tteokbokki", ko: "떡볶이", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Tteokbokki.JPG/640px-Tteokbokki.JPG" },
    { en: "Cold Noodles", ko: "냉면", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Mul-naengmyeon.jpg/640px-Mul-naengmyeon.jpg" },
    { en: "Braised Short Ribs", ko: "갈비찜", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Galbi-jjim.jpg/640px-Galbi-jjim.jpg" },
    { en: "Jajangmyeon", ko: "짜장면", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Jajangmyeon_2.jpg/640px-Jajangmyeon_2.jpg" },
    { en: "Jjamppong", ko: "짬뽕", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Jjamppong.jpg/640px-Jjamppong.jpg" },
    { en: "Sweet and Sour Pork", ko: "탕수육", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Tangsuyuk_3.jpg/640px-Tangsuyuk_3.jpg" },
    { en: "Fried Rice", ko: "볶음밥", keyword: "fried,rice" },
    { en: "Mapo Tofu", ko: "마파두부", keyword: "mapo,tofu" },
    { en: "Dumplings", ko: "만두", keyword: "dumplings" },
    { en: "Sushi", ko: "초밥", keyword: "sushi" },
    { en: "Sashimi", ko: "회", keyword: "sashimi" },
    { en: "Udon", ko: "우동", keyword: "udon" },
    { en: "Ramen", ko: "라면", keyword: "ramen" },
    { en: "Pork Cutlet", ko: "돈까스", keyword: "pork,cutlet" },
    { en: "Tempura Rice Bowl", ko: "텐동", keyword: "tempura,bowl" },
    { en: "Soba Noodles", ko: "소바", keyword: "soba,noodles" },
    { en: "Steak", ko: "스테이크", keyword: "steak,food" },
    { en: "Pasta", ko: "파스타", keyword: "pasta" },
    { en: "Pizza", ko: "피자", image: "https://cdn.pixabay.com/photo/2017/08/06/06/43/pizza-2589569_1280.jpg" },
    { en: "Hamburger", ko: "햄버거", keyword: "hamburger" },
    { en: "Salad", ko: "샐러드", keyword: "salad" },
    { en: "Sandwich", ko: "샌드위치", keyword: "sandwich" },
    { en: "Fried Chicken", ko: "치킨", keyword: "fried,chicken" },
    { en: "Pho", ko: "쌀국수", keyword: "pho" },
    { en: "Curry", ko: "카레", keyword: "curry" },
    { en: "Tacos", ko: "타코", keyword: "tacos" }
];

// State
let currentLang = localStorage.getItem('lang') || 'ko';

// Elements
const themeToggleBtn = document.getElementById('theme-toggle');
const langToggleBtn = document.getElementById('lang-toggle');
const body = document.body;
const recommendBtn = document.getElementById('recommend-btn');
const menuDisplay = document.getElementById('menu-display');

// Functions
function updateLanguage(lang) {
    // Update UI text
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update Toggle Button Text (Show the *other* language flag)
    langToggleBtn.textContent = lang === 'en' ? '🇰🇷' : '🇺🇸';
    
    // Save preference
    localStorage.setItem('lang', lang);
    currentLang = lang;
}

// Initialize Theme
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    body.setAttribute('data-theme', 'dark');
    themeToggleBtn.textContent = '☀️';
}

// Initialize Language
updateLanguage(currentLang);

// Event Listeners
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

langToggleBtn.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'ko' : 'en';
    updateLanguage(newLang);
    // Reset display
    menuDisplay.innerHTML = `<span class="placeholder" data-i18n="placeholder">${translations[newLang].placeholder}</span>`;
    menuDisplay.style.opacity = '1';
});

recommendBtn.addEventListener('click', () => {
    menuDisplay.style.opacity = '0';
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * menus.length);
        const selectedMenu = menus[randomIndex];
        
        let content = `<strong>${selectedMenu[currentLang]}</strong>`;
        
        // Priority: 1. Specific Image URL 2. Flickr Search (Real photos)
        let imageUrl = selectedMenu.image;
        
        if (!imageUrl) {
            // Use LoremFlickr for real photos from Flickr based on keywords
            // Adding timestamp to prevent caching the same image if clicked again
            const keywords = selectedMenu.keyword || selectedMenu.en.replace(/ /g, ',');
            imageUrl = `https://loremflickr.com/400/300/${keywords}?random=${Date.now()}`;
        }
        
        content = `<img src="${imageUrl}" alt="${selectedMenu[currentLang]}" loading="lazy">` + content;
        
        menuDisplay.innerHTML = content;
        menuDisplay.style.opacity = '1';
    }, 200);
});
