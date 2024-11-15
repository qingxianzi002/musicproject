<template>
	<gui-page>
		<template v-slot:gBody>
			<view style="margin-top: 80rpx;padding: 0rpx 60rpx;">
				<view style="margin-bottom: 150rpx;">
					<view class="gui-rows gui-flex gui-align-items-center">
						<image src="../../static/logo.png" class="logo"></image>
						<view style="margin-left: 20rpx;">
							<text class="gui-h1 gui-color-blue">输入验证码</text>
						</view>
					</view>
					<view style="margin-top: 20rpx ;">
						<text class="gui-color-gray">验证码已发送至 {{ email }} </text>
					</view>
				</view>
				<form @submit="submit">
					<view class="inputInfo gui-flex gui-rows gui-align-items-center">
						<view>
							<image src="../../static/yanzhengma.png" 
							style="height: 75rpx;width: 75rpx;margin-top: 10rpx;"></image>
						</view>
						<view style="margin-left: 20rpx;margin-top: 10rpx;width: 100%;"
							class="gui-flex gui-rows gui-nowrap gui-align-items-center">
							<input type="number" name="code" placeholder="验证码" v-model="code" class="gui-h3" />
							<view style="margin-left: 50rpx;width: 180rpx;height: 60rpx;
							background-color: #007AFF;color: white;border-radius: 10rpx;"
								class="gui-flex gui-align-items-center gui-justify-content-center">
								<text class="sendmsg gui-block-text gui-text-center" @tap="getVCode">{{vcodeBtnName}}</text>
							</view>
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
	// 定义邮箱变量
	const email = ref('');
	// 定义验证码变量
	const code = ref('');
	// 定义验证码提示框变量
	const vcodeBtnName = ref('')
	// 定义验证码的倒计时变量
	const countNum = ref(60)
	// 定义定时器变量
	const countDownTimer = ref(null)
	
	// 获取上个页面传来的参数
	onLoad((options)=>{
		console.log("进入验证码页面")
		console.log(options)
		email.value = options.email;
		countDownTimer.value = setInterval(()=>{countDown();}, 1000);
	})
	
	// 获取验证码的函数
	function getVCode() {
		// vcodeBtnName 可以阻止按钮被多次点击 多次发送 return 会终止函数继续运行
		if (vcodeBtnName.value != '获取验证码' && vcodeBtnName.value != '重新发送'){
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
		if (countNum.value <= 1){
			clearInterval(countDownTimer.value);
			vcodeBtnName.value = '重新发送';
			return ;
		}
		countNum.value--;
		vcodeBtnName.value = countNum.value + '秒重发';
	}
	
	// 定义下一步的函数
	function submit(e){
		console.log(e)
		// 获取用户输入的表单数据
		var formData = e.detail.value;
		// 打印获取到的表单数据
		console.log(formData)
		// 定义变量的规则
		var rule = [
			{ name: "code", checkType: "reg", checkRule: "^\\d{6}$", errorMsg: "验证码有误" }
		];
		// 检查是否符合规则
		var checkRes = graceChecker.check(formData, rule);
		if(checkRes) {
			musicapi.ForgetCode_User(email.value,code.value,function(data){
				console.log(data)
				uni.navigateTo({
					url: "/pages/forgetpwd/forgetNewPwd?userid=" + data.userid
				})
			},function(e){
				console.log(e)
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
	.sendmsg {
		height: 30rpx;
		width: 200rpx;
		font-size: 24rpx;
		line-height: 30rpx;
	}
</style>
