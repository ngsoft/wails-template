/**
 * Router
 */
import { isFunction } from "@/modules/utils";
import ElementFinder from "@/modules/utils/element-finder.js";

let running = false;

function waitForComponent(id, fn)
{

    if (components.has(id))
    {
        fn(components.get(id));
    } else
    {
        if ('requestAnimationFrame' in globalThis)
        {
            requestAnimationFrame(() => waitForComponent(id, fn));
        } else
        {
            setTimeout(waitForComponent, 50, id, fn);
        }
    }

}

export default function router(routes)
{
    if (running)
    {
        return;
    }

    if (!(routes instanceof Map))
    {
        throw new TypeError("routes not an instance of Map");
    }

    running = true;
    const
        components = new Map(),
        loading = new Map();


    for (let id of routes.keys())
    {
        ElementFinder(id, async (elem, id) =>
        {
            if (!components.has(id))
            {
                let component = routes.get(id);


                if (!isFunction(component))
                {
                    throw new Error('Invalid component defined for route ' + id);
                }

                const fn = component =>
                {
                    new component({ target: elem });
                };

                if (loading.has(id))
                {
                    return waitForComponent(id, fn);
                }
                loading.set(id, true);
                if (!component.name)
                {
                    component = await component();
                    component = component.default;
                    components.set(id, component);
                }
                fn(component);
            }
        });
    }

}
