'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
const section1 = document.querySelector('#section--1');
const sections = document.querySelectorAll('.section');

const lazyImages = document.querySelectorAll('.features__img');

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Cookie message
const cookieMessage = document.createElement('div');
cookieMessage.classList.add('cookie-message');
cookieMessage.innerHTML = `We use cookie for improved functionality and 
analytics <button class="btn btn--close-cookie">Got it!</button>`;
document.querySelector('.header').append(cookieMessage);
cookieMessage.style.backgroundColor = '#37383d';
cookieMessage.style.width = '104%';
document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  cookieMessage.remove();
});

///Smooth scroll
btnScrollTo.addEventListener('click', e => {
  // const s1coordinates = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: s1coordinates.left,
  //   top: s1coordinates.top + window.pageYOffset,
  // behavior: "smooth"});
  section1.scrollIntoView({ behavior: 'smooth' });
});

// document.querySelectorAll('.nav__link').forEach((btn)=>{
//   btn.addEventListener("click",function(e){
//     const id = this.getAttribute("href")
//     document.querySelector(`${id}`).scrollIntoView({behavior:"smooth"})
//   })
// })
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();
  document
    .querySelector(`${e.target.getAttribute('href')}`)
    ?.scrollIntoView({ behavior: 'smooth' });
});

//Tabbed component

tabsContainer.addEventListener('click', e => {
  let currentTab = '';
  if (e.target.classList.contains('operations__tab')) {
    currentTab = e.target.getAttribute('data-tab');
    tabs.forEach(tab => {
      if (tab.classList.contains(`operations__tab--${currentTab}`)) {
        tab.classList.add('operations__tab--active');
      } else {
        tab.classList.remove('operations__tab--active');
      }
    });
    tabsContent.forEach(text => {
      if (text.classList.contains(`operations__content--${currentTab}`)) {
        text.classList.add('operations__content--active');
      } else {
        text.classList.remove('operations__content--active');
      }
    });
  }
});

//Nav fade
const fade = function (e) {
  if (e.target.classList.contains('nav__link')) {
    e.target
      .closest('.nav')
      .querySelectorAll('.nav__link')
      .forEach(link => (link.style.opacity = this));
    e.target.closest('.nav').querySelector('img').style.opacity = this;
    e.target.style.opacity = '1';
  }
};

nav.addEventListener('mouseover', fade.bind(0.5));
nav.addEventListener('mouseout', fade.bind(1));

//Sticky nav

// const initialCoordinates = section1.getBoundingClientRect();
// window.addEventListener('scroll', () => {
//   window.scrollY > initialCoordinates.top
//     ? nav.classList.add('sticky')
//     : nav.classList.remove('sticky');
// });

const header = document.querySelector('.header');
const stickyNav = entries => {
  entries[0].isIntersecting
    ? nav.classList.remove('sticky')
    : nav.classList.add('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
});
headerObserver.observe(header);

//Sections reveal
const sectionsReveal = (e, obs) => {
  if (!e[0].isIntersecting) return;
  e[0].target.classList.remove('section--hidden');
  obs.unobserve(e[0].target);
};

const sectionsObserve = new IntersectionObserver(sectionsReveal, {
  root: null,
  threshold: 0.15,
});

sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionsObserve.observe(section);
});

//Lazy loading img
const observeImg = (e, obs) => {
  if (!e[0].isIntersecting) return;
  e[0].target.src = e[0].target.dataset.src;
  e[0].target.addEventListener("load",()=>{
    e[0].target.classList.remove('lazy-img');
  })
  obs.unobserve(e[0].target);
};

const imgObserver = new IntersectionObserver(observeImg, {
  root: null,
  threshold: 0.95
});

lazyImages.forEach(img => {
  imgObserver.observe(img);
});

//Carousel 
