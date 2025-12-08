const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");
toggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});
