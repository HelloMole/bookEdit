import * as YWRequest from './YWRequest.mjs'
// import * as Rules from './Rules.mjs'
// var YWRequest = require()
// import fs from 'fs'
// import * as YWRequest from './YWRequest.js'

const args = process.argv.slice(2); // 去掉前两个默认的元素：node和脚本路径
if(args[0] != null){
    var arg = JSON.parse(args[0])
    YWRequest.init(arg.dataFolder)

    YWRequest.calculateMaData(arg.needMa, (progress)=>{
        if(process.parentPort != null &&  process.parentPort.postMessage != null){
            process.parentPort.postMessage({progress: Number((progress * 100).toFixed(2)) })
        }
    })
}
 
if(process.parentPort != null &&  process.parentPort.postMessage != null){
    process.parentPort.postMessage({result: 'ok'})
}



// console.log('hello worker'