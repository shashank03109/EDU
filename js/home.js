/**
 * JavaScript for the Home page features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Testimonial slider functionality
    function initTestimonialSlider() {
        const testimonialSlides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.testimonial-dots .dot');
        let currentSlide = 0;
        let interval;
        
        // Show a specific slide
        function showSlide(index) {
            // Hide all slides
            testimonialSlides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Remove active class from all dots
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Show the selected slide and dot
            testimonialSlides[index].classList.add('active');
            dots[index].classList.add('active');
            
            currentSlide = index;
        }
        
        // Auto-rotate testimonials
        function startAutoRotate() {
            interval = setInterval(() => {
                const nextSlide = (currentSlide + 1) % testimonialSlides.length;
                showSlide(nextSlide);
            }, 5000); // Change slide every 5 seconds
        }
        
        // Add click event to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                clearInterval(interval); // Reset interval when manually changing slide
                startAutoRotate();
            });
        });
        
        // Start auto-rotation
        if (testimonialSlides.length > 0) {
            startAutoRotate();
        }
    }
    
    // Animate statistics on scroll
    function initStatsAnimation() {
        const stats = document.querySelectorAll('.stat-number');
        
        function animateStats() {
            stats.forEach(stat => {
                const rect = stat.getBoundingClientRect();
                const isVisible = (
                    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.bottom >= 0
                );
                
                if (isVisible && !stat.classList.contains('animated')) {
                    const target = parseInt(stat.textContent.replace(/\D/g, ''), 10);
                    let count = 0;
                    const duration = 2000; // 2 seconds
                    const increment = Math.ceil(target / (duration / 16)); // 60fps
                    const plusSign = stat.textContent.includes('+');
                    
                    stat.classList.add('animated');
                    
                    const animate = () => {
                        count += increment;
                        if (count >= target) {
                            count = target;
                            stat.textContent = plusSign ? `${count}+` : count;
                        } else {
                            stat.textContent = plusSign ? `${count}+` : count;
                            requestAnimationFrame(animate);
                        }
                    };
                    
                    animate();
                }
            });
        }
        
        // Add scroll event listener
        window.addEventListener('scroll', animateStats);
        
        // Initial check
        animateStats();
    }
    
    // Parallax effect for hero section
    function initParallaxEffect() {
        const hero = document.querySelector('.hero');
        
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            
            if (scrollPosition < window.innerHeight) {
                // Move background slightly for parallax effect
                hero.style.backgroundPosition = `center ${50 + (scrollPosition * 0.1)}%`;
            }
        });
    }
    
    // Initialize home page functions
    if (document.querySelector('.testimonial-slide')) {
        initTestimonialSlider();
    }
    
    if (document.querySelector('.stat-number')) {
        initStatsAnimation();
    }
    
    if (document.querySelector('.hero')) {
        initParallaxEffect();
    }
});