<script>
    import "app/app"
    import {AppShell, AppBar, LightSwitch, popup} from '@skeletonlabs/skeleton';
    import {onMount} from "svelte";
    import {LocalDataStore} from "@/modules/storage/index.js";
    import {isBool} from "@/modules/utils/index.js";
    import {AppGetConfig} from "../wailsjs/go/service/service.js";
    import {writable} from "svelte/store";
    import Micon from "@/components/Micon.svelte";
    import {Quit, WindowMinimise} from "../wailsjs/runtime/runtime.js";

    const
        userMode = LocalDataStore.createWritable('modeUserPrefers'),
        lightMode = globalThis.matchMedia('(prefers-color-scheme: light)'),
        frameless = writable(false),
        popupHover = {
            event: 'hover',
            target: 'popupHover',
            placement: 'left'
        };

    function onCloseClick() {
        Quit();
    }

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


    AppGetConfig("Frameless").then(flag => $frameless = flag)


    onMount(() => {

        setDarkMode();
    })
</script>

<!-- App Shell -->
<AppShell>
    <svelte:fragment slot="header">
        <!-- App Bar -->
        <AppBar class={$frameless ? "wails-draggable":""}>
            <svelte:fragment slot="lead">
                <strong class="text-xl uppercase">Skeleton</strong>
            </svelte:fragment>
            <svelte:fragment slot="trail">
                <LightSwitch/>

                {#if $frameless}

                    <button
                        on:mouseenter={(e)=>{
                            document
                            .querySelector('[data-popup="popupHover"] p')
                            .innerHTML=e.target.closest('button').dataset.title;
                        }}
                        on:click={()=> {WindowMinimise()}}
                        type="button"
                        class="btn btn-sm rounded variant-soft p-2 pt-0 [&>*]:pointer-events-none"
                        data-title="Minimize window"
                        use:popup={popupHover}>
                        <Micon name="minimize" size={16}></Micon>
                    </button>
                    <button
                        on:mouseenter={(e)=>{
                            document
                            .querySelector('[data-popup="popupHover"] p')
                            .innerHTML=e.target.closest('button').dataset.title;
                        }}
                        on:click={onCloseClick}
                        type="button"
                        class="btn btn-sm rounded variant-soft py-1 px-2 !ms-1 [&>*]:pointer-events-none"
                        data-title="Close window"
                        use:popup={popupHover}>
                        <Micon name="close" size={16}></Micon>
                    </button>

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


