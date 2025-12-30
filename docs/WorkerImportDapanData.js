// 大盘数据数据xlsx转换，一个表格包含所有股票代码
//由于数据量太大，按照年来转换
// 集合竞价的xlsx转换
// import xlsx from 'node-xlsx';
import fs from 'fs';
import Excel from 'exceljs';
import LZString from 'lz-string';
import moment from 'moment';
import path from 'path';
import * as YWRequest from './YWRequest.mjs'
// console.log('LZString', LZString.compress)
// default
// 压缩字符串
// const compressed = LZString.compress(JSON.stringify(yourData));
 
// 解压字符串
// var str = fs.readFileSync('/Volumes/WithCherry/localData/oneMinData/20240102/600000.SH.txt', 'utf16le')
// console.log('解压前的对象', str)
// console.log('解压后的对象', LZString.decompress(str))

var folder = '/Users/yaowei/Downloads/股市数据2'
var exportFolder = '/Users/yaowei/Documents/work/炒股工具打包/localData/dapanData'
var year = '2025'
var folderFormat = ""
var fileFormat = ""

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
    zhenfu_colIndex: 11,
    shiyinlv_colIndex: 14,
    zongshizhi_colIndex: 32,
    shijinlv_colIndex: 30,
    huansoulv_colIndex: 12,  //换手率

    encodeType: 'utf-16le',   // csv文件的编码类型 //东方财富导出的编码类型是'utf-16le'
    delimiter: '\t',        //  csv文件的分隔符。默认是,也可能是;或者\t
    quote: '"',          //单元格中包裹数据的quote
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

if(otherConfig.dataPathRoot){
    YWRequest.init(otherConfig.dataPathRoot)
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
    if(fileSymobol == null){
        return ''
    }
    var outputStr = ''
    if(format == '000000'){
        //是纯文本格式
        return fileSymobol//format.substr(0, format.length - fileSymobol.length) + '' + 
    }
    var xxIndex = format.indexOf('xx')
    var codeIndex = format.indexOf('000000')
    if(xxIndex == -1){
        //只返回codeIndex部分
        // console.log('fileSymobol', fileSymobol)
        return YWRequest.symbolFull(fileSymobol.substr(codeIndex, 6))
    }
    
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
    await workbook.csv.read(fs.createReadStream(filePath, otherConfig.encodeType), {  //
        parserOptions: {
            delimiter: otherConfig.delimiter,
            quote: otherConfig.quote,
        },
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
            if(value.trimStart != null){
                if(value[0] == '"'){
                    value.trimStart()
                }
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
                if(otherConfig.time_colIndex != 0){
                    rowDate = moment(sheetDatas[z][otherConfig.time_colIndex - 1]).format('YYYY-MM-DD')
                    // console.log(symbol + '第' + z + '行的date', rowDate)
                    if(rowDate == 'Invalid date'){
                        //表格中存在无效的时间
                        if(process.parentPort != null && process.parentPort.postMessage != null){
                            process.parentPort.postMessage({error: '表格中第' + otherConfig.time_colIndex + '列存在无效的日期'})
                        }
                    }
                }else{
                    //从文件名获取日期
                    rowDate = moment(path.basename(filePath, '.csv')).format('YYYY-MM-DD')
                    if(rowDate == 'Invalid date'){
                        //表格中存在无效的时间
                        if(process.parentPort != null && process.parentPort.postMessage != null){
                            process.parentPort.postMessage({error: '表格中第' + otherConfig.time_colIndex + '列存在无效的日期'})
                        }
                    }
                }
            }else{
                rowDate = date
            }
            if(dateSymbolDit[rowDate] == null){
                dateSymbolDit[rowDate] = []
            }

            // if(process.parentPort != null && process.parentPort.postMessage != null){
            //     process.parentPort.postMessage({error: sheetDatas[z][1]})
            // }

            // for(var k = 0; k < sheetDatas[z].length; k++){
            //     if(sheetDatas[z][k] == '0' || sheetDatas[z][k] == '0.0'){
            //         sheetDatas[z][k] = ''
            //     }
            //     if(sheetDatas[z][k].split == null){
            //         sheetDatas[z][k] += ""
            //     }
            //     if(sheetDatas[z][k].split('.')[1] == '0'){
            //         sheetDatas[z][k] = sheetDatas[z][k].split('.')[0]
            //     }
            // }
            // '日期': moment(sheetDatas[z][otherConfig.time_colIndex - 1]).format('YYYY-MM-DD'),
            var volume = sheetDatas[z][otherConfig.volume_colIndex - 1]
            var volumeAmount = sheetDatas[z][otherConfig.volumeAmount_colIndex - 1]
            if(volume != null && volume.indexOf != null){
                // eval(otherConfig.volume_customjs)
                if(volume.indexOf('万手') != -1){
                    volume = volume.replace('万手', '')
                    volume = Math.round(Number(volume) * 10000)
                }else if(volume.indexOf('手') != -1){
                    volume = volume.replace('手', '');
                    volume = Math.round(Number(volume) * 100)
                }
            }
            if(volumeAmount != null && volumeAmount.indexOf != null){
                // eval(otherConfig.volumeAmount_customjs)
                if(volumeAmount.indexOf('万') != -1){
                    volumeAmount = volumeAmount.replace('万', '');
                    volumeAmount = Math.round(Number(volumeAmount) * 10000)
                }else if(volumeAmount.indexOf('亿') != -1){
                    volumeAmount = volumeAmount.replace('亿', '');
                    volumeAmount = Math.round(Number(volumeAmount) * 100000000)
                }
            }
            let shiyinlv = null
            if(otherConfig.shiyinlv_colIndex != 0){
                shiyinlv = sheetDatas[z][otherConfig.shiyinlv_colIndex - 1]
                if(shiyinlv.indexOf != null){
                    if(shiyinlv.indexOf('亏损') != -1){
                        shiyinlv = -1   //-1代表亏损
                    }else{
                        let spaceIndex = shiyinlv.indexOf(' ')
                        if(spaceIndex != -1){
                            shiyinlv = shiyinlv.substring(0, spaceIndex)
                            shiyinlv = Number(shiyinlv)
                        }
                    }
                }
            }
            let zongshizhi = 0
            if(otherConfig.zongshizhi_colIndex != 0){
                zongshizhi = sheetDatas[z][otherConfig.zongshizhi_colIndex - 1]
                if(zongshizhi.indexOf != null){
                    if(zongshizhi.indexOf('亿元') != -1){
                        zongshizhi = zongshizhi.replace('亿元', '');
                        zongshizhi = Math.round(Number(zongshizhi) * 100000000)
                    }
                }
            }
            let huansoulv = 0
            if(otherConfig.huansoulv_colIndex != 0){
                huansoulv = sheetDatas[z][otherConfig.huansoulv_colIndex - 1]
                if(huansoulv != null && huansoulv.indexOf != null){
                    if(huansoulv.indexOf('%') != -1){
                        huansoulv = huansoulv.replace('%', '');
                        huansoulv = Number(huansoulv)
                    }
                }
            }
            var oneSymbolObj = {
                '代码': symbol, //sheetDatas[z][otherConfig.symbol_colIndex - 1],   //代码
                '开盘': Number(sheetDatas[z][otherConfig.open_colIndex - 1]),   //开盘
                '收盘': Number(sheetDatas[z][otherConfig.close_colIndex - 1]),  //收盘
                '最高': Number(sheetDatas[z][otherConfig.max_colIndex - 1]),    //最高
                '最低': Number(sheetDatas[z][otherConfig.min_colIndex - 1]),    //最低
                '市盈率': shiyinlv,  
                '总市值': zongshizhi,
                '市净率': Number(sheetDatas[z][otherConfig.shijinlv_colIndex - 1]),
                '换手率': huansoulv,
                '成交量': Number(volume), //成交量
                '成交额': Number(volumeAmount),   //成交额
            }
            
            dateSymbolDit[rowDate].push(oneSymbolObj)
        }
    }
    
    // console.log('dateSymbolDit', dateSymbolDit)
    // return
    //这个格式的xlsx文件里面只有一个股票的数据
    // console.log('oneDayDit', oneDayDit)
    for(var dateKey in dateSymbolDit){
        var saveDapanPath = exportFolder + '/' + dateKey
        var compressStr = JSON.stringify(dateSymbolDit[dateKey])
        if(otherConfig.compress == true){
            compressStr = LZString.compress(compressStr)
            fs.writeFileSync(saveDapanPath + '.lzstr', compressStr, 'utf16le')  //测试是保存为json看看数据是否正确
        }else{
            fs.writeFileSync(saveDapanPath + '.json', compressStr)  //测试是保存为json看看数据是否正确
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


