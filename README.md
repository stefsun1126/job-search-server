# API 

## 目錄：
[1、註冊](#1註冊)<br/>
[2、登入](#2登入)<br/>
[3、完善用戶訊息(更新用戶訊息)](#3完善用戶訊息(更新用戶訊息))<br/>
[4、根據cookie獲取當前使用者](#4根據cookie獲取當前使用者)<br/>
[5、根據類型返回使用者列表](#5根據類型返回使用者列表)<br/>
[6、返回當前用戶相關聊天訊息](#6返回當前用戶相關聊天訊息)<br/>
[7、修改特定人發給當前使用者的聊天訊息為已讀](#7修改特定人發給當前使用者的聊天訊息為已讀)<br/>


## 1、註冊

### 請求URL：
	localhost:4000/users/register

### 請求方式：
	POST

### 參數類型：

	|參數		 |是否必選 |類型     |說明
	|account     |Y       |string   |帳號
	|password    |Y       |string   |密碼
	|type        |Y       |string   |使用者類型 ("0" -> 應徵者  "1" -> 老闆)

### 回傳值：
	成功:
        {
            "code": 0,
            "data": {
                "account": "worker08",
                "type": "1",
                "_id": "5ef995bb76cfa62da4972d2e"
            }
        }
	失敗
        {
            "code": 1,
            "msg": "帳號已存在"
        }


## 2、登入

### 請求URL：
	localhost:4000/users/login

### 請求方式：
	POST

### 參數類型：

	|參數		 |是否必選 |類型     |說明
	|account     |Y       |string   |帳號
	|password    |Y       |string   |密碼

### 回傳值：
	成功：
        {
            "code": 0,
            "data": {
                "_id": "5ef5959c2713470a6023f228",
                "account": "worker07",
                "type": "0",
                "avatar": "頭像8",
                "info": "哈囉哈",
                "post": "前端工程師"
            }
        }
	失敗：
        {
            "code": 1,
            "msg": "查無帳號或是密碼錯誤"
        }

## 3、完善用戶訊息(更新用戶訊息)

### 請求URL：
	localhost:4000/users/update

### 請求方式：
	POST

### 參數類型：

	|參數	　　|是否必選 |類型     |說明
	|avatar    |Y       |string   |頭像名稱
	|info      |N       |string   |介紹
	|post      |N       |string   |職位
	|salary    |N       |string   |月薪
	|company   |N       |string   |公司

### 回傳值：
	成功：
		{
			"code": 0,
			"data": {
				"_id": "5ef5959c2713470a6023f228",
				"account": "worker07",
				"type": "0",
				"avatar": "頭像1",
				"post": "前端工程師",
				"info": "react/vue",
				"company": "來唷來唷公司",
				"salary": "月薪 42000"
			}
		}
	失敗：
		{
			"code": 1,
			"msg": "頭像必填"
		}

## 4、根據cookie獲取當前使用者

### 請求URL：
	localhost:3005/user

### 請求方式：
	GET

### 參數類型：
	無

### 回傳值：
	成功：
		{
			"code": 0,
			"data": {
				"_id": "5ef5959c2713470a6023f228",
				"account": "worker07",
				"type": "0",
				"avatar": "頭像1",
				"info": "react/vue",
				"post": "前端工程師",
				"company": "來唷來唷公司",
				"salary": "月薪 42000"
			}
		}
	失敗：
	    {
	      "code": 1,
	      "msg": "請重新登入"
	    }


## 5、根據類型返回使用者列表

### 請求URL：
	localhost:4000/users/userlist

### 請求方式：
	GET

### 參數類型：

	|參數		|是否必選 |類型     |說明
	|type       |Y       |string   |使用者類型 ("0" -> 應徵者  "1" -> 老闆)

### 回傳值：
	{
	    "code": 0,
	    "data": [
	        {
	            "_id": "5ae1d5d19151153d30e008fd",
	            "username": "ds2",
	            "type": "dashen",
	            "__v": 0
	        },
	        {
	            "_id": "5ae1ddd99ca58023d82351ae",
	            "username": "aa",
	            "type": "dashen",
	            "__v": 0,
	            "post": "前端工程师",
	            "info": "Rect/Vue",
	            "header": "头像1"
	        }
	    ]
	}
	

## 6、返回當前用戶相關聊天訊息

### 請求URL：
	localhost:4000/chats/msglist

### 請求方式：
	GET

### 參數類型：
	無

### 回傳值：
	{
		"code": 0,
		"data": {
			"users": {
				"5ef2f51ec008a548dcc8162c": {
					"account": "boss02",
					"avatar": "頭像1"
				},
				"5ef30c8e35060d4f8cc91939": {
					"account": "boss06",
					"avatar": "頭像3"
				},
				"5ef30dd56a74632dc4444e04": {
					"account": "boss07",
					"avatar": "頭像13"
				},
				"5ef31d019b1b991e2ca37a83": {
					"account": "worker01",
					"avatar": "頭像1"
				}
			},
			"chatMsgs": [
				{
					"read": false,
					"_id": "5ef9cf60d76bdb09983a2ec5",
					"basis": {
						"createTime": "2020-06-29T11:24:16.000Z"
					},
					"from": "5ef9b4cad76bdb09983a2ec4",
					"to": "5ef31d019b1b991e2ca37a83",
					"content": "嗨你好",
					"chat_id": "5ef31d019b1b991e2ca37a83_5ef9b4cad76bdb09983a2ec4"
				}
			]
		}
	}

## 7、 修改特定人發給當前使用者的聊天訊息為已讀
### 請求URL：
	localhost:4000/chats/readmsg

### 請求方式：
	POST

### 參數類型：
	|參數		|是否必選 |類型     |說明
	|from       |Y       |string   |訊息送出人

### 回傳值：
	{
		"code": 0,
		"data": 3   //代表已讀三筆資料
	}