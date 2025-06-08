// Get the window element
let windowElement = document.getElementById('window');

// Variables to store the initial position of the mouse and window
let initialMouseX, initialMouseY, initialWindowX, initialWindowY;

// Flag to track if the window is maximized
let isMaximized = false;

// Function to handle the mousemove event
function handleMouseMove(event) {
  // Check if the window is maximized or not dragging the bar, and return if true
  if (isMaximized) {
    return;
  }

  // Calculate the new position of the window based on the initial position and the mouse movement
  let newX = initialWindowX + event.clientX - initialMouseX;
  let newY = initialWindowY + event.clientY - initialMouseY;

  // Get the window boundaries
  let windowLeft = 0;
  let windowTop = 0;
  let windowRight = window.innerWidth - windowElement.offsetWidth;
  let windowBottom = window.innerHeight - windowElement.offsetHeight;

  // Limit the new position within the window boundaries
  newX = Math.max(windowLeft, Math.min(newX, windowRight));
  newY = Math.max(windowTop, Math.min(newY, windowBottom));

  // Update the position of the window
  windowElement.style.left = `${newX}px`;
  windowElement.style.top = `${newY}px`;
}

// Function to handle the mousedown event
function handleMouseDown(event) {
  // Store the initial position of the mouse and window
  initialMouseX = event.clientX;
  initialMouseY = event.clientY;
  initialWindowX = windowElement.offsetLeft;
  initialWindowY = windowElement.offsetTop;

  // Attach the mousemove and mouseup event listeners to the document
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

// Function to handle the mouseup event
function handleMouseUp() {
  // Remove the mousemove and mouseup event listeners from the document
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
}

// Attach the mousedown event listener to the window bar element
let barElement = document.getElementById('bar');
barElement.addEventListener('mousedown', handleMouseDown);

// Get the maximize button element and attach the click event listener
const maximize = document.getElementById('maximize');
let prevWinPos = {};
let autoResize;

// Function to handle the maximize and restore functionality
function maximizeRestore() {
  isMaximized = !isMaximized;

  if (isMaximized) {
    // Store the current window position and size
    prevWinPos['x'] = windowElement.offsetLeft;
    prevWinPos['y'] = windowElement.offsetTop;
    prevWinPos['height'] = windowElement.offsetHeight;
    prevWinPos['width'] = windowElement.offsetWidth;

    // Maximize the window
    windowElement.style.transition = '200ms';
    windowElement.style.transitionProperty = 'width, height, top, left, border-radius';
    windowElement.style.resize = 'none';
    windowElement.style.width = `${window.innerWidth}px`;
    windowElement.style.height = `${window.innerHeight}px`;
    windowElement.style.borderRadius = 0;
    windowElement.style.border = 'none';
    windowElement.style.left = 0;
    windowElement.style.top = 0;

    autoResize = () => { // Store reference to the callback function
      windowElement.style.width = `${window.innerWidth}px`;
      windowElement.style.height = `${window.innerHeight}px`;
    };

    window.addEventListener('resize', autoResize);
  } else {
    // Restore the window to its previous position and size
    windowElement.style.width = `${prevWinPos.width}px`;
    windowElement.style.height = `${prevWinPos.height}px`;
    windowElement.style.left = `${prevWinPos.x}px`;
    windowElement.style.top = `${prevWinPos.y}px`;
    windowElement.style.removeProperty('border-radius');
    windowElement.style.removeProperty('border');
    windowElement.style.removeProperty('resize');

    window.removeEventListener('resize', autoResize); // Remove the event listener

    setTimeout(() => {
      windowElement.style.removeProperty('transition');
      windowElement.style.removeProperty('transition-property');
    }, 200);
  }
}

maximize.addEventListener('click', maximizeRestore);
barElement.addEventListener('dblclick', maximizeRestore);


//shake icon

// Array to track shaking elements
var shakingElements = []

// Total number of shakes (there will be 1 shake per frame)
var numberOfShakes = 15

// Capture the element's position and angle to restore them after shaking
var startX = 0,
  startY = 0

// Divide the magnitude into 10 units so we can reduce the amount of shake by 10% each frame
var magnitudeUnit = 20 / numberOfShakes // Here 20 is the maximum magnitude of shaking

// Random integer helper function
var randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Add the element to the `shakingElements` array if it's not already there
function shake(element) {
  // Reset the element's state each time it's clicked
  var counter = 1 // Reset the counter for new shakes

  // Function to execute the shake animation
  function upAndDownShake() {
    // Shake the element while the counter is less than the total number of shakes
    if (counter < numberOfShakes) {
      // Randomly change the element's position
      var randomX = randomInt(-magnitudeUnit * 10, magnitudeUnit * 10)
      var randomY = randomInt(-magnitudeUnit * 10, magnitudeUnit * 10)

      // Apply the random translation to create the shaking effect
      element.style.transform =
        "translate(" + randomX + "px, " + randomY + "px)"

      // Increase the counter
      counter += 1

      // Continue the shake animation frame by frame
      requestAnimationFrame(upAndDownShake)
    }

    // When shaking is finished, restore the element to its original position
    if (counter >= numberOfShakes) {
      element.style.transform = "translate(" + startX + "px, " + startY + "px)"
    }
  }

  // Start the shaking animation
  upAndDownShake()
}

// Add event listener to shake the element on click
document.querySelector("#close").addEventListener("click", (e) => {
  shake(e.currentTarget)
})
