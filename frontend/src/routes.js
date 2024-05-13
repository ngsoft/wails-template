export const routes = new Map();
export default routes;

// set your standalone components there
routes.set('.input-map-widget[data-target]', () => import("@/components/Input/MapType.svelte"));
routes.set('.input-set-widget[data-target]', () => import("@/components/Input/SetType.svelte"));
routes.set('.input-map-set-widget[data-target]', () => import("@/components/Input/MapSetType.svelte"));
// routes.set('#app', () => import("app/demo/App.svelte"));
