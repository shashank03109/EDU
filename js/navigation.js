/**
 * Navigation JavaScript for header and mobile navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const header = document.getElementById('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    // Handle header scroll effect
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        // Prevent scrolling when mobile menu is open
        if (mobileNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Smooth scroll to section when clicking on nav links
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-list a, .mobile-nav-list a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Check if the link is an anchor on the same page
                const href = this.getAttribute('href');
                if (href.includes('#') && href.charAt(0) !== '#') {
                    const splitHref = href.split('#');
                    
                    // If we're on the same page and there's a hash
                    if (window.location.pathname.includes(splitHref[0]) && splitHref.length > 1) {
                        e.preventDefault();
                        const targetId = splitHref[1];
                        const targetElement = document.getElementById(targetId);
                        
                        if (targetElement) {
                            // Close mobile menu if open
                            if (mobileNav.classList.contains('active')) {
                                toggleMobileMenu();
                            }
                            
                            // Scroll to element
                            const headerHeight = header.offsetHeight;
                            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                } else if (href.charAt(0) === '#' && href.length > 1) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // Close mobile menu if open
                        if (mobileNav.classList.contains('active')) {
                            toggleMobileMenu();
                        }
                        
                        // Scroll to element
                        const headerHeight = header.offsetHeight;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-list a, .mobile-nav-list a');
        
        // Get current scroll position
        const scrollPosition = window.scrollY + header.offsetHeight + 50;
        
        // Find the section that's currently in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to corresponding links
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href.includes(`#${sectionId}`)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Event listeners
    window.addEventListener('scroll', handleHeaderScroll);
    window.addEventListener('scroll', updateActiveNavLink);
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initial call to set correct state
    handleHeaderScroll();
    updateActiveNavLink();
});