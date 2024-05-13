<script>

    import {
        AOS_EASING_EASE,
        AOS_PLACEMENT_TOP_BOTTOM,
        VALID_AOS_EASING,
        VALID_AOS_TRANSITION,
        VALID_AOS_PLACEMENTS,
        aosConfig,
        useAosCount
    } from "@/animate.js";
    import {writable} from "svelte/store";
    import {encode, isFunction} from "@/modules/utils";
    import {onMount} from "svelte";

    const {ready, increment, init} = useAosCount();

    export const root = writable(null);
    export let
        transition = /** @type {string|null} */ null,
        offset = aosConfig.offset,
        delay = aosConfig.delay,
        duration = aosConfig.duration,
        easing = aosConfig.easing,
        once = aosConfig.once,
        mirror = aosConfig.mirror,
        placement = aosConfig.anchorPlacement,
        extraClass = '',
        force = false,
        onStarted = /** @type {function(Object):void|null} */ null,
        onEnded = /** @type {function(Object):void|null} */null;


    function onLoad(target) {
        if (isFunction(onStarted)) {

            target.addEventListener(
                'aos:in',
                ({detail}) => {
                    onStarted(detail);
                }
            );

        }
        if (isFunction(onEnded)) {
            target.addEventListener(
                'aos:out',
                ({detail}) => {
                    onEnded(detail);
                }
            );
        }
    }


    if (!VALID_AOS_EASING.includes(easing)) {
        easing = AOS_EASING_EASE;
    }
    if (!VALID_AOS_TRANSITION.includes(transition)) {
        transition = null;
    }

    if (!VALID_AOS_PLACEMENTS.includes(placement)) {
        placement = AOS_PLACEMENT_TOP_BOTTOM;
    }

    onMount(() => {
        delay = Math.min(3000, delay);
        duration = Math.min(3000, duration);
        init();
        increment();

    });


</script>

{#if (transition && ($ready || force))}

    <div
        bind:this={$root}
        class="{extraClass}"
        use:onLoad
        data-aos={transition}
        data-aos-offset={encode(offset)}
        data-aos-delay={encode(delay)}
        data-aos-duration={encode(duration)}
        data-aos-easing={encode(easing)}
        data-aos-mirror={encode(mirror)}
        data-aos-once={encode(once)}
        data-aos-anchor-placement={placement}>
        <slot/>
    </div>


{:else }
    <div class="{extraClass}" bind:this={$root}>
        <slot/>
    </div>
{/if}
