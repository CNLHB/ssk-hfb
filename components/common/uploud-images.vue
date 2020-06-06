<template>
	<view class="uni-list list-pd">
		<view class="uni-list-cell cell-pd">
			<view class="uni-uploader">
				<view class="uni-uploader-head">
					<view class="uni-uploader-title">点击可预览选好的图片</view>
					<view class="uni-uploader-info">{{imageList.length}}/{{size}}</view>
				</view>
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<block v-for="(image,index) in imageList" :key="index">
							<view class="uni-uploader__file">
								<view class="icon iconfont icon-shanchu" @tap="delect(index)"></view>
								<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
							</view>
						</block>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	export default {
		props:{
			size:{
				type:Number,
				default:9
			}
		},
		data() {
			return {
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
			}
		},
		methods:{
			chooseImage: async function() {
				if (this.imageList.length >= this.size) { 
					this.$http.toast("最多能选择九张图片!")
					return; 
					}
				
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: 9,
					success: (res) => {
						console.log(res.tempFiles)

						let urls = res.tempFiles.map((item)=>{
							if(this.imageList.length < this.size){
								this.imageList.push(item.path)
							}
							return item.path
						})

						// this.imageList = this.imageList.concat(urls);
						this.$emit('uploud',this.imageList,res.tempFiles)
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			delect(index){
				uni.showModal({
					title: '提示',
					content: '是否要删除该图片',
					success: (res)=> {
						if (res.confirm) {
							this.imageList.splice(index,1);
							this.$emit('uploud',this.imageList)
						}
					}
				});
			}
		}
	}
</script>

<style>
	.cell-pd {
		padding: 22upx 30upx;
	}
	.uni-uploader__file{
		position: relative;
	}
	.list-pd {
		margin-top: 50upx;
	}
	.uni-uploader__input-box{
		margin: 10upx 0 10upx 10upx;
	}
	.icon-shanchu{
		position: absolute;
		right: 0;
		top: 0;
		background: #333333;
		color: #FFFFFF;
		padding: 2upx 10upx;
		border-radius:10upx;
		z-index: 100;
	}
</style>
