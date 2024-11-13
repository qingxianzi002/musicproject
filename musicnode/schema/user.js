const joi = require('joi')
/**
 * string() 值必须是字符串
 * alphanum() 值必须是字符串，且只包含字母数字字符
 * min(length) 值的长度必须大于等于指定长度
 * max(length) 值的长度必须小于等于指定长度
 * required() 值不能为空
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */
// 用户名的验证规则
const username = joi.string().min(3).max(50).required();
// 密码的验证规则
const password = joi.string().pattern(/^[\S]{6,50}$/).required()
// 用户id的验证规则
const id = joi.number().integer().min(1).required();
// 邮箱email的验证规则
const email = joi.string().email().required()
// dataUri() 指的是如下格式的字符串数据
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()
// 验证码的验证规则
const code = joi.string().length(6).pattern(/^\d+$/).required();

// 注册表单的验证规则对象
exports.register_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password,
    email
  }
}

// 登录表单的验证规则对象
exports.login_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password
  }
}

// 登录表单中发送验证码
exports.login_sendCode_schema = {
  body: {
    email
  }
}

// 邮箱登陆的验证规则
exports.login_email_schema = {
  body: {
    email,
    code
  }
}