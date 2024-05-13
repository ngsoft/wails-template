/**
 * Uses tailwind display: {.class}; to detect
 */
import '@/tailwind';

/**
 * Fonts Tailwind uses Roboto, sans-serif
 * imports material icons + Poppins fonts
 */
import '@/fonts';

/** =========  Import your app there  ========= */

import router from "@/dom-router.js";
import routes from "app/routes.js";
router(routes);

/** =========================================== */

/**
 * Put it last to override styles
 */
import 'assets/app.scss';
