/* eslint-disable no-console */

import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.info('Served from cache.');
    },
    registered () {
      console.info('Service Worker has been registered.');
    },
    cached () {
      console.info('Content has been cached.');
    },
    updatefound () {
      console.info('New content is downloading.');
    },
    updated () {
      console.info('New content is available, will be updated when refreshed.');
    },
    offline () {
      console.info('App is running in offline mode.');
    },
    error (error) {
      console.error('Error during service worker registration:', error);
    }
  });
}
