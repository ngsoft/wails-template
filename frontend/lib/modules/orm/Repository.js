// noinspection JSUnusedGlobalSymbols

import {AbstractDriver} from "./AbstractDriver.js";
import {encode, getClass, isArray, isFunction, isObject, isString, uniqid} from "@/modules/utils";
import {readable} from "svelte/store";
import {EntityRepository} from "@/modules/orm/EntityRepository.js";
import {Entity} from "@/modules/orm/Entity.js";
import EventManager from "@/modules/utils/event-manager.js";

const

    /**
     * @type {Map<String, Repository>}
     */
    instances = new Map,
    /**
     * @type {Set<Function>}
     */
    validEntities = new Set,
    /**
     * @type {Map<Entity, Repository>}
     */
    repositories = new Map;


/**
 * @param {String} alias
 * @return {Repository|null}
 */
export function getRepository(alias = 'default') {
    return instances.get(alias);
}


/**
 * @param {Entity} entity
 * @return {Repository|null}
 */
export function getEntityRepository(entity) {
    return repositories.get(entity) ?? null;
}


export class EntityEvent {
    static beforeCreate = 'beforeCreate';
    static afterCreate = 'afterCreate';
    static beforeUpdate = 'beforeUpdate';
    static afterUpdate = 'afterUpdate';
    static beforeDelete = 'beforeDelete';
    static afterDelete = 'afterDelete';
}

class EntityCache {

    /**
     * @type {Map <String,Entity>}
     */
    data
    /**
     * @type {String}
     */
    type

    /**
     * @param {Entity|Function} entity
     */
    constructor(entity) {
        assertValidEntity(entity);
        this.type = type(entity);
        this.data = new Map;
    }


    /**
     * @param {String|Number} id
     * @return {Entity|null}
     */
    getItem(id) {
        return this.data.get(_uid(id, this.type)) ?? null;
    }

    /**
     * @param {Entity} entity
     */

    setItem(entity) {
        if (entity instanceof Entity && entity.id) {
            this.data.set(getUid(entity), entity);
        }
    }

    /**
     * @param {String|Number} id
     */

    removeItem(id) {
        this.data.delete(_uid(id, this.type));
    }

    /**
     * @param {String|Number} id
     * @param {(function(Entity|null):Entity|null)} fn
     */
    updateItem(id, fn) {
        let entity = fn(this.getItem(id));
        if (isValidEntity(entity) && entity.id === id) {
            this.setItem(entity);
        }
    }


}


class EventData {
    /**
     * The entity name
     * @type {string}
     */
    type
    /**
     * Entity instance
     * @type {Entity|*}
     */
    entity

    /**
     * @type {Repository}
     */
    repository

    constructor(entity, repository) {
        this.type = type(entity);
        this.entity = entity;
        this.repository = repository;
    }
}


const globalEvents = new EventManager(false);

/**
 * @param {String|String[]} type
 * @param {Entity|Function} entity
 * @return {String}
 */
function getEventType(type, entity) {
    if (!isArray(type)) {
        if (!isString(type)) {
            throw new TypeError('Invalid type');
        }
        type = type.split(/\s+/);
    }
    return type.map(t => getClass(entity) + '.' + t).join(' ');
}

class ObservableRepository {


    /**
     * Attach a lifetime hook to an entity globally
     *
     * @see {EntityEvent}
     * @param {Entity|Function} entity The entity to listen to
     * @param {String|String[]} type The lifetime hook type
     * @param {(function({type:String,data:EventData}):void)} listener
     * @param {Boolean} once
     */
    static addEventListener(entity, type, listener, once = false) {
        globalEvents.on(getEventType(type, entity), listener, once);
    }

    /**
     * Detach a lifetime hook from an entity globally
     *
     * @see {EntityEvent}
     * @param {Entity|Function} entity The entity to listen to
     * @param {String|String[]} type The lifetime hook type
     * @param {(function({type:String,data:EventData}):void)|null|undefined} listener if not defined all listeners will be removed
     */
    static removeEventListener(entity, type, listener = null) {
        globalEvents.off(getEventType(type, entity), listener);
    }

    /**
     * @private
     * @type {EventManager}
     */
    #events

    constructor() {
        this.#events = new EventManager(false);
    }

    /**
     * Attach a lifetime hook to an entity
     *
     * @see {EntityEvent}
     * @param {Entity|Function} entity The entity to listen to
     * @param {String|String[]} type The lifetime hook type
     * @param {(function({type:String,data:EventData}):void)} listener
     * @param {Boolean} once
     */
    addEventListener(entity, type, listener, once = false) {
        this.#events.on(getEventType(type, entity), listener, once);
    }

    /**
     * Detach a lifetime hook from an entity
     *
     * @see {EntityEvent}
     * @param {Entity|Function} entity The entity to listen to
     * @param {String|String[]} type The lifetime hook type
     * @param {(function({type:String,data:EventData}):void)|null|undefined} listener if not defined all listeners will be removed
     */
    removeEventListener(entity, type, listener = null) {
        this.#events.off(getEventType(type, entity), listener);
    }

    /**
     * @protected
     * @param {String} type
     * @param {Entity} entity
     */
    dispatchEvent(type, entity) {
        const event = new EventData(entity, this);
        globalEvents.trigger(getEventType(type, entity), event);
        this.#events.trigger(getEventType(type, entity), event);
    }


}


export class Repository extends ObservableRepository {

    /**
     * @private
     * @type {AbstractDriver}
     */
    #driver

    /**
     * @private
     * @type {string}
     */
    #alias = ''

    /**
     * @private
     * @return {Map<String, EntityCache>}
     */
    #cache

    /**
     * @private
     * @type {Map<String, EntityRepository>}
     */
    #proxies

    /**
     * @return {AbstractDriver}
     */
    get driver() {
        return this.#driver;
    }

    /**
     * @return {string}
     */
    get alias() {
        return this.#alias;
    }

    /**
     * @protected
     * @param {Entity|Function} entity
     * @return {EntityCache}
     */
    getEntityCache(entity) {
        let type = getClass(entity);
        if (!this.#cache.has(type)) {
            this.#cache.set(type, new EntityCache(entity));
        }
        return this.#cache.get(type);
    }


    constructor(driver, alias = 'default') {
        super();
        if (!(driver instanceof AbstractDriver)) {
            throw new TypeError('Invalid Driver');
        }

        if (!isString(alias) || '' === alias) {
            throw new TypeError('Invalid alias');
        }

        if (instances.has(alias)) {
            throw new Error('Repository ' + alias + ' is already registered');
        }
        this.#cache = new Map;
        this.#proxies = new Map;
        this.#alias = alias;
        this.#driver = driver;
        instances.set(alias, this);

    }

    /**
     * @param {Entity|Function} entity
     * @return {EntityRepository}
     */
    getEntityRepository(entity) {
        assertValidEntity(entity);
        if (!this.#proxies.has(type(entity))) {
            this.#proxies.set(type(entity), new EntityRepository(this, entity));
        }
        return this.#proxies.get(type(entity));
    }

    /**
     * @param {Entity|Function} entity
     * @param {{}} data
     * @return {Promise<Entity>}
     */
    async make(entity, data) {
        assertValidEntity(entity);
        if (!isObject(data)) {
            throw new TypeError(
                'Invalid data'
            );
        }

        return initializeEntity(this, entity, data);
    }


    /**
     * @param {Entity|Function} entity
     * @param {{}} data
     * @return {Promise<Entity>}
     */
    async add(entity, data) {

        assertValidEntity(entity);
        if (!isObject(data)) {
            throw new TypeError(
                'Invalid data'
            );
        }

        if (data.id) {
            let cached = this.getEntityCache(entity).getItem(data.id);
            if (cached instanceof Entity) {
                return cached;
            }
        }


        const instance = await this.make(entity, data);
        // lifetime hook beforeCreate
        this.dispatchEvent(EntityEvent.beforeCreate, instance);


        await this.driver.updateItem(
            type(entity),
            arr => [
                ...arr.filter(x => x.id !== instance.id),
                instance.extract()
            ]
        );

        this.getEntityCache(entity).setItem(instance);
        // lifetime hook afterCreate
        this.dispatchEvent(EntityEvent.afterCreate, instance);
        return instance;
    }


    /**
     * @param {Entity|Function} entity
     * @param {{}} data
     * @return {Promise<Entity>}
     */
    async set(entity, data) {

        assertValidEntity(entity);

        if (data && data.id) {
            await this.delete(entity, data.id);
        }
        return await this.add(entity, data);
    }

    /**
     * @param {Entity|Function} entity
     * @param {{}[]} entries
     * @return {Promise<Entity[]>}
     */
    async setMany(entity, entries = []) {
        assertValidEntity(entity);
        if (!isArray(entries)) {
            throw new TypeError('Invalid entries');
        }
        const result = [];
        for (let data of entries) {
            result.push(
                await this.set(entity, data)
            );

        }
        return result;

    }

    /**
     * @param {Entity} entity
     * @return {Promise<{Entity}>}
     */
    async update(entity) {

        assertValidEntity(entity);

        if (!entity.id) {
            throw new TypeError(
                'Invalid Entity'
            );
        }

        if (getEntityRepository(entity) !== this) {
            throw new Error(
                'This Repository does not manage that Entity'
            );
        }
        // lifetime hook beforeUpdate
        this.dispatchEvent(EntityEvent.beforeUpdate, entity);

        await this.driver.updateItem(
            type(entity),
            arr => [
                ...arr.filter(x => x.id !== entity.id),
                entity.extract()
            ]
        );
        this.getEntityCache(entity).setItem(entity);
        // lifetime hook afterUpdate
        this.dispatchEvent(EntityEvent.afterUpdate, entity);
        return entity;
    }

    /**
     *
     * @param {Entity|Function} entity
     * @param {String|Number|null} id
     * @return {Promise<void>}
     */
    async delete(entity, id = null) {
        assertValidEntity(entity);

        if (id === null && getEntityRepository(entity) !== this) {
            throw new Error(
                'This Repository does not manage that Entity'
            );
        }

        id ??= entity.id;
        if (!id) {
            throw new TypeError('Invalid id');
        }

        const instance = await this.findById(entity, id);
        // lifetime hook beforeDelete
        instance && this.dispatchEvent(EntityEvent.beforeDelete, instance);

        await this.driver.updateItem(
            type(entity),
            arr => arr.filter(x => x.id !== id)
        );
        this.getEntityCache(entity).removeItem(id);
        // lifetime hook afterDelete
        instance && this.dispatchEvent(EntityEvent.afterDelete, instance);

    }

    /**
     * @param {Entity|Function} entity
     * @return {Promise<void>}
     */
    async clear(entity) {
        assertValidEntity(entity);
        const loaded = [...this.getEntityCache(entity).data.values()];
        //cache clear
        this.getEntityCache(entity).data.clear();

        // lifetime hook beforeDelete
        loaded.forEach(x => this.dispatchEvent(EntityEvent.beforeDelete, x));
        // data reset
        await this.driver.setItem(type(entity), []);
        // lifetime hook afterDelete
        loaded.forEach(x => {
            repositories.delete(x);
            this.dispatchEvent(EntityEvent.afterDelete, x);
        });
    }

    /**
     * @param {Entity|Function} entity
     * @return {Promise<Entity[]>}
     */
    async findAll(entity) {
        assertValidEntity(entity);

        let result = [];
        for (let data of (await this.driver.getItem(type(entity)))) {

            let entry = this.getEntityCache(entity).getItem(data.id);
            if (!entry) {
                entry = await this.make(entity, data);
                this.getEntityCache(entity).setItem(entry);
            }
            result.push(entry);
        }
        return result;
    }

    /**
     * @param {Entity|Function} entity
     * @param id
     * @return {Promise<Entity|null>}
     */
    async findById(entity, id) {
        return (await this.findAll(entity)).find(x => {
            return x.id === id;
        }) ?? null;
    }

    /**
     * @param {Entity|Function} entity
     * @param {({})|(function(Entity):Boolean)} constrain
     * @return {Promise<Entity[]|*>}
     */
    async find(entity, constrain = {}) {

        if (!isObject(constrain) && !isFunction(constrain)) {
            throw new TypeError('Invalid constrain');
        }

        const all = await this.findAll(entity);

        if (isFunction(constrain)) {
            return all.filter(constrain);
        }

        if (!Object.keys(constrain)) {
            return all;
        }

        let results = [...all];

        for (let prop in constrain) {
            let condition = constrain[prop];
            if (isFunction(condition)) {
                results = results.filter(condition);
            } else {
                results = results.filter(x => encode(x[prop]) === encode(condition));
            }
        }

        return results;

    }

    /**
     *
     * @param {Entity|Function} entity
     * @param {({})|(function(Entity):Boolean)} constrain
     * @return {Promise<Entity|null>}
     */
    async findOne(entity, constrain = {}) {
        return (await this.find(entity, constrain))[0] ?? null
    }

    /**
     * @param {Entity|Function} entity
     * @param {(function(Entity[]):void)} updater
     * @return {Unsubscriber}
     */
    subscribe(entity, updater) {
        this.createReadableStore(entity).subscribe(updater);
    }

    /**
     * @param {Entity|Function} entity
     * @return {Readable<Entity[]>}
     */
    createReadableStore(entity) {
        assertValidEntity(entity);
        return readable([], set => {
            return this.driver.subscribe(type(entity), () => {
                this.findAll(entity).then(set);
            });
        });
    }


}

/**
 * @param {Entity|Function} entity
 * @return {String}
 */
function type(entity) {
    return getClass(entity);
}

/**
 * @param {String|Number} id
 * @param {Entity|Function|String} entity
 */
function _uid(id, entity) {
    let type = isString(entity) ? entity : getClass(entity);
    return type + ':' + id;
}

function getUid(entity) {
    if (!(entity instanceof Entity)) {
        throw new TypeError('Invalid Entity');
    }
    entity.id ??= uniqid();
    return _uid(entity.id, entity);
}

function isValidEntity(entity) {

    if (validEntities.has(entity)) {
        return true;
    }
    if (isFunction(entity) && (new entity) instanceof Entity) {
        validEntities.add(entity);
        return true;
    }

    return entity instanceof Entity;
}


function assertValidEntity(entity) {
    if (!isValidEntity(entity)) {
        throw new TypeError('Invalid Entity');
    }
}


/**
 * @param {Repository} repository
 * @param {Function} entity
 * @param {{id:string|int|null|undefined}} data
 * @return {Promise<Entity>}
 * @return {Entity}
 */
async function initializeEntity(repository, entity, data = {}) {
    if (!isFunction(entity) || !isValidEntity(entity)) {
        throw new TypeError('Invalid Entity');
    }
    if (!data.id) {
        data.id ??= uniqid();
    } else {
        uniqid.add(data.id);
    }
    const instance = new entity;
    instance.id = data.id
    repositories.set(instance, repository);
    await instance.initialize(data);
    return instance;
}

