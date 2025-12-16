// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');
const statNumbers = document.querySelectorAll('.stat-number');
const seeMoreBtn = document.getElementById('seeMoreBtn');
const moreProjects = document.getElementById('moreProjects');

// Typewriter Animation for Name
const typewriterText = document.querySelector('.typewriter-text');
const name = "Jacob";
let charIndex = 0;
let isDeleting = false;
let isEnd = false;

function typeWriter() {
    const currentText = name.substring(0, charIndex);
    typewriterText.textContent = currentText;
    
    if (!isDeleting && charIndex < name.length) {
        // Typing forward
        charIndex++;
        setTimeout(typeWriter, 150);
    } else if (isDeleting && charIndex > 0) {
        // Deleting
        charIndex--;
        setTimeout(typeWriter, 100);
    } else if (!isDeleting && charIndex === name.length) {
        // Pause at the end
        isEnd = true;
        setTimeout(() => {
            isDeleting = true;
            typeWriter();
        }, 1500);
    } else if (isDeleting && charIndex === 0) {
        // Restart
        isDeleting = false;
        isEnd = false;
        setTimeout(typeWriter, 500);
    }
}

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.querySelector('i').classList.toggle('fa-bars');
    menuToggle.querySelector('i').classList.toggle('fa-times');
});

// Close mobile menu when clicking on a nav link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.querySelector('i').classList.add('fa-bars');
        menuToggle.querySelector('i').classList.remove('fa-times');
    });
});

// Animate stats counting up
const animateStats = () => {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        
        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.floor(current);
                setTimeout(updateCount, 20);
            } else {
                stat.textContent = target;
            }
        };
        
        updateCount();
    });
};

// Check if element is in viewport
const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9
    );
};

// Handle scroll events for animations
const handleScrollAnimations = () => {
    // Stats animation
    const statsSection = document.querySelector('.about-stats');
    if (statsSection && isInViewport(statsSection)) {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            if (!stat.classList.contains('animated')) {
                stat.classList.add('animated');
                animateStats();
            }
        });
    }
    
    // Header background on scroll
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(10, 14, 23, 0.95)';
        header.style.padding = '15px 0';
    } else {
        header.style.backgroundColor = 'rgba(10, 14, 23, 0.9)';
        header.style.padding = '20px 0';
    }
};

// Toggle more projects visibility
if (seeMoreBtn && moreProjects) {
    seeMoreBtn.addEventListener('click', () => {
        moreProjects.classList.toggle('active');
        seeMoreBtn.classList.toggle('active');
        
        // Change button text
        const buttonText = seeMoreBtn.querySelector('span');
        const buttonIcon = seeMoreBtn.querySelector('i');
        
        if (moreProjects.classList.contains('active')) {
            buttonText.textContent = 'Show Less Projects';
            buttonIcon.className = 'fas fa-chevron-up';
            
            // Scroll to the newly shown projects
            setTimeout(() => {
                moreProjects.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        } else {
            buttonText.textContent = 'See More Projects';
            buttonIcon.className = 'fas fa-chevron-down';
        }
    });
}

// Create website previews from links using Microlink API
const createWebsitePreviews = () => {
    const projects = [
        {
            id: 'preview-1',
            url: 'https://e-com-brown-ten-99.vercel.app/',
            fallbackColor: '#1a1a2e'
        },
        {
            id: 'preview-2',
            url: 'https://neon-dsgn.vercel.app/',
            fallbackColor: '#0f3460'
        },
        {
            id: 'preview-3',
            url: 'https://fitness-flow-eight.vercel.app/',
            fallbackColor: '#16213e'
        },
        {
            id: 'preview-4',
            url: 'https://landing-pro-pi.vercel.app/',
            fallbackColor: '#1a1a2e'
        }
    ];
    
    // Alternative screenshot services if Microlink doesn't work
    const screenshotServices = [
        // Microlink API (free tier)
        (url) => `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`,
        
        // ScreenshotAPI.net (requires API key but has free tier)
        // (url) => `https://screenshotapi.net/api/v1/screenshot?url=${encodeURIComponent(url)}&token=YOUR_API_KEY`,
        
        // Placeholder for actual screenshots you can upload
        (url, projectName) => {
            // Fallback to Unsplash images based on project type
            const images = {
                'e-com': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                'neon': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                'fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                'landing': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            };
            
            // Try to match project type
            for (const [key, imageUrl] of Object.entries(images)) {
                if (url.includes(key)) {
                    return imageUrl;
                }
            }
            
            // Default fallback
            return 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
        }
    ];
    
    projects.forEach((project, index) => {
        const previewElement = document.getElementById(project.id);
        if (!previewElement) return;
        
        // Try to load screenshot from API
        const apiUrl = screenshotServices[0](project.url);
        
        // Create image element to test if the URL loads
        const testImage = new Image();
        testImage.onload = function() {
            // If image loads successfully, use it
            previewElement.style.backgroundImage = `url('${apiUrl}')`;
            previewElement.querySelector('.preview-loading').style.display = 'none';
        };
        
        testImage.onerror = function() {
            // If API fails, use fallback
            console.log(`Screenshot API failed for ${project.url}, using fallback`);
            const fallbackUrl = screenshotServices[2](project.url, project.id);
            previewElement.style.backgroundImage = `url('${fallbackUrl}')`;
            previewElement.style.backgroundColor = project.fallbackColor;
            previewElement.querySelector('.preview-loading').style.display = 'none';
            
            // Add a note that this is a placeholder
            const placeholderNote = document.createElement('div');
            placeholderNote.className = 'placeholder-note';
            placeholderNote.innerHTML = '<small>Website preview placeholder</small>';
            previewElement.appendChild(placeholderNote);
        };
        
        // Set timeout in case image takes too long
        setTimeout(() => {
            if (previewElement.querySelector('.preview-loading').style.display !== 'none') {
                testImage.onerror();
            }
        }, 5000);
        
        // Start loading the image
        testImage.src = apiUrl;
    });
};

// Email copy functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add click tracking for analytics (optional)
    const gmailBtn = document.querySelector('.gmail-btn');
    if (gmailBtn) {
        gmailBtn.addEventListener('click', function() {
            console.log('Gmail compose button clicked');
        });
    }
    
    // Add copy email to clipboard functionality
    const emailElements = document.querySelectorAll('.contact-item span');
    emailElements.forEach(emailElement => {
        if (emailElement.textContent.includes('@')) {
            emailElement.addEventListener('click', function() {
                const email = this.textContent;
                navigator.clipboard.writeText(email).then(() => {
                    // Show a temporary notification
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    this.style.color = 'var(--primary-color)';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.color = '';
                    }, 2000);
                });
            });
            
            // Add cursor pointer to indicate it's clickable
            emailElement.style.cursor = 'pointer';
            emailElement.title = 'Click to copy email address';
        }
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start typewriter animation
    setTimeout(typeWriter, 1000);
    
    // Create website previews
    createWebsitePreviews();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Trigger scroll once to check initial positions
    handleScrollAnimations();
    
    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Add hover effect to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add hover effect to website previews
    const previewScreens = document.querySelectorAll('.preview-screen');
    previewScreens.forEach(screen => {
        if (!screen.classList.contains('preview-coming-soon')) {
            screen.addEventListener('mouseenter', function() {
                this.style.backgroundPosition = 'bottom center';
            });
            
            screen.addEventListener('mouseleave', function() {
                this.style.backgroundPosition = 'top center';
            });
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});