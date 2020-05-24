import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)
	
	
const store = new Vuex.Store({
	state:{
		userInfo:{

		}
	},
	mutations:{
		setUserInfo(state, userInfo){
			state.userInfo = userInfo
			
		}
	}


})


export default store