'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

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

const btnScrollTo = document.querySelector('.btn--scroll-to');
btnScrollTo.addEventListener('click', e => {
  const section1 = document.querySelector('#section--1');
  const s1coordinates = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: s1coordinates.left, 
  //   top: s1coordinates.top + window.pageYOffset,
  // behavior: "smooth"});
  section1.scrollIntoView({behavior: "smooth"})
});
