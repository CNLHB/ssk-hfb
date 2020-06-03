<template>
	<view class="body">

		<paper-left-popup :show="show" @hide="hidepopup" @addfriend="addfriend" @clear="clear">
		</paper-left-popup>

		<!-- 小纸条列表 -->
		<uni-swipe-action>
			<block v-for="(item,index) in chatList" :key="index">
				<uni-swipe-action-item :options="options" @onClick="onClick(item,index)">
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
	import {
		getChatList,
		deleteChat,
		updateChat,
		createSocket,
		readChatMsg
	} from '@/api/paper.js'
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
			...mapState(['chatList', 'msgIndex', 'userInfo']),
			...mapGetters(['currentChatMsgs'])
		},

		data() {
			return {
				show: false,
				socketTask: undefined,
				loadtext: "",
				list: [],
				$is_open_socket:false,
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
				this.initData()
				this.loadtext = ''
			}

		},
		// 监听下拉刷新
		async onPullDownRefresh() {
			if (this.userInfo.id) {
				await this.initData()
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
			async initData() {
				let chatList = await getChatList(this.userInfo)
				this.setChatList(chatList);
				this.sortChatList()
				uni.setStorageSync('chatList', JSON.stringify(this.chatList))

			},
			onClick(item, index) {
				deleteChat(item.id)
				this.delChatList(index)

			},
			async connectSocketInit() {
				let uid = this.userInfo.id
				if (!uid || this.$is_open_socket) {
					return
				}
				// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
				if (uid) {
					this.socketTask = await createSocket(uid)
					this.socketTask.onOpen((res) => {
						console.log("WebSocket连接正常打开中...！");
						this.$is_open_socket = true;
						if (this.$is_open_socket) {
							this.socketTask.onMessage(async (res) => {
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
									updateChat(data.id)
								}
								this.initData()
					
							});
						}
					})
					// 这里仅是事件监听【如果socket关闭了会执行】
					this.socketTask.onClose(() => {
						this.$is_open_socket = false
						console.log("已经被关闭了")
					})
					this.socketTask.onError((e) => {
						console.log("失败了")
						this.$is_open_socket = false
						console.log(e)
					})
				}
			},
			// 关闭websocket【离开这个页面的时候执行关闭】
			closeSocket() {
				if (this.is_open_socket) {
					this.socketTask.close({
						success(res) {
							this.$is_open_socket = false;
							this.socketTask = undefined
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
				readChatMsg(mids)
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
					title: "提示",
					content: "是否清除列表",
					cancelText: "取消",
					success: async (e) => {
						if (e.confirm == true) {
							let cids = this.chatList.map((item) => {
								return item.id
							})
							if (cids.length == 0) {
								return
							}
							this.setChatList([])
							deleteChat(cids)
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
