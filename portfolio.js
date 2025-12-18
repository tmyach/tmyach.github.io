document.addEventListener('DOMContentLoaded', function() {
  
  // tiles
  const tiles = document.querySelectorAll('.tile');
  
  tiles.forEach((tile, index) => {
    // Add click listener to each tile
    tile.addEventListener('click', function(e) {
      // Prevent any default behavior
      e.preventDefault();
      
      // Get the data-project attribute from the tile
      const projectPage = this.getAttribute('data-project');
      
      if (projectPage) {
        // Navigate to the project page
        window.location.href = projectPage;
      } else {
        console.warn('No data-project attribute found on tile:', index);
      }
    });
    
    tile.addEventListener('mouseenter', function() {
      // pulse
      this.style.transform = 'scale(1.02)';
    });
    
    tile.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1.03)'; // Reset to hover state from CSS
    });
  });
  
  // keyboard nav
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const focusedTile = document.activeElement;
      if (focusedTile.classList.contains('tile')) {
        focusedTile.click();
      }
    }
  });
});
