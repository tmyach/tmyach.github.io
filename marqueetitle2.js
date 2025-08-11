// possible tab titles
const titles = [
  "🕸 webspinner",
  "Of love, I love, you love, I love, you love, I laugh, you laugh, I move, you move, you move, and one more time with feeling",
  "sudo apt-get install sl && sl 🚂💨",
  "That's not even funny, man!",
  "Born to css, forced to VANILLA JAVASCRIPT!!!",
  "T.M. Yachimovicz"
];

// pick a random title
function pickRandomTitle(arr) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

// type anim
function typeTitleEffect(str, speed = 100, callback) {
  let index = 0;
  function type() {
    document.title = str.slice(0, index + 1);
    index++;
    if (index < str.length) {
      setTimeout(type, speed);
    } else if (callback) {
      setTimeout(callback, 500); // pause before scrolling
    }
  }
  type();
}

// scroll effect ONCE, then resets to original
function scrollTitleOnce(str, speed = 250, spacer = '     ', callback) {
  let position = 0;
  const scrollString = str + spacer;
  const totalScrolls = scrollString.length; // 1 full cycle
  function scrollStep() {
    let display = scrollString.substring(position) + scrollString.substring(0, position);
    document.title = display;
    position++;
    if (position < totalScrolls) {
      setTimeout(scrollStep, speed);
    } else if (callback) {
      setTimeout(callback, 500); // pause then reset
    }
  }
  scrollStep();
}

window.addEventListener('DOMContentLoaded', function() {
  const pickedTitle = pickRandomTitle(titles);
  typeTitleEffect(pickedTitle, 100, function() {
    // only scroll if title is long
    if (pickedTitle.length > 15) {
      scrollTitleOnce(pickedTitle, 100, '     |     ', function() {
        document.title = pickedTitle; // reset to original (end movement)
      });
    }
  });
});