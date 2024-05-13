import ElementFinder from "@/modules/utils/element-finder.js";
import dataset from "@/modules/utils/dataset-reader.js";
import {isInt} from "@/modules/utils/index.js";

export const
    ALERT_SUCCESS = 'success',
    ALERT_ERROR = 'danger',
    ALERT_INFO = 'info',
    ALERT_WARNING = 'warning',
    ALERT_PRIMARY = 'primary',
    ALERT_SECONDARY = 'secondary',
    ALERT_ICONS = new Map([
        [ALERT_SUCCESS, 'check_circle'],
        [ALERT_ERROR, 'cancel'],
        [ALERT_INFO, 'info'],
        [ALERT_WARNING, 'warning'],
        [ALERT_PRIMARY, 'help'],
        [ALERT_SECONDARY, 'message'],
    ]),
    ALERT_ALIAS = new Map([
        ['error', ALERT_ERROR],
        ['ok', ALERT_SUCCESS],
        ['warn', ALERT_WARNING],
    ]);


/**
 * Alert auto-hide
 */

const reducedMotion = matchMedia('(prefers-reduced-motion)');
ElementFinder('[data-autohide].alert', alert => {

    const hide = () => {
        alert.remove();
    };

    let delay = dataset(alert, 'delay');

    if (!isInt(delay)) {
        delay = 2000;
    }
    // delay in seconds
    if (delay < 100) {
        delay *= 1000;
    }

    if (!reducedMotion.matches) {
        alert.addEventListener('animationend', () => {
            alert.classList.remove('opacity-0', 'fade-in');
            setTimeout(() => {
                alert.addEventListener('animationend', hide, {once: true});
                alert.classList.add('fade-out');
            }, delay);

        }, {once: true});
    } else {
        setTimeout(hide, delay);
    }

});