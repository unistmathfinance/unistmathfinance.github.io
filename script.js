// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling Function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerOffset = 70;
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Add click event listeners to navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Header Background Change on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Animated Counter for Statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Fade in animation
            if (entry.target.classList.contains('fade-in')) {
                entry.target.classList.add('visible');
            }
            
            // Counter animation
            if (entry.target.classList.contains('stat-number')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
            
            // Member card stagger animation
            if (entry.target.classList.contains('member-card')) {
                const cards = document.querySelectorAll('.member-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }

            // News items animation
            if (entry.target.classList.contains('news-item')) {
                const newsItems = document.querySelectorAll('.news-item');
                newsItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 150);
                });
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Add fade-in class and observe elements
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animations to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Observe stat numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
    
    // Observe member cards
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        if (index === 0) observer.observe(card);
    });

    // Observe news items
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
        if (index === 0) observer.observe(item);
    });

    // Initialize tabs functionality
    initializeTabs();
    
    // Initialize image upload functionality
    initializeImageUploads();
});

// Resources Tab Functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

// Image Upload Functionality
function initializeImageUploads() {
    const uploadInputs = document.querySelectorAll('input[type="file"]');
    
    uploadInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                const imgId = input.id.replace('-upload', '-img');
                const img = document.getElementById(imgId);
                const placeholder = img.nextElementSibling;
                
                reader.onload = (e) => {
                    img.src = e.target.result;
                    img.style.display = 'block';
                    if (placeholder && placeholder.classList.contains('image-placeholder')) {
                        placeholder.style.display = 'none';
                    }
                    if (placeholder && placeholder.classList.contains('news-image-placeholder')) {
                        placeholder.style.display = 'none';
                    }
                };
                
                reader.readAsDataURL(file);
                showNotification('Image uploaded successfully!', 'success');
            }
        });
    });
}

// Contact Form Handler
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Form Validation
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject) {
        errors.push('Please select a subject');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a message with at least 10 characters');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// News Article Click Handlers
document.addEventListener('DOMContentLoaded', () => {
    const newsLinks = document.querySelectorAll('.news-read-more, .news-link');
    newsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Opening article...', 'info');
            // In a real application, this would navigate to the full article
            setTimeout(() => {
                showNotification('Article opened in new tab', 'success');
            }, 1000);
        });
    });

    // Resource links
    const resourceLinks = document.querySelectorAll('.btn-resource');
    resourceLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const action = link.textContent.trim();
            showNotification(`${action}...`, 'info');
            // In a real application, this would handle the specific action
            setTimeout(() => {
                showNotification(`${action} completed`, 'success');
            }, 1500);
        });
    });

    // Member homepage links
    const memberLinks = document.querySelectorAll('.member-homepage');
    memberLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const memberName = link.closest('.member-card').querySelector('h3').textContent;
            showNotification(`Opening ${memberName}'s homepage...`, 'info');
            // In a real application, this would navigate to the member's page
        });
    });
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
        white-space: pre-line;
    `;
    
    // Set background color based on type
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'info': '#3498db',
        'warning': '#f39c12'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Allow manual dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    if (hero && scrolled < hero.offsetHeight) {
        floatingCards.forEach((card, index) => {
            const speed = 0.5 + (index * 0.1);
            card.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

// Active Navigation Link Highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active link styles
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #3498db !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Research Items Hover Effect
document.querySelectorAll('.research-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-5px)';
        item.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
    });
});

// News Card Animations
document.querySelectorAll('.news-card, .news-item').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Resource Card Animations
document.querySelectorAll('.resource-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Loading Screen (Optional)
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.remove(), 500);
    }
});

// Keyboard Navigation Support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Close any notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Tab navigation for resources
    if (e.key === '1' && e.ctrlKey) {
        e.preventDefault();
        document.querySelector('[data-tab="books"]')?.click();
    }
    
    if (e.key === '2' && e.ctrlKey) {
        e.preventDefault();
        document.querySelector('[data-tab="papers"]')?.click();
    }
});

// Print friendly styles
window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

// Add print styles
const printStyle = document.createElement('style');
printStyle.textContent = `
    @media print {
        .printing .header,
        .printing .floating-card,
        .printing .btn,
        .printing .upload-btn,
        .printing .news-sidebar {
            display: none !important;
        }
        
        .printing section {
            break-inside: avoid;
            margin-bottom: 2rem;
        }
        
        .printing {
            color: black !important;
            background: white !important;
        }
        
        .printing .member-image,
        .printing .news-image {
            background: #f0f0f0 !important;
        }
    }
`;
document.head.appendChild(printStyle);

// Lazy Loading for News Images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            // In a real application, you would load the actual image here
            imageObserver.unobserve(img);
        }
    });
});

// Observe all image placeholders for lazy loading
document.querySelectorAll('.news-image-placeholder, .image-placeholder').forEach(img => {
    imageObserver.observe(img);
});

console.log('Financial Mathematics Lab - JavaScript Loaded Successfully!');
console.log('Features: Mobile Navigation, Smooth Scrolling, Animations, Form Handling, Tab Switching, Image Uploads');


// Contact Form Handler
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Form Validation
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject) {
        errors.push('Please select a subject');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a message with at least 10 characters');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
        white-space: pre-line;
    `;
    
    // Set background color based on type
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'info': '#3498db',
        'warning': '#f39c12'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Allow manual dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    if (hero && scrolled < hero.offsetHeight) {
        floatingCards.forEach((card, index) => {
            const speed = 0.5 + (index * 0.1);
            card.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

// Active Navigation Link Highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active link styles
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #3498db !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Research Items Hover Effect
document.querySelectorAll('.research-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-5px)';
        item.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
    });
});

// Loading Screen (Optional)
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.remove(), 500);
    }
});

// Keyboard Navigation Support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Close any notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });
    }
});

// Print friendly styles
window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

// Add print styles
const printStyle = document.createElement('style');
printStyle.textContent = `
    @media print {
        .printing .header,
        .printing .floating-card,
        .printing .btn {
            display: none !important;
        }
        
        .printing section {
            break-inside: avoid;
            margin-bottom: 2rem;
        }
        
        .printing {
            color: black !important;
            background: white !important;
        }
    }
`;
document.head.appendChild(printStyle);

console.log('Financial Mathematics Lab - JavaScript Loaded Successfully!');
console.log('Features: Mobile Navigation, Smooth Scrolling, Animations, Form Handling');