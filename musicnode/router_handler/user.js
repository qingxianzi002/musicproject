// 导入数据库操作模块
const { func } = require('@hapi/joi');
const db = require('../db/index')
// 导入bcrypt.js模块（对密码进行加密）
const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')
// 导入email配置文件
const nodeMail = require('../email/nodemailer')

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
exports.login = (req, res) => {
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
    const user = { ...results[0], password: '', avatar: '',code: '' }
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

// 发送验证码
exports.loginSendCode = (req, res) => {
  const email = req.body.email;
  const checkEmailSql = `select * from app_user where email = ?`;
  db.query(checkEmailSql, [email], (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length == 0) {
      return res.cc('邮箱未被注册！');
    }
    console.log(email)
    // 每次发送前清除之前保存的验证码（用户可以多次点击发送验证码）
    const clearCodeSql = "update app_user set code = null where email = ?";
    console.log(clearCodeSql)
    db.query(clearCodeSql, [email], (err, results) => {
      if (err) {
        return res.cc(err);
      }
      // 产生随机验证码
      var code = "";
      for (var i = 0; i < 6; i++){
        code += Math.floor(Math.random() * 10);
      }
      console.log("随机验证码："+code);
      // 设置收件人信息
      let options = {
        // 填写发件人邮箱
        from: "qxzfckyou@163.com",
        // 发送至目标邮箱
        to: req.body.email,
        // 主题
        subject: "我的音乐平台邮箱验证",
        text: `验证码`,
        // 邮件内容
        html: `
          <p>尊敬的用户，您好：</p>
          <p>您的验证码是：<strong>【${code}】</strong>。请不要把验证码泄露给其他人。</p>
        `
      };
      nodeMail.sendMail(options, (err, info) => {
        if(err) {
          res.cc(err);
        }else{
          code = bcrypt.hashSync(code, 10);
          const sendCodeSql = `update app_user set code=? where email=?`;
          db.query(sendCodeSql, [code,email],(err,results)=>{
            if(err){
              res.cc(err);
            }
            if(results.affectedRows != 1){
              return res.cc("发送验证码失败！");
            }
            return res.cc("发送验证码成功！",0);
            // setTimeout(() => {
              
            // }, 1000*60);
          })
        }
      })
    })
  })
}

// 邮箱登陆函数
exports.loginEmail = (req, res) => {
  console.log("执行邮箱登录函数")
  console.log(req.body)
  const sql = `select * from app_user where email = ?`
  db.query(sql, [req.body.email], function(err, results) {
    console.log("执行查询邮箱")
    console.log(results)
    // 执行SQL语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，查询的数据条数不等于1
    if (results.length !== 1) {
      return res.cc('邮箱未注册')
    }
    // 对验证码，和数据库中存储的验证码进行对比
    const compareResult = bcrypt.compareSync(req.body.code, results[0].code)
    // 如果对比的结果等于 false，则证明用户输入的验证码错误
    if (!compareResult) {
      return res.cc('验证码错误')
    }
    // 隐藏user部分信息，只保留id, username, email
    const user = { ...results[0], password: '', avatar: '',code: '' }
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

// 找回密码的邮箱验证码函数
exports.forgetCode = (req, res) => {
  console.log("执行验证验证码的函数")
  console.log("执行邮箱登录函数")
  console.log(req.body)
  const sql = `select * from app_user where email = ?`
  db.query(sql, [req.body.email], function(err, results) {
    // 执行SQL语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，查询的数据条数不等于1
    if (results.length !== 1) {
      return res.cc('邮箱未注册')
    }
    // 对验证码，和数据库中存储的验证码进行对比
    const compareResult = bcrypt.compareSync(req.body.code, results[0].code)
    // 如果对比的结果等于 false，则证明用户输入的验证码错误
    if (!compareResult) {
      return res.cc('验证码错误')
    }
    res.send({
      status: 0,
      message: "验证成功！",
      userid: results[0].id
    })
  })
}

// 找回密码的设置新密码函数
exports.forgetNewPwd = (req, res) => {
  console.log("执行设置新密码函数")
  console.log(req.body)
  // 获取前端传来的参数
  const userinfo = req.body;
  // 对用户的新密码进行 bcrypt 加密，返回值为加密后的字符串
  userinfo.password = bcrypt.hashSync(req.body.password,10)
  // 根据用户id进行对密码的更新
  const sql = `update app_user set password = ? where id=?`;
  db.query(sql, [userinfo.password, userinfo.userid], function(err, results) {
    console.log(results)
    // 执行SQL语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，更新数据条数不等于1
    if (results.affectedRows !== 1) {
      res.cc('设置新密码失败')
    }
    res.cc('新密码设置成功',0)
  })
}