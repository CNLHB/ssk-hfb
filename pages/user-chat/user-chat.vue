<template>
	<view>
		
		<scroll-view id="scrollview" scroll-y :scroll-top="scrollTop" 
		:scroll-with-animation="true"
		:style="{height:style.contentH+'px'}">
			<!-- 聊天列表 -->
			<block v-for="(item,index) in list" :key="index">
				<view class="chat-item">
				<user-chat-list :item="item" :index="index"></user-chat-list>
				</view>
			</block>
		</scroll-view>
		
		<!-- 输入框 -->
		<user-chat-bottom @submit="submit"></user-chat-bottom>
	</view>
</template>

<script>
	import userChatBottom from "../../components/user-chat/user-chat-bottom.vue";
	import time from "../../common/time.js";
	import userChatList from "../../components/user-chat/user-chat-list.vue";
	import {mapState} from 'vuex'
	import $http from '../../config/requestConfig.js';
	export default {
		components:{
			userChatBottom,
			userChatList
		},
		computed:{
			...mapState(['chatList','userInfo'])
		},
		data() {
			return {
				scrollTop:0,
				index:0,
				style:{
					contentH:0,
					itemH:0
				},
				list:[],
				socket:null,
				fid: undefined,

			};
		},
		async onLoad(data) {
			this.index = data.index
			this.fid = this.chatList[data.index].fid
			// let socket = await this.$http.websocket("GET",'msg/111')
			// this.socket = socket
			

		},

		onReady() {
			this.getdata();
			this.initdata();
			this.pageToBottom(true);
		},

		methods:{
			// 初始化参数
			initdata(){
				try {
					const res = uni.getSystemInfoSync();
					this.style.contentH=res.windowHeight - uni.upx2px(120);
				} catch (e) { }
			},
			pageToBottom(isfirst = false){
				let q=uni.createSelectorQuery().in(this);
				let itemH = q.selectAll('.chat-item');
				this.$nextTick(()=>{
					itemH.fields({
						size:true
					},data => {
						if (data) {
							if (isfirst) {
								for (let i = 0; i < data.length; i++) {
									this.style.itemH += data[i].height;
								}
							}else{
								this.style.itemH += data[data.length-1].height;
							}
							this.scrollTop = (this.style.itemH > this.style.contentH) ? this.style.itemH : 0;
						}
					}).exec();
				})
			},


			// 获取聊天数据
			async getdata(){
				// 从服务器获取到的数据
				let pic = this.chatList[this.index].userpic
				let data = this.chatList[this.index].messages
				let arr = data.map((item)=>{
					return{
						isme:item.fromId==this.userInfo.id,
						userpic:pic,
						type:"text",
						data:item.message,
						time: new Date(data.sendTime).getTime()+''
					}
				})
				let arr1=[
					{
						isme:false,
						userpic:"../../static/demo/userpic/11.jpg",
						type:"text",
						data:"哈哈哈",
						time:"1555146412"
					},
					{
						isme:false,
						userpic:"../../static/demo/userpic/11.jpg",
						type:"text",
						data:"哈哈哈",
						time:"1555146412"
					},
					{
						isme:true,
						userpic:"../../static/demo/userpic/10.jpg",
						type:"img",
						data:"../../static/demo/3.jpg",
						time:"1555146414",
					},
					{
						isme:false,
						userpic:"../../static/demo/userpic/11.jpg",
						type:"text",
						data:"哈哈哈",
						time:"1555146412"
					},
					{
						isme:true,
						userpic:"../../static/demo/userpic/10.jpg",
						type:"img",
						data:"../../static/demo/3.jpg",
						time:"1555146414",
					},
				];
				for (let i = 0; i < arr.length; i++) {
					arr[i].gstime=time.gettime.getChatTime(arr[i].time,i>0?arr[i-1].time:0);
				}
				this.list=arr;
			},
			async submit(data){
				// 构建数据
				console.log(888)
				let now=new Date().getTime();
				// this.socketTask.send({
				// 	data: "uni-app发送一条消息",
				// 	async success() {
				// 		console.log("消息发送成功");
				// 	},
				// });
				// this.socket.onOpen( (res) => {
				// 	 this.socket.send({
				// 		data: data,
				// 		success: () => {
				// 				console.log(8888)
				// 		}
				// 	});

				// })

				// let obj={
				// 	isme:true,
				// 	userpic:"../../static/demo/userpic/10.jpg",
				// 	type:"text",
				// 	data:data,
				// 	time:now,
				// 	gstime:time.gettime.getChatTime(now,this.list[this.list.length-1].time)
				// };
				// this.list.push(obj);
				this.pageToBottom();
			}
		}
	}
</script>

<style>

</style>
