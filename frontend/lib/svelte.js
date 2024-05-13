import emitter from "@/modules/utils/dom-event-emitter.js";
import { Tooltip } from "tw-elements";
import { derived, get, writable } from "svelte/store";
import { decode, encode } from "@/modules/utils/index.js";
import { LocalDataStore } from "@/modules/storage/index.js";

export function addTooltip(target)
{

    if (!(target instanceof EventTarget))
    {
        return;
    }

    const instance = new Tooltip(target);
    emitter(target).on('click keydown', e =>
    {
        if (e.type === 'click' || e.key === 'Enter')
        {
            instance.hide();
        }
    });
}


export function createInputType()
{


    let textarea, canUpdate = false;
    const
        data = writable([]),
        textData = derived(data, value => encode(value));

    function bindTarget(target)
    {
        if (target instanceof HTMLTextAreaElement)
        {
            textarea = target;
            let initialValue = target.value ?? '[]';
            data.update(() => decode(initialValue));
        }
    }


    data.subscribe(() =>
    {
        // first run on initial value
        if (!canUpdate || !textarea)
        {
            return canUpdate = !!textarea;
        }
        textarea.value = get(textData);
        emitter(textarea).trigger('change');
    });


    return {
        data,
        textData,
        bindTarget
    };
}





