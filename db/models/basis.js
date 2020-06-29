/* 每筆文檔都要插入此 schema */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const basis = new Schema({
    createTime: Date,
    updateTime: Date,
    // 0 disable 1 enable
    status: Number
})

module.exports = basis.obj


