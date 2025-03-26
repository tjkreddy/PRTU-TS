// JavaScript for FAQ page functionality

document.addEventListener('DOMContentLoaded', function() {
    // FAQ Category Filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqItems = document.querySelectorAll('.faq-item');

    // Add click event for category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category
            const category = this.getAttribute('data-category');
            
            // Show all FAQ items if 'all' is selected, otherwise filter
            if (category === 'all') {
                faqItems.forEach(item => item.classList.remove('hidden'));
            } else {
                faqItems.forEach(item => {
                    if (item.getAttribute('data-category') === category) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            }
        });
    });

    // FAQ Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle active class on parent faq-item
            const faqItem = this.parentElement;
            
            // Check if currently active
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // If not previously active, open this FAQ item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // Open first FAQ item by default
    if (faqItems.length > 0 && !faqItems[0].classList.contains('hidden')) {
        faqItems[0].classList.add('active');
    }
});
