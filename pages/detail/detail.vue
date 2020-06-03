<template>
	<view class="detail">
		<detail-info @goToUserInfo="goToUserInfo" :userInfo="userInfo" :item="detail"></detail-info>

		<view class="u-comment-title" :maskState="maskState">最新评论 {{comment.count}}</view>
		<view class="uni-comment u-comment">
			<block v-for="(item,index) in comment.list" :key="index">
				<comment-list @comSubimt="comSubimt" @comDelete="comDelete" :userInfo="userInfo" :item="item" :index="index"></comment-list>
			</block>
		</view>

		<view style="height: 120upx;"></view>

		<!-- 输入框 -->
		<user-chat-bottom @submit="submit"></user-chat-bottom>

		<!-- 分享 -->
		<more-share :show="shareshow" @togle="togle"></more-share>
		<pl-comment ref="plComment" :maskState="maskState" @toggleState="toggleState" :placeholder="'发布评论'" @pubComment="pubComment"></pl-comment>
	</view>
</template>

<script>
	import detailInfo from "../../components/detail/detail-info.vue";
	import plComment from "../../components/ygc-comment/ygc-comment.vue";
	import time from "../../common/time.js";
	import commentList from "../../components/detail/comment-list.vue";
	import userChatBottom from "../../components/user-chat/user-chat-bottom.vue";
	import moreShare from "../../components/common/more-share.vue";
	import {
		getTopicDetail,
		pushHistory,
		delComment,
		addComment,
		getCommentList
	} from "@/api/detail.js";

	import {
		mapState,
		mapMutations
	} from "vuex"
	export default {
		components: {
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
				comment: {
					count: 0,
					list: []
				},
				detail: {},
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
			if (e.index == 0) {
				this.togle();
			}
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
			},
			togle() {
				this.shareshow = !this.shareshow
			},
			comSubimt(item) {
				this.currentComm = item
				this.maskState = true
			},
			async comDelete(item) {
				delComment(item.id)
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
					uni.showToast({
						title: "你还未登录!",
						icon: 'none'
					})
					return
				}
				if (data == '') {
					uni.showToast({
						title: "评论不能为空",
						icon: "none"
					})
					return;
				}
				await addComment({
					uid: this.userInfo.id,
					parentId: 0,
					tid: this.detail.id,
					content: data
				})
				await this.getcomment()
			},
			goToUserInfo(item) {
				uni.navigateTo({
					url: '../../pages/user-space/user-space?uid=' + item.uid
				})
			},
			// 获取评论
			async getcomment() {
				let arr = await getCommentList(this.detail.id)
				console.log(arr)
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
