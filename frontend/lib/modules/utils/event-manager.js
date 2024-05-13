import {isFunction, isString, runAsync} from "./index";


function getListenersForEvent(listeners, type) {
    return listeners.filter(item => item.type === type);
}


class EventManagerEvent {
    /**
     * @type {String}
     */
    type

    /**
     * @type {any}
     */
    data

    constructor({type, data}) {
        this.type = type;
        this.data = data;
    }
}


/**
 * @class module:EventManager
 */
export class EventManager {

    #listeners;
    #useasync;

    get length() {
        return this.#listeners.length;
    }

    constructor(useasync = true) {
        this.#listeners = [];
        this.#useasync = useasync === true;
    }


    /**
     * @param {String} type
     * @param {(function(Event|EventManagerEvent):void)} listener
     * @param {Boolean} once
     * @return {EventManager}
     */
    on(type, listener, once = false) {

        if (!isString(type)) {
            throw new TypeError('Invalid event type, not a String.');
        }

        if (!isFunction(listener)) {
            throw new TypeError('Invalid listener, not a function');
        }


        type.split(/\s+/).forEach(type => {
            this.#listeners.push({
                type, listener, once: once === true,
            });
        });

        return this;
    }

    /**
     * @param {String} type
     * @param {(function(Event|EventManagerEvent):void)} listener
     * @return {EventManager}
     */

    one(type, listener) {
        return this.on(type, listener, true);
    }

    /**
     * @param {String} type
     * @param {(function(Event|EventManagerEvent):void)|null} listener
     * @return {EventManager}
     */
    off(type, listener = null) {

        if (!isString(type)) {
            throw new TypeError('Invalid event type, not a String.');
        }

        type.split(/\s+/).forEach(type => {

            this.#listeners = this.#listeners.filter(item => {
                if (type === item.type) {
                    if (listener === item.listener || !listener) {
                        return false;
                    }
                }
                return true;
            });
        });
        return this;
    }

    /**
     * @param {String|Event} type
     * @param {*} data
     * @param {Boolean} async
     * @return {EventManager}
     */
    trigger(type, data = null, async = null) {

        let event;

        async ??= this.#useasync;

        if (type instanceof Event) {
            event = type;
            event.data ??= data;
            type = event.type;
        }

        if (!isString(type)) {
            throw new TypeError('Invalid event type, not a String|Event.');
        }


        const types = [];

        type.split(/\s+/).forEach(type => {

            if (types.includes(type)) {
                return;
            }

            types.push(type);

            for (let item of getListenersForEvent(this.#listeners, type)) {

                if (item.type === type) {

                    if (async) {
                        runAsync(item.listener, event ?? new EventManagerEvent({type, data}));

                    } else {
                        item.listener(event ?? new EventManagerEvent({type, data}));
                    }

                    if (item.once) {
                        this.off(type, item.listener);
                    }
                }
            }


        });

        return this;
    }


    /**
     * @param {Object} binding
     * @return {EventManager}
     */

    mixin(binding) {

        if (binding instanceof Object) {

            ['on', 'off', 'one', 'trigger'].forEach(method => {
                Object.defineProperty(binding, method, {
                    enumerable: false, configurable: true,
                    value: (...args) => {
                        this[method](...args);
                        return binding;
                    }
                });
            });

        }

        return this;
    }


    /**
     * @param {Object} binding
     * @param {Boolean} useasync
     * @return {EventManager}
     */
    static mixin(binding, useasync = true) {
        return (new EventManager(useasync)).mixin(binding);
    }

    /**
     * @param {String} type
     * @param {(function(Event|EventManagerEvent):void)} listener
     * @param {Boolean} once
     * @return {EventManager}
     */
    static on(type, listener, once = false) {

        return instance.on(type, listener, once);
    }

    /**
     * @param {String} type
     * @param {(function(Event|EventManagerEvent):void)} listener
     * @return {EventManager}
     */
    static one(type, listener) {

        return instance.one(type, listener);
    }


    /**
     * @param {String} type
     * @param {(function(Event|EventManagerEvent):void)|null} listener
     * @return {EventManager}
     */

    static off(type, listener) {

        return instance.off(type, listener);
    }

    /**
     * @param {String|Event} type
     * @param {*} data
     * @param {Boolean} async
     * @return {EventManager}
     */
    static trigger(type, data = null, async = null) {

        return instance.trigger(type, data, async);
    }

}


const instance = new EventManager();

export default EventManager
