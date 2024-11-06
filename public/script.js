const API_URL = 'http://localhost:3000/api';

// Show/Hide forms
function showRegister() {
    document.getElementById('register-form').classList.add('active');
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('homepage').classList.remove('active');
}

function showLogin() {
    document.getElementById('register-form').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
    document.getElementById('homepage').classList.remove('active');
}

function showHomepage(username) {
    document.getElementById('register-form').classList.remove('active');
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('homepage').classList.add('active');
    document.getElementById('user-welcome').textContent = `Welcome, ${username}!`;
}

// Register function
async function register() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showLogin();
        } else {
            document.getElementById('register-error').textContent = data.message;
            document.getElementById('register-error').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('register-error').textContent = 'Registration failed. Please try again.';
        document.getElementById('register-error').style.display = 'block';
    }
}

// Login function
async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            showHomepage(data.username);
        } else {
            document.getElementById('login-error').textContent = data.message;
            document.getElementById('login-error').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('login-error').textContent = 'Login failed. Please try again.';
        document.getElementById('login-error').style.display = 'block';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    showLogin();
}

// Check if user is logged in on page load
window.onload = function() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
        showHomepage(username);
    } else {
        showLogin();
    }
}
