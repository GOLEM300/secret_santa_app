import {createApp} from "vue";
import App from './src/App.vue';
import router from "./src/router/index.js";
import store from "./src/store/index.js";

const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app');
