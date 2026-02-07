# Kai's Portfolio Website

A modern, minimal portfolio for a Python developer featuring a unique electronics knowledge search engine, dark/light mode, and professional aesthetics.

## 🚀 Quick Start

1. Open `index.html` in your browser
2. Or use a local server:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve
   ```

## 📁 Project Structure

```
PORTFOLIO/
├── index.html            # Main HTML file
├── css/
│   └── styles.css        # Complete design system & styles
├── js/
│   ├── main.js           # Core functionality
│   ├── search.js         # Electronics search engine
│   └── contact.js        # EmailJS contact form
├── data/
│   └── electronics.json  # Curated electronics knowledge base
├── assets/
│   ├── resume.pdf        # Your resume (add your own)
│   └── images/           # Project screenshots
└── README.md
```

## ✏️ Customization Guide

### Personal Information
Edit `index.html`:
- Line 10: Update meta description
- Line 14: Update title/tagline
- Social links in hero section (search for `github.com/`, `linkedin.com/`, `your.email@gmail.com`)
- Contact section email and links

### Projects
Find the `projects` section in `index.html` and update:
- Project titles
- Descriptions
- Tech tags
- Links (GitHub, live demo)
- Add project screenshots to `assets/images/`

### Experience
Update the timeline items in the `experience` section with your work history.

### Testimonials
Replace placeholder testimonials with real ones.

### Blog
Add links to your actual blog posts or keep as placeholders.

## 📧 Contact Form Setup (EmailJS)

1. Create a free account at [emailjs.com](https://www.emailjs.com/)
2. Add an email service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{subject}}`
   - `{{message}}`
4. Edit `js/contact.js` and replace:
   ```javascript
   const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
   const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
   const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
   ```
5. Add EmailJS script to `index.html` before other scripts:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   ```

## 📊 Google Analytics Setup

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com/)
2. Get your Measurement ID (starts with `G-`)
3. Replace `G-XXXXXXXXXX` in `index.html` (lines 24-25)

## 🔌 Electronics Knowledge Base

The search engine pulls from `data/electronics.json`. To add new items:

```json
{
  "id": "unique-id",
  "name": "Display Name",
  "category": "Components|Microcontrollers|Protocols|Topics|Tools",
  "icon": "🔧",
  "description": "Brief description of the item",
  "keywords": ["search", "terms", "here"],
  "links": {
    "documentation": "https://...",
    "datasheet": "https://...",
    "tutorial": "https://..."
  }
}
```

## 🚢 Deploy to Vercel

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

2. Deploy on Vercel:
   - Go to [vercel.com](https://vercel.com/)
   - Import your GitHub repository
   - Deploy (no configuration needed for static sites)

## 📱 Features

- ✅ Dark/Light mode toggle
- ✅ Responsive design (mobile + desktop)
- ✅ Typing animation
- ✅ Smooth scroll animations
- ✅ Electronics knowledge search engine
- ✅ Contact form (EmailJS ready)
- ✅ Google Analytics ready
- ✅ SEO optimized

## 📄 License

MIT License - feel free to use and modify!

---

Made with ☕ and Python vibes.
