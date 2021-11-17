import gsap from "gsap/gsap-core";

/** 
 * Class representing an image slide, 
 * where each one consists of an outer element and an inner element that contains a background image.
 * */
export class Slide {
    // DOM elements
    DOM = {
        // Wrapper element (outer element)
        outer: null,
        // Image element (inner element)
        inner: null
    };

    constructor(DOM_el) {

        this.DOM.outer = DOM_el;
        this.DOM.inner = this.DOM.outer.children[0];

    }
}