// Islamic Duas App with Advanced Features
class IslamicDuasApp {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.showFavoritesOnly = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.applyTheme();
        this.updateStats();
        this.setupSearch();
    }

    bindEvents() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        // Favorites toggle
        document.getElementById('favorites-toggle').addEventListener('click', () => this.toggleFavorites());
        
        // Search
        document.getElementById('search-input').addEventListener('input', (e) => this.search(e.target.value));
        
        // Burger menu
        document.getElementById('burger-menu').addEventListener('click', () => this.toggleBurgerMenu());
        document.getElementById('close-menu').addEventListener('click', () => this.closeBurgerMenu());
        
        // Category filters
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByCategory(e.target.dataset.category);
                this.closeBurgerMenu();
            });
        });
        
        // Quick access buttons
        document.getElementById('daily-duas-btn').addEventListener('click', () => {
            this.showDailyDuas();
            this.closeBurgerMenu();
        });
        document.getElementById('emergency-duas-btn').addEventListener('click', () => {
            this.showEmergencyDuas();
            this.closeBurgerMenu();
        });
        document.getElementById('popular-duas-btn').addEventListener('click', () => {
            this.showPopularDuas();
            this.closeBurgerMenu();
        });
        document.getElementById('short-duas-btn').addEventListener('click', () => {
            this.showShortDuas();
            this.closeBurgerMenu();
        });
        
        // Copy buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.copy-btn')) {
                this.copyText(e.target.closest('.dua-card'));
            }
        });
        
        // Favorite buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn')) {
                this.toggleFavorite(e.target.closest('.dua-card'));
            }
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.search(e.target.value);
            }, 300);
        });
    }

    search(query) {
        const cards = document.querySelectorAll('.dua-card');
        const searchTerm = query.toLowerCase();
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const matches = text.includes(searchTerm);
            
            if (this.showFavoritesOnly) {
                const isFavorite = card.dataset.favorite === 'true';
                card.style.display = (matches && isFavorite) ? 'block' : 'none';
            } else {
                card.style.display = matches ? 'block' : 'none';
            }
        });
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        localStorage.setItem('darkMode', this.isDarkMode);
    }

    applyTheme() {
        document.body.classList.toggle('dark-theme', this.isDarkMode);
        const themeIcon = document.querySelector('#theme-toggle i');
        themeIcon.className = this.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleFavorites() {
        this.showFavoritesOnly = !this.showFavoritesOnly;
        const btn = document.getElementById('favorites-toggle');
        const icon = btn.querySelector('i');
        
        if (this.showFavoritesOnly) {
            icon.className = 'fas fa-heart';
            btn.style.background = '#e74c3c';
            this.showOnlyFavorites();
        } else {
            icon.className = 'fas fa-heart';
            btn.style.background = '';
            this.showAllDuas();
        }
    }

    showOnlyFavorites() {
        const cards = document.querySelectorAll('.dua-card');
        cards.forEach(card => {
            const isFavorite = card.dataset.favorite === 'true';
            card.style.display = isFavorite ? 'block' : 'none';
        });
    }

    showAllDuas() {
        const cards = document.querySelectorAll('.dua-card');
        cards.forEach(card => {
            card.style.display = 'block';
        });
    }

    toggleFavorite(card) {
        const cardId = this.getCardId(card);
        const isFavorite = card.dataset.favorite === 'true';
        
        if (isFavorite) {
            this.favorites = this.favorites.filter(id => id !== cardId);
            card.dataset.favorite = 'false';
            card.querySelector('.favorite-btn i').className = 'far fa-heart';
        } else {
            this.favorites.push(cardId);
            card.dataset.favorite = 'true';
            card.querySelector('.favorite-btn i').className = 'fas fa-heart';
        }
        
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.updateStats();
        this.showToast(isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное');
    }

    copyText(card) {
        const arabicText = card.querySelector('.arabic-text').textContent;
        const translation = card.querySelector('.translation').textContent;
        const fullText = `${arabicText}\n\n${translation}`;
        
        navigator.clipboard.writeText(fullText).then(() => {
            this.showToast('Текст скопирован!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = fullText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Текст скопирован!');
        });
    }

    getCardId(card) {
        const title = card.querySelector('h3').textContent;
        return title.toLowerCase().replace(/\s+/g, '-');
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const messageEl = document.getElementById('toast-message');
        
        messageEl.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    updateStats() {
        const totalDuas = document.querySelectorAll('.dua-card').length;
        const favoriteCount = this.favorites.length;
        
        document.getElementById('total-duas').textContent = `Всего дуа: ${totalDuas}`;
        document.getElementById('favorite-count').textContent = `Избранных: ${favoriteCount}`;
    }

    // Initialize favorites from localStorage
    loadFavorites() {
        const cards = document.querySelectorAll('.dua-card');
        cards.forEach(card => {
            const cardId = this.getCardId(card);
            if (this.favorites.includes(cardId)) {
                card.dataset.favorite = 'true';
                card.querySelector('.favorite-btn i').className = 'fas fa-heart';
            }
        });
    }

    // Category filtering
    filterByCategory(category) {
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Filter cards
        const cards = document.querySelectorAll('.dua-card');
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        this.showToast(`Показаны дуа: ${this.getCategoryName(category)}`);
    }

    getCategoryName(category) {
        const names = {
            'all': 'Все',
            'morning': 'Утром',
            'evening': 'Вечером',
            'protection': 'Защита',
            'health': 'Здоровье',
            'thanks': 'Благодарность',
            'istighfar': 'Покаяние',
            'tasbih': 'Прославление'
        };
        return names[category] || 'Все';
    }

    // Quick access functions
    showDailyDuas() {
        this.filterByCategory('morning');
        this.showToast('Ежедневные дуа для утра');
    }

    showEmergencyDuas() {
        this.filterByCategory('protection');
        this.showToast('Экстренные дуа для защиты');
    }

    showPopularDuas() {
        // Show most favorited duas
        const cards = document.querySelectorAll('.dua-card');
        cards.forEach(card => {
            const isFavorite = card.dataset.favorite === 'true';
            card.style.display = isFavorite ? 'block' : 'none';
        });
        this.showToast('Популярные дуа (избранные)');
    }

    showShortDuas() {
        // Show short duas (less than 100 characters)
        const cards = document.querySelectorAll('.dua-card');
        cards.forEach(card => {
            const arabicText = card.querySelector('.arabic-text').textContent;
            const isShort = arabicText.length < 100;
            card.style.display = isShort ? 'block' : 'none';
        });
        this.showToast('Короткие дуа для быстрого чтения');
    }

    // Burger menu functions
    toggleBurgerMenu() {
        const menu = document.getElementById('burger-menu-content');
        menu.classList.toggle('show');
    }

    closeBurgerMenu() {
        const menu = document.getElementById('burger-menu-content');
        menu.classList.remove('show');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new IslamicDuasApp();
    app.loadFavorites();
});

// Add some fun animations
document.addEventListener('DOMContentLoaded', () => {
    // Add stagger animation to cards
    const cards = document.querySelectorAll('.dua-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'f':
                e.preventDefault();
                document.getElementById('search-input').focus();
                break;
            case 'd':
                e.preventDefault();
                document.getElementById('theme-toggle').click();
                break;
        }
    }
});
