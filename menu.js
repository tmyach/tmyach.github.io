document.addEventListener('DOMContentLoaded', function() {
  // menu toggle
  const navToggle = document.querySelector('.nav-toggle');
  const menuOverlay = document.querySelector('.menu-overlay');
  
  navToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    document.body.classList.toggle('menu-open');
  });
  
  // close on overlay
  menuOverlay.addEventListener('click', function() {
    document.body.classList.remove('menu-open');
  });
  
  // close on nav link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
      document.body.classList.remove('menu-open');
    });
  });
  
  // close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.body.classList.remove('menu-open');
    }
  });
});