/**
 * Mobile Fixes for PRTU Suryapet Website
 * This script contains emergency fixes for mobile functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile fixes loading...');
    
    // Create overlay if it doesn't exist
    if (!document.querySelector('.nav-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
        console.log('Navigation overlay created');
    }

    // Get necessary elements
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');

    // Only proceed if elements exist
    if (hamburger && navLinks) {
        console.log('Initializing hamburger menu functionality');
        
        // Reset initial state
        navLinks.style.right = '-100%';
        
        // Toggle menu
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger clicked - toggling menu');
            
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('nav-active');
            
            console.log('Menu active state:', navLinks.classList.contains('active'));
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', closeMenu);

        // Close menu when clicking links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu function
        function closeMenu() {
            console.log('Closing menu');
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('nav-active');
        }

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });

        console.log('Hamburger menu initialization complete');
    } else {
        console.error('ERROR: Could not find hamburger or nav-links elements');
        console.error('Hamburger:', hamburger);
        console.error('Nav links:', navLinks);
    }
    
    // ENHANCED: Fix language button positioning on ALL devices
    const languageSwitcher = document.querySelector('.language-switcher');
    if (languageSwitcher) {
        // Force language switcher to bottom right position
        function fixLanguageSwitcherPosition() {
            // Add !important to styles using cssText for maximum precedence
            languageSwitcher.style.cssText = 
                "position: fixed !important;" +
                "bottom: 20px !important;" + 
                "right: 20px !important;" + 
                "top: auto !important;" +
                "z-index: 9999 !important;" +
                "display: block !important;";
        }
        
        // Apply immediately
        fixLanguageSwitcherPosition();
        
        // Also apply on resize and scroll to ensure it stays fixed
        window.addEventListener('resize', fixLanguageSwitcherPosition);
        window.addEventListener('scroll', fixLanguageSwitcherPosition);
        
        // Make sure it's visible
        languageSwitcher.style.display = 'block';
        
        // Add a data attribute for CSS targeting
        languageSwitcher.setAttribute('data-fixed', 'true');
    }
});
