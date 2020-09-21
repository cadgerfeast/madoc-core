// Libs
import Vue from 'vue';
// Files
import App from './App.vue';
import './registerServiceWorker';
import { router } from './router';
import { store } from './store';

// Components
import '@/components/custom';

// Production
Vue.config.productionTip = false;

// Create Main Vue Instance
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
