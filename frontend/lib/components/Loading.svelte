<script>
    export let loading = true, animation = false, color = "emerald";
    let display;
    $: display = loading;

</script>

<div class="w-full">
    {#if (loading)}
        {#if !animation}
            <div class="block text-center rounded-lg bg-white p-6 shadow dark:bg-neutral-700 w-full md:w-[50vw] mx-auto my-[32px]">
                <strong>Content is loading, please wait.</strong>
            </div>
        {:else }
            <div class="flex space-x-1 justify-center items-center mb-4">
                <span class='sr-only'>Loading...</span>
                <div class="h-2 w-2 bg-{color}-400 rounded-full animate-bounce [animation-duration:0.550s] [animation-delay:-0.37s]"></div>
                <div class="h-2 w-2 bg-{color}-500 rounded-full animate-bounce [animation-duration:0.550s] [animation-delay:-0.18s]"></div>
                <div class="h-2 w-2 bg-{color}-600 rounded-full animate-bounce [animation-duration:0.550s]"></div>
            </div>
        {/if}
    {:else }
        <slot/>
    {/if}
</div>
