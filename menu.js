 <script>
      document.addEventListener('DOMContentLoaded', function() {
        const nav = document.querySelector(".nav");
        const toggle = document.querySelector(".nav-toggle");

        if (nav && toggle) {
          toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            nav.classList.toggle("open");
          });

          document.addEventListener("click", (e) => {
            if (!nav.contains(e.target)) nav.classList.remove("open");
          });

          document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => nav.classList.remove("open"));
          });
        }

        document.getElementById("year").textContent = new Date().getFullYear();

        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
          const storedTheme = localStorage.getItem('theme');
          function updateToggleIcon() {
            themeToggle.textContent = document.body.classList.contains('dark-mode') ? 'light mode' : 'dark mode';
          }

          if (storedTheme === 'dark') document.body.classList.add('dark-mode');
          updateToggleIcon();

          themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
            updateToggleIcon();
          });
        }
      });