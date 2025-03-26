// JavaScript for Gallery page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Gallery filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Add click event for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected filter
            const filter = this.getAttribute('data-filter');
            
            // Show all gallery items if 'all' is selected, otherwise filter
            if (filter === 'all') {
                galleryItems.forEach(item => item.classList.remove('hidden'));
            } else {
                galleryItems.forEach(item => {
                    if (item.getAttribute('data-category') === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            }
        });
    });
    
    // Gallery Modal
    const modal = document.querySelector('.gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.querySelector('.modal-caption');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    
    // Current index of displayed image
    let currentIndex = 0;
    let visibleItems = [];
    
    // Open modal when clicking on a gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Store reference to visible items for navigation
            visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
            
            // Find the index of this item in the visible items array
            const img = this.querySelector('img');
            const caption = this.querySelector('.gallery-caption').textContent;
            
            modalImg.src = img.src;
            modalCaption.textContent = caption;
            modal.classList.add('active');
            
            // Find current index among visible items
            currentIndex = visibleItems.indexOf(this);
            
            // Disable scrolling on the body
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Navigate to previous image
    modalPrev.addEventListener('click', function() {
        if (visibleItems.length > 0) {
            currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
            const prevItem = visibleItems[currentIndex];
            const img = prevItem.querySelector('img');
            const caption = prevItem.querySelector('.gallery-caption').textContent;
            
            modalImg.src = img.src;
            modalCaption.textContent = caption;
        }
    });
    
    // Navigate to next image
    modalNext.addEventListener('click', function() {
        if (visibleItems.length > 0) {
            currentIndex = (currentIndex + 1) % visibleItems.length;
            const nextItem = visibleItems[currentIndex];
            const img = nextItem.querySelector('img');
            const caption = nextItem.querySelector('.gallery-caption').textContent;
            
            modalImg.src = img.src;
            modalCaption.textContent = caption;
        }
    });
    
    // Close modal when clicking outside of it
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        
        // ESC key closes modal
        if (e.key === 'Escape') {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Left arrow goes to previous image
        if (e.key === 'ArrowLeft') {
            modalPrev.click();
        }
        
        // Right arrow goes to next image
        if (e.key === 'ArrowRight') {
            modalNext.click();
        }
    });
    
    // Load More functionality
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // In a real implementation, this would load more images from the server
            // For this demo, we'll just show a message
            loadMoreBtn.textContent = 'No more images to load';
            loadMoreBtn.disabled = true;
            setTimeout(() => {
                loadMoreBtn.textContent = 'Load More Images';
                loadMoreBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Touch swipe support for mobile gallery navigation
    if (modal) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        function checkSwipeDirection() {
            if (touchEndX < touchStartX - 50) {
                // Swiped left - go to next image
                document.querySelector('.modal-next').click();
            }
            if (touchEndX > touchStartX + 50) {
                // Swiped right - go to previous image
                document.querySelector('.modal-prev').click();
            }
        }
        
        modal.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        modal.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            checkSwipeDirection();
        }, false);
    }
    
    // Improve gallery item touch feedback on mobile
    galleryItems.forEach(item => {
        item.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        
        item.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
        
        item.addEventListener('touchcancel', function() {
            this.style.opacity = '1';
        });
    });
});
