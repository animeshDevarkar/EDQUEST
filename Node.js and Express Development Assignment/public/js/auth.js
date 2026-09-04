const Auth = (() => {
  const TOKEN_KEY = 'edquest_chat_token';
  const USER_KEY = 'edquest_chat_user';

  const modal = document.getElementById('authModal');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const authError = document.getElementById('authError');
  const btnGuest = document.getElementById('btnGuest');
  const btnLogout = document.getElementById('btnLogout');

  let currentUser = null;
  let onAuthSuccessCallback = null;

  const init = (callback) => {
    onAuthSuccessCallback = callback;
    setupEventListeners();
    checkStoredAuth();
  };

  const setupEventListeners = () => {
    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
      hideError();
    });

    tabRegister.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
      hideError();
    });

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;
      await handleAuthRequest('/api/auth/login', { username, password });
    });

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('regUsername').value.trim();
      const password = document.getElementById('regPassword').value;
      await handleAuthRequest('/api/auth/register', { username, password });
    });

    btnGuest.addEventListener('click', () => {
      const guestId = Math.floor(1000 + Math.random() * 9000);
      const guestUser = {
        username: `Guest_${guestId}`,
        avatarColor: '#10B981',
        isGuest: true
      };
      setSession(null, guestUser);
    });

    btnLogout.addEventListener('click', () => {
      logout();
    });
  };

  const showError = (msg) => {
    authError.textContent = msg;
    authError.classList.remove('hidden');
  };

  const hideError = () => {
    authError.classList.add('hidden');
    authError.textContent = '';
  };

  const handleAuthRequest = async (url, payload) => {
    hideError();
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.message || 'Authentication failed');
        return;
      }
      setSession(data.token, data.user);
    } catch (err) {
      showError('Connection error, please try again.');
    }
  };

  const setSession = (token, user) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    currentUser = user;
    modal.classList.add('hidden');

    if (onAuthSuccessCallback) {
      onAuthSuccessCallback(token, user);
    }
  };

  const checkStoredAuth = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (token) {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSession(token, data.user);
          return;
        }
      } catch (err) {
        console.warn('Failed to verify token:', err);
      }
    } else if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.isGuest) {
          setSession(null, parsed);
          return;
        }
      } catch (e) {}
    }

    // Show modal if not authenticated
    modal.classList.remove('hidden');
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    currentUser = null;
    window.location.reload();
  };

  return {
    init,
    getToken: () => localStorage.getItem(TOKEN_KEY),
    getUser: () => currentUser,
    logout
  };
})();

window.Auth = Auth;
