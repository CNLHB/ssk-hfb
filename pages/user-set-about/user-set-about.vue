<template>
	<view style="padding: 20upx;">
		<view class="user-set-about-t u-f-ajc u-f-column animated fadeIn fast">
			<image src="../../static/common/logo.png" 
			mode="widthFix" lazy-load></image>
			<view>version 1.0.0</view>
		</view>
		<block v-for="(item,index) in list" :key="index">
			<home-list-item :item="item"
			:index="index"></home-list-item>
		</block>
	</view>
</template>

<script>
	import homeListItem from "../../components/home/home-list-item.vue";
	export default {
		components:{
			homeListItem
		},
		data() {
			return {
				list:[
					{ icon:"",name:"新版本检测",clicktype:"",url:"" },
					{ icon:"",name:"仿糗事百科用户协议",clicktype:"",url:"" },
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.user-set-about-t{
	padding: 40upx 0;
}
.user-set-about-t>image{
	margin-top: 50upx;
	margin-bottom: 30upx;
	width: 65%;
}
.user-set-about-t>view{
	color: #CCCCCC;
}
</style>
