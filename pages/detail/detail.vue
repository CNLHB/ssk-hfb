<template>
	<view class="detail">
		<detail-info @goToUserInfo="goToUserInfo"
			@likeOrTread="likeOrTread"
		   :userInfo="userInfo" @comSubimt="comSubimt" :infoNum="infoNum" :item="detail"></detail-info>

		<view class="u-comment-title" :maskState="maskState">最新评论 {{comment.count}}</view>
		<view class="uni-comment u-comment">
			<block v-for="(item,index) in comment.list" :key="index">
				<comment-list @comSubimt="comSubimt" @comDelete="comDelete" :userInfo="userInfo" :item="item" :index="index"></comment-list>
			</block>
			<template v-if="comment.list.length==0">
				<view>还没有评论,快来说两句~</view>
			</template>
		</view>

		<view style="height: 120upx;"></view>

		<!-- 输入框 -->
		<user-chat-bottom @submit="submit"></user-chat-bottom>
		<t-rt-popup :itemList="itemList" ref="rtBubble" @click="itemClick"></t-rt-popup>
		<!-- 分享 -->
		<more-share :show="shareshow" @togle="togle"></more-share>
		<pl-comment ref="plComment" :maskState="maskState" @toggleState="toggleState" :placeholder="placeText" @pubComment="pubComment"></pl-comment>
	</view>
</template>

<script>
	import detailInfo from "../../components/detail/detail-info.vue";
	import plComment from "../../components/ygc-comment/ygc-comment.vue";
	import time from "../../common/time.js";
	import commentList from "../../components/detail/comment-list.vue";
	import userChatBottom from "../../components/user-chat/user-chat-bottom.vue";
	import moreShare from "../../components/common/more-share.vue";
	import tRtPopup from '@/components/views/t-rt-popup/t-rt-popup';
	import {
		getTopicDetail,
		pushHistory,
		delComment,
		addComment,
		getCommentList
	} from "@/api/detail.js";
	import {
		giveLike
	} from '@/api/common.js'
	import {
		mapState,
		mapMutations
	} from "vuex"
	export default {
		components: {
			tRtPopup,
			detailInfo,
			commentList,
			userChatBottom,
			moreShare,
			plComment
		},
		data() {
			return {
				shareshow: false,
				currentComm: {},
				placeText: "请输入评论",
				comment: {
					count: 0,
					list: []
				},
				itemList: [{
						title: '首页',
						icon: 'home'
					},
					{
						title: '收藏',
						icon: 'star'
					},
					{
						title: '分享',
						icon: 'partake'
					}
				],
				detail: {},
				infoNum:{
					
				},
				maskState: false

			}
		},
		onLoad(data) {
			try {
				this.initData(data.id)
			} catch (e) {

			}
		},
		// 监听导航右边按钮
		onNavigationBarButtonTap(e) {
			this.rtBubble()
			// if (e.index == 0) {
			// 	this.togle();
			// }
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			// 初始化数据
			async initData(id) {
				// 修改窗口标题
				uni.setNavigationBarTitle({
					title: "详情"
				});
				let detail = await getTopicDetail(id)
				this.detail = detail
				this.infoNum = detail.infoNum
				this.comment.count = detail.commentNum
				if (this.userInfo.id) {
					let opt = {
						cid: detail.cid,
						tid: detail.id,
						uid: this.userInfo.id,
						title: detail.title,
						username: detail.username,
						userpic: detail.userpic
					}
					pushHistory(opt)
				}
				this.getcomment();
				this.$nextTick(()=>{
					this.detail = detail
				})
			},
			togle() {
				this.shareshow = !this.shareshow
			},
			itemClick(e) {
				switch(e.index){
					case 0: 
						uni.switchTab({
							url:'../index/index'
						})
					break;
					case 1:
						
					break;
					case 2:
					
					break;
				}
				let text = ["首页", "收藏", "分享"][e.index];
				this.$http.toast(`您点击了：${text}`);
			},
			onClick(){
				if(!this.userInfo || !this.userInfo.id){
					uni.showToast({
						title:"你还未登录！或登录过有效期!",
						icon:'none'
					})
					return
				}
				this.$http.post('topic/collect',{
					...this.topicActive,
					title:this.item.title,
					username:this.item.username,
					userpic:this.item.userpic
				})
				this.collect = !this.collect
			},
			rtBubble() {
				this.$refs.rtBubble.toggle();
			},
			comSubimt(item) {
				this.currentComm = item
				console.log(item)
				this.placeText = `回复  ${item.username}:`
				this.maskState = true
			},
			async comDelete(item) {
				await delComment(item.id)
				await this.getcomment();
			},
			async pubComment(text) {
				if (text == "") {
					return
				}
				await addComment({
					uid: this.userInfo.id,
					parentId: this.currentComm.id,
					tid: this.currentComm.tid,
					content: text
				})
				await this.getcomment()
				this.maskState = !this.maskState
			},
			toggleState() {
				this.maskState = !this.maskState
			},
			async submit(data) {
				if (!this.userInfo.id) {
					this.$http.toast("你还未登录！")
					return
				}
				if(this.detail.uid==this.userInfo.id){
					this.$http.toast("自己就不用评论了趴！")
					return
				}
				if (data == '') {
					this.$http.toast("评论不能为空！")
					return;
				}
				await addComment({
					uid: this.userInfo.id,
					parentId: 0,
					tid: this.detail.id,
					content: data
				})
				this.getcomment()
			},
			goToUserInfo(item) {
				
				uni.navigateTo({
					url: '../../pages/user-space/user-space?uid=' + item.uid
				})
			},
			async likeOrTread(data) {
				giveLike(data)
				if(data.tactive==1){
					this.$http.toast("点赞成功!")
				}else{
					this.$http.toast("你已取消点赞!")
					
				}
			},
			// 获取评论
			async getcomment() {
				let arr = await getCommentList(this.detail.id)
				this.comment.list = arr.items;
				this.comment.count = arr.total;
				this.detail.commentNum = arr.total
			},

		}
	}
</script>

<style>
	/* 评论 */
	.u-comment {
		padding: 0 20upx;
	}

	.u-comment-title {
		padding: 20upx;
		font-size: 30upx;
		font-weight: bold;
	}
</style>
