<script>
    import {MATERIAL_FILLED, MATERIAL_VARIANTS} from "@/fonts";

    export let
        extraClass = '',
        variant = MATERIAL_FILLED,
        name = null,
        type = null,
        size = 24;

    name ??=type;
    if (! MATERIAL_VARIANTS.includes(variant)) {
        variant = null;
    }
</script>

{#if variant !== null && name !== null }
    <span class="{variant} {extraClass}" style="--micon-font-size: {size}px" >{name}</span>
{/if}

