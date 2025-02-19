// Toggle mobile menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.navbar-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Change navbar background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        document.querySelector('.navbar').classList.add('navbar-scrolled');
    } else {
        document.querySelector('.navbar').classList.remove('navbar-scrolled');
    }
});

let isIcelandic = true;

async function switchLanguage() {
    const newLang = isIcelandic ? 'is' : 'en';
    const response = await fetch(`${newLang}.json`);
    const translations = await response.json();

    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const keys = element.dataset.langKey.split('.');
        let value = translations;
        for (const key of keys) {
            value = value[key];
        }
        element.textContent = value;
    });

    document.documentElement.lang = newLang;
}

function toggleLanguage(checkbox) {
    isIcelandic = !checkbox.checked;
    switchLanguage();
}

// Initialize the language toggle
document.addEventListener('DOMContentLoaded', () => {
    const languageToggle = document.getElementById('language-toggle-checkbox');
    languageToggle.checked = !isIcelandic;
});