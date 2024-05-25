<script>

    import {WindowMinimise} from "../../wailsjs/runtime/runtime.js";
    import {AppGetConfig, CloseWindow, WindowToggleMaximise} from "../../wailsjs/go/service/service.js";
    import {writable} from "svelte/store";
    import Micon from "@/components/Micon.svelte";

    const maximize = writable(false);

    AppGetConfig("DisableResize").then(value => $maximize = !value);


</script>


<div class="flex ps-4">
    <div class="flex items-center">
        <button
            on:click={()=> WindowMinimise()}
            type="button"
            class="btn btn-sm rounded variant-soft p-2 pt-0 max-h-[24px] [&>*]:pointer-events-none"
            title="Minimize window">
            <Micon name="minimize" size={16}></Micon>
        </button>
        {#if $maximize}
            <button
                on:click={()=>WindowToggleMaximise()}
                type="button"
                class="btn btn-sm rounded variant-soft py-1 px-2 max-h-[24px] !ms-2 [&>*]:pointer-events-none"
                title="Maximize window">
                <Micon name="content_copy" size={16} extraClass="rotate-90"></Micon>
            </button>
        {/if}
    </div>
    <button
        on:click={()=>CloseWindow()}
        type="button"
        class="btn btn-sm rounded-full variant-soft p-2 !ms-2 [&>*]:pointer-events-none"
        title="Close window">
        <Micon name="close" size={16}></Micon>
    </button>
</div>

