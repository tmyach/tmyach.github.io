// initLayout() is called once the DOM (the HTML content of your website) has been loaded.
document.addEventListener("DOMContentLoaded", function () {
  // The layout will be loaded on all pages that do NOT have the "no-layout" class in the <body> element.
  if (document.body.classList.contains("no-layout")) return;

  // Inserting your header and footer:
  document.body.insertAdjacentHTML("afterbegin", headerEl);
  document.body.insertAdjacentHTML("beforeend", footerEl);

  // Other initializations:
  initActiveLinks();

  // your code here...
});

/* ********************************* */

/**
 *  F U N C T I O N S
 */

function initActiveLinks() {
  // This function adds the class "active" to any link that links to the current page.
  // This is helpful for styling the active menu item.

  const pathname = window.location.pathname;
  [...document.querySelectorAll("a")].forEach((el) => {
    const elHref = el.getAttribute("href").replace(".html", "").replace("/public", "");

    if (pathname == "/") {
      // homepage
      if (elHref == "/" || elHref == "/index.html") el.classList.add("active");
    } else {
      // other pages
      if (window.location.href.includes(elHref)) el.classList.add("active");
    }
  });
}

function getNestingString() {
  // This function prepares the "nesting" variable for your header and footer (see below).
  // Only change this function if you know what you're doing.
  const currentUrl = window.location.href.replace("http://", "").replace("https://", "").replace("/public/", "/");
  const numberOfSlahes = currentUrl.split("/").length - 1;
  if (numberOfSlahes == 1) return ".";
  if (numberOfSlahes == 2) return "..";
  return ".." + "/..".repeat(numberOfSlahes - 2);
}

/* ********************************* */

/**
 *  H T M L
 */

const nesting = getNestingString();

/**
  Use ${nesting} to output a . or .. or ../.. etc according to the current page's folder depth.
  Example:
    <img src="${nesting}/images/example.jpg" />
  will output
  	 <img src="./images/example.jpg" /> on a page that isn't in any folder.
    <img src="../images/example.jpg" /> on a page that is in a folder.
    <img src="../../images/example.jpg" /> on a page that is in a sub-folder.
    etc.
 */

// Insert your header HTML inside these ``. You can use HTML as usual. 
// You don't need to use the <header> element, but I recommend it.
const headerEl = `
<header class="header">
        <!-- logo -->
        <a class="logo" href="index.html">
          <img src="logo.png" alt="t.m.yach bird logo" class="logo-img" />
          <div class="logo-text">
            <span class="logo-main">t.m.yach</span>
            <span class="logo-tag">The Bird's Eye View</span>
          </div>
        </a>

        <!-- mobile menu fixed -->
        <nav class="nav">
          <button class="nav-toggle" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
          <ul class="nav-list">
            <li><a href="index.html" class="nav-link">home</a></li>
            <li><a href="blog.html" class="nav-link">blog</a></li>
            <li><a href="microblog.html" class="nav-link">microblog</a></li>
            <li><a href="gallery.html" class="nav-link">gallery</a></li>
            <li><a href="contact.html" class="nav-link">contact</a></li>
          </ul>
        </nav>
      </header>

      <aside class="side">
            <div class="block">
              <h2 class="title">Field Notes</h2>
              <ul class="list">
                <li>
                  Right now, I feel
                  <a href="https://www.imood.com/users/tmyach" class="imood">
                    <img src="https://moods.imood.com/display/uname-tmyach/trans-1/imood.gif" alt="The current mood of tmyach at www.imood.com" border="0" />
                  </a>.
                </li>
                <li>
                  The internet currently feels
                  <a href="https://www.imood.com/imood" class="imood">
                    <img src="https://moods.imood.com/internet/current.gif" alt="The current mood of the Internet at www.imood.com" border="0" />
                  </a>.
                </li>
              </ul>
            </div>

            <div class="block">
              <h2 class="title">Current Thoughts</h2>
              <ul class="list">
                <li>Rotting corpses SHOULD run for President - NYT OpEd <span class="date">(12/2025)</span></li>
                <li>The right to privacy isn't explicitly written in the Constitution. Maybe we should change that. <span class="date">(12/2025)</span></li>
                <li>Stephen Miller = Lex Luthor??? <span class="date">(12/2025)</span></li>
              </ul>
            </div>

            <!-- music player -->
            <div class="player">
              <div id="nowplaying" class="now">now playing 1 of 4</div>
              <div class="player-video-marquee">
                <div class="tv-container">
                  <div id="video-player" class="tv-screen"></div>
                  <img src="blue-tv-shadow.png" alt="tv" class="tv-frame" />
                </div>
                <marquee id="info" class="track-title" scrollamount="5">Artist - Track Name</marquee>
              </div>
              <div class="time-bar">
                <div id="current-time" class="time">0:00</div>
                <div class="bar">
                  <input type="range" id="slider" min="0" max="100" value="0" step="1" />
                </div>
                <div id="duration" class="time">0:00</div>
              </div>
              <div class="controls">
                <button id="prev-btn" type="button">⏮</button>
                <button id="playpause-btn" type="button">▶</button>
                <button id="next-btn" type="button">⏭</button>
              </div>
            </div>
          </aside>
`;

// Insert your footer HTML inside these ``. You can use HTML as usual. 
// You don't need to use the <footer> element, but I recommend it.
const footerEl = `
	<footer class="footer">
        <span><span id="year"></span> | t.m.yach, the bird's eye view</span>
        <button id="theme-toggle" class="nav-link theme-toggle" type="button" aria-label="Toggle mode">
          Toggle modes
        </button>
      </footer>
`;