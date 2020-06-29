// // 暴露的是一個函數 , 需要導入 server
// module.exports = function (server) {
//     // 得到io對象
//     const io = require('socket.io')(server)
//     // 監視連接 , 當有客戶端連上時觸發
//     io.on('connection', function (socket) {
//         console.log('soketio connected')
//         // 綁定clientSend事件, 接收客戶端發送的訊息 , 事件名稱可以自己取 , 只要服務器端跟客戶端有對到就好
//         socket.on('clientSend', function (data) {
//             console.log('服務器接收到客戶端的訊息', data)
//             // 向客戶端發送消息
//             io.emit('serverSend', data.name + '_' + data.date)
//             console.log('向客戶端發送消息', data)
//         })
//     })
// }