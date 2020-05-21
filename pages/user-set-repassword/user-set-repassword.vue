<template>
	<view class="body">
		<input type="text" v-model="oldpassword"
		class="uni-input common-input" password
		placeholder="输入旧密码" />
		
		<input type="text" v-model="newpassword"
		class="uni-input common-input" password
		placeholder="输入新密码" />
		
		<input type="text" v-model="renewpassword"
		class="uni-input common-input" password
		placeholder="输入确认密码" />
		
		<button class="user-set-btn" 
		:loading="loading" :class="{'user-set-btn-disable':disabled}" 
		type="primary" @tap="submit" :disabled="disabled">完成</button>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldpassword:"",
				newpassword:"",
				renewpassword:"",
				disabled:true,
				loading:false
			}
		},
		watch:{
			oldpassword(val){
				this.change();
			},
			newpassword(val){
				this.change();
			},
			renewpassword(val){
				this.change();
			}
		},
		methods: {
			// 监听输入框
			change(){
				if(this.oldpassword && this.newpassword && this.renewpassword){
					this.disabled=false;
					return;
				}
				this.disabled=true;
			},
			// 验证层
			check(){
				if(!this.oldpassword || this.oldpassword==""){
					uni.showToast({
						title: '旧密码不能为空',
						icon:"none"
					});
					return false;
				}
				if(!this.newpassword || this.newpassword==""){
					uni.showToast({
						title: '新密码不能为空',
						icon:"none"
					});
					return false;
				}
				if(!this.renewpassword || this.renewpassword==""){
					uni.showToast({
						title: '确认密码不能为空',
						icon:"none"
					});
					return false;
				}
				if(this.newpassword !== this.renewpassword){
					uni.showToast({
						title: '确认密码和新密码不一致',
						icon:"none"
					});
					return false;
				}
				return true;
			},
			// 提交
			submit(){
				this.loading=true; this.disabled=true;
				if(!this.check()){ this.loading=false; this.disabled=false; return; }
				// 提交服务器
				uni.showToast({
					title: '提交服务器',
					mask: false,
					duration: 1500
				});
				this.loading=false; this.disabled=false;
			}
		}
	}
</script>

<style>
@import "../../common/form.css";
</style>
