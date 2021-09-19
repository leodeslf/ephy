import { readable, writable } from "svelte/store";

// Canvas.
const width = writable();
const height = writable();

// Tweak.
const margin = readable(30);
const scale = writable(1);

// Cycloid.
const radius = writable();

export { width, height, scale, margin, radius };
