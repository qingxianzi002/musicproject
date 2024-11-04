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
	}
}

export { musicapi }