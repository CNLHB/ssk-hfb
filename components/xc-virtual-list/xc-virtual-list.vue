<template>
	<view class="virtual-list">
		<scroll-view scroll-y="true" 
					 :style="{
						 'height': scrollHeight + 'px',
						 'position': 'relative'
					 }" 
					 @scroll="handleScroll">
			<view class="scroll-bar" 
				  :style="{
					'height': localHeight + 'px'
				  }"></view>
			<view class="list" 
				  :style="{
					  'transform': `translateY(${offset}px)`
				  }">
				<view class="item-wrap" 
					  v-for="item in visibleData" 
					  :key="item.id">
					<slot :item="item"></slot>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'VirtualList',
		props: {
			// 所有的items
			items: Array,
			// 可视区域的item数量
			remain: Number,
			// item大小
			size: Number,
		},
		data() {
			return {
				// 起始
				start: 0,
				// 结束
				end: this.remain,
				// list 偏移量
				offset: 0,
			}
		},
		computed: {
			// 预留项
			preCount() {
				return Math.min(this.start, this.remain);
			},
			nextCount() {
				return Math.min(this.items.length - this.end, this.remain);
			},
			// 可视区域的item
			visibleData() {
				const start = this.start - this.preCount;
				const end = this.end + this.nextCount;
				return this.items.slice(start, end);
			},
			scrollHeight() {
				return this.remain * this.size
			},
			localHeight() {
				return this.items.length * this.size
			}
		},
		methods: {
			handleScroll(ev) {
				const scrollTop = ev.detail.scrollTop;
				// 开始位置
				const start = Math.floor(scrollTop / this.size)
				this.start = start < 0 ? 0 : start;
				// 结束位置
				this.end = this.start + this.remain;
				// 计算偏移
				const offset = scrollTop - (scrollTop % this.size) - this.preCount * this.size
				this.offset = offset < 0 ? 0 : offset;
			}
		}
	}
</script>

<style scoped>
	.virtual-list{
		height: 100%;
	}
	.list {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}
</style>
