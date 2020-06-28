import { writable, readable } from 'svelte/store';

export const theme = writable(window.localStorage.getItem('madoc.theme') || 'default');
export const themes = readable({
  default: {
    name: 'Default',
    type: 'light'
  },
  dark: {
    name: 'Dark',
    type: 'dark'
  },
  fresh: {
    name: 'Fresh',
    type: 'light'
  }
});

theme.subscribe((value) => {
  window.localStorage.setItem('madoc.theme', value);
});
