import { writable } from "svelte/store";

const speedR1R2 = writable(0.005);
const iterations = writable(500);

export { speedR1R2, iterations };
