import Vue from 'vue';
import '@/main.js';

describe('main.js', () => {
  it('should be defined', () => {
    expect(Vue.config.productionTip).toEqual(false);
  });
});
