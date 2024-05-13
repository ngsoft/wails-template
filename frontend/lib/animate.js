/** @type {import(aos/src/js/aos.js)} */
import AOS from 'aos';
import 'aos/dist/aos.css';
import {get, readable, writable} from "svelte/store";

export {AOS};

export const aosConfig = {
        // Global settings:
        disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
        startEvent: 'SveltePageReady', // name of the event dispatched on the document, that AOS should initialize on
        initClassName: 'aos-init', // class applied after initialization
        animatedClassName: 'aos-animate', // class applied on animation
        useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
        disableMutationObserver: false, // disables automatic mutations' detections (advanced)
        debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
        throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)


        // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
        offset: 120, // offset (in px) from the original trigger point
        delay: 0, // values from 0 to 3000, with step 50ms
        duration: 400, // values from 0 to 3000, with step 50ms
        easing: 'ease', // default easing for AOS animations
        once: true, // whether animation should happen only once - while scrolling down
        mirror: false, // whether elements should animate out while scrolling past them
        anchorPlacement: 'top-bottom', // defines which position of the element regarding window should trigger the animation
        minCount: 3, //min count to prevent errors on lighthouse (it is session based)
    },
    AOS_FADE_UP = 'fade-up',
    AOS_FADE_DOWN = 'fade-down',
    AOS_FADE_RIGHT = 'fade-right',
    AOS_FADE_LEFT = 'fade-left',
    AOS_FADE_UP_RIGHT = 'fade-up-right',
    AOS_FADE_UP_LEFT = 'fade-up-left',
    AOS_FADE_DOWN_RIGHT = 'fade-down-right',
    AOS_FADE_DOWN_LEFT = 'fade-down-left',
    AOS_ZOOM_IN = 'zoom-in',
    AOS_ZOOM_IN_UP = 'zoom-in-up',
    AOS_ZOOM_IN_DOWN = 'zoom-in-down',
    AOS_ZOOM_IN_RIGHT = 'zoom-in-right',
    AOS_ZOOM_IN_LEFT = 'zoom-in-left',
    AOS_ZOOM_OUT = 'zoom-out',
    AOS_ZOOM_OUT_UP = 'zoom-out-up',
    AOS_ZOOM_OUT_DOWN = 'zoom-out-down',
    AOS_ZOOM_OUT_RIGHT = 'zoom-out-right',
    AOS_ZOOM_OUT_LEFT = 'zoom-out-left',
    AOS_SLIDE_UP = 'slide-up',
    AOS_SLIDE_DOWN = 'slide-down',
    AOS_SLIDE_RIGHT = 'slide-right',
    AOS_SLIDE_LEFT = 'slide-left',
    AOS_FLIP_LEFT = 'flip-left',
    AOS_FLIP_RIGHT = 'flip-right',
    AOS_FLIP_UP = 'flip-up',
    AOS_FLIP_DOWN = 'flip-down',
    AOS_EASING_LINEAR = 'linear',
    AOS_EASING_EASE = 'ease',
    AOS_EASING_EASE_IN = 'ease-in',
    AOS_EASING_EASE_OUT = 'ease-out',
    AOS_EASING_EASE_IN_OUT = 'ease-in-out',
    AOS_EASING_EASE_IN_BACK = 'ease-in-back',
    AOS_EASING_EASE_OUT_BACK = 'ease-out-back',
    AOS_EASING_EASE_IN_OUT_BACK = 'ease-in-out-back',
    AOS_EASING_EASE_IN_SINE = 'ease-in-sine',
    AOS_EASING_EASE_OUT_SINE = 'ease-out-sine',
    AOS_EASING_EASE_IN_OUT_SINE = 'ease-in-out-sine',
    AOS_EASING_EASE_IN_QUAD = 'ease-in-quad',
    AOS_EASING_EASE_OUT_QUAD = 'ease-out-quad',
    AOS_EASING_EASE_IN_OUT_QUAD = 'ease-in-out-quad',
    AOS_EASING_EASE_IN_CUBIC = 'ease-in-cubic',
    AOS_EASING_EASE_OUT_CUBIC = 'ease-out-cubic',
    AOS_EASING_EASE_IN_OUT_CUBIC = 'ease-in-out-cubic',
    AOS_EASING_EASE_IN_QUART = 'ease-in-quart',
    AOS_EASING_EASE_OUT_QUART = 'ease-out-quart',
    AOS_EASING_EASE_IN_OUT_QUART = 'ease-in-out-quart',
    AOS_PLACEMENT_TOP_BOTTOM = 'top-bottom',
    AOS_PLACEMENT_TOP_CENTER = 'top-center',
    AOS_PLACEMENT_TOP_TOP = 'top-top',
    AOS_PLACEMENT_CENTER_BOTTOM = 'center-bottom',
    AOS_PLACEMENT_CENTER_CENTER = 'center-center',
    AOS_PLACEMENT_CENTER_TOP = 'center-top',
    AOS_PLACEMENT_BOTTOM_BOTTOM = 'bottom-bottom',
    AOS_PLACEMENT_BOTTOM_CENTER = 'bottom-center',
    AOS_PLACEMENT_BOTTOM_TOP = 'bottom-top',
    VALID_AOS_PLACEMENTS = [
        AOS_PLACEMENT_TOP_BOTTOM,
        AOS_PLACEMENT_TOP_CENTER,
        AOS_PLACEMENT_TOP_TOP,
        AOS_PLACEMENT_CENTER_BOTTOM,
        AOS_PLACEMENT_CENTER_CENTER,
        AOS_PLACEMENT_CENTER_TOP,
        AOS_PLACEMENT_BOTTOM_BOTTOM,
        AOS_PLACEMENT_BOTTOM_CENTER,
        AOS_PLACEMENT_BOTTOM_TOP
    ],
    VALID_AOS_TRANSITION = [
        AOS_FADE_UP,
        AOS_FADE_DOWN,
        AOS_FADE_RIGHT,
        AOS_FADE_LEFT,
        AOS_FADE_UP_RIGHT,
        AOS_FADE_UP_LEFT,
        AOS_FADE_DOWN_RIGHT,
        AOS_FADE_DOWN_LEFT,
        AOS_ZOOM_IN,
        AOS_ZOOM_IN_UP,
        AOS_ZOOM_IN_DOWN,
        AOS_ZOOM_IN_RIGHT,
        AOS_ZOOM_IN_LEFT,
        AOS_ZOOM_OUT,
        AOS_ZOOM_OUT_UP,
        AOS_ZOOM_OUT_DOWN,
        AOS_ZOOM_OUT_RIGHT,
        AOS_ZOOM_OUT_LEFT,
        AOS_SLIDE_UP,
        AOS_SLIDE_DOWN,
        AOS_SLIDE_RIGHT,
        AOS_SLIDE_LEFT,
        AOS_FLIP_LEFT,
        AOS_FLIP_RIGHT,
        AOS_FLIP_UP,
        AOS_FLIP_DOWN
    ],
    VALID_AOS_EASING = [
        AOS_EASING_LINEAR,
        AOS_EASING_EASE,
        AOS_EASING_EASE_IN,
        AOS_EASING_EASE_OUT,
        AOS_EASING_EASE_IN_OUT,
        AOS_EASING_EASE_IN_BACK,
        AOS_EASING_EASE_OUT_BACK,
        AOS_EASING_EASE_IN_OUT_BACK,
        AOS_EASING_EASE_IN_SINE,
        AOS_EASING_EASE_OUT_SINE,
        AOS_EASING_EASE_IN_OUT_SINE,
        AOS_EASING_EASE_IN_QUAD,
        AOS_EASING_EASE_OUT_QUAD,
        AOS_EASING_EASE_IN_OUT_QUAD,
        AOS_EASING_EASE_IN_CUBIC,
        AOS_EASING_EASE_OUT_CUBIC,
        AOS_EASING_EASE_IN_OUT_CUBIC,
        AOS_EASING_EASE_IN_QUART,
        AOS_EASING_EASE_OUT_QUART,
        AOS_EASING_EASE_IN_OUT_QUART
    ];


if (globalThis.document) {
    AOS.init(aosConfig);
}

let isReady = false;
const
    count = writable(0),
    ready = readable(
        false,
        set => {
            const {minCount} = aosConfig;
            if (get(count) > minCount) {
                set(true);
                return;
            }
            const unsub = count.subscribe(
                val => {
                    if (val > minCount) {
                        set(true);
                        unsub();
                    }
                }
            );
        }
    );

function increment() {
    count.update(x => x + 1);
}

function init() {
    if (!isReady) {
        isReady = true
        setTimeout(() => {
            document.dispatchEvent(
                new Event(
                    aosConfig.startEvent,
                    {
                        bubbles: false,
                        cancelable: true
                    }
                )
            );
        }, 150);

    }
}

export function useAosCount() {

    return {
        ready,
        count,
        increment,
        init,
    }


}



