<template>
	<gui-page>
		<template v-slot:gBody>
			<music-logoHeader></music-logoHeader>
			<view style="margin-top: 80rpx;padding: 0rpx 60rpx;">
				<form @submit="submit">
					<view class="gui-h3 gui-bold" style="color: #645d63;margin-bottom: 20rpx;">邮箱登录</view>
					<view class="inputInfo gui-flex gui-rows gui-align-items-center">
						<view>
							<image src="../../static/email.png" style="height: 50rpx;width: 50rpx;margin-top: 15rpx;">
							</image>
						</view>
						<view style="margin-left: 20rpx;margin-top: 10rpx;width: 100%;">
							<input type="text" name="email" placeholder="请输入邮箱地址" v-model="email" />
						</view>
					</view>
					<view class="inputInfo gui-flex gui-rows gui-align-items-center">
						<view>
							<image src="../../static/yanzhengma.png"
								style="height: 50rpx;width: 50rpx;margin-top: 15rpx;"></image>
						</view>
						<view style="margin-left: 20rpx;margin-top: 10rpx;width: 100%;"
							class="gui-flex gui-rows gui-nowrap gui-align-items-center">
							<input type="number" name="yzm" placeholder="请输入验证码" v-model="yzm" />
							<view style="margin-left: 50rpx;width: 180rpx;height: 60rpx;
							background-color: #007AFF;color: white;border-radius: 10rpx;"
								class="gui-flex gui-align-items-center gui-justify-content-center">
								<text class="sendmsg gui-block-text gui-text-center" @tap="getVCode">{{vcodeBtnName}}</text>
							</view>
						</view>
					</view>
					<view class="gui-margin-top gui-flex gui-rows gui-space-between"
					hover-class="gui-tap">
						<text></text>
						<text class="gui-text gui-color-gray gui-block-text gui-text-right" @tap="loginbypwd">密码登录</text>
					</view>
					<view style="margin-top: 38rpx;">
						<button type="default" class="gui-button" formType="submit"
						style="border-radius: 50rpx;background-color: #007AFF;">
							<text class="gui-color-white gui-button-text">登录</text>
						</button>
					</view>
				</form>
			</view>
		</template>
	</gui-page>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance
	} from 'vue'
	// 导入GraceUI6的规则检查js文件
	import graceChecker from '@/Grace6/js/checker.js'
	// 获取实例，类似于 vue2 的 this
	const currentInstance = getCurrentInstance();
	const musicapi = currentInstance.appContext.config.globalProperties.musicapi;
	// 定义邮箱变量
	const email = ref('')
	// 定义验证码变量
	const yzm = ref('')
	// 定义验证码提示框变量
	const vcodeBtnName = ref('发送验证码')
	// 定义验证码的倒计时变量
	const countNum = ref(120)
	// 定义定时器变量
	const countDownTimer = ref(null)
	// 密码登录函数
	function loginbypwd() {
		uni.navigateBack()
	}
	// 获取验证码的函数
	function getVCode() {
		var emailrule = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
		if (!emailrule.test(email.value)){
			uni.showToast({
				title: "请正确填写邮箱地址",
				icon: "none"
			})
			return false;
		}
		// vcodeBtnName 可以阻止按钮被多次点击 多次发送 return 会终止函数继续运行
		if (vcodeBtnName.value != '发送验证码' && vcodeBtnName.value != '重新发送'){
			return ;
		}
		vcodeBtnName.value = "发送中...";
		// 与后端 api 交互，发送验证码
		musicapi.SendEmail_User(email.value,function(data){
			console.log("发送")
			console.log(data)
			// 假设发送成功，给用户提示
			uni.showToast({
				title: '邮箱验证码已发送，请注意查收',
				icon: "none"
			})
		},function(e){
			console.log(e)
			uni.showToast({
				title: e.message,
				icon: "none"
			})
		})
		// 倒计时
		countNum.value = 60;
		countDownTimer.value = setInterval(()=>{countDown();}, 1000);
		
	}
	// 验证码按钮函数
	function countDown() {
		if (countNum.value < 1){
			clearInterval(countDownTimer.value);
			vcodeBtnName.value = '重新发送';
			return ;
		}
		countNum.value--;
		vcodeBtnName.value = countNum.value + '秒重发';
	}
	// 定义登录函数
	function submit(e) {
		console.log(e)
		// 获取输入的表单数据
		var formData = e.detail.value;
		console.log(formData);
		// 利用 graceUI 的表单验证工具
		// 定义表单规则
		var rule = [
			{ name: "email", checkType: "email", checkRule: "", errorMsg: "邮箱地址有误" },
			{ name: "yzm", checkType: "reg", checkRule: "^\\d{6}$", errorMsg: "验证码有误" }
		];
		var checkRes = graceChecker.check(formData, rule);
		console.log(checkRes)
		if(checkRes){
			// 处理登录请求
			musicapi.LoginEmail_User(email.value,yzm.value,function(data){
				console.log("获取数据")
				console.log(data)
				uni.showToast({
					title: data.message,
					icon: "none"
				})
			},function(e){
				console.log(e)
				uni.showToast({
					title: e.message,
					icon: "none"
				})
				email.value = '';
				yzm.value = '';
			})
		}else{
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

	.sendmsg {
		height: 30rpx;
		width: 200rpx;
		font-size: 24rpx;
		line-height: 30rpx;
	}
</style>