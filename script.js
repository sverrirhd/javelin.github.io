
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
