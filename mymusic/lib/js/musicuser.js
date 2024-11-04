const musicuser = {
	baseUrl: '127.0.0.1:3001/',
	userid: 0,
	token: '',
	tokeninfo: {},
	
	setToken: function(data){
		console.log("设置token");
		console.log(data);
		this.tokeninfo = data;
		this.token = data.token;
		this.userid = data.userid;
		uni.setStorageSync('musictoken',JSON.stringify(data));
	},
	
	setUrl: function(url){
		return "http://" + this.baseUrl + url;
	},
	
	sign: function(url,data){
		if(!data){
			data = {};
		}
		if(this.token){
			
		}else{
			let tokendata = uni.getStorageSync('musictoken');
			if(tokendata) {
				this.tokeninfo = JSON.parse(tokendata);
				this.token = this.tokeninfo.token;
				this.userid = this.tokeninfo.userid;
			}
		}
		
		data.token = this.token;
		console.log(data)
		return data;
	},
	
	request: function(url,data,method,success,error){
		const that = this;
		console.log("路径："+this.setUrl(url))
		uni.request({
			url: this.setUrl(url),
			data: this.sign(url,data),
			method: method,
			dataType: "json",
			success(res){
				if(res.data.status == 0){
					console.log(res.data)
					success(res.data)
				}else{
					error(res.data)
				}
			},
			error(e){
				error(e)
			}
		})
	},
	musicget:function(url,data,success,error){
		this.request(url,data,'GET',success,error)
	},
	musicpost:function(url,data,success,error){
		this.request(url,data,"POST",success,error)
	}
}

export {musicuser}