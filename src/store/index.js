import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    theme: window.localStorage.getItem('madoc.theme') || 'default',
    themes: {
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
    },
    config: process.env.madocConfig
  },
  getters: {
    theme (state) {
      return state.theme;
    },
    themes (state) {
      return state.themes;
    },
    themeType (state) {
      return state.themes[state.theme] ? state.themes[state.theme].type : 'light';
    },
    pages (state) {
      return state.config.pages;
    }
  },
  mutations: {
    theme (state, theme) {
      window.localStorage.setItem('madoc.theme', theme);
      state.theme = theme;
    }
  }
});
