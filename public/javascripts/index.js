let profile = document.querySelector(".profile-cont");
let profileoff = document.querySelector("#profile-cont-off");
let swipeDown = document.querySelector(".scroll-to-down");
let rightSwipperArrow = document.querySelector("#swiper-button-next");
let leftSwipperArrow = document.querySelector("#swiper-button-prev");
let rightIconArrow = document.querySelector("#fa-arrow-right-long");
let leftIconArrow = document.querySelector("#fa-arrow-left-long");
rightIconArrow.addEventListener("click", () => {
  rightSwipperArrow.click();
});
leftIconArrow.addEventListener("click", () => {
  leftSwipperArrow.click();
});
rightSwipperArrow.addEventListener("click", () => {
  console.log("first2");
});
leftSwipperArrow.addEventListener("click", () => {
  console.log("second");
});

profile.addEventListener("click", function () {
  profile.classList.toggle("profile-active");
});

profileoff.addEventListener("click", function () {
  profile.classList.toggle("profile-active");
});
swipeDown.addEventListener("click", () => {
  window.scrollTo(0, document.body.scrollHeight);
});
let pagelocation = location.pathname.toUpperCase();

document.getElementById("pagelocation").innerText += pagelocation;
// swiper code
var swiper = new Swiper(".mySwiper", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: true,
  },
  allowTouchMove: false,
  loop: true,
  autoplay: {
    delay: 1500,
    disableOnInteraction: false,
  },
});

var swiper2 = new Swiper(".mySwiper2", {
  effect: "flip",
  grabCursor: false,
  loop: true,
  freeMode: true,
  autoplay: {
    delay: 1500,
    disableOnInteraction: false,
  },
});
var swiper3 = new Swiper(".mySwiper3", {
  slidesPerView: 4,
  spaceBetween: 30,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  loop: true,
  loopFillGroupWithBlank: true,
  freeMode: true,
  autoplay: {
    delay: 1500,
    disableOnInteraction: false,
  },
});
// function
