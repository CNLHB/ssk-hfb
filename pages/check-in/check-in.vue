<template>
	<!-- 打卡日历页面 -->
	<view class='all'>
		<view class="bar">
			<!-- 上一个月 -->
			<view class="previous" @click="handleCalendar(0)">
				<button class="barbtn" v-if="langType=='ch'">上一月</button>
				<button class="barbtn" v-else>Last</button>
			</view>
			<!-- 显示年月 -->
			<view class="date">{{cur_year || "--"}} 年 {{cur_month || "--"}} 月</view>
			<!-- 下一个月 -->
			<view class="next" @click="handleCalendar(1)">
				<button class="barbtn" v-if="langType=='ch'">下一月</button>
				<button class="barbtn" v-else>Next</button>
			</view>
		</view>
		<!-- 显示星期 -->
		<view class="week" v-if="langType=='ch'">
			<view v-for="(item,index) in weeks_ch" :key="index">{{item}}</view>
		</view>
		<view class="week" v-else>
			<view v-for="(item,index) in weeks_en" :key="index">{{item}}</view>
		</view>
		<view  class="myDateTable">
			<view v-for="(item,j) in days" :key="j" class='dateCell'>
				<view v-if="item.date==undefined||item.date == null" class='cell'>
					<text :decode="true">&nbsp;&nbsp;</text>
				</view>
				<view v-else>
					<!-- 已签到日期 -->
					<view v-if="item.isSign == true" class='cell greenColor sel '>
						<!-- <tui-icon name="circle-selected" color="#ffe933" :size="72"></tui-icon> -->
						<text class="sel-text">√</text>
					</view>
					<!-- 漏签 -->
					<view @click="clickSignUp(item.date,0)" class="cell redColor bgGray" v-else-if="cur_year<toYear||(cur_year==toYear&&cur_month<toMonth)||(cur_year==toYear&&cur_month==toMonth&&item.date<today)">
						<!-- 小程序不兼容这个 v-else-if="(new Date(cur_year+'-'+cur_month+'-'+item.date))<(new Date())"> -->
						<text>{{item.date}}</text>
					</view>
					<!-- 今日未签到-->
					<view @click="clickSignUp(item.date,1)" class="cell whiteColor bgBlue" v-else-if="item.date==today&&cur_month==toMonth&&cur_year==toYear">
						<text>签到</text>
					</view>
					<!-- 当前日期之后 -->
					<view class="whiteColor cell" v-else>
						<text>{{item.date}}</text>
					</view>
				</view>

			</view>
		</view>
		<view class="TipArea ">
				<view class="dayText">
					打卡天数
				</view>
				<view class="warpTotalSign">
						<text>已签到</text>
						<text  class="totalSign">{{SignUp.length>0?SignUp.length:"0"}}</text>
						<text>天</text>
				</view>
				<view class="location" v-if="adress!=''">
						<view class="">
							<tui-icon name="location" :size="56"></tui-icon>
						</view>
						<text  class="adress">{{adress}}</text>
				</view>
		</view>
	</view>
</template>

<script>
	import {getSignList, saveSign} from '@/api/check-in.js'
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				days: [],
				SignUp: [],
				cur_year: 0, //当前选的年
				cur_month: 0, //当前选的月
				today: parseInt(new Date().getDate()), //本日
				toMonth: parseInt(new Date().getMonth() + 1), //本月
				toYear: parseInt(new Date().getFullYear()), //本年
				weeks_ch: ['日', '一', '二', '三', '四', '五', '六'],
				weeks_en: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
				adress: ''
			};
		},
		computed:{
			...mapState(['userInfo'])
		},
		props: {
			sendYear: {
				type: Number,
				default: new Date().getFullYear()
			},
			sendMonth: {
				type: Number,
				default: new Date().getMonth() + 1
			},
			dataSource: { //已签到的数据源
				type: Array,
				default: () => {
					return []
				}
			},
			langType: { //只是示例一个翻译而已，要想所有都翻译自己可以再加加
				type: String,
				default: "ch"
			},
		},
		 async created() {
			this.cur_year = this.sendYear;
			this.cur_month = this.sendMonth;
			// this.SignUp = this.dataSource;
			await this.initData()
			this.calculateEmptyGrids(this.cur_year, this.cur_month);
			this.calculateDays(this.cur_year, this.cur_month);
			this.onJudgeSign();
		},
		watch: {
			dataSource: 'onResChange',
		},
		methods: {
			async initData(){
				if(this.userInfo.id){
					let list = await getSignList()
					let signin = this.cur_year + "-" + this.cur_month + "-" + this.today
					
					this.SignUp = list.map((item)=>{
						if(item.signIn==signin){
							this.adress = item.adress
						}
						return item.signIn
					})
					console.log(this.SignUp)
				}
			},
			// 获取当月共多少天
			getThisMonthDays(year, month) {
				return new Date(year, month, 0).getDate()
			},
			// 获取当月第一天星期几
			getFirstDayOfWeek(year, month) {
				return new Date(Date.UTC(year, month - 1, 1)).getDay();
			},
			// 计算当月1号前空了几个格子，把它填充在days数组的前面
			calculateEmptyGrids(year, month) {
				//计算每个月时要清零
				this.days = [];
				const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
				if (firstDayOfWeek > 0) {
					for (let i = 0; i < firstDayOfWeek; i++) {
						var obj = {
							date: null,
							isSign: false
						}
						this.days.push(obj);
					}
				}
			},

			// 绘制当月天数占的格子，并把它放到days数组中
			calculateDays(year, month) {

				const thisMonthDays = this.getThisMonthDays(year, month);
				// this.columnsLen=Math.ceil(thisMonthDays/7);
				// console.log(this.columnsLen);
				for (let i = 1; i <= thisMonthDays; i++) {
					var obj = {
						date: i,
						isSign: false
					}
					this.days.push(obj);
				}
				//console.log(this.days);

			},

			onResChange(newD, oldD) {
				// this.SignUp = newD;
				this.onJudgeSign();
			},
			//匹配判断当月与当月哪些日子签到打卡
			onJudgeSign() {
				var signs = this.SignUp;
				var daysArr = this.days;
				for (var i = 0; i < signs.length; i++) {
					var current = new Date(signs[i].replace(/-/g, "/"));
					var year = current.getFullYear();
					var month = current.getMonth() + 1;
					var day = current.getDate();
					day = parseInt(day);
					for (var j = 0; j < daysArr.length; j++) {
						//年月日相同则打卡成功   						
						if (year == this.cur_year && month == this.cur_month && daysArr[j].date == day) { //&& signs[i].isSign == "今日已打卡"
							// console.log(daysArr[j].date, day);
							daysArr[j].isSign = true;
							
						}
					}
				}
				this.days = daysArr;
			},

			// 切换控制年月，上一个月，下一个月
			async handleCalendar(type) {
				const cur_year = parseInt(this.cur_year);
				const cur_month = parseInt(this.cur_month);
				var newMonth;
				var newYear = cur_year;
				if (type === 0) { //上个月
					newMonth = cur_month - 1;
					if (newMonth < 1) {
						newYear = cur_year - 1;
						newMonth = 12;
					}
				} else {
					newMonth = cur_month + 1;
					if (newMonth > 12) {
						newYear = cur_year + 1;
						newMonth = 1;
					}
				}
				this.calculateEmptyGrids(newYear, newMonth);
				this.calculateDays(newYear, newMonth);

				this.cur_year = newYear;
				this.cur_month = newMonth;
				this.onJudgeSign();
				// this.SignUp = []; //先清空
				// this.$emit('dateChange', this.cur_year+"-"+this.cur_month); //传给调用模板页面去拿新数据				
			},

			async clickSignUp(date, type) { //0补签，1当日签到		
				var str = "签到";
				if (type == 0) {//如果不需要补签功能直接在这阻止不执行后面的代码就行。
					str = "补签";
					return
				}
				uni.showToast({
					title: str + "成功",
					icon: 'success',
					duration: 2000
				});
				let signin = this.cur_year + "-" + this.cur_month + "-" + date
				let data =await saveSign({
					signIn: signin
				})
				if(data.code==0){
					
					this.SignUp.push(this.cur_year + "-" + this.cur_month + "-" + date); //自动加假数据，写了接口就不用了
					this.adress = data.message==""?"中国": data.message
					this.$forceUpdate();
				}

				this.$emit('clickChange', this.cur_year + "-" + this.cur_month + "-" + date); //传给调用模板页面


				//refresh
				this.onJudgeSign();

			}
		}
	}
</script>

<style>
	

	.all {
		margin-top: 10rpx;
		height: 100vh;
		box-sizing: border-box;
		overflow: hidden;
	}

	.all .bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 20rpx 20rpx;
		padding: 10rpx;
	}

	.bar .barbtn {
		height: 30px;
		line-height: 30px;
		font-size: 12px;
	}

	.all .week {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 20rpx;
		padding-left: 40rpx;
		padding-right: 40rpx;
		margin: 20rpx;
		border-radius: 10px;
		background-color: #fff;
	}
	.myDateTable {
		margin: 2vw;
		padding: 2vw;
		border-radius: 10px;
		background: linear-gradient(#74AADA, #94db98);
	}
	.myDateTable .dateCell {
			width: 11vw;
			padding: 1vw;
			display: inline-block;
			text-align: center;
			font-size: 16px;
		}

	.dateCell .cell {
			display: flex;
			border-radius: 50%;
			height: 11vw;
			justify-content: center;
			align-items: center;
		}
	

	.whiteColor {
		color: #fff;
	}

	.greenColor {
		color: #01b90b;
		font-weight: bold;
	}

	.bgWhite {
		background-color: #fff;
	}

	.bgGray {
		background-color: rgba(255, 255, 255, 0.42);
	}

	.bgBlue {
		font-size: 14px;
		background-color: #4b95e6;
	}

	.redColor {
		color: #ff0000;
	}
	
	.TipArea{
		word-break:break-all;
		word-wrap:break-word;
		
		font-size: 14px;
		padding: 10px;
	}
	.impTip{
		display: inline-block;
		color: #ff0000;
	}
	.dayText{
		margin-left: 20upx;
	}
	.sel-text{
		font-size: 48upx;
		color: #ffe933;
		font-weight: 700;
	}
	.warpTotalSign{
		display: flex;
		justify-content: space-around;
		align-items: center;
		line-height: 1.6;
	}
	.totalSign{
		font-size: 100upx;
		font-weight: 700;
		text-align: center;
		color: #ffe933;
	}
	.location{
		display: flex;
		line-height: 1;
		align-items: center;
		padding: 0 80upx;
	}
	.adress{
		padding-left: 20upx;
	}
</style>
