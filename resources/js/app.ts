import { createApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import router from "@/router";
import i18n from '@/i18n';
import { VueQueryPlugin } from '@tanstack/vue-query'
import Vue3Toastify from 'vue3-toastify';

import './bootstrap';
import 'bootstrap';
import './vee-validate';
import 'vue3-toastify/dist/index.css';

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(VueQueryPlugin);
app.use(router);
app.use(i18n);
app.use(Vue3Toastify);
app.mount("#app");
