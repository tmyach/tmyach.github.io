document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');

  // nav menu toggle
  if (nav && toggle) {
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      nav.classList.toggle('open');
    });

    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const themeLink = document.getElementById('theme-style');

  if (themeToggle && themeLink) {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      themeLink.href = savedTheme;
      updateButtonText(savedTheme);
    }

    // toggle text change based on theme active
    function updateButtonText(href) {
      themeToggle.textContent = href.includes('dark') ? 'Light mode' : 'Dark mode';
    }

    // Toggle stylesheet on click
    themeToggle.addEventListener('click', () => {
      const current = themeLink.getAttribute('href');
      const isLight = current.includes('light.css');
      const newTheme = isLight ? 'dark.css' : 'light.css';

      themeLink.setAttribute('href', newTheme);
      localStorage.setItem('theme', newTheme);
      updateButtonText(newTheme);
    });
  }
});
