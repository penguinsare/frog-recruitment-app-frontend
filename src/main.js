import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import mgr from './services/security.js'
import axios from 'axios'
import store from './vuexStore'
import { TablePlugin } from 'bootstrap-vue'

Vue.use(TablePlugin)

Vue.use(BootstrapVue)



Vue.config.productionTip = false
//axios.defaults.baseURL = 'https://some-crm.azurewebsites.net';
axios.defaults.baseURL = 'https://localhost:57042';
//axios.defaults.baseURL = 'https://polytech-software.com';
// axios.defaults.baseURL = 'https://crm.leap-intl.com';
const globalData = {
  isAuthenticated: false,
  user: '',
  mgr: mgr
}


const globalMethods = {
  async authenticate(returnPath) {
    const user = await this.$root.getUser(); //see if the user details are in local storage
    if (!!user) {
      this.isAuthenticated = true;
      this.user = user;
    } else {
      await this.$root.signIn(returnPath);
    }
  },
  async getUser () {
    try {
      let user = await this.mgr.getUser();
      return user;
    } catch (err) {
    }
  },
  signIn (returnPath) {
    returnPath ? this.mgr.signinRedirect({ state: returnPath })
        : this.mgr.signinRedirect();
  },
  signout (returnPath) {
    returnPath ? this.mgr.signoutRedirect({ state: returnPath })
        : this.mgr.signoutRedirect();
  }
}

let v = new Vue({
  router,
  data: globalData,
  store: store,
  methods: globalMethods,
  render: h => h(App),
  beforeCreate() {
		this.$store.commit('initialiseStore');
	}
}).$mount('#app')

axios.interceptors.request.use((config) => {
  const user = store.getters.user;
  if (user) {
    const authToken = user.access_token;
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
  }
  return config;
},
(err) => {
});
