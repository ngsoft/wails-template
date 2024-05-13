import {DataStoreAbstract} from "./DataStoreAbstract";
import {decode, encode, getClass, isUndef, value} from "@/modules/utils";
import {writable} from "svelte/store";


const
    SEP = ':',
    /**
     * @type {Map<WebDataStore, Storage>}
     */
    store = new Map,
    /**
     * @type {Map<WebDataStore, String>}
     */
    storeType = new Map,
    /**
     * @type {Map<String, Writable<any>>}
     */
    svelteHooks = new Map;

/**
 * @param {WebDataStore} dataStore
 * @return {Storage}
 */
function getStore(dataStore) {
    return store.get(dataStore);
}

export class WebDataStore extends DataStoreAbstract {

    /**
     * @param {Storage} storage
     * @param {String} prefix
     */
    constructor(storage = sessionStorage, prefix = '') {

        if (!(storage instanceof Storage)) {
            throw new TypeError('Invalid Storage')
        }
        super(prefix);
        store.set(this, storage);
        storeType.set(this, storage === localStorage ? 'local' : 'session')
    }


    /**
     * @param {String} name
     * @param {*} defaultValue
     * @return {Writable<*>}
     */
    createWritable(name, defaultValue = null) {
        let key = getClass(this) + SEP + storeType.get(this) + SEP + this.getKey(name);
        if (!svelteHooks.has(key)) {
            const store = writable(this.get(name, defaultValue), (set) => {
                // provide updates from other tabs
                const listener = e => {
                    if (e.storageArea === getStore(this)) {
                        if (e.key === this.getKey(name)) {
                            set(decode(e.newValue));
                        }
                    }
                };

                addEventListener('storage', listener);

                return () => {
                    removeEventListener(listener);
                }
            });
            store.subscribe(value => this.setItem(name, value));
            svelteHooks.set(key, store);
        }
        return svelteHooks.get(key);
    }


    getItem(name, defaultValue = null) {
        return decode(
            getStore(this).getItem(
                this.getKey(name)
            )
        ) ?? value(defaultValue);
    }

    /**
     * @return {String[]}
     */
    get keys() {
        const
            prefix = this.getKey(''),
            store = getStore(this),
            result = [];

        for (let i = 0; i < store.length; i++) {
            let key = store.key(i);
            if (key.startsWith(prefix)) {
                result.push(key.slice(prefix.length));
            }
        }
        return result;
    }

    removeItem(name) {
        getStore(this).removeItem(this.getKey(name));
    }

    setItem(name, value) {
        if (null === value || isUndef(value)) {
            return this.removeItem(name);
        }
        getStore(this).setItem(this.getKey(name), encode(value));
    }
}


// noinspection JSUnusedGlobalSymbols
export const LocalDataStore = new WebDataStore(localStorage), SessionDataStore = new WebDataStore(sessionStorage);