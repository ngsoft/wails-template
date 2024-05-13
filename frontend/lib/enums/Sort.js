import {BackedEnum} from "@/modules/utils";

/**
 * @property {String} value
 */
export class Sort extends BackedEnum {

    static ASC = new Sort('ASC');
    static DESC = new Sort('DESC');


    get label() {
        return {
            ASC: 'Ascending',
            DESC: 'Descending'
        }[this.value];
    }
}