import { writable } from "svelte/store";

const p = writable(101);
const q = writable(100);
const k = writable();

// For the irreducible fraction expression.
const irreducibleP = writable();
const irreducibleQ = writable();

export { p, q, k, irreducibleP, irreducibleQ };
