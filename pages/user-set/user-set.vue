<template>
	<view class="body">
		<block v-for="(item,index) in list" :key="index">
			<home-list-item 
			:item="item"
			:index="index"></home-list-item>
		</block>
		<button class="user-set-btn" type="primary" @tap="showActive">退出登陆</button>
		<my-action-sheet :showActionSheet="showActionSheet" @toggleAction="toggleAction"></my-action-sheet>
	</view>
</template>

<script>
	import homeListItem from "../../components/home/home-list-item.vue";
	import myActionSheet from '@/components/common/myActionSheet.vue'
	import {mapMutations,mapState} from 'vuex'
	export default {
		components:{
			homeListItem,
			myActionSheet
		},
		computed:{
			...mapState(['userInfo'])
		},
		data() {
			return {
				list:[
					{ icon:"",name:"账号与安全",clicktype:"navigateTo",url:"../../pages/user-set-repassword/user-set-repassword" },
					{ icon:"",name:"绑定邮箱",clicktype:"navigateTo",url:"../../pages/user-set-email/user-set-email" },
					{ icon:"",name:"小纸条",clicktype:"",url:"" },
					{ icon:"",name:"清除缓存",clicktype:"clear",url:"" },
					{ icon:"",name:"意见反馈",clicktype:"navigateTo",url:"../../pages/user-set-help/user-set-help" },
					{ icon:"",name:"关于韩府",clicktype:"navigateTo",url:"../../pages/user-set-about/user-set-about" },
				],
				showActionSheet:false,
				button:[{text: "取消",type: "blue",plain: true ,//是否空心
				}, {text: "确定",type: "red",plain: false}]
			}
		},
		methods: {
			...mapMutations(['setUserInfo','setChatList']),

			showActive(){
				this.showActionSheet = true
			},
			toggleAction(index){
				if(index){
					this.setUserInfo({});
					uni.clearStorageSync('userInfo')
					this.setChatList([])
					uni.switchTab({
						url:'../home/home'
					})
				}else{
					this.showActionSheet = false
				}
			},
		}
	}
</script>

<style>
@import "../../common/form.css";
</style>
