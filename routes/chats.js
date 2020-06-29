const express = require('express');
const router = express.Router();

const UserModel = require('./../db/models/users')
const ChatModel = require('./../db/models/chats')
const respose = require('./../db/respose');

// 過濾欄位
// const proj = { password: 0, __v: 0, basis: 0, 'basis.createTime': 1 }
const proj = { password: 0, __v: 0, basis: 0, 'basis.updateTime': 0, 'basis.status': 0 }

/* 根據 cookies 裡的 userid 返回相關訊息 */
router.get('/msglist', function (req, res, next) {
    // 從 cookies 抓 userid
    const userId = req.cookies.userid

    // 空對象
    // 之後的結構為 key:_id value:{ account , avatar }
    let users = {}

    // 返回所有有頭像的 user 的 account.avatar , 這是因為要從聊天訊息中反抓人員帳號及頭像顯示
    UserModel.find({ avatar: { $exists: true } }, (err, docUsers) => {
        docUsers.forEach(user => (
            users[user._id] = { account: user.account, avatar: user.avatar }
        ))
    })

    // 根據cookies 裡的 userid 抓取相關的聊天訊息
    ChatModel.find({ $or: [{ from: userId }, { to: userId }] }, proj, (err, chatMsgs) => {
        // 返回所有用戶及當前用戶的相關聊天訊息
        res.send(new respose.SuccessResponse({ users, chatMsgs }))
    })
});

/* 將訊息改為已讀 */
router.post('/readmsg', function (req, res, next) {
    // 得到請求中的 from.to , 更新特定人發送給當前使用者的訊息
    const from = req.body.from
    const to = req.cookies.userid

    // 更新
    ChatModel.update({ from, to, read: false }, { $set: { read: true } }, { multi: true }, (err, oldChats) => {
        // 返回更新的數量 讓前端可以計算總共的未讀數量 oldChats.nModified)
        console.dir(oldChats)
        res.send(new respose.SuccessResponse(oldChats.nModified)) // 更新的数量
    })
});

module.exports = router;