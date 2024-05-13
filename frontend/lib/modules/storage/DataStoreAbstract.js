// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {getClass, isFunction, isString, noop, value} from "@/modules/utils";
import {writable} from "svelte/store";


const
    SEP = ':',
    SEP_RE = /:+$/,
    /**
     *
     * @type {Map<String, Writable<any>>}
     */
    svelteHooks = new Map;


class PrefixAble {

    /**
     * @type {String}
     */
    #prefix
    /**
     * @return {String}
     */
    get prefix() {
        return this.#prefix;
    }

    /**
     * @protected
     * @param {String} name
     * @return {string}
     */
    getKey(name) {
        if (!isString(name)) {
            throw new TypeError('Invalid name');
        }
        return this.prefix + name;
    }

    constructor(prefix = '') {
        if (!isString(prefix)) {
            throw new TypeError('Invalid prefix');
        }
        prefix = prefix.trimEnd().replace(SEP_RE, '').trimEnd();
        this.#prefix = prefix;
        if (prefix) {
            this.#prefix += SEP;
        }
    }


}


class NotImplemented extends Error {

}

export class DataStoreAbstract extends PrefixAble {


    /**
     * @param {String} name
     * @param {*} defaultValue
     * @return {*}
     */
    get(name, defaultValue = null) {
        let _value;
        if (null === (_value = this.getItem(name))) {
            _value = value(defaultValue) ?? null;
            if (null !== _value) {
                this.setItem(name, _value);
            }
        }
        return _value;
    }


    /**
     * @param {String} name
     * @return {boolean}
     */
    hasItem(name) {
        return this.getItem(name) !== null;
    }

    /**
     * @param {String} name
     * @param {function(*):*} updater
     */
    updateItem(name, updater) {
        if (!isFunction(updater)) {
            throw new TypeError('Invalid updater');
        }

        this.setItem(name, updater(this.getItem(name)));
    }

    /**
     * @return {void}
     */
    clear() {
        for (let key of this.keys) {
            this.removeItem(key);
        }
    }

    /**
     * @return {Number}
     */
    get size() {
        return this.keys.length;
    }

    /**
     * @param {String} name
     * @param {any} defaultValue
     * @return {Writable<*>}
     */
    createWritable(name, defaultValue = null) {
        let key = getClass(this) + SEP + this.getKey(name);
        if (!svelteHooks.has(key)) {
            const store = writable(this.get(name, defaultValue));
            store.subscribe(value => this.setItem(name, value));
            svelteHooks.set(key, store);
        }
        return svelteHooks.get(key);
    }


    /**
     * @param {String} name
     * @param {function(*):void} subscriber
     * @param {function():void} notifier
     * @return {Unsubscriber}
     */
    subscribe(name, subscriber, notifier = noop) {
        if (!isFunction(subscriber)) {
            throw new TypeError('Invalid subscriber');
        }
        return this.createWritable(name).subscribe(subscriber, notifier);
    }


    /**
     * @abstract
     * @return {String[]}
     */
    get keys() {
        return [];
    }


    /**
     * @abstract
     * @param {String} name
     * @return {void}
     */
    removeItem(name) {
        throw new NotImplemented;

    }

    /**
     * @abstract
     * @param {String} name
     * @param {any|null} defaultValue
     * @return {any}
     */
    getItem(name, defaultValue = null) {
        throw new NotImplemented;
    }

    /**
     * @abstract
     * @param {String} name
     * @param {any} value
     * @return {void}
     */
    setItem(name, value) {
        throw new NotImplemented;
    }


}