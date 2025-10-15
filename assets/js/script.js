// YoshCasaster

// codefomo.xyz
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
      
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active') && 
            !navLinks.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            navLinks.classList.remove('active');

            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

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
 
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });


    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.slide-up, .fade-in').forEach(element => {
        observer.observe(element);
    });
});


document.head.insertAdjacentHTML('beforeend', `
<style>
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            width: 100%;
            background-color: white;
            flex-direction: column;
            padding: 1rem 0;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
            transform: translateY(-150%);
            transition: transform 0.3s ease;
            z-index: 99;
        }
        
        .nav-links.active {
            transform: translateY(0);
            display: flex;
        }
        
        .nav-links li {
            margin: 1rem 0;
            text-align: center;
        }
    }
    
    .slide-up, .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .slide-up.visible, .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
</style>
`);
