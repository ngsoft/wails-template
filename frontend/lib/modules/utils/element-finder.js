/**
 * Uses the mutation observer to look for elements
 * A small version of finder and future replacement
 */

import {isFunction, isValidSelector, document, isElement, runAsync} from "./index";

/**
 *
 * @param {String} selector
 * @param {function(HTMLElement):void} fn
 * @param {Boolean} once
 * @param {HTMLElement|HTMLDocument|null} root
 * @param {Boolean} unMatchRemoved
 * @return {(function(): void)}
 */
export default function ElementFinder(
    /** @type {string} */ selector,
    /** @type {function} */ fn,
    once = false,
    /** @type {HTMLElement|undefined} */ root = null,
    unMatchRemoved = false
) {


    if (!isValidSelector(selector)) {
        throw new TypeError("Invalid selector");
    }

    if (!isFunction(fn)) {
        throw new TypeError('fn is not a Function');
    }

    root ??= document.body;

    if (!isElement(root)) {
        throw new TypeError('root is not an Element');
    }


    const
        matches = new Set(),
        controller = new AbortController(),
        signal = controller.signal,
        watchRemoved = () => {
            if (!unMatchRemoved || !matches.size) {
                return;
            }
            const removed = [];
            for (let target of [...matches]) {
                let tmp = target, matched = false;
                while (null !== (tmp = tmp.parentElement)) {
                    if (tmp === root) {
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    removed.push(target);
                }
            }
            removed.forEach(el => matches.delete(el));
        },
        watcher = () => {

            if (signal.aborted) {
                return;
            }

            watchRemoved();

            for (let target of [...root.querySelectorAll(selector)]) {
                if (signal.aborted) {
                    return;
                }

                // aborted inside the loop
                if (matches.has(target)) {
                    continue;
                }
                matches.add(target);

                // non blocking
                runAsync(fn, target, selector);
                if (once) {
                    controller.abort();
                    return;
                }
            }
        };


    signal.onabort = () => {
        if (typeof observer !== 'undefined') {
            observer.disconnect();
        }
    };


    const observer = new MutationObserver(watcher);

    // we make an initial instant scan
    watcher();
    if (!signal.aborted) {
        // we use all mutations to trigger a scan
        observer.observe(root, {
            attributes: true, childList: true, subtree: true
        });
    }

    return () => {
        if (!signal.aborted) {
            controller.abort();
        }
    };

}
/**
 * @param {String} selector
 * @param {(function(HTMLElement):void)}fn
 * @param {HTMLElement|HTMLDocument} root
 * @param {Boolean} unMatchRemoved
 * @return {function(): void}
 */
ElementFinder.findOne = (selector, fn, root = null, unMatchRemoved = false) => {
    return ElementFinder(selector, fn, true, root, unMatchRemoved);
};

