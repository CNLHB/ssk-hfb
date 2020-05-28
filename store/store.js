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
		addChatMessage(state, obj){
			state.chatList[obj.index].message = obj.message
			state.chatList[obj.index].time = obj.time
			state.chatList[obj.index].afterTime = +new Date(obj.sendTime)
			state.chatList[obj.index].messages.push(obj)
		},
		sortChatList(state){
			state.chatList.sort((a,b)=>{
				return b.afterTime - a.afterTime
			})
		},
		addNoreadMessage(state, index){
			state.chatList[index].noreadnum = state.chatList[index].noreadnum + 1
		}
	}


})


export default store