<template>
	<view class="">
		<view class="uni-comment-list" :class="{'u-comment-list-child':(item.parentId>0)}">
			<view class="uni-comment-face"><image :src="item.userpic" mode="widthFix"></image></view>
			<view class="uni-comment-body">
				<view class="uni-comment-top"><text>{{item.username}}</text>
				</view>
				<view class="uni-comment-content" @tap="comment(item)">{{item.content}}</view>
				<view class="uni-comment-date">
					<view>{{time}}</view>
				</view>
			</view>
		</view>
		<template v-if="item.children&&item.children.length>0">
		<view v-for="items in item.children" :key="items.id">
			<view class="uni-comment-list u-comment-list-child" >
				<view class="uni-comment-face"><image :src="items.userpic" mode="widthFix"></image></view>
				<view class="uni-comment-body">
					<view class="uni-comment-top"><text>{{items.username}}</text>
					</view>
					<!-- @tap="comment(items)" -->
					<view class="uni-comment-content" >{{items.content}}</view>
					<view class="uni-comment-date">
						<view>{{time}}</view>
					</view>
				</view>
			</view>
		</view>

		</template>
		
	</view>
	
</template>

<script>
	import time from "../../common/time.js";
	export default {
		props:{
			item:Object,
			index:Number
		},
		methods:{
			comment(item){
				this.$emit("comSubimt",item)
			}
		},
		computed:{
			time(){
				let date = new Date(this.item.createTime).getTime()
				return time.gettime.gettime(date);
		}
	},
	}
</script>

<style scoped>
.u-comment-list-child{
	padding: 20upx;
	background: #F4F4F4;
	border-bottom: 1upx solid #EEEEEE;
	box-sizing: border-box;
	margin: 0;
	margin-left: 70upx;
	width: auto;
}
</style>
