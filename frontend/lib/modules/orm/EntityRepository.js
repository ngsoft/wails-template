import {getClass, isFunction, isNumber, isString} from "@/modules/utils/index.js";
import {Repository} from "@/modules/orm/Repository.js";
import {Entity} from "@/modules/orm/Entity.js";

// noinspection JSUnusedGlobalSymbols
export class EntityRepository {

    /**
     * @private
     * @type {Repository}
     */
    #repository

    /**
     * @private
     * @type {Entity|Function}
     */
    #type

    /**
     * @return {Repository}
     */
    get repo() {
        return this.#repository;
    }

    /**
     * @protected
     * @return {Entity|Function}
     */
    get type() {
        return this.#type;
    }

    /**
     * @return {AbstractDriver}
     */
    get driver() {
        return this.repo.driver;
    }

    constructor(repository, type) {

        assertValidEntity(type);

        this.#type = type;

        if (!(repository instanceof Repository)) {
            throw new TypeError('Invalid repository');
        }
        this.#repository = repository;
        this.#type = type;
    }


    /**
     * Attach a lifetime hook to an entity
     *
     * @see {EntityEvent}
     * @param {String|String[]} type The lifetime hook type
     * @param {(function({type:String,data:EventData}):void)} listener
     * @param {Boolean} once
     */
    addEventListener(type, listener, once = false) {
        this.repo.addEventListener(this.type, type, listener, once);
    }

    /**
     * Detach a lifetime hook from an entity
     *
     * @see {EntityEvent}
     * @param {String|String[]} type The lifetime hook type
     * @param {(function({type:String,data:EventData}):void)|null|undefined} listener if not defined all listeners will be removed
     */
    removeEventListener(type, listener = null) {
        this.repo.removeEventListener(this.type, type, listener);
    }

    /**
     * @param {{}} data
     * @return {Promise<Entity|*>}
     */
    make(data) {
        return this.repo.make(this.type, data);
    }

    /**
     * @param {{}} data
     * @return {Promise<Entity|*>}
     */
    add(data) {
        return this.repo.add(this.type, data);
    }

    /**
     * @param {{}} data
     * @return {Promise<Entity|*>}
     */
    set(data) {
        return this.repo.set(this.type, data);
    }

    /**
     * @param {{}[]} entries
     * @return {Promise<Entity[]|*>}
     */
    setMany(entries = []) {
        return this.repo.setMany(this.type, entries);
    }

    /**
     * @param {Entity} entity
     * @return {Promise<{(Entity|*)}>}
     */
    update(entity) {

        if (getClass(entity) !== type(this.type)) {

            throw new TypeError('Invalid entity');

        }

        return this.repo.update(entity);
    }

    /**
     * @param {String|Number|Entity|Function} id
     * @return {Promise<void>}
     */
    async delete(id) {

        if (!isString(id) && !isNumber(id)) {
            assertValidEntity(id);
            if (!id.id) {
                return;
            }
            id = id.id;
        }

        await this.repo.delete(this.type, id);

    }

    /**
     * @return {Promise<void>}
     */
    async clear() {
        await this.repo.clear(this.type);
    }


    /**
     * @return {Promise<Entity[]|*>}
     */
    findAll() {
        return this.repo.findAll(this.type);
    }

    /**
     * @param id
     * @return {Promise<Entity|*|null>}
     */
    findById(id) {
        return this.repo.findById(this.type, id);
    }

    /**
     * @param {({})|(function(Entity):Boolean)} constrain
     * @return {Promise<Entity[]|*>}
     */
    find(constrain = {}) {
        return this.repo.find(this.type, constrain);
    }

    /**
     * @param {({})|(function(Entity):Boolean)} constrain
     * @return {Promise<Entity|*|null>}
     */
    findOne(constrain = {}) {
        return this.repo.findOne(this.type, constrain);
    }


    /**
     * @param {(function(Entity[]|*):void)} updater
     * @return {Unsubscriber}
     */
    subscribe(updater) {
        return this.repo.subscribe(this.type, updater);
    }


    /**
     * @return {Readable<Entity[]|*>}
     */
    createReadableStore() {
        return this.repo.createReadableStore(this.type);
    }


}


/**
 * @param {Entity|Function} entity
 * @return {String}
 */
function type(entity) {
    return getClass(entity);
}

function isValidEntity(entity) {
    if (isFunction(entity) && (new entity) instanceof Entity) {
        return true;
    }
    return entity instanceof Entity;
}


function assertValidEntity(entity) {
    if (!isValidEntity(entity)) {
        throw new TypeError('Invalid Entity');
    }
}
