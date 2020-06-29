const mongoose = require('mongoose');
const basisSchema = require('./basis')

const Schema = mongoose.Schema;

/*
    users
*/
const userSchema = new Schema({
    // account
    account: {
        type: String,
        required: true
    },
    // pwd
    password: {
        type: String,
        required: true
    },
    // worker or boss
    type: {
        type: String,   // 0 worker
        required: true  // 1 boss
    },
    // avatar
    avatar: {
        type: String,
    },
    // 職位
    post: {
        type: String,
    },
    // 個人或職位簡介
    info: {
        type: String,
    },
    // 公司名稱
    company: {
        type: String,
    },
    // 薪水
    salary: {
        type: String,
    },
    // basis
    basis: basisSchema
})

// pre : 類似攔截器 , 在執行某樣動作前(ex:save.find ...) , 將其攔截住做一些處理 , 這裡是攔截住往裡面塞基本資料
// 新增
userSchema.pre(['save', 'create'], function (next) {
    this.basis.createTime = new Date().toLocaleString()
    this.basis.updateTime = new Date().toLocaleString()
    this.basis.status = 1
    next()
});

// 修改
// findOneAndUpdate 是 findByIdAndUpdate 的 wrapper 所以會導到這裡
userSchema.pre('findOneAndUpdate', function (next) {
    this.getUpdate().$set['basis.updateTime'] = new Date().toLocaleString()
    console.log(this.getUpdate())
    next()
});

// model
module.exports = mongoose.model('users', userSchema);
