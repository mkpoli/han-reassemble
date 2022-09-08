import { writable } from "svelte/store";
export const overlay = writable(false);

export const config = writable({
  groupSize: 10,
  maxRetry: 2,
});