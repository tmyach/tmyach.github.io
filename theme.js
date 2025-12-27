const select = document.getElementById("theme-select");
const html = document.documentElement;

function setTheme(value) {
  html.setAttribute("data-theme", value);
  localStorage.setItem("theme", value);
}

select.addEventListener("change", (e) => setTheme(e.target.value));

const saved = localStorage.getItem("theme") || "dark";
setTheme(saved);
select.value = saved;