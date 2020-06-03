<template class="box-body">
	<view class="box">
		<view class="father-box">
			<view class="header">
				<image class="img" :src="cardinfo.authImg"></image>
				<view class="auth">{{cardinfo.authName}}</view>
				<view class="tag">{{cardinfo.tag}}</view>
				<view class="time">{{cardinfo.createTime}}</view>
			</view>
			<view class="content">
				{{cardinfo.content}}....
				<view class="show" @tap="gotoTopicInfo">点击阅读详细</view>
			</view>

		</view>
	</view>

</template>

<script>
	export default {
		name: 'card',
		props: {
			cardinfo: {
				type: Object
			},
			index:Number
		},
		data() {
			return {

			};
		},
		methods:{
			gotoTopicInfo(){
				this.$emit("gotoTopic",this.index)
			}
		}
	}
</script>

<style>
	
	.low{
		margin-left: 10upx;
	}

	.father-box {
		background-color: #FFFFFF;
		box-shadow: #C8C7CC;
		min-height: 400upx;
		margin: 20upx 0;
		border-radius: 20upx;
	}

	.img {
		margin: 20upx 0px 20upx 50upx;
		height: 90upx;
		width: 90upx;
		border-radius: 90upx;
		border: 1px solid #007AFF;
		display: inline-flex;
	}

	.auth {
		font-weight: bolder;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 15px;
		margin-top: -100upx;
		margin-left: 170upx;
	}

	.time {
		font-family: Arial, Helvetica, sans-serif;
		font-size: 12px;
		display: inline-flex;
		margin-left: 170upx;
		margin-top: -20upx;
		color: #808080;
	}



	.content {
		display: block;
		font-size: 14px;
		color: #24292E;
		font-style: italic;
		margin-left: 60upx;
		margin-right: 60upx;
		margin-top: 18upx;
		height: 250upx;
		text-indent: 1.5em;
	}

	.nbsp {
		margin-left: 25upx;
	}

	.icon-like {
		height: 32upx;
		width: 32upx;
	}



	.good view {
		font-size: 12px;
		margin-left: 20upx;
		color: #6D6D72;
		margin-top: -2upx;
		text-align: center;
	}



	.show {
		color: #0081FF;
		margin-top: 12upx;
	}

	.tag {
		font-size: 12px;
		text-align: center;
		background: #36BBFF;
		width: 120upx;
		height: 40upx;
		line-height: 40upx;
		border-radius: 10upx;
		color: #F2F2F2;
		margin-left: 360upx;
		margin-top: -46upx;
	}
</style>
