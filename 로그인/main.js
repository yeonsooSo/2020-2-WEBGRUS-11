const toggleBtn = document.querySelector(".navbar__toggleBtn");
const menu = document.querySelector(".navbar__menu");
const login = document.querySelector(".navbar__login");

toggleBtn.addEventListener("click", () => {
  menu.classList.toggle("active");
  login.classList.toggle("active");
});
