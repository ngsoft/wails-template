import {AbstractDriver} from "../AbstractDriver.js";
import {DataStoreAbstract} from "@/modules/storage/DataStoreAbstract.js";
import {encode, getClass, isArray, isFunction, isString} from "@/modules/utils/index.js";


export class DataStoreDriver extends AbstractDriver {

    /**
     * @type {DataStoreAbstract}
     */
    #store

    /**
     * @protected
     * @return {DataStoreAbstract}
     */
    get dataStore() {
        return this.#store;
    }


    /**
     * @param {DataStoreAbstract} dataStore
     */
    constructor(dataStore) {
        super();

        if (!(dataStore instanceof DataStoreAbstract)) {
            throw new TypeError('Invalid DataStore')
        }
        this.#store = dataStore;
    }


    async updateItem(id, updater) {
        if (!isString(id)) {
            throw new TypeError('Invalid id');
        }

        if (!isFunction(updater)) {
            throw new TypeError(
                'Invalid updater'
            );
        }
        this.dataStore.createWritable(id, []).update(updater);
    }

    async getItem(id) {
        if (!isString(id)) {
            throw new TypeError('Invalid id');
        }
        let list = this.dataStore.get(id, []);
        if (!isArray(list)) {
            console.warn('Resetting list', id, 'on', getClass(this.dataStore));
            this.dataStore.createWritable(id).set(list = []);
        }
        return list;
    }


    async setItem(id, list) {
        if (!isString(id)) {
            throw new TypeError('Invalid id');
        }
        if (!isArray(list)) {
            throw new TypeError('Invalid list');
        }
        this.dataStore.createWritable(id, []).set(list);
    }


    subscribe(id, subscriber) {
        if (!isString(id)) {
            throw new TypeError('Invalid id' + encode(id));
        }

        if (!isFunction(subscriber)) {
            throw new TypeError('Invalid subscriber');
        }

        return this.dataStore.subscribe(
            id,
            subscriber
        );
    }

    getWritable(id) {
        return this.dataStore.createWritable(id, []);
    }
}

