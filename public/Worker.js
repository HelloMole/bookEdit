import * as YWRequest from './YWRequest.mjs'
import * as Rules from './Rules.mjs'
// var YWRequest = require()
import fs from 'fs'
// import * as YWRequest from './YWRequest.js'

const args = process.argv.slice(2); // 去掉前两个默认的元素：node和脚本路径

 
console.log(args); // 输出传递的参数对象
// process.parentPort.once('message', async (e) => {
//     console.log('子进程收到了message')
//     // const YWRequest = await import('./YWRequest.mjs')
//     process.parentPort.postMessage({info:'子进程收到了message', 'arg': args})
//     // const [port] = e.ports
//     // ...
// })
YWRequest.init(args[0])
var arg = JSON.parse(fs.readFileSync(args[1]))

var start_date = args[2]
var end_date = args[3]


for(var key in arg.huiceConfig){
    Rules.huiceConfig[key] = arg.huiceConfig[key]
}


if(start_date != null && end_date != null){
    //传入了日期区间，只回测日期区间内的数据
    var resultDit = await Rules.huiceDates(arg.rulesDit, start_date, end_date, (info)=>{
        //返回执行进度 
        process.parentPort.postMessage({
            progress:  info.progress,  
            day: info.day,
            data: info.data,
            memory: process.memoryUsage().heapUsed + '/' + process.memoryUsage().heapTotal
        })
    }, arg.huiceConfig)
}else if(arg.huiceConfig.years != null){
    //传入了年份数组，按年回测
    var resultDit = await Rules.huiceYears(arg.rulesDit, arg.huiceConfig.years, (info)=>{
        //返回执行进度
        process.parentPort.postMessage({progress:  info.progress, day: info.day, data: info.data,  memory: process.memoryUsage().heapUsed + '/' + process.memoryUsage().heapTotal})
    }, arg.huiceConfig)
}

// var result = Rules.runFullRules(arg.rulesDit)
// event.returnValue = oneYearResultDit
// event.sender.send('huiceResult', {tabActiveKey: arg.tabActiveKey, oneYearResultDit: oneYearResultDit})
// process.parentPort.postMessage('子进程执行了:' + process.cwd())
process.parentPort.postMessage({resultDit:  resultDit})



// console.log('hello worker')