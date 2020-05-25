<template>
	<view class="body">
		
		<paper-left-popup 
		:show="show"
		@hide="hidepopup"
		@addfriend="addfriend"
		@clear="clear">
		</paper-left-popup>
		
		<!-- 小纸条列表 -->
		<block v-for="(item,index) in chatList" :key="index">
			<paper-list 
			@readMsg="readMsg"
			:item="item" :index="index"></paper-list>
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
	import {mapMutations, mapState} from 'vuex'
	export default {
		components:{
			paperList,
			loadMore,
			paperLeftPopup
		},
		computed:{
			...mapState(['chatList','userInfo'])
		},
		data() {
			return {
				show:false,
				socketTask:null,
				is_open_socket:false,
				loadtext:"上拉加载更多",
				list:[
				]
			};
		},
		// 监听下拉刷新
		onPullDownRefresh() {
			this.getdata();
		},
		onReachBottom() {
			this.loadmore();
		},
		async onLoad() {
			this.connectSocketInit();
			let data = await this.$http.get('chat/list');
			if(data&&data.length){
				let chatList = data.map((item)=>{
					let count = item.messages.reduce((prev,item)=>{
						if(item.status==0){
							return prev + 1
						}else{
							return prev 
						}
					},0)
					let fid = this.userInfo.id==item.fromId?item.toId:item.fromId
					return {
						id:item.id,
						fid: fid,
						userpic:item.userpic,
						username:item.username,
						time: time.gettime.gettime(item.messages[0].sendTime),
						data:item.messages[0].message,
						noreadnum:count,
						messages:item.messages
					}
				})
				this.setChatList(chatList);
				uni.setStorageSync('chatList',JSON.stringify(chatList))
			}
		},
		// 监听导航按钮点击事件
		onNavigationBarButtonTap(e) {
			switch (e.index){
				case 0:
				uni.navigateTo({
					url: '../user-list/user-list',
				});
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
		methods:{
			...mapMutations(['setChatList', 'updateMsg']),
			connectSocketInit() {
							// 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
							this.$socket = uni.connectSocket({
								// 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
								url: "ws://localhost:8081/msg/11",
								success(data) {
									console.log("websocket连接成功");
								},
							});
			 
							// 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
							this.$socket.onOpen((res) => {
								console.log("WebSocket连接正常打开中...！");
								this.is_open_socket = true;
								// 注：只有连接正常打开中 ，才能正常成功发送消息
								this.$socket.send({
									data: "uni-app发送一条消息",
									async success() {
										console.log("消息发送成功");
									},
								});
								// 注：只有连接正常打开中 ，才能正常收到消息
								this.$socket.onMessage((res) => {
									console.log("收到服务器内容：" + res.data);
								});
							})
							// 这里仅是事件监听【如果socket关闭了会执行】
							this.$socket.onClose(() => {
								console.log("已经被关闭了")
							})
						},
						// 关闭websocket【离开这个页面的时候执行关闭】
						closeSocket() {
							this.$socket.close({
								success(res) {
									this.is_open_socket = false;
									console.log("关闭成功", res)
								},
								fail(err) {
									console.log("关闭失败", err)
								}
							})
						},
						clickRequest() {
							if (this.is_open_socket) {
								// websocket的服务器的原理是:发送一次消息,同时返回一组数据【否则服务器会进去死循环崩溃】
								this.$socket.send({
									data: "请求一次发送一次message",
									async success() {
										console.log("消息发送成功");
									},
								});
							}
						},
			readMsg(index){
				this.updateMsg(index)
				if(this.chatList[index].messages.length==0){
					return
				}
				let msgs = this.chatList[index].messages.map((item=>{
					return item.id
				}));
				this.$http.put('chat/read',{
					mids: msgs
				},{
					"content-type":"application/x-www-form-urlencoded"
				})
				
			},
			// 操作菜单
			addfriend(){
				console.log("加韩友");
				this.hidepopup();
			},
			clear(){
				console.log("清除缓存");
				this.hidepopup();
			},
			hidepopup(){
				this.show=false;
			},
			showpopup(){
				this.show=true;
			},
			// 上拉加载
			loadmore(){
				console.log(88)
				if(this.loadtext!="上拉加载更多"){ return; }
				// 修改状态
				this.loadtext="加载中...";
				// 获取数据
				setTimeout(()=> {
					//获取完成
					let obj={
						userpic:"../../static/demo/userpic/12.jpg",
						username:"昵称",
						time:"10:21",
						data:"我是信息",
						noreadnum:11
					};
					this.list.push(obj);
					this.loadtext="上拉加载更多";
				}, 1000);
				//this.loadtext="没有更多数据了";
			},
			// 获取数据
			getdata(){
				setTimeout(()=> {
					// 服务器获取数据
					let arr=[
						{
							userpic:"../../static/demo/userpic/12.jpg",
							username:"昵称1111",
							time:"10:21",
							data:"我是信息",
							noreadnum:2
						},
						{
							userpic:"../../static/demo/userpic/12.jpg",
							username:"昵称222",
							time:"10:21",
							data:"我是信息",
							noreadnum:0
						},
						{
							userpic:"../../static/demo/userpic/12.jpg",
							username:"昵称333",
							time:"10:21",
							data:"我是信息",
							noreadnum:0
						},
						{
							userpic:"../../static/demo/userpic/12.jpg",
							username:"昵称444",
							time:"10:21",
							data:"我是信息",
							noreadnum:11
						}
					];
					// 赋值
					this.list=arr;
					// 关闭下拉刷新
					uni.stopPullDownRefresh();
				}, 2000);
			}
		}
	}
</script>

<style>
.body{
	padding: 0 20upx;
}

</style>
