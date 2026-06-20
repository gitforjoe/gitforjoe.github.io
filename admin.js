/* ===========================
   HighPerformerNetwork — Admin JS
   Basic Client-Side Auth & Dashboard Logic
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const loginForm = document.getElementById('adminLoginForm');
    const errorMsg = document.getElementById('errorMsg');
    const adminNameDisplay = document.getElementById('adminNameDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const root = document.documentElement;

    // --- Theme Logic for Admin Page ---
    const adminThemeToggle = document.getElementById('adminThemeToggle');
    const sunIcon = adminThemeToggle.querySelector('.icon-sun');
    const moonIcon = adminThemeToggle.querySelector('.icon-moon');

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            root.removeAttribute('data-theme');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    };

    const savedTheme = localStorage.getItem('hpn-theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    adminThemeToggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('hpn-theme', next);
    });

    // --- Authentication Logic ---
    
    // Check if already logged in (sessionStorage)
    const activeAdmin = sessionStorage.getItem('hpn-admin-user');
    if (activeAdmin) {
        showDashboard(activeAdmin);
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value;

        // Valid credentials
        const validPassword = 'hpn44';
        const validUsers = [
            'Joe Administrator',
            'Azuko Administrator',
            'Joe',   // fallback
            'Azuko'  // fallback
        ];

        // Validate
        const isUserValid = validUsers.some(user => user.toLowerCase() === usernameInput.toLowerCase());
        
        if (isUserValid && passwordInput === validPassword) {
            // Success
            errorMsg.style.display = 'none';
            
            // Format name nicely based on input
            let displayName = usernameInput.split(' ')[0]; // Gets 'Joe' or 'Azuko'
            // Capitalize first letter
            displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1).toLowerCase();
            
            sessionStorage.setItem('hpn-admin-user', displayName);
            showDashboard(displayName);
        } else {
            // Failure
            errorMsg.style.display = 'block';
            // Shake animation for error
            loginForm.style.animation = 'shake 0.4s ease-in-out';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 400);
        }
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('hpn-admin-user');
        loginScreen.style.display = 'flex';
        dashboardScreen.style.display = 'none';
        document.getElementById('password').value = '';
    });

    function showDashboard(name) {
        loginScreen.style.display = 'none';
        dashboardScreen.style.display = 'block';
        adminNameDisplay.textContent = name;
    }

    // Add keyframes for shake animation dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            50% { transform: translateX(8px); }
            75% { transform: translateX(-8px); }
        }
    `;
    document.head.appendChild(style);
});
