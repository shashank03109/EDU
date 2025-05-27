/**
 * JavaScript for the Courses page features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Course filtering functionality
    function initCourseFilter() {
        const filterButtons = document.querySelectorAll('.course-filter .filter-btn');
        const courseCards = document.querySelectorAll('.course-card');
        
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
                
                // Filter courses
                courseCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        
                        // Add animation
                        card.classList.add('animate-fade-in');
                        setTimeout(() => {
                            card.classList.remove('animate-fade-in');
                        }, 500);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Form validation with more specific requirements
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                
                // Validate name (at least 3 characters)
                const nameInput = document.getElementById('name');
                if (nameInput.value.trim().length < 3) {
                    isValid = false;
                    showError(nameInput, 'Name must be at least 3 characters');
                } else {
                    clearError(nameInput);
                }
                
                // Validate email
                const emailInput = document.getElementById('email');
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailInput.value.trim())) {
                    isValid = false;
                    showError(emailInput, 'Please enter a valid email address');
                } else {
                    clearError(emailInput);
                }
                
                // Validate phone (optional but must be valid if provided)
                const phoneInput = document.getElementById('phone');
                if (phoneInput.value.trim() !== '') {
                    const phonePattern = /^[0-9]{10}$/;
                    if (!phonePattern.test(phoneInput.value.replace(/\D/g, ''))) {
                        isValid = false;
                        showError(phoneInput, 'Please enter a valid 10-digit phone number');
                    } else {
                        clearError(phoneInput);
                    }
                }
                
                // Validate subject
                const subjectInput = document.getElementById('subject');
                if (subjectInput.value === '') {
                    isValid = false;
                    showError(subjectInput, 'Please select a subject');
                } else {
                    clearError(subjectInput);
                }
                
                // Validate message (at least 10 characters)
                const messageInput = document.getElementById('message');
                if (messageInput.value.trim().length < 10) {
                    isValid = false;
                    showError(messageInput, 'Message must be at least 10 characters long');
                } else {
                    clearError(messageInput);
                }
                
                // If form is valid, simulate submission
                if (isValid) {
                    const submitBtn = contactForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Sending...';
                    
                    // Simulate sending (would be replaced with actual AJAX in a real app)
                    setTimeout(() => {
                        // Show success message
                        const successMessage = document.createElement('div');
                        successMessage.className = 'success-message';
                        successMessage.textContent = 'Thank you! Your message has been sent successfully.';
                        
                        // Add success message after the form
                        contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
                        
                        // Reset form
                        contactForm.reset();
                        
                        // Reset button
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        
                        // Remove success message after a delay
                        setTimeout(() => {
                            successMessage.remove();
                        }, 5000);
                    }, 1500);
                }
            });
            
            // Live validation as user types
            const inputs = contactForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    validateInput(this);
                });
                
                input.addEventListener('input', function() {
                    if (this.classList.contains('error')) {
                        validateInput(this);
                    }
                });
            });
        }
    }
    
    // Helper functions for form validation
    function showError(input, message) {
        input.classList.add('error');
        
        // Remove existing error message if any
        if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
            input.nextElementSibling.remove();
        }
        
        // Add new error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        input.parentNode.insertBefore(errorMessage, input.nextSibling);
    }
    
    function clearError(input) {
        input.classList.remove('error');
        
        // Remove error message if any
        if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
            input.nextElementSibling.remove();
        }
    }
    
    function validateInput(input) {
        switch (input.id) {
            case 'name':
                if (input.value.trim().length < 3) {
                    showError(input, 'Name must be at least 3 characters');
                } else {
                    clearError(input);
                }
                break;
                
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.value.trim())) {
                    showError(input, 'Please enter a valid email address');
                } else {
                    clearError(input);
                }
                break;
                
            case 'phone':
                if (input.value.trim() !== '') {
                    const phonePattern = /^[0-9]{10}$/;
                    if (!phonePattern.test(input.value.replace(/\D/g, ''))) {
                        showError(input, 'Please enter a valid 10-digit phone number');
                    } else {
                        clearError(input);
                    }
                } else {
                    clearError(input);
                }
                break;
                
            case 'subject':
                if (input.value === '') {
                    showError(input, 'Please select a subject');
                } else {
                    clearError(input);
                }
                break;
                
            case 'message':
                if (input.value.trim().length < 10) {
                    showError(input, 'Message must be at least 10 characters long');
                } else {
                    clearError(input);
                }
                break;
        }
    }
    
    // Initialize courses page functions
    if (document.querySelector('.course-filter')) {
        initCourseFilter();
    }
    
    initContactForm();
});