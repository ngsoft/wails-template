<script>

    /**
     * Pagination button
     * @link https://preline.co/docs/pagination.html
     */
    import {noop, value, decode} from "@/modules/utils";
    import {addTooltip} from "@/svelte";

    export let
        onClick = noop,
        condition = true,
        number = 0,
        extraClass = '',
        tooltip = false,
        active = false,
        disabled = false,
        title = 'Page ' + number;


    function onButtonClick(e) {
        if (e.type === 'click' || e.key === 'Enter') {
            e.preventDefault();
            if (!active) {
                let button = e.target.closest('button');
                onClick({button, number: decode(button.value)});
            }

        }
    }

    function setTooltip(elem) {
        tooltip && addTooltip(elem);
    }
</script>
{#if value(condition)}
    <button
            title={value(tooltip) ? title : null}
            use:setTooltip
            on:click={onButtonClick}
            on:keydown={onButtonClick}
            value="{number}"
            type="button"
            aria-current={value(active) ? 'page' : null}
            class:active={value(active)||false}
            class="pagination-btn {extraClass}"
            disabled={value(disabled) ? true : null}>
        <slot>{number}</slot>
    </button>
{/if}

