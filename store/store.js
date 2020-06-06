import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)
	
/**
 * 		userInfo: 用户信息
		chatList: 聊天列表
		msgPage:1,	消息的索引
		msgIndex:-1, 聊天界面索引
		currentChat: 当前聊天信息
		selTitle: 发布动态选择的标题
 */	
const store = new Vuex.Store({
	state:{
		userInfo:{},
		chatList:[],
		isPaper:false,
		msgPage:1,
		msgIndex:-1,
		currentChat:[],
		selTitle:{},
		category:{}
	},
	getters:{
		currentChatMsgs(state){
			if(state.msgIndex==-1){
				return []
			}
			let len = state.chatList[state.msgIndex].messages?state.chatList[state.msgIndex].messages.length : 0
			if(len>20){
				return state.chatList[state.msgIndex].messages.slice(Math.max(0,len-20*state.msgPage),len)
			}
			return state.chatList[state.msgIndex].messages||[]
		}
	},
	mutations:{
		addCategory(state, obj){
			state.category = obj
		},
		delCategory(state, ){
			state.category={}
		},
		addselTitle(state, obj){
			state.selTitle = obj
		},
		delSelTitle(state, index){
			state.selTitle={}
		},
		resetSelTitle(state){
			state.selTitle={}
		},
		setIndex(state, msgIndex){
			state.msgIndex = msgIndex
		},
		setMsgPage(state, msgPage){
			if(msgPage){
				state.msgPage = msgPage
			}else{
				state.msgPage++
			}
			
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