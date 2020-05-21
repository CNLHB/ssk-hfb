<template>
	<view class="paper-list u-f-ac animated fadeIn fast" @tap="opendetail">
		<image :src="item.userpic" mode="widthFix" lazy-load></image>
		<view>
			<view class="u-f-ac u-f-jsb">{{item.username}} <view>{{item.time}}</view></view>
			<view class="u-f-ac u-f-jsb">{{item.data}}
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
			opendetail(){
				uni.navigateTo({
					url: '../../pages/user-chat/user-chat',
				});
			}
		}
	}
</script>

<style scoped>
.paper-list{
	border-bottom: 1upx solid #EEEEEE;
	padding: 20upx 0;
}
.paper-list>image{
	width: 100upx;
	height: 100upx;
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
