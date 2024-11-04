<template>
	<gui-page>
		<template v-slot:gBody>
			<music-logoHeader></music-logoHeader>
			<view style="margin-top: 80rpx;padding: 0rpx 60rpx;">
				<form @submit="submit">
					<view class="inputInfo gui-flex gui-rows gui-align-items-center">
						<view class="gui-icons gui-color-blue" style="font-size: 25px;">&#xe6fe;</view>
						<view style="margin-left: 20rpx;margin-top: 10rpx;width: 100%;">
							<input type="text" name="username" placeholder="请输入用户名" v-model="username" />
						</view>
					</view>
					<view class="inputInfo gui-flex gui-rows gui-align-items-center">
						<view class="gui-icons gui-color-blue" style="font-size: 25px;">&#xe630;</view>
						<view style="margin-left: 20rpx;margin-top: 10rpx;width: 100%">
							<input type="password" name="password" placeholder="请输入密码" v-model="password" />
						</view>
					</view>
					<view class="inputInfo gui-flex gui-rows gui-align-items-center">
						<view class="gui-icons gui-color-blue" style="font-size: 25px;;">&#xe630;</view>
						<view style="margin-left: 20rpx;margin-top: 10rpx;width: 100%">
							<input type="password" name="passwordAgain" placeholder="请再次输入密码" v-model="passwordAgain" />
						</view>
					</view>
					<view class="inputInfo gui-flex gui-rows gui-align-items-center">
						<view>
							<image src="../../static/email.png" 
							style="height: 50rpx;width: 50rpx;margin-top: 15rpx;"></image>
						</view>
						<view style="margin-left: 20rpx;margin-top: 10rpx;width: 100%;">
							<input type="text" name="email" placeholder="请输入邮箱地址" v-model="email" />
						</view>
					</view>
					<view style="margin-top: 50rpx;">
						<button type="default" class="gui-button" formType="submit"
						style="border-radius: 50rpx;background-color: #007AFF">
							<text class="gui-color-white gui-button-text">注册</text>
						</button>
					</view>
				</form>
			</view>
		</template>
	</gui-page>
</template>

<script setup>
	import { ref,getCurrentInstance,createApp } from 'vue'
	// 导入GracrUI6的规则检查js文件
	import graceChecker from "@/Grace6/js/checker.js";
	// 获取实例，类似于 vue2 的 this
	const currentInstance = getCurrentInstance();
	const musicapi = currentInstance.appContext.config.globalProperties.musicapi;
	// 定义用户名变量
	const username = ref('');
	// 定义密码变量
	const password = ref('');
	// 定义再次密码变量
	const passwordAgain = ref('');
	// 定义邮箱变量
	const email = ref('');
	
	// 表单提交函数
	function submit(e){
		console.log(e)
		// 获取表单数据
		var formData = e.detail.value;
		console.log(formData)
		// 定义变量的规则
		var rule = [
			{ name: "username", checkType: "string", checkRule: "3,50", errorMsg: "注册账号不能少于3位" },
			{ name: "password", checkType: "string", checkRule: "6,50", errorMsg: "注册密码不能少于6位" },
			{ name: "passwordAgain", checkType: "samewith", checkRule: "password", errorMsg: "两次密码输入不一致" },
			{ name: "email", checkType: "email", checkRule: "", errorMsg: "邮箱地址有误" }
		];
		console.log(rule)
		// 调用graceChecker库里的check函数，检查输入的变量是否符合上述的规则，并返回结果(true或false)
		var checkRes = graceChecker.check(formData, rule);
		if(checkRes) {
			// 注册
			musicapi.Register_User(formData.username,formData.password,formData.email,function(data){
				console.log("获取结果")
				console.log(data)
				uni.showToast({
					title: data.message,
					icon: "none",
					success() {
						uni.navigateBack()
					}
				})
			},function(e){
				console.log(e)
				uni.showToast({
					title: e.message,
					icon: "none"
				})
				username.value = '';
				password.value = '';
				passwordAgain.value = '';
				email.value = '';
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
	/* 表单每行样式 */
	.inputInfo {
		height: 50px;
		border-bottom: 1rpx solid gray;
		padding: 0rpx 20rpx;
	}
</style>
