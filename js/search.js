/**
 * Electronics Search Engine
 * Client-side search through the electronics knowledge base
 */

let electronicsData = [];
const searchInput = document.getElementById('electronicsSearch');
const resultsContainer = document.getElementById('electronicsResults');
const noResultsMessage = document.getElementById('noResults');

// Category icons fallback
const categoryIcons = {
    'Components': '⚡',
    'Microcontrollers': '🎛️',
    'Protocols': '🔗',
    'Topics': '📚',
    'Tools': '🔧'
};

// Load electronics data
async function loadElectronicsData() {
    try {
        const response = await fetch('data/electronics.json');
        const data = await response.json();
        electronicsData = data.items;
        displayResults(electronicsData.slice(0, 9)); // Show first 9 items initially
    } catch (error) {
        console.error('Error loading electronics data:', error);
        resultsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Failed to load electronics data.</p>';
    }
}

// Search function
function searchElectronics(query) {
    if (!query.trim()) {
        displayResults(electronicsData.slice(0, 9));
        return;
    }

    const searchTerm = query.toLowerCase();

    const results = electronicsData.filter(item => {
        // Search in name
        if (item.name.toLowerCase().includes(searchTerm)) return true;

        // Search in category
        if (item.category.toLowerCase().includes(searchTerm)) return true;

        // Search in description
        if (item.description.toLowerCase().includes(searchTerm)) return true;

        // Search in keywords
        if (item.keywords && item.keywords.some(kw => kw.toLowerCase().includes(searchTerm))) return true;

        return false;
    });

    displayResults(results);
}

// Display results
function displayResults(items) {
    if (items.length === 0) {
        resultsContainer.innerHTML = '';
        noResultsMessage.style.display = 'block';
        return;
    }

    noResultsMessage.style.display = 'none';

    resultsContainer.innerHTML = items.map(item => `
    <div class="electronics__item">
      <div class="electronics__item-header">
        <div class="electronics__item-icon">${item.icon || categoryIcons[item.category] || '📦'}</div>
        <div>
          <span class="electronics__item-category">${item.category}</span>
          <h4 class="electronics__item-name">${item.name}</h4>
        </div>
      </div>
      <p class="electronics__item-description">${item.description}</p>
      <div class="electronics__item-links">
        ${item.links.documentation ? `<a href="${item.links.documentation}" target="_blank" rel="noopener noreferrer" class="electronics__item-link">📖 Docs</a>` : ''}
        ${item.links.datasheet ? `<a href="${item.links.datasheet}" target="_blank" rel="noopener noreferrer" class="electronics__item-link">📄 Datasheet</a>` : ''}
        ${item.links.tutorial ? `<a href="${item.links.tutorial}" target="_blank" rel="noopener noreferrer" class="electronics__item-link">🎓 Tutorial</a>` : ''}
      </div>
    </div>
  `).join('');
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Event listener with debounce
const debouncedSearch = debounce((e) => {
    searchElectronics(e.target.value);
}, 300);

searchInput.addEventListener('input', debouncedSearch);

// Handle Enter key
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchElectronics(e.target.value);
    }
});

// Initialize
loadElectronicsData();
