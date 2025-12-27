// import moment from 'moment';
// import * as YWRequest from './YWRequest.mjs'
// import * as sqlCrateTables from './sqlCrateTables.mjs';
// import * as SyncAwait from "sync-await"
// const {__awaiter, __generator, runSync} = SyncAwait


import {run} from './GetQueryUrl.js'
// import * as Rules from './Rules.mjs'
// var YWRequest = require()
// import fs from 'fs'
// import * as YWRequest from './YWRequest.js'

const args = process.argv.slice(2); // 去掉前两个默认的元素：node和脚本路径
// console.log(args); // 输出传递的参数对象

// YWRequest.init(args[0])
var arg = JSON.parse(args[1])

// var result = {}
// var hasReturn = false
run(args[0], arg).then((value)=>{
    // result = value
    // hasReturn = true
    process.parentPort.postMessage({result: value})
})

// var result = await YWRequest.getOneDayDataDB('2023-12-12', 1, ['000858.SZ'])

// while(hasReturn == false){
//     //一直循环等待，知道result不为空
//     if(hasReturn == true){
//         break
//     }
// }

// var result = {}
// if(arg.api == 'sqlite'){
//     if(arg.params.symbols == null && arg.params.symbol != null){
//         //适配只查询一个的情况
//         arg.params.symbols = [arg.params.symbol]
//     }
//     if(arg.params.period == '1'){
//         var year = moment(arg.params.start_date).format("YYYY")
//         var dpPath = args[0] + '/' + year + '.db'
//         if(fs.existsSync(dpPath) == true){
//             // console.log('查询数据库的路径', args[0] + '/' + year + '.db')
//             sqlCrateTables.initDb({'dbName' : dpPath, symbols: arg.params.symbols})
//             result = await sqlCrateTables.queryData(arg.params)
//             // console.log('我获取到了年数据库result', result)
//         }else{
//            console.log('数据库不存在', dpPath)
//         }
//     }else{
//         sqlCrateTables.initDb({'dbName' : args[0] + '/' + 'dapanData.db'})
//         result = await sqlCrateTables.queryData(arg.params)
//         // console.log('我获取到了数据库result', result)
//     }
//     if(arg.params.symbol != null){
//         //只返回一个查询结果
//         result = result[arg.params.symbol]
//     }
//     result = {error: null , data: result}
// }else if(arg.api == 'fixDapanDataVolume'){
//     sqlCrateTables.initDb({'dbName' : args[0] + '/' + 'dapanData.db'})
//     result = await sqlCrateTables.fixDapanDataVolume(arg.params, (progress)=>{
//         console.log('当前进度' + progress)
//     })
// }else if(arg.api == 'deleteDataByDate'){
//     sqlCrateTables.initDb({'dbName' : args[0] + '/' + 'dapanData.db'})
//     result = await sqlCrateTables.deleteDataByDate('dapanData',arg.params)
// }else{
//     result = await YWRequest.getQueryUrl(arg.api, arg.params)
// }


// event.sender.send('huiceResult', {tabActiveKey: arg.tabActiveKey, oneYearResultDit: oneYearResultDit})
// process.parentPort.postMessage('子进程执行了:' + process.cwd())
// process.parentPort.postMessage({result:  result})



// console.log('hello worker')