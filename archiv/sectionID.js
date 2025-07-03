        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Back to top functionality
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Show/hide back to top button
        window.addEventListener('scroll', function () {
            const backToTopBtn = document.getElementById('back-to-top');
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.remove('opacity-0', 'invisible');
                backToTopBtn.classList.add('opacity-100', 'visible');
            } else {
                backToTopBtn.classList.add('opacity-0', 'invisible');
                backToTopBtn.classList.remove('opacity-100', 'visible');
            }
        });

        // Highlight active section in quick navigation
        function highlightActiveSection() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('#quick-nav a');

            let currentSection = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (pageYOffset >= sectionTop - 200) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('bg-rose-600', 'text-white');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('bg-rose-600', 'text-white');
                }
            });
        }

        window.addEventListener('scroll', highlightActiveSection);
        window.addEventListener('load', highlightActiveSection);