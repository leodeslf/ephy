import { writable } from "svelte/store"

const paramsIsVisible = writable(true);
const debugIsVisible = writable(false);

export { paramsIsVisible, debugIsVisible };
