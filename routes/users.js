const express = require('express');
const router = express.Router();
const md5 = require('blueimp-md5');

const userModel = require('./../db/models/users')
const respose = require('./../db/respose');

// 過濾欄位
const proj = { password: 0, __v: 0, basis: 0 }
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', function (req, res, next) {
  // 接收參數
  const { account, password, type } = req.body
  // 處理參數
  // 帳號存在 不給註冊
  userModel.findOne({ account }, (err, user) => {
    if (err) {
      console.log(err)
    }
    if (user) {
      res.send(new respose.FailResponse('帳號已存在'))
    } else {
      // 新增
      new userModel({ account, type, password: md5(password) }).save((err, user) => {
        if (err) {
          console.log(err)
        }
        if (user) {
          // 生成 cookie 交由瀏覽器保存 (一天)
          res.cookie('userid', user._id, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false })
          // 將 password 濾掉 , 另外組一個返回物件
          const data = { account, type, _id: user._id }
          res.send(new respose.SuccessResponse(data))
        }
      })
    }
  })
});

// 登入
router.post('/login', function (req, res, next) {
  // 接收參數
  const { account, password } = req.body
  // 處理參數
  // 查巡
  userModel.findOne({ account, password: md5(password) }, proj, (err, user) => {
    if (err) {
      console.log(err)
    }
    if (user) {
      // 登入成功
      // 生成 cookie 交由瀏覽器保存 (一天)
      res.cookie('userid', user._id, { maxAge: 24 * 60 * 60 * 1000 })
      res.send(new respose.SuccessResponse(user))
    } else {
      // 登入失敗
      res.send(new respose.FailResponse('查無帳號或是密碼錯誤'))
    }
  })
});

// 修改 (完善訊息)
router.post('/update', function (req, res, next) {
  // 接收參數
  const userInfo = req.body
  // 處理參數
  // 從 cookies 獲得 userid
  // 如果 cookies 過期或是被刪除 , 則錯誤
  if (!req.cookies || !req.cookies.userid) {
    return res.send(new respose.FailResponse('請重新登入'))
  }
  
  // 頭像必填
  if(!userInfo.avatar){
    return res.send(new respose.FailResponse('頭像必填'))
  }

  // 更新
  userModel.findByIdAndUpdate({ _id: req.cookies.userid }, { $set: userInfo }, (err, oldUser) => {
    if (err) {
      console.log(err)
    }

    if (!oldUser) {
      // 失敗
      // 根據 cookies 資訊查詢 , 找不到代表 cookies 是壞資料要把它刪掉
      res.cookie.clearCookies('userid')
      // 提示重新登入
      res.send(new respose.FailResponse('請重新登入'))
    } else {
      // 修改成功 將舊資訊與新資訊合組返回
      // 舊資訊需要 _id, account ,type
      const { _id, account, type } = oldUser
      const fullInfo = Object.assign({ _id, account, type }, userInfo)
      res.send(new respose.SuccessResponse(fullInfo))
    }
  })
});


// 根據 cookies 返回 user 資訊
router.get('/user', function (req, res, next) {
  // 從 cookies 抓 userid
  const userId = req.cookies.userid
  // 不存在返回錯誤
  if (!userId) {
    res.send(new respose.FailResponse('請重新登入'))
  }

  userModel.findById({ _id: userId }, proj, (err, user) => {
    if (err) {
      console.log(err)
    }

    if (!user) {
      // 根據 cookies 資訊查詢 , 找不到代表 cookies 是壞資料要把它刪掉
      res.cookie.clearCookies('userid')
      // 提示重新登入
      res.send(new respose.FailResponse('請重新登入'))
    } else {
      res.send(new respose.SuccessResponse(user))
    }
  })
});


// 獲取指定類型的用戶 (0:應徵者 1:老闆)
router.get('/userlist', function (req, res, next) {

  const { type } = req.query

  userModel.find({ type }, proj, (err, users) => {
    if (err) {
      res.send(new respose.FailResponse(err))
    } else {
      res.send(new respose.SuccessResponse(users))
    }
  })
});





module.exports = router;
