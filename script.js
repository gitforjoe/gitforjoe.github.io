/* ===========================
   HighPerformerNetwork — JavaScript
   Interactions, Theme Toggle & Logic
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const root = document.documentElement;

    // Restore saved theme or default to light
    const savedTheme = localStorage.getItem('hpn-theme');
    if (savedTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
    }

    const toggleTheme = () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        if (next === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        localStorage.setItem('hpn-theme', next);
    };

    themeToggle.addEventListener('click', toggleTheme);
    themeToggleMobile.addEventListener('click', toggleTheme);

    // --- Navigation ---
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect for navbar
    const handleNavScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // --- Smooth Scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll-triggered Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.style.animationDelay
                    ? parseFloat(entry.target.style.animationDelay) * 1000
                    : 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // --- Animated Stat Counters ---
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 1800;
        const steps = 50;
        const stepDuration = duration / steps;
        let current = 0;
        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepDuration);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElements = entry.target.querySelectorAll('.stat-number[data-target]');
                statElements.forEach(el => animateCounter(el));
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // --- Firebase Initialization ---
    const firebaseConfig = {
        apiKey: "AIzaSyDcZKBXHaL_sQmKwKiexaX69jQ028qpUqg",
        authDomain: "hpn-project-da088.firebaseapp.com",
        projectId: "hpn-project-da088",
        storageBucket: "hpn-project-da088.firebasestorage.app",
        messagingSenderId: "414937667806",
        appId: "1:414937667806:web:d65eafb25c7459631f8a4f"
    };
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    // --- Contact Form → Firebase Lead Storage ---
    window.handleSubmit = async (e) => {
        e.preventDefault();

        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');

        // Collect form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const company = document.getElementById('company').value.trim();
        const message = document.getElementById('message').value.trim();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';

        // Build lead object
        const lead = {
            name: name,
            email: email,
            company: company || 'Not specified',
            message: message,
            status: 'new',
            timestamp: new Date().toISOString()
        };

        try {
            // Save to Firestore
            await db.collection('leads').add(lead);

            // Show success
            setTimeout(() => {
                form.innerHTML = `
                    <div class="form-success">
                        <div class="success-icon">✓</div>
                        <h3>Message Sent</h3>
                        <p>Thanks for reaching out. Joe and Lenny will get back to you within 24 hours.</p>
                    </div>
                `;
            }, 1200);
        } catch (error) {
            console.error("Error adding document: ", error);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            submitBtn.style.opacity = '1';
            alert('There was an error sending your message. Please try again.');
        }
    };

    // --- ROI Calculator ---
    const teamSizeSlider = document.getElementById('teamSize');
    const manualHoursSlider = document.getElementById('manualHours');
    const hourlyWageSlider = document.getElementById('hourlyWage');

    if (teamSizeSlider && manualHoursSlider && hourlyWageSlider) {
        const EFFICIENCY_GAIN = 0.40; // 40% automation rate

        const teamSizeDisplay = document.getElementById('teamSizeValue');
        const manualHoursDisplay = document.getElementById('manualHoursValue');
        const hourlyWageDisplay = document.getElementById('hourlyWageValue');
        const hoursSavedOutput = document.getElementById('roiHoursSaved');
        const costSavedOutput = document.getElementById('roiCostSaved');
        const summaryOutput = document.getElementById('roiSummary');

        const formatNumber = (num) => num.toLocaleString('en-US');

        const calculateROI = () => {
            const team = parseInt(teamSizeSlider.value);
            const hours = parseInt(manualHoursSlider.value);
            const wage = parseInt(hourlyWageSlider.value);

            // Update slider labels
            teamSizeDisplay.textContent = team + (team === 1 ? ' employee' : ' employees');
            manualHoursDisplay.textContent = hours + ' hrs';
            hourlyWageDisplay.textContent = '$' + wage;

            // Calculate
            const weeklyManualHoursTotal = team * hours;
            const annualManualHours = weeklyManualHoursTotal * 52;
            const annualHoursSaved = Math.round(annualManualHours * EFFICIENCY_GAIN);
            const annualCostSaved = Math.round(annualHoursSaved * wage);

            // Animate output values
            hoursSavedOutput.textContent = formatNumber(annualHoursSaved);
            costSavedOutput.textContent = '$' + formatNumber(annualCostSaved);

            // Pop animation
            hoursSavedOutput.classList.remove('updated');
            costSavedOutput.classList.remove('updated');
            void hoursSavedOutput.offsetWidth; // trigger reflow
            hoursSavedOutput.classList.add('updated');
            costSavedOutput.classList.add('updated');

            // Update summary text
            summaryOutput.innerHTML = `By automating <strong>40%</strong> of your team's manual workload, you could save an estimated <strong>${formatNumber(annualHoursSaved)} hours</strong> and <strong>$${formatNumber(annualCostSaved)}</strong> per year.`;

            // Store for CTA use
            window._roiData = { team, hours, wage, annualHoursSaved, annualCostSaved };
        };

        teamSizeSlider.addEventListener('input', calculateROI);
        manualHoursSlider.addEventListener('input', calculateROI);
        hourlyWageSlider.addEventListener('input', calculateROI);

        // Initial calculation
        calculateROI();

        // CTA button → auto-fill contact form and scroll
        const roiCtaBtn = document.getElementById('roiCtaBtn');
        if (roiCtaBtn) {
            roiCtaBtn.addEventListener('click', () => {
                const d = window._roiData;
                const autoMessage = `Hi Joe & Lenny,\n\nOur team of ${d.team} spends around ${d.hours} hours/week per person on manual tasks. Based on your ROI calculator, we could potentially save ${formatNumber(d.annualHoursSaved)} hours and $${formatNumber(d.annualCostSaved)} annually through AI automation.\n\nWe'd love to discuss how HighPerformerNetwork can help us scale.`;

                const messageField = document.getElementById('message');
                if (messageField) {
                    messageField.value = autoMessage;
                }

                // Scroll to contact
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    const navHeight = navbar.offsetHeight;
                    const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Focus the name field after scroll
                    setTimeout(() => {
                        const nameField = document.getElementById('name');
                        if (nameField) nameField.focus();
                    }, 800);
                }
            });
        }
    }

    // --- Active nav link highlighting ---
    const sections = document.querySelectorAll('section[id]');

    const highlightNav = () => {
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

});
