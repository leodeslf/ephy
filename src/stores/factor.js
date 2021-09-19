import { writable } from "svelte/store";

/**
 * Factor for r2.
 * 
 * - Generates epicycloid when it's value is 1.
 * - Generates epitrochoid when it's value is not 1.
 */
const factor = writable(1);

export { factor };
