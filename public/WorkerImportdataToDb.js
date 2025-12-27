// 一分钟的分时数据xlsx转换
//由于数据量太大，按照年来转换
// 集合竞价的xlsx转换
// import xlsx from 'node-xlsx';
import fs from 'fs';
import Excel from 'exceljs';
import LZString from 'lz-string';
import moment from 'moment';
import path from 'path';
import * as sqlCrateTables from './sqlCrateTables.mjs';
import * as YWRequest from './YWRequest.mjs'

// console.log('LZString', LZString.compress)
// default
// 压缩字符串
// const compressed = LZString.compress(JSON.stringify(yourData));
 
// 解压字符串
// var str = fs.readFileSync('/Volumes/WithCherry/localData/oneMinData/20240102/600000.SH.txt', 'utf16le')
// console.log('解压前的对象', str)
// console.log('解压后的对象', LZString.decompress(str))


var folder = '/Users/liyaowei/WithCherry/一分钟数据压缩'
var exportFolder = '/Users/liyaowei/WithCherry/localData/dapanData'
var year = '2024'
var folderFormat = "YYYYMMDD"
var fileFormat = "xx000000"
var dataType = 'dapanData'
var needCheckRepeat = false //插入时是否检查重复

const args = process.argv.slice(2); // 去掉前两个默认的元素：node和脚本路径
// if(args[0] != null){
//     year = args[0]
// }
// if(args[1] != null){
//     folder = args[1]
// }
// if(args[2] != null){
//     exportFolder = args[2]
// }

if(args[0] != null){
    var otherConfig = JSON.parse(args[0])
    folder = otherConfig.datafolder
    exportFolder = otherConfig.exportFolder
    dataType = otherConfig.dataType
    if(otherConfig.folderFormat != null){
        folderFormat = otherConfig.folderFormat
    }
    if(otherConfig.needCheckRepeat != null){
        needCheckRepeat = true
    }
    year = otherConfig.year
    YWRequest.init(exportFolder)
}

//初始化所有dit
var params = {}
// exportFolder + '/' + dbName, Object.keys(YWRequest.allSymbolDit)
if(dataType == 'dapanData'){
    params.dbName = exportFolder + '/' + 'dapanData.db'
    params.tableType = 'dayTable'
    params.symbols = Object.keys(YWRequest.allSymbolDit)
}else{
    params.dbName = exportFolder + '/' +  year + '.db'
    params.tableType = 'minTable'
    params.symbols = Object.keys(YWRequest.allSymbolDit)
}
console.log('初始化数据库' , params.dbName)
sqlCrateTables.initDb(params)

console.log('初始化数据库成功')

export var OneMinDataKeyIndex = {
    '时间': 0,
    '开盘': 1,
    '收盘': 2,
    '最高': 3,
    '最低': 4,
    '成交量': 5,
    '成交额': 6,
}


//循环每一个文件
async function loopFolder(filePath, handle){
    if(fs.statSync(filePath).isDirectory() == true){
        var files = fs.readdirSync(filePath)
        files = files.filter((item)=>{
            return item.indexOf('.') != 0
        })
        // console.log('files', files)
        for(var i = 0; i < files.length; i++){
            // console.log('当前循环到：', files[i])
           await loopFolder(filePath + '/' + files[i], handle)
        }
    }else{
        await handle(filePath)
    }
}


//将代码中的格式转换为保存的格式
function symbolFormat(fileSymobol, format){
    var outputStr = ''
    var xxIndex = format.indexOf('xx')
    var codeIndex = format.indexOf('000000')
    
    outputStr += fileSymobol.substr(codeIndex, codeIndex + 6)  
    outputStr += '.' 
    outputStr += fileSymobol.substr(xxIndex, xxIndex + 2).toUpperCase()
    return outputStr
}

// var result = symbolFormat('sh500355', fileFormat)
// console.log('result', result)

if(fs.existsSync(exportFolder) == false){
    try {
        fs.mkdirSync(exportFolder)
    } catch (error) {
        console.log('创建文件夹失败', error)        
    }
}

var totalCount = 0
var curCount = 0
var symbolDit = {}

async function dealFile(filePath){
    var extname = path.extname(filePath)
    // console.log('当前处理额', filePath, extname)
    // var name = path.basename(filePath, extname)
    if(extname == '.csv'){
        //只处理csv文件
        // await fileDoHandle(filePath, null)
    }else if(extname == '.json'){
        var date = path.basename(filePath, extname)
        var data = JSON.parse(fs.readFileSync(filePath))
        var arr = []
        
        for(var i = 0; i < data.length; i ++){
            var symbol = data[i]['代码']
            if(YWRequest.allSymbolDit[symbol] == null){
                continue
            }
            data[i]['日期'] = date
            if(symbolDit[symbol] == null){
                symbolDit[symbol] = []
            }
            symbolDit[symbol].push(data[i])
            //旧版的插入数据库
            // arr.push(data[i])
            // if(arr.length == 100){
            //     if(needCheckRepeat == true){
            //         await sqlCrateTables.insertDataWithCheck('dapanData', arr)
            //     }else{
            //         await sqlCrateTables.insertData('dapanData', 'dayTable', arr)
            //     }
            //     arr = []
            // }
        }

        for(var key in symbolDit){
            var arr = symbolDit[key]
            if(arr.length > 50){
                if(needCheckRepeat == true){
                    await sqlCrateTables.insertDataWithCheck(key,'dayTable', arr)
                }else{
                    await sqlCrateTables.insertData(key, 'dayTable', arr)
                }
                delete symbolDit[key]
            }
        }
        //旧版的插入数据库
        // if(arr.length > 0){
        //     if(needCheckRepeat == true){
        //         await sqlCrateTables.insertDataWithCheck('dapanData', arr)
        //     }else{
        //         await sqlCrateTables.insertData('dapanData', 'dayTable', arr)
        //     }
        //     arr = null
        // }
        // console.log('准备写入数据库', data)
    }else if(extname == '.lzstr'){
        var dirname = path.basename(path.dirname(filePath))
        var dayKey = moment(dirname).format('YYYY-MM-DD')
        if(dayKey.split('-')[0] != year){
            //不是目标年份的数据，直接返回，不做任何操作
            return
        }
        var symbol = path.basename(filePath, '.lzstr')
        symbol = symbol.split('.')
        symbol = symbol[1] + symbol[0]
        // console.log('dirname:',  dirname, symbol)
        var arr = JSON.parse(LZString.decompress(fs.readFileSync(filePath, 'utf16le')))
        arr = arr.map((item)=>{
            return item.split(',').map((value, index)=>{
                if(index == 0){
                    return dayKey + ' ' + value
                }else{
                    if(value == ''){
                        value = 0
                    }
                    return Number(value)
                }
            })
        })
        var arrinsert = []
        for(var i = 0; i < arr.length; i ++){
            var row = arr[i]
            var obj = {}
            for(var key in OneMinDataKeyIndex){
                obj[key] = row[OneMinDataKeyIndex[key]]
            }
            arrinsert.push(obj)
            if(arrinsert.length == 200){
                // console.log('准备插入数据库', symbol, arrinsert.length)
                await sqlCrateTables.insertData(symbol, 'minTable', arrinsert)
                arrinsert = []
            }
        }
        if(arrinsert.length > 0){
            
            await sqlCrateTables.insertData(symbol, 'minTable', arrinsert)
            arrinsert = null
        }
        // console.log('数据', data)
    }
    curCount += 1 
    if(process.parentPort != null &&  process.parentPort.postMessage != null){
        process.parentPort.postMessage({progress: Number((curCount / totalCount * 100).toFixed(2))})
    }
}

async function startConvert(year){
    if(dataType != 'dapanData'){
        totalCount = 0
        // console.log('folderFormat != 空', folderFormat)
        //文件是放在按照日期分类的文件夹下的
        var startDate = moment(year + '-01-01')
        while(startDate.format('YYYY') == year){
            // console.log('min startDate', startDate.format(folderFormat)) 
            var dayFolder = folder + '/' + startDate.format(folderFormat)
            if(fs.existsSync(dayFolder) == true){
                // console.log('当前存在文件夹', dayFolder)
                var fileList = fs.readdirSync(dayFolder)
                fileList = fileList.filter((item)=>{
                    return item.indexOf('.') != 0
                })
                totalCount += fileList.length
            }
            startDate = startDate.add(1, 'day')
        }
        // console.log('min totalCount', totalCount)
        startDate = moment(year + '-01-01')
        while(startDate.format('YYYY') == year){
            // startDate = startDate.add(1, 'day')
            var dayFolder = folder + '/' + startDate.format(folderFormat)
            // console.log('开始遍历文件夹', dayFolder)
            if(fs.existsSync(dayFolder) == true){
                await loopFolder(dayFolder, dealFile)
            }
            startDate = startDate.add(1, 'day')
        }
    }else{
        // console.log('直接loop folder', folder)
        //文件没有分类，直接循环所有文件
        await loopFolder(folder, ()=>{
            totalCount += 1
        })
        await loopFolder(folder, dealFile)
    }
}


// console.log('fileDoHandle', fileDoHandle)
if(fs.existsSync(folder) == false){
    // console.log('folder 不存在', folder)
    if(process.parentPort != null &&  process.parentPort.postMessage != null){
        process.parentPort.postMessage({error: '导入的文件夹不存在' + folder})
    }
}else{
    if(fs.statSync(folder).isDirectory){
        await startConvert(year)
    }else{
        //是一个文件
        await dealFile(folder)
    }
    if(dataType == 'dapanData'){
        for(var key in symbolDit){
            var arr = symbolDit[key]
            if(arr.length > 0){
                if(needCheckRepeat == true){
                    await sqlCrateTables.insertDataWithCheck(key, 'dayTable', arr)
                }else{
                    await sqlCrateTables.insertData(key, 'dayTable', arr)
                }
                delete symbolDit[key]
            }
        }
    }

    if(process.parentPort != null &&  process.parentPort.postMessage != null){
        process.parentPort.postMessage({result: 'ok'})
    }
}



