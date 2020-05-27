<template>
	<view>
		
		<scroll-view id="scrollview" scroll-y :scroll-top="scrollTop" 
		:scroll-with-animation="true"
		:style="{height:style.contentH+'px'}">
			<!-- 聊天列表 -->
			<block v-for="(item,index) in list" :key="index">
				<view class="chat-item">
				<user-chat-list 
					@goToUserInfo="goToUserInfo"
					:item="item" :index="index"></user-chat-list>
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
	import {mapState,mapMutations} from 'vuex'
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
				cId:0,
				socket:null,
				fid: undefined,

			};
		},
		async onLoad(data) {
			if(data.index){
				this.index = data.index
			}
			let fid = data.fid
			let flag = true
			if(!data.index&&!!fid){
				for(let i =0;i<this.chatList.length;i++){
					if(this.chatList[i].fid == fid){
						this.index = i
						flag = false
						return
					}else{
						this.index = 0
					}
				}
				if(flag){
					this.fid = fid
					let chat = await this.$http.post('chat',{
						fromId: this.userInfo.id,
						toId:parseInt(fid),
					})
					this.cId = chat.id
					chat.messages=[]
					console.log(chat)
					this.addChatList(chat);
				}

			}else{
				this.fid = this.chatList[data.index].fid
				this.cId = this.chatList[data.index].id
			}
				if(this.$is_open_socket){
					this.$socket.onMessage((res) => {
						let data = {}
						try{
							data = JSON.parse(res.data);
						}catch(e){
							
						}
						let pic = this.chatList[this.index].userpic
						let obj={
								
								isme:data.fromId==this.userInfo.id,
								userpic:pic,
								type:"text",
								message:data.message,
								time: new Date(data.sendTime).getTime()+''
							}
							// gstime:time.gettime.getChatTime(now,this.list[this.list.length-1].time)
						this.list.push(obj);
						this.pageToBottom(true);
						let msgs = [data.id]
						this.$http.put('chat/read',{
							mids: msgs
						},{
							"content-type":"application/x-www-form-urlencoded"
						})
					});
				}

		},

		onReady() {
			this.getdata();
			this.initdata();
			this.pageToBottom(true);
		},

		methods:{
			...mapMutations(['setChatMessage','addChatList']),
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
				if(this.list.length!=0){
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
				}
			},

			goToUserInfo(item){
				console.log(item)
				uni.navigateTo({
					url:'../../pages/user-space/user-space?uid='+item.uid
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
						uid:item.fromId==this.userInfo.id?item.fromId:item.toId,
						userpic:pic,
						type:"text",
						message:item.message,
						time: new Date(data.sendTime).getTime()+''
					}
				})

				for (let i = 0; i < arr.length; i++) {
					arr[i].gstime=time.gettime.getChatTime(arr[i].time,i>0?arr[i-1].time:0);
				}
				this.list=arr || [];
			},
			async submit(data){
				// 构建数据
				console.log(data)
				let now=new Date().getTime();
				if(data==''){
					uni.showToast({
						title:"消息不能为空",
						icon:'none'
					})
					return
				}
				this.$http.setLoading(false);
				let msg =await this.$http.post("push/message",{
					cId: this.cId,
					fromId: this.userInfo.id,
					toId: this.fid,
					message: data
				})
				this.$http.setLoading(true);
				let obj={
						index:this.index,
						isme:msg.fromId==this.userInfo.id,
						userpic:this.userInfo.authorUrl,
						type:"text",
						message:msg.message,
						time: new Date(msg.sendTime).getTime()+''
					}
				this.list.push(obj);
				this.pageToBottom();
			}
		}
	}
</script>

<style>

</style>
