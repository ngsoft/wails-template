class NotImplemented extends Error {
}

// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
/**
 * @abstract
 * @class
 */
export class AbstractDriver {


    /**
     * @abstract
     * @param {string} id
     * @return {Promise<{}[]>}
     */

    getItem(id) {
        return Promise.reject(new NotImplemented());
    }

    /**
     * @abstract
     * @param {String} id
     * @param {{}[]}list
     * @return {Promise<void>}
     */
    setItem(id, list) {
        return Promise.reject(new NotImplemented());
    }


    /**
     * @abstract
     * @param {String} id
     * @param {(function({}[]):{}[])} updater
     * @return {Promise<void>}
     */
    updateItem(id, updater) {
        throw new NotImplemented;
    }

    /**
     * @abstract
     * @param {String} id
     * @param {(function({}[]):void)} subscriber
     * @return (function():void) unsubscribe
     */
    subscribe(id, subscriber) {
        throw new NotImplemented;
    }


    /**
     * @abstract
     * @param {String} id
     * @return {Writable<{}[]>}
     */

    getWritable(id) {
        throw new NotImplemented;
    }


}