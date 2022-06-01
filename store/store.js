import Vue from 'vue'
import Vuex from 'vuex'
// import createLogger from 'vuex/dist/logger'
import time from '../common/time.js'
import {
	createSocket,
	readChatMsg
} from '@/api/paper.js'
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
	state: {
		userInfo: {},
		chatList: [],
		isPaper: false,
		msgPage: 1,
		msgIndex: -1,
		currentChat: [],
		selTitle: {},
		category: {},
		socket: undefined,
		$is_open_socket: false
	},
	getters: {
		currentChatMsgs(state) {
			if (state.msgIndex == -1) {
				return []
			}
			let len = state.chatList[state.msgIndex].messages ? state.chatList[state.msgIndex].messages.length : 0
			if (len > 20) {
				return state.chatList[state.msgIndex].messages.slice(Math.max(0, len - 20 * state.msgPage), len)
			}
			return state.chatList[state.msgIndex].messages || []
		}
	},
	mutations: {
		addCategory(state, obj) {
			state.category = obj
		},
		delCategory(state, ) {
			state.category = {}
		},
		addselTitle(state, obj) {
			state.selTitle = obj
		},
		delSelTitle(state, index) {
			state.selTitle = {}
		},
		resetSelTitle(state) {
			state.selTitle = {}
		},
		setIndex(state, msgIndex) {
			state.msgIndex = msgIndex
		},
		setMsgPage(state, msgPage) {
			if (msgPage) {
				state.msgPage = msgPage
			} else {
				state.msgPage++
			}

		},
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo

		},
		setChatList(state, chatList) {
			state.chatList = chatList

		},
		delChatList(state, index) {
			state.chatList.splice(index, 1)

		},
		addChatList(state, chat) {
			state.chatList.unshift(chat)

		},
		updateMsg(state, index) {
			state.chatList[state.msgIndex].noreadnum = 0
		},
		addChatMessage(state, obj) {
			state.chatList[state.msgIndex].message = obj.message
			state.chatList[state.msgIndex].time = obj.time
			state.chatList[state.msgIndex].afterTime = +new Date(obj.sendTime)
			state.chatList[state.msgIndex].messages.push(obj)

		},
		sortChatList(state) {
			state.chatList.sort((a, b) => {
				return b.afterTime - a.afterTime
			})
		},
		addNoreadMessage(state, index) {
			state.chatList[index].noreadnum = state.chatList[index].noreadnum + 1
		},
		addSocket(state, soc) {
			state.socket = soc
		}
	},

	actions: {
		addChatListMessage(state, data) {
			console.log(888888)
		},
		async setSocketV({
			state,
			commit
		}, uid) {

			if (!state.$is_open_socket) {
				let socket = await createSocket(uid)
				socket.onOpen((res) => {
					console.log("WebSocket连接正常打开中...vuex！");
					state.$is_open_socket = true;
					if (state.$is_open_socket) {
						socket.onMessage(async (res) => {
							if (res.data === "连接成功") {
								console.log("连接成功")
								return
							}
							console.log("收到消息并追加")
							let data = {}
							try {
								data = JSON.parse(res.data);
								let flag = false
								if (Array.isArray(state.chatList)) {
									state.chatList.forEach((item, index) => {
										if (item.id == data.cId) {
											if (state.msgIndex == index) {
												flag = true
												state.chatList[index].noreadnum = 0
												data.status = true
												readChatMsg([data.id])
											} else {
												state.chatList[index].noreadnum = state.chatList[index].noreadnum + 1
											}
											state.chatList[index].message = data.message
											state.chatList[index].time = time.gettime.gettime(data.sendTime)
											state.chatList[index].afterTime = +new Date(data.sendTime)
											let o = {
												id: data.id,
												isme: data.fromId == state.userInfo.id,
												uid: data.fromId == state.userInfo.id ? data.toId : data.fromId,
												userpic: data.fromId == state.userInfo.id ? state.userInfo.authorUrl : item.userpic,
												type: "text",
												message: data.message,
												time: time.gettime.gettime(data.sendTime),
												gstime: time.gettime.getChatTime(data.sendTime),
												status: data.status,
											}
											state.chatList[index].messages.push(o)
										}
									})
								}
							} catch (e) {
								console.log(e)
							}

						});
					}
				})
				// 这里仅是事件监听【如果socket关闭了会执行】
				socket.onClose(() => {
					state.$is_open_socket = false
					console.log("已经被关闭了")
				})
				socket.onError((e) => {
					console.log("失败了")
					state.$is_open_socket = false
					console.log(e)
				})
				commit("addSocket", socket)
			}

		}
	}


})


export default store
