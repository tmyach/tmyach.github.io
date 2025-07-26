//drag

const modal = document.getElementById("notice");
const dialog = modal.querySelector(".modal-dialog");
let isDragging = false;
let offsetX, offsetY;

dialog.style.position = "absolute";  // Make dialog position absolute for dragging

dialog.addEventListener('mousedown', function(e) {
  isDragging = true;
  offsetX = e.clientX - dialog.getBoundingClientRect().left;
  offsetY = e.clientY - dialog.getBoundingClientRect().top;
  document.body.style.userSelect = 'none'; // prevent text selection while dragging
});

document.addEventListener('mousemove', function(e) {
  if (isDragging) {
    let left = e.clientX - offsetX;
    let top = e.clientY - offsetY;

    // Optional boundary limits (prevent dragging off screen)
    left = Math.max(0, Math.min(left, window.innerWidth - dialog.offsetWidth));
    top = Math.max(0, Math.min(top, window.innerHeight - dialog.offsetHeight));

    dialog.style.left = left + "px";
    dialog.style.top = top + "px";
  }
});

document.addEventListener('mouseup', function() {
  isDragging = false;
  document.body.style.userSelect = 'auto';
});

//close pop-up, do not reopen within 7 days

var cookieProName = "real",
    allCookies = document.cookie,
    cookieArray = allCookies.split("; ");

if ($.inArray("name=real", cookieArray) === -1) {
    $("#notice").modal({
        backdrop: 'static',
        keyboard: false
    });

    $("#notice .btn-primary").on("click", function (e) {
        e.preventDefault();
        Cookies.set("name", cookieProName, { expires: 7 });
        $("#notice").modal('hide');
    });
}
