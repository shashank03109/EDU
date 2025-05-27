/**
 * Main JavaScript file for common functionality
 */

// Check if element exists before operating on it
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

// Utility function to check if an element exists
function elementExists(selector) {
    return document.querySelector(selector) !== null;
}

// Debounce function to limit function calls
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

// Add animation class to element when it enters viewport
function animateOnScroll() {
    const elements = $$('.animate');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 50) {
            element.classList.add('animate-active');
        }
    });
}

// Initialize animations
function initAnimations() {
    if ($$('.animate').length > 0) {
        window.addEventListener('scroll', debounce(animateOnScroll, 10));
        animateOnScroll(); // Initial check
    }
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            // Add error message if it doesn't exist
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = `${input.getAttribute('placeholder') || 'This field'} is required`;
                input.parentNode.insertBefore(errorMessage, input.nextSibling);
            }
        } else {
            input.classList.remove('error');
            if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
                input.nextElementSibling.remove();
            }
        }
        
        // Email validation
        if (input.type === 'email' && input.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value.trim())) {
                isValid = false;
                input.classList.add('error');
                
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Please enter a valid email address';
                    input.parentNode.insertBefore(errorMessage, input.nextSibling);
                }
            }
        }
    });
    
    return isValid;
}

// Initialize form validation
function initFormValidation() {
    const forms = $$('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Simulate form submission
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                setTimeout(() => {
                    submitBtn.textContent = 'Success!';
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = 'Your message has been sent successfully!';
                    this.appendChild(successMessage);
                    
                    // Reset form
                    setTimeout(() => {
                        this.reset();
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        successMessage.remove();
                    }, 3000);
                }, 1500);
            }
        });
    });
}

// Document ready
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initFormValidation();
    
    // Add any global event listeners or initializations here
});