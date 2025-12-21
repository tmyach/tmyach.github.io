document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  
  if (navToggle && nav) {
  
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      document.body.classList.toggle('nav-open');
    });
    
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        document.body.classList.remove('nav-open');
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.body.classList.remove('nav-open');
      }
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        document.body.classList.remove('nav-open');
      });
    });
  }
});
