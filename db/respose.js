/* 定義 api 回傳值結構 */

// 成功的 response 類
class SuccessResponse {
    constructor(_data) {
        this.code = 0
        this.data = _data
    }
}
exports.SuccessResponse = SuccessResponse


// 失敗的 response 類
class FailResponse{
    constructor(_msg){
        this.code = 1
        this.msg = _msg
    }
}
exports.FailResponse = FailResponse