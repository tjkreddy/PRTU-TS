// JavaScript for PRTU Suryapet Admin

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const currentPage = window.location.pathname;
    
    // Redirect to login if not logged in (except for login page)
    if (!isLoggedIn && !currentPage.includes('login.html') && !currentPage.includes('/admin/')) {
        window.location.href = 'login.html';
    }
    
    // Admin Login Form
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const loginMessage = document.getElementById('login-message');
            
            // Simple authentication (in real world, this would be done on server)
            if (username === 'admin' && password === 'prtu2023') {
                loginMessage.textContent = 'Login successful. Redirecting...';
                loginMessage.className = 'login-message success';
                
                // Store login state in session storage
                sessionStorage.setItem('adminLoggedIn', 'true');
                sessionStorage.setItem('adminUsername', username);
                
                // Redirect to admin dashboard
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                loginMessage.textContent = 'Invalid username or password';
                loginMessage.className = 'login-message error';
            }
        });
    }
    
    // Admin Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        // Display username
        const adminUsername = document.getElementById('admin-username');
        if (adminUsername) {
            adminUsername.textContent = sessionStorage.getItem('adminUsername') || 'Admin';
        }
        
        logoutBtn.addEventListener('click', function() {
            // Clear session storage
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminUsername');
            
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
    
    // Initialize news data if not exists
    if (!localStorage.getItem('prtuNews')) {
        // Sample news data
        const initialNews = [
            {
                id: 1,
                title: 'Annual General Meeting Announcement',
                date: '2023-11-15',
                category: 'Announcements',
                author: 'Admin',
                content: 'The Annual General Meeting of PRTU Suryapet will be held on December 10, 2023. All members are requested to attend without fail. The meeting will take place at the District Conference Hall at 10:00 AM.'
            },
            {
                id: 2,
                title: 'Teacher Training Workshop Series',
                date: '2023-10-28',
                category: 'Events',
                author: 'Events Team',
                content: 'A series of workshops on modern teaching methodologies will be conducted starting next month. Registration is now open for all interested teachers. The workshops will cover digital teaching tools, inclusive education practices, and effective assessment techniques.'
            },
            {
                id: 3,
                title: 'New Government Order on Teacher Transfers',
                date: '2023-10-10',
                category: 'Policy Updates',
                author: 'Secretary',
                content: 'The state government has issued a new GO regarding teacher transfers. PRTU has analyzed the implications and prepared recommendations for members. Key points include new zonal regulations, points system modifications, and revised timelines for transfer applications.'
            }
        ];
        
        localStorage.setItem('prtuNews', JSON.stringify(initialNews));
    }
    
    // News management - Add/Edit news
    const addNewsBtn = document.getElementById('add-news-btn');
    const cancelNewsBtn = document.getElementById('cancel-news-btn');
    const newsFormContainer = document.getElementById('news-form-container');
    const newsForm = document.getElementById('news-form');
    const newsTableBody = document.getElementById('news-table-body');
    const formTitle = document.getElementById('form-title');
    
    // Show/hide news form
    if (addNewsBtn && cancelNewsBtn && newsFormContainer) {
        addNewsBtn.addEventListener('click', function() {
            // Reset form for adding new news
            formTitle.textContent = 'Add News';
            newsForm.reset();
            document.getElementById('news-id').value = '';
            document.getElementById('news-date').valueAsDate = new Date();
            
            // Show form
            newsFormContainer.classList.add('active');
            document.getElementById('admin-news-list').style.display = 'none';
        });
        
        cancelNewsBtn.addEventListener('click', function() {
            // Hide form
            newsFormContainer.classList.remove('active');
            document.getElementById('admin-news-list').style.display = 'block';
        });
    }
    
    // Submit news form
    if (newsForm) {
        newsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newsId = document.getElementById('news-id').value;
            const newsTitle = document.getElementById('news-title').value;
            const newsDate = document.getElementById('news-date').value;
            const newsCategory = document.getElementById('news-category').value;
            const newsAuthor = document.getElementById('news-author').value;
            const newsContent = document.getElementById('news-content').value;
            
            // Get existing news
            let news = JSON.parse(localStorage.getItem('prtuNews')) || [];
            
            if (newsId) {
                // Update existing news
                const index = news.findIndex(item => item.id === parseInt(newsId));
                if (index !== -1) {
                    news[index] = {
                        id: parseInt(newsId),
                        title: newsTitle,
                        date: newsDate,
                        category: newsCategory,
                        author: newsAuthor,
                        content: newsContent
                    };
                }
            } else {
                // Add new news
                const newId = news.length > 0 ? Math.max(...news.map(item => item.id)) + 1 : 1;
                news.push({
                    id: newId,
                    title: newsTitle,
                    date: newsDate,
                    category: newsCategory,
                    author: newsAuthor,
                    content: newsContent
                });
            }
            
            // Save to localStorage
            localStorage.setItem('prtuNews', JSON.stringify(news));
            
            // Hide form and refresh news list
            newsFormContainer.classList.remove('active');
            document.getElementById('admin-news-list').style.display = 'block';
            loadNewsList();
            
            // Show notification
            alert(newsId ? 'News updated successfully!' : 'News added successfully!');
        });
    }
    
    // Load news list
    function loadNewsList() {
        if (!newsTableBody) return;
        
        const news = JSON.parse(localStorage.getItem('prtuNews')) || [];
        
        // Sort news by date (newest first)
        news.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let tableHtml = '';
        
        if (news.length === 0) {
            tableHtml = `<tr><td colspan="5" class="text-center">No news items found</td></tr>`;
        } else {
            news.forEach(item => {
                // Format date for display
                const displayDate = new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric'
                });
                
                tableHtml += `
                    <tr data-id="${item.id}">
                        <td>${item.title}</td>
                        <td>${displayDate}</td>
                        <td>${item.category}</td>
                        <td>${item.author}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn-view view-news" title="View">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-edit edit-news" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-delete delete-news" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }
        
        newsTableBody.innerHTML = tableHtml;
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-news').forEach(button => {
            button.addEventListener('click', function() {
                const newsId = this.closest('tr').dataset.id;
                editNews(newsId);
            });
        });
        
        document.querySelectorAll('.delete-news').forEach(button => {
            button.addEventListener('click', function() {
                const newsId = this.closest('tr').dataset.id;
                showDeleteConfirmation(newsId);
            });
        });
        
        document.querySelectorAll('.view-news').forEach(button => {
            button.addEventListener('click', function() {
                const newsId = this.closest('tr').dataset.id;
                viewNews(newsId);
            });
        });
    }
    
    // Edit news
    function editNews(id) {
        const news = JSON.parse(localStorage.getItem('prtuNews')) || [];
        const newsItem = news.find(item => item.id === parseInt(id));
        
        if (newsItem) {
            // Fill form with news data
            document.getElementById('news-id').value = newsItem.id;
            document.getElementById('news-title').value = newsItem.title;
            document.getElementById('news-date').value = newsItem.date;
            document.getElementById('news-category').value = newsItem.category;
            document.getElementById('news-author').value = newsItem.author;
            document.getElementById('news-content').value = newsItem.content;
            
            // Update form title
            formTitle.textContent = 'Edit News';
            
            // Show form
            newsFormContainer.classList.add('active');
            document.getElementById('admin-news-list').style.display = 'none';
        }
    }
    
    // View news (placeholder - in real app, this might open a modal)
    function viewNews(id) {
        const news = JSON.parse(localStorage.getItem('prtuNews')) || [];
        const newsItem = news.find(item => item.id === parseInt(id));
        
        if (newsItem) {
            alert(`Title: ${newsItem.title}\n\nContent: ${newsItem.content}`);
        }
    }
    
    // Delete confirmation
    const deleteModal = document.getElementById('delete-confirm-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    let deleteNewsId = null;
    
    function showDeleteConfirmation(id) {
        deleteNewsId = id;
        deleteModal.classList.add('active');
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            deleteModal.classList.remove('active');
            deleteNewsId = null;
        });
    }
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            if (deleteNewsId) {
                deleteNews(deleteNewsId);
                deleteModal.classList.remove('active');
                deleteNewsId = null;
            }
        });
    }
    
    // Delete news
    function deleteNews(id) {
        let news = JSON.parse(localStorage.getItem('prtuNews')) || [];
        news = news.filter(item => item.id !== parseInt(id));
        
        // Save to localStorage
        localStorage.setItem('prtuNews', JSON.stringify(news));
        
        // Refresh news list
        loadNewsList();
        
        // Show notification
        alert('News deleted successfully!');
    }
    
    // Search and Filter for admin news
    const adminNewsSearch = document.getElementById('admin-news-search');
    const adminCategoryFilter = document.getElementById('admin-category-filter');
    const adminSearchBtn = document.getElementById('admin-search-btn');
    
    if (adminNewsSearch && adminCategoryFilter && adminSearchBtn) {
        function filterAdminNews() {
            const searchTerm = adminNewsSearch.value.toLowerCase();
            const category = adminCategoryFilter.value.toLowerCase();
            
            const allRows = newsTableBody.querySelectorAll('tr');
            
            allRows.forEach(row => {
                const title = row.cells[0].textContent.toLowerCase();
                const rowCategory = row.cells[2].textContent.toLowerCase();
                
                const matchesSearch = title.includes(searchTerm);
                const matchesCategory = category === 'all' || rowCategory.includes(category);
                
                if (matchesSearch && matchesCategory) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
        
        adminSearchBtn.addEventListener('click', filterAdminNews);
        adminNewsSearch.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterAdminNews();
            }
        });
        adminCategoryFilter.addEventListener('change', filterAdminNews);
    }
    
    // Initialize admin dashboard
    if (newsTableBody) {
        loadNewsList();
    }
});
