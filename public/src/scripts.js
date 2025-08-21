'use strict';



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * PRELOADER
 */

const preloader = document.querySelector("[data-preloader]");

window.addEventListener("DOMContentLoaded", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * NAVBAR
 * navbar toggle for mobile
 */

const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navToggleBtn.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER
 * header active when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});



/**
 * SLIDER
 */

const sliders = document.querySelectorAll("[data-slider]");

const initSlider = function (currentSlider) {
  const sliderContainer = currentSlider.querySelector("[data-slider-container]");
  const sliderPrevBtn = currentSlider.querySelector("[data-slider-prev]");
  const sliderNextBtn = currentSlider.querySelector("[data-slider-next]");

  let totalSliderVisibleItems = Number(getComputedStyle(currentSlider).getPropertyValue("--slider-items"));
  let totalSlidableItems = sliderContainer.childElementCount - totalSliderVisibleItems;

  let currentSlidePos = 0;
  let scrollX = 0; // current translate offset
  let startX = 0;
  let dragOffset = 0;
  let isDragging = false;

  /** Move to exact slide index */
  const moveSliderItem = (withTransition = true) => {
    sliderContainer.style.transition = withTransition ? "transform 0.35s ease" : "none";
    scrollX = -sliderContainer.children[currentSlidePos].offsetLeft;
    sliderContainer.style.transform = `translateX(${scrollX}px)`;
  };

  /** Next / Prev */
  const slideNext = () => {
    if (currentSlidePos < totalSlidableItems) currentSlidePos++;
    moveSliderItem(true);
  };

  const slidePrev = () => {
    if (currentSlidePos > 0) currentSlidePos--;
    moveSliderItem(true);
  };

  sliderNextBtn.addEventListener("click", slideNext);
  sliderPrevBtn.addEventListener("click", slidePrev);

  /** Hide arrows if not needed */
  if (totalSlidableItems <= 0) {
    sliderNextBtn.style.display = "none";
    sliderPrevBtn.style.display = "none";
  }

  /** Trackpad scroll (with snap) */
  let wheelTimeout;
  currentSlider.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      sliderContainer.style.transition = "none";
      scrollX -= event.deltaX;

      // clamp
      const maxScroll = -(sliderContainer.scrollWidth - currentSlider.clientWidth);
      if (scrollX > 0) scrollX = 0;
      if (scrollX < maxScroll) scrollX = maxScroll;

      sliderContainer.style.transform = `translateX(${scrollX}px)`;
      event.preventDefault();

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        snapToNearest();
      }, 120);
    }
  });

  /** Snap logic */
  const snapToNearest = () => {
    const childOffsets = [...sliderContainer.children].map((c) => -c.offsetLeft);
    let closest = childOffsets.reduce((prev, curr) =>
      Math.abs(curr - scrollX) < Math.abs(prev - scrollX) ? curr : prev
    );
    currentSlidePos = childOffsets.indexOf(closest);
    moveSliderItem(true);
  };

  /** Touch drag */
  // TOUCH START
// TOUCH START
sliderContainer.addEventListener("touchstart", (e) => {
  if (e.touches.length > 1) return;      // ignore multi-touch
  startX = e.touches[0].clientX;
  isDragging = true;
  prevTranslate = currentTranslate;
  sliderContainer.style.transition = "none";
}, { passive: true });

// TOUCH MOVE
sliderContainer.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  e.preventDefault();                      // allow horizontal drag instead of page scroll
  currentX = e.touches[0].clientX;
  const deltaX = currentX - startX;
  currentTranslate = prevTranslate + deltaX;
  clampTranslate();
  setSliderPosition(false);                // realtime drag
}, { passive: false });

// TOUCH END / CANCEL
const endDrag = () => {
  if (!isDragging) return;
  isDragging = false;
  snapToNearest();                         // smooth snap
};
sliderContainer.addEventListener("touchend", endDrag);
sliderContainer.addEventListener("touchcancel", endDrag);

// TOUCH END
sliderContainer.addEventListener("touchend", () => {
  isDragging = false;

  // Find nearest slide
  let slideWidth = sliderContainer.children[0].offsetWidth;
  currentSlidePos = Math.round(Math.abs(currentTranslate) / slideWidth);

  // clamp between 0 and max slides
  if (currentSlidePos < 0) currentSlidePos = 0;
  if (currentSlidePos > totalSlidableItems) currentSlidePos = totalSlidableItems;

  // snap with smooth easing
  currentTranslate = -sliderContainer.children[currentSlidePos].offsetLeft;
  setSliderPosition(true);
});

  /** Responsive */
  window.addEventListener("resize", () => {
    totalSliderVisibleItems = Number(getComputedStyle(currentSlider).getPropertyValue("--slider-items"));
    totalSlidableItems = sliderContainer.childElementCount - totalSliderVisibleItems;
    moveSliderItem(false);
  });

  // Init
  moveSliderItem(false);
};

sliders.forEach(initSlider);





/*----------------------------------------------*\
-----------      contact      -------------------- 
\*----------------------------------------------*/

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}
