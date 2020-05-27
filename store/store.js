import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)
	
	
const store = new Vuex.Store({
	state:{
		userInfo:{},
		chatList:[]
	},
	mutations:{
		setUserInfo(state, userInfo){
			state.userInfo = userInfo
			
		},
		setChatList(state, chatList){
			state.chatList = chatList
			
		},
		addChatList(state, chat){
			state.chatList.unshift(chat)
			
		},
		updateMsg(state, index){
			state.chatList[index].noreadnum = 0
		},
		setChatMessage(state, obj){
		}
	}


})


export default store