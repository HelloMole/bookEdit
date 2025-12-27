// 一分钟的分时数据xlsx转换
//由于数据量太大，按照年来转换
// 集合竞价的xlsx转换
// import xlsx from 'node-xlsx';
import fs from 'fs';
import Excel from 'exceljs';
import LZString from 'lz-string';
import moment from 'moment';
// console.log('LZString', LZString.compress)
// default
// 压缩字符串
// const compressed = LZString.compress(JSON.stringify(yourData));
 
// 解压字符串
// var str = fs.readFileSync('/Volumes/WithCherry/localData/oneMinData/20240102/600000.SH.txt', 'utf16le')
// console.log('解压前的对象', str)
// console.log('解压后的对象', LZString.decompress(str))

var folder = '/Users/liyaowei/WithCherry/集合竞价压缩'
var exportFolder = '/Users/liyaowei/WithCherry/localData/jiheJinjia'
var year = '2024'
var folderFormat = "YYYYMM"
var fileFormat = "YYYYMMDD[.csv]"

var otherConfig = {
    jumpTitleRow: 1,
    compress: false
}

const args = process.argv.slice(2); // 去掉前两个默认的元素：node和脚本路径

if(args[0] != null){
    otherConfig = JSON.parse(args[0])
    year = otherConfig.year
    folder = otherConfig.datafolder
    exportFolder = otherConfig.exportFolder
    folderFormat =  otherConfig.folderFormat
    fileFormat = otherConfig.fileFormat
}

// if(args[0] != null){
//     year = args[0]
// }
// if(args[1] != null){
//     folder = args[1]
// }
// if(args[2] != null){
//     exportFolder = args[2]
// }


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

var totalCount = 12 * 31
var curCount = 0
//开始转换月
async function startConvertOneMonth(month){
    // return
    // console.log('month', month)
    // var date = moment(year + '-' + month + '-' + '01')
    
    for(var i = 1; i <= 31; i++){
        var day = month + '' + (i < 10 ? '0' + i : i)
        
        var dayFilePath = folder + '/' + formatDateStr(day, folderFormat) + '/' + formatDateStr(day, fileFormat) // folder + '/' + day + "_1min"
        var saveDayDir = exportFolder + '/' + day 

        
        //这里是文件开始处理了
        if(fs.existsSync(dayFilePath) == true){
            var oneDayDit = {}
            // var maxSampleStrDit = {}
            
            const workbook = new Excel.Workbook();
            var rowIndex = null
            var sheetDatas = []
            await workbook.csv.read(fs.createReadStream(dayFilePath), {
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
            var keys = []
            for(var z = 0; z < sheetDatas.length; z++){
                if(z == 0){
                    keys = sheetDatas[z]
                    keys.splice(0, 2)
                    var keysFile = exportFolder + 'keys.json'
                    if(fs.existsSync(keysFile) == false){
                        fs.writeFileSync(keysFile, JSON.stringify(keys))
                    }
                    // console.log( "oneRow", sheetDatas[z])
                }else{
                    var symbol = sheetDatas[z][0]
                    // var obj = {}
                    // for(var k = 0; k < keys.length; k++){
                    //     var key = keys[k]
                    //     obj[key] = sheetDatas[z][k]
                    // }
                    sheetDatas[z].splice(0, 2)
                    
                    
                    for(var k = 0; k < sheetDatas[z].length; k++){
                        if(k == 0){
                            if(sheetDatas[z][k].substr == null){
                                sheetDatas[z][k] += ""
                                // console.log('sheetDatas[z][k].substr', sheetDatas[z][k])
                            }
                            sheetDatas[z][k] = sheetDatas[z][k].substr(0, 5)
                        }
                        if(sheetDatas[z][k] == '0' || sheetDatas[z][k] == '0.0'){
                            sheetDatas[z][k] = ''
                        }
                    }

                    //这里还要判断，最后一时刻的数据
                    //没有买1价，也没有成交量
                    if(sheetDatas[z][9] == '' && sheetDatas[z][8] == ''){
                        // 对错误数据做修复，没有开盘价，开盘价就是上一个收盘价
                        sheetDatas[z][4] = sheetDatas[z][3]
                    }

                    if(Number(sheetDatas[z][0]) >= 92500){
                        if(sheetDatas[z][8] == ''){
                            //超过这个数值只需要有效的数据，理论上92500之后只有一条数据有效
                            continue
                        }else{
                            //即使大于，也将时间设置为25整
                            sheetDatas[z][0] = '92500'
                        }
                    }
                    
                    // sheetDatas[z].splice(1,0,[maxSampleStrDit[symbol][maxSampleStr]])

                    // sheetDatas[z][0] = 1    //把时间也压缩看看能减少多少
                    if(oneDayDit[symbol] == null){
                        oneDayDit[symbol] = [sheetDatas[z].join(',')]
                        // oneDayDit[symbol] = [obj]
                    }else{
                        oneDayDit[symbol].push(sheetDatas[z].join(','))
                        // oneDayDit[symbol].push(obj)
                    }
                }
            }
            
            if(fs.existsSync(saveDayDir) == false){
                fs.mkdirSync(saveDayDir)
            }
            for(var symbol in oneDayDit){
                if(otherConfig.compress == true){
                    fs.writeFileSync(saveDayDir + '/' + symbol + '.lzstr',  LZString.compress(JSON.stringify(oneDayDit[symbol])), 'utf16le')
                }else{
                    fs.writeFileSync(saveDayDir + '/' + symbol + '.json',  JSON.stringify(oneDayDit[symbol]))
                }
            }
        }else{
            console.log('文件不存在', dayFilePath)
        }

        //这里是文件处理结束


        curCount += 1 
        if(process.parentPort != null &&  process.parentPort.postMessage != null){
            process.parentPort.postMessage({progress: Number((curCount / totalCount * 100).toFixed(2))})
        }
    }
}


async function startConvert(year){
    for(var i = 1; i <= 12; i++){
       var month = year + '' + (i < 10 ? '0' + i : i)
       await startConvertOneMonth(month)
        //break  //测试阶段暂时关闭循环每月
    }
    if(process.parentPort != null &&  process.parentPort.postMessage != null){
        process.parentPort.postMessage({result: 'ok'})
    }
}
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


