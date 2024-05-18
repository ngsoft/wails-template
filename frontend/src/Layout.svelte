<script>
    import "app/app"
    import {AppShell, AppBar, LightSwitch, popup} from '@skeletonlabs/skeleton';
    import {onMount} from "svelte";
    import {LocalDataStore} from "@/modules/storage/index.js";
    import {isBool} from "@/modules/utils/index.js";
    import {AppGetConfig, CloseWindow} from "../wailsjs/go/service/service.js";
    import {writable} from "svelte/store";
    import AppBarButtons from "@/components/AppBarButtons.svelte";
    import ElementFinder from "@/modules/utils/element-finder.js";
    import dataset from "@/modules/utils/dataset-reader.js";
    import emitter from "@/modules/utils/dom-event-emitter.js";


    const
        userMode = LocalDataStore.createWritable('modeUserPrefers'),
        lightMode = globalThis.matchMedia('(prefers-color-scheme: light)'),
        frameless = writable(false),
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


    onMount(() => {
        setDarkMode();
        ElementFinder(
            '#shell-header [title], [data-title]',
            elem => {
                let title = elem.getAttribute('title');
                if (title) {
                    // unset title to not display tooltip + browser defaults
                    elem.removeAttribute('title');
                    // keep the title somewhere
                    dataset(elem, 'title', title);
                } else {
                    title = dataset(elem, 'title');
                }

                // change the popover text
                emitter(elem).on('mouseenter', () => {
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
                    <AppBarButtons/>
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


