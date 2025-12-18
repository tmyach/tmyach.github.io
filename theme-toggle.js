document.addEventListener('DOMContentLoaded', () => {
  const themeLink = document.getElementById('theme-style');
  const themeToggle = document.getElementById('theme-toggle');

  // load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    themeLink.href = savedTheme;
    themeToggle.textContent = savedTheme === 'dark.css' ? 'Light mode' : 'Dark mode';
  }

  // toggle on click
  themeToggle.addEventListener('click', () => {
    const current = themeLink.getAttribute('href');
    const newTheme = current === 'light.css' ? 'dark.css' : 'light.css';
    
    themeLink.href = newTheme;
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark.css' ? 'Light mode' : 'Dark mode';
  });
});
