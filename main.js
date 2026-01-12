
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

// Menu Data (English and Korean)
const menus = [
    { en: "Kimchi Stew", ko: "김치찌개" },
    { en: "Soybean Paste Stew", ko: "된장찌개" },
    { en: "Bibimbap", ko: "비빔밥" },
    { en: "Bulgogi", ko: "불고기" },
    { en: "Grilled Pork Belly", ko: "삼겹살" },
    { en: "Spicy Stir-fried Pork", ko: "제육볶음" },
    { en: "Ginseng Chicken Soup", ko: "삼계탕" },
    { en: "Tteokbokki", ko: "떡볶이" },
    { en: "Cold Noodles", ko: "냉면" },
    { en: "Braised Short Ribs", ko: "갈비찜" },
    { en: "Jajangmyeon", ko: "짜장면" },
    { en: "Jjamppong", ko: "짬뽕" },
    { en: "Sweet and Sour Pork", ko: "탕수육" },
    { en: "Fried Rice", ko: "볶음밥" },
    { en: "Mapo Tofu", ko: "마파두부" },
    { en: "Dumplings", ko: "만두" },
    { en: "Sushi", ko: "초밥" },
    { en: "Sashimi", ko: "회" },
    { en: "Udon", ko: "우동" },
    { en: "Ramen", ko: "라면" },
    { en: "Pork Cutlet", ko: "돈까스" },
    { en: "Tempura Rice Bowl", ko: "텐동" },
    { en: "Soba Noodles", ko: "소바" },
    { en: "Steak", ko: "스테이크" },
    { en: "Pasta", ko: "파스타" },
    { en: "Pizza", ko: "피자" },
    { en: "Hamburger", ko: "햄버거" },
    { en: "Salad", ko: "샐러드" },
    { en: "Sandwich", ko: "샌드위치" },
    { en: "Fried Chicken", ko: "치킨" },
    { en: "Pho", ko: "쌀국수" },
    { en: "Curry", ko: "카레" },
    { en: "Tacos", ko: "타코" }
];

// State
let currentLang = localStorage.getItem('lang') || 'en';

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
    // Reset display if it's showing a menu to avoid confusion, or keep it?
    // Let's reset to placeholder for clarity
    menuDisplay.innerHTML = `<span class="placeholder" data-i18n="placeholder">${translations[newLang].placeholder}</span>`;
    menuDisplay.style.opacity = '1';
});

recommendBtn.addEventListener('click', () => {
    menuDisplay.style.opacity = '0';
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * menus.length);
        const selectedMenu = menus[randomIndex];
        
        // Display based on current language
        menuDisplay.innerHTML = `<strong>${selectedMenu[currentLang]}</strong>`;
        menuDisplay.style.opacity = '1';
    }, 200);
});
