<template>
	<view class="container">
		<view class="item">
			<view class="user-info">
				<view class="user-pic">
					<image :src="item.userpic" ></image>
				</view>
				<view class="user-desc">
					<text class="user-name">
						{{item.username}}
					</text>
					<text class="comment-time">
						{{item.createTime}}
					</text>
				</view>
			</view>
			<view class="user-comm">
				{{item.comment}}
			</view>
			<view class="comm-topic">
					<image :src="item.topicpic"></image>
					<view class="topic-title">
							<text class="c-topic">
										{{item.topicTitle}}
							</text>
							<text class="title">{{item.title}}</text>
					</view>
					<tui-icon name="arrowright" :size="46"></tui-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:{
				type:Object,
				default:{}
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style scoped>
	.container{
		width: 100vw;
		box-sizing: border-box;
	}
	.item{
		padding: 20upx 20upx;
		background-color: #FFFFFF;
	}
	.user-info{
		display: flex;
		
	}
	.user-info image{
		height: 60upx;
		width: 60upx;
		border-radius: 50%;
	}
	.user-desc{
		padding-left: 20upx;
		display: flex;
		flex-direction: column;
		line-height: 1;
	}
	.user-name{
		padding-bottom: 5upx;
	}
	.user-comm{
		margin: 10upx 0;
	}
	.comm-topic{
		padding: 20upx 10upx;
		height: 120upx;
		font-size: 28upx;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		justify-content: space-between;
		background-color: #f1f1f1;
		border-radius: 10upx;
	}
	.comm-topic image{
		height: 80upx;
		width: 80upx;
		border-radius: 10upx;
	}
	.topic-title{
		display: flex;
		flex-direction: column;
		line-height: 1;
		width: 500upx;
		padding-left: 20upx;
		color: #909090;
	}
	.comment-time{
		transform: scale(0.8);
	}
	.topic-title .c-topic{
		padding-bottom: 10upx;
		width: 450upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
</style>
