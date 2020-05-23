<template>
	<view class="detail">
		<detail-info :item="detail"></detail-info>

		<view class="u-comment-title" :maskState="maskState">最新评论 {{comment.count}}</view>
		<view class="uni-comment u-comment">
			<block v-for="(item,index) in comment.list" :key="index">
				<comment-list @comSubimt="comSubimt" :item="item" :index="index"></comment-list>
			</block>
		</view>
		
		<view style="height: 120upx;"></view>

		<!-- 输入框 -->
		<user-chat-bottom @submit="submit"></user-chat-bottom>
	
		<!-- 分享 -->
		<more-share :show="shareshow" @togle="togle"></more-share>
		<pl-comment ref="plComment"
				:maskState="maskState"
				@toggleState="toggleState"
		        :placeholder="'发布评论'" 
		        @pubComment="pubComment"></pl-comment>
	</view>
</template>

<script>
	import detailInfo from "../../components/detail/detail-info.vue";
	import plComment from "../../components/ygc-comment/ygc-comment.vue";
	import time from "../../common/time.js";
	import commentList from "../../components/detail/comment-list.vue";
	import userChatBottom from "../../components/user-chat/user-chat-bottom.vue";
	import moreShare from "../../components/common/more-share.vue";
	export default {
		components:{
			detailInfo,
			commentList,
			userChatBottom,
			moreShare,
			plComment
		},
		data() {
			return {
				shareshow:false,
				currentComm:{},
				comment:{
					count:0,
					list:[]
				},
				detail:{},
				maskState:false
			}
		},
		onLoad(e) {
			try{
				let data = JSON.parse(uni.getStorageSync("topicDatail"))
				this.initdata(data);
				this.getcomment();
			}catch(e){
				
			}
			// this.axios('/history')
		},
		// 监听导航右边按钮
		onNavigationBarButtonTap(e) {
			if(e.index==0){
				this.togle();
			}
		},
		methods: {
			togle(){
				this.shareshow=!this.shareshow
			},
			comSubimt(item){
				this.currentComm = item
				this.maskState = true
			},
			pubComment(text){
				if(text==""){
					return
				}
				this.$http.post('comment',{
					uid:1,
					parentId:this.currentComm.id,
					tid:this.currentComm.tid,
					content: text
				}).then(()=>{
					this.getcomment()
					this.maskState = !this.maskState
				})
				
				
			},
			toggleState(){
				this.maskState = !this.maskState
			},
			submit(data){
				console.log(this.detail)
				this.$http.post('comment',{
					uid:1,
					parentId:0,
					tid:this.detail.id,
					content: data
				}).then(()=>{
					this.getcomment()
					// this.maskState = !this.maskState
				})
			},
			// 获取评论
			async getcomment(){
				let arr = await this.$http.get('/comment/'+this.detail.id)
				this.comment.list=arr.items;
				this.comment.count = arr.total;
				this.detail.commentNum = arr.total
			},
			// 初始化数据
			initdata(obj){
				// 修改窗口标题
				uni.setNavigationBarTitle({ title: "详情"});
				this.detail = obj
				this.comment.count = obj.commentNum
			}
		}
	}
</script>

<style>

/* 评论 */	
.u-comment{
	padding: 0 20upx;
}
.u-comment-title{
	padding: 20upx;
	font-size: 30upx;
	font-weight: bold;
}
</style>
