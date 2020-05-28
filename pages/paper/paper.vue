<template>
	<view class="body">

		<paper-left-popup :show="show" @hide="hidepopup" @addfriend="addfriend" @clear="clear">
		</paper-left-popup>

		<!-- 小纸条列表 -->
		<block v-for="(item,index) in chatList" :key="index">
			<paper-list @readMsg="readMsg" :item="item" :index="index"></paper-list>
		</block>

		<!-- 上拉加载 -->
		<load-more :loadtext="loadtext"></load-more>

	</view>
</template>

<script>
	import paperList from "../../components/paper/paper-list.vue";
	import loadMore from "../../components/common/load-more.vue";
	import paperLeftPopup from "../../components/paper/paper-left-popup.vue";
	import time from '../../common/time.js'
	import {
		mapMutations,
		mapState
	} from 'vuex'
	import Vue from 'vue'
	Vue.prototype.$is_open_socket = false
	export default {
		components: {
			paperList,
			loadMore,
			paperLeftPopup
		},
		computed: {
			...mapState(['chatList', 'userInfo'])
		},
		
		data() {
			return {
				show: false,
				socketTask: null,
				is_open_socket: false,
				loadtext: "",
				list: []
			};
		},
		onShow() {
			if (this.userInfo.id && this.$is_open_socket == false) {
				this.connectSocketInit();
				this.getChatList()
			}else{
				this.sortChatList()
			}

		},
		// 监听下拉刷新
		async onPullDownRefresh() {
			await this.getChatList()
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			this.loadmore();
		},
		async onLoad() {
			if (this.userInfo.id) {
				this.connectSocketInit();
				if(this.chatList.length==0){
					this.getChatList()
				}
				
			} else {
				this.loadtext = "你还没登录!"
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
							title: "你还没登录！",
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
		beforeDestroy() {
			this.closeSocket();
		},
		methods: {
			...mapMutations(['setChatList', 'updateMsg','sortChatList']),
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
						return {
							id: item.id,
							fid: fid,
							afterTime: +new Date(item.afterTime),
							userpic: item.userpic,
							username: item.username,
							time: sendTime,
							message: message,
							noreadnum: count,
							messages: item.messages
						}
					})
					chatList.sort((a,b)=>{
						return  b.afterTime -a.afterTime
					})
					this.setChatList(chatList);
					uni.setStorageSync('chatList', JSON.stringify(chatList))
				}

			},
			async connectSocketInit() {
				let uid = this.userInfo.id
				// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
				if (uid) {
					Vue.prototype.$socket = await this.$http.websocket('GET', "msg/" + uid)
					// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
					Vue.prototype.$socket.onOpen((res) => {
						console.log("WebSocket连接正常打开中...！");
						Vue.prototype.$is_open_socket = true;
						if(Vue.prototype.$is_open_socket){
							Vue.prototype.$socket.onMessage((res) => {
								let data = {}
								try{
									data = JSON.parse(res.data);
								}catch(e){
									
								}
								let index = 0;
								for(let i =0;i<this.chatList.length;i++){
									if(this.chatList[i].id == data.cId){
										index = i
										return
									}else{
										this.index = 0
									}
								}
								// let pic = this.chatList[this.index].userpic
								// let obj={
								// 		fromId:data.fromId,
								// 		toId:data.toId,
								// 		isme:data.fromId==this.userInfo.id,
								// 		userpic:pic,
								// 		type:"text",
								// 		message:data.message,
								// 		time:  time.gettime.gettime(data.sendTime)
								// 	}
								console.log(data)
								// gstime:time.gettime.getChatTime(now,this.list[this.list.length-1].time)

								// this.addChatMessage(obj)
								// this.addNoreadMessage(this.index)
							});
						}
					})
					// 这里仅是事件监听【如果socket关闭了会执行】
					Vue.prototype.$socket.onClose(() => {
						console.log("已经被关闭了")
					})
					Vue.prototype.$socket.onError((e) => {
						console.log("失败了")
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
			clickRequest() {
				if (this.is_open_socket) {
					// websocket的服务器的原理是:发送一次消息,同时返回一组数据【否则服务器会进去死循环崩溃】
					Vue.prototype.$socket.send({
						data: "请求一次发送一次message",
						async success() {
							console.log("消息发送成功");
						},
					});
				}
			},
			readMsg(index) {

				if (this.chatList[index].messages.length == 0) {
					return
				}
				if (this.chatList[index].noreadnum == 0) {
					return
				}

				let msgs = this.chatList[index].messages.filter((item => {
					if(item.id&&item.status==false){
						return true
					}else{
						return false
					}
				}));
				
				let mids = this.chatList[index].messages.map((item => {
					return item.id
				}));
				console.log(mids)
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
					url:'../user-search/user-search'
				})
				this.hidepopup();
				
			},
			clear() {
				console.log("清除缓存");
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
