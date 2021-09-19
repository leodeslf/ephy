import { writable } from "svelte/store";

const rendering = writable(false);
const progress = writable(0);

export { rendering, progress };
