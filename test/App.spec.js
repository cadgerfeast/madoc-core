import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import App from '@/App.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('App.vue', () => {
  let $route;
  let pages;
  let store;
  beforeEach(() => {
    $route = {
      name: 'index'
    };
    pages = {
      'index': {
        metadata: {}
      }
    };
    store = new Vuex.Store({
      getters: {
        theme: () => 'default',
        themeType: () => 'light',
        pages: () => pages
      }
    });
  });
  it('should be defined', () => {
    const wrapper = shallowMount(App, {
      localVue,
      store,
      mocks: {
        $route
      }
    });
    expect(wrapper).toBeDefined();
  });
});
