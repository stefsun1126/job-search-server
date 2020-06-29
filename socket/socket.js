
const ChatModel = require('./../db/models/chats')


// 暴露的是一個函數 , 需要導入 server
module.exports = function (server) {
    // 得到io對象
    const io = require('socket.io')(server)
    // 監視連接 , 當有客戶端連上時觸發
    io.on('connection', function (socket) {
        console.log('soketio connected')
        // 綁定clientSend事件, 接收客戶端發送的訊息 , 事件名稱可以自己取 , 只要服務器端跟客戶端有對到就好
        socket.on('clientSend', function ({ from, to, content }) {
            console.log('接收客戶端的訊息', { from, to, content })
            // chat_id -> to_from or from_to , 但要讓這兩種情況最後組成的字串是一樣的 , 所以使用排序
            const chat_id = [from, to].sort().join('_')
            // 處理訊息 存入資料庫
            new ChatModel({
                from,
                to,
                content,
                chat_id,
            }).save((err, chat) => {
                if (err) {
                    console.log(err)
                } else {
                    // 向所有客戶端發送消息(這邊為了簡單作法直接全部發 之後再用程式過濾顯示)
                    console.log('向客戶端發送消息', chat)
                    io.emit('serverSend', chat)
                }
            })
        })
    })
}