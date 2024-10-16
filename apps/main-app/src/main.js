import { createApp } from 'vue';
import App from './App.vue';
import { registerMicroApps, start } from 'qiankun';
import router from './router';
import { createPinia } from 'pinia';

const app = createApp(App);
registerMicroApps([
  {
    name: 'sub-app-1',
    entry: '//localhost:8091',
    container: '#subapp-container-1',
    activeRule: '/sub-app-1',
  },
  {
    name: 'sub-app-2',
    entry: '//localhost:8092',
    container: '#subapp-container-2',
    activeRule: '/sub-app-2',
  },
]);

start();
app.use(router);
app.use(createPinia());
app.mount('#app');
