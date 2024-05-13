<script>

    import {onMount} from "svelte";
    import dataset from "@/modules/utils/dataset-reader.js";
    import {uuidv4} from "@/modules/utils/index.js";
    import Micon from "@/components/Micon.svelte";
    import Alert from "@/components/Alert.svelte";
    import {addTooltip, createInputType} from "@/svelte";


    function onInput({target}) {

        const
            x = dataset(target, 'x'),
            y = dataset(target, 'y'),
            z = dataset(target, 'z');

        if (null === z) {
            $data[y][x] = target.value;
        } else {
            $data[y][x][z] = target.value;
        }

    }

    function onButtonClick({target}) {

        target = target.closest('button');
        let
            mode = dataset(target, 'mode'),
            x = dataset(target, 'x'),
            y = dataset(target, 'y'),
            z = dataset(target, 'z'),
            copy = [...$data],
            change = false;


        if ('rm-z' === mode) {
            copy[y][x].splice(z, 1);
            if (!copy[y][x].length) {
                copy.splice(y, 1);
            }
            change = true;
        } else if ('add-y' === mode) {
            if (copy.length) {
                copy.splice(y, 1, copy[y], ['', ['']]);
            } else {
                copy.push(['', ['']]);
            }
            change = true;
        } else if ('add-z' === mode) {
            copy[y][x].splice(z, 1, copy[y][x][z], '');
            change = true;
        }

        if (change) {
            $data = copy;
        }
    }

    let root, container, textarea, uuid = uuidv4();

    const {data, bindTarget} = createInputType();

    onMount(() => {
        container = root.parentElement;
        textarea = container.parentElement.querySelector(dataset(container, 'target'));
        if (textarea) {
            bindTarget(textarea);
        }
    });


</script>


<ol bind:this={root} class="w-full list-none overflow-hidden">
    {#each $data as line, y}
        <li class="flex flex-row justify-between items-start flex-nowrap w-full my-3">
            <div class="p-0.5 w-[40px]">
                <button
                        on:click|preventDefault={onButtonClick}
                        data-mode="add-y"
                        data-y="{y}"
                        type="button"
                        use:addTooltip
                        class="btn btn-outline-secondary btn-xs border-2 shadow"
                        title="Add row">
                    <Micon type="add_circle_outline" size={16}></Micon>
                </button>
            </div>
            <div class="w-[calc(100%-41px)]] flex">

                <div class="w-4/12 p-0.5">
                    <label
                            class="mb-2 text-md font-medium text-gray-900 dark:text-white capitalize hidden"
                            for="{uuid}-x-0-y-{y}">Key</label>
                    <input
                            on:input={onInput}
                            on:change={onInput}
                            data-x="0"
                            data-y="{y}"
                            placeholder="Key"
                            type="text" value="{line[0]}"
                            id="{uuid}-x-0-y-{y}"
                            class="text-gray-900 bg-gray-50 rounded-lg text-sm block w-full px-4 pb-[5px] pt-[6px] border border-gray-300 focus:z-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-60">
                </div>
                <div class="w-8/12">
                    {#each line[1] as zValue, z}
                        <div class="w-full flex items-center">
                            <div class="w-[40px] p-0.5">
                                <button
                                        on:click|preventDefault={onButtonClick}
                                        data-mode="add-z"
                                        data-x="1"
                                        data-y="{y}"
                                        data-z="{z}"
                                        type="button"
                                        use:addTooltip
                                        class="btn btn-outline-secondary btn-xs border-2 shadow"
                                        title="Add">
                                    <Micon type="add_circle_outline" size={16}></Micon>
                                </button>


                            </div>
                            <div class="w-[calc(100%-82px)] p-0.5">
                                <label
                                        class="mb-2 text-md font-medium text-gray-900 dark:text-white capitalize hidden"
                                        for="{uuid}-x-0-y-{y}-z-{z}">
                                    Value
                                </label>
                                <input
                                        on:input={onInput}
                                        on:change={onInput}
                                        data-x="1"
                                        data-y="{y}"
                                        data-z="{z}"
                                        placeholder="Value"
                                        type="text"
                                        value={zValue}
                                        id="{uuid}-x-0-y-{y}-z-{z}"
                                        class="text-gray-900 bg-gray-50 rounded-lg text-sm block w-full px-4 pb-[5px] pt-[6px] border border-gray-300 focus:z-10 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-60">

                            </div>
                            <div class="w-[40px] p-0.5">
                                <button
                                        on:click|preventDefault={onButtonClick}
                                        data-mode="rm-z"
                                        data-x="1"
                                        data-y="{y}"
                                        data-z="{z}"
                                        type="button"
                                        use:addTooltip
                                        class="btn btn-outline-danger btn-xs border-2 shadow" title="Remove">
                                    <Micon type="remove_circle_outline" size={16}></Micon>
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </li>

    {/each}

    {#if $data.length === 0}
        <li class="flex flex-row justify-between items-center flex-nowrap w-full my-3">
            <div class="p-0.5 w-2/12 lg:w-1/12 text-start">
                <button
                        on:click|preventDefault={onButtonClick}
                        data-mode="add-y"
                        data-row="-1"
                        type="button"
                        use:addTooltip
                        class="btn btn-outline-secondary btn-xs border-2 shadow"
                        title="Add row">
                    <Micon type="add_circle_outline" size={16}></Micon>
                </button>
            </div>
            <div class="p-0.5 w-10/12 lg:w-11/12">
                <Alert extraClassMessage="py-0 text-sm" extraClass="py-0 mb-0">
                    Click on
                    <Micon type="add_circle_outline" size={14}/>
                    to add a line.
                </Alert>
            </div>
        </li>
    {/if}
</ol>