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
  let scrollX = 0; // actual translate position
  let startX = 0;
  let dragOffset = 0;
  let isDragging = false;

  /** MOVE TO EXACT SLIDE */
  const moveSliderItem = (withTransition = true) => {
    sliderContainer.style.transition = withTransition ? "transform 0.4s ease" : "none";
    scrollX = -sliderContainer.children[currentSlidePos].offsetLeft;
    sliderContainer.style.transform = `translateX(${scrollX}px)`;
  };

  /** SNAP TO NEAREST SLIDE */
  const snapToNearest = () => {
    const childOffsets = [...sliderContainer.children].map((c) => -c.offsetLeft);
    let closest = childOffsets.reduce((prev, curr) =>
      Math.abs(curr - scrollX) < Math.abs(prev - scrollX) ? curr : prev
    );
    currentSlidePos = childOffsets.indexOf(closest);
    moveSliderItem(true);
  };

  /** NEXT / PREV */
  const slideNext = () => {
    if (currentSlidePos >= totalSlidableItems) {
      currentSlidePos = 0;
    } else {
      currentSlidePos++;
    }
    moveSliderItem(true);
  };

  const slidePrev = () => {
    if (currentSlidePos <= 0) {
      currentSlidePos = totalSlidableItems;
    } else {
      currentSlidePos--;
    }
    moveSliderItem(true);
  };

  sliderNextBtn.addEventListener("click", slideNext);
  sliderPrevBtn.addEventListener("click", slidePrev);

  /** HIDE ARROWS IF NOT NEEDED */
  if (totalSlidableItems <= 0) {
    sliderNextBtn.style.display = "none";
    sliderPrevBtn.style.display = "none";
  }

  /** TRACKPAD SCROLL */
  let wheelTimeout;
  currentSlider.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      sliderContainer.style.transition = "none";
      scrollX -= event.deltaX;

      // clamp boundaries
      const maxScroll = -(sliderContainer.scrollWidth - currentSlider.clientWidth);
      if (scrollX > 0) scrollX = 0;
      if (scrollX < maxScroll) scrollX = maxScroll;

      sliderContainer.style.transform = `translateX(${scrollX}px)`;
      event.preventDefault();

      // snap when scrolling stops
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(snapToNearest, 150);
    }
  });

  /** TOUCH DRAG */
  sliderContainer.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    dragOffset = 0;
    sliderContainer.style.transition = "none";
  });

  sliderContainer.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    dragOffset = e.touches[0].clientX - startX;
    sliderContainer.style.transform = `translateX(${scrollX + dragOffset}px)`;
  });

  sliderContainer.addEventListener("touchend", () => {
    isDragging = false;
    scrollX += dragOffset;

    // clamp boundaries
    const maxScroll = -(sliderContainer.scrollWidth - currentSlider.clientWidth);
    if (scrollX > 0) scrollX = 0;
    if (scrollX < maxScroll) scrollX = maxScroll;

    snapToNearest();
  });

  /** RESPONSIVE */
  window.addEventListener("resize", () => {
    totalSliderVisibleItems = Number(getComputedStyle(currentSlider).getPropertyValue("--slider-items"));
    totalSlidableItems = sliderContainer.childElementCount - totalSliderVisibleItems;
    moveSliderItem(false);
  });

  // Initialize
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
