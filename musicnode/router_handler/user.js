// 导入数据库操作模块
const { func } = require('@hapi/joi');
const db = require('../db/index')
// 导入bcrypt.js模块（对密码进行加密）
const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')

// 注册的具体操作
exports.register = (req, res) => {
  console.log("执行注册函数");
  // 接受表单数据
  const userinfo = req.body
  // 判断数据是否合法
  if (!userinfo.username || !userinfo.password || !userinfo.email) {
    return res.cc('用户名或密码或邮箱不能为空！');
  }
  // 定义 SQL 语句，查询
  const sql = `select * from app_user where username = ?`
  // 执行 SQL 语句并根据结果判断用户名是否被占用
  db.query(sql, [userinfo.username], function (err, results) {
    console.log("查询用户名是否有重复的结果：")
    console.log(results)
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    // 用户名被占用
    if (results.length > 0) {
      return res.cc('用户名被占用，请更换其他用户名！')
    }
    console.log("继续加密执行")
    console.log(userinfo)
    // 对用户的密码进行 bcrypt 加密，返回值为加密后的字符串
    userinfo.password = bcrypt.hashSync(userinfo.password,10)
    // 打印加密后的密码长度
    console.log(userinfo.password.length)
    // sql的插入语句
    const sql = `insert into app_user set ?`
    db.query(sql, { 
      username: userinfo.username, 
      password: userinfo.password, 
      email: userinfo.email 
    }, function (err,results) {
      // 执行 SQL 语句失败
      if(err) return res.cc(err)
      // SQL 语句执行成功，但影响行数不为 1
      if (results.affectedRows !== 1) {
        return res.cc('注册用户失败，请稍后再试！')
      } 
      // 注册成功
      res.cc('注册成功',0)
    })
  })
}

// 登录的具体操作
exports.login = (req,res) => {
  console.log("执行登录函数")
  // 接受表单的数据
  const userinfo = req.body
  // 定义 SQL 语句
  const sql = `select * from app_user where username = ?`
  // 执行查询操作
  db.query(sql, userinfo.username, function (err, results) {
    console.log("登录查询的结果：")
    console.log(results)
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，单丝查询到数据条数不等于1
    if (results.length !== 1) return res.cc('用户名不存在')
      // 对用户的密码，和数据库中存储的密码进行对比
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    // 如果对比的结果等于 false，则证明用户输入的密码错误
    if (!compareResult) {
      return res.cc('密码错误')
    }
    // 隐藏user部分信息，只保留id, username, email
    const user = { ...results[0], password: '', avatar: '' }
    console.log(user)
    // 对用户的信息进行加密，生成Token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: '168h',
    })
    console.log("token打印：" + tokenStr)
    res.send({
      status: 0,
      message: '登录成功！',
      userid: user.id,
      token: 'music ' + tokenStr
    })
  })
}