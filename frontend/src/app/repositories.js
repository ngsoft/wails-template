import {DataStoreDriver, Repository} from "@/modules/orm/index.js";
import {SharedStore} from "@/modules/storage/index.js";


export const defaultRepository = new Repository(
    new DataStoreDriver(
        SharedStore
    )
);