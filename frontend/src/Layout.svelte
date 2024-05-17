<script>
    import "app/app"
    import {AppShell, AppBar, LightSwitch, popup} from '@skeletonlabs/skeleton';
    import {onMount} from "svelte";
    import {LocalDataStore} from "@/modules/storage/index.js";
    import {isBool} from "@/modules/utils/index.js";
    import {AppGetConfig, CloseWindow} from "../wailsjs/go/service/service.js";
    import {writable} from "svelte/store";
    import Micon from "@/components/Micon.svelte";
    import {WindowMaximise, WindowMinimise} from "../wailsjs/runtime/runtime.js";
    import ElementFinder from "@/modules/utils/element-finder.js";
    import dataset from "@/modules/utils/dataset-reader.js";
    import emitter from "@/modules/utils/dom-event-emitter.js";

    const
        userMode = LocalDataStore.createWritable('modeUserPrefers'),
        lightMode = globalThis.matchMedia('(prefers-color-scheme: light)'),
        frameless = writable(false),
        maximize = writable(false),
        title = writable("Skeleton"),
        popupHover = {
            event: 'hover',
            target: 'popupHover',
            placement: 'left'
        };


    function setDarkMode() {
        function setMode(value) {
            const elemHtmlClasses = document.documentElement.classList;
            const classDark = `dark`;
            value === true ? elemHtmlClasses.remove(classDark) : elemHtmlClasses.add(classDark);
        }

        function setAuto() {
            // if changed by lightswitch within current instance
            if (!isBool(LocalDataStore.getItem('modeUserPrefers'))) {
                setMode(lightMode.matches)
            }
        }

        userMode.subscribe(value => {
            if (isBool(value)) {
                setMode(value)
            }
        });
        lightMode.onchange = setAuto;
        setAuto();
    }


    (async function () {
        const
            a = await AppGetConfig("AppTitle"),
            b = await AppGetConfig("Title");
        return a ?? b;
    })().then(value => $title = value);
    AppGetConfig("Frameless").then(value => $frameless = value);
    (async function () {
        const
            w = await AppGetConfig("MaxWidth"),
            h = await AppGetConfig("MaxHeight"),
            dis = await AppGetConfig("DisableResize");
        if (h > 0 || w > 0) {
            return false;
        }
        return !dis;
    })().then(value => $maximize = value);


    onMount(() => {
        setDarkMode();
        ElementFinder(
            '#shell-header [title], [data-title]',
            elem => {
                let title = elem.getAttribute('title');
                if (title) {
                    elem.removeAttribute('title');
                    dataset(elem, 'title', title);
                } else {
                    title = dataset(elem, 'title');
                }

                emitter(elem).on('mouseenter', e => {
                    document
                        .querySelector('[data-popup="popupHover"] p')
                        .innerHTML = title;
                });
                popup(elem, popupHover);
            }
        );
    });
</script>

<!-- App Shell -->
<AppShell>
    <svelte:fragment slot="header">
        <!-- App Bar -->
        <AppBar class={$frameless ? "wails-draggable":""}>
            <svelte:fragment slot="lead">
                <strong class="text-lg">{$title}</strong>
            </svelte:fragment>
            <svelte:fragment slot="trail">

                <LightSwitch/>

                {#if $frameless}
                    <div class="flex ps-4">
                        <button
                            on:click={()=> WindowMinimise()}
                            type="button"
                            class="btn btn-sm rounded variant-soft p-2 pt-0 [&>*]:pointer-events-none"
                            data-title="Minimize window"
                            use:popup={popupHover}>
                            <Micon name="minimize" size={16}></Micon>
                        </button>
                        {#if $maximize}
                            <button
                                on:click={()=> WindowMaximise()}
                                type="button"
                                class="btn btn-sm rounded variant-soft py-1 px-2 !ms-2 [&>*]:pointer-events-none"
                                data-title="Maximize window"
                                use:popup={popupHover}>
                                <Micon name="content_copy" size={16} extraClass="rotate-90"></Micon>
                            </button>
                        {/if}
                        <button
                            on:click={()=>CloseWindow()}
                            type="button"
                            class="btn btn-sm rounded variant-soft py-1 px-2 !ms-2 [&>*]:pointer-events-none"
                            data-title="Close window"
                            use:popup={popupHover}>
                            <Micon name="close" size={16}></Micon>
                        </button>
                    </div>

                {/if}
                <div class="card variant-filled p-2 translate-x-[-16px]" data-popup="popupHover">
                    <p></p>
                    <div class="arrow variant-filled"/>
                </div>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <!-- Page Route Content -->
    <slot/>


</AppShell>


