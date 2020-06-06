<template>
	<view class="body">
		<tui-image-cropper 
			v-if="cropper" @cropper="sucessCropper"
			 :imageUrl="caijian" :height="height" :width="height"></tui-image-cropper>
		<view class="user-set-userinfo-list u-f-ac u-f-jsb">
			<view>头像</view>
			<view class="u-f-ac" @tap="changeimg">
				<image :src="userpic" mode="aspectFill" lazy-load></image>
				<view class="icon iconfont icon-bianji1"></view>
			</view>
		</view>
		<view class="user-set-userinfo-list u-f-ac u-f-jsb">
			<view>昵称</view>
			<view class="u-f-ac">
				<input type="text" v-model="username" />
				<view class="icon iconfont icon-bianji1"></view>
			</view>
		</view>
		<view class="user-set-userinfo-list u-f-ac u-f-jsb">
			<view>性别</view>
			<view class="u-f-ac" @tap="changeOne('sex')">
				<view>{{sex}}</view>
				<view class="icon iconfont icon-bianji1"></view>
			</view>
		</view>
		<view class="user-set-userinfo-list u-f-ac u-f-jsb">
			<view>生日</view>
			<picker mode="date" :value="birthday" :start="startDate" :end="endDate" @change="bindDateChange">
			<view class="u-f-ac">
				<view>{{birthday}}</view>
				<view class="icon iconfont icon-bianji1"></view>
			</view>
			</picker>
		</view>
<!-- 		<view class="user-set-userinfo-list u-f-ac u-f-jsb">
			<view>职业</view>
			<view class="u-f-ac" @tap="changeOne('qg')">
				<view>{{qg}}</view>
				<view class="icon iconfont icon-bianji1"></view>
			</view>
		</view> -->
		<view class="user-set-userinfo-list u-f-ac u-f-jsb">
			<view>职业</view>
			<view class="u-f-ac" @tap="changeOne('job')">
				<view>{{job}}</view>
				<view class="icon iconfont icon-bianji1"></view>
			</view>
		</view>
		<view class="user-set-userinfo-list u-f-ac u-f-jsb">
			<view>家乡</view>
			<view class="u-f-ac" @tap="showMulLinkageThreePicker">
				<view>{{pickerText}}</view>
				<view class="icon iconfont icon-bianji1"></view>
			</view>
		</view>
		
		<button class="user-set-btn" 
		type="primary" @tap="submit">完成</button>
		
		
		<mpvue-city-picker themeColor="#007AFF" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
		
	</view>
</template>

<script>
	let sex=['男','女'];
	let qg=['秘密','未婚','已婚'];
	let job=['秘密','IT','老师',"学生"];
	import {mapState, mapMutations} from 'vuex'
	import mpvueCityPicker from "../../components/mpvue-citypicker/mpvueCityPicker.vue";
	import {uploudFile} from '@/api/add-input.js'
	import {updateUserInfo,getUserInfo } from '@/api/user-set-userinfo.js'
	export default {
		components:{
			mpvueCityPicker
		},

		data() {
			return {
				userpic:"",
				cropper: false,
				caijian: "",
				username:"",
				sex:"",
				job:"",
				birthday:"",
				cityPickerValueDefault: [0, 0, 1],
				pickerText: '',
				authorFile: undefined,
				height: 100,
				width: 100
			}
		},
		onBackPress() {
		  if (this.$refs.mpvueCityPicker.showPicker) {
		  	this.$refs.mpvueCityPicker.pickerCancel();
		    return true;
		  }
		},
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		},
		mounted() {
			console.log(88)
			if(this.userInfo&&this.userInfo.id){
				this.userpic = this.userInfo.authorUrl
				this.username = this.userInfo.userName
				this.sex = this.userInfo.gender==0?"男":"女"
				this.job = this.userInfo.occupation
				this.birthday = this.userInfo.birthday
				this.cityPickerValueDefault =  [0, 0, 1]
				this.pickerText =  this.userInfo.address
			}
		},
		watch:{
			'userInfo.authorUrl':function(user){
				console.log(user)
				this.userpic = user
			}
		},
		computed: {
			...mapState(['userInfo']),
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			...mapMutations(['setUserInfo']),
			// 三级联动
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				this.pickerText = e.label;
			},
			// 修改生日
			bindDateChange(e) {
				this.birthday = e.target.value
			},
			// 修改头像
			changeimg(){
				uni.chooseImage({
					count:1,
					sizeType:['compressed'],
					success: (res) => {
						this.caijian = res.tempFiles[0].path
						// this.userpic = res.tempFiles[0].path
						// this.authorFile = res.tempFiles[0]
						// this.cropper = true
						uni.navigateTo({
							url:'../user-face/user-face?tempFilePath='+res.tempFiles[0].path
						})
					}
				})

				
			},
			sucessCropper(e){
				console.log(e)
			},
			// 单列选择
			changeOne(val){
				let arr=[];
				switch (val){
					case 'sex':
					arr=sex;
						break;
					case 'qg':
					arr=qg;
						break;
					case 'job':
					arr=job;
						break;
				}
				uni.showActionSheet({
					itemList: arr,
					success: res => {
						switch (val){
							case 'sex':
							this.sex=arr[res.tapIndex];
								break;
							case 'qg':
							this.qg=arr[res.tapIndex];
								break;
							case 'job':
							this.job=arr[res.tapIndex];
								break;
						}
					},
				});
			},
			async submit(){
				let url = this.userpic;
				if(this.authorFile!=undefined){
					 url =uploudFile(this.authorFile)
				}
				
				let data = {
					authorUrl: url,
					userName:this.username,
					gender:this.sex=="男"?0:1,
					occupation:this.job,
					birthday:this.birthday,
					address: this.pickerText,
				}
				let res = await updateUserInfo(data)
				if(res.code==0){
					let data = await getUserInfo("user/info")
					console.log(data)
					if(data.code==0){
						this.setUserInfo(data.data.userInfo)
						uni.setStorageSync('token',data.data.token)
						uni.setStorageSync('userInfo',JSON.stringify(data.data.userInfo))
						uni.showToast({
							title:"信息修改成功",
							icon:'success'
						})
						
					}
				}
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		}
	}
</script>

<style>
@import "../../common/form.css";
.user-set-userinfo-list{
	padding: 20upx;
	border-bottom: 1upx solid #F4F4F4;
}
.user-set-userinfo-list>view:first-child{
	font-size: 32upx;
	font-weight: bold;
	color: #9B9B9B;
}
.user-set-userinfo-list>view:last-child>image{
	width: 80upx;
	height: 80upx;
	border-radius: 100%;
}
.user-set-userinfo-list>view:last-child>input{
	text-align: right;
}
.user-set-userinfo-list>view:last-child>view:last-of-type{
	margin-left: 20upx;
	color: #9B9B9B;
}
</style>
