<template>
	<view class="container">
		<tui-navigation-bar backgroundColor="255,255,255" :isFixed="false" :isOpcity="false">
			<view class="tui-content-box">
				<view class="tui-avatar-box" @tap="back">
					<tui-icon name="back" color="#FFE933" :size="64"></tui-icon>
				</view>
				<view class="tui-search-box">
					<view class="tui-search-text">发布话题</view>
				</view>
				<view class="tui-notice-box" @tap="submit">
					<text class="tui-add-text">发布</text>
				</view>
			</view>
		</tui-navigation-bar>

		<view class="select-topic-class" @tap="selTopicClass">
			<template v-if="category.title!=null">
				<view class="select-title">
					{{category.title}}
				</view>
				<view class="select-desc" @tap.stop="delTitleClass">
					<tui-icon name="shut"  :size="48"></tui-icon>
				</view>
			</template>
			<template v-else>
				<view class="select-title">
					选择分类
				</view>
				<view class="select-desc">
					<text> 发布到指定分类更多人看到哦~</text>
					<tui-icon name="arrowright" color="#FFE933" :size="64"></tui-icon>
				</view>
			</template>

		</view>
		
		<view class="add-topic-text">
			<textarea :value="title"  @input="inputChangeTitle" :maxlength="15"  focus placeholder="请输入15字以内的话题~" />
		</view>
		<view class="add-topic-text">
			<textarea :value="text"  @input="inputChangeDesc" focus placeholder="请输入150字以内的话题描述~" />
		</view>
		<view class="tui-box-upload">
			<tui-upload 
				:showTitle="false"
				@selTitle="selTitleHandle"
				 :limit="1" :serverUrl="serverUrl" @complete="result" @remove="remove"></tui-upload>
		</view>
			
		</view>
	</view>
</template>

<script>
	//实际使用需要传入上传地址，以及上传接口返回数据进行调整组件
	import {mapState,mapMutations} from 'vuex'
	import {
		getCategory,
		addTopicTitle,
	} from "@/api/add-title.js";
		import {baseUrl} from '@/api/common.js'
	export default {
		data() {
			return {
				imageData: [],
				//上传地址
				serverUrl: baseUrl+"upload/cloud",
				text: '',
				top: 0, //标题图标距离顶部距离
				opcity: 0,
				scrollTop: 0.5,
				placeholder: '',
				title: ''
			}
		},
		computed:{
			...mapState(['userInfo', 'selTitle','category'])
		},
		methods: {
			...mapMutations(['delSelTitle','resetSelTitle','delCategory']),
			result(e) {
				this.imageData = e.imgArr;
			},
			remove(e) {
				//移除图片
				let index = e.index
			},
			initNavigation(e) {
				this.opcity = e.opcity;
				this.top = e.top;
			},
			opcityChange(e) {
				this.opcity = e.opcity;
			},
			back() {
				uni.navigateBack();
			},
			inputChangeDesc(event){
				this.text = event.detail.value
			},
			inputChangeTitle(event){
				this.title = event.detail.value
			},
			skipToSearch(index) {
				console.log(index)
				this.$http.href("../../pages/search/search")
			},
			delTitleClass(){
				this.delCategory()
			},
			selTopicClass() {
				this.$http.href('../select-category/select-category?title=1')
			},
			selTitleHandle(){
				this.$http.href('../select-title/select-title')
			},		// 发布
			async submit(){
				console.log("发布")
				if(this.text==''&&this.imageData.length==0){
					this.$http.toast("内容为空！")
					return
				}

				 let data = await addTopicTitle({
					uid:this.userInfo.id,
					cid:this.category.id?this.category.id:0,
					title: this.title,
					description: this.text,
					urlType:"img",
					titlePic: this.imageData[0]?(this.imageData[0].startsWith("http")?this.imageData.join(','):""):'',
				})
				if(data.code==0){
					uni.showToast({
						title: '发表成功',
						icon:"success",
						duration: 200,
						success:()=>{
							this.text = '',
							this.imageData.length=0
							uni.navigateBack()
						}
					});
				}else{
					uni.showToast({
						title: '发表失败',
						icon:'none',
						duration: 200,
						success:()=>{
							this.imageData.length=0
							this.text=''
							uni.navigateBack()
						}
					});
				}

				
			},

		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		}
	}
</script>

<style>
	page {
		background-color: #fff;

	}

	.container {
		padding: 0upx 0 120upx 0;
		box-sizing: border-box;
		position: relative;
	}

	.header {
		padding: 80upx 90upx 60upx 90upx;
		box-sizing: border-box;
	}

	.title {
		font-size: 34upx;
		color: #333;
		font-weight: 500;
	}

	.sub-title {
		font-size: 24upx;
		color: #7a7a7a;
		padding-top: 18upx;
	}

	.tui-box-upload {
		padding-left: 25upx;
		margin-bottom: 90upx;
		box-sizing: border-box;
	}

	.tui-title {
		width: 100%;
		padding: 50upx 30upx 30upx;
		box-sizing: border-box;
		font-weight: bold;
	}

	.tui-header-bg {
		width: 100%;
		margin: 0;
	}

	.tui-header-img {
		width: 100%;
		height: 440upx;
		display: block;
	}

	.tui-header-icon {
		width: 100%;
		position: fixed;
		top: 0;
		padding: 0 12upx;
		display: flex;
		align-items: center;
		height: 64upx;
		transform: translateZ(0);
		z-index: 99999;
		box-sizing: border-box;
	}

	.tui-content-box {
		width: 100%;
		height: 88upx;
		padding: 0 30upx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-avatar-box {
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.tui-avatar {
		width: 56px;
		height: 56px;
		border-radius: 50%;
	}

	.tui-search-box {
		height: 64upx;
		margin: 0 28upx;
		border-radius: 36px;
		font-size: 36px;
		padding: 0 24px;
		box-sizing: border-box;
		color: #bfbfbf;
		display: flex;
		align-items: center;
		font-weight: 700;
		color: #000000;
	}

	.select-topic-class {
		height: 72upx;
		margin: 20upx 20upx;
		border-radius: 10px;
		background-color: #f1f1f1;
		padding: 0 24px;
		box-sizing: border-box;
		color: #bfbfbf;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.select-title {
		color: #000000;
		font-size: 34upx;
		font-weight: 700;
	}
	.select-desc {
		display: flex;
		align-items: center;
	}
	.add-topic-text{
		box-sizing: border-box;
		width: 100%;
		padding-top: 10upx;
		padding-left: 45upx;
	}
	.add-topic-text textarea{
		font-size: 32upx;
		width: 100%;
	}
	.tui-bg-white {
		background-color: #ffffff !important;
	}

	.tui-search-text {
		padding-left: 10upx;
	}

	.tui-add-text {
		color: #000000;
		padding: 10upx 30upx;
		font-size: 28upx;
		box-sizing: border-box;
		font-weight: 700;
		border-radius: 40upx;
		background-color: #FFE933;
	}
	.topic-tilte{
		padding: 10upx 40upx;
		box-sizing: border-box;
		font-weight: 700;
		color:#5677fc;
	}
	.tui-notice-box {
		position: relative;
		flex-shrink: 0;
		font-size: 44upx;
		color: #fff;
	}
</style>
