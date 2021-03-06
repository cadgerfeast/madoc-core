// Libs
import Vue from 'vue';
import EvaIcons from 'vue-eva-icons';
// Files
import App from './App.vue';
import './registerServiceWorker';
import { router } from './router';
import { store } from './store';

// Components
import '@/components/custom';

Vue.use(EvaIcons);

// Production
Vue.config.productionTip = false;

// Ignored Elements
Vue.config.ignoredElements = store.getters.config.ignoredElements.map((reg) => {
  return new RegExp(reg);
});

// Create Main Vue Instance
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
