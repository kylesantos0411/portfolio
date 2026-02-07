/**
 * Main JavaScript - Core functionality
 * Theme toggle, animations, navigation, typing effect
 */

// ============================================
// THEME TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const sunIcon = themeToggle.querySelector('.sun-icon');
const moonIcon = themeToggle.querySelector('.moon-icon');

// Check for saved theme preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcons(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
});

function updateThemeIcons(theme) {
    if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

// ============================================
// MOBILE NAVIGATION
// ============================================
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ============================================
// TYPING ANIMATION
// ============================================
const typingText = document.getElementById('typingText');
const phrases = [
    'Automating the Future, One Script at a Time',
    'Python Developer & AI Enthusiast',
    'Building Smart Solutions',
    'Electronics Hobbyist & Maker'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at end of phrase
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
    }

    setTimeout(typeWriter, typingSpeed);
}

// Start typing animation
setTimeout(typeWriter, 1000);

// ============================================
// CODE BACKGROUND ANIMATION
// ============================================
const codeBg = document.getElementById('codeBg');

const codeSnippets = [
    'def automate():',
    '    while True:',
    '        solve_problem()',
    'import asyncio',
    'async def main():',
    '    await process()',
    'class AI:',
    '    def __init__(self):',
    '        self.learn()',
    'for i in range(∞):',
    '    code()',
    '    coffee()',
    '@decorator',
    'def transform(data):',
    '    return magic(data)',
    'try:',
    '    innovate()',
    'except:',
    '    iterate()',
    'if __name__:',
    '    run()',
];

// Generate code background
function generateCodeBackground() {
    let html = '';
    for (let i = 0; i < 50; i++) {
        const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        html += snippet + '<br>';
    }
    codeBg.innerHTML = html;
}

generateCodeBackground();

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, fadeObserverOptions);

fadeElements.forEach(element => {
    fadeObserver.observe(element);
});

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav__link');

function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinksAll.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavOnScroll);

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log(`
%c╔═══════════════════════════════════════════╗
║                                           ║
║   👋 Hello, curious developer!            ║
║                                           ║
║   Looking under the hood?                 ║
║   That's the spirit!                      ║
║                                           ║
║   Let's connect:                          ║
║   → GitHub: github.com/yourusername      ║
║   → LinkedIn: linkedin.com/in/username   ║
║                                           ║
╚═══════════════════════════════════════════╝
`, 'color: #6366f1; font-family: monospace;');
