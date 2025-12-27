// 一分钟的分时数据xlsx转换
//由于数据量太大，按照年来转换
// 集合竞价的xlsx转换
// import xlsx from 'node-xlsx';
import fs from 'fs';
import Excel from 'exceljs';
import LZString from 'lz-string';
import moment from 'moment';
import path from 'path';
// console.log('LZString', LZString.compress)
// default
// 压缩字符串
// const compressed = LZString.compress(JSON.stringify(yourData));
 
// 解压字符串
// var str = fs.readFileSync('/Volumes/WithCherry/localData/oneMinData/20240102/600000.SH.txt', 'utf16le')
// console.log('解压前的对象', str)
// console.log('解压后的对象', LZString.decompress(str))

var folder = '/Users/liyaowei/WithCherry/一分钟数据压缩'
var exportFolder = '/Users/liyaowei/WithCherry/localData/oneMinData'
var year = '2024'
var folderFormat = "YYYYMMDD[_1min]"
var fileFormat = "xx000000"

//导入时的其它配置信息
var otherConfig = {
    jumpTitleRow: 1,
    time_colIndex: 1,
    symbol_colIndex: 2,
    open_colIndex: 4,
    close_colIndex: 5,
    max_colIndex: 6,
    min_colIndex: 7,
    volume_colIndex: 8,
    volumeAmount_colIndex: 9,
    upPre_colIndex: 10,
    zhenfu_colIndex: 11
}

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
    otherConfig = JSON.parse(args[0])
    year = otherConfig.year
    folder = otherConfig.datafolder
    exportFolder = otherConfig.exportFolder
    folderFormat =  otherConfig.folderFormat
    fileFormat = otherConfig.fileFormat
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

function formatDateStr(date, format){
    var folderFormatArr = []
    var startIndex = 0
    var index = format.indexOf('[', startIndex)
    if(index == -1){
        folderFormatArr.push(format)
    }
    var momentDate  = moment(date)
    while(index != -1){
        var endIndex = format.indexOf(']', startIndex)
        if(endIndex != -1){
            folderFormatArr.push(format.substring(startIndex, index))
            folderFormatArr.push(format.substring(index, endIndex + 1))
            startIndex = endIndex + 1
        }
        index = format.indexOf('[', startIndex)
        if(index == -1){
            var endStr = format.substring(endIndex + 1)
            if(endStr != ''){
                folderFormatArr.push(endStr)
            }
        }
        // console.log('当前的startIndex', startIndex)
    }
    var outputStr = ''
    for(var i = 0; i < folderFormatArr.length; i++){
        var str = folderFormatArr[i]
        if(str.indexOf('[') == 0){
            outputStr += str.substring(1, str.length - 1)
        }else{
            outputStr += momentDate.format(str)
        }
    }
    folderFormatArr = null
    momentDate = null
    return outputStr
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

//真正的执行文件内容的地方
async function fileDoHandle(filePath, date) {
    //一分钟的文件按天保存在以YYYYMMDD命名的文件夹下
    // console.log('当前处理文件', filePath)

    const workbook = new Excel.Workbook();
    var rowIndex = null
    var sheetDatas = []
    await workbook.csv.read(fs.createReadStream(filePath), {
        map: (value, index)=>{
            if(index == 0){
                //是新的一行了
                if(rowIndex == null){
                    rowIndex = 0
                }else{
                    rowIndex += 1
                }
            }else{
                
            }
            if(sheetDatas[rowIndex] == null){
                sheetDatas[rowIndex] = []
            }
            sheetDatas[rowIndex].push(value)
        }
    })


    // console.log(filePath, sheetDatas.length)
    // var keys = []
    // var oneDayDit = {}
    
    // var maxSampleStrDit = {}
    var dateSymbolDit = {}  //第一层是日期，第二层是股票代码
    // if(date != null){
    //     dateSymbolDit[date] = {}
    // }

    for(var z = 0; z < sheetDatas.length; z++){
        if(z <= otherConfig.jumpTitleRow - 1){
            //这里已经不需要表格的keys了，文件的格式应该是统一的
            // keys = sheetDatas[z]
            // keys.splice(0, 3)
            // var keysFile = exportFolder + '/' + 'keys.json'
            // if(fs.existsSync(keysFile) == false){
            //     fs.writeFileSync(keysFile, JSON.stringify(keys))
            // }
        }else{
            //使用更灵活的方式格式化symbol
            var symbol = null
            if(otherConfig.symbol_colIndex != 0){
                //使用表格中的代码
                symbol = symbolFormat(sheetDatas[z][otherConfig.symbol_colIndex - 1], fileFormat)
            }else{
                //使用文件名称作为代码
                symbol = symbolFormat(path.basename(filePath, '.csv'), fileFormat) 
            }
            // symbol = //symbol.substr(2) + '.' + symbol.substr(0, 2).toUpperCase()
            // 不直接使用表格的值了，改为从中取值
            // sheetDatas[z].splice(0, 3)  //删除不需要的数据【时间，股票代码，股票名称】
            var rowDate = null
            if(date == null){
                //如果没有传入date，从表格中查询日期
                if(otherConfig.timeFormat != null){
                    rowDate = moment(sheetDatas[z][otherConfig.time_colIndex - 1], otherConfig.timeFormat).format('YYYYMMDD')
                }else{
                    rowDate = moment(sheetDatas[z][otherConfig.time_colIndex - 1]).format('YYYYMMDD')
                }
                
                // console.log(symbol + '第' + z + '行的date', rowDate)
                if(rowDate == 'Invalid date'){
                    //表格中存在无效的时间
                    if(process.parentPort != null &&  process.parentPort.postMessage != null){
                        process.parentPort.postMessage({error: '表格中第' + otherConfig.time_colIndex + '列存在无效的时间戳(日期)'})
                    }
                }
            }else{
                rowDate = date
            }
            if(dateSymbolDit[rowDate] == null){
                dateSymbolDit[rowDate] = {}
            }

            for(var k = 0; k < sheetDatas[z].length; k++){
                if(sheetDatas[z][k] == '0' || sheetDatas[z][k] == '0.0'){
                    sheetDatas[z][k] = ''
                }
                if(sheetDatas[z][k].split == null){
                    sheetDatas[z][k] += ""
                }
                if(sheetDatas[z][k].split('.')[1] == '0'){
                    sheetDatas[z][k] = sheetDatas[z][k].split('.')[0]
                }
            }

            var rowtime = null
            if(otherConfig.timeFormat != null){
                rowtime = moment(sheetDatas[z][otherConfig.time_colIndex - 1], otherConfig.timeFormat).format('HH:mm')
            }else{
                rowtime = moment(sheetDatas[z][otherConfig.time_colIndex - 1]).format('HH:mm')
            }

            var arr = [
                rowtime,   //时间
                sheetDatas[z][otherConfig.open_colIndex - 1],   //开盘
                sheetDatas[z][otherConfig.close_colIndex - 1],  //收盘
                sheetDatas[z][otherConfig.max_colIndex - 1],    //最高
                sheetDatas[z][otherConfig.min_colIndex - 1],    //最低
                sheetDatas[z][otherConfig.volume_colIndex - 1], //成交量
                sheetDatas[z][otherConfig.volumeAmount_colIndex - 1],   //成交额
                sheetDatas[z][otherConfig.upPre_colIndex - 1],  //涨幅
                sheetDatas[z][otherConfig.zhenfu_colIndex - 1], //振幅
            ]
            //还要根据时间排序
            if(arr[0] == 'Invalid date'){
                //表格中存在无效的时间
                if(process.parentPort != null &&  process.parentPort.postMessage != null){
                    process.parentPort.postMessage({error: '表格中第' + otherConfig.time_colIndex + '列存在无效的时间戳(日期)'})
                }
            }

            if(dateSymbolDit[rowDate][symbol] == null){
                dateSymbolDit[rowDate][symbol] = [arr.join(',')]
            }else{
                dateSymbolDit[rowDate][symbol].push(arr.join(','))
            }
        }
    }
    
    // console.log('dateSymbolDit', dateSymbolDit)
    //这个格式的xlsx文件里面只有一个股票的数据
    // console.log('oneDayDit', oneDayDit)
    for(var dateKey in dateSymbolDit){
        var saveDayDir = exportFolder + '/' + dateKey
        if(fs.existsSync(saveDayDir) == false){
            fs.mkdirSync(saveDayDir)
        }
        for(var symbolKey in dateSymbolDit[dateKey]){
            //在保存文件之前还要进行按照时间排序，某些数据源表格中的数据没有排序
            // dateSymbolDit[dateKey][symbolKey].sort((a, b)=>{
            //     return moment(dateKey + ' ' + a.split(',')[0], 'YYYYMMDD HH:mm').diff(moment(dateKey + ' ' + b.split(',')[0], 'YYYYMMDD HH:mm'), 'minutes')
            // })
            var timeArr = dateSymbolDit[dateKey][symbolKey]
            timeArr.sort((a, b)=>{
                var timeA = moment('20250808' + ' ' + a.split(',')[0], 'YYYYMMDD HH:mm')
                var timeB = moment('20250808' + ' ' + b.split(',')[0], 'YYYYMMDD HH:mm')
                return timeA.diff(timeB, 'minutes')
            })
            var compressStr = JSON.stringify(timeArr)
            if(otherConfig.compress == true){
                compressStr = LZString.compress(compressStr)
                //如果有json数据的文件，先删除
                if(fs.existsSync(saveDayDir + '/' + symbolKey + '.json')){
                    fs.unlinkSync(saveDayDir + '/' + symbolKey + '.json')
                }
                fs.writeFileSync(saveDayDir + '/' + symbolKey + '.lzstr', compressStr, 'utf16le')  //测试是保存为json看看数据是否正确
            }else{
                //如果有lzstr数据的文件，先删除
                if(fs.existsSync(saveDayDir + '/' + symbolKey + '.lzstr')){
                    fs.unlinkSync(saveDayDir + '/' + symbolKey + '.lzstr')
                }
                fs.writeFileSync(saveDayDir + '/' + symbolKey + '.json', compressStr)  //测试是保存为json看看数据是否正确
            }
        }
    }
}


//开始转换月
async function startConvertOneMonth(month){
    // return
    // console.log('month', month)
    // var date = moment(year + '-' + month + '-' + '01')
    
    for(var i = 1; i <= 31; i++){
        var date = month + '' + (i < 10 ? '0' + i : i)
        
        var dayFolder = folder + '/' + formatDateStr(date, folderFormat) // folder + '/' + day + "_1min"

        if(fs.existsSync(dayFolder) == true){
        //    console.log("当前处理 dayFolder", dayFolder)
           var fileList = fs.readdirSync(dayFolder)
            //console.log('fileList', fileList)
           for(var j = 0; j < fileList.length; j++){
            var fileName = fileList[j]
            var dayFilePath = dayFolder + '/' + fileName
            if(fileName.indexOf('.') == 0){
                // console.log('删除隐藏fileName', fileName)
                // fs.unlinkSync(dayFilePath)
            }else{
                //开始处理文件
                await fileDoHandle(dayFilePath, date)
                // break   //测试阶段暂时关闭循环每个文件
            }
           }
        //    break    //测试阶段暂时关闭循环每天
        }else{
            // console.log(" dayFolder不存在", dayFolder)
        }
        curCount += 1 
        if(process.parentPort != null &&  process.parentPort.postMessage != null){
            process.parentPort.postMessage({progress: Number((curCount / totalCount * 100).toFixed(2))})
        }
    }
}


async function startConvert(year){
    if(folderFormat != ''){
        totalCount = 12 * 31
        // console.log('folderFormat != 空', folderFormat)
        //文件是放在按照日期分类的文件夹下的
        for(var i = 1; i <= 12; i++){
            var month = year + '' + (i < 10 ? '0' + i : i)
            await startConvertOneMonth(month)
            //break  //测试阶段暂时关闭循环每月
        }
    }else{
        // console.log('直接loop folder', folder)
        //文件没有分类，直接循环所有文件
        loopFolder(folder, ()=>{
            totalCount += 1
        })
        await loopFolder(folder, async (filePath)=>{
            var extname = path.extname(filePath)
            // console.log('当前处理额', filePath, extname)
            // var name = path.basename(filePath, extname)
            if(extname == '.csv'){
                //只处理csv文件
                await fileDoHandle(filePath, null)
                curCount += 1 
                if(process.parentPort != null &&  process.parentPort.postMessage != null){
                    process.parentPort.postMessage({progress: Number((curCount / totalCount * 100).toFixed(2))})
                }
            }
        })
    }
    
    if(process.parentPort != null &&  process.parentPort.postMessage != null){
        process.parentPort.postMessage({result: 'ok'})
    }
}

// console.log('fileDoHandle', fileDoHandle)

// startConvert(year)
if(fs.existsSync(folder) == false){
    // console.log('folder 不存在', folder)
    if(process.parentPort != null &&  process.parentPort.postMessage != null){
        process.parentPort.postMessage({error: '导入的文件夹不存在' + folder})
    }
}else{

    startConvert(year)
    // console.log(folder)
}


