import wxj from "../common/wxshare.js" //这是wx js-sdk的js文件
//点击邀请投票分享到朋友圈
/*
*参数根据自己的业务需求
 url:是当前页面的路径，let url=location.href.split("#")[0];
*desc:分享描述
imgUrl:分享小图标的连接，这里的连接必须在js接口安全域名下可以访问的。否者小图标不生效
shareUserName与shareDesignName 进行拼接做tittle
*/
function myshare(url, desc, imgUrl, shareUserName, shareDesignName) {
	//分享功能
	uni.request({
		// url: "http://192.168.31.164:8081/api/user/share", 
		url: "http://api.hfb.xquery.cn/api/user/share", 
		
		//后端接口，返回微信签名串的接口,即上面的Controller
		method: 'GET',
		data: {
			'url': url
		},
		success(res) {
			console.log(res.data)
			//转换为json对象
			var result = res.data;
			let param = window.location.href.split("#")[1];
			//设置分享的标题
			// var title = "我是:" + shareUserName + ",我为***命名为：" + shareDesignName + ",请为我投票";
			
			var title = "韩师剑七";
			let host = window.location.href.split("?")[0];
			console.log("========host======" + host)
			wxj.config({
				debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: result.appid, // 必填，公众号的唯一标识
				timestamp: result.timestamp, // 必填，生成签名的时间戳
				nonceStr: result.noncestr, // 必填，生成签名的随机串
				signature: result.sgture, // 必填，签名
				jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"] // 必填，需要使用的JS接口列表
				/* 即将废弃	jsApiList: ["onMenuShareAppMessage","onMenuShareTimeline"] // 必填，需要使用的JS接口列表 */
			});
			wxj.ready(function() { //需在用户可能点击分享按钮前就先调用
				wxj.updateAppMessageShareData({
					title: title, // 分享标题
					desc: desc, // 分享描述
					link: "http://mobile.hfb.xquery.cn",
					// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: imgUrl, // 分享图标
					success: function() {

						alert("分享成功")
						// 设置成功
					},
					fail: function(res) {
						console.log("err")
					},
					cancel: function() {
						// 用户取消分享后执行的回调函数

					}
				});
				wxj.updateTimelineShareData({
					title: title, // 分享标题
					desc: desc, // 分享描述
					link: "http://mobile.hfb.xquery.cn", //http://mobile.hfb.xquery.cn 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: imgUrl, // 分享图标
					success: function(res) {
						console.log(res.data)

						// 设置成功
					},
					fail: function(res) {
						alert("分享失败")
							console.log("err")
					},
					cancel: function() {
						// 用户取消分享后执行的回调函数	 
							console.log("can")
					}
				})
			});
		}
	})
}

export default myshare
