<script>
    export let loading = true, animation = false, color = "primary";
    let display;
    $: display = loading;

    // tailwind hack (preloading best looking colors (almost every colors)
    // Skeleton theme colors
    // bg-primary-400 bg-primary-500 bg-primary-600
    // bg-secondary-400 bg-secondary-500 bg-secondary-600
    // bg-tertiary-400 bg-tertiary-500 bg-tertiary-600
    // bg-success-400 bg-success-500 bg-success-600
    // bg-warning-400 bg-warning-500 bg-warning-600
    // bg-error-400 bg-error-500 bg-error-600
    // bg-surface-400 bg-surface-500 bg-surface-600
    // Tailwind originals
    // bg-emerald-400 bg-emerald-500 bg-emerald-600
    // bg-teal-400 bg-teal-500 bg-teal-600
    // bg-sky-400 bg-sky-500 bg-sky-600
    // bg-violet-400 bg-violet-500 bg-violet-600
    // bg-purple-400 bg-purple-500 bg-purple-600
    // bg-pink-400 bg-pink-500 bg-pink-600
    // bg-rose-400 bg-rose-500 bg-rose-600
    // bg-orange-400 bg-orange-500 bg-orange-600
    // bg-amber-400 bg-amber-500 bg-amber-600
    // bg-red-400 bg-red-500 bg-red-600
    // bg-stone-400 bg-stone-500 bg-stone-600
    // bg-zinc-400 bg-zinc-500 bg-zinc-600
    // bg-slate-400 bg-slate-500 bg-slate-600

</script>

<div class="w-full">
    {#if (loading)}
        {#if !animation}
            <div
                class="block text-center rounded-lg bg-white p-6 shadow dark:bg-neutral-700 w-full md:w-[50vw] mx-auto my-[32px]">
                <strong>Content is loading, please wait.</strong>
            </div>
        {:else }
            <div class="flex space-x-1 justify-center items-center mb-4">
                <span class='sr-only'>Loading...</span>
                <div
                    class="h-2 w-2 bg-{color}-400 rounded-full animate-bounce [animation-duration:0.550s] [animation-delay:-0.37s]"></div>
                <div
                    class="h-2 w-2 bg-{color}-500 rounded-full animate-bounce [animation-duration:0.550s] [animation-delay:-0.18s]"></div>
                <div class="h-2 w-2 bg-{color}-600 rounded-full animate-bounce [animation-duration:0.550s]"></div>
            </div>
        {/if}
    {:else }
        <slot/>
    {/if}
</div>
