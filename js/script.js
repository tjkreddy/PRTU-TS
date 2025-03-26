// JavaScript for PRTU Suryapet Website

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Remove ALL hamburger menu related code from here
    // Let mobile-fixes.js handle it exclusively
    
    // Enhanced Language Switcher
    const languageBtn = document.getElementById('language-btn');
    if (languageBtn) {
        languageBtn.addEventListener('click', function() {
            const currentLang = document.documentElement.lang;
            const newLang = currentLang === 'en' ? 'te' : 'en';
            
            // Update HTML lang attribute
            document.documentElement.lang = newLang;
            
            // Update button text
            this.querySelector('span').textContent = newLang === 'en' ? 'తెలుగు' : 'English';
            
            // Visual feedback on language change
            this.classList.add('language-changed');
            setTimeout(() => this.classList.remove('language-changed'), 500);
            
            // Apply translations if Telugu is selected
            if (newLang === 'te') {
                applyTranslations();
            } else {
                // Reload page to revert to English
                location.reload();
            }
            
            // Store language preference
            localStorage.setItem('prtuLanguage', newLang);
        });
    }
    
    // Apply translations function
    function applyTranslations() {
        // Get all elements with data-translate attribute
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations.telugu[key]) {
                // Save original text if not already saved
                if (!element.getAttribute('data-original')) {
                    element.setAttribute('data-original', element.textContent);
                }
                element.textContent = translations.telugu[key];
            }
        });
    }
    
    // Check if user has a language preference stored
    const savedLanguage = localStorage.getItem('prtuLanguage');
    if (savedLanguage) {
        document.documentElement.lang = savedLanguage;
        
        if (savedLanguage === 'te' && languageBtn) {
            languageBtn.querySelector('span').textContent = 'English';
            applyTranslations();
        }
    }

    // News Preview on Homepage
    const newsPreview = document.getElementById('news-preview');
    if (newsPreview) {
        // Get news from localStorage if available, otherwise use sample data
        const newsData = JSON.parse(localStorage.getItem('prtuNews')) || [
            {
                title: 'Annual General Meeting Announcement',
                date: '2023-11-15',
                excerpt: 'The Annual General Meeting of PRTU Suryapet will be held on December 10, 2023. All members are requested to attend without fail.',
                link: 'news.html'
            },
            {
                title: 'Teacher Training Workshop Series',
                date: '2023-10-28',
                excerpt: 'A series of workshops on modern teaching methodologies will be conducted starting next month. Registration is now open.',
                link: 'news.html'
            },
            {
                title: 'New Government Order on Teacher Transfers',
                date: '2023-10-10',
                excerpt: 'The state government has issued a new GO regarding teacher transfers. PRTU has analyzed the implications.',
                link: 'news.html'
            }
        ];

        // Sort by date (newest first) and take the first 3
        const latestNews = newsData
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);

        let newsHTML = '';
        latestNews.forEach(news => {
            // Format date for display
            const displayDate = news.date ? new Date(news.date).toLocaleDateString('en-US', {
                year: 'numeric', 
                month: 'short', 
                day: 'numeric'
            }) : '';

            newsHTML += `
                <div class="news-item">
                    <h4>${news.title}</h4>
                    <p class="date">${displayDate}</p>
                    <p>${news.content ? news.content.substring(0, 150) + '...' : news.excerpt}</p>
                    <a href="${news.link || 'news.html'}" class="read-more">Read More</a>
                </div>
            `;
        });

        newsPreview.innerHTML = newsHTML;
    }

    // News Grid on News Page
    const newsGrid = document.getElementById('news-grid');
    if (newsGrid) {
        // Get news from localStorage if available
        const newsData = JSON.parse(localStorage.getItem('prtuNews'));
        
        if (newsData && newsData.length > 0) {
            // Sort by date (newest first)
            newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Clear existing news
            newsGrid.innerHTML = '';
            
            // Add news items
            newsData.forEach(item => {
                // Format date for display
                const date = new Date(item.date);
                const day = date.getDate();
                const month = date.toLocaleString('default', { month: 'short' });
                const year = date.getFullYear();
                
                const newsHtml = `
                    <article class="news-item">
                        <div class="news-date">
                            <span class="day">${day}</span>
                            <span class="month">${month}</span>
                            <span class="year">${year}</span>
                        </div>
                        <div class="news-content">
                            <h3>${item.title}</h3>
                            <p class="news-meta">Posted by: ${item.author} | Category: ${item.category}</p>
                            <p>${item.content}</p>
                            <a href="#" class="read-more">Read More</a>
                        </div>
                    </article>
                `;
                
                newsGrid.innerHTML += newsHtml;
            });
        }
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('Please fill all required fields');
                return;
            }
            
            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // If all validations pass, show success message
            // In a real scenario, this would send the form data to a server
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Newsletter Form Validation
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // If validation passes, show success message
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }

    // News Search and Filter
    const newsSearch = document.getElementById('news-search');
    const categoryFilter = document.getElementById('category-filter');
    const searchBtn = document.getElementById('search-btn');

    if (newsSearch && categoryFilter && newsGrid && searchBtn) {
        // Filter function to handle both search and category filtering
        function filterNews() {
            const searchTerm = newsSearch.value.toLowerCase();
            const category = categoryFilter.value;
            
            // Get all news items
            const newsItems = newsGrid.querySelectorAll('.news-item');
            
            newsItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const content = item.querySelector('p:not(.news-meta)').textContent.toLowerCase();
                const itemCategory = item.querySelector('.news-meta').textContent.toLowerCase();
                
                // Check if the news item matches both search term and category
                const matchesSearch = title.includes(searchTerm) || content.includes(searchTerm);
                const matchesCategory = category === 'all' || itemCategory.includes(category.toLowerCase());
                
                // Show or hide based on matches
                if (matchesSearch && matchesCategory) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }
        
        // Event listeners for search and filter
        searchBtn.addEventListener('click', filterNews);
        newsSearch.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterNews();
            }
        });
        categoryFilter.addEventListener('change', filterNews);
    }

    // Member Directory Filters
    const zoneFilter = document.getElementById('zone-filter');
    const schoolFilter = document.getElementById('school-filter');
    const filterBtn = document.getElementById('filter-btn');
    
    if (zoneFilter && schoolFilter && filterBtn) {
        filterBtn.addEventListener('click', function() {
            // In a real implementation, this would filter the member list
            alert(`Filtering members by Zone: ${zoneFilter.value} and School Type: ${schoolFilter.value}`);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Highlight active navigation item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks2 = document.querySelectorAll('.nav-links a');
    
    navLinks2.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Keep this for hamburger animation styles but make it load AFTER mobile-fixes.js
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const style = document.createElement('style');
        style.textContent = `
            .hamburger.active .bar:nth-child(1) {
                transform: translateY(8px) rotate(45deg);
            }
            .hamburger.active .bar:nth-child(2) {
                opacity: 0;
            }
            .hamburger.active .bar:nth-child(3) {
                transform: translateY(-8px) rotate(-45deg);
            }
        `;
        document.head.appendChild(style);
    }, 100); // Small delay to ensure it loads after mobile-fixes.js
});
