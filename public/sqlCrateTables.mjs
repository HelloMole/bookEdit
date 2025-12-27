//数据库设置方案
import Database from 'better-sqlite3';
import * as sqliteCore from "drizzle-orm/sqlite-core"
import {eq, ne, gt, gte, lt, lte, and, or, inArray} from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import moment from 'moment';

//sqlite3需要和electron中的node版本对应，不然无法在electron中运行，所以需要先获取版本，然后执行rebuild对应的 better-sqlite3
// npm rebuild better-sqlite3 --runtime=electron --target=35.5.1 --abi=133 --dist-url=electronjs.org/headers
// getElectronVersion electron:"33.4.11"    modules: "130"
//获取版本号在devtools中输入process.versons 回车

// npm rebuild better-sqlite3 --runtime=electron --target=33.4.11 --abi=130 --dist-url=electronjs.org/headers

// electronjs.org/headers
// electronjs.org/headers/v35.5.1/node-v35.5.1-headers.tar.gz?force_headers_dist=1

//现在把有分时数据存放在一个数据库里容易卡
//如果把分时数据按照年来归档存放是否会更合适？
//日k数据还是存放在同一个数据库中


//发现2024年的数据没有成交额，明天去公司看看另一台电脑有没有


//所有股票日K数据存一张表， 
var oneDayConfig = {
    date: {label: '日期', valueType: 'TIMESTAMP', notNull: 'NOT NULL', schema: sqliteCore.text('date').notNull()},
    // symbol: {label: '代码', valueType: 'TEXT', notNull: 'NOT NULL', schema: sqliteCore.text('symbol').notNull()},
    open:  {label: '开盘', valueType: 'REAL', schema: sqliteCore.real(), exLabel: ['今开']},
    close: {label: '收盘', valueType: 'REAL', schema: sqliteCore.real()},
    max: {label: '最高', valueType: 'REAL', schema: sqliteCore.real()},
    min: {label: '最低', valueType: 'REAL', schema: sqliteCore.real()},
    handpre: {label: '换手率', valueType: 'REAL', schema: sqliteCore.real()},
    volume:   {label: '成交量', valueType: 'REAL', schema: sqliteCore.real()},
    money: {label: '成交额', valueType: 'REAL', schema: sqliteCore.real()},
    precolse:  {label: '昨收', valueType: 'REAL', schema: sqliteCore.real()},
    updownpre:  {label: '涨跌幅', valueType: 'REAL', schema: sqliteCore.real()},
    totalprice: {label: '总市值', valueType: 'REAL', schema: sqliteCore.real()},
    shiyinlv: {label: '市盈率', valueType: 'REAL', schema: sqliteCore.real(), exLabel: ['市盈率-动态']},
    shijinlv: {label: '市净率', valueType: 'REAL', schema: sqliteCore.real()},
}



var oneMinConfig = {
    time: {label: '时间', valueType: 'TIMESTAMP', notNull: 'NOT NULL', schema: sqliteCore.text('time').notNull()},
    open: {label: '开盘', valueType: 'REAL', schema: sqliteCore.real()},
    close: {label: '收盘', valueType: 'REAL', schema: sqliteCore.real()},
    max:  {label: '最高', valueType: 'REAL', schema: sqliteCore.real()},
    min:  {label: '最低', valueType: 'REAL', schema: sqliteCore.real()},
    volume:  {label: '成交量', valueType: 'REAL', schema: sqliteCore.real()},
    money:   {label: '成交额', valueType: 'REAL', schema: sqliteCore.real()},
}

//交易日志持久化保存的信息
var logConfig = {
    startDate: {label: '起始日期', valueType: 'TIMESTAMP', notNull: 'NOT NULL', schema: sqliteCore.text().notNull()},
    //日志触发的事件
    time:    {label: '时间', valueType: 'TIMESTAMP', notNull: 'NOT NULL', schema: sqliteCore.text().notNull()},
    price:   {label: '价格', valueType: 'REAL', schema: sqliteCore.real()},
    present: {label: '盈亏', valueType: 'REAL', schema: sqliteCore.real()},
    type:    {label: '类型', valueType: 'TINYTEXT', schema: sqliteCore.text()}, //可能是买入卖出，或者触发事件
    symbol:  {label: '代码', valueType: 'TINYTEXT', schema: sqliteCore.text()}, //触发类型的股票代码
    policy:  {label: '策略', valueType: 'TINYTEXT', schema: sqliteCore.text()}, //触发日志的策略
    level:   {label: '等级', valueType: 'REAL', schema: sqliteCore.real()},      //日志的等级
    info:    {lebel: '信息', valueType: 'TEXT', schema: sqliteCore.text()}      //日志的信息
}

var configDit = {
    oneDayConfig: oneDayConfig,
    oneMinConfig: oneMinConfig,
    logConfig: logConfig,

    minTable: oneMinConfig,
    dayTable: oneDayConfig,
    logTable: logConfig
}

//转换为schema
function converToSchema(obj){
    var schema = {id: sqliteCore.integer()}
    for(var key in obj){
        schema[key] = obj[key].schema
    }
    return schema
}

//将股票数据转换为保存到数据库中的数据
function converToDbData(data, configType){
    var returnObj = {}
    for(var key in configDit[configType]){
        if(data[key] != null){
            returnObj[key] = data[key]
            continue
        }
        var label = configDit[configType][key].label
        if(data[label] != null){
            returnObj[key] = data[label]
        }
        if(returnObj[key] == null && configDit[configType][key].exLabel != null){
            for(var j = 0; j < configDit[configType][key].exLabel.length; j++){
                returnObj[key] = data[configDit[configType][key].exLabel[j]]
            }
        }
    }
    if(returnObj['time'] != null){
        //把时间拆分
        returnObj['time'] = moment(returnObj['time']).format('YYYY-MM-DD HH:mm:ss')
        // returnObj['time'] = moment(returnObj['time']).valueOf()
    }
    if(returnObj['date'] != null){
        //把时间拆分
        returnObj['date'] = moment(returnObj['date']).format('YYYY-MM-DD')
        // returnObj['date'] = moment(returnObj['date']).valueOf()
    }
    return returnObj 
}

//将数据库的数据重新还原成文件的样式
function backToFileData(data, configType){
    var returnObj = {}
    for(var key in data){
        if(configDit[configType][key] != null){
            returnObj[configDit[configType][key].label] = data[key]
        }
    }
    return returnObj
}

const TableType = {
    minTable: 'minTable',
    dayTable: 'dayTable',
    logTable: 'logTable'
}


//定义表,其实只需要两个表就行了，一个是大盘表，另一个是分时数据表
var defineTables = {
    // 'dayTable': sqliteCore.sqliteTable('dayTable', converToSchema(oneDayConfig)),
    // 'minTable': sqliteCore.sqliteTable('minTable', converToSchema(oneMinConfig)),
}

//获取一个Table
function getTable(tableName, tableType){
    if(tableType == TableType.dayTable){
        return sqliteCore.sqliteTable(tableName, converToSchema(oneDayConfig))
    }else if(tableType == TableType.minTable){
        return sqliteCore.sqliteTable(tableName, converToSchema(oneMinConfig))
    }else if(tableType == TableType.logTable){
        return sqliteCore.sqliteTable(tableName, converToSchema(logConfig))
    }
}


var HasTableDit = {
    'minTable': {},
    'dayTable': {},
    'logTable': {},
}

var sqlite = null//new Database();
var curdbName = ''
var db = null//drizzle();

export function initDb(params) {
    // dbName, symbols
    var dbName = params.dbName
    if(curdbName != dbName){
        curdbName = dbName
        if(sqlite != null){
            sqlite.close()
            sqlite = null
        }
        sqlite = new Database(dbName);
        db = drizzle({client:sqlite }); //schema: defineTables
    }

    //事件table
    if(params.tableType == TableType.logTable){
        checkTableExists('logs', TableType.logTable) //检查日k表是否存在 
    }
   
    var symbols = params.symbols
    
    //根据symbols动态创建defineTables
    if(symbols != null){
        //分时的数据库
        for(var i = 0; i < symbols.length; i++){
            var tableName = symbolToTable(symbols[i])
            // if(defineTables[tableName] == null){
            //     defineTables[tableName] = sqliteCore.sqliteTable(tableName, converToSchema(oneMinConfig))
            //     checkOneMinTable(tableName)
            // }
            if(HasTableDit[params.tableType][tableName] == null){
                HasTableDit[params.tableType][tableName] = 1
                if(params.tableType == TableType.minTable){
                    checkOneMinTable(tableName) //检查分时表是否存在
                }else if(params.tableType == TableType.dayTable){
                    checkOneDayTable(tableName) //检查日k表是否存在
                }
            }
        }
    }else{
        //定义tables
        // var maOptions = params.maOptions
        // if(maOptions != null){
        //     //初始化均价选项
        //     for(var i = 0; i < maOptions.length; i++){
        //         var maDay = maOptions[i].split('_')[1]
        //         oneDayConfig['ma' + maDay] = {label: maOptions[i], valueType: 'REAL', schema: sqliteCore.real()}
        //     }
        // }
        // console.log('maOptions', maOptions)

        // if(defineTables['dapanData'] == null){
        //     defineTables['dapanData'] = sqliteCore.sqliteTable('dapanData', converToSchema(oneDayConfig))
        //     //日k的数据库
        //     checkOneDayTable()
        // }
    }
    // console.log('defineTables', defineTables)

    //测试插入数据
    // insertData('sz223345', {time: new Date().getTime(), open: 1.3, close: 2.4, max: 5, min: 1.2, volume: 234552, money: 2223455433})
}

// open TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//检查一个股票的分时数据表是否存在，如果不存在，自动创建表
//其中tablename不能以数字开头，名称中不能包含.符号，所以需要对symbol做格式化处理再传入
export function checkOneMinTable(tableName) {
    // var sqlite = new Database(dbName);
    // sqlite.exec(`
    //     CREATE TABLE IF NOT EXISTS ${tableName} (
    //         id INTEGER PRIMARY KEY AUTOINCREMENT,
    //         time TIMESTAMP NOT NULL,
    //         open REAL,
    //         close REAL,
    //         max REAL,
    //         min REAL,
    //         volume INTEGER,
    //         money INTEGER
    //     );
    // `);
    var sqlstr = `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT`
    for(var key in oneMinConfig){
        sqlstr += ','
        sqlstr += `${key} ${oneMinConfig[key].valueType}`
        if(oneMinConfig[key].notNull != null){
            sqlstr += ' ' + oneMinConfig[key].notNull
        }
    }
    sqlstr += ');'
    // console.log("sqlstr", sqlstr)
    sqlite.exec(sqlstr)
}

//检查dapanData数据表是否存在，如果不存在，创建表
export function checkOneDayTable(tableName) {
    // var sqlite = new Database(dbName);
    // sqlite.exec(`
    //     CREATE TABLE IF NOT EXISTS dapanData (
    //         id INTEGER PRIMARY KEY AUTOINCREMENT,
    //         time TIMESTAMP NOT NULL,
    //         open REAL,
    //         close REAL,
    //         max REAL,
    //         min REAL,
    //         volume INTEGER,
    //         money INTEGER
    //     );
    // `);
    var sqlstr = `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT`
    for(var key in oneDayConfig){
        sqlstr += ','
        sqlstr += `${key} ${oneDayConfig[key].valueType}`
        if(oneDayConfig[key].notNull != null){
            sqlstr += ' ' + oneDayConfig[key].notNull
        }
    }
    sqlstr += ');'
    // console.log('sqlstr', sqlstr)
    sqlite.exec(sqlstr)
}

export function checkTableExists(tableName, configName) {
    // var sqlite = new Database(dbName);
    // sqlite.exec(`
    //     CREATE TABLE IF NOT EXISTS dapanData (
    //         id INTEGER PRIMARY KEY AUTOINCREMENT,
    //         time TIMESTAMP NOT NULL,
    //         open REAL,
    //         close REAL,
    //         max REAL,
    //         min REAL,
    //         volume INTEGER,
    //         money INTEGER
    //     );
    // `);
    var config = configDit[configName]
    var sqlstr = `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT`
    for(var key in config){
        sqlstr += ','
        sqlstr += `${key} ${config[key].valueType}`
        if(config[key].notNull != null){
            sqlstr += ' ' + config[key].notNull
        }
    }
    sqlstr += ');'
    // console.log('sqlstr', sqlstr)
    sqlite.exec(sqlstr)
}

//将股票代码转换为数据库表名称
function symbolToTable(symbol){
    if(symbol.indexOf('.') != -1){
        symbol = symbol.split('.')
        symbol = symbol[1] + symbol[0]
    }
    return symbol
    // return symbol.split('.')[1] + symbol.split('.')[0]
}

//查询方法
export async function queryData(params){
    // var dapanData = defineTables['dapanData']]
    // return await db.query[tableName].findFirst();

    // and(gte(defineTables[tableName].time, params.start_date), lte(defineTables[tableName].time, params.end_date))

    //params = {symbols: ['000858.SZ'], adjust: 'qfq', period: 'daily', start_date: '2024-01-01', end_date: '2024-05-06'}}
    var tableName = 'dapanData'
    var result = {}
    if(params.tableName != null){
        //自定义查询
        //查询对应table
        tableName = params.tableName
        var table = getTable(tableName, params.tableType) //defineTables[tableName]
        var selectArr = params.select != null ? params.select : Object.keys(configDit[params.tableType])
        var selectObj = {}
        for(var i = 0; i < selectArr.length; i++){
            var key = selectArr[i]
            selectObj[key] = table[key]
        }
        selectObj.id = table.id
        var andArr = []
        if(params.symbols != null){
            andArr.push(inArray(table.symbol, params.symbols))
        }
        if(params.start_date != null){
            andArr.push(gte(table.time, params.start_date))
        }
        if(params.end_date != null){
            andArr.push(lte(table.time, params.end_date))
        }
        if(params.type != null){
            andArr.push(eq(table.type, params.type))
        }
        if(params.startDate != null){
            andArr.push(eq(table.startDate, params.startDate))
        }
        if(params.policy != null){
            andArr.push(eq(table.policy, params.policy))
        }
        var whereObj = null
        if(andArr.length > 1){
            whereObj = and(...andArr)
        }else if(andArr.length == 1){
            whereObj = andArr[0]
        }
        var dataArr = []
        if(whereObj != null){
            dataArr = await db.select(selectObj).from(table).where(whereObj)
        }
        return dataArr
    }else{
        if(params.period == 'daily'){
            // var dataArr = await db.query[tableName].findMany({
            //     where: and(inArray(defineTables[tableName].symbol, params.symbols), gte(defineTables[tableName].date, params.start_date), lte(defineTables[tableName].date, params.end_date))
            // })
    
            // var table = getTable(tableName, TableType.dayTable) //defineTables[tableName]
            // var selectArr = params.select != null ? params.select : Object.keys(oneDayConfig)
            // var selectObj = {}
            // for(var i = 0; i < selectArr.length; i++){
            //     var key = selectArr[i]
            //     selectObj[key] = table[key]
            // }
            // selectObj.symbol = table.symbol //这个是必须获取的
            // // selectObj.id = table.id
            // // console.log('selectObj', selectObj)
            // var dataArr = await db.select(selectObj).from(table)
            // //     //已经不需要是否在Arr中了，每个表只存对应symbol的数据
            // .where(and(inArray(table.symbol, params.symbols), gte(table.date, params.start_date), lte(table.date, params.end_date)))
            // for(var i = 0; i < dataArr.length; i++){
            //     var oneRow = dataArr[i]
            //     if(result[oneRow.symbol] == null){
            //         result[oneRow.symbol] = []
            //     }
            //     if(params.needLabel == true){
            //         result[oneRow.symbol].push(backToFileData(oneRow, 'oneDayConfig'))
            //     }else{
            //         result[oneRow.symbol].push(oneRow)
            //     }
            // }
            
            //使用新版的table查询
            for(var i = 0; i < params.symbols.length; i++){
                var symbol = params.symbols[i]
                tableName = symbolToTable(symbol)
                var table = getTable(tableName, TableType.dayTable)
    
                var selectArr = params.select != null ? params.select : Object.keys(oneDayConfig)
                if(selectArr.length == 0){
                    //如果传入了select又一个没有会报错
                    selectArr.push('id')
                }
                var selectObj = {}
                for(var j = 0; j < selectArr.length; j++){
                    var key = selectArr[j]
                    selectObj[key] = table[key]
                }
                // selectObj.symbol = table.symbol //这个是必须获取的
                // if(selectObj.symbol != null){
                //     delete selectObj.symbol
                // }
    
                // result[symbol] = symbol
                result[symbol] = await db.select(selectObj).from(table)
                .where(and(gte(table.date, params.start_date), lte(table.date, params.end_date)))
                // result[symbol] = [symbol]
            }
    
            if(params.needLabel == true){
                for(var symbol in result){
                    result[symbol] = result[symbol].map((oneRow)=>{
                        // console.log('转换为obj', oneRow)
                        var obj = backToFileData(oneRow, 'oneDayConfig')
                        obj['代码'] = symbol
                        return obj
                    })
                }
            }
        }else{
            //要查询多个table
            for(var i = 0; i < params.symbols.length; i++){
                // result[params.symbols[i]] = []
                tableName = symbolToTable(params.symbols[i])
                var table = getTable(tableName, TableType.minTable)
                // console.log('当前查询table', tableName, params.start_date, params.end_date)
                // result[params.symbols[i]] = await db.query[tableName].findMany({
                //     where: and(gte(table.time, params.start_date), lte(table.time, params.end_date))
                // })
                result[params.symbols[i]] = await db.select().from(table)
                .where(and(gte(table.time, params.start_date), lte(table.time, params.end_date)))
                // result[params.symbols[i]] = await db.query[tableName].findFirst();
            }
            if(params.needLabel == true){
                for(var symbol in result){
                    result[symbol] = result[symbol].map((oneRow)=>{
                        // console.log('转换为obj', oneRow)
                        return backToFileData(oneRow, 'oneMinConfig')
                    })
                }
            }
        }
    }
    
    return result
}

//

//查询方法的同步版本
// export function queryDataSync(params){
//     return runSync(queryData(params))
// }


//修复数据的成交量，全部统一为股数
export async function fixDapanDataVolume(params, cb) {
    var result = await queryData(params)
    var totalCount = Object.keys(result).length
    var curCount = 0
    for(var symbol in result){
        curCount += 1
        for(var i = 0; i < result[symbol].length; i++){
            var row = result[symbol][i]
            await updateData('dapanData', row.id, {volume: Math.round(row.volume * 100) })
        }
        if(cb != null){
            cb(curCount + '/' + totalCount)
        }
    }
    return {success: true, info: '共计修复数据:' + curCount + '/' + totalCount}
}


//更新数据,一般情况下如果数据是正确的话没有要修改的，但如果有勘误需要处理（比如统一成交量为股数，补全成交额数据等，还是需要update）
export async function updateData(tableName, id, data, tableType){
    //需要有数据的id
    var table = getTable(tableName, tableType)  //defineTables[tableName]
    //对已知数据做更新
    await db.update(table)
    .set(data)  //要更新的字段
    .where(eq(table.id, id));
}

//删除数据，如果检查到有重复数据，应该删除重复数据
//使用id删除记录
export async function deleteDataById(tableName, ids){
    var table = defineTables[tableName]
    await db.delete(table).where(inArray(table.id, ids));
}

//删除指定代码一段时间的数据
export async function deleteDataByDate(tableName, params){
    try {
        if(tableName == 'dapanData'){
            var table = defineTables[tableName]
            await db.delete(table).where(
                and(
                inArray(table.symbol, params.symbols),
                gte(table.date, params.start_date),
                lte(table.date, params.end_date)
            ));
        }
        return {success: true, info: '删除数据成功'}
    } catch (error) {
        return {success: false, info: '删除数据出错，请检查'}
    }
}

//插入数据之前要判断数据是否存在，如果存在就不要重复插入了，日k数据：判断是否有date symbol的数据
// 暂时只实现了日k数据的插入,一次只能插入某个股票一天的数据
export async function insertDataWithCheck(symbol, tableType, values){
    // if(tableName != 'dapanData'){
    //     console.warn('暂时只实现日k数据校验插入')
    //     return
    // }
    // if(tableType == TableType.logTable){
    //     await insertJiaoyiLog(values)
    //     return
    // }
    var configType = tableType == TableType.dayTable ? 'oneDayConfig' : 'oneMinConfig'
    // var params = {symbol: '000858.SZ', adjust: 'qfq', period: 'daily', start_date: '2024-01-01', end_date: '2024-05-06'}
    // if(table != 'dapanData'){
    //     checkOneMinTable(table)
    //     if(defineTables[table] == null){
    //         defineTables[table] = sqliteCore.sqliteTable(table, converToSchema(oneMinConfig))
    //     }
    // }
    var insertValues
    if(Array.isArray(values)){
        insertValues = values.map((item)=>{
            return converToDbData(item, configType)
        })
    }else{
       insertValues = [converToDbData(values, configType)]
    }
    // console.log('准备插入的数据', insertValues)
    // if(HasTableDit[tableType][tableName] == null){
        
    // }
    //插入数据之前先判断数据是否存在
    // var symbols = insertValues.map((item)=>{
    //     return item.symbol
    // })
    // if(symbols.length == 0){
    //     console.warn('没有要插入的数据symbols.length=0')
    // }else{
       
    // }

    var result = await queryData({symbols: [symbol], adjust: 'qfq', period: 'daily', start_date: insertValues[0].date, end_date: insertValues[0].date})
    // console.log('插入之前查询到的结果', result)
    // return result
    if(result[symbol].length == 0){
        var tableName = symbolToTable(symbol) 
        var table = getTable(tableName, tableType)
        await db.insert(table).values(insertValues)
    }else{
        //已经插入数据，不要重复插入
    }
}

//插入交易
export async function insertJiaoyiLog(values) {
    var tableName = 'logs';
    var count = 0
    for(var i = 0; i < values.length; i++){
        var value = values[i]
        var result = await queryData({symbols: [value.symbol], policy: value.policy, type: value.type, tableName: tableName ,tableType: TableType.logTable, startDate: value.startDate})    //这里其实只要通过startDate就能判断是否重复插入了  //start_date: value.time, end_date: value.time
        if(result.length == 0){
            //只有结果不为0时才插入，不然的话应该是已经有数据了
            var table = getTable(tableName, TableType.logTable)
            var insertValues = [converToDbData(value, TableType.logTable)]
            await db.insert(table).values(insertValues)
            count += 1
        }

        // //只有结果不为0时才插入，不然的话应该是已经有数据了
        // var table = getTable('logs', TableType.logTable)
        // var insertValues = [converToDbData(value, TableType.logTable)]
        // console.log('插入到数据库')
        // await db.insert(table).values(insertValues)
    }
    return {newLogCount: count}
}

//插入股票数据，当values是数组时插入多行，是object时则只插入一行
//每日更新，或者导入时都是原始的数据格式
export async function insertData(tableName, tableType, values){
    var configType = tableType == TableType.dayTable ? 'oneDayConfig' : 'oneMinConfig'
    tableName = symbolToTable(tableName)
    // var tableType = 
    // if(tableName != 'dapanData'){
    //     checkOneMinTable(tableName)
    //     if(defineTables[tableName] == null){
    //         defineTables[tableName] = sqliteCore.sqliteTable(tableName, converToSchema(oneMinConfig))
    //     }
    // }
    var insertValues
    if(Array.isArray(values)){
        insertValues = values.map((item)=>{
            return converToDbData(item, configType)
        })
    }else{
       insertValues = converToDbData(values, configType)
    }
    // console.log('准备插入的数据', insertValues)
    var table = getTable(tableName, tableType)
    await db.insert(table).values(insertValues)
    // if(defineTables[tableName] != null){
        
    // }else{
    //     console.warn('要插入的表为空', table)
    // }
}

//为每个股票的一分钟数据单独创建一张表

//所有股票的信息单独一张表，如股票名称，公告信息，利润信息，分红信息。这个暂时不做
