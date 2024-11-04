// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()
const joi = require('@hapi/joi')

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

// 配置解析 JSON 格式的表单数据
app.use(express.json());

// 响应数据的中间件，一定要在路由封装之前，封装res.cc函数
app.use((req,res,next)=>{
  console.log("执行返回前端的函数")
  // status 默认值为1，表示失败的情况，status = 0 为成功
  // err 的值，可能为一个错误的对象，也可能是一个错误的描述字符串
  // 向前端发送结果
  res.cc = function(err,status = 1){
    res.send({
      // 状态
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err
    })
  }
  next();
})

// 一定要在路由之前配置解析token的中间件
// 导入配置文件
const config = require('./config')
// 解析 token 的中间件
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 导入并注册登录用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 定义错误中间件
app.use((err, req, res, next) => {
  console.log("错误中间件")
  console.log(err)
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 身份认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知错误
  res.cc(err)
})

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3001, function () {
  console.log('监听3001端口，服务器启动');
})