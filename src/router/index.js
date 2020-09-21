// Libs
import Vue from 'vue';
import VueRouter from 'vue-router';
// Files
import Madoc from '../views/Madoc.vue';
import NotFound from '../views/404.vue';

Vue.use(VueRouter);

const madocRoutes = [];
for (const path of process.env.madocConfig.filePaths) {
  const splits = path.split('/');
  if (splits[splits.length - 1] === 'index') {
    splits.pop();
  }
  madocRoutes.push({
    path: `/${splits.join('/')}`,
    name: path,
    component: Madoc,
    meta: {
      title: process.env.madocConfig.pages[path].metadata.title
    }
  });
}

// Routes
const routes = [
  ...madocRoutes,
  // 404
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
];

export const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title;
  });
});