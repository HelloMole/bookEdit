import moment from 'moment';
import * as YWRequest from './YWRequest.mjs'
import * as sqlCrateTables from './sqlCrateTables.mjs';
// import * as Rules from './Rules.mjs'
// var YWRequest = require()
import fs from 'fs'
// import * as YWRequest from './YWRequest.js'

// const args = process.argv.slice(2); // 去掉前两个默认的元素：node和脚本路径
// console.log(args); // 输出传递的参数对象

// var arg = JSON.parse(args[1])
export async function run(dataPath, arg){
    YWRequest.init(dataPath)

    var result = {}
    if(arg.api == 'sqlite'){
        var startTime = new Date().getTime()
        if(arg.params.symbols == null && arg.params.symbol != null){
            //适配只查询一个的情况
            arg.params.symbols = [arg.params.symbol]
        }
        if(arg.params.tableName != null){
            var dpPath = dataPath + '/' + arg.params.db + '.db'
            if(fs.existsSync(dpPath) == true){
                // console.log('查询数据库的路径', dataPath + '/' + year + '.db')
                sqlCrateTables.initDb({'dbName' : dpPath, tableType: arg.params.tableType})
                result = await sqlCrateTables.queryData(arg.params)
                // console.log('我获取到了年数据库result', result)
            }else{
                console.log('数据库不存在', dpPath)
                result = {error: arg.params.db + '.db 数据库不存在' , data: []}
            }
        }else if(arg.params.period == '1'){
            var year = moment(arg.params.start_date).format("YYYY")
            var dpPath = dataPath + '/' + year + '.db'
            if(fs.existsSync(dpPath) == true){
                // console.log('查询数据库的路径', dataPath + '/' + year + '.db')
                sqlCrateTables.initDb({'dbName' : dpPath, symbols: arg.params.symbols})
                result = await sqlCrateTables.queryData(arg.params)
                // console.log('我获取到了年数据库result', result)
            }else{
                console.log('数据库不存在', dpPath)
                result = {error: year + '.db 数据库不存在' , data: []}
            }
        }else{
            sqlCrateTables.initDb({'dbName' : dataPath + '/' + 'dapanData.db', maOptions: arg.params.maOptions})
            result = await sqlCrateTables.queryData(arg.params)
            // console.log('我获取到了数据库result', result)
        }
        if(arg.params.symbol != null){
            result = result[arg.params.symbol]
        }
        result = {error: null , data: result, timecost: (new Date().getTime() - startTime) + 'ms'}
    }else if(arg.api == 'fixDapanDataVolume'){
        sqlCrateTables.initDb({'dbName' : dataPath + '/' + 'dapanData.db'})
        result = await sqlCrateTables.fixDapanDataVolume(arg.params, (progress)=>{
            console.log('当前进度' + progress)
        })
    }else if(arg.api == 'deleteDataByDate'){
        sqlCrateTables.initDb({'dbName' : dataPath + '/' + 'dapanData.db'})
        result = await sqlCrateTables.deleteDataByDate('dapanData', arg.params)
    }else if(arg.api == 'insertDataWithCheck'){
        sqlCrateTables.initDb({'dbName' : dataPath + '/' + arg.db + '.db'})
        result = await sqlCrateTables.insertDataWithCheck('dapanData',arg.symbol, arg.tableType, arg.values)
    }else if(arg.api == 'insertJiaoyiLog'){
        //插入的日志一定是今年的
        sqlCrateTables.initDb({'dbName' : dataPath + '/' + moment().format('YYYY') + 'logs.db', tableType: 'logTable'})
        result = await sqlCrateTables.insertJiaoyiLog(arg.values)
    }else{
        result = await YWRequest.getQueryUrl(arg.api, arg.params)
    }
    return result
}

export async function run2(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(['2222'])
        }, 1000);
    })
    // return 
}


// event.sender.send('huiceResult', {tabActiveKey: arg.tabActiveKey, oneYearResultDit: oneYearResultDit})
// process.parentPort.postMessage('子进程执行了:' + process.cwd())
// process.parentPort.postMessage({result:  result})



// console.log('hello worker')