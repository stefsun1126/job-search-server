const mongoose = require('mongoose');
const basisSchema = require('./basis')

const Schema = mongoose.Schema;

/*
    chats:聊天訊息文檔
*/
const chatSchema = new Schema({
    // 發送用戶的id
    from: { type: String, required: true },
    // 接收用戶的id
    to: { type: String, required: true },
    // from 和 to 組成的字串 , 用來辨別 from 跟 to 誰是一組
    chat_id: { type: String, required: true },
    // 訊息內容
    content: { type: String, required: true },
    // 訊息是否已讀
    read: { type: Boolean, default: false },
    basis: basisSchema
})


// pre : 類似攔截器 , 在執行某樣動作前(ex:save.find ...) , 將其攔截住做一些處理 , 這裡是攔截住往裡面塞基本資料
// 新增
chatSchema.pre(['save', 'create'], function (next) {
    this.basis.createTime = new Date().toLocaleString()
    this.basis.updateTime = new Date().toLocaleString()
    this.basis.status = 1
    next()
});

// 修改
// findOneAndUpdate 是 findByIdAndUpdate 的 wrapper 所以會導到這裡
chatSchema.pre(['findOneAndUpdate', 'update'], function (next) {
    this.getUpdate().$set['basis.updateTime'] = new Date().toLocaleString()
    console.log(this.getUpdate())
    next()
});



// model
module.exports = mongoose.model('chats', chatSchema)

