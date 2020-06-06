<template>
	<view class="container"> 
		<view class="item-list">
				<tui-upload :value="images" :serverUrl="serverUrl" @complete="complete" @remove="complete" :limit="limit"></tui-upload>
		</view>
		<text @tap="share">click</text>
	</view>
</template>

<script>
	import uniFav from '@/components/uni-fav/uni-fav.vue'
	import myshare from "@/api/wxshare.js"
	export default {
		components:{
			uniFav
		},
		data() {
			return {
				images:[],
				serverUrl:'http://192.168.31.164:8081/api/upload/cloud',//http://api.hfb.xquery.cn/api/upload/cloud
				limit:9
			}
		},
		onLoad() {
			let url=location.href.split("#")[0];
			myshare(url,"我要分享","http://mobile.hfb.xquery.cn/dashangimg.jpg","标题","凭借")
				
		},
		methods: {
			complete(e){
				console.log(e)
			},
			remove(index){
				console.log(index)
				// this.images.slice(index,1)
			},
			share(){
				/*
				*参数根据自己的业务需求
				 url:是当前页面的路径，let url=location.href.split("#")[0];
				*desc:分享描述
				imgUrl:分享小图标的连接，这里的连接必须在js接口安全域名下可以访问的。否者小图标不生效
				shareUserName与shareDesignName 进行拼接做tittle
				*/
			   let url=location.href.split("#")[0];
				myshare(url,"我要分享","http://mobile.hfb.xquery.cn/dashangimg.jpg","标题","凭借")
			
			}
		}
	}
</script>

<style scoped>
.container{
	display: flex;
	box-sizing: border-box;
	width: 100vw;
	height: 100vh;
	align-items: center;
	flex-direction: column;
	background-color: #F9F9F9;
	padding: 0 20upx ;
}

.item-list{
	background-color: #FFFFFF;
	box-sizing: border-box;
	width: 100%;
	min-height: 300upx;
	border-radius: 20upx;
	margin-bottom: 25upx;
}


</style>
