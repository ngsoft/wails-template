import {BackedEnum} from "@/modules/utils/index.js";

/**
 * @property {String} value
 */
export class Condition extends BackedEnum {
    static Equal = new Condition(0);
    static Contain = new Condition(1);
    static Matches = new Condition(2);
}