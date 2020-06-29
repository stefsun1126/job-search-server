// mongoose doc : https://mongoosejs.com/
const mongoose = require('mongoose');
const md5 = require('blueimp-md5');

const basisSchema = require('./basis')

// connect
mongoose.connect('mongodb://localhost:27017/job-search_test', { useNewUrlParser: true, useUnifiedTopology: true });

// listener
// success
mongoose.connection.on('open', () => {
    console.log('mongoose success connect !!!')
})
// fail
mongoose.connection.on('error', (err) => {
    console.log('mongoose fail connect , error is:' + err)
})

// schema
const Schema = mongoose.Schema;
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
const userModel = mongoose.model('users', userSchema);

// create single document
function create_single_test() {
    // 單筆
    // model instance
    const userInstance = new userModel({
        account: "test002",
        // security 
        password: md5('123'),
        type: "1",
    })

    // instance.save() , create to db
    userInstance.save((err, doc) => {
        console.log("err : " + err + "doc : " + doc)
    })
}

//create_single_test()

// create mulit document 
function create_mulit_test() {
    // 多筆
    // model create ()
    userModel.create([{
        account: "test003",
        // security 
        password: md5('123'),
        type: "1",
    }, {
        account: "test004",
        // security 
        password: md5('123'),
        type: "0",
    }], function (err, docs) {
        console.log("err : " + err + "docs : " + docs)
    });
}
//create_mulit_test()

// 查詢
function find_test() {
    // find return array
    // docs : { account: 'test07' },{ account: 'test06' } 
    userModel.find({}, { _id: 0, account: 1 }, { sort: { 'account': -1 }, limit: 2 }, (err, docs) => {
        if (err) {
            console.log("err : " + err)
        }
        console.log("docs : " + docs)
    })

    // findone return obj
    userModel.findOne({ account: 'test02' }, { _id: 0, account: 1 }, (err, doc) => {
        if (err) {
            console.log("err : " + err)
        }
        console.log("doc : " + doc)
    })
}

// find_test()

// 更新
function update_test() {
    userModel.findByIdAndUpdate('5ef0c4f87b90a1041cf0f9e8', { $set: { account: 'test02_update' } },
        (err, old) => {
            if (err) {
                console.log("err : " + err)
            }
            console.log("old : " + old)
        })
}

//update_test()




