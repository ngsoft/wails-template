<script>

    import Micon from "./Micon.svelte";
    import {MATERIAL_FILLED} from "@/fonts";
    import {ALERT_ALIAS, ALERT_ICONS, ALERT_INFO} from "@/tailwind/alert.js";

    import {Alert as TeAlert} from 'tw-elements';
    import {onMount} from "svelte";


    export let
        isFlash = false,
        extraClass = '',
        extraClassMessage = '',
        dismissible = false,
        autohide = false,
        delay = 2,
        icon = false,
        iconSize = 24,
        type = ALERT_INFO,
        title = '',
        message = '';

    let container;

    function getClassName() {
        let className = 'alert alert-' + type;

        if (dismissible) {
            className += ' alert-dismissible';
        }

        if (autohide) {
            className += ' opacity-0 motion-reduce:opacity-1 fade-in motion-reduce:transition-none motion-reduce:animate-none';
        }

        return className;
    }

    if (ALERT_ALIAS.has(type)) {
        type = ALERT_ALIAS.get(type);
    }
    if (!ALERT_ICONS.has(type)) {
        type = null;
    }

    onMount(() => {
        if (container) {

            if (isFlash) {
                const flashContainer = document.getElementById('flash-messages');
                if (flashContainer) {
                    flashContainer.appendChild(container);
                }

            }

            new TeAlert(container)
        }
    });

</script>

{#if type !== null}
    <div
            data-te-alert-init
            bind:this={container} class="{getClassName()} {extraClass}"
            data-autohide={autohide ? '' : null}
            data-delay="{delay}"
            data-te-alert-show={dismissible ? '' : null}
            role="alert">
        <div class="flex flex-col w-full">
            {#if title}<h4 class="alert-heading">{title}</h4>{/if}
            <div class="inline-flex items-center w-full py-2">
                {#if icon}
                    <Micon name="{ALERT_ICONS.get(type)}" variant="{MATERIAL_FILLED}" extraClass="me-3"
                           size={iconSize}/>
                {/if}
                <div class="mx-auto {extraClassMessage}">
                    <slot>{message ?? '' }</slot>
                </div>

            </div>
        </div>
        {#if dismissible}
            <button type="button" data-te-alert-dismiss aria-label="Close">
                <Micon name="close" size={16}
                       extraClass="focus:opacity-100
                       disabled:pointer-events-none disabled:select-none disabled:opacity-25
                       [&.disabled]:pointer-events-none [&.disabled]:select-none [&.disabled]:opacity-25"/>
            </button>
        {/if}
    </div>

{:else }
    <slot/>
{/if}