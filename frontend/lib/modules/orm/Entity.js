import {getClass, isFunction, isUndef} from "@/modules/utils/index.js";


/**
 * @type {Map<String, string[]>}
 */
const properties = new Map;


/**
 * @param {Entity} entity
 * @return {string[]}
 */
function getProperties(entity) {
    const type = getClass(entity);

    if (!properties.has(type)) {

        let all = new Set, instance = entity;
        while (instance) {
            const descriptors = Object.getOwnPropertyDescriptors(instance);
            for (let prop in descriptors) {
                let descriptor = descriptors[prop];

                if (descriptor.enumerable && descriptor.writable && descriptor.configurable) {

                    if (isFunction(descriptor.value) || descriptor.get || descriptor.set) {
                        continue;
                    }
                    all.add(prop);
                }
            }
            instance = Object.getPrototypeOf(instance)
        }
        properties.set(type, [...all]);
    }

    return properties.get(type);
}

function initializeEntity(entity, data) {

    const props = getProperties(entity);
    for (let prop in data) {
        try {
            let value = data[prop];
            // protected props
            if (!props.includes(prop) && props.includes('_' + prop)) {
                prop = '_' + prop;
            }
            entity[prop] = value;
            if (!props.includes(prop)) {
                console.warn(
                    'Data property ',
                    prop,
                    ' for Entity ',
                    getClass(entity),
                    'is not declared.'
                );
            }

        } catch (err) {
            console.warn(err.message);
        }

    }

}


/**
 * @param {Entity} entity
 * @return {{}}
 */
function extractData(entity) {
    const result = {};
    for (let prop of getProperties(entity)) {
        if (!isUndef(entity[prop])) {
            result[prop] = entity[prop];
        }
    }
    return result;
}


/**
 * @class
 * @abstract
 */
export class Entity {

    /** @type {Number|String} */
    id


    /**
     * @return {{}}
     */
    extract() {
        return extractData(this);
    }

    /**
     * @param {{}} data
     * @return {Promise<void>}
     */
    async initialize(data) {
        initializeEntity(this, data);
    }

}

