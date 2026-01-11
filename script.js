'use strict';

/**
 * navbar toggle
 */
const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

for (let i = 0; i < navToggler.length; i++) {
  navToggler[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.style.overflow = navbar.classList.contains("active") ? "hidden" : "auto";
  });
}

for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function () {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "auto";
  });
}

/**
 * header
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

/**
 * Mobile Call Button Animation
 */
const mobileCallBtn = document.querySelector('.mobile-call-btn');
if (mobileCallBtn) {
  mobileCallBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Add click animation
    this.style.transform = 'scale(0.9)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 200);
    
    // Open phone app after animation
    setTimeout(() => {
      window.location.href = 'tel:+918433667514';
    }, 300);
  });
  
  // Add pulse animation
  setInterval(() => {
    mobileCallBtn.style.boxShadow = '0 0 0 0 rgba(242, 86, 35, 0.7)';
    mobileCallBtn.style.animation = 'none';
    
    setTimeout(() => {
      mobileCallBtn.style.animation = 'pulse 2s infinite';
    }, 10);
  }, 4000);
}

// Add pulse animation style
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(242, 86, 35, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(242, 86, 35, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(242, 86, 35, 0);
    }
  }
`;
document.head.appendChild(style);

/**
 * Enhanced Slider
 */
class Slider {
  constructor() {
    this.track = document.querySelector('.slider-track');
    this.slides = document.querySelectorAll('.slide');
    this.dots = document.querySelectorAll('.dot');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.progressBar = document.querySelector('.slider-progress');
    this.currentIndex = 0;
    this.slideInterval = null;
    this.isPaused = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }
  
  init() {
    // Event Listeners
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Dots navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Auto slide
    this.startAutoSlide();
    
    // Pause on hover
    const sliderContainer = this.track.parentElement;
    sliderContainer.addEventListener('mouseenter', () => this.pauseSlider());
    sliderContainer.addEventListener('mouseleave', () => this.resumeSlider());
    sliderContainer.addEventListener('touchstart', () => this.pauseSlider());
    sliderContainer.addEventListener('touchend', () => this.resumeSlider());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        this.isPaused ? this.resumeSlider() : this.pauseSlider();
      }
    });
    
    // Touch support
    this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.track.addEventListener('touchend', () => this.handleTouchEnd());
    
    // Update slider on window resize
    window.addEventListener('resize', () => this.updateSlider());
  }
  
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
  }
  
  handleTouchMove(e) {
    this.touchEndX = e.touches[0].clientX;
  }
  
  handleTouchEnd() {
    const diff = this.touchStartX - this.touchEndX;
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
    
    this.touchStartX = 0;
    this.touchEndX = 0;
  }
  
  updateSlider() {
    // Update track position
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    
    // Update active classes
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentIndex);
    });
    
    // Update dots
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
    
    // Reset progress bar
    this.resetProgressBar();
  }
  
  resetProgressBar() {
    if (this.progressBar) {
      this.progressBar.classList.remove('active');
      void this.progressBar.offsetWidth; // Trigger reflow
      this.progressBar.classList.add('active');
    }
  }
  
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlider();
  }
  
  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlider();
  }
  
  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlider();
  }
  
  startAutoSlide() {
    this.stopAutoSlide();
    this.slideInterval = setInterval(() => this.nextSlide(), 5000);
    this.resetProgressBar();
  }
  
  stopAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
    if (this.progressBar) {
      this.progressBar.classList.remove('active');
    }
  }
  
  pauseSlider() {
    this.isPaused = true;
    this.stopAutoSlide();
  }
  
  resumeSlider() {
    this.isPaused = false;
    this.startAutoSlide();
  }
}

/**
 * Initialize when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize slider
  const slider = new Slider();
  
  // Add scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Animate feature boxes with delay
        if (entry.target.classList.contains('logistics-features')) {
          const featureBoxes = entry.target.querySelectorAll('.feature-box');
          featureBoxes.forEach((box, index) => {
            setTimeout(() => {
              box.classList.add('animate-in');
            }, index * 200);
          });
        }
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  document.querySelectorAll('.logistics-highlight, .feature-box, .service-card').forEach(el => {
    observer.observe(el);
  });
  
  // Add smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#' || href === '#top') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        // Close mobile menu if open
        if (navbar.classList.contains('active')) {
          navbar.classList.remove('active');
          overlay.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
        
        // Scroll to target
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Newsletter form submission
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('.email-field').value;
      
      if (email && email.includes('@')) {
        // Show success message
        const submitBtn = this.querySelector('.newsletter-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Subscribed!';
        submitBtn.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
          this.reset();
        }, 3000);
      }
    });
  }
  
  // Add loading animation for images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('load', function() {
      this.classList.add('loaded');
    });
  });
});

/**
 * Add CSS for animations
 */
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  .animate-in {
    animation: fadeInUp 0.6s ease forwards;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  img.loaded {
    animation: fadeIn 0.5s ease forwards;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .feature-box.animate-in {
    animation-delay: calc(var(--index, 0) * 0.2s);
  }
`;
document.head.appendChild(animationStyles);

        // Newsletter Form Submission
        document.getElementById('newsletterForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('.newsletter-input');
            const submitBtn = this.querySelector('.newsletter-btn');
            const originalBtnText = submitBtn.textContent;
            
            // Simple email validation
            const email = emailInput.value;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }, 1500);
        });