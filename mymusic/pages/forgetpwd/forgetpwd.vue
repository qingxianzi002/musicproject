<template>
	<gui-page>
		<template v-slot:gBody>	
			<view style="margin-top: 80rpx;padding: 0rpx 60rpx;">
				<view style="margin-bottom: 150rpx;">
					<view class="gui-rows gui-flex gui-align-items-center">
						<image src="../../static/logo.png" class="logo"></image>
						<view style="margin-left: 20rpx;">
							<text class="gui-h1 gui-color-blue">找回密码</text>
						</view>
					</view>
					<view style="margin-top: 20rpx ;">
						<text class="gui-color-gray">请输入绑定的邮箱地址</text>
					</view>
				</view>
				<form @submit="submit">
					<view class="inputInfo gui-flex gui-rows gui-align-items-center">
						<view>
							<image src="../../static/email.png" 
							style="height: 80rpx;width: 80rpx;margin-top: 15rpx;"></image>
						</view>
						<view style="margin-left: 20rpx;margin-top: 10rpx;width: 100%;">
							<input type="text" name="email" placeholder="邮箱地址" v-model="email" class="gui-h3" />
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
	// 导入GraceUI6的规则检查js文件
	import graceChecker from "@/Grace6/js/checker.js";
	// 获取实例，类似于 vue2 的 this
	const currentInstance = getCurrentInstance();
	const musicapi = currentInstance.appContext.config.globalProperties.musicapi;
	// 定义邮箱变量
	const email = ref('');
	
	// 定义下一步的函数
	function submit(e){
		console.log(e)
		// 获取用户输入的表单数据
		var formData = e.detail.value;
		// 打印获取到的表单数据
		console.log(formData)
		// 定义变量的规则
		var rule = [
			{ name: "email", checkType: "email", checkRule: "", errorMsg: "邮箱地址有误" }
		];
		// 检查是否符合规则
		var checkRes = graceChecker.check(formData, rule);
		if(checkRes) {
			musicapi.SendEmail_User(email.value,function(data){
				console.log("成功获取下一步操作")
				console.log(data)
				uni.navigateTo({
					url: "/pages/forgetpwd/forgetCode?email=" + email.value
				})
			},function(e){
				console.log(e);
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
