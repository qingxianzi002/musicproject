<template>
	<gui-page>
		<template v-slot:gBody>
			<view style="margin-top: 80rpx;padding: 0rpx 60rpx;">
				<view style="margin-bottom: 150rpx;">
					<view class="gui-rows gui-flex gui-align-items-center">
						<image src="../../static/logo.png" class="logo"></image>
						<view style="margin-left: 20rpx;">
							<text class="gui-h1 gui-color-blue">设置新密码</text>
						</view>
					</view>
					<view style="margin-top: 20rpx ;">
						<text class="gui-color-gray">请输入新密码（不少于6位）</text>
					</view>
				</view>
				<form @submit="submit">
					<view class="inputInfo gui-flex gui-rows gui-align-items-center">
						<view class="gui-icons gui-color-blue" style="font-size: 35px;">&#xe630;</view>
						<view style="margin-left: 20rpx;margin-top: 10rpx;width: 100%;">
							<input type="password" name="password" placeholder="新的密码" v-model="password" class="gui-h3" />
						</view>
					</view>
					<view style="margin-top: 100rpx;">
						<button type="default" class="gui-button" formType="submit"
						style="border-radius: 50rpx;background-color: #007AFF;">
							<text class="gui-color-white gui-button-text">下一步</text>
						</button>
					</view>
				</form>
			</view>
		</template>
	</gui-page>
</template>

<script setup>
	import { ref,getCurrentInstance } from 'vue'
	import { onLoad } from "@dcloudio/uni-app"
	// 导入GraceUI6的规则检查js文件
	import graceChecker from "@/Grace6/js/checker.js";
	// 获取实例，类似于 vue2 的 this
	const currentInstance = getCurrentInstance();
	const musicapi = currentInstance.appContext.config.globalProperties.musicapi;
	// 定义用户的id
	const userid = ref('');
	// 定义新的密码变量
	const password = ref('');
	
	// 获取上个页面传来的参数
	onLoad((options) => {
		console.log("进入输入新密码页面")
		console.log(options)
		userid.value = options.userid;
	})
	
	// 定义下一步的函数
	function submit(e){
		console.log(e)
		// 获取表单数据
		var formData = e.detail.value;
		console.log(formData)
		// 定义变量的规则
		var rule = [
			{ name: "password", checkType: "string", checkRule: "6,50", errorMsg: "新的密码不能少于6位" }
		];
		console.log(rule)
		// 调用graceChecker库里的check函数，检查输入的变量是否符合上述的规则，并返回结果(true或false)
		var checkRes = graceChecker.check(formData, rule);
		if(checkRes) {
			musicapi.ForgetPwd_User(userid.value,password.value,function(data){
				console.log(data)
				uni.reLaunch({
					url: "/pages/login/login",
					success() {
						uni.showToast({
							title: data.message,
							icon: "none"
						})
					}
				})
			},function(e){
				uni.showToast({
					title: e.message,
					icon: "none"
				})
			})
		} else {
			// 不符合定义的规则，弹出相应的提示
			uni.showToast({
				title: graceChecker.error,
				icon: "none"
			})
		}
	}
</script>

<style>
	/* logo的css样式 */
	.logo {
		height: 130rpx;
		width: 130rpx;
	}   
	/* 表单每行样式 */
	.inputInfo {
		height: 50px;
		border-bottom: 1rpx solid gray;
		padding: 0rpx 20rpx;
	}          
</style>
