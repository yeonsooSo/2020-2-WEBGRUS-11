const toggleBtn = document.querySelector(".navbar__toggleBtn");
const menu = document.querySelector(".navbar__menu");
const login = document.querySelector(".navbar__login");

toggleBtn.addEventListener("click", () => {
  menu.classList.toggle("active");
  login.classList.toggle("active");
});

function check() {
  if (confirm("예약을 취소하시겠습니까?")) {
    alert("예약이 취소되었습니다.");
  } else {
  }
}
