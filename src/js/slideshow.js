import { Slide } from './slide';
import { gsap } from 'gsap';

export class Slideshow {
    
    // DOM elements
    DOM = {
        // Main element .slides
        el: null,
        // .slides__img elements
        slides: null
    };
    // Slide instances array
    slidesArr = [];
    // Current slide's index
    current = 0;
    // Total number of slides
    slidesTotal;
    // Current Slide
    currentSlide;
    // Animation's direction (left or right)
    direction;
    // Checks if the slideshow is running
    isAnimating = false;
    // Animation's duration and easing
    duration = 1.2;
    ease = 'power3.inOut';
    // Use a filter (brighness) animation when transitioning from one slide to another
    filtersAnimation = true;

    constructor(DOM_el, options = {} ) {
        
        this.DOM.el = DOM_el;

        // Some options
        this.duration = options.duration != undefined ? options.duration : this.duration;
        this.ease = options.ease != undefined ? options.ease : this.ease;
        this.filtersAnimation = options.filtersAnimation != undefined ? options.filtersAnimation : this.filtersAnimation;

        this.DOM.slides = this.DOM.el.querySelectorAll('.slides__img');
        
        // Create a Slide for each .slides__img element
        this.DOM.slides.forEach(slideEl => this.slidesArr.push(new Slide(slideEl)));

        this.slidesTotal = this.DOM.slides.length;

    }

    /**
     * Set the current slide
     * @param {number} position - The position of the slide.
     */
    setInitialSlide(position = this.current) {
        
        // Update current
        this.current = position;
        // The current Slide
        this.currentSlide = this.slidesArr[this.current];
        // Set current image
        this.DOM.slides[this.current].classList.add('slides__img--current');

    }

    /**
     * Navigate the slideshow to the next slide.
     */
    next() {

        // Return if anything is running
        if ( this.isAnimating ) return;

        // direction
        this.direction = 'next';

        // Update current
        this.current = this.current < this.slidesTotal - 1 ? this.current+1 : 0;

        // Animate to a different slide
        this.navigate();

    }

    /**
     * Navigate the slideshow to the previous slide.
     */
    prev() {

        // Return if anything is running
        if ( this.isAnimating ) return;

        // direction
        this.direction = 'prev';

        // Update current
        this.current = this.current > 0 ? this.current-1 : this.slidesTotal - 1;

        // Animate to a different slide
        this.navigate();

    }

    /**
     * Navigate to a different slide
     * @param {number} position - The position of the new slide.
     */
    navigate(position = this.current) {

        this.isAnimating = true;

        // Update current
        this.current = position;

        // Upcoming Slide
        this.upcomingSlide = this.slidesArr[this.current];

        // Animation
        this.timeline = gsap.timeline({
            defaults: {
                duration: this.duration,
                ease: this.ease
            },
            onComplete: () => {
                // Current class switch
                this.currentSlide.DOM.outer.classList.remove('slides__img--current');
                this.upcomingSlide.DOM.outer.classList.add('slides__img--current');
                // Update current Slide
                this.currentSlide = this.slidesArr[this.current];

                this.isAnimating = false;
            }
        })
        .addLabel('start', 0)
        
        // Upcoming Slide gets shown behind the current Slide animates out
        .set(this.upcomingSlide.DOM.outer, {
            opacity: 1
        }, 'start')
        
        // outer/inner opposite translations (Reveal effect)
        .to(this.currentSlide.DOM.outer, {
            x: this.direction === 'next' ? '-101%' : '101%',
            onComplete: () => gsap.set(this.currentSlide.DOM.outer, {x: '0%', opacity: 0})
        }, 'start')
        .to(this.currentSlide.DOM.inner, {
            x: this.direction === 'next' ? '101%' : '-101%',
            onComplete: () => gsap.set(this.currentSlide.DOM.inner, {x: '0%'})
        }, 'start')
        
        // Filters animation
        if ( this.filtersAnimation ) {
            
            this.timeline.to(this.currentSlide.DOM.inner, {
                startAt: {filter: 'brightness(100%)'},
                filter: 'brightness(800%)',
                onComplete: () => gsap.set(this.currentSlide.DOM.inner, {filter: 'brightness(100%)'})
            }, 'start')
            .to(this.upcomingSlide.DOM.inner, {
                startAt: {filter: 'brightness(800%)'},
                filter: 'brightness(100%)'
            }, 'start');

        }
        

    }
}