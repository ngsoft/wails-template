<script>

    import {noop, decode, isObject} from "@/modules/utils";
    import {writable} from "svelte/store";
    import {onMount} from "svelte";
    import PaginationButton from "./PaginationButton.svelte";
    import Micon from "./Micon.svelte";
    import {MATERIAL_OUTLINED} from "@/fonts";


    /**
     * Props
     */
    export let
        onChange = noop,
        page = 1,
        max = 2,
        display = 10,
        first = false,
        last = false,
        prev = true,
        next = true,
        tooltip = true,
        labels = false,
        bordered = false,
        extraClass = '',
        ready = true;


    /**
     * @private
     */
    let
        maxPage = Math.max(1, max),
        maxDisplay = Math.max(2, decode(display)),
        currentPage = decode(page),
        pagesToDisplay = writable([]);


    function updatePages() {

        let pages = [];

        // we need to calculate only if we got more pages than we can display
        if (maxPage > maxDisplay) {
            let offset = Math.floor(maxDisplay / 2);
            // we display more next than prev if max is even
            // else we get the same amount for odd numbers except for th first and last pages
            if (maxDisplay % 2 === 0) {
                offset--;
            }


            for (let i = Math.max(1, currentPage - offset); i <= maxPage; i++) {
                if (pages.length >= maxDisplay) {
                    break;
                }
                pages.push(i);
            }
            // we got to the end, and we need to get the previous pages
            if (maxDisplay > pages.length) {
                for (let i = Math.max(1, currentPage - offset - 1); i > 1; i--) {
                    if (pages.length >= maxDisplay) {
                        break;
                    }
                    pages.unshift(i);
                }
            }
        } else {
            // we generate an array with all the pages
            pages = Array.from(Array(maxPage).keys(), i => i + 1);
        }


        $pagesToDisplay = pages;

    }

    function changePage(number) {
        if (!ready || number === currentPage) {
            return;
        }
        onChange(currentPage = number);
        updatePages();


    }


    function goFirst() {
        changePage(1);
    }

    function goLast() {
        changePage(maxPage);
    }

    function goPrev() {
        changePage(Math.max(currentPage - 1, 1));
    }

    function goNext() {
        changePage(Math.min(currentPage + 1, maxPage));
    }

    function goTo({number}) {
        changePage(number);
    }


    onMount(() => {
        let reactive = false, init = false;
        // Reactive mode
        if (isObject(page) && page.subscribe) {
            page.subscribe(value => {
                reactive = true;
                currentPage = value;
                if (init) {
                    updatePages();
                }
            });
        }

        if (isObject(max) && max.subscribe) {
            max.subscribe(value => {
                reactive = true;
                maxPage = Math.max(1, value);
                if (init) {
                    updatePages();
                }
            });
        }

        if (isObject(display) && display.subscribe) {
            display.subscribe(value => {
                reactive = true;
                maxDisplay = Math.max(2, value);
                if (init) {
                    updatePages();
                }
            });
        }
        init = true;
        updatePages();

    });

</script>

{#if (maxDisplay > 2 && maxPage > 1)}

    <nav aria-label="Page navigation" class="flex items-center">
        <div class="flex items-center -space-x-px me-auto">

            <PaginationButton
                    extraClass="pagination-first {bordered ? 'rounded-none first:rounded-s-lg border border-gray-200' : ''} {extraClass}"
                    title="First page"
                    condition={first} disabled={currentPage===1} number={1} onClick={goFirst} {tooltip}>
                <Micon name="keyboard_double_arrow_left" variant={MATERIAL_OUTLINED} size={16}/>
                <span
                        class:sr-only={!labels}
                        class="max-lg:sr-only">First</span>
            </PaginationButton>
            <PaginationButton
                    extraClass="pagination-prev {bordered ? 'rounded-none first:rounded-s-lg border border-gray-200' : ''} {extraClass}"
                    title="Previous page"
                    condition={prev} disabled={currentPage===1} number="prev" onClick={goPrev}
                    {tooltip}>
                <Micon name="keyboard_arrow_left" variant={MATERIAL_OUTLINED} size={16}/>
                <span
                        class:sr-only={!labels}
                        class="max-lg:sr-only">Previous</span>
            </PaginationButton>
        </div>

        <div class="flex items-center gap-x-1 mx-4">

            {#each $pagesToDisplay as number}

                <PaginationButton
                        {extraClass}
                        title="Page {number} of {maxPage}"
                        condition={next}
                        active={currentPage===number}
                        {number}
                        onClick={goTo}
                        {tooltip}/>

            {/each}

        </div>
        <div class="flex items-center ms-auto">
            <PaginationButton
                    extraClass="pagination-next {bordered ? 'rounded-none last:rounded-e-lg border border-gray-200' : ''} {extraClass}"
                    title="Next page"
                    condition={next}
                    disabled={currentPage===maxPage}
                    number="next"
                    onClick={goNext}
                    {tooltip}>
                <span
                        class:sr-only={!labels}
                        class="max-lg:sr-only">Next</span>
                <Micon name="keyboard_arrow_right" variant={MATERIAL_OUTLINED} size={16}/>

            </PaginationButton>
            <PaginationButton
                    extraClass="pagination-last {bordered ? 'rounded-none last:rounded-e-lg border border-gray-200' : ''} {extraClass}"
                    title="Last page"
                    condition={last}
                    disabled={currentPage===maxPage}
                    number={maxPage}
                    {tooltip}
                    onClick={goLast}>
                <span
                        class:sr-only={!labels}
                        class="max-lg:sr-only">Last</span>
                <Micon name="keyboard_double_arrow_right" variant={MATERIAL_OUTLINED} size={16}/>

            </PaginationButton>
        </div>

    </nav>

{/if}