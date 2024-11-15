import {musicuser} from '@/lib/js/musicuser.js'
const musicapi = {
	Register_User: function(username,password,email,success,error){
		musicuser.musicpost('api/register',{username,password,email},success,error)
	},
	Login_User: function(username,password,success,error){
		musicuser.musicpost('api/login',{username,password},function(data){
			console.log("获取token数据")
			console.log(data)
			musicuser.setToken(data)
			success(data)
		},error)
	},
	SendEmail_User: function(email,success,error){
		musicuser.musicpost('api/email',{email},success,error)
	},
	LoginEmail_User: function(email,code,success,error){
		musicuser.musicpost('api/loginEmail',{email,code},function(data){
			musicuser.setToken(data)
			success(data)
		},error)
	},
	ForgetCode_User: function(email,code,success,error){
		musicuser.musicpost('api/forgetCode',{email,code},success,error)
	},
	ForgetPwd_User: function(userid,password,success,error){
		musicuser.musicpost('api/forgetNewPwd',{userid,password},success,error)
	}
}

export { musicapi }