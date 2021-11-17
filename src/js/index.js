import { preloadImages } from './utils';
import { Slideshow } from './slideshow';
import gsap from 'gsap';

// body element
const bodyEl = document.body;
// body color
const bodyColor = getComputedStyle(bodyEl).getPropertyValue('--color-bg');
// Three Slideshow instances: main, and two for the navigation items
const slideshowMain = new Slideshow(document.querySelector('.slideshow > div.slides'));
const slideshowNavNext = new Slideshow(document.querySelector('.slideshow nav.nav--next .slides'), {duration: 1, filtersAnimation: false});
const slideshowNavPrev = new Slideshow(document.querySelector('.slideshow nav.nav--prev .slides'), {duration: 1, filtersAnimation: false});
// Nav controls to navigate the main slideshow
const navCtrls = {
    prev: document.querySelector('.slideshow nav.nav--prev'),
    next: document.querySelector('.slideshow nav.nav--next')
};
// title elements
const titleElems = [...document.querySelectorAll('.meta__content > .meta__content-title')];

// Animates the body color
const animateBodyBGColor = () => {
    
    gsap.timeline()
    .to(bodyEl, {
        duration: slideshowMain.duration/2,
        ease: 'power3.in',
        backgroundColor: '#2b0889'
    }, 'start')
    .to(bodyEl, {
        duration: slideshowMain.duration,
        ease: 'power3',
        backgroundColor: bodyColor
    }, 'start+=' + slideshowMain.duration/2);

}

// Set the current slide
slideshowMain.setInitialSlide();
// Set up the current slide values for the navigation elements, which are based on the slideshowMain's current value
slideshowNavPrev.setInitialSlide(slideshowMain.current ? slideshowMain.current - 1 : slideshowMain.slidesTotal - 1);
slideshowNavNext.setInitialSlide(slideshowMain.current < slideshowMain.slidesTotal - 1 ? slideshowMain.current + 1 : 0);

// Set initial title
gsap.set(titleElems[slideshowMain.current], {opacity: 1});

// Change slides for the three slideshows
const onClickNavCtrlEv = (dir) => {
    
    if ( slideshowMain.isAnimating ) return;

    // Slide out current title
    gsap.to(titleElems[slideshowMain.current], {
        duration: slideshowMain.duration/2,
        ease: 'power3.in',
        y: dir === 'next' ? '-100%' : '100%',
        opacity: 0
    });

    slideshowMain[dir]();
    slideshowNavPrev[dir]();
    slideshowNavNext[dir]();
    animateBodyBGColor();

    // Slide in the new (current) title
    gsap.to(titleElems[slideshowMain.current], {
        duration: slideshowMain.duration/2,
        ease: 'power3',
        startAt: {y: dir === 'next' ? '100%' : '-100%'},
        y: '0%',
        opacity: 1,
        delay: slideshowMain.duration/2
    });

};
navCtrls.prev.addEventListener('click', () => onClickNavCtrlEv('prev'));
navCtrls.next.addEventListener('click', () => onClickNavCtrlEv('next'));


// Preload images then remove loader (loading class) 
preloadImages('.slides__img-inner').then(() => document.body.classList.remove('loading'));
