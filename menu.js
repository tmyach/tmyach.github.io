document.addEventListener('DOMContentLoaded', function() {
  // nav toggle
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  // close when link clicked cuz it's just convenient lol
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
    });
  });

  // year
  document.getElementById("year").textContent = new Date().getFullYear();

  // dark mode toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const storedTheme = localStorage.getItem('theme');
    
    function updateToggleIcon() {
      if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️';
        themeToggle.classList.add('dark-mode');
      } else {
        themeToggle.textContent = '🌙';
        themeToggle.classList.remove('dark-mode');
      }
    }

    if (storedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      updateToggleIcon();
    } else {
      updateToggleIcon();
    }

    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateToggleIcon();
    });
  }
});
