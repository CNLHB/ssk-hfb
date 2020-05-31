<template>
	<view class="body">

		<paper-left-popup :show="show" @hide="hidepopup" @addfriend="addfriend" @clear="clear">
		</paper-left-popup>

		<!-- 小纸条列表 -->
		<uni-swipe-action>
			<block v-for="(item,index) in chatList" :key="index">
				<uni-swipe-action-item :options="options" @onClick="onClick(item,index)" >
					<paper-list @readMsg="readMsg" :item="item" :index="index"></paper-list>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>

		<!-- 按组使用 -->
		<!-- 上拉加载 -->
		<load-more :loadtext="loadtext"></load-more>
	</view>
</template>

<script>
	import paperList from "../../components/paper/paper-list.vue";
	import loadMore from "../../components/common/load-more.vue";
	import paperLeftPopup from "../../components/paper/paper-left-popup.vue";
	import time from '../../common/time.js'
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import {
		mapMutations,
		mapState,
		mapGetters
	} from 'vuex'
	import Vue from 'vue'
	export default {
		components: {
			paperList,
			loadMore,
			paperLeftPopup,
			uniSwipeAction,
			uniSwipeActionItem
		},
		computed: {
			...mapState(['chatList', 'msgIndex', 'userInfo', 'isPaper']),
			...mapGetters(['currentChatMsgs'])
		},

		data() {
			return {
				show: false,
				socketTask: null,
				is_open_socket: false,
				loadtext: "",
				list: [],
				$is_open_socket_paper: false,
				options: [
					// {
					//     text: '置顶',
					//     style: {
					//         backgroundColor: '#007aff'
					//     }
					// }, 
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]

			};
		},
		onShow() {
			this.connectSocketInit();
			if (this.userInfo.id) {
				this.getChatList()
				this.loadtext = ''
			}

		},
		// 监听下拉刷新
		async onPullDownRefresh() {
			
			if (this.userInfo.id) {
				await this.getChatList()


			} else {
				this.loadtext = '你还未登录呢!'
			}
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.loadmore();
		},
		async onLoad() {
			if (this.userInfo.id) {} else {
				this.loadtext = "你还未登录呢!"
			}
		},
		// 监听导航按钮点击事件
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0:
					if (this.userInfo.id) {
						uni.navigateTo({
							url: '../user-list/user-list',
						});
					} else {
						uni.showToast({
							title: "你还未登录呢！",
							icon: 'none'
						})
					}

					this.hidepopup();
					break;
				case 1:
					this.showpopup();
					break;
			}
		},
		onHide() {
			this.$is_open_socket_paper = false

		},
		beforeDestroy() {
			this.closeSocket();
		},
		methods: {
			...mapMutations([
				'setChatList',
				'setIndex',
				'delChatList',
				'updateMsg',
				'addChatList',
				'sortChatList',
				'addChatMessage',
				'addNoreadMessage'
			]),
			async getChatList() {
				this.$http.setLoading(false);
				let data = await this.$http.get('chat/list');
				this.$http.setLoading(true);
				if (data && data.length) {
					let chatList = data.map((item) => {
						let count = item.messages.reduce((prev, item) => {
							if (item.status == 0 && item.toId == this.userInfo.id) {
								return prev + 1
							} else {
								return prev
							}
						}, 0)
						let fid = this.userInfo.id == item.fromId ? item.toId : item.fromId
						let len = item.messages.length - 1
						let sendTime = item.messages[len] ?
							time.gettime.gettime(item.messages[len].sendTime) :
							time.gettime.gettime(new Date())
						let message = item.messages[len] ? item.messages[len].message :
							''
						let msgList = item.messages.map((mItem) => {
							return {
								id: mItem.id,
								isme: mItem.fromId == this.userInfo.id,
								uid: mItem.fromId == this.userInfo.id ?mItem.toId : mItem.fromId ,
								userpic: mItem.fromId == this.userInfo.id ? this.userInfo.authorUrl : item.userpic,
								type: "text",
								message: mItem.message,
								time: time.gettime.gettime(mItem.sendTime),
								gstime: time.gettime.getChatTime(mItem.sendTime),
								status: mItem.status,
							}
						})
						return {
							id: item.id,
							fid: fid,
							fromId: item.fromId,
							toId: item.toId,
							afterTime: +new Date(item.afterTime),
							userpic: item.userpic,
							username: item.username,
							time: sendTime,
							message: message,
							noreadnum: count,
							messages: msgList
						}
					})
					this.setChatList(chatList);
					this.sortChatList()
					uni.setStorageSync('chatList', JSON.stringify(this.chatList))
				}

			},
			onClick(item,index) {
				this.$http.setLoading(false);
				this.$http.delete('chat',{
					cids: [item.id]
				},{
					"content-type":"application/x-www-form-urlencoded"
				});
				this.$http.setLoading(true);
				this.delChatList(index)

			},
			async connectSocketInit() {
				let uid = this.userInfo.id
				if (!uid || Vue.prototype.$is_open_socket) {
					return
				}
				// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
				if (uid) {
					this.$http.websocket('POST', "msg/" + 88)
					Vue.prototype.$socket = await this.$http.websocket('POST', "msg/" + uid)
					// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
					Vue.prototype.$socket.onOpen((res) => {
						console.log("WebSocket连接正常打开中...！");

						Vue.prototype.$is_open_socket = true;
						if (Vue.prototype.$is_open_socket) {
							Vue.prototype.$socket.onMessage(async (res) => {
								if (res.data === "连接成功") {
										console.log("连接成功")
									return
								}
								console.log("收到消息并追加")
								let data = {}
								try {
									data = JSON.parse(res.data);
								} catch (e) {

								}
								let index = -1;
								for (let i = 0; i < this.chatList.length; i++) {
									if (this.chatList[i].toId == data.fromId) {
										index = i
										break
									}
								}
								if (index != -1 && this.msgIndex == index) {
									this.$http.setLoading(false);
									this.$http.put('chat/read', {
										mids: [data.id]
									}, {
										"content-type": "application/x-www-form-urlencoded"
									})
									this.$http.setLoading(true);
								}
								this.getChatList()


							});
						}
					})
					// 这里仅是事件监听【如果socket关闭了会执行】
					Vue.prototype.$socket.onClose(() => {
						Vue.prototype.$is_open_socket = false
						console.log("已经被关闭了")
					})
					Vue.prototype.$socket.onError((e) => {
						console.log("失败了")
						Vue.prototype.$is_open_socket = false
						console.log(e)
					})
				}
			},
			// 关闭websocket【离开这个页面的时候执行关闭】
			closeSocket() {
				if (this.is_open_socket) {
					Vue.prototype.$socket.close({
						success(res) {
							this.is_open_socket = false;
							console.log("关闭成功", res)
						},
						fail(err) {
							console.log("关闭失败", err)
						}
					})
				}
			},
			readMsg(index) {
				this.setIndex(index)
				if (this.currentChatMsgs.length == 0) {
					return
				}
				if (this.chatList[index].noreadnum == 0) {
					console.log(this.chatList[index])
					return
				}
				let msgs = this.currentChatMsgs.filter((item => {
					if (item.id && item.status == false) {
						return true
					} else {
						return false
					}
				}));
				let mids = msgs.map((item => {
					return item.id
				}));
				this.$http.put('chat/read', {
					mids: mids
				}, {
					"content-type": "application/x-www-form-urlencoded"
				})
				this.updateMsg(index)

			},
			// 操作菜单
			addfriend() {
				console.log("加韩友");
				uni.navigateTo({
					url: '../user-search/user-search'
				})
				this.hidepopup();

			},
			clear() {
				console.log("清除列表");
				uni.showModal({
					title:"提示",
					content:"是否清除列表",
					cancelText:"取消",
					success:async (e)=> {
						if(e.confirm==true){
							let cids= this.chatList.map((item)=>{
								return item.id
							})
							if(cids.length==0){
								return
							}
							this.setChatList([])
							this.$http.setLoading(false);
							await this.$http.delete('chat',{
								cids: cids
							},{
								"content-type":"application/x-www-form-urlencoded"
							});
							this.$http.setLoading(true);
							this.setChatList([])
							// uni.clearStorageSync("chatList")
						}
					}
				})
				this.hidepopup();
			},
			hidepopup() {
				this.show = false;
			},
			showpopup() {
				this.show = true;
			},
			// 上拉加载
			loadmore() {
				if (this.loadtext != "") {
					return;
				}
				// 修改状态
				this.loadtext = "加载中...";
				// 获取数据
				this.loadtext = "没有更多数据了";
			},
		}
	}
</script>

<style>
	.body {
		padding: 0 20upx;
	}
</style>
