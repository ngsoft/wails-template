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

// demo app /!\ that method does not support dynamic asset loading (await import())
// for that please use the dom router
import App from "./demo/App.svelte";

export default new App({target: document.getElementById("app")});

// this is a dynamic router that detects dom changes and loads components inside it
// import router from "@/dom-router.js";
// import routes from "./routes";
// router(routes);

/** =========================================== */

/**
 * Put it last to override styles
 */
import 'assets/app.scss';
