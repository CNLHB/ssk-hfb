import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)
	
	
const store = new Vuex.Store({
	state:{
		userInfo:{},
		chatList:[],
		isPaper:false,
		msgPage:1,
		msgIndex:-1,
		currentChat:[]
	},
	getters:{
		currentChatMsgs(state){
			if(state.msgIndex==-1){
				return []
			}
			let len = state.chatList[state.msgIndex].messages?state.chatList[state.msgIndex].messages.length : 0
			if(len>20){
				return state.chatList[state.msgIndex].messages.slice(len-20,len)
			}
			return state.chatList[state.msgIndex].messages||[]
		}
	},
	mutations:{
		setIndex(state, msgIndex){
			state.msgIndex = msgIndex
		},
		setUserInfo(state, userInfo){
			state.userInfo = userInfo
			
		},
		setChatList(state, chatList){
			state.chatList = chatList
			
		},
		delChatList(state, index){
			state.chatList.splice(index,1)
			
		},
		addChatList(state, chat){
			state.chatList.unshift(chat)
			
		},
		updateMsg(state, index){
			state.chatList[state.msgIndex].noreadnum = 0
		},
		addChatMessage(state, obj){
				state.chatList[state.msgIndex].message = obj.message
				state.chatList[state.msgIndex].time = obj.time
				state.chatList[state.msgIndex].afterTime = +new Date(obj.sendTime)
				state.chatList[state.msgIndex].messages.push(obj)

		},
		sortChatList(state){
			state.chatList.sort((a,b)=>{
				return b.afterTime - a.afterTime
			})
		},
		addNoreadMessage(state, index){
			state.chatList[index].noreadnum = state.chatList[index].noreadnum + 1
		}
	},
	actions:{
		addChatListMessage(state, data){
			
		}
	}


})


export default store