/**
 * JavaScript for the Gallery page features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const filterButtons = document.querySelectorAll('.gallery-filter .filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryButtons = document.querySelectorAll('.gallery-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Gallery filter functionality
    function initGalleryFilter() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        
                        // Add animation
                        item.classList.add('animate-fade-in');
                        setTimeout(() => {
                            item.classList.remove('animate-fade-in');
                        }, 500);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Lightbox functionality
    function initLightbox() {
        let currentIndex = 0;
        let visibleItems = [];
        
        // Open lightbox
        galleryButtons.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                // Get all currently visible items
                visibleItems = Array.from(galleryItems).filter(item => {
                    return window.getComputedStyle(item).display !== 'none';
                });
                
                // Find index of clicked item among visible items
                const clickedItem = this.closest('.gallery-item');
                currentIndex = visibleItems.indexOf(clickedItem);
                
                // Open lightbox with current item
                openLightbox(currentIndex);
            });
        });
        
        // Close lightbox
        if (closeLightbox) {
            closeLightbox.addEventListener('click', function() {
                lightbox.style.display = 'none';
            });
        }
        
        // Close when clicking outside the image
        lightbox.addEventListener('click', function(event) {
            if (event.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
                openLightbox(currentIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % visibleItems.length;
                openLightbox(currentIndex);
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'block') {
                if (e.key === 'ArrowLeft') {
                    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
                    openLightbox(currentIndex);
                } else if (e.key === 'ArrowRight') {
                    currentIndex = (currentIndex + 1) % visibleItems.length;
                    openLightbox(currentIndex);
                } else if (e.key === 'Escape') {
                    lightbox.style.display = 'none';
                }
            }
        });
    }
    
    // Open lightbox with specific image
    function openLightbox(index) {
        const item = visibleItems[index];
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-info h3').textContent;
        const description = item.querySelector('.gallery-info p').textContent;
        
        // Set lightbox content
        lightboxImage.src = img.src;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        
        // Show lightbox
        lightbox.style.display = 'block';
        
        // Add loading state
        lightboxImage.classList.add('loading');
        
        // Remove loading state when image is loaded
        lightboxImage.onload = function() {
            lightboxImage.classList.remove('loading');
        };
    }
    
    // Lazy loading for gallery images
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('.gallery-image img');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src; // This triggers the load if it's using loading="lazy"
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // Initialize functions
    initGalleryFilter();
    initLightbox();
    initLazyLoading();
    
    // Helper variables for lightbox
    let visibleItems = Array.from(galleryItems).filter(item => {
        return window.getComputedStyle(item).display !== 'none';
    });
});