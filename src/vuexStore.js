import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
      count: 0,
      isAuthenticated: false,
      user: null,
    },
    mutations: {
        initialiseStore(state) {
            // Check if the ID exists
            if(localStorage.getItem('store')) {
                // Replace the state object with the stored item
                this.replaceState(
                    Object.assign(state, JSON.parse(localStorage.getItem('store')))
                );
            }
        },
      increment (state) {
        state.count++
      },
      authenticationSuccessful (state){
        state.isAuthenticated = true
      },
      authenticationRequired (state){
        state.isAuthenticated = false
      },
      loadUser (state, payload){
        state.user = payload
      },
      unloadUser (state){
          state.user = null;
      }               
    },
    getters: {
      isAuthenticated: state => {
        return state.isAuthenticated
      },
      user: state => {
          return state.user
      },     
    }
  })
  
export default store;

store.subscribe((mutation, state) => {
	// Store the state object as a JSON string
	localStorage.setItem('store', JSON.stringify(state));
});