<template>
	<view class="paper-list u-f-ac animated fadeIn fast" @tap="opendetail(index)">
		<image :src="item.userpic" mode="widthFix" lazy-load></image>
		<view>
			<view class="u-f-ac u-f-jsb">{{item.username}} <view>{{item.time}}</view></view>
			<view class="u-f-ac u-f-jsb"><text class="overflowText">{{item.message}}</text>
			<template v-if="item.noreadnum>0">
				<uni-badge :text="item.noreadnum" type="error"></uni-badge>
			</template>
			</view>
		</view>
	</view>
</template>

<script>
	import uniBadge from "../../components/uni-badge/uni-badge.vue";
	export default {
		components:{
			uniBadge
		},
		props:{
			item:Object,
			index:Number
		},
		methods:{
			opendetail(index){
				this.$emit("readMsg", index)
				uni.navigateTo({
					url: '../../pages/user-chat/user-chat?index='+index
				});
			}
		}
	}
</script>

<style scoped>
.paper-list{
	border-bottom: 1upx solid #EEEEEE;
	padding: 20upx 0;
	height: 110upx;
	width: 100%;
}
.overflowText{
	width: 50vw;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.paper-list>image{
	width: 100upx!important;
	height: 100upx!important;
	border-radius: 100%;
	margin-right: 20upx;
	flex-shrink: 0;
}
.paper-list>view{
	flex: 1;
}
.paper-list>view>view:first-child{
	font-size: 35upx;
}
.paper-list>view>view:first-child>view{
	color: #CBCBCB;
}
.paper-list>view>view:last-child{
	color: #999999;
}
</style>
