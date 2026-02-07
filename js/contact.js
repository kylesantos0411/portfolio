/**
 * Contact Form - EmailJS Integration
 * Handles form submission and sends emails without a backend
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a free account at https://www.emailjs.com/
 * 2. Create an email service (Gmail, Outlook, etc.)
 * 3. Create an email template with variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
 * 4. Replace the placeholders below with your actual IDs
 */

// ============================================
// EMAILJS CONFIGURATION
// ============================================
// Your EmailJS credentials
const EMAILJS_PUBLIC_KEY = 'ueUaYppajTcNezuEl';
const EMAILJS_SERVICE_ID = 'service_gao2w71';
const EMAILJS_TEMPLATE_ID = 'template_7wok99u';

// ============================================
// FORM HANDLING
// ============================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Get form data
    const formData = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        to_name: 'Kai', // Your name
    };

    try {
        // Check if EmailJS is configured
        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
            // Development mode - show success without actually sending
            console.log('📧 Form submission (EmailJS not configured):', formData);
            showStatus('success', 'Message received! (Demo mode - configure EmailJS for real emails)');
            contactForm.reset();
        } else {
            // Production mode - send via EmailJS
            // Initialize EmailJS (add this script to index.html if using EmailJS)
            // <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

            if (typeof emailjs !== 'undefined') {
                emailjs.init(EMAILJS_PUBLIC_KEY);

                const response = await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    formData
                );

                if (response.status === 200) {
                    showStatus('success', 'Message sent successfully! I\'ll get back to you soon.');
                    contactForm.reset();
                }
            } else {
                throw new Error('EmailJS library not loaded');
            }
        }
    } catch (error) {
        console.error('Error sending email:', error);
        showStatus('error', 'Failed to send message. Please try again or email me directly.');
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Show status message
function showStatus(type, message) {
    formStatus.textContent = message;
    formStatus.className = 'form__status';
    formStatus.classList.add(`form__status--${type}`);

    // Hide status after 5 seconds
    setTimeout(() => {
        formStatus.style.display = 'none';
        formStatus.className = 'form__status';
    }, 5000);
}

// ============================================
// FORM VALIDATION ENHANCEMENT
// ============================================
const formInputs = contactForm.querySelectorAll('.form__input, .form__textarea');

formInputs.forEach(input => {
    // Add visual feedback on focus
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');

        // Validate on blur
        if (input.value.trim()) {
            input.style.borderColor = 'var(--success)';
        } else if (input.required) {
            input.style.borderColor = 'var(--error)';
        } else {
            input.style.borderColor = 'var(--border-color)';
        }
    });

    // Reset border on input
    input.addEventListener('input', () => {
        input.style.borderColor = 'var(--accent)';
    });
});

// Email validation
const emailInput = document.getElementById('email');
emailInput.addEventListener('blur', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value && !emailRegex.test(emailInput.value)) {
        emailInput.style.borderColor = 'var(--error)';
    }
});
