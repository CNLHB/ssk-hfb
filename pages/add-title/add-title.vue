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
			<input type="text" v-model="text" placeholder="标题" />
			<!-- <textarea v-model="text" placeholder="说一句话吧~" /> -->
		</view>
		<view class="uni-textarea">
			<input type="text" v-model="description" placeholder="描述" />
			<!-- <textarea v-model="text" placeholder="说一句话吧~" /> -->
		</view>
		<!-- 上传多图 -->
		<uploud-images @uploud="uploud" :size="size"></uploud-images>

	</view>
</template>

<script>
	let changelook = ['韩府', '娱乐', "二手", "周边"];
	let changelookId = [{
			name: '韩府',
			id: 3,
		},
		{
			name: '娱乐',
			id: 7,
		},
		{
			name: '二手',
			id: 6,
		},
		{
			name: '周边',
			id: 7,
		},
	]
	import uniNavBar from "../../components/uni-nav-bar/uni-nav-bar.vue";
	import uploudImages from "../../components/common/uploud-images.vue";
	import uniPopup from "../../components/uni-popup/uni-popup.vue";
	import {
		getCategory,
		addTopicTitle,
		uploadFile
	} from "@/api/add-title.js";

	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			uniNavBar,
			uploudImages,
			uniPopup
		},
		data() {
			return {
				isget: false,
				size: 1,
				showpopup: false,
				yinsi: "韩府",
				cid: 1,
				text: "",
				description: '',
				imglist: [],
				files: []
			};
		},
		onBackPress() {
			// 如果有值
			if (!this.text && this.imglist.length < 1) {
				return;
			}
			if (!this.isget) {
				this.baocun();
				return true;
			}
		},
		async onLoad() {
			let data = await getCategory()
			changelook = data
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			// 保存为草稿
			baocun() {
				uni.showModal({
					content: '是否要保存为草稿？',
					cancelText: '不保存',
					confirmText: '保存',
					success: res => {
						if (res.confirm) {
							console.log("保存")
						} else {
							console.log("不保存")
						}
						this.isget = true;
						uni.navigateBack({
							delta: 1
						});
					},
				});
			},
			// 返回
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 发布
			async submit() {
				if (this.text == '' && this.files.length == 0) {
					return
				}
				let url = await uploudFile(this.files[0])
				addTopicTitle({
					uid: this.userInfo.id,
					cid: this.cid,
					title: this.text,
					description: this.description,
					titlePic: url
				})
				uni.showToast({
					title: '发表成功',
					icon: "success",
					duration: 200,
					success: () => {
						this.text = '',
							this.files.length = 0
						this.imglist.length = 0

						uni.navigateBack({
							delta: 10
						})
					}
				});

			},
			changelook() {
				uni.showActionSheet({
					itemList: changelook.map((item) => item.name),
					success: (res) => {
						this.yinsi = changelook[res.tapIndex].name
						this.cid = changelookId[res.tapIndex].id
					}
				});
			},
			uploud(arr, files) {
				this.imglist = arr;
				this.files = files
			},
			hidePopup() {
				this.showpopup = false;
			}
		}
	}
</script>

<style>
	.uni-textarea {
		overflow: hidden;
		height: 88upx;
		margin: 0;
		font-family: Arial, Helvetica, sans-serif;
		line-height: 56upx;
		border-radius: 0;
		resize: none;
		display: block;
		margin: 10upx 10upx;
		padding: 12upx 70upx 12upx 12upx;
		font-size: 18px;
		border-bottom: 1upx solid #7c7c95;
		box-sizing: border-box;
	}

	.gonggao {
		width: 500upx;
	}

	.gonggao image {
		width: 75%;
		margin-bottom: 20upx;
	}

	.gonggao button {
		margin-top: 20upx;
		background: #FFE934;
		color: #171606;
	}
</style>
