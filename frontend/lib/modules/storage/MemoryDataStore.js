import {DataStoreAbstract} from "./DataStoreAbstract";
import {decode, encode, isUndef, value} from "@/modules/utils";


const
    DEFAULT = 'shared',
    /**
     * @type {Map<String, String>}
     */
    storage = new Map;

/**
 * @param {MemoryDataStore} store
 * @return {{}}
 */
function getStore(store) {
    return decode(storage.get(getStoreKey(store)));
}


/**
 *
 * @param {MemoryDataStore} store
 * @return {String}
 */
function getStoreKey(store) {
    // noinspection JSUnresolvedReference
    return store.getKey('').slice(0, -1);
}


export class MemoryDataStore extends DataStoreAbstract {


    constructor(prefix = DEFAULT) {
        if (!prefix) {
            throw new TypeError('prefix cannot be empty');
        }
        super(prefix);
        prefix = getStoreKey(this);
        if (!storage.has(prefix)) {
            storage.set(prefix, '{}');
        }
    }


    getItem(name, defaultValue = null) {
        return getStore(this)[name] ?? value(defaultValue);
    }

    /**
     * @return {String[]}
     */
    get keys() {
        return Object.keys(getStore(this));
    }

    removeItem(name) {
        let store = getStore(this);
        delete store[name];
        storage.set(getStoreKey(this), encode(store));
    }

    setItem(name, value) {
        if (null === value || isUndef(value)) {
            return this.removeItem(name);
        }

        let store = getStore(this);
        store[name] = value;
        storage.set(getStoreKey(this), encode(store));
    }
}

// noinspection JSUnusedGlobalSymbols
export const SharedStore = new MemoryDataStore();