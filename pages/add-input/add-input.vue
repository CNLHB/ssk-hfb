<template>
	<view>
		<!-- 自定义导航栏 -->
		<uni-nav-bar :statusBar="true" rightText="发布" leftText="返回" @click-left="back" @click-right="submit">
			
			<view class="u-f-ajc" @tap="changelook">
				{{yinsi}}
				<view class="icon iconfont icon-xialazhankai"></view>
			</view>
		</uni-nav-bar>
		<!-- 多行输入框 -->
		<view class="uni-textarea">
			<textarea v-model="text" placeholder="说一句话吧~" />
		</view>
		<!-- 上传多图 -->
		<uploud-images @uploud="uploud"></uploud-images>
		<!-- 弹出公告 -->
		<uni-popup :show="showpopup" position="middle" mode="fixed" @hidePopup="hidePopup">
			<view class="gonggao">
				<view class="u-f-ajc">
					<image src="../../static/common/addinput.png" mode="widthFix"></image>
				</view>
				<view>涉及黄色，政治，广告及骚扰信息</view>
				<button type="default" @tap="hidePopup">我知道了</button>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	let changelook= ['韩府', '娱乐',"二手","周边"];
	import uniNavBar from "../../components/uni-nav-bar/uni-nav-bar.vue";
	import uploudImages from "../../components/common/uploud-images.vue";
	import uniPopup from "../../components/uni-popup/uni-popup.vue";
	import {mapState} from 'vuex'
	export default {
		components:{
			uniNavBar,
			uploudImages,
			uniPopup
		},
		data() {
			return {
				isget:false,
				showpopup:false,
				yinsi:"韩府",
				cid:1,
				text:"",
				imglist:[],
				files: []
			};
		},
		onBackPress() {
			// 如果有值
			if(!this.text && this.imglist.length<1){ return; }
			if(!this.isget){
				this.baocun();
				return true;
			}
		},
		async onLoad() {
			let data = await this.$http.get('/category/list')
			changelook = data
		},
		computed:{
			...mapState(['userInfo'])
		},
		methods:{
			// 保存为草稿
			baocun(){
				uni.showModal({
					content: '是否要保存为草稿？',
					cancelText: '不保存',
					confirmText: '保存',
					success: res => {
						if(res.confirm){
							console.log("保存")
						}else{
							console.log("不保存")
						}
						this.isget=true;
						uni.navigateBack({
							delta: 1
						});
					},
				});
			},
			// 返回
			back(){
				uni.navigateBack({ delta: 1 });
			},
			// 发布
			async submit(){
				console.log("发布")
				if(this.text==''&&this.files.length==0){
					return
				}
				let images = []
				for(let i=0;i<this.files.length;i++){
					let url = await this.$http.uploudFile("/upload/cloud",this.files[i])
					images.push(url);
						console.log(i)
				}

				await this.$http.post("/topic",{
					uid:this.userInfo.id,
					cid:this.cid,
					title:this.text,
					urlType:"img",
					images: images.join(',')
				})

				
				uni.showToast({
					title: '发表成功',
					icon:"success",
					duration: 200,
					success:()=>{
						this.text = '',
						this.files.length=0
						this.imglist.length=0
						
						uni.navigateBack({
							delta:10
						})
					}
				});
				
			},
			// 隐私
			changelook(){
				uni.showActionSheet({
					itemList:changelook.map((item)=>item.name),
					success: (res)=> {
						this.yinsi=changelook[res.tapIndex].name
						this.cid =changelook[res.tapIndex].id
					}
				});
			},
			uploud(arr, files){
				this.imglist=arr;
				this.files = files
				
				console.log(this.imglist)
			},
			hidePopup(){
				this.showpopup=false;
			}
		}
	}
</script>

<style>
.uni-textarea{
	border: 1upx solid #EEEEEE;
}
.gonggao{
	width: 500upx;
}
.gonggao image{
	width: 75%;
	margin-bottom: 20upx;
}
.gonggao button{
	margin-top: 20upx;
	background: #FFE934;
	color: #171606;
}
</style>
